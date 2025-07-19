// server/emailSender.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function enviarEmail({ respostas, pdfPath, fotos }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ORIGEM,
      pass: process.env.EMAIL_SENHA
    }
  });

  const anexos = [
    {
      filename: path.basename(pdfPath),
      path: pdfPath
    },
    ...fotos.map(foto => ({
      filename: foto.originalname,
      path: foto.path
    }))
  ];

  const corpoTexto = Object.entries(respostas)
    .map(([chave, valor]) => `${chave}: ${valor}`)
    .join('\n');

  await transporter.sendMail({
    from: `"Formulário PROCISA" <${process.env.EMAIL_ORIGEM}>`,
    to: 'rubyocorrencia@gmail.com',
    subject: 'Nova Ocorrência Registrada',
    text: corpoTexto,
    attachments: anexos
  });
}

module.exports = { enviarEmail };
