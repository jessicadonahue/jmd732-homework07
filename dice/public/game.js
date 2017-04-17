document.addEventListener("DOMContentLoaded", function(event) {


	var b = document.querySelector('button');
	b.addEventListener('click', function(evt) {

		document.getElementById('intro').classList.add('title');
		document.getElementById('game').classList.remove('hidden');

		startGame();
		console.log("nums is now:", nums);

		createElements();

		var buttons = document.querySelectorAll('button.button');
		var start = buttons[0];
		var roll = buttons[1];
		var pin = buttons[2];


		start.addEventListener('click', generateNums);

		//error is caught here - if they select a die to pin before 
		//theyve rolled 


		roll.addEventListener('click', function(evt) {
			rollDice();

			//after rolling a player must pin at least one dice
			pinDice();
		});

		pin.addEventListener('click', function(evt) {

				console.log("someone hit the pin button");


				//select all the dice boxes 
				var diceDivs = document.getElementsByClassName('dice');

				var isPinned = false;
				for (var i = 0; i < diceDivs.length; i++) {
					var currentDice = diceDivs[i];
					var check = currentDice.classList.contains('toBePinned');
					console.log(check);
					if (check === true) {
						isPinned = true;
					}

				}

				//if at least one is pinned then we can let the user hit pin
				if (isPinned === true) {
					console.log("at least one dice is pinned!!!");

					//now we can change the colors of the ones that are pinned
					var selected = document.getElementsByClassName('toBePinned');
					for (var s = selected.length - 1; s >= 0; s--) {

						//calculate new score based on those pinned 
						var textContent = selected[s].textContent;
						var add = parseInt(textContent);
						if (add !== 3) {
							score += add;

						}

						//remove the toBePinned class and add pinned class
						selected[s].classList.add('pinned');
						selected[s].classList.remove('toBePinned');



					}
					console.log("total score", score);

					//delete the text nodes from the dice that have not been pinned
					var allDice = document.getElementsByClassName('dice');
					var allPinned = true;
					for (var a = 0; a < allDice.length; a++) {

						//if it doesnt have the pinned class then we can remove text
						if (allDice[a].classList.contains('pinned') === false) {

							allDice[a].removeChild(allDice[a].firstChild);
							allPinned = false;
						}

						allDice[a].classList.remove('pinning');

					}

					//update your score div 
					var scoreDiv = document.getElementById('yourScore');
					scoreDiv.textContent = "Your Score: " + score;


					//CHECK TO SEE IF THE GAME IS OVER
					//if all dice have been pinned 
					if (allPinned === true ) {
						pin.disabled = true;
						roll.disabled = true;

						var resultText;
						//compare computers score with users score
						if (score < compScore) {
							resultText = "You won!";

						}
						else if (score > compScore) {
							resultText = "You lost!";
						}
						else {
							resultText = 'Tie!';
						}

						var outcome = document.createElement('p');
						var outcomeText = document.createTextNode(resultText);
						outcome.appendChild(outcomeText);

						if (resultText === "You won!") {
							outcome.setAttribute("id", "win");
						}
						else if (resultText === "You lost!") {
							outcome.setAttribute("id", "lost");

						}
						else {
							outcome.setAttribute("id", "tie");

						}

						var game = document.getElementById("game");
						var child = document.getElementById("container");
						game.insertBefore(outcome, child);

					}
					else {
						//disable pin and enable roll
						pin.disabled = true;
						roll.disabled = false;

					}





				}
				else {
					console.log("nothing is pinned yet");

					//display the overlay here
					var error = document.getElementById('error-message');
					error.classList.remove('overlay');
					error.classList.add('errorOverlay');

					var errorDiv = document.querySelector('.modal');
					var errorMessage = errorDiv.getElementsByTagName('p')[0];
					errorMessage.setAttribute("class", "errortext");


					//create new text node
					var errorText = document.createTextNode("You must select at least one dice to pin.");
					errorMessage.appendChild(errorText);

					//add event listener for the ok got it button 
					var close = document.getElementsByClassName('closeButton')[0];
					close.addEventListener('click', function(evt) {
						console.log('close button pressed');
						error.classList.remove('errorOverlay');
						error.classList.add('overlay');
						errorMessage.removeChild(errorMessage.firstChild);
					});
				}

		});
	});

	


});

// GLOBAL VARIABLES
var nums = [];
var smallestNumbers = [];

//random numbers holds the orginal dice numbers
var randomNumbers = [];

//pinned dice holds the numbers that the user has picked to pin
var pinnedDice = [];

//computers score
var compScore = 0;

//players score
var score = 0;


function startGame() {

	var randomNumbers = [];

	var numbers = document.getElementById('diceValues').value;
	//check if the user didnt enter any values
	if (numbers === "") {

		//generate 5 random numbers 
		for (var i = 0; i < 5; i++) {
			var rand = Math.floor(Math.random() * 6) + 1;
			randomNumbers.push(rand);

		}
		num = randomNumbers;
	}
	else {
		var numArray = numbers.split(",");
		for (var i = 0; i < numArray.length; i++) {
			var num = parseInt(numArray[i]);
			nums.push(num);
		}
		console.log(nums);

	}

	for (var i = 5; i > 0; i--) {
		if (nums.length < i) {
			var needed = i - nums.length;
			for (var n = 0; n < needed; n++) {
				var rand = Math.floor(Math.random() * 6) + 1;
				nums.push(rand);
			}

		}
		var currentArray = nums.slice(0, i);
		console.log(currentArray);
		var smallest = currentArray[0];
		var smallestIndex = 0;

		for (var j =1; j < currentArray.length; j++) {
			if (currentArray[j] < smallest) {
				smallest = currentArray[j];
				smallestIndex = j;
			}
		}

		//get the smallest number and smallest index from that subarray
		console.log("smallest num:",smallest);
		console.log("smallest index:",smallestIndex);

		smallestNumbers.push(smallest);


		//now we delete that smallest num from the global array of numbers
		nums.splice(0, i);
	}//endfor

	console.log(smallestNumbers);
}



