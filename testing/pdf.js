const request = require('request');


//https://us1.pdfgeneratorapi.com/dashboard

const options = {
  method: 'POST',
  url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
  headers: {
    'content-type': 'application/json',
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NDUwOTI2OX0.O8wV3eJW-QC1GRRi0jjsaq7PSq0v_r6voojD9HJXPx8'
  },
  body: {
    template: {
      id: '569200',
      data: {text: "testing testing from api", image: 'image', qrcode: 'https://openai.com/blog/chatgpt/'}
    },
    format: 'pdf',
    output: 'url',
    name: 'BundleTest'
  },
  json: true
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

