//The animator
let Animate = {};

//Easings

//Linear, in goes x, out comes x
Animate.linear = (x) => x;

//Quadratic
Animate.easeIn  = (x) => x * x;
Animate.easeOut = (x) => 1 - (1 - x) * (1 - x);
Animate.easeInOut = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

//Animate to
Animate.to = function(obj,end) {

    //Make it a promise:
    return new Promise( (resolve,reject) => {

        //Set up initial state parameters
        //We need to know where we started for this to work
        //Just x and y to start
        var start = {
            x : obj.x,
            y : obj.y
        }

        //Set some defaults
        if (end.duration == undefined) end.duration = 0;
        if (end.easing == undefined) end.easing = Animate.linear;

        //We need to know when we've started animating
        var startTime = Date.now();

        //This will be our personal animation loop
        function loop() {

            //Calculate our delta
            let ticker = Date.now() - startTime;
            let delta = ticker/end.duration;
            let ease = end.easing(delta);

            //If we're done, just snap to the end!
            if (delta >= 1) {
                obj.x = end.x;
                obj.y = end.y;
                console.log("Done!");
                
                resolve();
                return;
            }

            //Interpolation function
            let lerp = (a, b, n) => {
                return (1 - n) * a + n * b;
            }

            //Interpolate (lerp) our x coordinate
            obj.x = lerp(start.x,end.x,ease);

            //Lerp our y coordinate
            obj.y = lerp(start.y,end.y,ease);

            //Start the loop going!
            obj.animationID = requestAnimationFrame(loop);

        }

        //Clear the animation ID so there aren't competing loops
        cancelAnimationFrame(obj.animationID);

        //Begin the loop!
        loop();

    //End Promise
    });

};

//Stop an object animating
Animate.stop = function(obj) {
        
    cancelAnimationFrame(obj.animationID);

};

//Personal animation loop
Animate.loop = function(obj,loopFunc) {

    //No state parameters

    //We need to know when we've started animating
    var startTime = Date.now();

    //This will be our personal animation loop
    function loop() {

        //Calculate our parameters
        var params = {
            ticker : Date.now() - startTime
        };
        
        //In here it's just our own code
        loopFunc(params);

        //Start the loop going!
        obj.animationID = requestAnimationFrame(loop);

    }

    //Clear the animation ID so there aren't competing loops
    cancelAnimationFrame(obj.animationID);

    //Begin the loop!
    loop();

};