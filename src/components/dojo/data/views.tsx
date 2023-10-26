export const viewTypes = ["Single", "Multi"] as const

export type ViewType = (typeof viewTypes)[number]

export interface View<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const views: View<ViewType>[] = [
  {
    id: "1",
    name: "Tutorial",
    description: "Ease into learning, designed for a low-pressure environment. No camera needed for this feature, just focus on enhancing your skills",
    type: "Single"
  },
  {
    id: "2",
    name: "Interview",
    description: "Get interview-ready with this more immersive practice. Make sure your camera is enabled for this feature to work.",
    type: "Single"
  },
]
