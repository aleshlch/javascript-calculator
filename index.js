const power = "power("
const factorial = "factorialFormula("
const operators = ["+", "-", "*", "/"]

const math = {
    "cos": "Math.cos(",
    "sin": "Math.sin(",
    "tan": "Math.tan(",
    "log": "Math.log10(",
    "√": "Math.sqrt(",
}

const value = {
    "÷": "/" ,
    "×": "*" ,
    "e": "Math.E" ,
    "%": "/100" ,
}


const btns = Array.from( document.querySelectorAll(".btn") )
const input = document.querySelector('#screen')

let data = {
    operation: [],
    formula: []
}

btns.forEach( btn => {  
    btn.addEventListener('click', function(e) {
        const type = e.target.dataset.type
        const text = e.target.innerText
        
        if(text == 'DEL') {
            data.operation.pop()
            data.formula.pop()
        } else if(text == 'AC') {
            data.operation = []
            data.formula = []
        } else {
            let symbolOperation, symbolFormula

            if(type == 'unchanged') {
                symbolOperation = text
                symbolFormula = text
            } else if(type == 'math') {
                symbolOperation = text + '('
                symbolFormula = math[text]
            } else if(type == 'value') {
                symbolOperation = text
                symbolFormula = value[text]
            } else if(text == 'x!') {
                symbolOperation = '!'
                symbolFormula = factorial
            } else if(text == 'x²') {
                symbolOperation = '^('
                symbolFormula = power
            } else if(type == 'par') {
                let isPar = false

                const lastItem = data.operation[data.operation.length - 1]
 
                if(lastItem.toString().slice(-1) == '(') {
                    isPar = true
                }

                if(isPar) {
                    symbolOperation = '('
                    symbolFormula = '('
                } else {
                    symbolOperation = '×('
                    symbolFormula = '*('
                }
            } 

            data.operation.push(symbolOperation)
            data.formula.push(symbolFormula)
        }

        input.value = data.operation.join('')


        if(text == '=') {
            
            let resultString = data.formula.join('')

            const powerSearchedIndex = search(data.formula, power)
            const bases = numgetter(data.formula, powerSearchedIndex, power)
            bases.forEach(base => {    
                resultString = resultString.replace(base.toReplace, base.replacement)
            })

            const factorialSearchedIndex = search(data.formula, factorial)
            const numbers = numgetter(data.formula, factorialSearchedIndex, factorial)
            numbers.forEach(number => {
                resultString = resultString.replace(number.toReplace, number.replacement)
            })

            let result

            try {
                result = eval(resultString)
            } catch (error) {
                if (error instanceof SyntaxError) {
                    result = "SyntaxError"
                }
            }

            input.value = result

            data.operation = [result]
            data.formula = [result]
        }  
    })
})


function search(array, searchValue) {
    const result = []

    array.forEach((element, index) => {
        if (element == searchValue) {
            result.push(index)
        }
    })

    return result
}


function numgetter(formula, searchedIndex, type) {

    const numbers = []
    
    let factorialAmount = 0

    searchedIndex.forEach(factIndex => {
        const number = []

        const nextIndex = factIndex + 1

        if (formula[nextIndex] == factorial) {
            factorialAmount += 1
            return
        }

        let parentheses = 0

        let prevIndex = factIndex - factorialAmount - 1

        while (prevIndex >= 0) {

            if (formula[prevIndex] == '(') {
                parentheses -= 1
            }
            if (formula[prevIndex] == ')') {
                parentheses += 1
            }

            let isOperator = false

            operators.forEach(operator => {
                if (formula[prevIndex] == operator) {
                    isOperator = true
                }
            })

            let isMath = false

            const mathValues = Object.values(math)
            mathValues.forEach(value => {
                if (formula[prevIndex] == value) {
                    isMath = true
                }
            })

            let isPower = formula[prevIndex] == power


            if ((isOperator && parentheses == 0) || isPower || isMath) {
                break
            }


            number.unshift(formula[prevIndex])

            prevIndex--

        }

        const numberString = number.join('')

        let toreplace, replacement

        if(type == power) {
            toreplace = numberString + power
            replacement = "Math.pow(" + numberString + ","
        }

        if(type == factorial) {
            const close_paren = ')'
            const times = factorialAmount + 1

            toreplace = numberString + factorial.repeat(times)
            replacement = factorial.repeat(times) + numberString + close_paren.repeat(times)

            factorialAmount = 0
        }
 
        numbers.push({
            toReplace: toreplace,
            replacement: replacement
        })
    })

    return numbers
}


function factorialFormula(number) {

    if (number % 1 != 0) {
        return gamma(number + 1)
    }

    if (number == 0 || number == 1) {
        return 1
    }

    let result = 1

    for (let i = 1; i <= number; i++) {
        result *= i
    }

    if (result == Infinity) {
        return Infinity
    }
    
    return result
}


function gamma(n) { 
    const g = 7
    const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]
    if (n < 0.5) {
        return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n)
    } else {
        n--
        var x = p[0]
        for (var i = 1; i < g + 2; i++) {
            x += p[i] / (n + i)
        }
        var t = n + g + 0.5
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x
    }
}


