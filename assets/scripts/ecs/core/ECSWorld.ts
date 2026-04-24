import { Node } from 'cc';

export class ECSWorld {
    private static _instance: ECSWorld;

    static get instance() {
        if (!this._instance) this._instance = new ECSWorld();
        return this._instance;
    }

    enemies: Node[] = [];
    bullets: Node[] = [];
    player: Node | null = null;
}