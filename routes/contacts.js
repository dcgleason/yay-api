
const express = require("express");
const vCardParser = require('vcard-parser');
const router = express.Router();

require("dotenv").config({ path: require("find-config")(".env") });


const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file was uploaded.');
    }
  
    const vCards = vCardParser.parseMultiple(req.file.buffer.toString('utf8'));
    const csvData = vCardsToCsv(vCards);
  
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csvData);
  });
  
  function vCardsToCsv(vCards) {
    const csvHeader = 'Name,Email\n';
    const csvRows = vCards.map((vCard) => {
      const name = vCard.get('N') ? vCard.get('N').formatted : '';
      const email = vCard.get('EMAIL') ? vCard.get('EMAIL').value : '';
      return `"${name}","${email}"`;
    });
  
    return csvHeader + csvRows.join('\n');
  }
  



