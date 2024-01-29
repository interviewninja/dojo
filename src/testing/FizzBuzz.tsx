export function fizzBuzzTestFn(param: any[]) {
    const testSpecs = []

    if(!(Array.isArray(param) && param.length > 0) || param.length < 16) return Array(3).fill(false)
    testSpecs.push(true)

    for(let i=1; i < param.length; i++){
        if(i % 3 === 0 && i % 5 === 0){
            continue
        }
        else if(i % 3 === 0){
            if(param[i-1] !== "Fizz"){
                testSpecs.push(false, false)
                return testSpecs
            }
        } else if(i % 5 === 0){
            if(param[i-1] !== "Buzz"){
                testSpecs.push(false, false)
                return testSpecs
            }
        }
    }
    testSpecs.push(true)

    for(let i=1; i < param.length; i++){
        if(i % 3 === 0 && i % 5 === 0){
            if(param[i-1] !== "FizzBuzz"){
                testSpecs.push(false)
                return testSpecs
            }
        }
    }
    testSpecs.push(true)
  
    return testSpecs
}