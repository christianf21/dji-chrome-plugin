
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

updateTime = 5; // segundos

console.log("inyected DJI extension script");
operate();


function operate(){

	reload = setTimeout(function(){
		   operate();
		}, updateTime*1000);

	flow();
}

function test(){
	flow();
}

function flow(){

	var spans = getSpanElements();

	if(spans.length > 0){
		avgCount = getColorAvgCount(spans);
		injectHtml(avgCount)
	}
}

function getSpanElements(){

	items = $("td.yfnc_tabledata1"); // the <td> that has <img>
	spans = new Array();

	if(items.length > 0)
		$.each(items, function(){

			var cant = $(this).children('span');

			if(cant.length == 2){
				$.each(cant, function(){
					spans.push($(this));
					return false;
				});
			}
		});
	else
		console.log("Table didnt load correctly.");

	return spans;
}

function getColorAvgCount(sp){

	var green = 0;
	var red = 0;
	var black = 0;

	var greenClass = "yfi-price-change-green";
	var redClass = "yfi-price-change-red";

	var totalGreen = 0;
	var totalRed = 0;
	var greenAvg = 0;
	var redAVg = 0;

	$.each(sp, function(){

		var tmp = $(this).children("span");
		var colorClass = $(tmp).attr("class");
		var amount = $(tmp).text();

		if(colorClass === greenClass){
			green += 1;
			totalGreen += parseFloat(amount);
		}
		else if(colorClass === redClass){
			red += 1;
			totalRed += parseFloat(amount);
		}
		else
			black += 1;
	});

	greenAvg = totalGreen / green;
	redAvg = totalRed / red;

	return {
				redCount:red, 
				greenCount:green, 
				blackCount:black,
				greenAvg:greenAvg.toFixed(2),
				redAvg:redAvg.toFixed(2)
			};
}

function injectHtml(data){

	$("#companynav").html(
		"<h1>Index Count:   <span style='color:green;'>" + data.greenCount +
	 	"<span style='font-size:20px;'>("+data.greenAvg+"%)</span></span> vs <span style='color:red;'>" + 
		 data.redCount + "<span style='font-size:20px;'>("+data.redAvg+"%)</span></span> " + 
		 (data.blackCount > 0 ? " ("+data.blackCount+")" : "") + "</h1>" +
		 "" + 
		 "<b>Ultima actualización:</b> "+getTimestamp()
	 );
}

function getTimestamp(){
	return new Date().toLocaleTimeString();
}