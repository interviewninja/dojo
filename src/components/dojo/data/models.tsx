export const modTypes = ["...", ".."] as const

export type ModelType = (typeof modTypes)[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: "1",
    name: "...",
    description: "...",
    type: "..."
  },
  {
    id: "2",
    name: "...",
    description: "...",
    type: ".."
  },
]
