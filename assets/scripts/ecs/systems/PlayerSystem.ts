import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventKeyboard,
  KeyCode,
  Vec3,
  Vec2,
} from "cc";
import { EVENT } from "../../constants/EventKey";
import { eventEmitter } from "../../core/EventEmitter";
import { PlayerController } from "../../controllers/PlayerController";

const { ccclass, property } = _decorator;

@ccclass("PlayerSystem")
export class PlayerSystem extends Component {
  @property(Node)
  playerNode: Node = null!;

  @property(PlayerController)
  playerController: PlayerController = null!;

  private keyState = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  private canMove: boolean = true;
  private startPosition: Vec3 = new Vec3();

  private inputDirection: Vec3 = new Vec3();

  private lastShootTime: number = 0;
  private attackRate: number = 0.3;

  start() {
    this.startPosition = this.playerNode.worldPosition.clone();
  }
  onLoad() {
    this.registerInput();
    eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
  }

  onDestroy() {
    this.unregisterInput();
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
  }

  private onReset() {
    console.log("Player RESET");

    this.playerNode.setWorldPosition(this.startPosition);

    this.playerController.stopMove();
    this.inputDirection.set(0, 0, 0);
    this.keyState = { w: false, a: false, s: false, d: false };
  }
  private onGameStart = () => {
    console.log("PLAYER RECEIVED EVENT");
    this.canMove = true;
  };
  update(deltaTime: number) {
    this.updateDirectionFromKey();
    this.handleMovement(deltaTime);
  }

  //========== INPUT ===========
  private registerInput() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  private unregisterInput() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
  }
  private onKeyDown(event: EventKeyboard) {
    if (event.keyCode === KeyCode.KEY_W) this.keyState.w = true;
    if (event.keyCode === KeyCode.KEY_S) this.keyState.s = true;
    if (event.keyCode === KeyCode.KEY_A) this.keyState.a = true;
    if (event.keyCode === KeyCode.KEY_D) this.keyState.d = true;

    if (event.keyCode === KeyCode.SPACE) {
      this.tryShoot();
    }
  }

  private onKeyUp(event: EventKeyboard) {
    if (event.keyCode === KeyCode.KEY_W) this.keyState.w = false;
    if (event.keyCode === KeyCode.KEY_S) this.keyState.s = false;
    if (event.keyCode === KeyCode.KEY_A) this.keyState.a = false;
    if (event.keyCode === KeyCode.KEY_D) this.keyState.d = false;
  }

  private updateDirectionFromKey() {
    this.inputDirection.set(0, 0, 0);

    if (this.keyState.w) this.inputDirection.y += 1;
    if (this.keyState.s) this.inputDirection.y -= 1;
    if (this.keyState.a) this.inputDirection.x -= 1;
    if (this.keyState.d) this.inputDirection.x += 1;
  }

  //========== MOVEMENT ========
  private handleMovement(deltaTime: number) {
    if (!this.canMove) return;
    if (this.inputDirection.length() === 0) {
      this.playerController.stopMove();
      return;
    }

    const direction = this.inputDirection.clone().normalize();
    this.playerController.setMoveDirection(new Vec2(direction.x, direction.y));
  }

  private tryShoot() {
    const now = performance.now() / 1000;

    if (now - this.lastShootTime < this.attackRate) return;

    this.lastShootTime = now;

    this.shoot();
  }
  private shoot() {
    this.playerController.playShootAnimation();

    const pos = this.playerController.getShootPoint();

    eventEmitter.emit(EVENT.PLAYER_SHOOT, pos);
  }
}
