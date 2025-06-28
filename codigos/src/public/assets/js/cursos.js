const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_URL}/cursos`);
        const todosCursos = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

        renderizarColunas(todosCursos, usuarioLogado);

    } catch (error) {
        console.error("Erro fatal ao carregar cursos:", error);
        const container = document.querySelector('.cursos');
        if (container) container.innerHTML = "<h1>Erro ao carregar conteúdo. Tente novamente mais tarde.</h1>";
    }
});


function renderizarColunas(todosCursos, usuarioLogado) {
    const recomendados = todosCursos.filter(curso => (curso.visualizacoes || 0) >= 150); 
    const maisVistos = [...todosCursos].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 5); 
    const redesSociais = todosCursos.filter(curso => curso.categoria && curso.categoria.toLowerCase().includes("redes sociais"));

    renderizarCards("recomendados", recomendados, usuarioLogado);
    renderizarCards("maisvistos", maisVistos, usuarioLogado);
    renderizarCards("redessociais", redesSociais, usuarioLogado);
    adicionarListenersAosBotoes();
}


function renderizarCards(containerId, cursosParaRenderizar, usuarioLogado) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    if (cursosParaRenderizar.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size: 0.9em; color: #666;">Nenhum curso nesta categoria.</p>';
        return;
    }

    cursosParaRenderizar.forEach(curso => {
        let botoesAdminHTML = '';
        if (usuarioLogado && curso.criadorId === usuarioLogado.id) {
            botoesAdminHTML = `
                <div class="card-admin-botoes">
                    <button class="btn-editar" data-id="${curso.id}">Editar</button>
                    <button class="btn-excluir" data-id="${curso.id}">Excluir</button>
                </div>
            `;
        }

        const div = document.createElement('div');
        div.className = 'itemcurso';
        const imageUrl = curso.imagem ? `/codigos/src/public/img/${curso.imagem}` : '/codigos/src/public/img/placeholder-curso.png';
        div.innerHTML = `
            <h2>${curso.titulo}</h2>
            <img src="${imageUrl}" alt="${curso.titulo}">
            <p>${curso.descricao.substring(0, 100)}...</p>
            <a href="/codigos/src/public/paginas/detalhescursos.html?id=${curso.id}" class="sabermais">Saber mais</a>
            ${botoesAdminHTML} 
        `;
        container.appendChild(div);
    });
}


/**
 * 
 * 
 */
function adicionarListenersAosBotoes() {
    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            window.location.href = `/codigos/src/public/paginas/cadastrocursos.html?editId=${id}`;
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(botao => {
        botao.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            excluirCurso(id);
        });
    });
}


/**
 * 
 */
async function excluirCurso(id) {
    if (confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
        try {
            const response = await fetch(`${API_URL}/cursos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Falha na exclusão.");
            
            alert('Curso excluído com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir curso:', error);
            alert('Falha ao excluir o curso.');
        }
    }
}