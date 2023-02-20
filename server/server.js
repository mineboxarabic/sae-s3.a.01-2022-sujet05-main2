/**
 * @file Server-side code for a web API that allows users to sign up, log in, and perform other operations on a MongoDB database.
 * @copyright HASKY, 2021
 */

const express = require('express');
const crypto = require('crypto');
/**
 * @module body-parser
 * @description Parse incoming request bodies in a middleware before the handlers.
 */
const bodyParser = require('body-parser');
/**
 * @module mongoose
 * @description Connect to and interact with MongoDB databases.
 */
const { mongo } = require('mongoose');
/**
 * @constant
 * @type {express}
 * @description Create an instance of an Express app.
 */
const app = express();
/**
 * @constant
 * @type {number}
 * @description Set the port the app will listen on.
 */
const port = 3001;
/**
 * @constant
 * @type {string}
 * @description Set the URI for the MongoDB database.
 */
const uri = 'mongodb+srv://Adem29:ApiIut2022@saegroupe5.xkyybtz.mongodb.net/?retryWrites=true&w=majority'
/**
 * @constant
 * @type {MongoClient}
 * @description Require the MongoClient to connect to the MongoDB database.
 */
let MongoClient = require('mongodb').MongoClient;
/**
 * @constant
 * @type {Array}
 * @description Create an empty array to store all the clients from the database.
 */
let array = []

/**
 * Connect to the database and retrieve all the clients, then store them in the 'array' variable.
 * @function
 * @param {string} uri - The URI for the MongoDB database.
 * @param {function} callback - The callback function to be executed after the connection and retrieval.
 */
MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  /** @type {Object} */
  var dbo = db.db("SAE");
  dbo.collection("Accounts").find({}).toArray(function(err, result) {
    if (err) throw err;
    array = result
    db.close();
  });
});
/**
 * Use the body-parser middleware to parse JSON and urlencoded request bodies.
 * @function
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Set the 'Access-Control-Allow-Origin' and 'Access-Control-Allow-Headers' headers for all routes.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function in the stack.
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

});
/*
  Functions
*/
//==================================================================================================

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}
/**
 * Hash a password using a salt.
 * @function
 * @param {string} password - The password to be hashed.
 * @param {string} salt - The salt to use when hashing the password.
 * @returns {string} The hashed password.
 */
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}
function checkPassword(password, salt, hash) {
  const newHash = hashPassword(password, salt);
  return newHash === hash;
}

//==================================================================================================
/*
  Routes 
*/
//==================================================================================================
/**
 * Retrieve all clients from the database and send them in the response.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/getCLients', function (req,res){
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SAE");
    dbo.collection("Accounts").find({}).toArray(function(err, result) {
      if (err) throw err;
      array = result
      db.close();
      res.send(array)
    });
  });
  
  
})
/**
 * Check if a user's login credentials are correct and send the result in the response.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post('/login', function (req,res){
  // Get the login email and password from the request body
  let Email = req.body.email;
  let Password = req.body.password;
  const salt = Password;
  const hash = hashPassword(Password, salt);
  try{
     // Check if any of the clients in the 'array' have matching email and password
    array.forEach(element => {
      if(element.email === Email && element.password === hash){
        console.log("password correct")
        res.send(true)
      }
    });
    // If no match was found, send false in the response
    res.send(false)
  }
  catch{
  }

})


/**
 * Add a new client to the database.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.email - The email of the new client.
 * @param {string} req.body.password - The password of the new client.
 * @param {string} req.body.userName - The username of the new client.
 * @param {string} req.body.Fourniseur - The fourniseur of the new client.
 * @param {string} req.body.mois_Dernier - The mois_Dernier of the new client.
 * @param {string} req.body.Favoris - The Favoris of the new client.
*/ 
app.post('/addClient', function (req,res){
  //get data from url
  let Email = req.body.email;
  let Password = req.body.password;
  const salt = Password;
  const hash = hashPassword(Password, salt);

  console.log(`
  email: ${Email}
  password: ${hash}
`);
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SAE");

    var myobj = 
    { 
    userName: "User name",
    email: Email,
    password: hash,
    Fourniseur: "fourniseur",
    mois_Dernier: "mois dernier",
    Favoris:[1,2,3]
    };
    
    dbo.collection("Accounts").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.send("ok")
})
/**
 * Listen on the port 3000.
 * @function
 * @param {number} port - The port to listen on.
 * @param {function} callback - The callback function to be executed after the connection.
  */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});