/**
 * nfc_server.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * A node web Appserver running on port 3000
 * Uses the Express node package. 
 * serves the index.html and client-side Javascript files
 * responds to AJAX requests to the API with a JSON object containing an NFC transaction 
 * 
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Robert Drummond
 * (C) 2013 Fatkahawai
 */

var http      = require('http');
var express   = require('express');

var app       = express();

var txList    = [ { tag1: 'Tom',   tag2: 'Bosley'},
                  { tag1: 'James', tag2: 'Kirk'}
                ];

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
//
  app.configure(function() {
    app.use(express.favicon());
    app.use(express['static'](__dirname )); 
  });

// ------------------------------------------------------------------------
// set up Express routes - middleware to handle incoming requests
//

// Express route for incoming requests for a customer name
app.get('/tx/:id', function(req, res){
  // send an object as a JSON string
 console.log('id = '+req.params.id);
 res.send(txList[req.params.id]);
}); // apt.get()

// Express route for incoming requests for a list of all customers
app.get('/tx', function(req, res){
  // send an object as a JSON string
  console.log('all transactions');
  res.send(txList);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res){
  res.send('Unrecognised API call', 404);
});

// Express route to handle errors
app.use(function(err, req, res, next){
  if (req.xhr) {
    res.send(500, 'Oops, Something went wrong!');
  } else {
    next(err);
  }
}); // apt.use()

// ------------------------------------------------------------------------
// Start Express App Server on port 3000
//
app.listen(3000);
console.log('App Server is listening on port 3000');

