README

NFC_SERVER 

an example of an app server in Node & Express that provides: 

1. a socket server on port 51717
- accepts socket connections from a TCP client implemented on the Raspberry Pi
- accepts messages from the client which contain NFC transactions and status events 

2. a web server and RESTful API on port 3000 which:
- serves a webapp to web clients to monitor NFC activity 
- accepts Ajax requests from that webapp to display NFC transaction data. API calls respond to a request by returning a JSON object which can be directly referenced.

to start, open terminal window and run node with the myapi.js file as argument
    > node myapi.js

this starts the http server using port 3000

When a user now browses to http://<hostname>:3000, index.html will be loaded to the browser (served by the express webserver implemented in myapi.js) 

the client-side code displays a list of NFC transactions, polling the server using AJAX requests for new transations. 