document.addEventListener('DOMContentLoaded', () => {
    console.log("1. Script empregos.js foi carregado e está rodando.");

    const usuarioLogadoString = sessionStorage.getItem('usuarioLogado');
    console.log("2. Conteúdo de 'usuarioLogado' na sessionStorage:", usuarioLogadoString);

    const usuarioLogado = JSON.parse(usuarioLogadoString);
    const botaoCadastrar = document.getElementById('btn-ir-para-cadastro-emprego');
    console.log("3. Elemento do botão encontrado no HTML:", botaoCadastrar);

    if (botaoCadastrar && usuarioLogado) {
        console.log("4. CONDIÇÃO VERDADEIRA: Usuário está logado E o botão foi encontrado. Exibindo o botão.");
        
        botaoCadastrar.style.display = 'inline-block';

        botaoCadastrar.addEventListener('click', () => {
            window.location.href = '/codigos/src/public/paginas/cadastroempregos.html';
        });

    } else {
        console.error("5. CONDIÇÃO FALSA: O botão não será exibido. Verificando as causas:");
        console.error("   - O usuário foi encontrado na sessão?", !!usuarioLogado);
        console.error("   - O botão foi encontrado no HTML?", !!botaoCadastrar);
    }
});