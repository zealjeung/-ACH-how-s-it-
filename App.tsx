import React, { useState, useCallback, useMemo } from 'react';
import { fetchNewsSummary } from './services/geminiService';
import { fetchMarketChartData, fetchCoinDetails } from './services/coingeckoService';
import { NewsSummary, MarketChartData, CoinDetails } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import SourceCard from './components/SourceCard';
import ErrorMessage from './components/ErrorMessage';
import PriceChart from './components/PriceChart';
import KeyMetrics from './components/KeyMetrics';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsSummary | null>(null);
  const [chartData, setChartData] = useState<MarketChartData | null>(null);
  const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState<number>(7);
  const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false);

  const timeframes = useMemo(() => [
    { label: '1D', days: 1 },
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
  ], []);

  const handleFetchChartData = useCallback(async (days: number) => {
    setIsChartLoading(true);
    setChartError(null);
    setTimeframe(days);
    try {
      const result = await fetchMarketChartData(days);
      setChartData(result);
    } catch (err) {
      setChartError(err instanceof Error ? err.message : 'An unknown error occurred while fetching chart data.');
      setChartData(null);
    } finally {
      setIsChartLoading(false);
    }
  }, []);

  const handleFetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNews(null);
    setChartData(null);
    setCoinDetails(null);
    
    setInitialFetchDone(true);

    try {
      const [newsResult, chartResult, detailsResult] = await Promise.all([
        fetchNewsSummary(),
        fetchMarketChartData(timeframe),
        fetchCoinDetails(),
      ]);
      setNews(newsResult);
      setChartData(chartResult);
      setCoinDetails(detailsResult);
    } catch (err) {
      console.error("Error during initial data fetch:", err);
      setError("Failed to fetch the latest data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-cyan-500/10 p-4 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Crypto Daily Brief
          </h1>
          <p className="mt-2 text-lg text-gray-400">Your AI-powered daily summary for <span className="font-bold text-cyan-400">$ACH</span> (Alchemy Pay)</p>
        </header>

        <main>
          <div className="flex justify-center mb-8">
            <button
              onClick={handleFetchInitialData}
              disabled={isLoading}
              className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              {isLoading ? 'Loading...' : 'Get Latest Brief'}
            </button>
          </div>

          <div className="space-y-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            
            {!isLoading && !error && news && (
              <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <section id="summary">
                  <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-b-2 border-cyan-500/30 pb-2">AI Summary</h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{news.summary}</p>
                </section>

                {news.sources && news.sources.length > 0 && (
                  <section id="sources" className="mt-8">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-b-2 border-cyan-500/30 pb-2">Sources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {news.sources.map((source, index) => (
                        <SourceCard key={`${source.web.uri}-${index}`} source={source} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {initialFetchDone && !isLoading && !error && (
              <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <section id="market-trends">
                   <div className="flex justify-between items-center mb-4 border-b-2 border-cyan-500/30 pb-2">
                     <h2 className="text-2xl font-bold text-cyan-300">Market Trends</h2>
                     <div className="flex space-x-2 bg-gray-700/50 p-1 rounded-md">
                        {timeframes.map(({label, days}) => (
                            <button key={days} onClick={() => handleFetchChartData(days)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeframe === days ? 'bg-cyan-500 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}>
                                {label}
                            </button>
                        ))}
                     </div>
                   </div>
                  {isChartLoading && <LoadingSpinner />}
                  {chartError && <ErrorMessage message={chartError} />}
                  {chartData && !isChartLoading && <PriceChart data={chartData} timeframe={timeframe}/>}
                </section>
              </div>
            )}

            {!isLoading && !error && coinDetails && (
               <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <section id="key-metrics">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-b-2 border-cyan-500/30 pb-2">Key Metrics & Activity</h2>
                    <KeyMetrics details={coinDetails} />
                </section>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Gemini and Google Search. Market data by CoinGecko.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;