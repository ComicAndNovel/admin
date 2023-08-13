export interface Country {
  countryId: number
  countryName: string
}

export interface Another {
  id: number
  name: string
  originalName: string
  country: Country
}

