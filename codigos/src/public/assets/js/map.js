
const API_URL = 'http://localhost:3000';

function iniciarMapa() {

    fetch(`${API_URL}/produtos`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Falha ao buscar os produtos do servidor.');
            }
            return res.json();
        })
        .then(produtos => {
            const filtroSelect = document.querySelector('#filtroProduto');

            const nomeProdutos = [...new Set(produtos.map(p => p.nome))];
            nomeProdutos.sort().forEach(nome => {
                const option = document.createElement('option');
                option.value = nome;
                option.textContent = nome;
                filtroSelect.appendChild(option);
            });

            let centroMapa = { lat: -19.916681, lng: -43.934493 }; 
            const mapa = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: centroMapa,
                mapId: 'CONECTA_RURAL_STYLE' 
            });

            const janelaInfos = new google.maps.InfoWindow();
            const geocoder = new google.maps.Geocoder();
            const marcadores = [];

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (posicao) => {
                        const localUsuario = {
                            lat: posicao.coords.latitude,
                            lng: posicao.coords.longitude
                        };
                        mapa.setCenter(localUsuario);
                        mapa.setZoom(10);
                        new google.maps.Marker({
                            map: mapa,
                            position: localUsuario,
                            title: "Você está aqui!",
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "white",
                                strokeWeight: 2,
                            },
                        });
                    },
                    (erro) => console.warn("Erro ao obter geolocalização:", erro.message)
                );
            }
            produtos.forEach(produto => {
                geocoder.geocode({ address: produto.produtor.localizacao }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const marcador = new google.maps.Marker({
                            map: mapa,
                            position: results[0].geometry.location,
                            title: `${produto.nome} - ${produto.produtor.nome}`,
                        });
                        marcador.produtoNome = produto.nome;
                        marcadores.push(marcador);

                        marcador.addListener('click', () => {
                            const infos = `
                                <div style="font-family: Arial, sans-serif; max-width: 250px; padding: 5px;">
                                    <h3 style="margin: 0 0 10px 0; color: #0a5500;">${produto.nome}</h3>
                                    ${produto.imagens[0] ? `<img src="/codigos/src/public/img/${produto.imagens[0]}" alt="${produto.nome}" style="width: 100%; height: auto; margin-bottom: 10px; border-radius: 5px;">` : ''}
                                    <p><strong>Produtor:</strong> ${produto.produtor.nome}</p>
                                    <p><strong>Local:</strong> ${produto.produtor.localizacao}</p>
                                    <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2).replace('.', ',')} / ${produto.unidade}</p>
                                    <a href="/codigos/src/public/paginas/detalhes.html?id=${produto.id}" style="display:inline-block; margin-top:10px; font-weight:bold; color:#168a06;">Ver Detalhes do Produto</a>
                                </div>`;
                            
                            janelaInfos.setContent(infos);
                            janelaInfos.open(mapa, marcador);
                        });
                    } else {
                        console.error(`Erro na geocodificação para "${produto.produtor.localizacao}": ${status}`);
                    }
                });
            });
            filtroSelect.addEventListener('change', () => {
                const selecionado = filtroSelect.value;
                marcadores.forEach(marcador => {
                    marcador.setVisible(selecionado === "Todos" || marcador.produtoNome === selecionado);
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados para o mapa: ', error);
            document.getElementById('map').innerHTML = "Não foi possível carregar os produtos no mapa. Verifique se o JSON Server está rodando.";
        });
}