import { _decorator, Component, Vec3 } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';
import { ECSWorld } from '../core/ECSWorld';

const { ccclass } = _decorator;

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {

    maxHP: number = 100;
    currentHP: number = 100;
    private isDead: boolean = false;

    private velocity: Vec3 = new Vec3();

    onEnable() {
        ECSWorld.instance.player = this.node;
        console.log("Player registered");

        eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
    }

    onDisable() {
        eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
    }

    update(dt: number) {
        if (this.isDead) return;

        // ===== APPLY KNOCKBACK =====
        if (this.velocity.length() > 0.01) {

            
            const pos = this.node.worldPosition;

            this.node.setWorldPosition(
                pos.x + this.velocity.x * dt,
                pos.y + this.velocity.y * dt,
                pos.z
            );

           
            const damping = Math.pow(0.85, dt * 60);
            this.velocity.multiplyScalar(damping);

           
            if (this.velocity.length() < 1) {
                this.velocity.set(0, 0, 0);
            }
        }
    }

    applyKnockback(dir: Vec3, force: number) {
        
        const MAX_FORCE = 300;
        const f = Math.min(force, MAX_FORCE);

        this.velocity.x = dir.x * f;
        this.velocity.y = dir.y * f;
    }

    takeDamage(amount: number) {
        if (this.isDead) return;

        this.currentHP -= amount;
        if (this.currentHP < 0) this.currentHP = 0;

        console.log("Player HP:", this.currentHP);

        eventEmitter.emit(EVENT.PLAYER_HIT, this.currentHP);

        if (this.currentHP <= 0) {
            this.isDead = true;

            console.log(">>> PLAYER DIE");

          
            this.velocity.set(0, 0, 0);

            eventEmitter.emit(EVENT.PLAYER_DIE);
        }
    }

    private onReset() {
        console.log("Player RESET");

        this.currentHP = this.maxHP;
        this.isDead = false;

        // reset movement
        this.velocity.set(0, 0, 0);

        ECSWorld.instance.player = this.node;

        eventEmitter.emit(EVENT.PLAYER_HIT, this.currentHP);
    }
}