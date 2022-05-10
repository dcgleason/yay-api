
const url = 'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/test'

const { MongoClient } = require("mongodb");
// Connection URI
const uri =
  "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";
// Create a new MongoClient
const client = new MongoClient(url);



async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("sample_mflix").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);




const mongoConnect = async () => {

try {
 const client = new MongoClient(url);
await client.connect();

const movies = client.db("sample_mflix").collection("movies");
const update = await movies.updateMany({ 'imdb.votes': { $gt: 1188 } },
{$set: {'plot': "This plot has been updated!!!" }});
console.log('update happend')
if(update){
console.log('find about to start')
movies.find(
    {$and: [{'plot': "This plot has been updated!!!"}, {'title': 'Body Melt'}]}).forEach(function(data) {
     console.log("movie title: " + data.title)
    })
    console.log('find happened');
} 
}
finally {
await client.close();
}
}

//mongoConnect();

messagesByGiftCode=[];

var gift = [  {gift: {giftCode: 1235}},  {gift: {giftCode: 1254}},  {gift: {giftCode: 1134}},  {gift: {giftCode: 1634}},  {gift: {giftCode: 9853}}]
  for(var i = 0; i<gift.length; i++){
    messagesByGiftCode.push( 'giftcode'+ i + " is "+ gift[i].gift.giftCode)
  }

  console.log(messagesByGiftCode)

  // if messageByGiftCode[i].includes(messages[i].giftCode)

// var fortnightAgo = new Date(Date.now() - 12096e5).getTime();
// console.log(fortnightAgo)


// var fortnightAway = new Date(Date.now() + 12096e5);
//   //var dbo = db.db("yay_gift_oders");
//   /*Return only the documents with the address "Park Lane 38":*/
// //  await client.connect();
//   // Establish and verify connection
//  // await client.db("yay_gift_oders").command({ ping: 1 });
//   var query = { 'tomatoes.viewer.rating': 3 };
//   var results = client.db('sample_mflix').collection('movies').find(query);
//   console.log("results: "+ results);
//   db.close();