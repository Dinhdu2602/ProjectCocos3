import { _decorator, Component } from "cc";
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
  }

  onDisable() {
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.GAME_OVER, this.onGameOver, this);
    eventEmitter.off(EVENT.EXIT_TO_LOBBY, this.onExit, this);
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
  };
  private onGameOver = () => {
    this.changeState(GameState.RESULT);
  };

  private onExit = () => {
    this.changeState(GameState.EXIT);

    eventEmitter.emit(EVENT.RESET_GAME);

    this.changeState(GameState.LOBBY);
  };
}
