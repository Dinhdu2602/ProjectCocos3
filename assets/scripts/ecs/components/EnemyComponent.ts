import { _decorator, Component, ProgressBar, Label } from 'cc';
import { EnemyType } from '../../types/EnemyType';
import { EnemyConfig } from '../config/EnemyConfig';
import { ECSWorld } from '../core/ECSWorld';

const { ccclass, property } = _decorator;

@ccclass('EnemyComponent')
export class EnemyComponent extends Component {

    type: EnemyType = EnemyType.CHASER;

    @property(ProgressBar)
    hpBar: ProgressBar = null!;

    @property(Label)
    damageLabel: Label = null!;

    
    hp: number = 100;
    maxHp: number = 100;
    speed: number = 0;
    damage: number = 10;
    attackRange: number = 0;
    radius: number = 25;
    isDead: boolean = false;
    spawnDelay = 0.5;

    onLoad() {
        const config = EnemyConfig[this.type];

        this.hp = config.hp;
        this.speed = config.speed;
        this.damage = config.damage;

        if (config.attackRange) {
            this.attackRange = config.attackRange;
        }
    }

    update() {
        if (this.isDead) return;
}
}