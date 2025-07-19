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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
