// Frontend interactions for login, registration and user listing

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const usersList = document.getElementById('usersList');
  const loginMessageEl = document.getElementById('loginMessage');
  const registerMessageEl = document.getElementById('registerMessage');
  const tipoSelect = document.getElementById('tipoUsuario');
  const infoDiv = document.getElementById('infoTipo');

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

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('senha') ? document.getElementById('senha').value : document.getElementById('password').value;
      try {
      const res = await fetch('http://localhost:3000/login', {
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
        showMessage(loginMessageEl, 'Login realizado com sucesso!');
        await loadUsers();
      } catch (err) {
        showMessage(loginMessageEl, 'Erro de conexão', true);
      }
    });
  }

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
        const res = await fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = data.error || (data.errors && data.errors[0] && data.errors[0].msg) || 'Erro no cadastro';
          showMessage(registerMessageEl, msg, true);
          return;
        }
        showMessage(registerMessageEl, 'Usuário cadastrado com sucesso!');
        registerForm.reset();
      } catch (err) {
        showMessage(registerMessageEl, 'Erro de conexão', true);
      }
    });
  }

  async function loadUsers() {
    if (!usersList) return;
    const token = localStorage.getItem('token');
    if (!token) {
      usersList.innerHTML = '';
      return;
    }
    try {
      const res = await fetch('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
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
      usersList.innerHTML = '<p>Erro de conexão</p>';
    }
  }

  function showMessage(element, msg, isError = false) {
    if (!element) return;
    element.textContent = msg;
    element.className = isError ? 'error' : 'success';
  }

  loadUsers();
});
