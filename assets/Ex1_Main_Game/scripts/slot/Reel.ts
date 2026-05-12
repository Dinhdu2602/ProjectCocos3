import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  SpriteFrame,
  Vec3,
  tween,
  Tween,
} from "cc";
import { Symbol } from "./Symbol";

const { ccclass, property } = _decorator;

@ccclass("Reel")
export class Reel extends Component {
  @property(Prefab)
  symbolPrefab: Prefab = null!;

  @property([SpriteFrame])
  symbolFrames: SpriteFrame[] = [];

  private symbolNodes: Node[] = [];

  private symbolHeight = 175;

  private initialY = 0;

  onLoad() {
    this.initialY = this.node.position.y;


    this.createSymbols();
  }

  createSymbols() {
    this.symbolNodes = [];

    for (let i = 0; i < 5; i++) {
      const node = instantiate(this.symbolPrefab);

      this.node.addChild(node);

      node.setPosition(0, -i * this.symbolHeight, 0);

      this.symbolNodes.push(node);

      this.setSymbol(node, 1);
    }
  }

  getFrame(symbolId: number) {
    return this.symbolFrames[symbolId];
  }

  setSymbol(node: Node, symbolId: number) {
    node.getComponent(Symbol)?.setSymbol(symbolId, this.getFrame(symbolId));
  }

  async spinStep(nextSymbolId: number): Promise<void> {
    return new Promise((resolve) => {
      Tween.stopAllByTarget(this.node);

      tween(this.node)
        .by(0.06, {
          position: new Vec3(0, -this.symbolHeight, 0),
        })
        .call(() => {
          this.recycle(nextSymbolId);
          this.node.setPosition(this.node.position.x, this.initialY);

          resolve();
        })
        .start();
    });
  }

    recycle(nextSymbolId: number) {
      const bottom = this.symbolNodes.pop();

      if (!bottom) return;

      this.setSymbol(bottom, nextSymbolId);

      bottom.setSiblingIndex(0);

      this.symbolNodes.unshift(bottom);
    }

  async spinLoop(stepCount: number = 20, finalResult?: number[]) {
    for (let i = 0; i < stepCount; i++) {
      const randomId = Math.floor(Math.random() * 8) + 1;

      await this.spinStep(randomId);
    }

    if (finalResult) {
      await this.spinStep(finalResult[2]);
      await this.spinStep(finalResult[1]);
      await this.spinStep(finalResult[0]);
    }
  }
}
