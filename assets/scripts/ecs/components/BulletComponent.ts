import { _decorator, Component, Vec3, Node} from "cc";
import { BulletType } from "../../types/BulletType";
import { BulletConfig } from "../config/BulletConfig";

const { ccclass } = _decorator;

@ccclass("BulletComponent")
export class BulletComponent extends Component {
  type: BulletType = BulletType.NORMAL;

  damage: number = 0;
  speed: number = 0;
  direction: Vec3 = new Vec3();

  pierceCount: number = 0;
  explosionRadius: number = 0;
  isHit: boolean = false;
  private _move: Vec3 = new Vec3();
  target: Node | null = null;

  public init(type: BulletType, direction: Vec3) {
    this.type = type;

    // normalize direction
    this.direction.set(direction.x, direction.y, 0).normalize();

    const config = BulletConfig[type];

    this.damage = config.damage;
    this.speed = config.speed;
    this.pierceCount = config.pierceCount ?? 0;
    this.explosionRadius = config.explosionRadius ?? 0;
    this.isHit = false;
    const angle = Math.atan2(this.direction.y, this.direction.x);
    this.node.setRotationFromEuler(0, 0, (angle * 180) / Math.PI);
  }
}