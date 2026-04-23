import { _decorator, Component } from 'cc';
import { ECSWorld } from '../core/ECSWorld';
import { BulletComponent } from '../components/BulletComponent';
import { EnemyComponent } from '../components/EnemyComponent';

const { ccclass } = _decorator;

@ccclass('CollisionSystem')
export class CollisionSystem extends Component {

    update() {
        const { bullets, enemies } = ECSWorld.instance;

        bullets.forEach(b => {
            const bullet = b.getComponent(BulletComponent);
            if (!bullet) return;

            enemies.forEach(e => {
                const enemy = e.getComponent(EnemyComponent);
                if (!enemy) return;

                if (this.hit(b, e)) {
                    enemy.hp -= bullet.damage;

                    b.destroy();
                }
            });
        });
    }

    hit(a:any,b:any){
        return a.worldPosition.subtract(b.worldPosition).length()<50;
    }
}
