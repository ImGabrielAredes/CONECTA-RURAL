const API_URL = '/api'; 

document.addEventListener('DOMContentLoaded', () => {

    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('vagaId');

    if (!vagaId) {
        document.querySelector('main').innerHTML = "<h1>Erro</h1><p>Nenhuma vaga selecionada.</p>";
        return;
    }

    const form = document.getElementById('formCurriculo');
    form.nome.value = `${usuarioLogado.nome} ${usuarioLogado.sobrenome}`;
    form.email.value = usuarioLogado.email;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const arquivoInput = form.arquivo;
        const nomeDoArquivo = arquivoInput.files.length > 0 ? arquivoInput.files[0].name : 'Nenhum arquivo anexado';

        const candidaturaData = {
            vagaId: parseInt(vagaId),
            usuarioId: usuarioLogado.id,
            nomeCandidato: form.nome.value,
            emailCandidato: form.email.value,
            nomeArquivo: nomeDoArquivo,
            dataCandidatura: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_URL}/candidaturas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(candidaturaData)
            });

            if (!response.ok) throw new Error('Falha ao enviar a candidatura.');
            
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            const botaoSubmit = form.querySelector('button[type="submit"]');

            mensagemSucesso.style.display = 'block';
            botaoSubmit.textContent = 'Enviado!';
            botaoSubmit.disabled = true;

        } catch (error) {
            console.error("Erro ao enviar candidatura:", error);
            alert("Não foi possível enviar sua candidatura. Tente novamente.");
        }
    });
});