import { _decorator, Component, ProgressBar, Label } from 'cc';
import { eventEmitter } from '../core/EventEmitter';
import { EVENT } from '../constants/EventKey';

const { ccclass, property } = _decorator;

@ccclass('PlayerHPBar')
export class PlayerHPBar extends Component {

    @property(ProgressBar)
    hpBar: ProgressBar = null!;

    @property(Label)
    hpLabel: Label = null!;

    private maxHP: number = 100;

    onLoad() {
        eventEmitter.on(EVENT.PLAYER_HIT, this.onUpdateHP, this);
    }

    onDestroy() {
        eventEmitter.off(EVENT.PLAYER_HIT, this.onUpdateHP, this);
    }

    private onUpdateHP(currentHP: number) {
        const percent = currentHP / this.maxHP;
        this.hpBar.progress = percent;

        this.hpLabel.string = `${currentHP}/${this.maxHP}`;

        console.log("HP BAR UPDATE:", percent);
    }
}