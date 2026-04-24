import { _decorator, Component, Label } from "cc";
import { eventEmitter } from "../core/EventEmitter";
import { EVENT } from "../constants/EventKey";

const { ccclass, property } = _decorator;

@ccclass("ScoreUI")
export class ScoreUI extends Component {
  @property(Label)
  label: Label = null!;

  onLoad() {
    this.registerEvent();
  }

  onDestroy() {
    eventEmitter.off(EVENT.SCORE_UPDATE, this.onScoreUpdate, this);
    eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
  }

  private registerEvent() {
    eventEmitter.on(EVENT.SCORE_UPDATE, this.onScoreUpdate, this);
    eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
  }

  private onScoreUpdate(score: number) {
    this.label.string = "Score: "+ score.toString();
  }

  private onReset() {
    this.label.string = "Score: 0";
  }
}
