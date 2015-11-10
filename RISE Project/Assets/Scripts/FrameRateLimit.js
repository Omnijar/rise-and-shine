#pragma strict
var FPS : float = 60f;

function Awake () {
    Application.targetFrameRate = FPS;
}
