import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  view
} from "cc";

import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";
import { EnemyType } from "../../types/EnemyType";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import GameManager from "../../core/GameManager";
import { GameState } from "../../core/GameState";

const { ccclass, property } = _decorator;

@ccclass("SpawnSystem")
export class SpawnSystem extends Component {

  @property([Prefab])
  enemyPrefabs: Prefab[] = [];

  @property(Node)
  enemyLayer: Node = null!;

  private timer = 0;
  private interval = 2.5;
  private maxEnemy = 5;

  onLoad() {
    this.enabled = false;
    eventEmitter.on(EVENT.RESET_GAME, this.onReset, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.RESET_GAME, this.onReset, this);
  }

  onReset() {
    this.timer = 0;

    ECSWorld.instance.enemies.forEach(e => {
      if (e) e.destroy();
    });

    ECSWorld.instance.enemies = [];
  }

  onEnable() {
    this.timer = 0;
  }

  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;

    this.timer += dt;

    if (this.timer >= this.interval) {
      this.spawnEnemy();
      this.timer = 0;
    }
  }

  spawnEnemy() {
    if (ECSWorld.instance.enemies.length >= this.maxEnemy) return;

    // random type
    const type = Math.floor(Math.random() * this.enemyPrefabs.length);
    const prefab = this.enemyPrefabs[type];

    if (!prefab) return;

    const enemy = instantiate(prefab);
    enemy.setParent(this.enemyLayer);

    const size = view.getVisibleSize();
    const halfW = size.width / 2;
    const halfH = size.height / 2;

    const x = halfW + 20;
    const y = (Math.random() - 0.5) * halfH;

    enemy.setPosition(x, y, 0);
    enemy.active = true;

    const comp = enemy.getComponent(EnemyComponent);
    if (comp) {
      comp.init(type);
    }

    ECSWorld.instance.enemies.push(enemy);

    console.log("Spawn:", EnemyType[type]);
  }
}