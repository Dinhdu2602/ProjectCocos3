import { _decorator, Component } from 'cc';
import { GameState } from './GameState';
import { eventEmitter } from '../core/EventEmitter';
import { EVENT } from '../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {

    private currentState: GameState = GameState.LOADING;

    onLoad() {
        this.registerEvents();
        this.changeState(GameState.LOBBY);
    }
    
    start() {
        (window as any).game = this;
        (window as any).event = eventEmitter;
    }
    private registerEvents() {
        eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
        eventEmitter.on(EVENT.GAME_OVER, this.onGameOver, this);
        eventEmitter.on(EVENT.EXIT_TO_LOBBY, this.onExit, this);
    }

    private changeState(state: GameState) {
        this.currentState = state;
        console.log("[GameState]:", state);
    }

    private onGameStart = () => {
        console.log("GAME START TRIGGERED");
        this.changeState(GameState.PLAYING);
    }

    private onGameOver = () => {
        this.changeState(GameState.RESULT);
    }

    private onExit = () => {
        this.changeState(GameState.EXIT);

        // reset toàn bộ game
        eventEmitter.emit(EVENT.RESET_GAME);

        // quay về lobby
        this.changeState(GameState.LOBBY);
    }
}
