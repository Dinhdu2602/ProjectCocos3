import { _decorator, Component, Vec2, Vec3, sp, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {

  @property
  speed: number = 200;

  @property({ type: sp.Skeleton })
  animation: sp.Skeleton = null!;

  @property({ type: Node })
  shootPoint: Node = null!;

  // ===== STATE =====
  private _velocity: Vec2 = new Vec2();
  private _targetDirection: Vec2 = new Vec2();

  private _isShooting: boolean = false;
  private _isSpawning: boolean = true;

  private _currentAnim: string = "";

  // =======================

  onLoad() {
    // mix animation
    this.animation.setMix("portal", "idle", 0.1);
    this.animation.setMix("idle", "walk", 0.1);
    this.animation.setMix("walk", "idle", 0.1);

    this.animation.setMix("idle", "shoot", 0.05);
    this.animation.setMix("walk", "shoot", 0.05);
    this.animation.setMix("shoot", "idle", 0.05);
    this.animation.setMix("shoot", "walk", 0.05);

    this.animation.setCompleteListener((trackEntry) => {
    const name = trackEntry.animation?.name;

    if (name === "portal") {
      this._isSpawning = false;
      this.playIdle();
    }

    if (name === "shoot") {
      this._isShooting = false;
    }
  });
  }

  start() {
    this._velocity.set(0, 0);
    this._targetDirection.set(0, 0);

    this.playSpawnAnimation();
  }

  update(dt: number) {
    if (this._isSpawning) return;

    this.handleMovement(dt);
    this.updateAnimation();
  }

  // =======================
  // SPAWN
  // =======================

 private playSpawnAnimation() {
  this._isSpawning = true;

  this.animation.setAnimation(0, "portal", false);

  setTimeout(() => {
    if (this._isSpawning) {
      console.warn("FORCE END SPAWN");
      this._isSpawning = false;
      this.playIdle();
    }
  }, 2000); 
}

  private playIdle() {
    this.animation.setAnimation(0, "idle", true);
    this._currentAnim = "idle";
  }

  // =======================
  // MOVEMENT
  // =======================

  public setMoveDirection(dir: Vec2) {
    this._targetDirection.set(dir.x, dir.y);
  }

  public stopMove() {
    this._targetDirection.set(0, 0);
  }

  private handleMovement(dt: number) {
    if (this._targetDirection.length() === 0) {
      this._velocity.set(0, 0);
      return;
    }

    this._velocity.set(this._targetDirection.x, this._targetDirection.y);

    const moveX = this._velocity.x * this.speed * dt;
    const moveY = this._velocity.y * this.speed * dt;

    const pos = this.node.position.clone();
    pos.x += moveX;
    pos.y += moveY;

    this.node.setPosition(pos);
  }

  // =======================
  // ANIMATION
  // =======================

  private updateAnimation() {
    if (this._isSpawning) return;

    if (this._velocity.length() > 0.01) {
      if (this._currentAnim !== "walk") {
        this.animation.setAnimation(0, "walk", true);
        this._currentAnim = "walk";
      }
    } else {
      if (this._currentAnim !== "idle") {
        this.animation.setAnimation(0, "idle", true);
        this._currentAnim = "idle";
      }
    }
  }

  // =======================
  // SHOOT
  // =======================

  public playShootAnimation() {
    if (this._isSpawning) return;

    this._isShooting = true;

    this.animation.setAnimation(1, "shoot", false);

    
  }

  public getShootPoint(): Vec3 {
    return this.shootPoint.worldPosition.clone();
  }
}
