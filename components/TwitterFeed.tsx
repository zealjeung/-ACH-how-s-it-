import React, { useEffect } from 'react';

// Declare the global 'twttr' object provided by the Twitter widgets script
declare global {
  interface Window {
    twttr: any;
  }
}

const TwitterFeed: React.FC = () => {
  useEffect(() => {
    // The Twitter script may have already loaded and executed.
    // This command tells the script to re-scan the page and render any new widgets.
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="mt-4 min-h-[400px]">
      <a
        className="twitter-timeline"
        data-theme="dark"
        data-height="500"
        data-tweet-limit="5"
        data-chrome="noheader nofooter noborders transparent"
        href="https://twitter.com/search?q=%24ACH&src=typed_query&f=live"
      >
        Loading latest tweets for $ACH...
      </a>
    </div>
  );
};

export default TwitterFeed;
