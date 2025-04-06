// Constants
const COLOR_PICKER_INITIAL_SIZE = 300;
const COLOR_PICKER_MAX_SIZE = 400;
const HUE_STEP = 1;
const LIGHTNESS_MIN = 50;
const LIGHTNESS_MAX = 100;

// Initialize color picker
var colorPicker = new iro.ColorPicker("#color-wheel", {
    
    width: COLOR_PICKER_INITIAL_SIZE,
 
    layout: [{ component: iro.ui.Wheel }],
});

var answer = '#000000';
var WrongGuesses = [];
// $(document).load(function () {
//     $("body").removeClass("preload");
// });

$(document).ready(function () {
     initGame();
     const root = document.documentElement;
     root.style.setProperty("--my-transition", " background-color 0.5s, color 0.5s, border 0.5s, width 0.1s, height 0.1s");
    $("#theme-toggle").click(ToggleTheme);

    //  $("#overlay").click(function (event) {
    //     if (event.target.id === "overlay") {
    //         HideModal();
    //     }
    //  });    
     $(".btn-close").click(function (event) {
       
        HideModal();
   
     });

    $("#btn-sittings").click(function () {
        ShowModal("sittings-modal");
     }); 
     $("#btn-howto").click(function () {
        ShowModal("how-to");
     });
    $('#sb-difcility').change(function() {
                ApplyDifcility($(this).val());
    });
        // Toggle color picker size
    $("#max").click(function () {
        toggleColorPickerSize(COLOR_PICKER_MAX_SIZE, true);
    });

    $("#shrink").click(function () {
        toggleColorPickerSize(COLOR_PICKER_INITIAL_SIZE, false);
    });

    // Initialize game
   

    // Restart game
    $("#Againbtn").click(initGame);

    // Handle guess button click
    $("#guessbtn").click(handleGuess);

    // Update color picker on color change
    colorPicker.on(["color:init", "color:change"], updateColorDisplay);

    // Handle keyboard input
    $(document).keydown(handleKeydown);
});

// Toggle color picker size
function toggleColorPickerSize(size, isMaximized) {
    $("#shrink").toggle(isMaximized);
    $("#max").toggle(!isMaximized);
    colorPicker.resize(size);
}
function ToggleTheme() {
    let savedTheme = localStorage.getItem("theme");
    ApplyTheme (savedTheme === "dark" ? "light" : "dark");
}
// Handle guess button click
function handleGuess() {
    var hex = colorPicker.color.hexString;

    if (WrongGuesses.includes(hex)) {
        showToast("already");
        return;
    }

    if (CheckHex(answer, hex)) {
        win();

        return;
    }

    WrongGuesses.push(hex);
}

// Update color display
function updateColorDisplay(color) {
    var hex = color.hexString;
    $("#r1").text(hex[1]);
    $("#r2").text(hex[2]);
    $("#g1").text(hex[3]);
    $("#g2").text(hex[4]);
    $("#b1").text(hex[5]);
    $("#b2").text(hex[6]);
    $("#current-color").css("background-color", hex);
}

// Handle keyboard input
function handleKeydown(event) {
    
    const currentHue = colorPicker.color.hue;
    const currentLightness = colorPicker.color.hsl.l;
    let x=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"];
    if (x.includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case "ArrowUp":
         
            colorPicker.color.hsl = { h: (currentHue + HUE_STEP) % 360, s: 100, l: currentLightness };
            break;
        case "ArrowDown":
         
            colorPicker.color.hsl = { h: (currentHue - HUE_STEP + 360) % 360, s: 100, l: currentLightness };
            break;
        case "ArrowLeft":
         
            colorPicker.color.hsl = { h: currentHue, s: 100, l: Math.min(currentLightness + HUE_STEP, LIGHTNESS_MAX) };
            break;
        case "ArrowRight":
         
            colorPicker.color.hsl = { h: currentHue, s: 100, l: Math.max(currentLightness - HUE_STEP, LIGHTNESS_MIN) };
            break;
        case "Enter":
         
            $("#guessbtn").click();
            break;
    }
}



