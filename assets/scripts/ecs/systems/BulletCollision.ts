import { _decorator, Component, Collider2D, Contact2DType } from 'cc';
import { EnemyComponent } from '../components/EnemyComponent';
import { BulletComponent } from '../components/BulletComponent';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('BulletCollision')
export class BulletCollision extends Component {

    onLoad() {
        const collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        const enemy = other.getComponent(EnemyComponent);
        if (!enemy || enemy.isDead) return;

        const bullet = this.getComponent(BulletComponent);

        console.log("💥 BULLET HIT ENEMY");

        // Gửi damage (giữ nguyên hệ ECS của bạn)
        eventEmitter.emit(EVENT.ENEMY_HIT, {
            enemy,
            damage: bullet.damage,
        });

        // Xoá bullet
        this.node.destroy();
    }
}