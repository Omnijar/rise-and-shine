#pragma strict

var playerController : PlayerController;

var menuAnimator : Animator;
var interfaceAnimator : Animator;
var gameoverAnimator : Animator;

var lifeManager : LifeManager;
var scoreManager : ScoreManager;
var timeManager : TimeManager;

var startingLives : int = 3;
var gameTime : int = 600;

var startGame : boolean;
var sceneLoader : SceneLoader;

function Start () {
	StartGame();
}

function Play () : void {
	//StartGame();
}

function StartGame () : IEnumerator {
	if(startGame)
		return;

	startGame = true;
	//menuAnimator.SetBool("Hide", true);
	//yield WaitForSeconds(1f);
	playerController.StartGame();
	timeManager.EnableTimer(gameTime);
	
	lifeManager.StartGame(startingLives);
	
	startGame = false;
	
	
	//interfaceAnimator.SetTrigger("Play");

}

function EndGame () : IEnumerator {
	yield WaitForSeconds(1f);
	sceneLoader.Load();
}