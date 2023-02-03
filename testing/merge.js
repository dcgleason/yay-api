var convertapi = require('convertapi')('vlman1y8KNerUdy7');

convertapi.convert('merge', {
    Files: [
        'https://us1.pdfgeneratorapi.com/api/v4/documents/20772/6f3e2310eaa7c364c93bc273257837bd/share',
        'https://us1.pdfgeneratorapi.com/api/v4/documents/20772/fc9ae15eac003cdb5f6f8a0af0187e9e/share',
    ],
    StoreFile: true,
}, 'pdf').then(function(result) {
    console.log(result.file.url);
});