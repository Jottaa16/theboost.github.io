
        // Variables globales
        let currentDate = new Date();
        let selectedDate = null;
        let selectedTime = null;
        let selectedService = null;
        let serviceDuration = null;

        // Horarios disponibles (ejemplo)
        const availableSlots = {
            '2025-07-14': ['09:00', '10:30', '14:00', '15:30', '17:00'],
            '2025-07-15': ['09:00', '11:00', '14:00', '16:00'],
            '2025-07-16': ['10:00', '11:30', '15:00', '16:30'],
            '2025-07-17': ['09:30', '11:00', '14:30', '16:00'],
            '2025-07-18': ['09:00', '10:30', '15:00', '17:00'],
            '2025-07-21': ['09:00', '10:30', '14:00', '15:30', '17:00'],
            '2025-07-22': ['09:00', '11:00', '14:00', '16:00'],
            '2025-07-23': ['10:00', '11:30', '15:00', '16:30'],
            '2025-07-24': ['09:30', '11:00', '14:30', '16:00'],
            '2025-07-25': ['09:00', '10:30', '15:00', '17:00']
        };

        // Horarios ocupados (ejemplo)
        const occupiedSlots = {
            '2025-07-14': ['11:00', '16:00'],
            '2025-07-15': ['15:00'],
            '2025-07-16': ['09:00', '14:00']
        };

        // Inicializar calendario
        function initCalendar() {
            updateCalendar();
        }

        // Actualizar calendario
        function updateCalendar() {
            const monthYear = document.getElementById('monthYear');
            const calendarDays = document.getElementById('calendarDays');
            
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            
            monthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            
            // Limpiar días del calendario
            calendarDays.innerHTML = '';
            
            // Primer día del mes
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            // Días vacíos al inicio
            for (let i = 0; i < firstDay.getDay(); i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day disabled';
                calendarDays.appendChild(emptyDay);
            }
            
            // Días del mes
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
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
                    dayElement.onclick = () => selectDate(dateStr, day);
                } else if (dayDate < today) {
                    dayElement.classList.add('disabled');
                }
                
                calendarDays.appendChild(dayElement);
            }
        }

        // Cambiar mes
        function changeMonth(direction) {
            currentDate.setMonth(currentDate.getMonth() + direction);
            updateCalendar();
        }

        // Seleccionar fecha
        function selectDate(dateStr, day) {
            // Remover selección anterior
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Seleccionar nueva fecha
            event.target.classList.add('selected');
            selectedDate = dateStr;
            
            // Actualizar horarios
            updateTimeSlots(dateStr);
            
            // Actualizar fecha seleccionada
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const date = new Date(dateStr);
            document.getElementById('selectedDate').textContent = 
                `${day} de ${months[date.getMonth()]} ${date.getFullYear()}`;
        }

        // Actualizar horarios disponibles
        function updateTimeSlots(dateStr) {
            const timeSlotsContainer = document.getElementById('timeSlots');
            timeSlotsContainer.innerHTML = '';
            
            if (!availableSlots[dateStr]) {
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
                    timeSlot.textContent += ' (Ocupado)';
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