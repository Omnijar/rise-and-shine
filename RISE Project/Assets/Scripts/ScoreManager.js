#pragma strict

// Game variables
var currentScore : float;
var actualScore : float;
var highScore : float;

var timeScore : int;
var highTimeScore : int;

// Interface
var scoreText : UnityEngine.UI.Text;
var scoreAnimator : Animator;

// Scripts
var timeManager : TimeManager;
var currentPitch : float;

private var incrementSpeed : float = 500f;

function Awake () {
	highScore = PlayerPrefs.GetFloat("highScore");	
	highTimeScore = PlayerPrefs.GetInt("timeHighScore");	
	scoreText.text = "x 0";	
}

function SubmitScore () : void {
	if(actualScore > highScore)
		PlayerPrefs.SetFloat("highScore", actualScore);
		
	print("Highscore has been set to : " + Mathf.RoundToInt(actualScore));
}

function AddScore ( worth : float ) : void {
	actualScore += worth;
	scoreAnimator.SetTrigger("Pulse");
}

function Update () {
	if(currentScore != actualScore){
		currentScore += Time.deltaTime*incrementSpeed;
		currentScore = Mathf.Clamp(currentScore, 0, actualScore);
		scoreText.text = "x " + Mathf.RoundToInt(currentScore).ToString();
	}
	
	//Collectable Pitch
	if(currentPitch > 1 && currentPitch < 1.7)
		currentPitch -= Time.deltaTime/2;
	else if( currentPitch >= 1.7)
		currentPitch = 1.7;
	else
		currentPitch = 1;
	
	timeScore = timeManager.timer;
}

function GetPitch () : float {
	return currentPitch;
}