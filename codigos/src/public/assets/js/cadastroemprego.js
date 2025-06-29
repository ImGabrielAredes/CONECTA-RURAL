document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar uma vaga.");
        window.location.href = '/codigos/src/public/paginas/cadastro.html#login';
        return; 
    }

    const nomeInput = document.getElementById('nome');
    const localInput = document.getElementById('local');
    const telefoneInput = document.getElementById('telefone');
    const valorInput = document.getElementById('valor');
    const form = document.querySelector('form');

    if(nomeInput) permitirSomenteLetras(nomeInput);
    if(localInput) permitirSomenteLetras(localInput);
    if(telefoneInput) mascaraTelefone(telefoneInput);
    if(valorInput) mascaraValor(valorInput);

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const oferta = {
                tituloVaga: document.getElementById('nome').value.trim(),
                contato: document.getElementById('telefone').value.trim(),
                categoria: document.getElementById('area').value.trim(),
                descricao: document.getElementById('descricao').value.trim(),
                local: document.getElementById('local').value.trim(),
                valor: document.getElementById('valor').value.trim(),
                requisitos: document.getElementById('observacoes').value.trim(),
                responsavel: `${usuarioLogado.nome} ${usuarioLogado.sobrenome}`, 
                criadorId: usuarioLogado.id 
            };

            if (!oferta.tituloVaga || !oferta.contato || !oferta.descricao || !oferta.local) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(oferta)
                });

                if (!response.ok) throw new Error('Erro ao enviar para o servidor');

                await response.json();
                alert('Oferta de emprego cadastrada com sucesso!');
                form.reset();
                window.location.href = '/codigos/src/public/paginas/paginainicialempregos.html';

            } catch (error) {
                console.error('Erro ao cadastrar vaga:', error);
                alert('Erro ao enviar os dados para o servidor.');
            }
        });
    }
});
function permitirSomenteLetras(input) {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    });
}

function mascaraTelefone(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        e.target.value = value;
    });
}

function mascaraValor(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2) + '';
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        e.target.value = 'R$ ' + value;
    });
}