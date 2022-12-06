var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
gapi.load('client', init);

const { google } = require("googleapis");

const REFRESH_TOKEN = '1//04_0mPGex6Y1ZCgYIARAAGAQSNwF-L9IrLa7yOjkwcn8Cdm0ziFaM9Ux4lTY5Fy6IfccBhrFekhf6h1OFKESZ6ZFFLMZfmN5mGbA';
const CLIENT_ID = '764289968872-1not9lssu1fr00vvg117r3b9e01gckql.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

//initialize google drive
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//file path for out file
const filePath = path.join(__dirname, 'filename.format');

//function to upload the file
async function uploadFile() {
    try{
      const response = await drive.files.create({
            requestBody: {
                name: 'hero.png', //file name
                mimeType: 'image/png',
            },
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(filePath),
            },
        });  
        // report the response from the request
        console.log(response.data);
    }catch (error) {
        //report the error message
        console.log(error.message);
    }
}  

//delete file function
async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: 'File_id',// file id
        });
        console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
  }

  //create a public url
async function generatePublicUrl() {
    try {
        const fileId = '19VpEOo3DUJJgB0Hzj58E6aZAg10MOgmv';
        //change file permisions to public.
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
            role: 'reader',
            type: 'anyone',
            },
        });

        //obtain the webview and webcontent links
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }


// This is a simple sample script for retrieving the file list.
drive.files.list(
  {
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  },
  (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
    const files = res.data.files;
    console.log(files);
  }
);




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

saveToDrive('test.pdf', "testing this string");

    // cron.schedule('* * 12 * * 0-6', () => {
    //             console.log('Sending messages / bundles to LuLu after 5 days');
    //             sendToLulu()
               
    //   }, {
    //             scheduled: false,
    //             timezone: "America/New_York"
    //   });