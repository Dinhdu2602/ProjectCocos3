import { _decorator, Component } from 'cc';
import { GameState } from './GameState';
import EventManager from './EventManager';
import { EVENT } from '../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {

    private currentState: GameState = GameState.LOADING;

    onLoad() {
        this.registerEvents();
        this.changeState(GameState.LOBBY);
    }

    private registerEvents() {
        EventManager.instance.on(EVENT.GAME_START, this.onGameStart, this);
        EventManager.instance.on(EVENT.GAME_OVER, this.onGameOver, this);
        EventManager.instance.on(EVENT.EXIT_TO_LOBBY, this.onExit, this);
    }

    private changeState(state: GameState) {
        this.currentState = state;
        console.log("[GameState]:", state);
    }

    private onGameStart = () => {
        this.changeState(GameState.PLAYING);
    }

    private onGameOver = () => {
        this.changeState(GameState.RESULT);
    }

    private onExit = () => {
        this.changeState(GameState.EXIT);

        // reset toàn bộ game
        EventManager.instance.emit(EVENT.RESET_GAME);

        // quay về lobby
        this.changeState(GameState.LOBBY);
    }
}
