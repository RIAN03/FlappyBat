import React, { useEffect, useMemo } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

interface RainDrop {
    id: number;
    style: React.CSSProperties;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Display for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  const rainDrops = useMemo(() => {
    const drops: RainDrop[] = [];
    for (let i = 0; i < 100; i++) {
        drops.push({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 0.5 + 0.5}s`, // 0.5s to 1.0s
                animationDelay: `${Math.random() * 5}s`,
            }
        });
    }
    return drops;
  }, []);

  return (
    <div className="splash-screen-fade-out w-full h-full flex flex-col items-center justify-center bg-black text-white p-8 relative overflow-hidden">
        {/* Rain effect */}
        {rainDrops.map(drop => (
            <div key={drop.id} className="rain-drop" style={drop.style} />
        ))}

        <div className="z-10 text-center flex flex-col items-center batman-logo-container">
            <div className="batman-logo-wrapper" aria-label="Batman Logo">
              <div className="batman-logo-glow"></div>
              <div className="batman-logo"></div>
            </div>
        </div>
    </div>
  );
};

export default SplashScreen;
