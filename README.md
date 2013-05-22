README

NFC_SERVER 
==========
This is part of the RPI_NFC Project - the RaspberryPi as an NFC Reader

PORTS used
--------------------
3000: 	HTTP server for servicing web browser clients
51717:	TCP server for processing RPi messages

SERVER-SIDE
===========
nfc_server.js is an app server in Node & Express that provides: 

1. a socket server on port 51717
- accepts socket connections from the TCP client implemented on the Raspberry Pi
- accepts messages from the client which contain NFC transactions and status events encoded as JSON strings

2. a web server and RESTful API on port 3000 which:
- serves a webapp to web clients which want to monitor NFC activity 
- accepts Ajax requests from this webapp to display NFC transaction data. API calls respond to a request by returning a JSON object which can be directly referenced.

When the RPi sends a new NFC transaction record, the server adds it to its in-memory transactions table. the contents are sent to the browser in response to an API request for all transactions
GET HTTP://<hostname>/tx

its also possible to retrieve a single transaction, e.g. 
GET HTTP://<hostname>/tx/0


CLIENT SIDE
===========
The client side web app is implemented using the Bootstrap UI framework.
nfc_ajax.js contains client code
- on document load, it starts an interval timer to poll the server
- on timer tick, the client app sends an ajax request to the server to retrieve the uptodate list of transactions, and displays the results in a table.


To run the application
======================
to start the server, open terminal window and run node with the nfc_server.js file as argument
    > node nfc_server.js 

this starts both the http server and a tcp server listening on their different ports.

When a user now browses to http://<hostname>:3000, index.html will be loaded to the browser (served by the express webserver implemented in nfc_server.js) 
the client-side code displays a list of NFC transactions, polling the server using AJAX requests for new transations. 



Copyright (c) 2013 Pink Pelican NZ Ltd <bob@pink-pelican.com>
