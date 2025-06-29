const API_URL = '/api'; 

function showStep(stepNumber) {
    document.querySelectorAll('#cadastro-container .step').forEach(step => {
        step.style.display = 'none';
    });
    const stepToShow = document.getElementById(`step${stepNumber}`);
    if (stepToShow) {
        stepToShow.style.display = 'flex';
    }
}
window.nextStep = (current) => showStep(current + 1);
window.prevStep = (current) => showStep(current - 1);

document.addEventListener('DOMContentLoaded', function () {
    
    const loginContainer = document.getElementById('login-container');
    const cadastroContainer = document.getElementById('cadastro-container');
    const toggleToCadastro = document.getElementById('toggle-to-cadastro');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const cadastroForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');

    function mostrarFormularioInicial() {
        if (window.location.hash === '#cadastro') {
            if(cadastroContainer) cadastroContainer.style.display = 'block';
            if(loginContainer) loginContainer.style.display = 'none';
            showStep(1);
        } else { 
            if(loginContainer) loginContainer.style.display = 'block';
            if(cadastroContainer) cadastroContainer.style.display = 'none';
        }
    }

    if (toggleToCadastro) {
        toggleToCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'cadastro';
            
        });
    }

    if (toggleToLogin) {
        toggleToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'login';
        });
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function (event) {
            event.preventDefault(); 

            const senha = this.querySelector('input[name="senha"]').value;
            const confirmarSenha = this.querySelector('input[name="confirmarSenha"]').value;
            if (senha !== confirmarSenha) return alert('As senhas não coincidem!');
            
            const formData = new FormData(this);
            const dadosUsuario = Object.fromEntries(formData.entries());
            delete dadosUsuario.confirmarSenha;
            dadosUsuario.dataCadastro = new Date().toISOString(); 

            try {
                const responseCheck = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(dadosUsuario.email)}`);
                const usuarioExistente = await responseCheck.json();
                if (usuarioExistente.length > 0) return alert('Este e-mail já está cadastrado!');

                const responseCreate = await fetch(`${API_URL}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosUsuario)
                });
                if (!responseCreate.ok) throw new Error('Falha no cadastro.');
                
                const novoUsuario = await responseCreate.json();
                sessionStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
                window.location.href = '/codigos/src/public/paginas/sucesso.html';

            } catch (error) {
                console.error('Erro no cadastro:', error);
                alert('Ocorreu um erro ao realizar o cadastro.');
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = this.querySelector('input[name="email"]').value;
            const senha = this.querySelector('input[name="senha"]').value;
            try {
                const response = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
                const usuariosEncontrados = await response.json();
                if (usuariosEncontrados.length > 0) {
                    const usuario = usuariosEncontrados[0];
                    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                    window.location.href = '/codigos/src/public/paginas/sucesso.html';
                } else {
                    alert('Email ou senha incorretos!');
                }
            } catch (error) {
                console.error('Erro no login:', error);
                alert('Ocorreu um erro ao tentar fazer login.');
            }
        });
    }
    mostrarFormularioInicial();
    window.addEventListener('hashchange', mostrarFormularioInicial);
});