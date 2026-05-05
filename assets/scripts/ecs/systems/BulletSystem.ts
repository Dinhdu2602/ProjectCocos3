import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  Vec3,
  isValid,
  UITransform,
} from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import { BulletType } from "../../types/BulletType";
import { BulletComponent } from "../components/BulletComponent";
import { ECSWorld } from "../core/ECSWorld";
import GameManager from "../../core/GameManager";
import { GameState } from "../../core/GameState";
import { NodeUtils } from "../../utils/NodeUtils";
const { ccclass, property } = _decorator;

@ccclass("BulletSystem")
export class BulletSystem extends Component {
  @property(Prefab)
  bulletPrefab: Prefab = null!;

  @property(Node)
  bulletLayer: Node = null!;

  private _move = new Vec3();
  private _currentPos = new Vec3();

  onLoad() {
    eventEmitter.on(EVENT.PLAYER_SHOOT, this.onShoot, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.PLAYER_SHOOT, this.onShoot, this);
  }

  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;
    const bullets = ECSWorld.instance.bullets;

    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      NodeUtils.removeInvalidNodes(ECSWorld.instance.bullets);

      const comp = bullet.getComponent(BulletComponent);
      if (!comp) continue;

      // STRAIGHT MOVEMENT ONLY
      this._move.set(
        comp.direction.x * comp.speed * dt,
        comp.direction.y * comp.speed * dt,
        0,
      );

      bullet.getWorldPosition(this._currentPos);

      bullet.setWorldPosition(
        this._currentPos.x + this._move.x,
        this._currentPos.y + this._move.y,
        this._currentPos.z,
      );
    }
  }

  private onShoot(data: { pos: Vec3; dir: Vec3 }) {
    const { pos, dir } = data;

    const bullet = instantiate(this.bulletPrefab);
    this.bulletLayer.addChild(bullet);
    bullet.setWorldPosition(pos);
    const finalDir = new Vec3(dir.x >= 0 ? 1 : -1, 0, 0);

    const comp = bullet.getComponent(BulletComponent);
    if (!comp) return;

    comp.init(BulletType.NORMAL, finalDir);

    ECSWorld.instance.bullets.push(bullet);
  }

  clearAllBullets() {
    NodeUtils.clearNodes(ECSWorld.instance.bullets);
  }
}
