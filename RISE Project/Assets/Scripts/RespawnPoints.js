#pragma strict
import System.Collections.Generic;

var respawnColor : Color;
var respawns : List.<Transform>;
var playerMesh : Mesh;

function FindClosestRespawn (lastLocation : Vector3) : Transform {
	var closest : Transform = respawns[0];
	var closestDistance : float = Vector3.Distance(lastLocation, respawns[0].position);
	
	for(var i = 0; i < respawns.Count; i++){
		if(lastLocation.x > respawns[i].position.x)
			if(Vector3.Distance(lastLocation, respawns[i].position) < closestDistance)
				closest = respawns[i];
	}
	
	Debug.Log("Closest Respawn is - " + closest.name);
			
	return closest;
}

function OnDrawGizmos () : void {
	
	Gizmos.color = respawnColor;
	
	if(respawns.Count != transform.childCount){
		respawns.Clear();
		
		for (var child : Transform in transform) {
			respawns.Add(child);	
		}

	}

	if(respawns.Count > 0)
		for(var i = 0; i < respawns.Count; i++){
			Gizmos.DrawMesh(playerMesh, respawns[i].position, Quaternion.identity);
		}
}

