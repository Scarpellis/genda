document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const usersList = document.getElementById('usersList');
  const loginMessageEl = document.getElementById('loginMessage');
  const registerMessageEl = document.getElementById('registerMessage');
  const tipoSelect = document.getElementById('tipoUsuario');
  const infoDiv = document.getElementById('infoTipo');

  const API_BASE_URL =
    document.querySelector('meta[data-base-url]')?.getAttribute('data-base-url') ||
    window.location.origin;

  // Atualiza a mensagem do tipo de usuário
  if (tipoSelect && infoDiv) {
    const updateInfo = () => {
      if (tipoSelect.value === 'prestador') {
        infoDiv.textContent = 'Você está entrando como Prestador de Serviço.';
      } else {
        infoDiv.textContent = 'Você está entrando como Contratante.';
      }
    };
    tipoSelect.addEventListener('change', updateInfo);
    updateInfo();
  }

  // Evento de login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('senha') 
        ? document.getElementById('senha').value 
        : document.getElementById('password').value;

      try {
        const res = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          showMessage(loginMessageEl, data.error || 'Falha no login', true);
          return;
        }

        localStorage.setItem('token', data.token);
        showMessage(loginMessageEl, data.message || 'Login realizado com sucesso!');
        await loadUsers();
      } catch (err) {
        console.error('Erro na requisição de login:', err);
        showMessage(loginMessageEl, 'Erro de conexão com o servidor (login)', true);
      }
    });
  }

  // Evento de registro
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value
      };
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        const data = await res.json();
        if (!res.ok) {
          const msg =
            data.error ||
            (data.errors && data.errors[0] && data.errors[0].msg) ||
            'Erro no cadastro';
          showMessage(registerMessageEl, msg, true);
          return;
        }
        showMessage(registerMessageEl, data.message || 'Usuário cadastrado com sucesso!');
        registerForm.reset();
      } catch (err) {
        console.error('Erro na requisição de cadastro:', err);
        showMessage(registerMessageEl, 'Erro de conexão com o servidor (cadastro)', true);
      }
    });
  }

  // Carrega usuários
  async function loadUsers() {
    if (!usersList) return;
    const token = localStorage.getItem('token');
    if (!token) {
      usersList.innerHTML = '';
      redirectToLogin();
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.status === 401) {
        usersList.innerHTML = `<p>${data.error || 'Não autorizado'}</p>`;
        localStorage.removeItem('token');
        redirectToLogin();
        return;
      }
      if (!res.ok) {
        usersList.innerHTML = `<p>${data.error || 'Erro ao carregar usuários'}</p>`;
        return;
      }
      if (!Array.isArray(data) || data.length === 0) {
        usersList.innerHTML = '<p>Nenhum usuário cadastrado</p>';
        return;
      }
      const ul = document.createElement('ul');
      data.forEach((u) => {
        const li = document.createElement('li');
        li.textContent = `${u.name} - ${u.email} - ${u.phone}`;
        ul.appendChild(li);
      });
      usersList.innerHTML = '';
      usersList.appendChild(ul);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      usersList.innerHTML = '<p>Erro de conexão com o servidor (listagem)</p>';
    }
  }

  // Função para mostrar mensagens
  function showMessage(element, msg, isError = false) {
    if (!element) return;
    element.textContent = msg;
    element.className = isError ? 'error' : 'success';
  }

  function redirectToLogin() {
    const path = window.location.pathname;
    if (!path.endsWith('index.html') && path !== '/') {
      window.location.href = './index.html';
    }
  }

  loadUsers();
});
