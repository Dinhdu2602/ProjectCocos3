import { _decorator, Component } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from '../../constants/EventKey';
import { GameState } from "../../core/GameState";
import GameManager  from "../../core/GameManager";

const { ccclass } = _decorator;

@ccclass("DamageSystem")
export class DamageSystem extends Component {
  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;
    ECSWorld.instance.enemies.forEach((node) => {
      if (!node || !node.isValid) return;

      const enemy = node.getComponent(EnemyComponent);
           if (!enemy) return;

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
