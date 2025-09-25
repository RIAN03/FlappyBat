import React, { useRef, useEffect, useReducer, useCallback, useState } from 'react';
import { PlayerState, Pipe, Action, BuildingSegment, Star } from '../types';
import {
  GRAVITY, JUMP_FORCE, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_X_POSITION,
  PIPE_SPEED, PIPE_WIDTH, PIPE_GAP, PIPE_SPAWN_FRAMES
} from '../constants';
import Building from './Building';

interface GameState {
  player: PlayerState;
  pipes: Pipe[];
  score: number;
  frameCount: number;
  isGameOver: boolean;
  isStarted: boolean;
}

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'JUMP': {
      return {
        ...state,
        isStarted: true, // Game starts on first jump
        player: { ...state.player, vy: JUMP_FORCE },
      };
    }
    case 'TICK': {
      // Don't run physics if the game hasn't started
      if (!state.isStarted) {
        return state;
      }

      const containerHeight = window.innerHeight;

      // Player physics
      const newVy = state.player.vy + GRAVITY;
      const newY = state.player.y + newVy;
      
      // Pipe movement and generation
      let newPipes = state.pipes
        .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter(pipe => pipe.x + pipe.width > 0);

      const newFrameCount = state.frameCount + 1;
      if (newFrameCount % PIPE_SPAWN_FRAMES === 0) {
        const totalWidth = PIPE_WIDTH;

        // Determine the vertical gap position first
        const minTopBoundary = 100;
        const maxTopBoundary = containerHeight - PIPE_GAP - 100;
        const topBoundary = Math.floor(Math.random() * (maxTopBoundary - minTopBoundary + 1)) + minTopBoundary;
        const bottomBoundary = topBoundary + PIPE_GAP;

        // Helper to generate segments for one side (top or bottom)
        const generateSegments = (maxWidth: number, maxHeight: number): BuildingSegment[] => {
            const segments: BuildingSegment[] = [];
            let accumulatedWidth = 0;
            while (accumulatedWidth < maxWidth) {
                // Determine width of this segment
                let segmentWidth = Math.floor(Math.random() * (maxWidth / 2)) + 25; // Random width
                segmentWidth = Math.min(segmentWidth, maxWidth - accumulatedWidth);
                
                if (maxWidth - (accumulatedWidth + segmentWidth) < 25) { // Avoid tiny slivers
                    segmentWidth = maxWidth - accumulatedWidth;
                }

                const segmentHeight = maxHeight * (Math.random() * 0.5 + 0.5); // 50% to 100% of max height for variety

                segments.push({ width: segmentWidth, height: segmentHeight });
                accumulatedWidth += segmentWidth;
            }
            return segments;
        }

        const topBuildings = generateSegments(totalWidth, topBoundary);
        const bottomBuildings = generateSegments(totalWidth, containerHeight - bottomBoundary);

        newPipes.push({
          x: window.innerWidth,
          width: totalWidth,
          topBuildings,
          bottomBuildings,
          passed: false,
        });
      }

      // Score update
      let newScore = state.score;
      newPipes = newPipes.map(pipe => {
          if (!pipe.passed && pipe.x + pipe.width < PLAYER_X_POSITION) {
              newScore++;
              return {...pipe, passed: true};
          }
          return pipe;
      });

      // Collision detection
      let isGameOver = state.isGameOver;
      // 1. Ground and ceiling collision
      if (newY + PLAYER_HEIGHT > containerHeight || newY < 0) {
        isGameOver = true;
      }
      // 2. Building collision
      if (!isGameOver) {
        const playerRect = { x: PLAYER_X_POSITION, y: newY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
        const collides = (rect1: any, rect2: any) => 
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;

        for (const pipe of newPipes) {
          let currentX = pipe.x;
          // Check top buildings
          for (const building of pipe.topBuildings) {
              const topBuildingRect = { x: currentX, y: 0, width: building.width, height: building.height };
              if (collides(playerRect, topBuildingRect)) {
                  isGameOver = true;
                  break;
              }
              currentX += building.width;
          }
          if (isGameOver) break;

          currentX = pipe.x;
          // Check bottom buildings
          for (const building of pipe.bottomBuildings) {
              const bottomBuildingRect = { x: currentX, y: containerHeight - building.height, width: building.width, height: building.height };
              if (collides(playerRect, bottomBuildingRect)) {
                  isGameOver = true;
                  break;
              }
              currentX += building.width;
          }
          if (isGameOver) break;
        }
      }

      if (isGameOver) {
        return { ...state, isGameOver: true };
      }

      return {
        ...state,
        player: { y: newY, vy: newVy },
        pipes: newPipes,
        score: newScore,
        frameCount: newFrameCount,
      };
    }
    default:
      return state;
  }
};

