import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('ScoreSystem')
export class ScoreSystem extends Component {

    private score = 0;

    onLoad() {
        eventEmitter.on(EVENT.ENEMY_DIE, this.onEnemyDie, this);
        eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
    }

    onDestroy() {
    eventEmitter.off(EVENT.ENEMY_DIE, this.onEnemyDie, this);
    eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
}

    onReset() {
        console.log("Score RESET");
        this.score = 0;
        eventEmitter.emit(EVENT.SCORE_UPDATE, this.score);
    } 
    onEnemyDie(data: any) {
        this.score += data.score;
        console.log("Score:", this.score);

        eventEmitter.emit(EVENT.SCORE_UPDATE, this.score);
    }
}