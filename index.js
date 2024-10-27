const keys= ['A', 'Z', 'O', 'P'];
var level = null;
var userSequence = [];
var sequence = [];
var listening = false;
var remainingEntries= 0;
var lastLevel = {
    sequence: [],
    remainingEntries: 0,
    time: 0
}

const $textRules = $('#rules');
const $difficultyContainer= $('.difficulty-container');
const $gridContainer = $('.grid-container');
const $playButtonsContainer = $('.play-buttons-container');
const $resultImg = $('#result-gif');
const $startButton = $('#start');
const $difficultyButtons = $('.difficulty-container button');
const $tryAgainButton = $('#tryagain');
const $textDifficulty = $('.difficulty-container .text');
const $box = $('.box');



$(document).ready(function() {

    if(level === null) {
        $startButton.first().addClass('disabled-button');
    }

    $(document).on('keypress', function(e) {
        if(keys.includes(e.key.toUpperCase()) && listening)
        {
            handleKey(e.key.toUpperCase());
            userSequence.push(e.key.toUpperCase());
            updateRemainingEntriesText();
            if(userSequence.length === sequence.length) {
                checkSequences();
            }
        }
    });

    $difficultyButtons.click(function(e) {
        const target = e.currentTarget;
        level = $(target).text().toLowerCase();    
        $(target).addClass('active').siblings().removeClass('active');
        $startButton.removeClass('disabled-button');
        $startButton.addClass('gradient-background');
        $textDifficulty.hide();
    });

    $startButton.click(function() {
        resultState();
        hideButtons('hide');
        $box.addClass('augmented-box');
        setTimeout(function(){
            startGame(level);
        }, 500);
       
    });

    $tryAgainButton.click(function() {
        resultState('retry');
        hideButtons('hide');
        $box.addClass('augmented-box');
        setTimeout(function(){
            playSequence(lastLevel.time,0, true);
        }, 500);

    });

});










function handleKey(key, time= 120) {
    let selectedBox = $('.box:contains(' + key + ')');

    selectedBox.addClass('selected-box');
    playSound(key.toUpperCase());
    setTimeout(function() {
        selectedBox.removeClass('selected-box');
    }, time);
};

function playSound(key) {
    let audio = document.getElementById('sound-' + key);

    if(audio) {
        audio.currentTime = 0; 
        audio.play();
    }
};











function startGame(selectedLevel) {
    const time = levelGenerator(selectedLevel);

    playSequence(time);
    console.log(sequence, level, time);
};

function levelGenerator(difficultyLevel) {
    let length;
    let time;

    switch(difficultyLevel)
    {
        case 'easy':
            length = 6;
            time= 800;
            break;
        case 'medium':
            length = 10;
            time= 500;
            break;
        case 'hard':
            length = 15;
            time= 250;
            break;
        default:
            length = 5;
            time= 1000;
            break;
    }

    for (let i = 0; i < length; i++) {
        sequence.push(keys[Math.floor(Math.random() * keys.length)]);
    }
    remainingEntries = length+1;

    lastLevel = {
        sequence: sequence,
        remainingEntries: remainingEntries,
        time: time,
    }

    return time;
};

function playSequence(time, index=0, tryAgain= false) {

    if(tryAgain) {
        sequence = lastLevel.sequence;
        remainingEntries = lastLevel.remainingEntries;
        time = lastLevel.time;

        console.log(sequence, level, time);
    }

    if (index < sequence.length) {
        handleKey(sequence[index], time);
        setTimeout(function() {
            playSequence(time, index + 1);
        }, time);
    }
    else {
            setTimeout(function() {
                $box.removeClass('augmented-box');
                hideButtons('show');
                updateRemainingEntriesText();
                listening = true;
            }, 500);
        }
};

function hideButtons(state) {
    switch(state){
        case 'hide':
            $textRules.hide();
            $difficultyContainer.hide();
            $playButtonsContainer.hide();
            break;
        case 'show':
            $textRules.show();
            $difficultyContainer.show();
            $playButtonsContainer.show();
            $startButton.removeClass('gradient-background');
            break;
        default:
            break;
    }
};

function updateRemainingEntriesText() {
    remainingEntries--;
    $textRules.text('Remaining entries: ' + remainingEntries);
};

















function checkSequences() {
    listening = false;

    if (userSequence.join('') === sequence.join('')) {
        $textRules.text('Well done !');
        resultState('win');
    } else {
        $textRules.text('Its ok...try again !');
        resultState('lose');
    }
};

function resultState(state) {
    $resultImg.css('display', 'block');
    $startButton.text('New level');

    switch(state){
        case 'win':
            $gridContainer.toggle();
            $resultImg.attr('src', './img/win.gif');
            $tryAgainButton.hide();
            $startButton.addClass('gradient-background');
            break;
        case 'lose':
            $gridContainer.toggle();
            $resultImg.attr('src', './img/lose.gif');
            $tryAgainButton.show();
            $tryAgainButton.addClass('gradient-background');
            $startButton.addClass('play-buttons');
            break;
        case 'retry':
            userSequence = [];
            $resultImg.css('display', 'none');
            $gridContainer.show();
            $tryAgainButton.hide();
            $tryAgainButton.removeClass('gradient-background');
            $startButton.removeClass('gradient-background');
            $startButton.removeClass('play-buttons');
            break;
        default:
            sequence = [];
            userSequence = [];    
            $resultImg.css('display', 'none');
            $gridContainer.show();
            $tryAgainButton.hide();
            $tryAgainButton.removeClass('gradient-background');
            $startButton.removeClass('gradient-background');
            $startButton.removeClass('play-buttons');
            break;
    }
};



























