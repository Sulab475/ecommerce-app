const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".calc-button");

let currentInput = "0";
let firstValue = null;
let operator = null;
let shouldReset = false;

function updateScreen(value) {
    screen.innerText = value;
}

function calculate(a, b, op) {
    switch(op) {
        case "÷": return b === 0 ? "Error" : a / b;
        case "×": return a * b;
        case "−": return a - b;
        case "+": return a + b;
        default: return b;
    }
}

function handleInput(value) {

    if (!isNaN(value)) {
        if (currentInput === "0" || shouldReset) {
            currentInput = value;
            shouldReset = false;
        } else {
            currentInput += value;
        }
    }

    else if (value === ".") {
        if (!currentInput.includes(".")) {
            currentInput += ".";
        }
    }

    else if (value === "C") {
        currentInput = "0";
        firstValue = null;
        operator = null;
    }

    else if (value === "←") {
        currentInput = currentInput.length > 1 ? currentInput.slice(0,-1) : "0";
    }

    else if (value === "=") {
        if (operator !== null && firstValue !== null) {
            const result = calculate(firstValue, parseFloat(currentInput), operator);
            currentInput = result.toString();
            firstValue = null;
            operator = null;
        }
    }

    else {
        if (firstValue === null) {
            firstValue = parseFloat(currentInput);
        } else {
            firstValue = calculate(firstValue, parseFloat(currentInput), operator);
        }
        operator = value;
        shouldReset = true;
    }

    updateScreen(currentInput);
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleInput(button.innerText);
    });
});

/* Keyboard Support */
document.addEventListener("keydown", (e) => {
    if (e.key >= 0 && e.key <= 9) handleInput(e.key);
    if (e.key === ".") handleInput(".");
    if (e.key === "+") handleInput("+");
    if (e.key === "-") handleInput("−");
    if (e.key === "*") handleInput("×");
    if (e.key === "/") handleInput("÷");
    if (e.key === "Enter") handleInput("=");
    if (e.key === "Backspace") handleInput("←");
    if (e.key === "Escape") handleInput("C");
});