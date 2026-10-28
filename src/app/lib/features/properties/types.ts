// Represents the structure of a Property in the system
export interface IProperty {
  _id: string // Unique identifier for the property
  title: string
  description: string
  price: number
  location: { type: 'Point'; coordinates: [number, number] } // GeoJSON structure [lng, lat]
  type: string
  buildYear: number
  size: string
  lotSize: string
  amenities: string[]
  images: string[]
  reviews: any[]
  category: string
  address?: string
  status: 'approved' | 'pending' | 'rejected'
  rejectionReason?: string
  views?: number
  seller?: any
  createdAt?: string
  updatedAt?: string
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
  seller?: {
    phone: string
    email: string
  }
  status?: string
  title: string
  description: string
  price: number
  location: { type: 'Point'; coordinates: [number, number] } // [longitude, latitude]
  address?: string
  type: string
  buildYear: number
  size: string
  lotSize: string
  amenities: string[]
  images: string[]
  reviews?: any[]
  category: string
  rejectionReason?: string
}
