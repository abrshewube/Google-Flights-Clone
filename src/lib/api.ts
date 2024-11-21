import axios from 'axios';

const API_KEY = 'f22019aeb8msh7ed04bc897a3c9ep17b34fjsncc78e997a31f';
const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

export interface FlightPrice {
  day: string;
  group: 'low' | 'medium' | 'high';
  price: number;
}

export interface FlightPricesResponse {
  status: boolean;
  data: {
    flights: {
      noPriceLabel: string;
      groups: Array<{
        id: string;
        label: string;
      }>;
      days: FlightPrice[];
    };
  };
}

export const getFlightPrices = async (
  originSkyId: string,
  destinationSkyId: string,
  fromDate: string,
  currency = 'USD'
) => {
  const response = await api.get<FlightPricesResponse>('/getPriceCalendar', {
    params: {
      originSkyId,
      destinationSkyId,
      fromDate,
      currency,
    },
  });

  console.log(response)
  
  return response.data;
};