interface GameProps {
  onGameOver: (score: number) => void;
}

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  
  const initialState = useCallback((): GameState => {
    return {
      player: {
        y: window.innerHeight / 2 - PLAYER_HEIGHT / 2,
        vy: 0,
      },
      pipes: [],
      score: 0,
      frameCount: 0,
      isGameOver: false,
      isStarted: false,
    };
  }, []);

  useEffect(() => {
    const newStars: Star[] = [];
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        newStars.push({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDelay: `${Math.random() * 4}s`,
            }
        });
    }
    setStars(newStars);
  }, []);

  const [gameState, dispatch] = useReducer(gameReducer, undefined, initialState);

  const handleUserAction = useCallback(() => {
    if (!gameState.isGameOver) {
      dispatch({ type: 'JUMP' });
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;
    
    container.addEventListener('click', handleUserAction);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleUserAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('click', handleUserAction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUserAction]);

  useEffect(() => {
    if (gameState.isGameOver) {
      onGameOver(gameState.score);
      return;
    }

    const gameLoop = () => {
      dispatch({ type: 'TICK' });
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    let animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.isGameOver, onGameOver, gameState.score]);

  const { player, pipes, score, isStarted } = gameState;

  return (
    <div ref={gameContainerRef} className="w-full h-full relative overflow-hidden select-none cursor-pointer">
      
      {/* Deep Space Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-b from-[#2c0b0e] to-[#000000]">
        <div className="moon" />
        {stars.map(star => (
          <div key={star.id} className="star" style={star.style} />
        ))}
      </div>

      {/* "Tap to Fly" message */}
      {!isStarted && !gameState.isGameOver && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ top: 'calc(50% - 100px)' }}
        >
          <div className="text-center">
            <h2 className="text-5xl font-black text-white text-glow animate-pulse">
              TAP TO GLIDE
            </h2>
          </div>
        </div>
      )}

      {/* Player (Batman) */}
      <div
        className="absolute player-batman z-20"
        style={{
          left: PLAYER_X_POSITION,
          top: player.y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
        }}
        aria-label="Batman"
      />

      {/* Pipes (Buildings) */}
      {pipes.map((pipe, i) => {
        let currentX = 0;
        const topBuildings = pipe.topBuildings.map((building, j) => {
          const el = (
            <Building
              key={`top-${i}-${j}`}
              width={building.width}
              height={building.height}
              orientation="top"
              style={{ left: pipe.x + currentX, top: 0, zIndex: 10 }}
            />
          );
          currentX += building.width;
          return el;
        });
        
        currentX = 0;
        const bottomBuildings = pipe.bottomBuildings.map((building, j) => {
          const el = (
            <Building
              key={`bottom-${i}-${j}`}
              width={building.width}
              height={building.height}
              orientation="bottom"
              style={{ left: pipe.x + currentX, bottom: 0, zIndex: 10 }}
            />
          );
          currentX += building.width;
          return el;
        });

        return <React.Fragment key={i}>{topBuildings}{bottomBuildings}</React.Fragment>;
      })}

      {/* Score */}
      {isStarted && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-6xl font-black text-glow" style={{ zIndex: 100 }}>
          {score}
        </div>
      )}
    </div>
  );
};

export default Game;