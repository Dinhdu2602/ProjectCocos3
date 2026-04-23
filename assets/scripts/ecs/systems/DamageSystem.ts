import { _decorator, Component } from 'cc';
import { ECSWorld } from '../core/ECSWorld';
import { EnemyComponent } from '../components/EnemyComponent';
import { eventEmitter} from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('DamageSystem')
export class DamageSystem extends Component {

    update() {
        ECSWorld.instance.enemies.forEach(e => {
            const enemy = e.getComponent(EnemyComponent);
            if (!enemy) return;

            if (enemy.hp <= 0) {
                eventEmitter.emit(EVENT.ENEMY_DIE, { score: 10 });
                e.destroy();
            }
        });
    }
}
