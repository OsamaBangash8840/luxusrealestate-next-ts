export interface IReview {
  _id: string
  propertyId: string
  userId: string
  name: string
  rating: number
  message: string
  createdAt: string
  updatedAt: string
}

export interface IReviewsResponse {
  reviews: IReview[]
}

export interface IAddReviewPayload {
  propertyId: string
  rating: number
  message: string
}
