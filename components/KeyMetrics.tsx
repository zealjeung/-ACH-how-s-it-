import React from 'react';
import { CoinDetails } from '../types';

interface KeyMetricsProps {
  details: CoinDetails;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(value);
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    }).format(value);
}

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subValue?: string, link?: string }> = ({ icon, label, value, subValue, link }) => {
    const content = (
         <div className="flex flex-col items-start p-4 bg-gray-800 rounded-lg h-full shadow-lg border border-gray-700 hover:bg-gray-700/50 transition-colors duration-300">
            <div className="flex items-center justify-between w-full">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <div className="text-cyan-400">{icon}</div>
            </div>
            <p className="text-2xl font-semibold text-gray-100 mt-2">{value}</p>
            {subValue && <p className="text-sm text-gray-400">{subValue}</p>}
        </div>
    );

    if (link) {
        return <a href={link} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
    }

    return content;
};


const KeyMetrics: React.FC<KeyMetricsProps> = ({ details }) => {
  const { market_data, links } = details;
  const explorerLink = links.blockchain_site.find(link => link.includes('etherscan.io')) || links.blockchain_site[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <MetricCard 
        label="Market Cap" 
        value={formatCurrency(market_data.market_cap.usd)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
      />
      <MetricCard 
        label="24h Volume" 
        value={formatCurrency(market_data.total_volume.usd)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
      />
      <MetricCard 
        label="24h High / Low" 
        value={formatPrice(market_data.high_24h.usd)}
        subValue={formatPrice(market_data.low_24h.usd)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>}
      />
      <MetricCard 
        label="Circulating Supply" 
        value={`${formatNumber(market_data.circulating_supply)}`}
        subValue="$ACH"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5.5m0 0v8m0-8c-1.11 0-2.08.402-2.599 1M5.5 8V7m0 1v.01" /></svg>}
      />
      <MetricCard 
        label="Total Supply" 
        value={`${formatNumber(market_data.total_supply)}`}
        subValue="$ACH"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
      />
       <MetricCard 
        label="Block Explorer" 
        value="View On-Chain"
        subValue="Etherscan"
        link={explorerLink}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
      />
    </div>
  );
};

export default KeyMetrics;
