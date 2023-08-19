export interface Country {
  id: number
  name: string
}

export interface Author {
  id: number
  name: string
  originalName: string
  country: Country
}

