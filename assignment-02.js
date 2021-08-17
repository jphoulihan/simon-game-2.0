const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let best = 0;

//start game function
$(".control__display-start").click(function () {

  if (!started) {

    $(".control__light-switch").css("background-color", "#00ff00");

    $(".control__display-level-current").attr('value', level);

    $(".control__display-level-best").attr('value', best);

    //first button flash after 3 seconds
    setTimeout(function () {
      nextSequence();
    }, 3000);

    started = true;
  }


});

//next levels, if user click button matches the sequence of game pattern array next sequence is added
//else player loses triggering lose effects and rest game
function checkAnswer(currentlevel) {
  if (gamePattern[currentlevel] === userClickedPattern[currentlevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 900);
    }
  } else {
    flashLoop();
    startOver();
  }

}

//takes user clicked pattern, adds it to user pattern array, then compares user pattern with gamePattern to call continue or reset to game
//.btn class which all buttons have in common, then button clicked is differentiated by the id attribute which is the buttons corresponding 
//color and is unique
$(".btn").click(function () {
  //clear the slow lose function from firing once button is clicked
  clearTimeout(tooSlow);
  let userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  animatePress(userChosenColor);
  playSound(userChosenColor);
  checkAnswer(userClickedPattern.length - 1);
  console.log(isClicked);
});

//generates random number, uses it as index of buttoncolor array, that element is the random color
//which gets added to the gamepattern array
//level increments with each call
//series of if statments to shorten button flash interval depending on the level reached
//button flash iterated to gamepattern array length the f;ash delay compounds by incrementing the interval with each iteration
//giving the effect of sequenced button flashes
function nextSequence() {
  console.log("userpat: " + userClickedPattern);

  userClickedPattern = [];
  console.log(userClickedPattern);
  level++;

  $(".control__display-level-current").attr('value', level);

  let randNum = Math.floor(Math.random() * 4);
  let randChosenColor = buttonColors[randNum];
  gamePattern.push(randChosenColor);
  
  console.log("gamepat: " + gamePattern);
  
  let delay = 900;
  let inter = 100;
  
  if (level >= 5) {
    delay = 700;
  }
  if (level >= 9) {
    delay = 500;
  }
  if (level >= 13) {
    delay = 200;
  }
  
  
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(function () {
      animatePress(gamePattern[i]);
      playSound(gamePattern[i]);
    }, inter);
    inter += delay;
  }

  //function for slowLose has timeout set to last flash of current sequence plus 5 seconds
  function slowLose() {
    tooSlow = setTimeout(() => {
      flashLoop();
      startOver();
    }, 5000 + (inter += delay));
  }

  slowLose();
};

function playSound(name){
  let audio = new Audio("sounds/"+name+".mp3");
  audio.play();
}


//flash effect
function animatePress(arg) {

  $("#" + arg).addClass("pressed");

  setTimeout(function () {
    $("#" + arg).removeClass("pressed");
  }, 100);

}

//checks highscore with ternary operator, resets game
function startOver() {
  level > best ? best = level : null;

  level = 0;
  gamePattern = [];
  started = false;

  $(".control__light-switch").css("background-color", "#ff3300");

  $(".control__display-level-current").attr('value', level);

  $(".control__display-level-best").attr('value', best);
}

//lose flash targets
function loseFlash() {
  animatePress("red");
  animatePress("green");
  animatePress("yellow");
  animatePress("blue");
}

//5 simultaneous flashes to indicate loss
function flashLoop() {

  let inter = 100;
  let delay = 500;

  for (i = 0; i < 5; i++) {
    setTimeout(function () {
      loseFlash();
    }, inter);
    playSound("wrong");
    inter += delay;
  }


}