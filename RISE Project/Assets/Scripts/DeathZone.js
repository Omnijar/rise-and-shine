#pragma strict

function OnTriggerEnter (other : Collider) : void {
	other.GetComponent.<LifeManager>().RemoveLives(1);
}