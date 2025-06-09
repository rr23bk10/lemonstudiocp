// script.js

// Função para alternar o menu mobile
function toggleMenu() {
    const nav = document.querySelector('header nav');
    nav.classList.toggle('active');
}

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