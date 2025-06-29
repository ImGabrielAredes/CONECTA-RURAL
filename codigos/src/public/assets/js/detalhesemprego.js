const API_URL = '/api'; 

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('id');

    if (vagaId) {
        carregarDetalhesDaVaga(vagaId);
    }
});

async function carregarDetalhesDaVaga(id) {
    const container = document.getElementById('detalhe-vaga-box');
    try {
        const response = await fetch(`${API_URL}/empregos/${id}`);
        if (!response.ok) throw new Error('Vaga não encontrada.');
        
        const vaga = await response.json();

        document.getElementById('titulo-vaga').textContent = vaga.tituloVaga;
        document.getElementById('local-vaga').textContent = vaga.local;
        document.getElementById('descricao-vaga').textContent = vaga.descricao;
        document.getElementById('requisitos-vaga').textContent = vaga.requisitos;
        document.getElementById('responsavel-vaga').textContent = vaga.responsavel;
        document.getElementById('contato-vaga').textContent = vaga.contato;
        
    } catch (error) {
        console.error("Erro ao carregar detalhes da vaga:", error);
        container.innerHTML = '<h1>Vaga não encontrada</h1><p>Não foi possível carregar os detalhes desta vaga. Tente novamente mais tarde.</p>';
    }
}