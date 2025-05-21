// Represents the structure of a Property in the system
export interface IProperty {
  _id: string // Unique identifier for the property
  title: ''
  description: ''
  price: 0
  location: { type: 'Point'; coordinates: [number, number] } // Default structure
  type: ''
  buildYear: 0
  size: ''
  lotSize: ''
  amenities: string[]
  images: string[]
  reviews: []
  category: ''
  status: 'approved' | 'pending' | 'rejected'
}

// Represents a review for a property
export interface IReview {
  name: string // Name of the reviewer
  date: string // Date of the review
  rating: number // Rating given by the reviewer (e.g., 1-5 stars)
  comment: string // Review comment
}

// Response type when fetching a single property
export interface IPropertyResponse {
  success: boolean // Success status of the response
  data: IProperty // The fetched property data
  error: string | null // Any error message if applicable
}

// Payload for creating or updating a property (e.g., from a form)
export interface IPropertiesPayload {
  seller: {
    phone: any
    email: any
  }
  status: string
  title: ''
  description: ''
  price: 0
  location: { type: 'Point'; coordinates: [number, number] } // Default structure
  type: ''
  buildYear: 0
  size: ''
  lotSize: ''
  amenities: string[]
  images: string[]
  reviews: []
  category: ''
  rejectionReason: string
}
