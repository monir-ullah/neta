// Define the shape of the API response
export interface LocationData {
  status: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  query: string; // The user's IP address
}