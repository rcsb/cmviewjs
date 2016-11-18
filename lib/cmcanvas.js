export function load(){
	//http://localhost:8000/examples/tst4.json
	//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var oReq = new XMLHttpRequest();
	var url = "http://localhost:8000/examples/tst4.json";

//data.length1; //122
//data.residue1[0]; //24


	oReq.open("GET", url);
	oReq.responseType = "json";
	oReq.send();

	oReq.onload = function() {
		var data = oReq.response;
		draw(data);
	}
}



export function draw(data){
	

	


	//console.log(data.length1);

	var size = data.length1;
	var residue1 = data.residue1;
	var residue2 = data.residue2;


	//console.log(residue1.length);

	//console.log(residue1[2]);
	//var residue1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	//var residue2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var canvas = document.getElementById('canvas');
	var ctx = document.getElementById('canvas').getContext('2d');
	var canvaswidth = document.getElementById('canvas').width;
	//var canvasheight = document.getElementById('canvas').height;
	//var unit = Math.round(canvaswidth/size);
	var unit = canvaswidth/size;


	//console.log(canvaswidth);
	//var width = document.getElementById('canvas').getWidth();
	for(var i = 0; i < canvaswidth; i++){
		for(var j = 0; j < canvaswidth; j++){
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.fillRect(i,j,1,1);
		}
	}

	for(var k = 0; k < residue1.length; k++){
		var num1 = residue1[k];
		var num2 = residue2[k];

		ctx.fillStyle = "rgb(10,150,200)";
		//ctx.fillStyle = "rgb(200, 100, 100)";
		ctx.fillRect(Math.floor(num2*unit), Math.floor(num1*unit), Math.round(unit), Math.round(unit));	
		ctx.fillRect(Math.floor(num1*unit), Math.floor(num2*unit), Math.round(unit), Math.round(unit));		
	}


	var zoomctx = document.getElementById('zoom').getContext('2d');
	//zoom(event,zoomctx)
	var zoom = function(event) {
    
    var x = event.layerX;
    // x/unit = x axis
    //console.log("X-axis: "+Math.round(x/unit));
    var y = event.layerY;
    // y/unit = y axis
    //console.log("Y-axis: "+Math.round(y/unit));
    //console.log("X: "+x);
    //console.log("Y: "+y);
    zoomctx.drawImage(canvas,
                      Math.abs(x - 5),
                      Math.abs(y - 5),
                      10, 10,
                      0, 0,
                      200, 200);
	};
	canvas.addEventListener('mousemove', zoom);







	var select = 0;
	var selectx = -1;
	var selecty = -1;
	var color = function(event){
		var x = event.layerX;
		var y = event.layerY;
		var pixel = ctx.getImageData(x,y,1,1);
		var data = pixel.data;
		var r = data[0];
		var g = data[1];
		var b = data[2];

		if(r == 10 && g == 150 && b == 200){
			var x1 = Math.floor(x/unit);
			var y1 = Math.floor(y/unit);
			var x2 = x1*unit;
			var y2 = y1*unit;


			if(select == 0){
				select = 1;
				ctx.fillStyle = "rgb(200,100,100)";
				ctx.fillRect(Math.floor(x2), Math.floor(y2), Math.round(unit), Math.round(unit));	
				ctx.fillRect(Math.floor(y2), Math.floor(x2), Math.round(unit), Math.round(unit));

				selectx = Math.floor(x2);
				selecty = Math.floor(y2);		
			}

			if(select == 1){


				ctx.fillStyle = "rgb(10,150,200)";
				ctx.fillRect(selectx, selecty, Math.round(unit), Math.round(unit));	
				ctx.fillRect(selecty, selectx, Math.round(unit), Math.round(unit));

				ctx.fillStyle = "rgb(200,100,100)";
				ctx.fillRect(Math.floor(x2), Math.floor(y2), Math.round(unit), Math.round(unit));	
				ctx.fillRect(Math.floor(y2), Math.floor(x2), Math.round(unit), Math.round(unit));				
				
				selectx = Math.floor(x2);
				selecty = Math.floor(y2);	
			}
		}

		else{

			if(selectx !== -1 && selecty !== -1){
				ctx.fillStyle = "rgb(10,150,200)";
				ctx.fillRect(selectx, selecty, Math.round(unit), Math.round(unit));	
				ctx.fillRect(selecty, selectx, Math.round(unit), Math.round(unit));   	
				select = 0;			
			}
		}
	};
	canvas.addEventListener('click', color);
  }









