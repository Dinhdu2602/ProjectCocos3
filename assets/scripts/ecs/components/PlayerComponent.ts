import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';
import { ECSWorld } from '../core/ECSWorld';

const { ccclass } = _decorator;

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {

    maxHP: number = 100;
    currentHP: number = 100;

    onEnable() {
        ECSWorld.instance.player = this.node;
        console.log("Player registered");
    }

    onLoad() {  
        eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
    }

    onDestroy() {
        eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
    }

    takeDamage(amount: number) {
        this.currentHP -= amount;

        if (this.currentHP < 0) this.currentHP = 0;

        console.log("Player HP:", this.currentHP);

        eventEmitter.emit(EVENT.PLAYER_HIT, this.currentHP);

        if (this.currentHP <= 0) {
            console.log(">>> PLAYER DIE");
            eventEmitter.emit(EVENT.PLAYER_DIE);
        }
    }

    private onReset() {
        console.log("Player RESET");

        this.currentHP = this.maxHP;
        ECSWorld.instance.player = this.node;
        eventEmitter.emit(EVENT.PLAYER_HIT, this.currentHP);
    }
}