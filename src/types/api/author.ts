export interface Country {
  countryId: number
  countryName: string
}

export interface Author {
  id: number
  name: string
  originalName: string
  country: Country
}

