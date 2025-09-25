import React from 'react';
import { GOTHAM_BACKGROUND } from '../assets';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-8">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter brightness-50 z-0"
        style={{ backgroundImage: `url(${GOTHAM_BACKGROUND})` }}
      ></div>
      <div className="z-10 text-center flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase text-glow tracking-widest">Gotham</h1>
        <h1 className="text-6xl md:text-8xl font-black uppercase text-glow tracking-widest mb-8">Glide</h1>
        
        <button
          onClick={onStart}
          className="bg-yellow-400 text-black font-bold py-4 px-12 text-2xl uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black transform hover:scale-105 box-glow-yellow border-2 border-black mb-8"
        >
          Start Glide
        </button>
        <p className="text-xl">High Score: {highScore}</p>

        <div className="mt-12 text-center text-gray-300 max-w-lg">
          <h2 className="text-2xl font-bold mb-2 uppercase text-yellow-400">Controls</h2>
          <p className="text-lg"><span className="font-bold">TAP / CLICK:</span> Fly Up</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;