// Add current guess to the UI
function AddCurentGuess(hex, result) {
    var newElement = $('<div>', { class: 'color-row' });
    newElement.append($('<div>', { id: 'num' }).text("#"));

    for (let i = 1; i <= 6; i++) {
        newElement.append($('<div>', { class: `color-box ${result[i]}` }).text(hex[i]));
    }

    newElement.append($('<div>', { class: 'color-box' }).css("background-color", $("#current-color").css("background-color")));
    $('#guess').prepend(newElement);

    
}

// Check if the guess matches the answer
function CheckHex(answerArg, guessArg) {
    let answer = answerArg.split("");
    let guess = guessArg.split("");
    let result = Array(7).fill("");

    // Check for correct positions
    for (let i = 0; i < guess.length; i++) {
        if (answer[i] === guess[i]) {
            result[i] = "right-Place";
            answer[i] = '-';
            guess[i] = '-';
        }
    }

    // Check for misplaced values
    for (let i = 0; i < guess.length; i++) {
        if (result[i] === "" && answer.includes(guess[i])) {
            result[i] = "wrong-Place";
            answer[answer.indexOf(guess[i])] = '-';
        }
    }

    AddCurentGuess(guessArg, result);
    return guessArg === answerArg;
}

// Generate a random color
function randomColor() {
    var h = Math.floor(Math.random() * 360);
    var l = Math.floor(Math.random() * 50) + 50;
    colorPicker.color.hsl = { h: h, s: 100, l: l };
    return colorPicker.color.hexString;
}

// Initialize the game
function initGame() {
    HideModal();
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === null) {
        localStorage.setItem("theme", "dark");
        savedTheme = "dark";
    }
    let savedDifcility = localStorage.getItem("difcility");
    if (savedDifcility === null) {
        localStorage.setItem("difcility", "normal");
        savedDifcility = "normal";
    }
  
    $('#color').val('savedDifcility'); 
    ApplyTheme(savedTheme);
    ApplyDifcility(savedDifcility);
    $("#guessbtn").show();
    $("#shrink").hide();
    $("#max").show();
    $("#guess").empty();
    answer = randomColor();
    colorPicker.color.hsl = { h: 0, s: 100, l: 100 };
    WrongGuesses = [];
    $("#Answer-color-box").css("background-color", answer);

}

// Show toast notification
function showToast(type) {
    setTimeout(() => $('.toast-' + type).addClass('show'), 10);
    setTimeout(() => $('.toast-' + type).removeClass('show'), 2000);
}
function ApplyTheme(theme) {
    $("#theme-toggle").prop("checked",theme=== "dark"? true : false);
    const root = document.documentElement;
    if (theme === "light") {
        colorPicker.borderColor= "#0D1B2A";
        colorPicker.forceUpdate();
        root.style.setProperty("--primary-color", "var(--light-primary-color)");
        root.style.setProperty("--background-color", "var(--light-background-color)");
        localStorage.setItem("theme", "light");
    } else {
        colorPicker.borderColor= "#F1F0EA";
        colorPicker.forceUpdate();
        root.style.setProperty("--primary-color", "var(--dark-primary-color)");
        root.style.setProperty("--background-color", "var(--dark-background-color)");
        localStorage.setItem("theme", "dark");
    }
   
}
function ApplyDifcility(difcility) {
    if(difcility=="normal"){
        $("#Answer").addClass("display-none");
    }else if (difcility=="easy"){
        $("#Answer").removeClass("display-none");
    }
    $('#sb-difcility').val(difcility);
    localStorage.setItem("difcility", difcility);
}

function win() {
    $("#guessbtn").hide();
    $("#num-guess").text(WrongGuesses.length + 1);
    $("#win-color").css("background-color", answer);
    $("#win-hex").text( answer);

    showToast("win");
    setTimeout(() => {
        ShowModal("win-screen");

    }, 500);
}

function ShowModal(id){
    $("#"+id).toggleClass("display-none");
    $("#overlay").show();

}

function HideModal(){
    $("#overlay").hide();
    $(".modal").addClass("display-none");
}
