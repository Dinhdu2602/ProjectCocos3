import { EnemyType } from "../../types/EnemyType";

export type EnemyConfigType = {
    hp: number;
    speed: number;
    damage: number;
    attackRange?: number; 
    score: number;
};

export const EnemyConfig: Record<EnemyType, EnemyConfigType> = {
    [EnemyType.CHASER]: {
        hp: 50, 
        speed: 40,
        damage: 5,
        score: 10,
    },

    [EnemyType.RANGER]: {
        hp: 80,
        speed: 30,
        damage: 3,
        attackRange: 250,
        score: 20,
    },

    [EnemyType.KAMIKAZE]: {
        hp: 200,
        speed: 70,
        damage: 10,
        score: 30,
    }
};