import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('ScoreSystem')
export class ScoreSystem extends Component {

    private score = 0;

    onLoad() {
        eventEmitter.on(EVENT.ENEMY_DIE, this.onEnemyDie, this);
    }

    onEnemyDie(data:any){
        this.score += data.score;
        eventEmitter.emit(EVENT.SCORE_UPDATE,{score:this.score});
    }
}