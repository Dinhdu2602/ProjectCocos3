// import { _decorator, Component, Game } from "cc";
// import { eventEmitter } from "../core/EventEmitter";
// import { EVENT } from "../constants/EventKey";
// import { SpawnSystem } from "../ecs/systems/SpawnSystem";
// import { EnemySystem } from "../ecs/systems/EnemySystem";
// import { BulletSystem } from "../ecs/systems/BulletSystem";
// import { CollisionSystem } from "../ecs/systems/CollisionSystem";
// import { DamageSystem } from "../ecs/systems/DamageSystem";
// import { GameState } from "../core/GameState";
// import { ECSWorld } from "../ecs/core/ECSWorld";

// const { ccclass, property } = _decorator;

// @ccclass("RoomManager")
// export class RoomManager extends Component {
//   @property(SpawnSystem)
//   spawnSystem: SpawnSystem = null!;

//   @property(EnemySystem)
//   enemySystem: EnemySystem = null!;

//   @property(BulletSystem)
//   bulletSystem: BulletSystem = null!;

//   @property(CollisionSystem)
//   collisionSystem: CollisionSystem = null!;

//   @property(DamageSystem)
//   damageSystem: DamageSystem = null!;
  
//   private currentState: GameState = GameState.LOBBY;

//   onLoad() {
//     console.log("Room Manager loaded");
//     this.registerEvent();
//   }

//   onDestroy() {
//     eventEmitter.off(EVENT.TIME_UP, this.onTimeUp, this);
//   }

//   registerEvent() {
//     eventEmitter.on(EVENT.TIME_UP, this.onTimeUp, this);
//     eventEmitter.on(EVENT.RESET_GAME, this.onResetGame, this);
//   }

//   private onTimeUp = () => {
//     console.log("[Room] Time Up");
//     this.changeState(GameState.RESULT);
//   };

//   onResetGame() {
//     console.log(">>> RESET GAME");
    
//     //reset state
//     this.changeState(GameState.PLAYING);
//   }

//   changeState(state: GameState) {
//     if (this.currentState === state) return; //Loop

//     this.currentState = state;

//     console.log("[Room] Change State:", state);
//     switch (state) {
//       case GameState.PLAYING:
//         this.enableGameplay();
//         break;

//       case GameState.RESULT:
//         this.disableGameplay();

//         console.log(">>> EMIT GAME_OVER"); // debug

//         eventEmitter.emit(EVENT.GAME_OVER);

//         break;
//     }
//   }

//   enableGameplay() {
//     console.log(">>> ENABLE GAMEPLAY");

//     this.spawnSystem.enabled = true;
//   }

//   disableGameplay() {
//     console.log(">>> DISABLE GAMEPLAY");
//     console.log("SpawnSystem ref:", this.spawnSystem);

//     this.spawnSystem.enabled = false;
//   }

// }
import { _decorator, Component } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";
import { SpawnSystem } from "../ecs/systems/SpawnSystem";
import { EnemySystem } from "../ecs/systems/EnemySystem";
import { BulletSystem } from "../ecs/systems/BulletSystem";
import { CollisionSystem } from "../ecs/systems/CollisionSystem";
import { DamageSystem } from "../ecs/systems/DamageSystem";

const { ccclass, property } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {

  @property(SpawnSystem)
  spawnSystem: SpawnSystem = null!;

  @property(EnemySystem)
  enemySystem: EnemySystem = null!;

  @property(BulletSystem)
  bulletSystem: BulletSystem = null!;

  @property(CollisionSystem)
  collisionSystem: CollisionSystem = null!;

  @property(DamageSystem)
  damageSystem: DamageSystem = null!;

  onLoad() {
    console.log("Room Manager loaded");
  }

  onEnable() {
    eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.on(EVENT.TIME_UP, this.onTimeUp, this);
    eventEmitter.on(EVENT.RESET_GAME, this.onResetGame, this);
  }

  onDisable() {
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.TIME_UP, this.onTimeUp, this);
    eventEmitter.off(EVENT.RESET_GAME, this.onResetGame, this);
  }

  // =========================
  // EVENT HANDLER
  // =========================

  private onGameStart = () => {
    console.log(">>> ENABLE GAMEPLAY");

    this.enableGameplay();
  };

  private onTimeUp = () => {
    console.log("[Room] Time Up");

    this.disableGameplay();

    console.log(">>> EMIT GAME_OVER");
    eventEmitter.emit(EVENT.GAME_OVER);
  };

  private onResetGame = () => {
    console.log(">>> RESET GAME");
  };

  // =========================
  // GAMEPLAY CONTROL
  // =========================

  enableGameplay() {
    this.spawnSystem.enabled = true;
  }

  disableGameplay() {
    this.spawnSystem.enabled = false;
  }
}
