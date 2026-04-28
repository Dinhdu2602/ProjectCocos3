import { _decorator, Component, ProgressBar, Label } from "cc";
import { EnemyType } from "../../types/EnemyType";
import { EnemyConfig } from "../config/EnemyConfig";

const { ccclass, property } = _decorator;

@ccclass("EnemyComponent")
export class EnemyComponent extends Component {

    type: EnemyType = EnemyType.CHASER;

    @property(ProgressBar)
    hpBar: ProgressBar = null!;

    @property(Label)
    damageLabel: Label = null!;

    hp: number = 0;
    maxHp: number = 0;
    speed: number = 0;
    damage: number = 0;
    attackRange: number = 0;
    score: number = 0;

    radius: number = 25;
    isDead: boolean = false;
    spawnDelay = 0.5;

    private _lastHp = -1;

    init(type: EnemyType) {
        this.type = type;

        const config = EnemyConfig[type];

        this.hp = config.hp;
        this.maxHp = config.hp;
        this.speed = config.speed;
        this.damage = config.damage;
        this.attackRange = config.attackRange ?? 0;
        this.score = config.score;

        this.isDead = false;
        this._lastHp = -1;

        // init UI
        if (this.damageLabel) {
            this.damageLabel.string = this.damage.toString();
        }
    }

    takeDamage(amount: number) {
        if (this.isDead) return;

        this.hp -= amount;

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            this.node.destroy();
        }
    }

    update() {
        if (this.isDead) return;

        // chỉ update khi HP thay đổi
        if (this.hp !== this._lastHp) {
            this._lastHp = this.hp;

            if (this.hpBar) {
                this.hpBar.progress = this.hp / this.maxHp;
            }
        }
    }
}