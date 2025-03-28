let my_capture, handPose
let hands = [] //detected hands will get stored here 

let deagleLeft , deagleRight , akLeft , akRight , dlLeft , dlRight
let gunSet = []
let currentSet = 0 // gun set starts at first gun 

let redValMultiplier = 1
let lastToggleTime = 0
let isFlashing = false

let greenMult = 1
let blueMult = 1

let showCover = true;

function preload(){
    handPose = ml5.handPose();
    //loading the handPose model
    akLeft = loadImage ('ak47Left.png')
    akRight = loadImage ('ak47Right.png')
    deagleLeft =  loadImage ('deagleLeft.png')
    deagleRight =  loadImage ('deagleRight.png')
    dlLeft = loadImage ('DL44Left.png')
    dlRight = loadImage ('DL44Right.png')
    cover = loadImage ('cover.png')
    sidebar = loadImage ('sidebar.png')

    gunSet.push([deagleLeft, deagleRight])
    gunSet.push([akLeft, akRight])
    gunSet.push([dlLeft, dlRight])

}


function setup(){
    createCanvas(windowWidth, windowHeight);
    my_capture = createCapture(VIDEO)
    my_capture.hide()

    handPose.detectStart(my_capture, gotHands)
    //starts the model to detect hands 
    //our model starts, it is constantly looking for hands
    //once it finds hands, it calls gotHands
   
}


function draw(){
    background(255);


    image(my_capture, 0, 0)
    //console.log(hands)
    
    my_capture.loadPixels();
  var stepSize = 3 //pixel size changing 

  for (var x = 0; x < my_capture.width; x += stepSize) {
    for (var y = 0; y < my_capture.height; y += stepSize) {
        noStroke();

      var index = ((y*my_capture.width) + x) * 4;
      var redVal = my_capture.pixels[index];
      var greenVal = my_capture.pixels[index + 1];
      var blueVal = my_capture.pixels[index + 2];
      fill(redVal* redValMultiplier *3, greenVal *greenMult *2, blueVal * blueMult *2); //redVal/2 reduces red pixels
      rect(x, y, stepSize, stepSize);
    }
  }


image (sidebar, 0,0,64*2,128*2)


    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i]; //accessing and storing individual hands
        let current_keypoints = hand.keypoints //the joints on the hand
        //are stored as an array inside .keypoints
        //we are accessing that array and storing it
        let handType = hand.handedness // "Left" / "Right"

        let leftImage = gunSet[currentSet][1]
        let rightImage = gunSet[currentSet][0]

        if (handType == "Right"){
        image (rightImage, current_keypoints[5].x -100 , current_keypoints[5].y - 400, 200,600)
        }
        if (handType == "Left"){
        image (leftImage, current_keypoints[5].x -100 , current_keypoints[5].y - 400, 200,600)
        }


        let pinch_distance = dist(current_keypoints[8].x, current_keypoints[8].y,
            current_keypoints[4].x, current_keypoints[4].y)
            console.log(pinch_distance)

            if (pinch_distance <= 20){
                
                if (millis() - lastToggleTime > 70){
                    lastToggleTime = millis()

                    if (isFlashing){
                        redValMultiplier = 3
                        greenMult = 2
                        blueMult = 2
                    } else {
                        redValMultiplier = 0.7
                        greenMult = 0.5
                        blueMult = 0.5
                    }
                    isFlashing = !isFlashing
                }
            } else {
                    redValMultiplier = 1
                    greenMult = 1
                        blueMult = 1
                    isFlashing = false;
            } 

    }

    if (showCover) {
        image(cover, 0, 0, windowWidth, windowHeight);
    }

} 

function gotHands(results){
    hands = results;
    //takes the detected hands
    //stores them inside hands array
}
function keyPressed() {

    showCover = !showCover

    if (key == '1') {
        currentSet = 0; // Set 1: Deagle
    } else if (key == '2') {
        currentSet = 1; // Set 2: AK-47
    } else if (key == '3') {
        currentSet = 2; // Set 3: DL-44
    }
}
