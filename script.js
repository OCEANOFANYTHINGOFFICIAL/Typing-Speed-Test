
let restart_btn = document.querySelector(".restart_btn");

let inpField = document.querySelector(".textbox .textarea");
let quotesShuffled = false;

let TIME_LIMIT = 60,
    charIndex = (mistakes = isTyping = 0);
let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let timer = null;
let acc = 0,
    err = 0;
const FULL_DASH_ARRAY = 220;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green",
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD,
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD,
    },
};
let remainingPathColor = COLOR_CODES.info.color;

let quotes_array = [
    `Web Technology refers to the various tools and techniques that are utilized in the process of communication between different types of devices over the Internet. A web browser is used to access web pages. Web browsers can be defined as programs that display text, data, pictures, animation, and video on the Internet. Hyperlinked resources on the World Wide Web can be accessed using software interfaces provided by Web browsers.`,
    `JavaScript is a lightweight, cross-platform, single-threaded, and interpreted compiled programming language. It is also known as the scripting language for webpages. It is well-known for the development of web pages, and many non-browser environments also use it. JavaScript is a weakly typed language (dynamically typed). JavaScript can be used for Client-side developments as well as Server-side developments.`,
    `In this HTML tutorial, whether you are a beginner or a professional, this tutorial covers everything you need to know to learn HTML from the basics to advanced. Providing step-by-step instructions for easy learning, it will help you become proficient in HTML. HTML stands for HyperText Markup Language. It is used to design the web pages. With the help of HTML, you can create a complete website structure.`,
];

let selectedQuote = quotes_array[0];

function loadParagraph() {
    const ranIndex = Math.floor(
        Math.random() * quotes_array.length
    );
    if (TIME_LIMIT == 60)
        selectedQuote = quotes_array[ranIndex];

    typingText.innerHTML = "";
    charCount.innerText = "0/" + selectedQuote.length;
    selectedQuote.split("").forEach((char) => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText
        .querySelectorAll("span")[0]
        .classList.add("active");
    contentBox.addEventListener("click", () =>
        inpField.focus()
    );
    typingText.addEventListener("click", () =>
        inpField.focus()
    );
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(updateTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (
                    characters[
                        charIndex
                    ].classList.contains("incorrect")
                ) {
                    mistakes--;
                }
                characters[charIndex].classList.remove(
                    "correct",
                    "incorrect"
                );
            }
        } else {
            if (
                characters[charIndex].innerText == typedChar
            ) {
                characters[charIndex].classList.add(
                    "correct"
                );
            } else {
                mistakes++;
                characters[charIndex].classList.add(
                    "incorrect"
                );
            }
            charIndex++;
        }
        characters.forEach((span) =>
            span.classList.remove("active")
        );
        characters[charIndex].classList.add("active");
        perSec();

        // If back to initial
        if (charIndex === 0) {
            acc = 0;
            err = 0;
            mistakeTag.innerHTML =
                "Error <br />" + err + "%";
            accTag.innerHTML =
                "Accuracy <br />" + acc + "%";
        } else {
            err = ((mistakes * 100) / charIndex).toFixed(0);
            mistakeTag.innerHTML =
                "Error <br />" + err + "%";
            acc =
                100 -
                ((mistakes * 100) / charIndex).toFixed(0);
            accTag.innerHTML =
                "Accuracy <br />" + acc + "%";
        }
        charCount.innerText = charIndex + "/" + selectedQuote.length;

    } else {
        clearInterval(timer);
        inpField.value = "";
    }
    restart_btn.style.display = "inline";
}

loadParagraph();
inpField.addEventListener("input", initTyping);

function perSec() {
    setInterval(() => {
        let wpm = Math.round(
            ((charIndex - mistakes) /
                5 /
                (TIME_LIMIT - timeLeft)) *
            60
        );
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerHTML = "WPM  <br /> " + wpm;
        cpmTag.innerHTML =
            "CPM  <br /> " + (charIndex - mistakes);
    }, 1000);
}

function updateTimer() {
    if (timeLeft > 0) {
        // Decrease the current time left
        timeLeft--;

        // Increase the time elapsed
        timeElapsed++;

        // Update the timer text
        timer_text.innerHTML =
            "Time<br />" + timeLeft + "s";
        // timeElapsed = timeElapsed += 1;
        // timeLeft = TIME_LIMIT - timeElapsed;
        // document.getElementById(
        // base-timer-label.innerText = timeLeft + "S";
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
    } else {
        // Finish the game
        // finishGame();
    }
}

function finishGame() {
    // Stop the timer
    clearInterval(timer);

    // Disable the input area
    input_area.disabled = true;

    // Calculate CPM and WPM based on the actual time limit set by the user
    let correctCharacters = characterTyped - total_errors;
    cpm = Math.round(
        (correctCharacters / timeElapsed) * 60
    );
    wpm = Math.round(
        correctCharacters / 5 / (timeElapsed / 60)
    );
}

function resetGame() {
    // Generate a new data and reset other values
    // if (TIME_LIMIT == 60)
    loadParagraph();
    clearInterval(timer);
    timeLeft = TIME_LIMIT;
    charIndex = mistakes = isTyping = 0;
    acc = 0;
    err = 0;
    inpField.value = "";
    mistakeTag.innerHTML = "Error <br />" + err + "%";
    accTag.innerHTML = "Accuracy <br />" + acc + "%";
    cpmTag.innerHTML = "CPM  <br /> 0";
    wpmTag.innerHTML = "WPM  <br /> 0 ";
    timer_text.innerHTML = "Time <br /> 0s";
    restart_btn.style.display = "none";

    setCircleDasharray()
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return (
        rawTimeFraction -
        (1 / TIME_LIMIT) * (1 - rawTimeFraction)
    );
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 220`;

    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    const acccircleDasharray = `${(
        (acc * FULL_DASH_ARRAY) /
        100
    ).toFixed(0)} 220`;
    document
        .getElementById("base-acc-path-remaining")
        .setAttribute(
            "stroke-dasharray",
            acccircleDasharray
        );
    const errcircleDasharray = `${(
        (err * FULL_DASH_ARRAY) /
        100
    ).toFixed(0)} 220`;
    document
        .getElementById("base-err-path-remaining")
        .setAttribute(
            "stroke-dasharray",
            errcircleDasharray
        );
}

resetGame();

function setTime() {
    TIME_LIMIT = customInput.value;
    resetGame();
}

function resetTime() {
    TIME_LIMIT = 60;
    customInput.value = "";
    resetGame();
}
