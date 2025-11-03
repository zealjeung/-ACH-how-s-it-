import { MarketChartData, CoinDetails } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3';
const COIN_ID = 'alchemy-pay';

export const fetchMarketChartData = async (days: number = 7): Promise<MarketChartData> => {
  try {
    const response = await fetch(`${API_URL}/coins/${COIN_ID}/market_chart?vs_currency=usd&days=${days}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch chart data with status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error("Invalid chart data format received from API");
    }

    return data.prices;
  } catch (error) {
    console.error("Error fetching market chart data:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch market chart data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching market chart data.");
  }
};

export const fetchCoinDetails = async (): Promise<CoinDetails> => {
    try {
        const response = await fetch(`${API_URL}/coins/${COIN_ID}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch coin details with status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching coin details:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch coin details: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching coin details.");
    }
}