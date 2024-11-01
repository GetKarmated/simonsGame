const keys= ['A', 'Z', 'O', 'P'];
var level = null;
var userSequence = [];
var sequence = [];
var listening = false;
var remainingEntries= 0;
var currentScore= 0;
var topScore= 0;
var lastLevel = {
    sequence: [],
    remainingEntries: 0,
    time: 0
}

const $mainContainer = $('#main-container');
const $headerContainer = $('#header-container');
const $difficultyContainer= $('#difficulty-container');
const $gridContainer = $('#grid-container');
const $playButtonsContainer = $('#play-buttons-container');
const $difficultyButtons = $('#difficulty-container button');
const $startButton = $('#start');
const $resetButton = $('#reset');   
const $tryAgainButton = $('#tryagain');
const $textRules = $('#rules');
const $resultImg = $('#result-gif');
const $box = $('.box');
const $footer = $('footer');
const $indicationContainer= $('#indication-div');
const $scoreTable= $('#score-table');
const $currentScore= $('#current-score');
const $topScore= $('#top-score');

function isSafari() {
    const userAgent = window.navigator.userAgent;
    console.log(userAgent);
    return userAgent.includes('Safari') && !userAgent.includes('Chrome');
}

$(document).ready(function() {

    if (isSafari()) {
        window.location.href = "./error.html";   
        return; 
    }
    else {
        if(level === null) {
            $startButton.first().addClass('disabled-button');
        }
    
        $(document).on('keypress', function(e) {
            const letter = e.key.toUpperCase();
            if(keys.includes(letter) && listening)
            {
                handleKey(letter);
                userSequence.push(letter);
                updateRemainingEntriesText();
                if(userSequence.length === sequence.length) {
                    checkSequences();
                }
            }
        });
        $box.on('click', function() {
            const letter = $(this).text().toUpperCase();
            if(keys.includes(letter) && listening)
                {
                    handleKey(letter);
                    userSequence.push(letter);
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
        });
    
        $startButton.click(function() {
            sequence = [];
            userSequence = [];  
            designState('demo-state');
            setTimeout(function(){
                startGame(level);
            }, 500);
           
        });
    
        $tryAgainButton.click(function() {
            userSequence = [];
    
            designState('demo-state');
            setTimeout(function(){
                playSequence(lastLevel.time,0, true);
            }, 500);
    
        });
        $resetButton.click(function() {
            userSequence = [];
            remainingEntries = lastLevel.remainingEntries;
            updateRemainingEntriesText();
            $resetButton.addClass('active');
            setTimeout(function() {
                $resetButton.removeClass('active');
            }, 400);
        });
    }


});










function handleKey(key, time= 120) {
    let selectedBox = $('.box:contains(' + key + ')');

    selectedBox.addClass('selected-box');
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
                designState('play-state');
                updateRemainingEntriesText();
                listening = true;
            }, 500);
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
        currentScore++;
        if(currentScore > topScore) {
            topScore = currentScore;
        }
        designState('win-screen');
    } else {
        $textRules.text('Its ok...try again !');
        currentScore = 0;
        designState('lose-screen');
    }
};

function designState(state) {
    $resultImg.css('display', 'block');
    $startButton.text('New level');

    switch(state){
        case 'win-screen':
            $gridContainer.hide();
            $resultImg.attr('src', './img/win.gif');
            $currentScore.text('Current score: ' + currentScore);
            $topScore.text('Top score: ' + topScore);
            $tryAgainButton.hide();
            $resetButton.hide();
            $startButton.addClass('gradient-background');
            $startButton.addClass('start-button-onGame');
            $startButton.removeClass('play-buttons');
            break;
        case 'lose-screen':
            $gridContainer.hide();
            $resultImg.attr('src', './img/lose.gif');
            $currentScore.text('Current score: ' + currentScore);
            $topScore.text('Top score: ' + topScore);
            $tryAgainButton.show();
            $tryAgainButton.addClass('gradient-background');
            $resetButton.hide();
            $startButton.removeClass('start-button-onGame');
            $tryAgainButton.addClass('play-buttons');
            break;
        case 'play-state':
            $box.removeClass('augmented-box');
            $box.removeClass('box-onDemo');
            $box.addClass('box-onGame');
            $textRules.show();
            $difficultyContainer.show();
            $playButtonsContainer.show();
            $tryAgainButton.hide();
            $resultImg.css('display', 'none');
            $resetButton.show();
            $headerContainer.removeClass('header-container-demo');
            $gridContainer.removeClass('grid-container-demo');
            $startButton.removeClass('gradient-background');
            $mainContainer.addClass('main-container-onGame');
            $startButton.addClass('play-buttons');
            $difficultyContainer.addClass('difficulty-container-onGame');
            $difficultyButtons.addClass('difficulty-button-onGame');
            $scoreTable.css('display', 'flex');
            break;
        case 'demo-state':
            if (!$gridContainer.parent().is($mainContainer)) {
                $gridContainer.insertAfter($difficultyContainer);
            }  
            $indicationContainer.hide();
            $gridContainer.addClass('grid-container-onGame');
            $gridContainer.addClass('grid-container-demo');
            $box.addClass('box-onDemo');
            $box.addClass('augmented-box');
            $headerContainer.addClass('header-container-demo');
            $resultImg.css('display', 'none');
            $scoreTable.css('display', 'none');
            $textRules.hide();
            $footer.hide();
            $difficultyContainer.hide();
            $playButtonsContainer.hide();
            $gridContainer.show();
            break;
        default:
            break;
    }
};



























