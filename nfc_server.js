/**
 * nfc_server.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * A node web Appserver running on port 3000
 * Uses the Express node package. 
 * serves the index.html and client-side Javascript files to a web browser.
 * responds to Aclient-side JAX requests to the server API with a JSON object 
 * containing an NFC transaction. 
 * 
 * also opens a Socket and listens on port 51717 for TCP messages from the 
 * Raspbery Pi.
 *
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Robert Drummond
 * Copyright (c) 2013 Pink Pelican NZ Ltd <bob@pink-pelican.com>
 */

// Node modules
//
var http       = require('http');
var express    = require('express');
var net        = require('net');    // node sockets
var JsonSocket = require('json-socket');

// servers 
//
var app        = express();  // http server
var tcpServer;              // tcp server

// port addresses
//
var tcpPortNo  = 51717;      // tcp socket port number
var httpPortNo = 3000;       // http port number

// NFC transactions list
// { id: 0, date: 'xxx', nfcModulationType: 'ISO/IEC 14443', baudRate: '100', ATQA: 'FF FF', UID: 'FF FF FF FF'}
var txList     = [ ];

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

// Express route for incoming requests for a single transaction
//
app.get('/tx/:id', function(req, res){
 var id = req.params.id;
  // send an object as a JSON string
 console.log('API request for transaction id = '+id);
 if( (id <0) || (id > txList.length) )
    res.send([{ error: 'No transactions found'}]);
 else
    res.send(txList[req.params.id]);
}); // apt.get()

// Express route for incoming requests for a list of all transactions
//
app.get('/tx', function(req, res){
  // send an object as a JSON string
  // console.log('API request for all transactions');
  if( txList.length <= 0 )
    res.send([{ error: 'No transactions found'}]);
  else
    res.send(txList);
}); // apt.get()

// Express route for any other unrecognised incoming requests
//
app.get('*', function(req, res){
  res.send('Unrecognised API call', 404);
});

// Express route to handle errors
//
app.use(function(err, req, res, next){
  if (req.xhr) {
    res.send(500, 'Oops, Something went wrong with our API!');
  } else {
    next(err);
  }
}); // apt.use()

console.log('\n=======================================================================');
// ------------------------------------------------------------------------
// Start Express App Server on port 3000
//
app.listen( httpPortNo );
console.log('HTTP App Server is listening on port '+httpPortNo);

// ------------------------------------------------------------------------
// Open Socket and listen on port 51717
//
tcpServer = net.createServer(function(socket) { 
  console.log('TCP client connected on ' + socket.remoteAddress +':'+ socket.remotePort);

  socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket

  socket.on('message', function(message) {
    console.log( 'TCP MESSAGE: received JSON: '+ message); 
//    socket.sendMessage({msg: 'ACK'});
  });

  socket.on('data', function(data) {
    console.log('TCP DATA: TCP server received JSON string '+data);

    // process JSON data here
    var tx = JSON.parse(data);
    console.log('parsed JSON result stringified: '+JSON.stringify(tx));
    
    tx.date = new Date();
    tx.id = txList.length;
    console.log('added id '+tx.id+' and Timestamp: '+JSON.stringify(tx));

    txList.push(tx);
    console.log('saved transaction to transactions list');
    //console.log('full txList: '+JSON.stringify(txList));

    // the RPi sometimes didnt get an ACK so hung in read, so i disabled the sending an ACK
    // socket.sendMessage({msg:'ACK'}); 
    // console.log('TCP send: sent ACK to client');
  });

  socket.on('end', function() {
    console.log('TCP END: TCP client disconnected');
  });

});

tcpServer.listen(tcpPortNo, function() { //'listening' listener
  console.log('server listening on port '+tcpPortNo);
  var address = tcpServer.address();
  console.log("opened server on %j", address);

});

tcpServer.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('ERROR: Port Address in use, retrying...');
      setTimeout(function () {
        tcpServer.close();
        tcpServer.listen(tcpPortNo);
      }, 1000);
    }
});

// tcpServer.close();

