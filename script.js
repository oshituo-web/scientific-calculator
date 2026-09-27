const currentOperation = document.querySelector(".current-operation");
const previousOperation = document.querySelector(".previous-operation");
const buttons = document.querySelectorAll("button");

let expression = "";
let pendingFunction = null;


function hasDecimal() {
    const parts = expression.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];
    return currentNumber.includes(".");
}

function formatResult(result) {
    return Number(result.toFixed(10));
}

function formatExpressionForDisplay(value) {
    return value
    .replace(/\d+(?:\.\d+)?/g, function(number) {
        return Number(number).toLocaleString("en-US",{
            maximumFractionDigits: 10
        });
    })
    .replace(/\*\*/g, " ^ ")
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " − ")
        .replace(/\s+/g, " ")
        .trim();
}

function degreesToRadians(degrees) {
    return degrees * Math.PI/180;
}

// Numbers and decimals
buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const value = button.textContent;

        if (button.classList.contains("number")) {
            if (value === ".") {
                if (hasDecimal()) {
                    return;
                }
            }
            expression += value;
            currentOperation.textContent = formatExpressionForDisplay(expression);
        }

        // operators
        if (button.classList.contains("operator")) {
            if (value === "x") {
                expression += "*";
            }
            else if (value === "÷") {
                expression += "/";
            }
            else if (value === "-") {
                expression += "-";
            }
            else {
                expression += value;
            }
            currentOperation.textContent = formatExpressionForDisplay(expression);
        }

        // Equals button
        if (button.classList.contains("equals")) {
            let result;

            if (pendingFunction === "sqrt") {
                result = Math.sqrt(Number(expression));
                previousOperation.textContent = "√" + expression;
            } 
           else if (pendingFunction === "square") {
                result = Number(expression) ** 2;
                previousOperation.textContent = expression +  "²";
           }
            else if (pendingFunction === "sin") {
                result = Math.sin(degreesToRadians(Number(expression)));
                previousOperation.textContent = "sin(" + expression +")";
            }
            else if (pendingFunction === "cos") {
                result = Math.cos(degreesToRadians(Number(expression)));
                previousOperation.textContent = "cos( "+ expression + ")";
            }
            else if (pendingFunction === "tan") {
                result = Math.tan(degreesToRadians(Number(expression)));
                previousOperation.textContent = "tan( "+ expression + ")";
            }
            
            else {
                result = eval(expression);
                previousOperation.textContent = expression;
        
            }
            const formattedResult = formatResult(result);
            currentOperation.textContent = Number(formattedResult).toLocaleString("en-US");
            expression = formattedResult.toString();
            pendingFunction = null;
        
        }

        // Clear button
        if (button.classList.contains("clear")) {
            expression = "";
            currentOperation.textContent = "0";
            previousOperation.textContent = "";
            pendingFunction = null;
        }
        // Delete button
        if (button.classList.contains("delete")) {
            expression = expression.slice(0, -1);
            if (expression === "") {
                currentOperation.textContent = "0";
            }
            else {
                currentOperation.textContent = expression;
            }
        }

        if (button.classList.contains("parentheses")) {
            const openBrackets = (expression.match(/\(/g) || []).length;
            const closeBrackets = (expression.match(/\)/g) || []).length;
        
            if (
                expression === "" ||
                /[\+\-\*\/\(]$/.test(expression)
            ) {
                expression += "(";
            }
        
            else if (openBrackets > closeBrackets) {
                expression += ")";
            }
            currentOperation.textContent = expression;
        }

        if (button.classList.contains("function")) {
            if (value === "√") {
                pendingFunction = "sqrt";
                previousOperation.textContent = "√";
                currentOperation.textContent = 0;
            }
        }
            if (value === "x²") {
            pendingFunction = "square";
            previousOperation.textContent = "x²";
            currentOperation.textContent = "0";
        }
            if (value === "xʸ") {
            expression += "**";
            currentOperation.textContent = formatExpressionForDisplay(expression);
        
        }

        
            if (value === "π") {
            expression += Math.PI;
            currentOperation.textContent = expression;
        }
            if (value === "e") {
            expression += Math.E;
            currentOperation.textContent = formatExpressionForDisplay(expression);
        }
        if (value === "sin") {
            pendingFunction = "sin";
            previousOperation.textContent = "sin";
            currentOperation.textContent = "0";
        }
        if (value === "cos") {
            pendingFunction = "cos";
            previousOperation.textContent = "cos";
            currentOperation.textContent = "0";
        }
        if (value === "tan") {
            pendingFunction = "tan";
            previousOperation.textContent = "tan";
            currentOperation.textContent = "0";
        }
        if (value === "+/-") {
            const number = Number(expression);
            const result = number * -1;
            currentOperation.textContent = result;
            expression = result.toString();
        }
    });
});
