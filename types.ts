export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface NewsSummary {
    summary: string;
    sources: GroundingChunk[];
}

export type MarketChartData = [number, number][];

export interface CoinDetails {
  market_data: {
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number;
  };
  links: {
    blockchain_site: string[];
  };
}
