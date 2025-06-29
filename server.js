// ARQUIVO: server.js (VERSÃO CORRIGIDA PARA A NOVA ESTRUTURA)

const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
// A porta é definida pela Fly.io, não precisamos mais do 3000 fixo
const port = process.env.PORT || 8080; 

// --- CORREÇÃO DOS CAMINHOS ---
// O servidor agora sabe que o db.json está em /data e o site em /public
const apiRouter = jsonServer.router(path.join(__dirname, 'data', 'db.json'));
const staticPath = path.join(__dirname, 'public');

// Rota para a API (continua /api)
app.use('/api', apiRouter);

// Rota para servir os arquivos estáticos
app.use(express.static(staticPath));

// Rota "catch-all" para direcionar qualquer outra requisição para o index.html
app.get('*', (req, res) => {
    // Aponta para o index.html dentro da pasta public/paginas
    res.sendFile(path.join(staticPath, 'paginas', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor Conecta Rural rodando na porta ${port}`);
});