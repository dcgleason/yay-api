var pg = require('pg');
var format = require('pg-format');
const { Pool, Client } = require('pg')


const pool = new Pool({
  host: 'localhost',
  user: 'euxdyohv',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})


const getUniqueID = async () => {
  var existingIDs = [];
  var conString = "postgres://euxdyohv:9Y4d0NZjgf3DWhHynwouaQIWPc2hHQNr@rajje.db.elephantsql.com/euxdyohv" //Can be found in the Details page
  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
  })
    const {rows} = await client.query(`SELECT id FROM bundles`)
    const rowsString = JSON.stringify(rows);
    const array = rowsString.split('{"id":');
    const splicedArray = []
    const nonNumbers = []
    for(var i=0; i<array.length; i++){

      if(array[i].length>2 && array[i].length<4){
        splicedArray.push(array[i].substring(0,1))
      }
      else if(array[i].length>3 && array[i].length<5){
        splicedArray.push(array[i].substring(0,2))
      }
      else if(array[i].length>4 && array[i].length<6){
        splicedArray.push(array[i].substring(0,3))
      }
      else if (array[i].length>5 && array[i].length<7){
         splicedArray.push(array[i].substring(0,4))
      }
      else if (array[i].length>6 && array[i].length<8){
         splicedArray.push(array[i].substring(0,5))
      }
      else if (array[i].length>7 && array[i].length<9){
         splicedArray.push(array[i].substring(0,6))
      }
      else if (array[i].length>8 && array[i].length<10){
         splicedArray.push(array[i].substring(0,7))
      }
      else if (array[i].length>9 && array[i].length<11){
         splicedArray.push(array[i].substring(0,8))
      }
      else if (array[i].length>10 && array[i].length<12){
         splicedArray.push(array[i].substring(0,9))
      }
      else if (array[i].length>11 && array[i].length<13){
         splicedArray.push(array[i].substring(0,10))
      }
      else if (array[i].length>12 && array[i].length<14){
         splicedArray.push(array[i].substring(0,11))
      }
        
      else {
        nonNumbers.push(array[i])
      }
      }
     // console.log(splicedArray)
     // console.log(typeof rowsString)
      const rowsInt = [];

      for(var j = 0; j<splicedArray.length; j++){
        rowsInt.push(parseInt(splicedArray[j] + ' '))
      }
      rowsInt.unshift(' ')

      return rowsInt
 
    }

//getUniqueID();


const getBundles = () => {
    var conString = "postgres://euxdyohv:9Y4d0NZjgf3DWhHynwouaQIWPc2hHQNr@rajje.db.elephantsql.com/euxdyohv" //Can be found in the Details page
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query(`SELECT * FROM bundles`, function(err, result) {
        // if(err) {
        //   return console.error('error running query', err);
        // }
        console.log("results getBundles" + result.rows);
        console.log('results inside getBundles');
      });
    });
  }

  
  const createBundle = async (obj) => {
    const unique = obj.values[1]
    const name = obj.values[0]
    const values = [name, unique]
    const text = `INSERT INTO bundles (id, name) VALUES (%1$L, %2$L) RETURNING *`
    var sql = format(text, unique, name.toString());
    console.log("sqL"+sql);
    var conString = "postgres://euxdyohv:9Y4d0NZjgf3DWhHynwouaQIWPc2hHQNr@rajje.db.elephantsql.com/euxdyohv" //Can be found in the Details page
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err){
            console.log('error connecting to client POSTGRESQL');
        }
        else{
    client.query(sql, function(err, result) {
        if(err) {
            return console.error('error running query!', err);
          }
          console.log(result.rows);
          // >> output: 2018-08-23T14:02:57.117Z
          client.end();
        })
    };
}
    )};



  const objDelete = {
      text: "DELETE FROM bundles WHERE unique= $1",
      values: ['uniqueNumber']
  }
const deleteBundle = (body) => {

    const {text, values} = body
    var conString = "postgres://euxdyohv:9Y4d0NZjgf3DWhHynwouaQIWPc2hHQNr@rajje.db.elephantsql.com/euxdyohv" //Can be found in the Details page
    var client = new pg.Client(conString);
    client
        .query(text, values)
        .then(res => {
             console.log(res.rows[0]) // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
})
.catch(e => console.error(e.stack))
client.end();
}
  

module.exports = {
    getBundles,
    createBundle,
    deleteBundle,
    getUniqueID
  }