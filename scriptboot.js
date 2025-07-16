// Variables del chatbot
        let chatOpen = false;
        let messageCount = 0;
        
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatTrigger = document.getElementById('chatTrigger');
        const chatIcon = document.getElementById('chatIcon');
        const notificationBadge = document.getElementById('notificationBadge');

// Respuestas predefinidas del bot
const botResponses = {
    'hola': '¡Hola! Es un placer conocerte. ¿Cómo puedo ayudarte hoy?',
    'que puedes hacer': 'Puedo ayudarte con información general, responder preguntas, brindar asistencia técnica básica, y mantener una conversación amigable. ¿Hay algo específico en lo que te gustaría que te ayude?',
    'ayuda': 'Estoy aquí para ayudarte. Puedes preguntarme sobre diversos temas, solicitar información, o simplemente charlar. ¿En qué te puedo asistir?',
    'contacto': 'Para contacto directo, puedes escribir a: soporte@empresa.com o llamar al +54 11 1234-5678. ¿Hay algo más en lo que pueda ayudarte?',
    'adios': '¡Hasta luego! Fue un placer ayudarte. ¡Que tengas un excelente día!',
    'gracias': '¡De nada! Siempre es un placer ayudar. ¿Hay algo más en lo que pueda asistirte?',
    'horario': 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 hs. Los fines de semana estamos disponibles de 10:00 a 16:00 hs.',
    'precio': 'Los precios varían según el servicio. ¿Podrías especificar qué producto o servicio te interesa para darte información más precisa?',
    'argentina': '¡Excelente! Veo que estás en Argentina. ¿Hay algo específico sobre nuestros servicios en el país que te gustaría saber?',
};

// Función para alternar el chat
        function toggleChat() {
            chatOpen = !chatOpen;
            
            if (chatOpen) {
                chatbotWindow.classList.add('active');
                chatIcon.textContent = '×';
                messageInput.focus();
                hideNotification();
            } else {
                chatbotWindow.classList.remove('active');
                chatIcon.textContent = '💬';
            }
        }
// Función para enviar mensaje
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    // Deshabilitar input durante el envío
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    messageInput.value = '';
    
    // Simular que el bot está escribiendo
    showTyping();
    
    // Generar respuesta del bot después de un retraso
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        hideTyping();
        addMessage(botResponse, 'bot');
        
        // Rehabilitar input
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }, 1000 + Math.random() * 1000); // Retraso aleatorio entre 1-2 segundos
}

// Función para agregar mensaje al chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message;
    
    if (sender === 'bot') {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
    } else {
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(avatar);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar notificación si el chat está cerrado
                if (!chatOpen) {
                    showNotification();
                }

// Función para obtener respuesta del bot
function getBotResponse(message) {
    const normalizedMessage = message.toLowerCase()
        .replace(/[¿?¡!]/g, '')
        .trim();
    
    // Buscar respuesta exacta
    if (botResponses[normalizedMessage]) {
        return botResponses[normalizedMessage];
    }
    
    // Buscar respuesta parcial
    for (const key in botResponses) {
        if (normalizedMessage.includes(key)) {
            return botResponses[key];
        }
    }
    
    // Respuesta por defecto
    return botResponses.default;
}

// Función para mostrar indicador de escritura
function showTyping() {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para ocultar indicador de escritura
function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Función para manejar Enter
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Función para acciones rápidas
function sendQuickMessage(message) {
    messageInput.value = message;
    sendMessage();
}

// Función para agregar nuevas respuestas dinámicamente
function addBotResponse(trigger, response) {
    botResponses[trigger.toLowerCase()] = response;
}

// Función para obtener el historial de conversación
function getChatHistory() {
    const messages = chatMessages.querySelectorAll('.message');
    const history = [];
    
    messages.forEach(message => {
        const isBot = message.classList.contains('bot');
        const text = message.querySelector('.message-bubble').textContent;
        history.push({
            sender: isBot ? 'bot' : 'user',
            message: text,
            timestamp: new Date().toISOString()
        });
    });
    
    return history;
}

// Función para limpiar el chat
function clearChat() {
    chatMessages.innerHTML = `
        <div class="message bot">
            <div class="avatar">🤖</div>
            <div class="message-bubble">
                ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                <div class="quick-actions">
                    <div class="quick-action" onclick="sendQuickMessage('¿Qué puedes hacer?')">¿Qué puedes hacer?</div>
                    <div class="quick-action" onclick="sendQuickMessage('Ayuda')">Ayuda</div>
                    <div class="quick-action" onclick="sendQuickMessage('Contacto')">Contacto</div>
                </div>
            </div>
        </div>
    `;
}

// Función para configurar el chatbot
function configureChatbot(config) {
    if (config.title) {
        document.querySelector('.chatbot-header h2').textContent = config.title;
    }
    
    if (config.welcomeMessage) {
        document.querySelector('.message.bot .message-bubble').textContent = config.welcomeMessage;
    }
    
    if (config.responses) {
        Object.assign(botResponses, config.responses);
    }
    
    if (config.theme) {
        document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', config.theme.secondaryColor);
    }
}

// Función para conectar con API externa (ejemplo)
async function connectToAPI(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return 'Lo siento, hay un problema con la conexión. Intenta nuevamente.';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Enfocar input al cargar
    messageInput.focus();
    
    // Configuración inicial si es necesario
    // configureChatbot({ title: 'Mi Bot Personalizado' });
});

// Eventos adicionales
document.addEventListener('keydown', function(event) {
    // Atajo para limpiar chat (Ctrl + L)
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        clearChat();
    }
});

// Exportar funciones para uso externo
window.chatbot = {
    sendMessage,
    addMessage,
    addBotResponse,
    getChatHistory,
    clearChat,
    configureChatbot,
    connectToAPI
};

// Mensaje de bienvenida automático después de 3 segundos
        setTimeout(() => {
            if (!chatOpen) {
                showNotification();
            }
        }, 3000);
