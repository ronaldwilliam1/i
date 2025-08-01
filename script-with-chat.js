// Chat System Implementation
class ChatSystem {
    constructor() {
        this.currentRoom = 'general';
        this.currentUser = 'Jugador' + Math.floor(Math.random() * 1000);
        this.isMinimized = false;
        this.messages = {
            'general': [],
            'arcade-blitz': [],
            'stack-duel': [],
            'mind-flip': []
        };
        this.onlineUsers = Math.floor(Math.random() * 50) + 20;
        this.init();
        this.loadInitialMessages();
        this.startSimulation();
    }

    init() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatMinimize = document.getElementById('chatMinimize');
        this.chatClose = document.getElementById('chatClose');
        this.openChatBtn = document.getElementById('openChatBtn');
        this.onlineCount = document.getElementById('onlineCount');
        this.currentUsername = document.getElementById('currentUsername');
        this.chatNotification = document.getElementById('chatNotification');

        // Set current username
        this.currentUsername.textContent = this.currentUser;
        this.onlineCount.textContent = this.onlineUsers;

        // Event listeners
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.openChatBtn.addEventListener('click', () => this.openChat());
        this.chatMinimize.addEventListener('click', () => this.minimizeChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Tab switching
        document.querySelectorAll('.chat-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchRoom(tab.dataset.room));
        });

