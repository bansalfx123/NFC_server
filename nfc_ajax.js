/**
 * NFC_CLIENT.JS
 * a JSON API request - an ajax request to a HTTP server which returns a JSON object 
 * 
 * When a user browses to http://localhost:3000, index.html is loaded, which then 
 * loads and executes this code
 *
 *  the JSON object return by the API is of the form 
 *  { 'tag1' : 'value',
 *    'tag2' : 'value',
 *  }
 */

window.onload = function() {
    var url, 
        response,
        data,
        jqxhr;  

    var txId = 'TEST 001';

    // Encode the user's input as query parameters in a URL
    var url = document.URL+'tx/'+txId; 

    // send API request to server URL as HTTP GET
    jqxhr = $.getJSON( url, function(data) {
        console.log('API response received');    
        $('#transaction').html('transaction '+data['tag1']+' '+data['tag2']);        
      } 
    ); 
}; 




