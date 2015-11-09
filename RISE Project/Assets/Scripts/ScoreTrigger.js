#pragma strict

var ended  : boolean;
var timeToScoreScreen : float = 1f;
var scoreSystem : ScoreSystem;
var slowmotionCurve : AnimationCurve;
var levelComplete : Animator;

function OnTriggerEnter ( other : Collider ) : void {
	End(other.transform.gameObject);
}

function End (player : GameObject) : IEnumerator {
	if(ended)
		return;
		
	ended = true;
	
	yield WaitForSeconds(0.5f);
	
	var playerScore : ScoreManager = player.GetComponent.<ScoreManager>();
	player.GetComponent.<PlayerController>().playable = false;
	levelComplete.SetTrigger("End");
	
	var i : float = 0;
	
	while ( i < 1 ) {
		i+= Time.unscaledDeltaTime/timeToScoreScreen;
		Time.timeScale = slowmotionCurve.Evaluate(1-i);
		yield;
	}
	
	i = 0;
	
	Utilities.Transition(1f,0f,1f);	
		
	while ( i < 1 ) {
		i+= Time.unscaledDeltaTime/1f;
		yield;
	}	
	
	//yield WaitForSeconds(timeToScoreScreen);
	
	scoreSystem.SubmitScore(playerScore.actualScore, playerScore.timeScore);
	Application.LoadLevel(2);
}