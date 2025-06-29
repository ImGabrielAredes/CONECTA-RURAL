// ARQUIVO: server.js (VERSÃO FINAL E CORRIGIDA)
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Agora os caminhos são relativos à raiz do container (/app)
const apiRouter = jsonServer.router(path.join(__dirname, 'data', 'db.json'));
const staticPath = path.join(__dirname, 'public');

app.use('/api', apiRouter);
app.use(express.static(staticPath));

// Rota "catch-all" para direcionar qualquer outra requisição para o index.html
app.get('*', (req, res) => {
    // Aponta para o index.html dentro da pasta public/paginas
    res.sendFile(path.join(staticPath, 'paginas', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor Conecta Rural rodando na porta ${port}`);
});