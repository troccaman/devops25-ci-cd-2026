const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

const endpoints = {
    "+": "/add",
    "-": "/subtract",
    "*": "/multiply",
    "/": "/divide"
};

const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};

function updateDisplay() {
    resultDisplay.textContent = currentInput;
}

function inputNumber(number) {
    if (waitingForSecondNumber) {
        currentInput = number;
        waitingForSecondNumber = false;
    } else {
        currentInput = currentInput === "0"
            ? number
            : currentInput + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondNumber) {
        currentInput = "0";
        waitingForSecondNumber = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    firstNumber = Number(currentInput);
    operator = selectedOperator;
    waitingForSecondNumber = true;

    expressionDisplay.textContent =
        `${currentInput} ${symbols[operator]}`;
}

async function calculate() {
    if (operator === null || firstNumber === null ||
        waitingForSecondNumber) {
        return;
    }

    const secondNumber = Number(currentInput);
    const endpoint = endpoints[operator];

    try {
        const response = await fetch(
            `${endpoint}?a=${encodeURIComponent(firstNumber)}&b=${encodeURIComponent(secondNumber)}`
        );

        if (!response.ok) {
            throw new Error("Beräkningen misslyckades");
        }

        const data = await response.json();

        expressionDisplay.textContent =
            `${firstNumber} ${symbols[operator]} ${secondNumber} =`;

        currentInput = String(data.result);
        updateDisplay();

    } catch (error) {
        resultDisplay.textContent = "Fel";
        console.error(error);
        currentInput = "0";
    }

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    expressionDisplay.textContent = "";
    updateDisplay();
}

function backspace() {
    if (waitingForSecondNumber) return;

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";

    if (currentInput === "-") currentInput = "0";
    updateDisplay();
}

function toggleSign() {
    if (currentInput === "0") return;

    currentInput = String(-Number(currentInput));
    updateDisplay();
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        if (button.dataset.number !== undefined) {
            inputNumber(button.dataset.number);
        } else if (button.dataset.operator) {
            chooseOperator(button.dataset.operator);
        } else {
            switch (button.dataset.action) {
                case "equals":
                    calculate();
                    break;
                case "clear":
                    clearCalculator();
                    break;
                case "backspace":
                    backspace();
                    break;
                case "sign":
                    toggleSign();
                    break;
            }
        }
    });
});
