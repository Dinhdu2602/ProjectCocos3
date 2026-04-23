import { EnemyType } from "../../types/EnemyType";

export type EnemyConfigType = {
    hp: number;
    speed: number;
    damage: number;
    attackRange?: number; // optional
};

export const EnemyConfig: Record<EnemyType, EnemyConfigType> = {
    [EnemyType.CHASER]: {
        hp: 10,
        speed: 120,
        damage: 5,
    },

    [EnemyType.RANGER]: {
        hp: 8,
        speed: 80,
        damage: 3,
        attackRange: 250,
    },

    [EnemyType.KAMIKAZE]: {
        hp: 5,
        speed: 200,
        damage: 10,
    }
};