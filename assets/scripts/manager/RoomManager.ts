import { _decorator, Component, Game } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";
import { SpawnSystem } from "../ecs/systems/SpawnSystem";
import { EnemySystem } from "../ecs/systems/EnemySystem";
import { BulletSystem } from "../ecs/systems/BulletSystem";
import { GameState } from "../core/GameState";

const { ccclass, property } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {
  @property(SpawnSystem)
  spawnSystem: SpawnSystem = null!;

  @property(EnemySystem)
  enemySystem: EnemySystem = null!;

  @property(BulletSystem)
  bulletSystem: BulletSystem = null!;

  private currentState: GameState = GameState.LOBBY;

  onLoad() {
    console.log("Room Manager loaded");
    this.registerEvent();
  }

  onDestroy() {
    eventEmitter.off(EVENT.TIME_UP, this.onTimeUp, this);
  }

  registerEvent() {
    eventEmitter.on(EVENT.TIME_UP, this.onTimeUp, this);
    eventEmitter.on(EVENT.RESET_GAME, this.onResetGame, this);
  }

  private onTimeUp = () => {
    console.log("[Room] Time Up");

    eventEmitter.emit(EVENT.GAME_OVER);
    this.changeState(GameState.RESULT);
  };

  onResetGame() {
    console.log(">>> RESET GAME");
    
    //reset state
    this.changeState(GameState.PLAYING);
  }

  changeState(state: GameState) {
    if (this.currentState === state) return; //Loop

    this.currentState = state;

    console.log("[Room] Change State:", state);

    switch (state) {
      case GameState.PLAYING:
        this.enableGameplay();
        eventEmitter.emit(EVENT.GAME_START);
        break;

      case GameState.RESULT:
        this.disableGameplay();

        console.log(">>> EMIT GAME_OVER"); // debug

        eventEmitter.emit(EVENT.GAME_OVER);

        break;
    }
  }

  enableGameplay() {
    console.log(">>> ENABLE GAMEPLAY");

    this.spawnSystem.enabled = true;
  }

  disableGameplay() {
    console.log(">>> DISABLE GAMEPLAY");
    console.log("SpawnSystem ref:", this.spawnSystem);

    this.spawnSystem.enabled = false;
  }

}
