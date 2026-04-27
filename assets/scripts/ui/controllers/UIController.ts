import { _decorator, Component, Node } from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property(Node)
  lobbyUI: Node = null!;

  @property(Node)
  hudUI: Node = null;

  @property(Node)
  resultUI: Node = null;

  @property(Node)
  gameLayer: Node = null;

  onLoad() {
    this.registerEvent();
    this.showLobby();
  }

  onDestroy() {
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.GAME_OVER, this.onGameOver, this);
  }

  private registerEvent() {
    eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.on(EVENT.GAME_OVER, this.onGameOver, this);
  }

  private onGameStart() {
    this.showHUD();
  }

  private onGameOver() {
    console.log("UIController: Game Over");

    if (this.hudUI) {
      this.hudUI.active = false;
    }

    if (this.resultUI) {
      this.resultUI.active = true;

      const parent = this.resultUI.parent;
      if (parent) {
        this.resultUI.setSiblingIndex(parent.children.length - 1);
      }
    }

    if (this.gameLayer) {
    this.gameLayer.active = false;
  }
  }

  private showHUD() {
    if (!this.lobbyUI || !this.hudUI || !this.resultUI) return;

    this.lobbyUI.active = false;
    this.hudUI.active = true;
    this.resultUI.active = false;
    if (this.gameLayer) {
    this.gameLayer.active = true;
  }
  }

  private showLobby() {
    this.lobbyUI.active = true;
    this.hudUI.active = false;

    if (this.resultUI) {
      this.resultUI.active = false;
    }
    if (this.gameLayer) {
      this.gameLayer.active = false;
    }
  }
}
