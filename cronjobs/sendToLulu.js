var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()
const fs = require('fs');
const AWS = require('aws-sdk');
//const htmlpdf = require('html-pdf');

const puppeteer = require('puppeteer');

async function convertHTMLToPDF(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
}


// AWS.config.loadFromPath('./config.json'); // Load AWS credentials from config.json


// config.json
//{
//    "accessKeyId": "YOUR_ACCESS_KEY_ID",
 //   "secretAccessKey": "YOUR_SECRET_ACCESS_KEY"
//  }

// html template is the template for the page it is an html string -- what we need is a template for the left page and a template for the right page (and keep them together)
// ex. const htmlTemplate = '<html><body><div>{{message}}</div><div><img src="{{image}}" /></div></body></html>';
// messages is the image / message object for the page
// s3 bucket is for the Amazon S3 bucket
// s3 key is the key for the Amazon S3 bucket


const message = 'This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it.  '

const messages = [ 
    {
        message: message, 
        name: 'John Doe',
        image: null
    }
]


const htmlTemplate = '<html><body><div>{{message}}</div><div><img src="{{image}}" /></div></body></html>';

// need to make sure the the text is not too long for the page  -- if it is too long, we need to split it up and create multiple pages
async function createPDFAndUploadToS3(htmlTemplate, messages, s3Bucket, s3Key) {
  // Compile the HTML pages with the given messages and images
  let compiledHTML = '';

  messages.sort((a, b) => { // sorts the messages in alphabetical order by the name property
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
});

  for (let i = 0; i < messages.length; i++) {

     // Split the message into multiple pages if it exceeds a certain number of characters (lines 33 to 46)
     const maxWordsPerPage = 350;
     let words = messages[i].message.split(' '); // array of total words
     let message = ''; // will hold the message for each page
     if(words.length > maxWordsPerPage ) {  // if the message is too long, we need to split it up into multiple pages
            for(let j = 0; j < words.length; j++) { // loop through the words
                message += ' ' + words[j];
                if(j % maxWordsPerPage === 0 && j !== 0) { // when the message is too long, we need to split it up into multiple pages
                    compiledHTML += htmlTemplate //
                        .replace('{{message}}', message) // replace the message with the message for page 1
                        .replace('{{image}}', messages[i].image); // replace the image with the image for page 1
                   
                
                }
         message = ''; // reset the message for the next page
        while(j < words.length) {  //while there are still words left, add them to the message (this will be the second page text)
                message += ' ' + words[j];
                j++;
            }

         compiledHTML += htmlTemplate
         .replace('{{message}}', message)

         if(messages[i].imageTwo) { // if there is a second image, add it to the page
             compiledHTML += htmlTemplate
             .replace('{{image}}', messages[i].imageTwo);  
     }

            }
        }

        compiledHTML += htmlTemplate
        .replace('{{message}}', message)
        if(messages[i].imageTwo) {
            compiledHTML += htmlTemplate
            .replace('{{image}}', messages[i].imageTwo);  
    }
    }


  // Convert the compiled HTML to a PDF
  const pdfBuffer = convertHTMLToPDF(compiledHTML);




  // Upload the PDF to Amazon S3
  const s3 = new AWS.S3();
  const params = {
    Body: pdfBuffer,
    Bucket: s3Bucket,
    Key: s3Key,
    ContentType: 'application/pdf',
  };
   s3.putObject(params).promise();

  // Return the downloadable link of the PDF
  console.log( `https://${s3Bucket}.s3.amazonaws.com/${s3Key}`);


}


createPDFAndUploadToS3(htmlTemplate, messages, 'dgbundle1', 'PHtjLSSTTu76qBSLHmAT+OwwHbPL3lECTD5CbvKp');

  // OR

  /*
    // Return a downloadable link from Amazon S3 for the PDF
  return s3.getSignedUrl('getObject', {
        Bucket: s3Bucket,
        Key: s3Key,
        Expires: 60 // Link will expire in 60 seconds
      });
    */
// will need to loop through all the messages and associated imagees and send bundle (compiled pages) to lulu

