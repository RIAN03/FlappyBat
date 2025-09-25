
import React from 'react';
import { GOTHAM_BACKGROUND } from '../assets';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-8">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter brightness-50 z-0"
        style={{ backgroundImage: `url(${GOTHAM_BACKGROUND})` }}
      ></div>

      <div className="z-10 text-center flex flex-col items-center">
        <h2 className="text-8xl font-black uppercase text-red-500 text-glow">Game Over</h2>
        <p className="text-4xl mt-8">Your Score: {score}</p>
        <p className="text-2xl mt-2 text-yellow-400">High Score: {highScore}</p>
        <button
          onClick={onRestart}
          className="mt-12 bg-yellow-400 text-black font-bold py-4 px-12 text-2xl uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black transform hover:scale-105 box-glow-yellow border-2 border-black"
        >
          Run Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
