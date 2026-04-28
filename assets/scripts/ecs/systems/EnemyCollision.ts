import { _decorator, Component, Collider2D, Contact2DType, Vec3 } from 'cc';
import { PlayerComponent } from '../components/PlayerComponent';
import { EnemyComponent } from '../components/EnemyComponent';

const { ccclass } = _decorator;

@ccclass('EnemyCollision')
export class EnemyCollision extends Component {

    private lastHitTime = 0;
    private HIT_DELAY = 500;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        const player = other.getComponent(PlayerComponent);
        const enemy = this.getComponent(EnemyComponent);

        if (!player || !enemy || enemy.isDead) return;

        const now = Date.now();
        if (now - this.lastHitTime < this.HIT_DELAY) return;

        console.log("⚡ ENEMY HIT PLAYER");

        // DAMAGE
        player.takeDamage(enemy.damage);

        // KNOCKBACK
        const dir = new Vec3();
        Vec3.subtract(dir, player.node.worldPosition, this.node.worldPosition);
        Vec3.normalize(dir, dir);

        player.applyKnockback(dir, 300);

        this.lastHitTime = now;
    }
}