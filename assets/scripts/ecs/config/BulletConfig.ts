import { BulletType } from "../../types/BulletType";

export type BulletConfigType = {
    damage: number;
    speed: number;
    pierceCount?: number;
    explosionRadius?: number;
};

export const BulletConfig: Record<BulletType, BulletConfigType> = {
    [BulletType.NORMAL]: {
        speed: 300,
        damage: 5,
    },

    [BulletType.PIERCE]: {
        speed: 280,
        damage: 4,
        pierceCount: 3,
    },

    [BulletType.EXPLOSIVE]: {
        speed: 250,
        damage: 6,
        explosionRadius: 120
    }
};