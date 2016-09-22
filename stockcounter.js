
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

var stockLocation = "https://es-us.finanzas.yahoo.com/q/cp?s=%5EDJI";


//operate();
test();


function operate(){

	reload = setTimeout(function(){
		   //location.reload(true);
		   console.log("testing.....");
		   operate();
		}, 6000);

	countStock();
	injectHtml();
}

function test(){
	countStock2();
}

function countStock2(){

	items = $("td.yfnc_tabledata1"); // the <td> that has <img>

	var amount = 0;

	$.each(items, function(){

		var cant = $(this).children('span');
		if(cant.length == 2)
			amount += 1;
	});

	console.log("Rows = " + amount);
}

function countStock() {

	red = "#cc0000;";
	green = "#008800;";

	redCount = 0;
	greenCount = 0;
	blackCount = 0;

	// used for calculating averages
	greenNums = new Array();
	redNums = new Array();

	items = $("td.yfnc_tabledata1").has("span#yfs_c63_aapl"); // the <td> that has <img>

	console.log("Data = " + items.length);

	return;
	// check if <td> contains <img>, if it does, check if red or green and count each.
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
	greenAVG = 0;
	redAVG = 0;


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
}

function injectHtml(){

	blackCount = 30 - (greenCount + redCount);

	$("#companynav").html(
		"<h1>Index Count:   <span style='color:green;'>" + greenCount +
	 	"<span style='font-size:20px;'>("+greenAVG.toFixed(2)+"%)</span></span> vs <span style='color:red;'>" + 
		 redCount + "<span style='font-size:20px;'>("+redAVG.toFixed(2)+"%)</span></span> " + 
		 (blackCount > 0 ? " ("+blackCount+")" : "") + "</h1>"
	 );
}