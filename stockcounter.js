
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

updateTime = 3; // segundos

console.log("inyected DJI extension script");

inyectWrapper();
operate();

reload;

function operate(){
	reload = setTimeout(function(){
		   operate();
		}, updateTime*1000);

	flow();
}

function flow(){
	console.log("Flowing");
	let spans = getSpanElements();
	
	if(spans.length > 0){

		//clearTimeout(reload);
		avgCount = getColorAvgCount(spans);
		injectHtml(avgCount)
	}
}

function getSpanElements(){

	items = $("tbody[data-reactid='24']").children('tr');
	spans = new Array();

	if(items.length > 0)
		$.each(items, function(){

			let cant = $(this).children('td').children('span');
			
			if(cant.length == 1){
				$.each(cant, function(){
					spans.push($(cant));
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

	$.each(sp, function(){

		let colorClass = $(this).attr("class");
		let amount = clean($(this).text());

		if(colorClass.includes(greenClass)){
			green += 1;
			totalGreen += parseFloat(cleanF(amount));
		}
		else if(colorClass.includes(redClass)){
			red += 1;
			totalRed += parseFloat(cleanF(amount));
		}
		else
			black += 1;
	});

	if(green > 0 || red > 0){
		greenAvg = totalGreen / green;
		redAvg = totalRed / red;
	}

	return  {
				redCount:red, 
				greenCount:green, 
				blackCount:black,
				greenAvg:greenAvg.toFixed(2),
				redAvg:redAvg.toFixed(2)
			};
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

let reload2 = window.setTimeout(function(){
		   location.reload(true);
		}, 60000);

function injectHtml(data){

	$("#dji-ext-info-wrapper").html(
		"<h1>Index Count:   <span style='color:green;'>" + data.greenCount +
	 	"<span style=''> ("+data.greenAvg+"%)</span></span> vs <span style='color:red;'>" + 
		 data.redCount + "<span style=''> ("+data.redAvg+"%)</span></span> " + 
		 (data.blackCount > 0 ? " ("+data.blackCount+")" : "") + "</h1>" +
		 "<input type='radio' id='autoref' name='group1' value='autorefresh' checked> Auto Refresh <br>" +
		 "<input type='radio' id='pausa' name='group1' value='pausa' > Pausa"
	 );

	$("input:radio[name=group1]").change( function() {
		if(this.value === "pausa"){
			window.clearTimeout(reload2);	
		} else {
			reload2 = setTimeout(function(){
			   location.reload(true);
			}, 9000);
		}
	});
}

function getTimestamp(){
	return new Date().toLocaleTimeString();
}



