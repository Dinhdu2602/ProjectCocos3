import { _decorator, Component, ProgressBar, Label, Vec3 } from "cc";
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

    // =========================
    // knockback system
    // =========================
    private velocity: Vec3 = new Vec3();

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

        this.velocity.set(0, 0, 0);

        if (this.damageLabel) {
            this.damageLabel.string = this.damage.toString();
        }
    }

    update(dt: number) {
        if (this.isDead) return;

        // =========================
        // 🔥 APPLY KNOCKBACK MOVE
        // =========================
        if (this.velocity.length() > 0.01) {

            const pos = this.node.worldPosition;

            this.node.setWorldPosition(
                pos.x + this.velocity.x * dt,
                pos.y + this.velocity.y * dt,
                pos.z
            );

            // friction
            this.velocity.multiplyScalar(0.85);

            if (this.velocity.length() < 1) {
                this.velocity.set(0, 0, 0);
            }
        }

        // =========================
        // HP UI update
        // =========================
        if (this.hp !== this._lastHp) {
            this._lastHp = this.hp;

            if (this.hpBar) {
                this.hpBar.progress = this.hp / this.maxHp;
            }
        }
    }

    takeDamage(amount: number, hitDir?: Vec3) {
        if (this.isDead) return;

        this.hp -= amount;

        // =========================
        // 💥 KNOCKBACK ON HIT
        // =========================
        if (hitDir) {
            const MAX_FORCE = 180;

            this.velocity.x = hitDir.x * MAX_FORCE;
            this.velocity.y = hitDir.y * MAX_FORCE;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;

            this.node.destroy();
        }
    }
}