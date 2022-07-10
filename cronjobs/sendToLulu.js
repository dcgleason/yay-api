var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()


var options = {
    method: 'POST',
    url: 'https://api.lulu.com/print-jobs/',
    headers: {
      'Cache-Control': 'no-cache',
      'Authorization': 'Check Authentication menu',
      'Content-Type': 'application/json'
    },
    body: {
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
  },
    json: true,
    };




const sendToLulu = () => {
axios
  .get('https://example.com/todos')
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });



}


    cron.schedule('* * 12 * * 0-6', () => {
                console.log('Sending messages / bundles to LuLu after 5 days');
                sendToLulu()
               
      }, {
                scheduled: false,
                timezone: "America/New_York"
      });