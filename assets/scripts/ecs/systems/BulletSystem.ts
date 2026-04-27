import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import { BulletType } from "../../types/BulletType";
import { BulletComponent } from "../components/BulletComponent";


const { ccclass, property } = _decorator;

@ccclass("BulletSystem")
export class BulletSystem extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null!;
    @property(Node)
    bulletLayer: Node = null!;

    onLoad() {
        eventEmitter.on(EVENT.PLAYER_SHOOT, this.onShoot, this);
    }

    onDestroy() {
        eventEmitter.off(EVENT.PLAYER_SHOOT, this.onShoot, this);
    }
     private onShoot(pos: Vec3) {

        if (!this.bulletPrefab || !this.bulletLayer) {
            console.error(" BulletSystem not get prefab or layer");
            return;
        }

        const bullet = instantiate(this.bulletPrefab);
        this.bulletLayer.addChild(bullet);

        bullet.setWorldPosition(pos);

        const comp = bullet.getComponent(BulletComponent);

        if (!comp) {
            console.error("Bullet prefab miss BulletComponent");
            return;
        }

        comp.init(BulletType.NORMAL, new Vec3(1, 0, 0));
    }
}
