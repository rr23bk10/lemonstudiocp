// script.js - JavaScript Moderno e Responsivo

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    typingSpeed: 100,
    loadingDuration: 2000
};

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce function para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function para scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Verificar se elemento está visível na viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animação de contadores
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
};

// ===== GERENCIADOR DE LOADING =====
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }

    init() {
        // Simular carregamento
        setTimeout(() => {
            this.hideLoading();
        }, CONFIG.loadingDuration);
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// ===== GERENCIADOR DE NAVEGAÇÃO =====
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll event
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));

        // Resize event
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));

        // Click outside menu
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.nav) {
            this.nav.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.menuToggle) {
            this.menuToggle.classList.toggle('active', this.isMenuOpen);
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        if (this.nav) {
            this.nav.classList.remove('active');
        }
        
        if (this.menuToggle) {
            this.menuToggle.classList.remove('active');
        }

        document.body.style.overflow = '';
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            this.scrollToSection(targetId);
            this.closeMenu();
            this.setActiveLink(e.target);
        }
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background on scroll
        if (this.header) {
            this.header.classList.toggle('scrolled', scrollY > 50);
        }

        // Update active navigation link
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + CONFIG.scrollOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    handleOutsideClick(e) {
        if (this.isMenuOpen && 
            !this.nav.contains(e.target) && 
            !this.menuToggle.contains(e.target)) {
            this.closeMenu();
        }
    }
}

// ===== GERENCIADOR DE FORMULÁRIO =====
class FormManager {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.fields = {
            nome: this.form?.querySelector('#nome'),
            email: this.form?.querySelector('#email'),
            assunto: this.form?.querySelector('#assunto'),
            mensagem: this.form?.querySelector('#mensagem')
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.values(this.fields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
    }

    setupRealTimeValidation() {
        // Email validation on input
        if (this.fields.email) {
            this.fields.email.addEventListener('input', Utils.debounce(() => {
                if (this.fields.email.value) {
                    this.validateEmail(this.fields.email.value, false);
                }
            }, 500));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return false;
        }

        this.setLoadingState(true);
        
        try {
            // Simular envio do formulário
            await this.simulateFormSubmission();
            this.showSuccessMessage();
            this.resetForm();
        } catch (error) {
            this.showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Validar todos os campos
        Object.entries(this.fields).forEach(([name, field]) => {
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Limpar erro anterior
        this.clearFieldError(field);

        // Validações específicas
        switch (fieldName) {
            case 'nome':
                if (!value) {
                    errorMessage = 'Nome é obrigatório';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email é obrigatório';
                    isValid = false;
                } else if (!this.validateEmail(value)) {
                    errorMessage = 'Email inválido';
                    isValid = false;
                }
                break;

            case 'assunto':
                if (!value) {
                    errorMessage = 'Selecione um assunto';
                    isValid = false;
                }
                break;

            case 'mensagem':
                if (!value) {
                    errorMessage = 'Mensagem é obrigatória';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    validateEmail(email, showError = true) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (!isValid && showError) {
            this.showFieldError(this.fields.email, 'Email inválido');
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
        field.style.borderColor = '';
    }

    setLoadingState(loading) {
        if (this.submitBtn) {
            this.submitBtn.classList.toggle('loading', loading);
            this.submitBtn.disabled = loading;
        }
    }

    async simulateFormSubmission() {
        // Simular delay de envio
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccessMessage() {
        // Criar e mostrar mensagem de sucesso
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <i class="fas fa-check-circle"></i>
                Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
        `;
        
        this.form.insertBefore(message, this.form.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: #ef4444;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        Object.values(this.fields).forEach(field => {
            if (field) {
                this.clearFieldError(field);
            }
        });
    }
}

// ===== GERENCIADOR DE ANIMAÇÕES =====
class AnimationManager {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupTypingAnimation();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.observedElements.add(entry.target);
                }
            });
        }, options);

        // Observar elementos animáveis
        const animatableElements = document.querySelectorAll(
            '.service-item, .value-item, .portfolio-item, .stat-item, .about-text, .contact-info'
        );

        animatableElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    Utils.animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = ['realidade digital', 'soluções inovadoras', 'experiências únicas'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : CONFIG.typingSpeed;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next text
            }

            setTimeout(typeText, typeSpeed);
        };

        typeText();
    }
}

// ===== GERENCIADOR DE SCROLL =====
class ScrollManager {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Back to top button
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
        }

        // Show/hide back to top button
        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleBackToTopButton();
        }, 100));
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleBackToTopButton() {
        if (this.backToTopBtn) {
            const shouldShow = window.scrollY > 300;
            this.backToTopBtn.classList.toggle('visible', shouldShow);
        }
    }
}

// ===== INICIALIZAÇÃO =====
class App {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Inicializar todos os componentes
        this.loadingManager = new LoadingManager();
        this.navigationManager = new NavigationManager();
        this.formManager = new FormManager();
        this.animationManager = new AnimationManager();
        this.scrollManager = new ScrollManager();

        // Configurações globais
        this.setupGlobalEvents();
    }

    setupGlobalEvents() {
        // Prevenir comportamento padrão de links vazios
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });

        // Otimização de performance para dispositivos móveis
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }
}

// ===== FUNÇÕES GLOBAIS (COMPATIBILIDADE) =====
// Manter função original para compatibilidade
function toggleMenu() {
    if (window.app && window.app.navigationManager) {
        window.app.navigationManager.toggleMenu();
    }
}

// Manter função original para compatibilidade
function validateForm(event) {
    if (window.app && window.app.formManager) {
        return window.app.formManager.handleSubmit(event);
    }
    return false;
}

// Função de validação de email (compatibilidade)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== INICIALIZAR APLICAÇÃO =====
window.app = new App();