function createElements() {

	//create your score div
	var yourScore = document.createElement('p');
	var text = document.createTextNode("Your Score: 0");
	yourScore.setAttribute("id", "yourScore");
	yourScore.appendChild(text);

	//create containing div for 5 dice
	var container = document.createElement("div");
	container.setAttribute("id", "container");

	//create 5 dice div 
	for (var i = 0; i < 5; i++) {
		var diceDiv = document.createElement("div");
		diceDiv.setAttribute("class", "dice");
		container.appendChild(diceDiv);
	}

	var game = document.getElementById("game");
	game.appendChild(yourScore);
	game.appendChild(container);


	//create 3 buttons

	//create containing div for buttons
	var buttons = document.createElement("div");
	buttons.setAttribute("id", "buttons");


	var start = document.createElement("button");
	var s = document.createTextNode("Start");
	start.setAttribute("class", "button");
	start.appendChild(s);
	buttons.appendChild(start);

	var roll = document.createElement("button");
	roll.setAttribute("class", "button");
	roll.disabled = true;
	var r = document.createTextNode("Roll");
	roll.appendChild(r);
	buttons.appendChild(roll);


	var pin = document.createElement("button");
	pin.setAttribute("class", "button");
	pin.disabled = true;
	var p = document.createTextNode("Pin");
	pin.appendChild(p);
	buttons.appendChild(pin);
	
	game.appendChild(buttons);
}



function generateNums() {
	var compText = "Computer Score: ";
	for (var i = 0; i < smallestNumbers.length; i++) {
		if (i !== 0) {
			compText += " + ";
		}
		if (smallestNumbers[i] !== 3) {
			compScore += smallestNumbers[i];
			compText += smallestNumbers[i];

		}
		else {
			compText += " 0 (3) ";

		}
	}

	compText = compText + " = " + compScore;

	console.log("compScore:", compScore);
	console.log(compText);
	var computer = document.createElement('p');
	var text = document.createTextNode(compText);
	computer.appendChild(text);

	var game = document.getElementById("game");
	var child = document.getElementById("yourScore");
	game.insertBefore(computer, child);

	var buttons = document.querySelectorAll('button.button');
	var start = buttons[0];
	var roll = buttons[1];
		roll.disabled = false;

	//start.disabled = true;
	//start.classList.remove('button');
	start.classList.add('start');

	//here is where we can catch if they try to select dice before
	//they hit roll


} 

function rollDice() {
	
	// find out which dice need to be rolled
	//which dice dont have the pinned class 
	var allDice = document.getElementsByClassName('dice');
	for (var a = 0; a < allDice.length; a++) {

		//if it doesnt have the pinned class then we need to give it
		//a random number 
		if (allDice[a].classList.contains('pinned') === false) {

			//lets first grab as many numbers are we can from 
			//the nums array that the user inputted 
			//then we can use random numbers 
			var diceNum;
			if (nums.length > 0) {
				diceNum = nums[0];
				nums.splice(0,1);

			}
			else {
				diceNum = Math.floor(Math.random() * 6) + 1;
			}
			
			var text = document.createTextNode(diceNum);
			allDice[a].appendChild(text);

		}
	}

	//after you roll, the roll button should be disabled
	var buttons = document.querySelectorAll('button.button');
	var start = buttons[0];
	var roll = buttons[1];
	var pin = buttons[2];

	roll.disabled = true;
	pin.disabled = false;

}


function pinDice() {

	//select all the dice boxes 
	var diceDivs = document.getElementsByClassName('dice');

	for (var i = 0; i < diceDivs.length; i++) {
		var currentDice = diceDivs[i];

		if (currentDice.classList.contains('pinned') === false) {

			console.log(1);
			currentDice.classList.add('pinning');

			currentDice.addEventListener('click', togglePin);
		}
		//if its already pinned remove event listenr
		else {
						console.log(2);
			currentDice.removeEventListener('click', togglePin);
		}

	} 
}

function togglePin() {
	console.log(3);
	if (this.innerHTML !== "") {
		this.classList.toggle('toBePinned');

	}
	//it is a blank dice and display error message
	else {


		//display the overlay here
		var error = document.getElementById('error-message');
		error.classList.remove('overlay');
		error.classList.add('errorOverlay');

		var errorDiv = document.querySelector('.modal');
		var errorMessage = errorDiv.getElementsByTagName('p')[0];
		errorMessage.setAttribute("class", "errortext");


		//create new text node
		var errorText = document.createTextNode("You must roll first before selecting a die to pin.");
		errorMessage.appendChild(errorText);

		//add event listener for the ok got it button 
		var close = document.getElementsByClassName('closeButton')[0];
		close.addEventListener('click', function(evt) {
			console.log('close button pressed');
			error.classList.remove('errorOverlay');
			error.classList.add('overlay');
			errorMessage.removeChild(errorMessage.firstChild);
		});

	}

}

















