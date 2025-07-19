// server/pdfGenerator.js
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

async function gerarPDF(respostas) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, '..', 'uploads', `resposta_${Date.now()}.pdf`);
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(16).text('Formulário de Ocorrência - PROCISA', { align: 'center' });
    doc.moveDown();

    Object.entries(respostas).forEach(([chave, valor]) => {
      doc.fontSize(12).text(`${chave}: ${valor}`);
      doc.moveDown(0.5);
    });

    doc.end();

    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', reject);
  });
}

module.exports = { gerarPDF };
