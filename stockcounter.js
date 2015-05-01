
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

var stockLocation = "https://es-us.finanzas.yahoo.com/q/cp?s=%5EDJI";

//$("body").css("background-color","blue");

// check if <td> contains <img>, if it does, check if red or green and count each.

var red = "#cc0000;";
var green = "#008800;";

var redCount = 0;
var greenCount = 0;
var blackCount = 0;

// used for calculating averages
var greenNums = new Array();
var redNums = new Array();

var items = $("td.yfnc_tabledata1").has("img"); // the <td> that has <img>

//var floatRegex = '[-+]?([0-9]*.[0-9]+|[0-9]+)'; 

$.each(items, function(){ 

	var color = $(this).find('b:first').attr('style').split(':')[1];

	var temp =  $(this).find('b:last').text();
	var value = temp.substr(2,4);

	if(color === red){
		
		redCount++;
		redNums.push( parseFloat( value ) ); // add first <b> values to array for processing later

	} else if (color === green){
		
		greenCount++;
		greenNums.push( parseFloat( value ) );
	}

});

// Calculating Green VS Red averages
var greenAVG = 0;
var redAVG = 0;


	// GREENs
	var totalGreen = 0;

	for(i = 0; i<greenNums.length; i++){
		totalGreen += greenNums[i];
	}

	greenAVG = totalGreen  / greenNums.length;


	// REDs
	var totalRed = 0;

	for(z = 0; z<redNums.length; z++){
		totalRed += redNums[z];
	}

	redAVG = totalRed / redNums.length;

/*****************************************/


blackCount = 30 - (greenCount + redCount);

$("#marketindices").append("<h1>Index Count:   <span style='color:green;'>" + greenCount +
			
					 "<span style='font-size:20px;'>("+greenAVG.toFixed(2)+"%)</span></span> vs <span style='color:red;'>" + 

					 redCount + "<span style='font-size:20px;'>("+redAVG.toFixed(2)+"%)</span></span> " + 

					 (blackCount > 0 ? " ("+blackCount+")" : "") + "</h1>");

$("#marketindices").append("<input type='radio' id='autoref' name='group1' value='autorefresh' checked> Auto Refresh <br>" +

							"<input type='radio' id='pausa' name='group1' value='pausa'> Pausa");

var reload = setTimeout(function(){
		   location.reload(true);
		}, 6000);

$("input:radio[name=group1]").change( function() {

	if(this.value === "pausa"){

		clearTimeout(reload);	
	} else {
		reload = setTimeout(function(){
		   location.reload(true);
		}, 6000);
	}
});