// Represents the structure of a Property in the system
export interface IProperty {
    title: string; // Title of the property
    description: string; // Detailed description of the property
    price: number; // Price of the property
    location: string; // Location or address of the property
    type: string; // Type of property (e.g., "house")
    buildYear: number; // Year the property was built
    size: number; // Size of the property in square feet/meters, stored as a number
    amenities: string[]; // List of amenities (e.g., ["pool", "garage"])
    lotSize: number;
    images: string[]; // Array of image URLs
    reviews: IReview[]; // Array of reviews related to the property
    mapLocation: { // Coordinates for the property
      lat: string; // Latitude
      lng: string; // Longitude
    };
    __v: number; // Version key (usually used by Mongoose in MongoDB)
  }
  
  // Represents a review for a property
  export interface IReview {
    name: string; // Name of the reviewer
    date: string; // Date of the review
    rating: number; // Rating given by the reviewer (e.g., 1-5 stars)
    comment: string; // Review comment
  }
  
  // Response type when fetching a single property
  export interface IPropertyResponse {
    success: boolean; // Success status of the response
    data: IProperty; // The fetched property data
    error: string | null; // Any error message if applicable
  }
  
  // Payload for creating or updating a property (e.g., from a form)
  export interface IPropertiesPayload {
    title: string; // Title of the property
    description: string; // Description of the property
    price: number; // Price of the property
    location: string; // Location of the property
    type: string; // Type of property (e.g., "house")
    buildYear: number; // Year the property was built
    size: number; // Size of the property in square feet/meters
    lotSize: number; // Size of the lot in square feet/meters
    amenities: string[]; // List of amenities (e.g., ["pool", "garage"])
    images: string[]; // Array of image URLs
    mapLocation: { // Coordinates of the property
      lat: number; // Latitude
      lng: number; // Longitude
    };
    reviews: IReview[]; // Array of reviews for the property
    category: string; // Category of the property (e.g., residential, commercial)
  }
