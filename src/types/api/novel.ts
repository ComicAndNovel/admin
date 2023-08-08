import { Another } from "./another"

export interface Novel {
  id: number
  cover: string | undefined
  name: string
  another: Another[]
  volume: number
  page: number
  releaseTime: string
}