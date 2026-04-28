import { _decorator, Component, Node, Prefab, instantiate, Vec3, isValid } from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import { BulletType } from "../../types/BulletType";
import { BulletComponent } from "../components/BulletComponent";
import { ECSWorld } from "../core/ECSWorld";

const { ccclass, property } = _decorator;

@ccclass("BulletSystem")
export class BulletSystem extends Component {
  @property(Prefab)
  bulletPrefab: Prefab = null!;

  @property(Node)
  bulletLayer: Node = null!;

  private _targetPos = new Vec3();
  private _currentPos = new Vec3();
  private _move = new Vec3();
  private _desiredDir = new Vec3();

  onLoad() {
    eventEmitter.on(EVENT.PLAYER_SHOOT, this.onShoot, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.PLAYER_SHOOT, this.onShoot, this);
  }

  update(dt: number) {
    const bullets = ECSWorld.instance.bullets;

    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (!isValid(bullet)) continue;

      const comp = bullet.getComponent(BulletComponent);
      if (!comp) continue;

      // =========================
      // SOFT TRACKING
      // =========================
      if (comp.target && isValid(comp.target)) {
        comp.target.getWorldPosition(this._targetPos);
        bullet.getWorldPosition(this._currentPos);

        Vec3.subtract(this._desiredDir, this._targetPos, this._currentPos);
        Vec3.normalize(this._desiredDir, this._desiredDir);

        Vec3.lerp(comp.direction, comp.direction, this._desiredDir, 0.2);
        Vec3.normalize(comp.direction, comp.direction);
      }

      // =========================
      // MOVE
      // =========================
      if (comp.direction.lengthSqr() === 0) continue;

      this._move.set(
        comp.direction.x * comp.speed * dt,
        comp.direction.y * comp.speed * dt,
        0
      );

      bullet.getWorldPosition(this._currentPos);

      bullet.setWorldPosition(
        this._currentPos.x + this._move.x,
        this._currentPos.y + this._move.y,
        this._currentPos.z
      );
    }
  }

  private onShoot(data: { pos: Vec3 }) {
    const { pos } = data;

    const enemies = ECSWorld.instance.enemies;
    if (enemies.length === 0) return;

    // =========================
    // FIND NEAREST
    // =========================
    let nearest = enemies[0];
    let nearestPos = new Vec3();
    nearest.getWorldPosition(nearestPos);

    let minDist = Vec3.distance(pos, nearestPos);

    for (let i = 1; i < enemies.length; i++) {
      const e = enemies[i];
      if (!isValid(e)) continue;

      const p = new Vec3();
      e.getWorldPosition(p);

      const dist = Vec3.distance(pos, p);
      if (dist < minDist) {
        minDist = dist;
        nearest = e;
        nearestPos = p;
      }
    }

    // =========================
    // DIRECTION
    // =========================
    const dir = new Vec3();
    Vec3.subtract(dir, nearestPos, pos);
    Vec3.normalize(dir, dir);

    // =========================
    // SPAWN BULLET
    // =========================
    const bullet = instantiate(this.bulletPrefab);
    this.bulletLayer.addChild(bullet);
    bullet.setWorldPosition(pos);

    const comp = bullet.getComponent(BulletComponent);
    if (!comp) return;

    comp.init(BulletType.NORMAL, dir);

    comp.target = nearest;

    ECSWorld.instance.bullets.push(bullet);
  }
}