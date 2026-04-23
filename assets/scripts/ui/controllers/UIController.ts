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
    this.showLobby();
  }

  private showHUD() {
    if (!this.lobbyUI || !this.hudUI) return;

    this.lobbyUI.active = false;
    this.hudUI.active = true;
  }

  private showLobby() {
    this.lobbyUI.active = true;
    this.hudUI.active = false;
  }
}
