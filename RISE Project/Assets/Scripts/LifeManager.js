#pragma strict

// Game variables
var lives : int = 3; // 3 as default
var respawnTime : float = 1f;

// Interface
var livesText : UnityEngine.UI.Text;
var livesAnimator : Animator;

// Script Links
var respawnPoints : RespawnPoints;
var playerController : PlayerController;
var cameraManager : CameraManager;
var gameController : GameController;

var fastSpawn : boolean;
var respawning : boolean;

function Awake () {
	livesText.text = lives.ToString();
}

function StartGame (startingLives : int) : void {
	lives = startingLives;
	livesText.text = lives.ToString();
}

function AddLives ( count : int ) : void {
	lives += count;
	livesText.text = lives.ToString();
	livesAnimator.SetTrigger("Pulse");
}

function RemoveLives ( count : int ) : void {
	lives -= count;
	livesText.text = lives.ToString();
	livesAnimator.SetTrigger("Pulse");
	
	playerController.audioManager.Death();
	playerController.RemoveControl();
	cameraManager.RemoveControl();

	if(lives <= 0)
		GameOver();
	else
		Respawn(transform.position);
}

function Respawn (lastLocation : Vector3) : IEnumerator {
	if(respawning)
		return;
		
	respawning = true;
	
	var i : float;
	
	while ( i < 1 && !fastSpawn ) {
		i+= Time.deltaTime/respawnTime;
		yield;
	}
	
	playerController.RegainControl();
	playerController.audioManager.Respawn();
	cameraManager.RegainControl();
	
	transform.position = respawnPoints.FindClosestRespawn(lastLocation).position;
	playerController.transform.gameObject.GetComponent.<Rigidbody>().velocity = Vector3.zero;
	fastSpawn = false;
	respawning = false;
	
}

function GameOver () {
	Debug.Log("Game Over");
	gameController.EndGame();
}