        // Game chat buttons
        document.querySelectorAll('.chat-game-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const game = btn.dataset.game;
                this.switchRoom(game);
                this.openChat();
            });
        });
    }

    loadInitialMessages() {
        // General room messages
        this.messages.general = [
            {
                username: 'GameMaster',
                text: '¡Bienvenidos al chat de Score Milk! 🎮',
                time: this.getTimeString(-30),
                isSystem: true
            },
            {
                username: 'CryptoGamer',
                text: '¿Alguien ha probado el nuevo Arcade Blitz? Está increíble!',
                time: this.getTimeString(-25),
                isOwn: false
            },
            {
                username: 'TRXMaster',
                text: 'Acabo de ganar 200 TRX en Stack Duel 💰',
                time: this.getTimeString(-20),
                isOwn: false
            },
            {
                username: 'ProPlayer',
                text: 'Las estrategias en Mind Flip están evolucionando mucho',
                time: this.getTimeString(-15),
                isOwn: false
            }
        ];

        // Arcade Blitz messages
        this.messages['arcade-blitz'] = [
            {
                username: 'SpeedRunner',
                text: '¿Cuál es el mejor momento para esquivar los obstáculos rojos?',
                time: this.getTimeString(-10),
                isOwn: false
            },
            {
                username: 'ArcadePro',
                text: 'Tip: mantén el ritmo constante, no te apresures al principio',
                time: this.getTimeString(-8),
                isOwn: false
            }
        ];

        // Stack Duel messages
        this.messages['stack-duel'] = [
            {
                username: 'BlockMaster',
                text: 'La clave está en la precisión, no en la velocidad',
                time: this.getTimeString(-12),
                isOwn: false
            },
            {
                username: 'StackKing',
                text: '¿Alguien quiere hacer un duelo de práctica?',
                time: this.getTimeString(-5),
                isOwn: false
            }
        ];

        // Mind Flip messages
        this.messages['mind-flip'] = [
            {
                username: 'BrainPower',
                text: 'Los patrones de memoria están cada vez más complejos',
                time: this.getTimeString(-7),
                isOwn: false
            },
            {
                username: 'MindReader',
                text: 'Técnica: visualiza los colores como números',
                time: this.getTimeString(-3),
                isOwn: false
            }
        ];

        this.renderMessages();
    }

    getTimeString(minutesAgo = 0) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutesAgo);
        return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    toggleChat() {
        if (this.chatWidget.classList.contains('active')) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatWidget.classList.add('active');
        this.chatWidget.classList.remove('minimized');
        this.chatInput.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.chatWidget.classList.remove('active');
        this.isMinimized = false;
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        this.chatWidget.classList.toggle('minimized', this.isMinimized);
    }

    switchRoom(room) {
        this.currentRoom = room;
        
        // Update active tab
        document.querySelectorAll('.chat-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.room === room);
        });

        this.renderMessages();
        this.chatInput.focus();
    }

    sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        const message = {
            username: this.currentUser,
            text: text,
            time: this.getTimeString(),
            isOwn: true
        };

        this.messages[this.currentRoom].push(message);
        this.chatInput.value = '';
        this.renderMessages();
        this.scrollToBottom();

        // Simulate response after a delay
        setTimeout(() => this.simulateResponse(text), 1000 + Math.random() * 2000);
    }

    simulateResponse(originalMessage) {
        const responses = {
            'general': [
                '¡Excelente punto!',
                'Totalmente de acuerdo',
                '¿Has probado la nueva estrategia?',
                'Interesante, cuéntanos más',
                'Yo también he notado eso',
                '¡Buena suerte en tus partidas!'
            ],
            'arcade-blitz': [
                'Ese nivel es complicado',
                'Prueba saltando más tarde',
                'Los power-ups ayudan mucho',
                'Mi récord es 2:15',
                '¡Sigue practicando!'
            ],
            'stack-duel': [
                'La precisión es clave',
                'Yo uso la técnica del centro',
                '¿Cuántas torres has logrado?',
                'Los bloques azules son más estables',
                'Buena estrategia'
            ],
            'mind-flip': [
                'La memoria visual funciona mejor',
                'Intenta crear patrones',
                'Los colores tienen secuencias',
                'Mi técnica es asociar con números',
                'Ese nivel es muy difícil'
            ]
        };

        const roomResponses = responses[this.currentRoom] || responses.general;
        const randomResponse = roomResponses[Math.floor(Math.random() * roomResponses.length)];
        const randomUser = this.getRandomUsername();

        const response = {
            username: randomUser,
            text: randomResponse,
            time: this.getTimeString(),
            isOwn: false
        };

        this.messages[this.currentRoom].push(response);
        
        // Show notification if chat is closed or minimized
        if (!this.chatWidget.classList.contains('active') || this.isMinimized) {
            this.showNotification(response);
        }

        this.renderMessages();
        this.scrollToBottom();
    }

    getRandomUsername() {
        const usernames = [
            'CryptoGamer', 'TRXMaster', 'ProPlayer', 'GameNinja', 'StackPro',
            'ArcadeKing', 'MindMaster', 'SpeedRunner', 'BlockChain', 'NeonPlayer',
            'PixelHero', 'CodeWarrior', 'CyberGamer', 'TechNinja', 'GameLord'
        ];
        return usernames[Math.floor(Math.random() * usernames.length)];
    }

    renderMessages() {
        const messages = this.messages[this.currentRoom] || [];
        this.chatMessages.innerHTML = '';

        messages.forEach(message => {
            const messageEl = this.createMessageElement(message);
            this.chatMessages.appendChild(messageEl);
        });

        this.scrollToBottom();
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        
        if (message.isSystem) {
            messageDiv.className = 'system-message';
            messageDiv.textContent = message.text;
            return messageDiv;
        }

        messageDiv.className = `message ${message.isOwn ? 'own' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        const header = document.createElement('div');
        header.className = 'message-header';

        const username = document.createElement('span');
        username.className = 'message-username';
        username.textContent = message.username;

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = message.time;

        const text = document.createElement('div');
        text.className = 'message-text';
        text.textContent = message.text;

        header.appendChild(username);
        header.appendChild(time);
        content.appendChild(header);
        content.appendChild(text);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        return messageDiv;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    showNotification(message) {
        const notification = this.chatNotification;
        const usernameEl = notification.querySelector('.notification-username');
        const messageEl = notification.querySelector('.notification-message');

        usernameEl.textContent = message.username;
        messageEl.textContent = message.text;

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);

        // Click to open chat
        notification.addEventListener('click', () => {
            this.openChat();
            notification.classList.remove('show');
        });
    }

    startSimulation() {
        // Simulate random messages
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.simulateRandomMessage();
            }
        }, 15000); // Every 15 seconds

        // Update online users count
        setInterval(() => {
            this.onlineUsers += Math.floor(Math.random() * 6) - 3; // -3 to +2
            this.onlineUsers = Math.max(15, Math.min(100, this.onlineUsers));
            this.onlineCount.textContent = this.onlineUsers;
        }, 30000); // Every 30 seconds
    }

    simulateRandomMessage() {
        const rooms = ['general', 'arcade-blitz', 'stack-duel', 'mind-flip'];
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        
        const messages = {
            'general': [
                '¡Nueva actualización disponible!',
                '¿Alguien para una partida rápida?',
                'Los gráficos se ven increíbles',
                'Acabo de subir de nivel',
                'La comunidad está creciendo mucho'
            ],
            'arcade-blitz': [
                'Nuevo récord: 1:58!',
                '¿Tips para el nivel 15?',
                'Los obstáculos están más difíciles',
                'Encontré un bug en el nivel 8'
            ],
            'stack-duel': [
                'Busco oponente para duelo',
                'La física de los bloques mejoró',
                '¿Cuál es vuestra estrategia favorita?',
                'Acabo de hacer una torre de 50 bloques'
            ],
            'mind-flip': [
                'Los patrones son más complejos ahora',
                'Nueva técnica de memorización',
                '¿Alguien ha llegado al nivel 20?',
                'Los colores confunden mucho'
            ]
        };

        const roomMessages = messages[randomRoom];
        const randomMessage = roomMessages[Math.floor(Math.random() * roomMessages.length)];
        const randomUser = this.getRandomUsername();

        const message = {
            username: randomUser,
            text: randomMessage,
            time: this.getTimeString(),
            isOwn: false
        };

        this.messages[randomRoom].push(message);

        // Show notification if not in current room or chat is closed
        if (randomRoom !== this.currentRoom || !this.chatWidget.classList.contains('active') || this.isMinimized) {
            this.showNotification(message);
        }

        // Update current room if it's the active one
        if (randomRoom === this.currentRoom) {
            this.renderMessages();
            this.scrollToBottom();
        }
    }
}

// Original website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat system
    const chatSystem = new ChatSystem();

    // Smooth scrolling para enlaces de navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 44, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 15, 44, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animaciones a elementos específicos
    const animatedElements = document.querySelectorAll('.game-card, .feature-box, .trust-item, .trx-card, .stat-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Contador animado para estadísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    }
    
    // Aplicar contador a elementos con clase 'counter'
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Efecto parallax para hero background
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Efecto hover para game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Simulación de datos en tiempo real para TRX card
    const trxAmount = document.querySelector('.trx-amount');
    const playerBets = document.querySelectorAll('.player-bet');
    
    function updateTRXData() {
        if (trxAmount) {
            const baseAmount = 250;
            const variation = Math.floor(Math.random() * 50) - 25;
            const newAmount = baseAmount + variation;
            trxAmount.textContent = `${newAmount} TRX`;
            
            // Actualizar apuestas individuales
            playerBets.forEach(bet => {
                const playerAmount = Math.floor(newAmount / 2);
                bet.textContent = `${playerAmount} TRX`;
            });
        }
    }
    
    // Actualizar datos cada 5 segundos
    setInterval(updateTRXData, 5000);
    
    // Efecto de typing para el título hero
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Aplicar efecto typing al título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
    
    // Partículas flotantes en el background
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00FFB3;
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
            animation: float-particle 8s linear infinite;
        `;
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }
    
    // Crear partículas cada 2 segundos
    setInterval(createParticle, 2000);
    
    // CSS para animación de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Manejo de formularios y CTAs
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-neon');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Efecto de ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-effect 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Aquí se puede agregar lógica para registro/login
            console.log('CTA clicked:', this.textContent);
        });
    });
    
    // CSS para efecto ripple
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Manejo de errores de imágenes
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
    
    // Preloader simple
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Responsive menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00FFB3' : type === 'error' ? '#EF0027' : '#0A0F2C'};
        color: ${type === 'success' || type === 'error' ? '#0A0F2C' : '#FFFFFF'};
        border-radius: 10px;
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Función para simular carga de datos
function simulateDataLoading() {
    const loadingElements = document.querySelectorAll('.loading-placeholder');
    
    loadingElements.forEach(element => {
        element.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        element.style.backgroundSize = '200% 100%';
        element.style.animation = 'loading-shimmer 1.5s infinite';
    });
    
    const shimmerStyle = document.createElement('style');
    shimmerStyle.textContent = `
        @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
    `;
    document.head.appendChild(shimmerStyle);
}

