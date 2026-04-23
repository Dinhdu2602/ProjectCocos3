import { _decorator, Component } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {
  onLoad() {
    console.log("Room Manager loaded");
    this.registerEvent();
  }

  onDestroy() {
    eventEmitter.off(EVENT.TIME_UP, this.onTimeUp, this);
  }

  registerEvent() {
    eventEmitter.on(EVENT.TIME_UP, this.onTimeUp, this);
  }

  private onTimeUp = () => {
    console.log("[Room] Time Up");

    eventEmitter.emit(EVENT.GAME_OVER);
    this.changeState("RESULT");
  };

  private changeState(state: string) {
    console.log("[Room] Change State:", state);

    if (state === "RESULT") {
      setTimeout(() => {
        eventEmitter.clear(); 
      }, 0);
    }
  }
}
