export const langTypes = ["Dynamically-typed", "Statically-typed"] as const

export type LanguageType = (typeof langTypes)[number]

export interface Language<Type = string> {
  id: number
  name: string
  description: string
  type: Type
}

export const languages: Language<LanguageType>[] = [
  {
    id: 63,
    name: "Javascript",
    description:
      "JavaScript is a programming language used for creating dynamic and interactive elements on web pages, enabling behaviors like user interactions and content manipulation. It runs in web browsers, enhancing user experiences and facilitating real-time webpage modifications.",
    type: "Dynamically-typed",
    },
  {
    id: 71,
    name: "Python",
    description: "Python is a versatile, high-level programming language known for its simplicity, readability, and broad applications in web development, data analysis, and automation.",
    type: "Dynamically-typed"
  }
]
