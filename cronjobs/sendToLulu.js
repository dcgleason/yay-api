var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()
const fs = require('fs');
const AWS = require('aws-sdk');
const htmlpdf = require('html-pdf');

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
  const pdfBuffer = await htmlpdf.create(html).toBuffer();

  // Create an instance of the AWS SDK for JavaScript
  const s3 = new AWS.S3();

  // Upload the PDF to Amazon S3
  await s3.putObject({
    Bucket: s3Bucket,
    Key: s3Key,
    Body: pdfBuffer
  }).promise();

  // Return a downloadable link from Amazon S3 for the PDF
  return s3.getSignedUrl('getObject', {
    Bucket: s3Bucket,
    Key: s3Key,
    Expires: 60 // Link will expire in 60 seconds
  });
}


// example

const templatePath = '/path/to/template.html';
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const imagePath = '/path/to/image.jpg';
const s3Bucket = 'my-s3-bucket';
const s3Key = 'my-pdf.pdf';

const downloadLink = await generatePDF(templatePath, text, imagePath, s3Bucket, s3Key);
console.log(downloadLink); // https://my-s3-bucket.s3.amazonaws.com/my-pdf.pdf?AWSAccessKeyId=...

//send to lulu function
const sendToLulu = async () => {

 const baseurl = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
 const data = new URLSearchParams()
 data.append('client_key', process.env.CLIENT_KEY)
 data.append('client_secret', process.env.CLIENT_SECRET)
 data.append('grant_type', 'client_credentials')


await axios({ 
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