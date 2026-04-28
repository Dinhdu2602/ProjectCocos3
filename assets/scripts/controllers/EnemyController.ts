import { _decorator, Component } from 'cc';
import { ECSWorld } from '../ecs/core/ECSWorld';
import { EnemyComponent } from '../ecs/components/EnemyComponent';

const { ccclass } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    onLoad() {
        console.log("Enemy added to ECS"); 
        ECSWorld.instance.enemies.push(this.node);
    }

    onDestroy() {
        ECSWorld.instance.enemies = ECSWorld.instance.enemies.filter(
            e => e !== this.node
        );
    }
}