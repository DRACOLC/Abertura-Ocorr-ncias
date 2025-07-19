const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

async function gerarPDF(respostas) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const fileName = `resposta_${Date.now()}.pdf`;
    const pdfPath = path.join(__dirname, '..', 'uploads', fileName);

    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(18).text('Formulário de Ocorrência - PROCISA', { align: 'center' });
    doc.moveDown(1.5);

    for (const [chave, valor] of Object.entries(respostas)) {
      doc.fontSize(12).fillColor('black').text(`${chave}:`, { continued: true, underline: true });
      doc.text(` ${valor}`, { underline: false });
      doc.moveDown(0.7);
    }

    doc.end();

    writeStream.on('finish', () => resolve(pdfPath));
    writeStream.on('error', reject);
  });
}

module.exports = { gerarPDF };
