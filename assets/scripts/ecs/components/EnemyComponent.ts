import { _decorator, Component } from 'cc';
import { EnemyType } from '../../types/EnemyType';
import { EnemyConfig } from '../config/EnemyConfig';

const { ccclass } = _decorator;

@ccclass('EnemyComponent')
export class EnemyComponent extends Component {

    type: EnemyType = EnemyType.CHASER;

    hp: number = 10;
    speed: number = 0;
    damage: number = 0;
    attackRange: number = 0;

    onLoad() {
        const config = EnemyConfig[this.type];

        this.hp = config.hp;
        this.speed = config.speed;
        this.damage = config.damage;

        if (config.attackRange) {
            this.attackRange = config.attackRange;
        }
    }
}