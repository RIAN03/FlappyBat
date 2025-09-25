import React, { useState, useEffect } from 'react';

interface Window {
  id: number;
  style: React.CSSProperties;
}

interface BuildingProps {
  width: number;
  height: number;
  orientation: 'top' | 'bottom';
  style?: React.CSSProperties;
}

const Building: React.FC<BuildingProps> = ({ width, height, orientation, style }) => {
  const [windows, setWindows] = useState<Window[]>([]);

  useEffect(() => {
    const generatedWindows: Window[] = [];
    const windowCount = Math.floor((width * height) / 3000); // Adjust density of windows

    for (let i = 0; i < windowCount; i++) {
      generatedWindows.push({
        id: i,
        style: {
          position: 'absolute',
          left: `${Math.random() * 85 + 5}%`, // 5% to 90%
          top: `${Math.random() * 90 + 5}%`, // 5% to 95%
          width: `${Math.random() * 6 + 4}%`, // 4% to 10%
          height: `${Math.random() * 4 + 3}%`, // 3% to 7%
          backgroundColor: '#fde047', // warm yellow
          opacity: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
          boxShadow: '0 0 5px #fde047',
        }
      });
    }
    setWindows(generatedWindows);
  }, [width, height]);

  const buildingStyle: React.CSSProperties = {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#1C1C1E',
    border: '4px solid #080808',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)',
    overflow: 'hidden',
    transform: orientation === 'bottom' ? 'scaleY(-1)' : 'none',
    ...style,
  };

  return (
    <div style={buildingStyle}>
      {windows.map(win => <div key={win.id} style={win.style} />)}
    </div>
  );
};

export default Building;