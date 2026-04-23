import { _decorator, Component, Node } from 'cc';
import { eventEmitter} from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';
const { ccclass, property } = _decorator;

@ccclass('TimerSystem')
export class TimerSystem extends Component {
    
    @property 
    duration: number = 30;

    private currentTime: number = 0;
    private isRunning: boolean = false;

    onLoad() {
        this.registerEvent();
    }
    
    onDestroy() {
        eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
        eventEmitter.off(EVENT.RESET_GAME, this.onResetGame, this);
    }

    registerEvent() {
        eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
        eventEmitter.on(EVENT.RESET_GAME, this.onResetGame, this);
    }

    private onGameStart = () => {
        this.currentTime = this.duration;
        this.isRunning = true;
    }

    private onResetGame = () => { 
        this.currentTime = 0;
        this.isRunning = false;
    }

    update(dt: number) {
        if (!this.isRunning) return;

        this.currentTime -= dt;

        if (this.currentTime <= 0) {
            this.currentTime = 0;
            this.isRunning = false;
            eventEmitter.emit(EVENT.TIME_UP);
            console.log("TIME UP EMIT");
        }
    }

    getTime() {
        return this.currentTime;
    }
}

