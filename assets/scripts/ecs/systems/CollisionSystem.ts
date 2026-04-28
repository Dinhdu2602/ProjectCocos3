import { _decorator, Component, Vec3, Node } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { BulletComponent } from "../components/BulletComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { GameState } from "../../core/GameState";
import GameManager from "../../core/GameManager";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";

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
    const world = ECSWorld.instance;

    const bullets = world.bullets;
    const enemies = world.enemies;
    const player = world.player;

    // =========================
    // BULLET vs ENEMY
    // =========================
    for (const b of bullets) {
      if (!b || !b.isValid) continue;

      const bullet = b.getComponent(BulletComponent);
      if (!bullet) continue;

      for (const e of enemies) {
        if (!e || !e.isValid) continue;

        const enemy = e.getComponent(EnemyComponent);
        if (!enemy || enemy.isDead) continue;

        if (this.hitBulletEnemy(b, e)) {
          console.log("HIT ENEMY");

          //Apply damage
          eventEmitter.emit(EVENT.ENEMY_HIT, {
            enemy,
            damage: bullet.damage,
          });

           // Mark bullet hit
          bullet.isHit = true;

          const index = world.bullets.indexOf(b);
          if (index !== -1) {
            world.bullets.splice(index, 1);
          }

          // Destroy bullet
          b.destroy();

          break;
        }
      }
    }

    // =========================
    // ENEMY vs PLAYER
    // =========================
    if (!player || !player.isValid) return;

    const playerComponent = player.getComponent(PlayerComponent);
    if (!playerComponent) return;

    for (const e of enemies) {
      if (!e || !e.isValid) continue;

      const enemy = e.getComponent(EnemyComponent);
      if (!enemy || enemy.isDead) continue;

      if (!this.hitEnemyPlayer(e, player)) continue;

      const lastHit = this.hitCooldown.get(e) || 0;

      if (now - lastHit < this.HIT_DELAY) continue;

      console.log("HIT PLAYER");

      playerComponent.takeDamage(enemy.damage);

      this.hitCooldown.set(e, now);
    }

    // =========================
    // CLEAN INVALID BULLETS
    // =========================
    world.bullets = world.bullets.filter((b) => b && b.isValid);
  }

  // =========================
  // COLLISION HELPERS
  // =========================

  private hitBulletEnemy(bulletNode: Node, enemyNode: Node): boolean {
    const bulletPos = bulletNode.getWorldPosition();
    const enemyPos = enemyNode.getWorldPosition();

    const dist = Vec3.distance(bulletPos, enemyPos);

    const bulletRadius = 10;
    const enemy = enemyNode.getComponent(EnemyComponent);
    const enemyRadius = enemy?.radius || 25;

    return dist < bulletRadius + enemyRadius;
  }

  private hitEnemyPlayer(enemyNode: Node, playerNode: Node): boolean {
    const dist = Vec3.distance(
      enemyNode.worldPosition,
      playerNode.worldPosition,
    );

    const enemy = enemyNode.getComponent(EnemyComponent);
    const enemyRadius = enemy?.radius || 25;

    const playerRadius = 20;

    return dist < enemyRadius + playerRadius;
  }
}
