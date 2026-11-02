
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const messageDisplay = document.getElementById("message");
const historyList = document.getElementById("history-list");
const toast = document.getElementById("toast");

let expression = "";
let history = [];

const symbols = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷"
};

function formatNumber(number) {
  if (!Number.isFinite(number)) {
    throw new Error("Invalid result");
  }

  return String(Number.parseFloat(number.toPrecision(12)));
}

// Convert the expression into tokens
function tokenize(input) {
  const tokens = input.match(/\d*\.?\d+|[+\-*/()%]/g) || [];

  const joined = tokens.join("");
  const original = input.replace(/\s/g, "");

  if (joined !== original) {
    throw new Error("Invalid expression");
  }

  return tokens;
}

// BODMAS expression parser
function evaluateExpression(input) {
  const tokens = tokenize(input);
  let position = 0;

  function parseExpression() {
    let value = parseTerm();

    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position++];

      if (operator === "+") {
        value += parseTerm();
      } else {
        value -= parseTerm();
      }
    }

    return value;
  }

  function parseTerm() {
    let value = parseUnary();

    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position++];
      const nextValue = parseUnary();

      if (operator === "*") {
        value *= nextValue;
      } else {
        if (nextValue === 0) {
          throw new Error("Cannot divide by zero!");
        }

        value /= nextValue;
      }
    }

    return value;
  }

  function parseUnary() {
    if (tokens[position] === "+") {
      position++;
      return parseUnary();
    }

    if (tokens[position] === "-") {
      position++;
      return -parseUnary();
    }

    return parsePrimary();
  }

  function parsePrimary() {
    let value;

    if (tokens[position] === "(") {
      position++;
      value = parseExpression();

      if (tokens[position] !== ")") {
        throw new Error("Missing closing bracket");
      }

      position++;
    } else {
      const token = tokens[position];

      if (token === undefined || !/^\d*\.?\d+$/.test(token)) {
        throw new Error("Enter a valid number");
      }

      value = Number(token);
      position++;
    }

    // Percentage is a postfix operator
    while (tokens[position] === "%") {
      value /= 100;
      position++;
    }

    return value;
  }

  if (tokens.length === 0) {
    throw new Error("Enter a calculation");
  }

  const answer = parseExpression();

  if (position !== tokens.length) {
    throw new Error("Invalid expression");
  }

  if (!Number.isFinite(answer)) {
    throw new Error("Result is too large");
  }

  return answer;
}

function displayExpression() {
  expressionDisplay.textContent = expression
    ? expression.replace(/[+\-*/]/g, operator => symbols[operator])
    : "0";

  if (!expression) {
    resultDisplay.textContent = "0";
    showMessage("Ready for your calculation");
    return;
  }

  try {
    const preview = evaluateExpression(expression);
    resultDisplay.textContent = formatNumber(preview);
    showMessage("Live result · BODMAS enabled");
  } catch (error) {
    resultDisplay.textContent = "—";
    showMessage(error.message);
  }
}

function addToExpression(value) {
  if (expression.length >= 60) return;

  const last = expression.slice(-1);

  // Avoid two decimal points in the same number
  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/()%]/).pop();

    if (currentNumber.includes(".")) return;

    if (!currentNumber) {
      expression += "0";
    }
  }

  // Avoid duplicate operators
  if (["+", "-", "*", "/"].includes(value)) {
    if (!expression && value !== "-") return;

    if (["+", "-", "*", "/"].includes(last)) {
      expression = expression.slice(0, -1);
    }
  }

  expression += value;
  displayExpression();
}

function clearCalculator() {
  expression = "";
  displayExpression();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  displayExpression();
}

function calculateResult() {
  if (!expression) return;

  const originalExpression = expression;

  try {
    const answer = evaluateExpression(expression);
    const formattedAnswer = formatNumber(answer);

    history.unshift({
      expression: originalExpression,
      answer: formattedAnswer
    });

    if (history.length > 8) {
      history.pop();
    }

    expression = formattedAnswer;
    displayExpression();
    showMessage("Calculation completed successfully");
    renderHistory();

  } catch (error) {
    showMessage(error.message);
    resultDisplay.textContent = "Error";
  }
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML =
      '<p class="empty-history">Your calculations will appear here.</p>';
    return;
  }

  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-item";

    const calculation = document.createElement("span");
    calculation.textContent = item.expression.replace(
      /[+\-*/]/g,
      operator => symbols[operator]
    );

    const answer = document.createElement("span");
    answer.textContent = "= " + item.answer;

    row.append(calculation, answer);
    historyList.appendChild(row);
  });
}

function showMessage(text) {
  messageDisplay.textContent = text;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

// Calculator button events
document.querySelector(".keypad").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    addToExpression(value);
  } else if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteLast();
  } else if (action === "equals") {
    calculateResult();
  }
});

// Keyboard support
document.addEventListener("keydown", event => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    addToExpression(key);
  } else if (["+", "-", "*", "/", "(", ")", "%"].includes(key)) {
    addToExpression(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

// Clear history
document.getElementById("clear-history").addEventListener("click", () => {
  history = [];
  renderHistory();
  showToast("History cleared");
});

// Copy current result
document.getElementById("copy-btn").addEventListener("click", async () => {
  try {
    const value = evaluateExpression(expression);
    await navigator.clipboard.writeText(formatNumber(value));
    showToast("Result copied!");
  } catch (error) {
    showToast("No valid result to copy");
  }
});

// Initial setup
displayExpression();
renderHistory();
