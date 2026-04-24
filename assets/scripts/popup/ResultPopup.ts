import { _decorator, Component, Node } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass, property } = _decorator;

@ccclass("ResultPopup")
export class ResultPopup extends Component {

    onLoad() {
    console.log("ResultPopup LOADED");
    this.node.active = false;

    eventEmitter.on(EVENT.GAME_OVER, () => {
        console.log(">>> RECEIVED GAME_OVER");
        this.show();
        this
    });
    }

    onDestroy() {
        eventEmitter.off(EVENT.GAME_OVER, this.show, this);
        eventEmitter.off(EVENT.RESET_GAME, this.hide, this);
    }

    show() {
        console.log(">>> SHOW RESULT POPUP");
        this.node.setSiblingIndex(999);
        this.node.active = true;
    }

    hide() {
        console.log(">>> HIDE RESULT POPUP");
        this.node.active = false;
    }

    onClickReplay() {
        console.log(">>> CLICK REPLAY");
        eventEmitter.emit(EVENT.RESET_GAME);
        this.node.active = false;
    }
}