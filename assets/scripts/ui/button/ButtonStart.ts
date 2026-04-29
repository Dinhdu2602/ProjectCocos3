import { _decorator, Component, Button } from "cc";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";

const { ccclass, property } = _decorator;

@ccclass("StartButton")
export class StartButton extends Component {
  @property(Button)
  button: Button = null!;

  private isClicked = false;

  onLoad() {
    console.log("[UI] Start Button loaded");
    this.button.node.on(Button.EventType.CLICK, this.onClickStart, this);
  }

  onDestroy() {
    this.button.node.off(Button.EventType.CLICK, this.onClickStart, this);
  }

  onEnable() {
    eventEmitter.on(EVENT.EXIT_TO_LOBBY, this.resetClick, this);
  }

  onDisable() {
    eventEmitter.off(EVENT.EXIT_TO_LOBBY, this.resetClick, this);
  }

  private resetClick() {
    this.isClicked = false;
  }
  private onClickStart() {
    eventEmitter.emit(EVENT.GAME_START);
    if (this.isClicked) return;

    this.isClicked = true;
    console.log("[UI] Click Start");

    eventEmitter.emit(EVENT.GAME_START);
  }
}
