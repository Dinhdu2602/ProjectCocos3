import { _decorator, Component, director} from "cc";
import { GameState } from "./GameState";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass } = _decorator;

@ccclass("GameManager")
export default class GameManager extends Component {
  public static instance: GameManager;

  private currentState: GameState = GameState.LOADING;

  public get state() {
    return this.currentState;
  }

  onEnable() {
    eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.on(EVENT.GAME_OVER, this.onGameOver, this);
    eventEmitter.on(EVENT.EXIT_TO_LOBBY, this.onExit, this);

    eventEmitter.on(EVENT.GAME_PAUSE, this.onPause, this);
    eventEmitter.on(EVENT.GAME_RESUME, this.onResume, this);
  }

  onDisable() {
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.GAME_OVER, this.onGameOver, this);
    eventEmitter.off(EVENT.EXIT_TO_LOBBY, this.onExit, this);

    eventEmitter.off(EVENT.GAME_PAUSE, this.onPause, this);
    eventEmitter.off(EVENT.GAME_RESUME, this.onResume, this);
  }
  onLoad() {
    if (GameManager.instance) {
      console.warn("GameManager already exists!");
      this.destroy();
      return;
    }
    GameManager.instance = this;
    this.changeState(GameState.LOBBY);
  }

  start() {
    (window as any).game = this;
    (window as any).event = eventEmitter;
  }

  private changeState(state: GameState) {
    this.currentState = state;
    console.log("[GameState]:", state);
  }

  private onGameStart = () => {
    if (this.currentState === GameState.PLAYING) {
      console.warn("Game already started!");
      return;
    }

    console.log("GAME START TRIGGERED");

    eventEmitter.emit(EVENT.RESET_GAME);
    this.changeState(GameState.PLAYING);
    director.resume();
    
    eventEmitter.emit(EVENT.GAME_START);
  };
  private onGameOver = () => {
    this.changeState(GameState.RESULT);
    director.pause();
  };

  private onExit = () => {
    //this.changeState(GameState.EXIT);
    console.log("EXIT TO LOBBY");
    director.resume();
    eventEmitter.emit(EVENT.RESET_GAME);

    this.changeState(GameState.LOBBY);
    
  };

  private onPause = () => {
    if (this.currentState !== GameState.PLAYING) return;

    this.changeState(GameState.PAUSE);
    director.pause();

    console.log("GAME PAUSE");
  };

  private onResume = () => {
    if (this.currentState !== GameState.PAUSE) return;

    this.changeState(GameState.PLAYING);
    director.resume();

    console.log("GAME RESUME");
  };
}
