const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    carregarVagas();

    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const botaoCadastrar = document.getElementById('btn-ir-para-cadastro-emprego');

    if (botaoCadastrar && usuarioLogado) {
        botaoCadastrar.style.display = 'inline-block';
        botaoCadastrar.addEventListener('click', () => {
            window.location.href = '/codigos/src/public/paginas/cadastroempregos.html'; 
        });
    }
});

async function carregarVagas() {
    const containerDestaque = document.getElementById('vagas-destaque-container');
    if (!containerDestaque) return;

    try {
        const response = await fetch(`${API_URL}/empregos`);
        const empregos = await response.json();
        
        containerDestaque.innerHTML = '';

        if (empregos.length === 0) {
            containerDestaque.innerHTML = '<p>Nenhuma vaga disponível no momento.</p>';
            return;
        }

        empregos.reverse().forEach(vaga => { 
            const cardHTML = `
                <div class="card">
                    <h3>${vaga.tituloVaga}</h3>
                    <p>${vaga.local}</p>
                    <button onclick="window.location.href='/codigos/src/public/paginas/detalhesemprego.html?id=${vaga.id}'">Saber mais ></button>
                </div>
            `;
            containerDestaque.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Erro ao carregar vagas:", error);
        containerDestaque.innerHTML = '<p>Erro ao carregar as vagas. Tente novamente mais tarde.</p>';
    }
}