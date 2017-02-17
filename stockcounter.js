
/**
* Count how many greens (#008800) and how many reds (#cc0000) in the website,
* also reload the website every X number of seconds.
*
* Up arrow image (transparent-1093278.png) and down arrow (transparent-1093278.png)
*
* By Christian Feo.
*/

updateTime = 2; // segundos

console.log("inyected DJI extension script");

inyectWrapper();
operate();

var reload;

function operate(){


	reload = setTimeout(function(){
		   operate();
		}, updateTime*1000);

	flow();
}

function flow(){

	var spans = getSpanElements();
	
	if(spans.length > 0){

		clearTimeout(reload);

		avgCount = getColorAvgCount(spans);
		injectHtml(avgCount)
	}
}

function getSpanElements(){

	items = $("section[data-test='quote-leaf']").children('section')
					.children('table').children('tbody').children('tr'); // the <td> that has <img>
	spans = new Array();

	if(items.length > 0)
		$.each(items, function(){

			var cant = $(this).children('td').children('span');
			
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

	var green = 0;
	var red = 0;
	var black = 0;

	var greenClass = "C($dataGreen)";
	var redClass = "C($dataRed)";

	var totalGreen = 0;
	var totalRed = 0;
	var greenAvg = 0;
	var redAvg = 0;

	$.each(sp, function(){

		var colorClass = $(this).attr("class");
		var amount = clean($(this).text());

		if(colorClass === greenClass){
			green += 1;
			totalGreen += parseFloat(cleanF(amount));
		}
		else if(colorClass === redClass){
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

	return {
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

var reload2 = window.setTimeout(function(){
		   location.reload(true);
		}, 9000);

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

		console.log("cambiando = "+this.value);

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



