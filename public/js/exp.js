//Generic sequence-of-trials
//If that's all you want, all you need to edit is the makeTrial object and the responseListener. Give maketrial an appropriate constructor that accept the key trial properties, a drawMe function, and something that will hit responseListener.
//then put a list of trial-property-setter entries in 'stim' and you're golden.

//EXP PARAMS:
blank_interval = 1000;

var trials = [];
var trialindex = 0;
var utopia_left = localStorage.getItem("utopia_left");
var keys_live = false;

function responseMeaning(aresponse){
    if (utopia_left){
	if(aresponse=='A') return ("utopia");
	if(aresponse=='L') return ("dystopia");
    }else{
	if(aresponse=='A') return ("dystopia");
	if(aresponse=='L') return ("utopia");
    }
}
document.addEventListener('keyup', (e) => {
    if (keys_live){
	if (e.code === "KeyA") responseListener('A')
	else if (e.code === "KeyL") responseListener('L')
    }else{
	console.log("keys not live");
    }
});
function responseListener(aresponse){//global so it'll be just sitting here available for the trial objects to use. So, it must accept whatever they're passing.
    //    console.log("responseListener heard: "+aresponse); //diag
    console.log('responselistener: '+aresponse);
    keys_live = false;
    trials[trialindex].response = aresponse;
    trials[trialindex].responseTime= Date.now();
    trials[trialindex].responseMeans = responseMeaning(aresponse);
    
    console.log("posting:"+JSON.stringify(trials[trialindex]));

    // $.post('/response',{myresponse:JSON.stringify(trials[trialindex])},function(success){
    // 	console.log(success);//For now server returns the string "success" for success, otherwise error message.
    // });
    
    //can put this inside the success callback, if the next trial depends on some server-side info.
    trialindex++; //increment index here at the last possible minute before drawing the next trial, so trials[trialindex] always refers to the current trial.
    nextTrial();
}

function drawBlank(){
	document.getElementById("uberdiv").innerHTML =
	    "<div class='trialdiv'><img src='/img/blank.png'</img></div>"+
	"<div class='footer' style='padding:10%'><p style='float:left'> Tap 'A' for<br/><span id='lefttopia'>"+(utopia_left ? "Utopia" : "Dystopia")+"</span></p><p style='float:right'>Tap 'L' for<br/><span id='righttopia'>"+(utopia_left ? "Dystopia" : "Utopia")+"</span> </p></div><div class='footer' style='text-align:center; width:100%'><p>"+(trialindex+1)+" of "+(trials.length)+"</p></div>";
}

function nextTrial(){
    drawBlank();
    if(trialindex<trials.length){
	 setTimeout(function(){trials[trialindex].drawMe("uberdiv")}, blank_interval);
	
    }else{
	console.log("finish")
	$.post("/finish",function(data){window.location.replace(data)});
    }
}

// a trial object should have a drawMe function and a bunch of attributes.
//the data-getting process in 'dashboard.ejs' & getData routes creates a csv with a col for every attribute, using 'Object.keys' to list all the properties of the object. Assumes a pattern where everything interesting is saved to the trial object, then that is JSONified and saved as a response.
//Note functions are dropped by JSON.
//Also note this means you have to be consistent with the things that are added to each trial before they are saved, maybe init with NA values in the constructor.
function makeTrial(img_id){
    this.ppntID = localStorage.getItem("ppntID");
    this.img_id = img_id;
    
    this.drawMe = function(targdiv){
	this.drawTime = Date.now();
	keys_live = true;
	document.getElementById(targdiv).innerHTML =
	    "<div class='trialdiv'><img src='/img/"+this.img_id+".jpeg'</img></div>"+
	    	"<div class='footer' style='padding:10%'><p style='float:left'> Tap 'A' for<br/><span id='lefttopia'>"+(utopia_left ? "Utopia" : "Dystopia")+"</span></p><p style='float:right'>Tap 'L' for<br/><span id='righttopia'>"+(utopia_left ? "Dystopia" : "Utopia")+"</span> </p></div><div class='footer' style='text-align:center; width:100%'><p>"+(trialindex+1)+" of "+(trials.length)+"</p></div>";
	// var responses = "<button onclick='responseListener(\"yes\")'>Yes</button><button onclick='responseListener(\"no\")'>No</button>";
	// document.getElementById(targdiv).innerHTML=
	//     "<div class='trialdiv'><p>"+this.questiontext+"</br>"+responses+"</p></div>";
    }
}



function shuffle(a) { //via https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
//****************************************************************************************************
//Stimuli
var stim = shuffle(["u_001","d_001","u_002","d_002"]);
trials = stim.map(function(x){return new makeTrial(x)});

nextTrial();
