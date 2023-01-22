var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()
const fs = require('fs');
const AWS = require('aws-sdk');
const sizeOf = require('image-size')
const path = require('path');
var html_to_pdf = require('html-pdf-node');

//need to make sure the image path makes sense from the perspective of the final pdf location

const imageReplacement = async () => {

const  html = '<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">\n<head>\n<title></title>\n\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>\n <br/>\n<style type="text/css">\n<!--\n\tp {margin: 0; padding: 0;}	.ft10{font-size:14px;font-family:Times;color:#231f20;}\n\t.ft11{font-size:44px;font-family:Times;color:#231f20;}\n\t.ft12{font-size:20px;font-family:Times;color:#231f20;}\n\t.ft13{font-size:14px;line-height:27px;font-family:Times;color:#231f20;}\n\t.ft14{font-size:14px;line-height:26px;font-family:Times;color:#231f20;}\n\timg {\n    width: 50%;\n    float: right;\n    padding: 87px;\n}\n-->\n</style>\n</head>\n<body bgcolor="#A0A0A0" vlink="blue" link="blue">\n<div id="page1-div" style="position:relative;width:1836px;height:918px;">\n<img width="100%" height="auto" src="../images/chris.png" alt="background image"/>\n<p style="position:absolute;top:197px;left:90px;white-space:nowrap" class="ft10">M</p>\n<p style="position:absolute;top:251px;left:90px;white-space:nowrap" class="ft13">You are relentlessly thoughtful, selfless &amp; determined and you are going to be the best&#160;<br/>mother in the world. I only hope our child gets the majority of&#160;your genes, and maybe&#160;<br/>some of my red hair &amp; dimples sprinkled in&#160;</p>\n<p style="position:absolute;top:359px;left:90px;white-space:nowrap" class="ft13">I can’t wait to raise a family with you, grow old with you, and&#160;constantly fall in love with&#160;<br/>you, day-in and day-out.&#160;</p>\n<p style="position:absolute;top:440px;left:90px;white-space:nowrap" class="ft10">But don’t take my word for it.</p>\n<p style="position:absolute;top:494px;left:90px;white-space:nowrap" class="ft14">What a better way to celebrate the handwritten first draft queen herself than with a&#160;<br/>timeless collection of those who know you best &amp; love you most&#160;from near and far.&#160;</p>\n<p style="position:absolute;top:575px;left:90px;white-space:nowrap" class="ft10">Cheers to the best life with the best wife.</p>\n<p style="position:absolute;top:629px;left:90px;white-space:nowrap" class="ft13">Forever & always<br/>Hub </p>\n<p style="position:absolute;top:100px;left:90px;white-space:nowrap" class="ft11">Hub</p>\n<p style="position:absolute;top:841px;left:819px;white-space:nowrap" class="ft12">2</p>\n</div>\n</body>\n</html>';


// Read the image file and get its aspect ratio
const imgPath = '/image.jpg';
const img = fs.readFileSync(imgPath);
const imgSize = sizeOf(img)
const aspectRatio = imgSize.width / imgSize.height;

console.log('image height' + imgSize.height)
console.log('image width' + imgSize.width)


// Replace the image source with the image file
//html = html_string.replace('../images/chris.png', imgPath);

// Use javascript to set the width of the image element based on the aspect ratio

var final_html = html.replace('../images/chris.png', imgPath);

let options = { format: 'A4' };
console.log('html' + final_html);
let file = { content: final_html };

html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    console.log("PDF Buffer.url", pdfBuffer);
    var pdf = pdfBuffer
    fs.writeFile('testPDF7.pdf', pdf, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
  })

  
}

imageReplacement();





// const puppeteer = require('puppeteer');

// async function convertHTMLToPDF(html) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html);
//   const pdf = await page.pdf({ format: 'A4' });
//   await browser.close();
//   return pdf;
// }

//NEED to make sure the aspect ratio is presevered for all images, or else they will look stretched / distorted

// this preserves the aspect ratio of the image -- this is the code that needs to be added to the html-pdf library
// let img = document.getElementById("my-image");
// let aspectRatio = img.naturalWidth / img.naturalHeight;
// img.style.width = (aspectRatio * 100) + "%";
// img.style.height = "auto";

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


// const message = 'This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it. This is my message to you. I hope you like it.  '

// const messages = [ 
//     {
//         message: message, 
//         name: 'John Doe',
//         image: null
//     }
// ]


// const htmlTemplate = '<html><body><div>{{message}}</div><div><img src="{{image}}" /></div></body></html>';

// // need to make sure the the text is not too long for the page  -- if it is too long, we need to split it up and create multiple pages
// async function createPDFAndUploadToS3(htmlTemplate, messages, s3Bucket, s3Key) {
//   // Compile the HTML pages with the given messages and images
//   let compiledHTML = '';

//   messages.sort((a, b) => { // sorts the messages in alphabetical order by the name property
//     if (a.name < b.name) {
//         return -1;
//     }
//     if (a.name > b.name) {
//         return 1;
//     }
//     return 0;
// });

//   for (let i = 0; i < messages.length; i++) {

//      // Split the message into multiple pages if it exceeds a certain number of characters (lines 33 to 46)
//      const maxWordsPerPage = 350;
//      let words = messages[i].message.split(' '); // array of total words
//      let message = ''; // will hold the message for each page

//      // needs to be based on how the INDD file is structured 
     
//      if(words.length > maxWordsPerPage ) {  // if the message is too long, we need to split it up into multiple pages
//             for(let j = 0; j < words.length; j++) { // loop through the words
//                 message += ' ' + words[j];
//                 if(j % maxWordsPerPage === 0 && j !== 0) { // when the message is too long, we need to split it up into multiple pages
//                     compiledHTML += htmlTemplate //
//                         .replace('{{message}}', message) // replace the message with the message for page 1
//                         .replace('{{image}}', messages[i].image); // replace the image with the image for page 1
                   
                
//                 }
//          message = ''; // reset the message for the next page
//         while(j < words.length) {  //while there are still words left, add them to the message (this will be the second page text)
//                 message += ' ' + words[j];
//                 j++;
//             }

//          compiledHTML += htmlTemplate
//          .replace('{{message}}', message)

//          if(messages[i].imageTwo) { // if there is a second image, add it to the page
//              compiledHTML += htmlTemplate
//              .replace('{{image}}', messages[i].imageTwo);  
//      }

//             }
//         }

//         compiledHTML += htmlTemplate
//         .replace('{{message}}', message)
//         if(messages[i].imageTwo) {
//             compiledHTML += htmlTemplate
//             .replace('{{image}}', messages[i].imageTwo);  
//     }
//     }


//   // Convert the compiled HTML to a PDF
//   const pdfBuffer = convertHTMLToPDF(compiledHTML);




//   // Upload the PDF to Amazon S3
//   const s3 = new AWS.S3();
//   const params = {
//     Body: pdfBuffer,
//     Bucket: s3Bucket,
//     Key: s3Key,
//     ContentType: 'application/pdf',
//   };
//    s3.putObject(params).promise();

//   // Return the downloadable link of the PDF
//   console.log( `https://${s3Bucket}.s3.amazonaws.com/${s3Key}`);


// }

  

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