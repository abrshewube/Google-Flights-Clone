// Common airport codes and names for validation and suggestions
export const AIRPORTS = {
  'JFK': 'New York John F. Kennedy',
  'LAX': 'Los Angeles International',
  'ORD': 'Chicago O\'Hare',
  'LHR': 'London Heathrow',
  'CDG': 'Paris Charles de Gaulle',
  'DXB': 'Dubai International',
  'BOM': 'Mumbai Chhatrapati Shivaji',
  'DEL': 'Delhi Indira Gandhi',
  'SIN': 'Singapore Changi',
  'HKG': 'Hong Kong International',
  'SYD': 'Sydney Kingsford Smith',
  'NRT': 'Tokyo Narita',
  'FRA': 'Frankfurt International',
  'AMS': 'Amsterdam Schiphol',
  'MAD': 'Madrid Barajas',
} as const;

export type AirportCode = keyof typeof AIRPORTS;

export const isValidAirportCode = (code: string): code is AirportCode => {
  return code.length === 3 && code.toUpperCase() in AIRPORTS;
};