async function generatePDF(templatePath, text, imagePath, s3Bucket, s3Key) { // THIS IS PER PAGE (LEFT AND RIGHT)
  // Read in the HTML template
  const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholder text in the template with the provided text -- 
// QUESTION: DOES THIS NEED TO BE LOOPED THROUGH? 
// HOW DO WE DO THIS PER PAGE? WHAT IF THE PAGE HAS MULTIPLE IMAGES? 
// WHAT IF THE PAGE HAS NO IMAGES? 
// WHAT IS THE PAGE HAS TOO MUCH TEXT TO FIT? -- WE WILL NEED TO DO IF STATEMENTS AND CHECK THE LENGTH OF THE TEXT AND THEN ADD THE TEXT TO THE NEXT PAGE

  const html = template.replace(/{{text}}/g, text);



  // Add the image to the template
  html = html.replace('{{image}}', `<img src="${imagePath}" alt="image">`);

  // Convert the HTML to a PDF
  const pdfBuffer =  htmlpdf.create(html).toBuffer();

  // Create an instance of the AWS SDK for JavaScript
  const s3 = new AWS.S3();

  // Upload the PDF to Amazon S3
   s3.putObject({
    Bucket: s3Bucket,
    Key: s3Key,
    Body: pdfBuffer
  }).promise();


}
//

// example

//const templatePath = '/path/to/template.html';
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
//const imagePath = '/path/to/image.jpg';
//const s3Bucket = 'my-s3-bucket';
//const s3Key = 'my-pdf.pdf';

// const downloadLink =  generatePDF(templatePath, text, imagePath, s3Bucket, s3Key);
// console.log(downloadLink); // https://my-s3-bucket.s3.amazonaws.com/my-pdf.pdf?AWSAccessKeyId=...

//send to lulu function
const sendToLulu = async () => {

 const baseurl = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
 const data = new URLSearchParams()
 data.append('client_key', process.env.CLIENT_KEY)
 data.append('client_secret', process.env.CLIENT_SECRET)
 data.append('grant_type', 'client_credentials')


 axios({ 
    method: 'post',
    url: baseurl,
    data: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': process.env.AUTH,
    },

}).then((response)=>{
    console.log(response.data)
    console.log('this is the access token....... \n' + `access token: \n ${response.data.access_token}`)
    var lulu_access_token = response.data.access_token;

            var url =  'https://api.lulu.com/print-jobs/'
            var print_data = {
                "contact_email": "test@test.com",
                "external_id": "demo-time",
                "line_items": [
                    {
                        "external_id": "item-reference-1",
                        "printable_normalization": {
                            "cover": {
                                "source_url": "https://www.dropbox.com/s/7bv6mg2tj0h3l0r/lulu_trade_perfect_template.pdf?dl=1&raw=1"
                            },
                            "interior": {
                                "source_url": "https://www.dropbox.com/s/r20orb8umqjzav9/lulu_trade_interior_template-32.pdf?dl=1&raw=1"
                            },
                            "pod_package_id": "0600X0900BWSTDPB060UW444MXX"
                        },
                        "quantity": 30,
                        "title": "My Book"
                    }
                ],
                "production_delay": 120,
                "shipping_address": {
                    "city": "L\u00fcbeck",
                    "country_code": "GB",
                    "name": "Hans Dampf",
                    "phone_number": "844-212-0689",
                    "postcode": "PO1 3AX",
                    "state_code": "",
                    "street1": "Holstenstr. 48"
                },
                "shipping_level": "MAIL"
        }
        var options = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': 'Authorization: Bearer ' + lulu_access_token,
                'Content-Type': 'application/json'
            }
            };

        axios.post(url, print_data, options)
        .then(function (resp) {
            console.log(resp);
        })
        .catch(function (error) {
            console.log(error);
        });


})
}


    // cron.schedule('* * 12 * * 0-6', () => {
    //             console.log('Sending messages / bundles to LuLu after 5 days');
    //             sendToLulu()
               
    //   }, {
    //             scheduled: false,
    //             timezone: "America/New_York"
    //   });