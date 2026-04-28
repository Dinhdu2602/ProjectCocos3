import { _decorator, Component, ProgressBar } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";
import { EnemyComponent } from "../ecs/components/EnemyComponent";

const { ccclass, property } = _decorator;

@ccclass("EnemyHPUI")
export class EnemyHPUI extends Component {

    @property(ProgressBar)
    hpBar: ProgressBar = null!;

    private enemy: EnemyComponent = null!;

    onLoad() {
        this.enemy = this.getComponent(EnemyComponent)!;

        eventEmitter.on(EVENT.ENEMY_HP_CHANGED, this.onHPChanged, this);
    }

    onDestroy() {
        eventEmitter.off(EVENT.ENEMY_HP_CHANGED, this.onHPChanged, this);
    }

    onHPChanged(data) {
        if (!this.enemy || data.enemy !== this.enemy) return;

        const ratio = data.hp / data.maxHp;

        this.hpBar.progress = ratio;

        // debug
        console.log("UI HP UPDATE:", ratio);
    }
}