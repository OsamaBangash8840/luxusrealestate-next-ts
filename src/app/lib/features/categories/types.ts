export interface ICategory {
  _id: string
  name: string
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface IAddCategoryPayload {
  name: string
  images?: string[]
}
