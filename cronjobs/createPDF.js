
const fs = require('fs');
const Gift = require("../models/Gift")
const PDFMake = require('pdfmake');

let font_path_one = (__dirname+'/fonts/Roboto/Roboto-Regular.ttf');
let font_path_two = (__dirname+'/fonts/Roboto/Roboto-Medium.ttf');
let font_path_three = (__dirname+'/fonts/Roboto/Roboto-Italic.ttf');
let font_path_four = (__dirname+'/fonts/Roboto/Roboto-MediumItalic.ttf');

var fonts = {
	Roboto: {
		normal: font_path_one,
		bold: font_path_two,
		italics: font_path_three,
		bolditalics: font_path_four
	}
};

var printer = new PDFMake(fonts);

var docDefinition = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines, test test test'
	]
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('pdfs/basic_two.pdf'));
pdfDoc.end();

