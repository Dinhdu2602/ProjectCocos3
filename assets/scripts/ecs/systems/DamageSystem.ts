import { _decorator, Component } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass("DamageSystem")
export class DamageSystem extends Component {
  update(dt: number) {
    ECSWorld.instance.enemies.forEach((node) => {
      if (!node || !node.isValid) return;

      const enemy = node.getComponent(EnemyComponent);
           if (!enemy) return;

      enemy.hp -= dt * 5;

      if (enemy.hp <= 0) {
        console.log("Enemy Die");

        eventEmitter.emit(EVENT.ENEMY_DIE, { score: 10 });

        node.destroy();
      }
    });

    ECSWorld.instance.enemies = ECSWorld.instance.enemies.filter(
      (e) => e && e.isValid,
    );
  }
}
