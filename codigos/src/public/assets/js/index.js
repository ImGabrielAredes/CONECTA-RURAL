
document.addEventListener('DOMContentLoaded', function() {
    const formPesquisa = document.querySelector('.barra-pesquisa-home');

    if (formPesquisa) {
        formPesquisa.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const inputPesquisa = formPesquisa.querySelector('input[name="q"]');
            const termoPesquisado = inputPesquisa.value.trim();

            if (termoPesquisado) {
                window.location.href = `/codigos/src/public/paginas/barrapesquisa.html?q=${encodeURIComponent(termoPesquisado)}`;
            }
        });
    }
});