import { _decorator, Component, Node } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass, property } = _decorator;

@ccclass("ResultPopup")
export class ResultPopup extends Component {
  onLoad() {
    console.log("ResultPopup LOADED");

    eventEmitter.on(EVENT.GAME_OVER, this.show, this);
    eventEmitter.on(EVENT.RESET_GAME, this.hide, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.GAME_OVER, this.show, this);
    eventEmitter.off(EVENT.RESET_GAME, this.hide, this);
  }

  show() {
    console.log(">>> SHOW RESULT POPUP");
    this.node.active = true;
    const parent = this.node.parent;
    if (parent) {
      this.node.setSiblingIndex(parent.children.length - 1);
    }
  }

  hide() {
    console.log(">>> HIDE RESULT POPUP");
    this.node.active = false;
  }

  onClickReplay() {
    console.log(">>> CLICK REPLAY");

    eventEmitter.emit(EVENT.EXIT_TO_LOBBY);

    setTimeout(() => {
      eventEmitter.emit(EVENT.GAME_START);
    }, 0);
  }
}
