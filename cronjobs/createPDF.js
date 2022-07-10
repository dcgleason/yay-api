const PDFDocument = require('pdfkit');
const fs = require('fs');
const Gift = require("../models/Gift")


const getOrdersToSendToLulu = () => {
    var sixDays = 518400 * 1000 
    var fiveDays = 432000 * 1000
    var fiveDaysAgo = new Date(Date.now() - fiveDays) // 5 days ago in ISOdate format
    var sixDaysAgo = new Date(Date.now() - sixDays) // 6 days ago in ISODate - which is the format of the MongoDB timestamp
  
// query db for gifts created between 5 and 6 days ago and fiveDays in the gift object is true 
    const toLuluArray = await Gift.find({ createdAt: { $gte: fiveDaysAgo, $lte: sixDaysAgo } }, { fiveDays: true});

    if(toLuluArray.length != 0){ // if there are gifts... (need to verify that this is an array)

    for(var i = 0; i<toLuluArray.length; i++){

        if(toLuluArray[i].messages.length != 0) { // if there are messages in the gift object

        // Create a document
        const doc = new PDFDocument();
        
        // Pipe its output somewhere, like to a file or HTTP response
        doc.pipe(fs.createWriteStream('created_pdfs/test.pdf')); // 

        for(var j = 0; j<toLuluArray[i].messages.length; j++){ // loop through the messages and add them to the document - not sure this works this way.... : / 
        doc
          .font('fonts/PalatinoBold.ttf')
          .fontSize(14)
          .text("The community of people around you have something to say to you...")
          .text("From" + toLuluArray[i].messages[j].question_responses[i]+ ". \n " + // need to validate that there is a message before creating it - or else it's a blank answer
          "Question 1: " +
          toLuluArray[i].messages[j].question_responses[1] + "/n"+
          "Question 2: " +
          toLuluArray[i].messages[j].question_responses[2] + "/n"+
          "Question 3: " +
          toLuluArray[i].messages[j].question_responses[3] + "/n"+
          "Question 4: " +
          toLuluArray[i].messages[j].question_responses[4] + "/n"+
          "Question 5: " +
          toLuluArray[i].messages[j].question_responses[4] + "/n"+
          "Extra words: " +
          toLuluArray[i].messages[j].question_responses[6], 100, 100); // need to figure out what happens when the text goes to the next page
        }
        // could add some final words on a final page... 
    
        // Finalize PDF file
        doc.end();
        
        }
        }
    }
    }



cron.schedule('* * 12 * * 0-6', () => {
    console.log('Getting orders that are ready to send to Lulu ready by creating a pdf for each'); // need to find a way to delete pdf after we create and send it, or else they will pill up
    getOrdersToSendToLulu()
   
}, {
    scheduled: false,
    timezone: "America/New_York"
});