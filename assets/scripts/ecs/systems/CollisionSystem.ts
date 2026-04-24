import { _decorator, Component, Vec3} from 'cc';
import { ECSWorld } from '../core/ECSWorld';
import { BulletComponent } from '../components/BulletComponent';
import { EnemyComponent } from '../components/EnemyComponent';
import { PlayerComponent } from '../components/PlayerComponent';

const { ccclass } = _decorator;

@ccclass('CollisionSystem')
export class CollisionSystem extends Component {

    update() {
        const { bullets, enemies, player } = ECSWorld.instance;

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

        if (!player || !player.isValid) return;

        const playerComponent = player.getComponent(PlayerComponent);
        if (!playerComponent) return;

        enemies.forEach(e => {
            if (!e || !e.isValid) return;

            if (this.hit(e, player)) {
                console.log("HIT PLAYER");
                playerComponent.takeDamage(50);
                console.log("CALL TAKE DAMAGE");

                //e.destroy();
            }
        });
    }

  hit(a:any, b:any){
    return Vec3.distance(a.worldPosition, b.worldPosition) < 50;
} 
}
