import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';

const { ccclass } = _decorator;

@ccclass('ScoreSystem')
export class ScoreSystem extends Component {

    private score = 0;

    onLoad() {
        eventEmitter.on("ENEMY_DIE", this.onEnemyDie.bind(this));
    }

    onEnemyDie(data: any) {
        this.score += data.score;
        console.log("Score:", this.score);
    }
}