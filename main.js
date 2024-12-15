const buttons = document.querySelectorAll(".button-3d");
const screen = document.querySelector("#screen");
const body = document.querySelector("body");
let opp = 1;
let formule = [];
let r = [];
const p = [];
let maxicolor = 255;
let newcalc = true

const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

buttons.forEach(button => {
    button.addEventListener("click", () => {
        if(newcalc==true)
            formule=[]
        const text = button.textContent.trim();
        newcalc=false

        if (!isNaN(text)) { // If the text is a number
            if (formule.length > 0 && !isNaN(formule[formule.length - 1])) {
                formule[formule.length - 1] += text;
            } else {
                formule.push(text);
            }
            opp = 0;
        } else if (text === "(") {
            screen.textContent += text;
            formule.push(text);
        } else if (text === ")") { // Handle closing parenthesis
            if (countOccurrences(formule, "(") > countOccurrences(formule, ")")) {
                screen.textContent += text;
                formule.push(text);
            }
        } else if (text === "=") { // Handle equals button
            newcalc = true
            T_postfixe(formule); // Convert to postfix
            try {
                const result = evaluatePostfix([...r]); // Evaluate postfix
                screen.textContent = result; // Display result
                formule = [result.toString()]; // Reset formula
                r = []; // Clear postfix result
                opp = 1;
            } catch (error) {
                screen.textContent = "Error";
                console.error(error.message);
            }
        } else if (text === "D") { // Handle delete last element
            formule.pop();
            screen.textContent = formule.join("");
        } else if (opp === 0) { // Handle operators
            screen.textContent += text;
            formule.push(text);
            opp++;
        }

        screen.textContent = formule.join(""); // Update screen content
    });
});

function T_postfixe(form) {
    for (let i = 0; i < form.length; i++) {
        if (isOperand(form[i])) {
            r.push(form[i]);
        } else if (form[i] === "(") {
            p.push(form[i]);
        } else if (operand(form[i])) { // Handle operators
            while (
                p.length !== 0 &&
                operand(p[p.length - 1]) &&
                priorite(form[i]) <= priorite(p[p.length - 1])
            ) {
                let x = p.pop();
                r.push(x);
            }
            p.push(form[i]);
        } else if (form[i] === ")") {
            while (p.length !== 0 && p[p.length - 1] !== "(") {
                let x = p.pop();
                r.push(x);
            }
            p.pop(); // Remove "(" from the stack
        }
    }
    while (p.length !== 0) {
        let x = p.pop();
        r.push(x);
    }
}

function operand(arg) {
    return ["*", "+", "-", "/"].includes(arg);
}

function isOperand(char) {
    return !isNaN(parseFloat(char)) && isFinite(char);
}

function priorite(arg1) {
    if (arg1 === "*" || arg1 === "/") {
        return 2;
    }
    return 1;
}

function evaluatePostfix(P) {
    const R = []; // Initialize result stack R

    while (P.length > 0) { // While P is not empty
        const x = P.shift(); // Take an element from P

        if (isOperand(x)) { // Check if x is an operand
            R.push(x); // Push operand onto R
        } else { // x is an operator
            const x1 = R.pop(); // Pop the first operand from R
            const x2 = R.pop(); // Pop the second operand from R

            const result = performOperation(x2, x1, x); // Perform the operation
            R.push(result); // Push the result back onto R
        }
    }

    return R.pop(); // The final result is the last item in R
}

// Helper function to perform an operation
function performOperation(operand1, operand2, operator) {
    operand1 = parseFloat(operand1);
    operand2 = parseFloat(operand2);

    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                throw new Error("Division by zero is not allowed.");
            }
            return operand1 / operand2;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}
