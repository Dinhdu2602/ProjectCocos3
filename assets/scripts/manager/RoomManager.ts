import { _decorator, Component } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";
import { SpawnSystem } from "../ecs/systems/SpawnSystem";
import { EnemySystem } from "../ecs/systems/EnemySystem";
import { BulletSystem } from "../ecs/systems/BulletSystem";
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


  @property(DamageSystem)
  damageSystem: DamageSystem = null!;

  onLoad() {
    console.log("Room Manager loaded");
  }

  onEnable() {
    eventEmitter.on(EVENT.TIME_UP, this.onTimeUp, this);
    eventEmitter.on(EVENT.RESET_GAME, this.onResetGame, this);
  }

  onDisable() {
    eventEmitter.off(EVENT.TIME_UP, this.onTimeUp, this);
    eventEmitter.off(EVENT.RESET_GAME, this.onResetGame, this);
  }

  // =========================
  // EVENT HANDLER
  // =========================

  private onTimeUp = () => {
    console.log("[Room] Time Up");

    this.disableGameplay();

    console.log(">>> EMIT GAME_OVER");
    eventEmitter.emit(EVENT.GAME_OVER);
  };
  
  private onResetGame = () => {
    console.log(">>> RESET GAME (Room)");

    this.disableGameplay();
    this.bulletSystem.clearAllBullets();

    this.scheduleOnce(() => {
        this.enableGameplay();
    }, 0);
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
