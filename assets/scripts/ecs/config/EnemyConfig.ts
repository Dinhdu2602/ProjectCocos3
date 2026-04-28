import { EnemyType } from "../../types/EnemyType";

export type EnemyConfigType = {
    hp: number;
    speed: number;
    damage: number;
    attackRange?: number; // optional
};

export const EnemyConfig: Record<EnemyType, EnemyConfigType> = {
    [EnemyType.CHASER]: {
        hp: 50, 
        speed: 40,
        damage: 5,
    },

    [EnemyType.RANGER]: {
        hp: 35,
        speed: 30,
        damage: 3,
        attackRange: 250,
    },

    [EnemyType.KAMIKAZE]: {
        hp: 25,
        speed: 70,
        damage: 10,
    }
};