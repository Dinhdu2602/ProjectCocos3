import { _decorator, Component, Vec3, Node } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { BulletComponent } from "../components/BulletComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { GameState } from "../../core/GameState";
import GameManager from "../../core/GameManager";

const { ccclass } = _decorator;

@ccclass("CollisionSystem")
export class CollisionSystem extends Component {
  private hitCooldown: Map<Node, number> = new Map();
  private readonly HIT_DELAY = 500;

  onEnable() {
    console.log("CollisionSystem ENABLED");
    this.hitCooldown.clear();
  }

  onDisable() {
    console.log("CollisionSystem DISABLED");
    this.hitCooldown.clear();
  }
  update() {
    if (GameManager.instance.state !== GameState.PLAYING) return;
    const now = Date.now();
    const { bullets, enemies, player } = ECSWorld.instance;

    bullets.forEach((b) => {
      const bullet = b.getComponent(BulletComponent);
      if (!bullet) return;

      enemies.forEach((e) => {
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

    enemies.forEach((e) => {
      if (!e || !e.isValid) return;

      if (!this.hit(e, player)) return;

      const lastHit = this.hitCooldown.get(e) || 0;

      if (now - lastHit < this.HIT_DELAY) return;

      console.log("HIT PLAYER");

      playerComponent.takeDamage(50);

      this.hitCooldown.set(e, now);
    });
  }

  hit(a: any, b: any) {
    return Vec3.distance(a.worldPosition, b.worldPosition) < 50;
  }
}
