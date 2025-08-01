// Smooth scrolling para enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para enlaces internos
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
    const animatedElements = document.querySelectorAll('.game-card, .feature-box, .trust-item, .trx-card');
    
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
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
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

