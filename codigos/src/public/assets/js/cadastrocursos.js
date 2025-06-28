const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('editId');
    const form = document.querySelector('.formulario-curso');

    const tipoPrecoRadios = form.querySelectorAll('input[name="tipoPreco"]');
    const campoPreco = document.getElementById('campoPreco');

    tipoPrecoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            campoPreco.style.display = form.tipoPreco.value === 'pago' ? 'block' : 'none';
        });
    });

    if (editId) {
        document.querySelector('h1').textContent = 'Editar Curso';
        form.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
        
        try {
            const response = await fetch(`${API_URL}/cursos/${editId}`);
            const curso = await response.json();

            if (curso.criadorId !== usuarioLogado.id) {
                alert("Você não tem permissão para editar este curso.");
                window.location.href = 'cursos.html';
                return;
            }

            form.titulo.value = curso.titulo || '';
            form.categoria.value = curso.categoria || '';
            form.descricao.value = curso.descricao || '';
            form.duracao.value = curso.duracao || '';
            form.dificuldade.value = curso.dificuldade || '';
            form.publicoAlvo.value = curso.publicoAlvo || '';
            form.formato.value = curso.formato || '';
            form.imagemUrl.value = curso.imagem || '';
            form.instrutor.value = curso.instrutor || '';
            form.modulos.value = curso.modulos ? curso.modulos.join('; ') : '';
            form.video.value = curso.video || '';
            form.tipoPreco.value = curso.tipoPreco || 'gratuito';

            if (curso.tipoPreco === 'pago') {
                campoPreco.style.display = 'block';
                form.preco.value = curso.preco || '';
            }

        } catch (error) {
            console.error("Erro ao carregar dados do curso para edição:", error);
            alert("Não foi possível carregar os dados do curso.");
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const cursoData = {
            titulo: form.titulo.value,
            categoria: form.categoria.value,
            descricao: form.descricao.value,
            duracao: parseInt(form.duracao.value),
            dificuldade: form.dificuldade.value,
            publicoAlvo: form.publicoAlvo.value,
            formato: form.formato.value,
            imagem: form.imagemUrl.value,
            instrutor: form.instrutor.value,
            modulos: form.modulos.value.split(';').map(m => m.trim()), 
            video: form.video.value,
            tipoPreco: form.tipoPreco.value,
            preco: form.tipoPreco.value === 'pago' ? parseFloat(form.preco.value) : 0,
            criadorId: usuarioLogado.id,
            data: editId ? undefined : new Date().toISOString() 
        };

        try {
            const method = editId ? 'PUT' : 'POST';
            const endpoint = editId ? `${API_URL}/cursos/${editId}` : `${API_URL}/cursos`;

            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cursoData)
            });

            if (!response.ok) throw new Error('Falha ao salvar o curso no servidor.');

            alert(`Curso ${editId ? 'atualizado' : 'cadastrado'} com sucesso!`);
            window.location.href = '/codigos/src/public/paginas/cursos.html';

        } catch (error) {
            console.error("Erro ao salvar curso:", error);
            alert("Falha ao salvar o curso. Verifique os dados e tente novamente.");
        }
    });
});