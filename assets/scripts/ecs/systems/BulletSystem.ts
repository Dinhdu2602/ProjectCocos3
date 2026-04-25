import { _decorator, Component, Vec3 } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { BulletComponent } from "../components/BulletComponent";
import GameManager from "../../core/GameManager";
import { GameState } from "../../core/GameState";

const { ccclass } = _decorator;

@ccclass("BulletSystem")
export class BulletSystem extends Component {
  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;

    ECSWorld.instance.bullets.forEach((node) => {
      const bullet = node.getComponent(BulletComponent);
      if (!bullet) return;

      const move = new Vec3();
      Vec3.multiplyScalar(move, bullet.direction, bullet.speed * dt);

      node.setPosition(node.position.add(move));
    });
  }
}
