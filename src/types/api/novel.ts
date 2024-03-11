import { Language, Country } from './common'
import { Author } from "./author"

export interface Novel {
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