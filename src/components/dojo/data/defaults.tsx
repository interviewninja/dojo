export interface Default {
    id: number
    language: string
    path: string
    code: string
}

export const defaults: Default[] = [
    {
    id: 63,
    language: "javascript",
    path: `/dojo/script.js`,
    code:`/**
  * Problem: Fizzbuzz (Javascript)
  */
  
  // Time: O(n) 
  function fizzBuzz(n) {
    const array = [];
    // Write code here
  
    // Return the array.
    return array;
  }
  
  const array = fizzBuzz(16);
  console.log(array);
  
  // Expected Result: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz', '16']
  `},
  {
  id: 71,
  language: "python",
  path: `/dojo/script.py`,
  code:`"""
 Problem: Fizzbuzz (Python)
"""

# Time: O(n) 
def fizz_buzz(n):
  array = []
  # Write code here

  # Return the array.
  return array

array = fizz_buzz(16)
print(array)
  

# Expected Result: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz', '16']
`}
]