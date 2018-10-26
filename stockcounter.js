
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

updateTime = 4.5; // segundos

console.log("inyected DJI extension script");

inyectWrapper();
flow();

reload = setTimeout(function(){
   location.reload(true);
}, updateTime*1000);


function flow(){
	console.log("Flowing");
	let spans = getSpanElements();
	
	if(spans.length > 0){
		var avgCount = getColorAvgCount(spans);
		getDirection(avgCount);
	}
}

function getSpanElements(){

	items = $("tbody[data-reactid='24']").children('tr');
	spans = new Array();

	if(items.length > 0)
		$.each(items, function(){

			let cant = $(this).children('td').children('span');
			let volItem = $(this).children('td:last-child');
			
			if(cant.length == 1){
				$.each(cant, function(){

					let tempitem = {};
					tempitem['change'] = $(cant);
					tempitem['vol'] = $(volItem);

					spans.push(tempitem);
					return false;
				});
			}
		});
	else
		console.log("Table didnt load correctly.");

	return spans;
}

function getColorAvgCount(sp){

	let green = 0;
	let red = 0;
	let black = 0;

	let greenClass = "C($dataGreen)";
	let redClass = "C($dataRed)";

	let totalGreen = 0;
	let totalRed = 0;
	let greenAvg = 0;
	let redAvg = 0;

	let volTotalGreen = 0;
	let volTotalRed = 0;
	let volGreenAvg = 0;
	let volRedAvg = 0;

	$.each(sp, function(){

		let colorClass = $(this.change).attr("class");
		let amount = clean($(this.change).text());
		let vol = cleanDot($(this.vol).text())

		if(colorClass.includes(greenClass)){
			green += 1;
			totalGreen += parseFloat(cleanF(amount));
			volTotalGreen += parseInt(vol);
		}
		else if(colorClass.includes(redClass)){
			red += 1;
			totalRed += parseFloat(cleanF(amount));
			volTotalRed += parseInt(vol);
		}
		else
			black += 1;
	});

	if(green > 0 || red > 0){
		greenAvg = totalGreen / green;
		redAvg = totalRed / red;
		volGreenAvg = volTotalGreen / green;
		volRedAvg = volTotalRed / red;
	}

	volRedAvg = numeral(volRedAvg.toFixed(2)).format('0.00a');
	volGreenAvg = numeral(volGreenAvg.toFixed(2)).format('0.00a');

	return  {
				redCount:red, 
				greenCount:green, 
				blackCount:black,
				greenAvg:greenAvg.toFixed(2),
				redAvg:redAvg.toFixed(2),
				volRedAvg:volRedAvg,
				volGreenAvg:volGreenAvg
			}; 
}

function getDirection(data) {

	var result = "";
	var countDirection = "";

	chrome.storage.local.get(['count_direction'], function(result) {
		if (result.key) {
			count_direction = result.key;
		}
	});

	// check if previous data is stored
	chrome.storage.local.get(['dow_numbers'], function(result) {
		if (result === undefined || result.length == 0) {
			return count_direction;
		}

		var prev = result['dow_numbers'];
		var redCountResult = parseInt(data['redCount']) - parseInt(prev['redCount']);
		var greenCountResult = parseInt(data['greenCount']) - parseInt(prev['greenCount']);

		if (redCountResult > greenCountResult) {
			countDirection = 'red';
		} else if (greenCountResult > redCountResult) {
			countDirection = 'green'
		} else {
			// they are equal, must calculate % change now
			var redAvgResult = parseFloat(data['redAvg']) - parseFloat(prev['redAvg']);
			var greenAvgResult = parseFloat(data['greenAvg']) - parseFloat(prev['greenAvg']);

			if (redAvgResult > greenAvgResult) {
				countDirection = 'red';
			} else if (greenAvgResult > redAvgResult) {
				countDirection = 'green';
			} else {
				// keep same direction
				countDirection = countDirection;
			}
		}

		injectHtml(data, countDirection);
		saveLastNumbers(data, countDirection);
    });
}

function saveLastNumbers(data, direction) {
	chrome.storage.local.set({'dow_numbers': data});

	if (direction !== undefined || direction.length > 0) {
		chrome.storage.local.set({'count_direction': direction});
	}
}

function cleanDot(str){
	return str.split('.').join('');
}

function cleanF(str){
	return str.replace(',','.');
}

function clean(str){
	return str.replace('%','').replace('-','');
}

function inyectWrapper(){
	$("#quote-header-info").append("<div style='padding: 20px;margin: 15px;width: auto;float: left;background-color: rgba(37, 145, 249, 0.15);' id='dji-ext-info-wrapper'></div>");
}

function injectHtml(data, direction){

	if (direction == 'green') {
		direction = '<span style="color: green;">UP<span>';
	} else {
		direction = '<span style="color: red;">DOWN<span>';
	}

	$("#dji-ext-info-wrapper").html(
		"<h1>Index Count:   <span style='color:green;'><span style='font-size:3rem;'>" + data.greenCount +
	 	"</span><span style=''> ("+data.greenAvg+"%) (vol. "+data.volGreenAvg+")</span></span> vs <span style='color:red;'><span style='font-size:3rem;'>" + 
		 data.redCount + "</span><span style=''> ("+data.redAvg+"%) (vol. "+data.volRedAvg+")</span></span> " + 
		 (data.blackCount > 0 ? " ("+data.blackCount+")" : "") + "</h1><span> <h2>Direction: " + direction + "</h2></span><br>"
	 );

	var controls = "<input type='radio' id='autoref' name='group1' value='autorefresh' checked> Auto Refresh <br>" +
		 "<input type='radio' id='pausa' name='group1' value='pausa' > Pausa";


    $("#dji-ext-info-wrapper").append(controls);

	$("input:radio[name=group1]").change( function() {
		if(this.value === "pausa"){
			window.clearTimeout(reload);	
		} else {
			location.reload(true);
		}
	});
}

function getTimestamp(){
	return new Date().toLocaleTimeString();
}
