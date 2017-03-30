## CMview.js

A javascript interactive contact map viewer. Uses [NGL](https://github.com/arose/ngl) to interact with a 3D view of the protein.

<html>
<head>

</head>

<body>
<h1><i>Protein Contact Map</i></h1>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="ngl.dev.js"></script>
<script type = "text/javascript" src = "cmsvg.js"></script>
<script type = "text/javascript" src = "cmngl.js"></script>
<script type = "text/javascript" src = "cmcontroller.js"></script>

<div id = "container" style = "width:1400px; height: 900px">
<div id="nglviewport" style="width:700px; height:700px; float: right;"></div>
<div id="svgviewport" style="width:700px; height:700px; float: left;"></div>
<div class = "panel" >
<span class="Text" id="clickedatom" style="display: inline-block; vertical-align: middle;">
Clicked on NGL to get atom information here.
</span> 
</div>
<p>Enter PDB ID to show contact map:</p>
<div id="form">
<form id ="frm1">
PDB ID: <input type="text" name="pdbid" id="pdbid" value="1smt">
</form>

<form id ="frm2">
Chain: <input type="text" name="chain" id="chain" value="A">
</form>		

<form id ="frm3">
Cutoff: <input type="number" name="cutoff" id="cutoff" value= "8" >
</form>					

<input id="submit" value="Submit" type="button">
<input id="zoomon" value="Zoomon" type="button">
<input id="zoomoff" value="Zoomoff" type="button">
</div>
<p>Protein contact map represents the distance between all possible amino acid residue pairs of a three-dimensional protein structure using a binary-dimensional matrix.</p>
</div>








<script>

//<body bgcolor="#07C7EE">
var loadedtag = 0;
var nglobj, svgobj, cmcontroller;

function pdbinput(){
var pdbid = document.getElementById('pdbid').value;
var chainName = document.getElementById('chain').value;
var cutoff = document.getElementById('cutoff').value;
chainName = chainName.toUpperCase();
console.log("PDB ID: " + pdbid);
console.log("Chain: " + chainName);
console.log("Cutoff: " + cutoff);

//svgurl
//"http://localhost:8000/examples/5sx3.json"
var str1 = "http://localhost:8000/examples/";
var str2 = ".json";
var svgurl = str1.concat(pdbid);
svgurl = svgurl.concat(str2);
console.log(svgurl);

//nglurl
//"rcsb://5sx3.mmtf"
var str4 = "rcsb://";
var str5 = ".mmtf";
var nglurl = str4.concat(pdbid);
nglurl = nglurl.concat(str5);
console.log(nglurl);



if(loadedtag === 1){
//d3.select("svg").remove();
document.getElementById("svgviewport").innerHTML = "";
document.getElementById("nglviewport").innerHTML = "";
}



//creating promise and timeout so that ngl load first before loading svg
/*var promise = new Promise(function(resolve, reject){
var nglobj = new cmNgl("ngl1", "nglviewport", nglurl, chainName);
nglobj.loadngl();


resolve(nglobj);
reject(Error("Fail"));		
});

promise.then(function(result){
setTimeout(function(){
var svgobj = new cmSvg("svg1", result, svgurl);
var cmcontroller = new cmController("cmctr1", svgobj, result);
cmcontroller.ctloadcmsvg(1);
}, 1000);
}, function(err){
console.log(err);
});*/



nglobj = new cmNgl("nglviewport", nglurl, chainName, cutoff);
//cmcontroller;
nglobj.loadngl().then(function(){
var svgobj1 = new cmSvg(nglobj, svgurl, chainName);
svgobj = svgobj1;
cmcontroller = new cmController(svgobj, nglobj);
cmcontroller.ctloadcmsvg(1, 700);
//cmcontroller.zoom(0);
//cmcontroller.brush(1);
});

loadedtag = 1;

}

var inputpdbbtn = document.getElementById('submit');
inputpdbbtn.addEventListener('click', pdbinput);

function zoomon(){
cmcontroller.zoom(1);
cmcontroller.brush(0);
}

var zoomonbtn = document.getElementById('zoomon');
zoomonbtn.addEventListener('click', zoomon);


function zoomoff(){
cmcontroller.zoom(0);
cmcontroller.brush(1);
}

var zoomoffbtn = document.getElementById('zoomoff');
zoomoffbtn.addEventListener('click', zoomoff);



</script>



</body>
</html>