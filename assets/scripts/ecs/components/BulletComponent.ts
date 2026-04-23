import { _decorator, Component, Vec3 } from 'cc';
import { BulletType } from '../../types/BulletType';
import { BulletConfig } from '../config/BulletConfig';

const { ccclass } = _decorator;

@ccclass('BulletComponent')
export class BulletComponent extends Component {

    type: BulletType = BulletType.NORMAL;

    damage: number = 0;
    speed: number = 0;
    direction: Vec3 = new Vec3();

    pierceCount: number = 0;
    explosionRadius: number = 0;

    onLoad() {
        const config = BulletConfig[this.type];

        this.damage = config.damage;
        this.speed = config.speed;

        if (config.pierceCount) {
            this.pierceCount = config.pierceCount;
        }

        if (config.explosionRadius) {
            this.explosionRadius = config.explosionRadius;
        }
    }
}