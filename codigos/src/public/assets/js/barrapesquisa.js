const API_URL = '/api'; 

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const termoPesquisado = urlParams.get('q');

    const tituloPesquisa = document.getElementById('titulo-pesquisa');
    if (termoPesquisado) {
        tituloPesquisa.textContent = `Resultados para: "${termoPesquisado}"`;
        await realizarBusca(termoPesquisado.toLowerCase());
    } else {
        tituloPesquisa.textContent = 'Nenhum termo de busca fornecido.';
    }
});


async function realizarBusca(termo) {
    try {
        const [produtosRes, cursosRes, empregosRes] = await Promise.all([
            fetch(`${API_URL}/produtos`),
            fetch(`${API_URL}/cursos`),
            fetch(`${API_URL}/empregos`)
        ]);

        const produtos = await produtosRes.json();
        const cursos = await cursosRes.json();
        const empregos = await empregosRes.json();

        const produtosEncontrados = produtos.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.descricao.toLowerCase().includes(termo) ||
            p.categoria.toLowerCase().includes(termo) ||
            p.produtor.nome.toLowerCase().includes(termo)
        );

        const cursosEncontrados = cursos.filter(c => 
            c.titulo.toLowerCase().includes(termo) ||
            c.descricao.toLowerCase().includes(termo) ||
            c.categoria.toLowerCase().includes(termo) ||
            c.instrutor.toLowerCase().includes(termo)
        );

        const empregosEncontrados = empregos.filter(e => 
            e.tituloVaga.toLowerCase().includes(termo) ||
            e.descricao.toLowerCase().includes(termo) ||
            e.local.toLowerCase().includes(termo)
        );

        exibirResultados('produtos', produtosEncontrados);
        exibirResultados('cursos', cursosEncontrados);
        exibirResultados('empregos', empregosEncontrados);

        if (produtosEncontrados.length === 0 && cursosEncontrados.length === 0 && empregosEncontrados.length === 0) {
            document.getElementById('nenhum-resultado').style.display = 'block';
        }

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        document.querySelector('main').innerHTML = '<p class="aviso">Erro ao carregar os resultados. Tente novamente mais tarde.</p>';
    }
}

function exibirResultados(tipo, resultados) {
    const container = document.getElementById(`${tipo}-grid`);
    const secao = document.getElementById(`resultados-${tipo}`);

    if (resultados.length === 0) {
        secao.style.display = 'none'; 
        return;
    }

    container.innerHTML = ''; 

    resultados.forEach(item => {
        let cardHTML = '';
        if (tipo === 'produtos') {
            cardHTML = `
                <div class="card-produto">
                    <img src="/codigos/src/public/img/${item.imagens[0]}" alt="${item.nome}">
                    <h3>${item.nome}</h3>
                    <p class="fazenda">${item.produtor.propriedade}</p>
                    <a href="detalhes.html?id=${item.id}" class="botao-detalhes">Saber mais ></a>
                </div>`;
        } else if (tipo === 'cursos') {
            cardHTML = `
                <div class="card-curso">
                    <img src="/codigos/src/public/${item.imagem}" alt="${item.titulo}">
                    <h3>${item.titulo}</h3>
                    <a href="detalhescursos.html?id=${item.id}" class="sabermais">Saber mais</a>
                </div>`;
        } else if (tipo === 'empregos') {
             cardHTML = `
                <div class="card-emprego">
                    <img src="https://img.icons8.com/color/100/worker-male--v1.png" alt="Ícone de Emprego">
                    <h3>${item.tituloVaga}</h3>
                    <p>${item.local}</p>
                    <button onclick="window.location.href='detalhesemprego.html?id=${item.id}'">Saber mais ></button>
                </div>`;
        }
        container.innerHTML += cardHTML;
    });
}