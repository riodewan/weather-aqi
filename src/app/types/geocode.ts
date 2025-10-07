export type GeocodeSuggestion = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
  country_code?: string;
  admin1?: string;
};