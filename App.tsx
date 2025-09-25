
import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import SplashScreen from './components/SplashScreen';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Splash);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('rooftopRushHighScore') || 0));

  const showStartScreen = useCallback(() => {
    setGameState(GameState.Start);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.Playing);
  }, []);

  const gameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('rooftopRushHighScore', String(finalScore));
    }
    setGameState(GameState.GameOver);
  }, [highScore]);

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden font-orbitron select-none">
      {gameState === GameState.Splash && <SplashScreen onFinish={showStartScreen} />}
      {gameState === GameState.Start && <StartScreen onStart={startGame} highScore={highScore} />}
      {gameState === GameState.Playing && <Game onGameOver={gameOver} />}
      {gameState === GameState.GameOver && <GameOverScreen score={score} highScore={highScore} onRestart={startGame} />}
    </div>
  );
};

export default App;