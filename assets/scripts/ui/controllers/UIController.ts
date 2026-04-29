import { _decorator, Component, Node } from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property(Node)
  lobbyUI: Node = null!;

  @property(Node)
  hudUI: Node = null!;

  @property(Node)
  resultUI: Node = null!;

  @property(Node)
  gameLayer: Node = null!;

  @property(Node)
  pausePopup: Node = null!;

  @property(Node)
  settingPopup: Node = null!;

  onLoad() {
    this.registerEvent();
    this.showLobby();
  }

  private registerEvent() {
    eventEmitter.on(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.on(EVENT.GAME_OVER, this.onGameOver, this);

    eventEmitter.on(EVENT.GAME_PAUSE, this.showPause, this);
    eventEmitter.on(EVENT.GAME_RESUME, this.hidePause, this);
    eventEmitter.on(EVENT.OPEN_SETTING, this.openSetting, this);
    eventEmitter.on(EVENT.CLOSE_SETTING, this.closeSetting, this);
    eventEmitter.on(EVENT.EXIT_TO_LOBBY, this.onExitLobby, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.GAME_START, this.onGameStart, this);
    eventEmitter.off(EVENT.GAME_OVER, this.onGameOver, this);

    eventEmitter.off(EVENT.GAME_PAUSE, this.showPause, this);
    eventEmitter.off(EVENT.GAME_RESUME, this.hidePause, this);
    eventEmitter.off(EVENT.OPEN_SETTING, this.openSetting, this);
    eventEmitter.off(EVENT.CLOSE_SETTING, this.closeSetting, this);
    eventEmitter.off(EVENT.EXIT_TO_LOBBY, this.onExitLobby, this);
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
  console.log(">>> SHOW LOBBY");

  this.lobbyUI.active = true;
  this.hudUI.active = false;

  if (this.resultUI) {
    this.resultUI.active = false;
    this.resultUI.setSiblingIndex(0);
  }

  if (this.gameLayer) this.gameLayer.active = false;

  if (this.pausePopup) this.pausePopup.active = false;
  if (this.settingPopup) this.settingPopup.active = false;

  this.lobbyUI.setSiblingIndex(999);
}

  // ========================
  // PAUSE UI
  // ========================

  private showPause() {
    if (this.pausePopup) {
      this.pausePopup.active = true;
    }
  }

  private hidePause() {
    if (this.pausePopup) {
      this.pausePopup.active = false;
    }
  }

  // ========================
  // SETTING UI
  // ========================

  private openSetting() {
    if (this.settingPopup) {
      this.settingPopup.active = true;
    }
  }

  private closeSetting() {
    if (this.settingPopup) {
      this.settingPopup.active = false;
    }
  }
  
  private onExitLobby() {
  console.log("UI: Back to Lobby");

  this.showLobby();
  if (this.pausePopup) {
    this.pausePopup.active = false;
    this.pausePopup.setSiblingIndex(0);
  }

  if (this.settingPopup) {
    this.settingPopup.active = false;
    this.settingPopup.setSiblingIndex(0);
  }
}
}
