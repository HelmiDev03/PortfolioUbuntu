import React, { useState, useEffect } from 'react';

export default function CarGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const gameUrl = 'https://media.boyslife.org/onlinegames/nitroderby/';
  
  // Function to handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Function to handle iframe error event
  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };
  
  // Check if the game URL is accessible
  useEffect(() => {
    const checkGameUrl = async () => {
      try {
        const response = await fetch(gameUrl, { method: 'HEAD', mode: 'no-cors' });
        // Since we're using no-cors, we can't actually check the status
        // But if it doesn't throw an error, we'll assume it's working
      } catch (error) {
        console.error('Error checking game URL:', error);
        setHasError(true);
      } finally {
        // If loading takes too long, stop showing the loading indicator after 5 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      }
    };
    
    checkGameUrl();
  }, []);

  // Fallback content in case the game fails to load
  const renderFallbackContent = () => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2>Unable to load Pedro's Nitro Derby</h2>
      <p>The game may be temporarily unavailable or blocked by your browser's security settings.</p>
      <p>Try refreshing the page or check your connection.</p>
      <button 
        onClick={() => {
          setIsLoading(true);
          setHasError(false);
          setTimeout(() => window.location.reload(), 500);
        }}
        style={{
          padding: '10px 20px',
          margin: '20px',
          backgroundColor: '#E95420',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  // Loading indicator
  const renderLoadingIndicator = () => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      flexDirection: 'column'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        border: '5px solid rgba(255, 255, 255, 0.3)', 
        borderRadius: '50%',
        borderTop: '5px solid #E95420',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '20px' }}>Loading game...</p>
      <p style={{ 
        marginTop: '10px', 
        fontSize: '14px', 
        color: '#E95420', 
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        Use desktop for better experience
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading && renderLoadingIndicator()}
        
        {hasError ? renderFallbackContent() : (
          <iframe 
            src={gameUrl}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              display: isLoading ? 'none' : 'block' 
            }}
            title="Pedro's Nitro Derby"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-forms"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
    </div>
  );
}

export function displayCarGame() {
  return <CarGame />;
}
