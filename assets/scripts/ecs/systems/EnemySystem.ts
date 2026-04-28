import { _decorator, Component, Vec3, view } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";
import { GameState } from "../../core/GameState";
import GameManager from "../../core/GameManager";

const { ccclass } = _decorator;

@ccclass("EnemySystem")
export class EnemySystem extends Component {
  private _dir = new Vec3();
  private _move = new Vec3();

  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;

    const world = ECSWorld.instance;
    const player = world.player;
    if (!player || !player.isValid) return;

    const playerPos = player.worldPosition;

    world.enemies.forEach((node) => {
      if (!node || !node.isValid) return;

      const enemy = node.getComponent(EnemyComponent);
      if (!enemy || enemy.isDead) return;

      const pos = node.getWorldPosition();

      // =========================
      // 1. ENTRY (spawn từ ngoài)
      // =========================
      const ENTRY_X = 250;

      if (pos.x > ENTRY_X) {
        const speed = enemy.speed || 80;

        node.setWorldPosition(pos.x - speed * dt, pos.y, pos.z);
        return;
      }

      // =========================
      // 2. DISTANCE CHECK 
      // =========================
      const dist = Vec3.distance(pos, playerPos);

      const minDistance = 40;
      const speed = Math.min(enemy.speed, 80);

      if (dist < minDistance) {
        this._move.set(-this._dir.y * speed * dt, this._dir.x * speed * dt, 0);

        node.setWorldPosition(
          pos.x + this._move.x,
          pos.y + this._move.y,
          pos.z,
        );

        return;
      }

      // =========================
      // 3. CHASE PLAYER
      // =========================
      Vec3.subtract(this._dir, playerPos, pos);
      Vec3.normalize(this._dir, this._dir);

      this._move.set(this._dir.x * speed * dt, this._dir.y * speed * dt, 0);

      node.setWorldPosition(pos.x + this._move.x, pos.y + this._move.y, pos.z);
    });
  }
}
