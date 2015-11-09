#pragma strict

public static class Utilities {
    public static function Transition(to : float, from : float, time : float) : float {
    		Debug.Log("Static Transition Initiated");
       		var transitioner : GameObject = GameObject.Find("Transition");
       		Debug.Log(transitioner.name);
			transitioner.GetComponent.<Transition>().Transition(to,from,time);
    }
}