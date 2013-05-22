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
 *    date: Date
 *  }
 * @author Robert Drummond
 * Copyright (c) 2013 Pink Pelican NZ Ltd <bob@pink-pelican.com>
 */

var POLL_PERIOD = 3000; // poll the server every 1 sec

var timerID;     // global timer ID so we can clear it
var cursor = -1;  // saves index of most recent transation displayed
var homeURL;     // URL of our home page, used for API calls


// runs when HTML loaded
//
window.onload = function() {

    homeURL = document.URL; 

    timerID = setInterval( pollServer, POLL_PERIOD );

};


// called every poll period
//

function pollServer(){
    var  url, 
         jqxhr;
    var  index = 0;  

    var  txId = 0; 

    // Encode the user's input as query parameters in a URL
    var url = homeURL+'tx/'; 
    // var url += txId;  // to select just one entry in txList table

    console.log('sending Ajax query to '+url);    

    // send API request to server URL as HTTP GET
    jqxhr = $.getJSON( url, function(data) {
        
        console.log('API response. '+data.length+' transactions received');
        console.log(' '+JSON.stringify(data) );    
        console.log('cursor is at id '+cursor);

        if (typeof data[0].error != 'undefined') {
          if ( data[0].error.length > 0 ) 
          //    $('#connections tbody tr:first').before('<tr>'+data[0].error+'</tr>');
            ;
        }
        else {
          for( i=0 ; i<data.length ; i++ ) {
            index = data[i].id;
            if( index > cursor ) { // assumes tx have sequential ids
              $('#connections tbody tr:first').before(
                '<tr>'
                +'<td>'+data[i].id+'</td>'
                +'<td>'+data[i].date+'</td>'
                +'<td>'+data[i].nfcModulationType+'</td>'
                +'<td>'+data[i].baudRate+'</td>'
                +'<td>'+data[i].ATQA+'</td>'
                +'<td>'+data[i].UID+'</td>'
                +'</tr>');
            }
            else
                console.log('already displayed tx '+ index +' with UID '+data[i].UID);

          }; // for
          if (cursor != index ) {
            cursor = index;
            console.log('set cursor to new position '+cursor);
          }
        } // else
    }); //getJSON
}; //pollServer



