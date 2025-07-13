// Variables globales
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedService = null;
let serviceDuration = null;

// Horarios disponibles extendidos
const availableSlots = {
    '2025-07-14': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-15': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-16': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-17': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-18': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-21': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-22': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-23': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-24': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-25': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-28': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-29': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-30': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-07-31': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-01': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-04': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-05': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-06': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-07': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '2025-08-08': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
};

// Horarios ocupados
const occupiedSlots = {
    '2025-07-14': ['11:00', '16:00'],
    '2025-07-15': ['15:00'],
    '2025-07-16': ['09:00', '14:00']
};

// Inicializar calendario
function initCalendar() {
    updateCalendar();
}

// Actualizar calendario con diseño moderno
function updateCalendar() {
    const monthYear = document.getElementById('monthYear');
    const currentYear = document.getElementById('currentYear');
    const calendarDays = document.getElementById('calendarDays');
    
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    monthYear.textContent = months[currentDate.getMonth()];
    if (currentYear) {
        currentYear.textContent = currentDate.getFullYear();
    }
    
    // Limpiar días del calendario
    calendarDays.innerHTML = '';
    
    // Configurar el primer día del mes (lunes = 0)
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Ajustar el primer día para que lunes sea 0
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Convertir domingo (0) a 6, y el resto -1
    
    // Días vacíos al inicio
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Crear estructura interna del día
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        const dayInfo = document.createElement('div');
        dayInfo.className = 'day-info';
        
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const today = new Date();
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // Marcar día de hoy
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Marcar días disponibles
        if (availableSlots[dateStr] && dayDate >= today) {
            dayElement.classList.add('available');
            
            // Calcular horarios disponibles
            const totalSlots = availableSlots[dateStr].length;
            const occupiedCount = occupiedSlots[dateStr] ? occupiedSlots[dateStr].length : 0;
            const availableCount = totalSlots - occupiedCount;
            
            dayInfo.textContent = `${availableCount} opciones`;
            dayElement.onclick = () => selectDate(dateStr, day);
        } else if (dayDate < today) {
            dayElement.classList.add('disabled');
        }
        
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayInfo);
        calendarDays.appendChild(dayElement);
    }
}

// Cambiar mes
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendar();
    
    // Limpiar selección si cambia el mes
    if (selectedDate) {
        const selectedMonth = new Date(selectedDate).getMonth();
        const selectedYear = new Date(selectedDate).getFullYear();
        
        if (selectedMonth !== currentDate.getMonth() || selectedYear !== currentDate.getFullYear()) {
            selectedDate = null;
            selectedTime = null;
            updateTimeSlots(null);
            updateBookingSummary();
            updateSubmitButton();
            document.getElementById('selectedDate').textContent = 'Selecciona una fecha';
        }
    }
}

// Cambiar año
function changeYear(direction) {
    currentDate.setFullYear(currentDate.getFullYear() + direction);
    updateCalendar();
}

// Seleccionar fecha
function selectDate(dateStr, day) {
    // Remover selección anterior
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Seleccionar nueva fecha
    event.target.closest('.calendar-day').classList.add('selected');
    selectedDate = dateStr;
    selectedTime = null; // Limpiar tiempo seleccionado
    
    // Actualizar horarios
    updateTimeSlots(dateStr);
    
    // Actualizar fecha seleccionada
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date(dateStr);
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    document.getElementById('selectedDate').textContent = 
        `${weekdays[date.getDay()]}, ${day} de ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    updateBookingSummary();
    updateSubmitButton();
}

// Actualizar horarios disponibles
function updateTimeSlots(dateStr) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    if (!dateStr || !availableSlots[dateStr]) {
        timeSlotsContainer.innerHTML = '<div class="no-selection">No hay horarios disponibles para esta fecha</div>';
        return;
    }
    
    availableSlots[dateStr].forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        // Verificar si está ocupado
        if (occupiedSlots[dateStr] && occupiedSlots[dateStr].includes(time)) {
            timeSlot.classList.add('occupied');
            timeSlot.innerHTML = `<span>${time}</span><small>Ocupado</small>`;
        } else {
            timeSlot.onclick = () => selectTime(time, timeSlot);
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

// Seleccionar horario
function selectTime(time, element) {
    // Remover selección anterior
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Seleccionar nuevo horario
    element.classList.add('selected');
    selectedTime = time;
    
    updateBookingSummary();
    updateSubmitButton();
}

// Seleccionar servicio
function selectService(service, duration) {
    // Remover selección anterior
    document.querySelectorAll('.service-option.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Seleccionar nuevo servicio
    event.target.classList.add('selected');
    selectedService = service;
    serviceDuration = duration;
    
    updateBookingSummary();
    updateSubmitButton();
}

// Actualizar resumen de reserva
function updateBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    
    if (selectedService && selectedDate && selectedTime) {
        summary.style.display = 'block';
        
        const serviceNames = {
            'express': 'Consulta Express',
            'estrategica': 'Consulta Estratégica',
            'premium': 'Consulta Premium'
        };
        
        document.getElementById('summaryService').textContent = serviceNames[selectedService];
        document.getElementById('summaryDate').textContent = document.getElementById('selectedDate').textContent;
        document.getElementById('summaryTime').textContent = selectedTime;
        document.getElementById('summaryDuration').textContent = `${serviceDuration} minutos`;
    } else {
        summary.style.display = 'none';
    }
}

// Actualizar botón de envío
function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = !(selectedService && selectedDate && selectedTime);
}

// Manejar envío del formulario
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aquí puedes agregar la lógica para enviar los datos
    alert('¡Reserva confirmada! Te contactaremos pronto para confirmar los detalles.');
    
    // Resetear formulario
    this.reset();
    selectedDate = null;
    selectedTime = null;
    selectedService = null;
    serviceDuration = null;
    
    // Limpiar selecciones
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    document.getElementById('bookingSummary').style.display = 'none';
    document.getElementById('selectedDate').textContent = 'Selecciona una fecha';
    document.getElementById('timeSlots').innerHTML = '<div class="no-selection">Selecciona una fecha para ver los horarios disponibles</div>';
    
    updateSubmitButton();
});

// Función para toggle del menú móvil
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});