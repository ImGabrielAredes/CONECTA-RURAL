const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id');

    if (!produtoId) {
        document.querySelector('main').innerHTML = '<p class="aviso">Produto não encontrado. ID não fornecido.</p>';
        return;
    }

    carregarDetalhesDoProduto(produtoId);
    const botaoComprar = document.getElementById('botao-comprar-produto');
    if (botaoComprar) {
        botaoComprar.addEventListener('click', function(event) {
            const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

            if (!usuarioLogado) {
                event.preventDefault();
                alert("Você precisa estar logado para realizar uma compra.");
                window.location.href = '/codigos/src/public/paginas/cadastro.html#login';
            }
        });
    }
});

async function carregarDetalhesDoProduto(id) {
    try {
        const response = await fetch(`${API_URL}/produtos/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado no servidor.');
        }
        const produto = await response.json();
        exibirDadosDoProduto(produto);

    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        document.querySelector('main').innerHTML = `<p class="aviso">Não foi possível carregar os detalhes do produto.</p>`;
    }
}


/**
 * 
 @param {object} produto - 
 */
function exibirDadosDoProduto(produto) {

    document.getElementById('nome-produto').textContent = produto.nome;
    document.getElementById('preco-produto').textContent = produto.preco.toFixed(2).replace('.', ',');
    document.getElementById('unidade').textContent = produto.unidade;
    document.getElementById('disponibilidade-produto').textContent = produto.disponivel ? 'Em Estoque' : 'Indisponível';
    document.getElementById('descricao-produto').textContent = produto.descricao;

    document.getElementById('nome-produtor').textContent = produto.produtor.nome;
    document.getElementById('local-produtor').textContent = produto.produtor.localizacao;
    document.getElementById('contato-produtor').textContent = produto.produtor.propriedade;
    document.getElementById('categoria-produto').textContent = produto.categoria;

    if (produto.informacoes_nutricionais) {
        document.getElementById('valor-energetico-produto').textContent = produto.informacoes_nutricionais.calorias || 'N/A';
        document.getElementById('carboidratos-produto').textContent = produto.informacoes_nutricionais.carboidratos || 'N/A';
        document.getElementById('proteinas-produto').textContent = produto.informacoes_nutricionais.proteinas || 'N/A';
        document.getElementById('fibras-produto').textContent = produto.informacoes_nutricionais.fibras || 'N/A';
    }

    const imagemPrincipal = document.getElementById('imagem-principal');
    const imagensSecundariasDiv = document.getElementById('imagens-secundarias');
    
    if (produto.imagens && produto.imagens.length > 0) {
        imagemPrincipal.src = `/codigos/src/public/img/${produto.imagens[0]}`;
        imagemPrincipal.alt = produto.nome;

        if (produto.imagens.length > 1) {
            imagensSecundariasDiv.innerHTML = '';
            produto.imagens.forEach((urlDaImagem, index) => {
                const imgMiniatura = document.createElement('img');
                imgMiniatura.src = `/codigos/src/public/img/${urlDaImagem}`;
                imgMiniatura.alt = `${produto.nome} - miniatura ${index + 1}`;
                if (index === 0) imgMiniatura.classList.add('ativa');
                
                imgMiniatura.addEventListener('click', function() {
                    imagemPrincipal.src = this.src;
                    imagensSecundariasDiv.querySelectorAll('img').forEach(img => img.classList.remove('ativa'));
                    this.classList.add('ativa');
                });
                imagensSecundariasDiv.appendChild(imgMiniatura);
            });
        }
    }

    const listaAvaliacoes = document.getElementById('lista-avaliacoes');
    if(produto.avaliacoes && produto.avaliacoes.length > 0) {
        listaAvaliacoes.innerHTML = '';
        produto.avaliacoes.forEach(avaliacao => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="avaliacao">
                    <p class="usuario">${avaliacao.usuario}</p>
                    <p class="nota">${'⭐'.repeat(Math.round(avaliacao.nota))}</p>
                    <p class="comentario">${avaliacao.comentario}</p>
                </div>`;
            listaAvaliacoes.appendChild(li);
        });
    } else {
        listaAvaliacoes.innerHTML = '<p>Este produto ainda não tem avaliações.</p>';
    }
}