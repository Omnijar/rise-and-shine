#pragma strict

var timerText : UnityEngine.UI.Text;

var timer : int;

private var minutes : int ;
private var seconds : int;

var formattedTime : String;

function EnableTimer ( time : int ) {
	timer = time;
	CountDown();
}

function DisableTimer () {
	timerText.text = "00:00";
	timer = 0;
}

function CountDown () : IEnumerator {
	
	var minutes : int ;
	var seconds : int;
	var formattedTime : String;
    
    ConvertTime();
    
    yield WaitForSeconds(1);
	
	while(timer > 1){
    	timer --;
    	ConvertTime();
    	yield WaitForSeconds(1);
	}
			
	timerText.text = "00:00";	
}

function ConvertTime () {
 	minutes = Mathf.FloorToInt(timer / 60F);
	seconds = Mathf.FloorToInt(timer - minutes * 60);
	formattedTime = String.Format("{0:00}:{1:00}", minutes, seconds);
    timerText.text = formattedTime;
}