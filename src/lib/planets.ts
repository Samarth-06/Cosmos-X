import sunTex from "@/assets/planets/sun.jpg";
import mercuryTex from "@/assets/planets/mercury.jpg";
import venusTex from "@/assets/planets/venus.jpg";
import earthTex from "@/assets/planets/earth.jpg";
import marsTex from "@/assets/planets/mars.jpg";
import jupiterTex from "@/assets/planets/jupiter.jpg";
import saturnTex from "@/assets/planets/saturn.jpg";
import uranusTex from "@/assets/planets/uranus.jpg";
import neptuneTex from "@/assets/planets/neptune.jpg";

export type Planet = {
  id: string;
  name: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string;
  completion: number;
  texture: string;
  radius: number;
  orbit: number;
  speed: number;
  tilt: number;
  rings?: { inner: number; outer: number; color: string };
  emissive?: string;
};

export const SUN = {
  texture: sunTex,
  radius: 4.6,
};

export const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "Mercury",
    topic: "Genesis of Blockchain",
    difficulty: "Beginner",
    time: "45 min",
    completion: 0,
    texture: mercuryTex,
    radius: 0.55,
    orbit: 8,
    speed: 0.42,
    tilt: 0.03,
  },
  {
    id: "venus",
    name: "Venus",
    topic: "Cryptography & Keys",
    difficulty: "Beginner",
    time: "1h 10m",
    completion: 0,
    texture: venusTex,
    radius: 0.9,
    orbit: 11.2,
    speed: 0.32,
    tilt: 0.05,
  },
  {
    id: "earth",
    name: "Earth",
    topic: "Consensus & Networks",
    difficulty: "Intermediate",
    time: "1h 30m",
    completion: 0,
    texture: earthTex,
    radius: 0.95,
    orbit: 14.6,
    speed: 0.26,
    tilt: 0.41,
  },
  {
    id: "mars",
    name: "Mars",
    topic: "Wallets & Transactions",
    difficulty: "Intermediate",
    time: "1h 20m",
    completion: 0,
    texture: marsTex,
    radius: 0.72,
    orbit: 18.4,
    speed: 0.21,
    tilt: 0.44,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    topic: "Smart Contracts",
    difficulty: "Advanced",
    time: "2h 10m",
    completion: 0,
    texture: jupiterTex,
    radius: 2.4,
    orbit: 25.5,
    speed: 0.13,
    tilt: 0.05,
  },
  {
    id: "saturn",
    name: "Saturn",
    topic: "Tokens & Assets",
    difficulty: "Advanced",
    time: "1h 50m",
    completion: 0,
    texture: saturnTex,
    radius: 2.05,
    orbit: 32.2,
    speed: 0.098,
    tilt: 0.47,
    rings: { inner: 2.6, outer: 4.2, color: "#c9b489" },
  },
  {
    id: "uranus",
    name: "Uranus",
    topic: "NFTs & Ownership",
    difficulty: "Advanced",
    time: "1h 40m",
    completion: 0,
    texture: uranusTex,
    radius: 1.4,
    orbit: 38.5,
    speed: 0.07,
    tilt: 1.71,
  },
  {
    id: "neptune",
    name: "Neptune",
    topic: "Stellar Mainnet",
    difficulty: "Advanced",
    time: "2h 30m",
    completion: 0,
    texture: neptuneTex,
    radius: 1.36,
    orbit: 45,
    speed: 0.055,
    tilt: 0.49,
  },
];
