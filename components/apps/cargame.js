import React from 'react';

export default function CarGame() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe 
          src="http://media.boyslife.org/onlinegames/nitroderby/"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Pedro's Nitro Derby"
        />
      </div>
    </div>
  );
}

export function displayCarGame() {
  return <CarGame />;
}
