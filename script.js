// Função para alternar o menu mobile
function toggleMenu() {
    const nav = document.querySelector('header nav ul');
    const menuIcon = document.querySelector('.menu-icon');
    
    nav.classList.toggle('active');
    menuIcon.classList.toggle('active');
    
    // Acessibilidade
    const isExpanded = nav.classList.contains('active');
    menuIcon.setAttribute('aria-expanded', isExpanded);
}

// Fechar menu ao clicar em um item (para mobile)
document.querySelectorAll('header nav ul li a').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('header nav ul');
            const menuIcon = document.querySelector('.menu-icon');
            nav.classList.remove('active');
            menuIcon.classList.remove('active');
            menuIcon.setAttribute('aria-expanded', 'false');
        }
    });
});

// Função para validar o formulário
function validateForm() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (nome === "" || email === "" || mensagem === "") {
        alert("Por favor, preencha todos os campos.");
        return false;
    }

    if (!validateEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return false;
    }

    return true;
}

// Função para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Adiciona classe scrolled ao header quando a página é rolada
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Suaviza o scroll para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});