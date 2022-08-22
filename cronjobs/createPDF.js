
const fs = require('fs');
const Gift = require("../models/Gift")
const PDFMake = require('pdfmake');

var fonts = {
	Roboto: {
		normal: '../fonts/Roboto/Roboto-Regular.ttf',
		bold: '../fonts/Roboto/Roboto-Medium.ttf',
		italics: '../fonts/Roboto/Roboto-Italic.ttf',
		bolditalics: '../fonts/Roboto/Roboto-MediumItalic.ttf'
	}
};

var printer = new PDFMake(fonts);

var docDefinition = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
	]
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
pdfDoc.end();

