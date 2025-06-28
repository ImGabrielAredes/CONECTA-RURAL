const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const topProdutosWrapper = document.querySelector('#top-produtos-swiper .swiper-wrapper');
    const promocoesGrid = document.querySelector('#promocoes-grid');

    try {
     
        const response = await fetch(`${API_URL}/produtos`);
        if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
        
        const produtos = await response.json();

        const produtosDestaque = produtos.slice(0, 8);
        const produtosPromocao = produtos.slice(8, 14); 

        if (topProdutosWrapper) {
            topProdutosWrapper.innerHTML = ''; 
            produtosDestaque.forEach(produto => {
                const slideHTML = `
                    <div class="swiper-slide">
                        <div class="produto-item">
                            <img src="/codigos/src/public/img/${produto.imagens[0]}" alt="${produto.nome}">
                            <h3>${produto.nome}</h3>
                            <p class="fazenda">${produto.produtor.propriedade}</p>
                            <a href="detalhes.html?id=${produto.id}" class="botao-detalhes">Saber mais ></a>
                        </div>
                    </div>
                `;
                topProdutosWrapper.innerHTML += slideHTML;
            });

            new Swiper('#top-produtos-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }
            });
        }

        if (promocoesGrid) {
            promocoesGrid.innerHTML = '';
            produtosPromocao.forEach(produto => {
                const cardHTML = `
                    <div class="produto-item promocao">
                        <div class="imagem-container">
                            <img src="/codigos/src/public/img/${produto.imagens[0]}" alt="${produto.nome}">
                            <span class="tag-promocao">Promoção</span>
                        </div>
                        <h3>${produto.nome}</h3>
                        <p class="fazenda">${produto.produtor.propriedade}</p>
                        <a href="detalhes.html?id=${produto.id}" class="botao-detalhes">Saber mais ></a>
                    </div>
                `;
                promocoesGrid.innerHTML += cardHTML;
            });
        }

    } catch (error) {
        console.error("Erro ao carregar produtos do mercado:", error);
        if (topProdutosWrapper) topProdutosWrapper.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
        if (promocoesGrid) promocoesGrid.innerHTML = "<p>Não foi possível carregar as promoções.</p>";
    }
});