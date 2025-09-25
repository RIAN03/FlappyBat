// Fix: Added React import to solve "Cannot find namespace 'React'" error.
import React from 'react';

export enum GameState {
  Splash,
  Start,
  Playing,
  GameOver,
}

export interface PlayerState {
  y: number;
  vy: number;
}

export interface BuildingSegment {
  width: number;
  height: number;
}

export interface Pipe {
  x: number;
  width: number;
  topBuildings: BuildingSegment[];
  bottomBuildings: BuildingSegment[];
  passed: boolean;
}

export interface Star {
  id: number;
  style: React.CSSProperties;
}

export type Action = 
  | { type: 'JUMP' }
  | { type: 'TICK' };