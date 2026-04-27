import { _decorator, Component, Node } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass, property } = _decorator;

@ccclass("BackgroundManager")
export class BackgroundManager extends Component {
  @property(Node)
  bgLobby: Node = null!;

  @property(Node)
  bgGameplay: Node = null!;

  @property(Node)
  bgResult: Node = null!;

  onLoad() {
    this.registerEvent();
    this.showLobby();
  }

  onDestroy() {
    eventEmitter.off(EVENT.GAME_START, this.showGameplay, this);
    eventEmitter.off(EVENT.GAME_OVER, this.showResult, this);
    eventEmitter.off(EVENT.EXIT_TO_LOBBY, this.showLobby, this);
  }

  private registerEvent() {
    eventEmitter.on(EVENT.GAME_START, this.showGameplay, this);
    eventEmitter.on(EVENT.GAME_OVER, this.showResult, this);
    eventEmitter.on(EVENT.EXIT_TO_LOBBY, this.showLobby, this);
  }

  private hideAll() {
    this.bgLobby.active = false;
    this.bgGameplay.active = false;
    if (this.bgResult) this.bgResult.active = false;
  }

  showLobby() {
    console.log(">>> SHOW LOBBY");
    this.bgLobby.active = true;
    this.bgGameplay.active = false;
    this.bgResult.active = false;
}

private showGameplay() {
  console.log(">>> SHOW GAMEPLAY");
  this.hideAll();
  this.bgGameplay.active = true;
}

private showResult() {
  console.log(">>> SHOW RESULT");
  this.hideAll();
  this.bgResult.active = true;
}
}


