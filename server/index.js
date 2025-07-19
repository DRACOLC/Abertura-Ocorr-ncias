const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { gerarPDF } = require('./pdfGenerator');
const { enviarEmail } = require('./emailSender');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta client
app.use(express.static(path.join(__dirname, '../client')));

// Rota principal para abrir o formulário no navegador
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Rota para receber os dados do formulário
app.post('/enviar', upload.array('fotos', 10), async (req, res) => {
  try {
    const respostas = req.body;
    const fotos = req.files;

    const pdfPath = await gerarPDF(respostas);

    await enviarEmail({
      respostas,
      pdfPath,
      fotos
    });

    // Limpa arquivos temporários
    fs.unlinkSync(pdfPath);
    fotos.forEach(f => fs.unlinkSync(f.path));

    res.status(200).send('Ocorrência enviada com sucesso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar ocorrência.');
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { gerarPDF } = require('./pdfGenerator');
const { enviarEmail } = require('./emailSender');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta client
app.use(express.static(path.join(__dirname, '../client')));

// Rota principal para abrir o formulário no navegador
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Rota para receber os dados do formulário
app.post('/enviar', upload.array('fotos', 10), async (req, res) => {
  try {
    const respostas = req.body;
    const fotos = req.files;

    const pdfPath = await gerarPDF(respostas);

    await enviarEmail({
      respostas,
      pdfPath,
      fotos
    });

    // Limpa arquivos temporários
    fs.unlinkSync(pdfPath);
    fotos.forEach(f => fs.unlinkSync(f.path));

    res.status(200).send('Ocorrência enviada com sucesso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar ocorrência.');
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
