// Dados dos serviços
const services = [
    { id: '1', name: 'Corte de Cabelo', duration: 30, price: 25 },
    { id: '2', name: 'Corte + Barba', duration: 45, price: 35 },
    { id: '3', name: 'Manicure', duration: 60, price: 20 },
    { id: '4', name: 'Pedicure', duration: 60, price: 25 },
    { id: '5', name: 'Escova', duration: 45, price: 30 },
    { id: '6', name: 'Coloração', duration: 120, price: 80 },
    { id: '7', name: 'Massagem', duration: 60, price: 50 },
];

// Horários disponíveis
const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

// Estado da aplicação
let currentDate = new Date();
let selectedDate = new Date();
let appointments = [];

// Dados de exemplo
const sampleAppointments = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        service: 'Corte de Cabelo',
        client: 'João Silva',
        phone: '(11) 99999-9999',
        status: 'confirmed',
        notes: 'Cliente prefere corte baixo'
    },
    {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        service: 'Manicure',
        client: 'Maria Santos',
        phone: '(11) 88888-8888',
        status: 'pending',
    },
    {
        id: '3',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '14:00',
        service: 'Corte + Barba',
        client: 'Pedro Costa',
        phone: '(11) 77777-7777',
        status: 'confirmed',
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    initializeCalendar();
    initializeForm();
    updateStats();
});

// Carregar agendamentos do localStorage
function loadAppointments() {
    const saved = localStorage.getItem('appointments');
    if (saved) {
        appointments = JSON.parse(saved);
    } else {
        appointments = sampleAppointments;
        saveAppointments();
    }
}

// Salvar agendamentos no localStorage
function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Inicializar calendário
function initializeCalendar() {
    updateCalendar();
    updateSelectedDate();
    
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
}

// Atualizar calendário
function updateCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    document.getElementById('currentMonth').textContent = 
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Cabeçalho dos dias
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Primeiro dia do mês
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Gerar dias
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        // Classes condicionais
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(date)) {
            dayElement.classList.add('today');
        }
        
        if (isSameDate(date, selectedDate)) {
            dayElement.classList.add('selected');
        }
        
        if (hasAppointmentsOnDate(date)) {
            dayElement.classList.add('has-appointments');
        }
        
        dayElement.addEventListener('click', () => {
            selectedDate = new Date(date);
            updateCalendar();
            updateSelectedDate();
        });
        
        calendar.appendChild(dayElement);
    }
}

// Verificar se é hoje
function isToday(date) {
    const today = new Date();
    return isSameDate(date, today);
}

// Verificar se duas datas são iguais
function isSameDate(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

// Verificar se há agendamentos na data
function hasAppointmentsOnDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.some(apt => apt.date === dateStr);
}

// Atualizar data selecionada
function updateSelectedDate() {
    const options = { 
        day: 'numeric', 
        month: 'long',
        weekday: 'long'
    };
    
    document.getElementById('selectedDateTitle').textContent = 
        selectedDate.toLocaleDateString('pt-BR', options);
    
    displayAppointments();
}

// Exibir agendamentos do dia
function displayAppointments() {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayAppointments = appointments.filter(apt => apt.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time));
    
    const container = document.getElementById('appointmentsList');
    
    if (dayAppointments.length === 0) {
        container.innerHTML = '<p class="no-appointments">Nenhum agendamento para este dia</p>';
        return;
    }
    
    container.innerHTML = dayAppointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-header">
                <div class="appointment-time">
                    <i class="fas fa-clock"></i>
                    ${apt.time}
                </div>
                <span class="appointment-status status-${apt.status}">
                    ${getStatusText(apt.status)}
                </span>
            </div>
            <div class="appointment-details">
                <div class="appointment-service">${apt.service}</div>
                <div class="appointment-client">
                    <i class="fas fa-user"></i>
                    ${apt.client}
                </div>
                ${apt.phone ? `
                    <div class="appointment-phone">
                        <i class="fas fa-phone"></i>
                        ${apt.phone}
                    </div>
                ` : ''}
                ${apt.notes ? `
                    <div class="appointment-notes">${apt.notes}</div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'confirmed': 'Confirmado',
        'pending': 'Pendente',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Inicializar formulário
function initializeForm() {
    // Popular select de horários
    const timeSelect = document.getElementById('time');
    timeSlots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    // Popular select de serviços
    const serviceSelect = document.getElementById('service');
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = `${service.name} - R$ ${service.price} (${service.duration}min)`;
        serviceSelect.appendChild(option);
    });
    
    // Event listeners
    document.getElementById('addAppointmentBtn').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelForm').addEventListener('click', closeModal);
    document.getElementById('appointmentForm').addEventListener('submit', handleFormSubmit);
    
    // Fechar modal clicando fora
    document.getElementById('appointmentModal').addEventListener('click', (e) => {
        if (e.target.id === 'appointmentModal') {
            closeModal();
        }
    });
}

// Abrir modal
function openModal() {
    document.getElementById('selectedDateDisplay').textContent = 
        selectedDate.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    
    document.getElementById('appointmentModal').classList.add('show');
}

// Fechar modal
function closeModal() {
    document.getElementById('appointmentModal').classList.remove('show');
    document.getElementById('appointmentForm').reset();
}

// Manipular envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointment = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        time: document.getElementById('time').value,
        service: document.getElementById('service').value,
        client: document.getElementById('client').value,
        phone: document.getElementById('phone').value || undefined,
        email: document.getElementById('email').value || undefined,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value || undefined
    };
    
    appointments.push(appointment);
    saveAppointments();
    updateCalendar();
    updateSelectedDate();
    updateStats();
    closeModal();
    
    // Feedback visual
    showNotification('Agendamento criado com sucesso!');
}

// Atualizar estatísticas
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    
    document.getElementById('todayCount').textContent = todayAppointments.length;
    document.getElementById('confirmedCount').textContent = confirmedAppointments.length;
    document.getElementById('pendingCount').textContent = pendingAppointments.length;
    document.getElementById('totalCount').textContent = appointments.length;
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}
