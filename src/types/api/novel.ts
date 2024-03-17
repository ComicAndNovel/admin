import { Language, Country } from './common'
import { Author } from "./author"

export interface Novel {
  updateStatus: 1 | 2 | 3
  id: number
  cover: string | undefined
  name: string
  authors: Author[]
  volume: number
  page: number
  releaseTime: string
  country: Country
  language: Language
}