/**
 * NFC_CLIENT.JS
 * a JSON API request - an ajax request to a HTTP server which returns a JSON object 
 * 
 * When a user browses to http://localhost:3000, index.html is loaded, which then 
 * loads and executes this code to list  all the transactions, newest at the top
 *
 *  the JSON object return by the API is of the form 
 *  { ID  : '01',
 *    tag : 'message',
 *  }
 * @author Robert Drummond
 * Copyright (c) 2013 Pink Pelican NZ Ltd <bob@pink-pelican.com>
 */

window.onload = function() {
    var url, 
        response,
        data,
        jqxhr;  

    var txId = 0;

    // Encode the user's input as query parameters in a URL
    var url = document.URL+'tx/'; 
    // var url += txId;  // to select just one entry in txList table

    console.log('sending Ajax query to '+url);    

    // send API request to server URL as HTTP GET
    jqxhr = $.getJSON( url, function(data) {
        
        $('#transaction').html('<p></p>');
        console.log('API response received'+JSON.stringify(data)+' length= '+data.length);    
        for( var i=(data.length-1) ; i >= 0; i-- ) {
          $('#transaction').append('<p>'+data[i].ID+' '+data[i].tag+'</p>');
        }
      } 
    ); 
}; 




