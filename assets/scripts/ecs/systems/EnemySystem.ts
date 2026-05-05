import { _decorator, Component, Vec3, isValid } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { NodeUtils } from "../../utils/NodeUtils";
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

  world.enemies.forEach((node, index) => {
    if (!node || !node.isValid) return;

    const enemy = node.getComponent(EnemyComponent);
    if (!enemy || enemy.isDead) return;

    const pos = node.getWorldPosition();

    // =========================
    // 0. OUT OF SCREEN LEFT → DESTROY
    // =========================
    const LEFT_BOUND = -500;

    if (pos.x < LEFT_BOUND) {
      node.destroy();
      world.enemies.splice(index, 1);
      return;
    }

    // =========================
    // 1. MOVE / AI
    // =========================
    const speed = Math.min(enemy.speed || 80, 80);

    Vec3.subtract(this._dir, playerPos, pos);
    Vec3.normalize(this._dir, this._dir);

    const dist = Vec3.distance(pos, playerPos);

    // =========================
    // 2. CHASE PLAYER
    // =========================
    const minDistance = 40;

    if (dist > minDistance) {
      this._move.set(
        this._dir.x * speed * dt,
        this._dir.y * speed * dt,
        0
      );
    } 
    // =========================
    // 3. KEEP DISTANCE / AVOID STACKING
    // =========================
    else {
      this._move.set(
        -this._dir.y * speed * dt,
        this._dir.x * speed * dt,
        0
      );
    }

    node.setWorldPosition(
      pos.x + this._move.x,
      pos.y + this._move.y,
      pos.z
    );
  });
}

  clearAllEnemies() {
    NodeUtils.clearNodes(ECSWorld.instance.enemies);
  }
}
