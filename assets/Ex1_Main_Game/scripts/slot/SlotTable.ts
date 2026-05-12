import { _decorator, Component } from "cc";
import { Reel } from "./Reel";
import { GameEventManager } from "../core/GameEventManager";

const { ccclass, property } = _decorator;

@ccclass("SlotTable")
export class SlotTable extends Component {
  @property([Reel])
  reels: Reel[] = [];

  @property(GameEventManager)
  eventManager: GameEventManager = null!;

  private currentWinAmount = 0;

  onLoad() {
    console.log("SLOTTABLE LOADED");
    console.log("EVENT: ", this.eventManager);
    this.eventManager.on("SPIN_REQUEST", this.onSpinRequest, this);
  }

  onDestroy() {
    this.eventManager?.off("SPIN_REQUEST", this.onSpinRequest, this);
  }

  onSpinRequest(data: any) {
    console.log("SPIN_REQUEST RECEIVED");

    console.log("SERVER MATRIX:", data.matrix);
    this.currentWinAmount = data.winAmount;
    this.spinToResult(data.matrix);
  }

  async spinToResult(matrix: number[]) {
    console.log("START SPIN");

    const tasks: Promise<void>[] = [];

    for (let i = 0; i < this.reels.length; i++) {
      const reel = this.reels[i];

      const result = matrix.slice(i * 3, i * 3 + 3);
      console.log(`REEL ${i + 1} TARGET:`, result);

      const task = this.spinSingleReel(reel, result, i);

      tasks.push(task);
    }

    await Promise.all(tasks);

    console.log("ALL REELS STOPPED");

    this.eventManager.emit("SPIN_FINISHED", {
        winAmount: this.currentWinAmount,
    });
  }

  async spinSingleReel(reel: Reel, result: number[], reelIndex: number) {
    const extraSteps = reelIndex * 4;

    await reel.spinLoop(20 + extraSteps, result);
  }
}
