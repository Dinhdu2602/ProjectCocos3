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
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import GameManager from "../../core/GameManager";
import { GameState } from "../../core/GameState";

const { ccclass, property } = _decorator;

@ccclass("SpawnSystem")
export class SpawnSystem extends Component {

  @property(Prefab)
  enemyPrefab: Prefab = null!;

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
    console.log(">>> spawn RESET");

    this.timer = 0;

    ECSWorld.instance.enemies.forEach(e => {
      if (e && e.isValid) e.destroy();
    });

    ECSWorld.instance.enemies = [];
  }

  onEnable() {
    console.log("SpawnSystem ENABLED");
    this.timer = 0;
  }

  onDisable() {
    console.log("SpawnSystem DISABLED");
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

    const enemy = instantiate(this.enemyPrefab);
    enemy.setParent(this.enemyLayer);
    const size = view.getVisibleSize();
    const halfW = size.width / 2;
    const halfH = size.height / 2;
    const x = halfW + 20;
    const y = Math.random() * size.height - halfH;

    enemy.setPosition(x, y, 0);
    enemy.active = true;

    // =========================
    // init enemy HP
    // =========================
    const comp = enemy.getComponent(EnemyComponent);
    if (comp) {
      comp.hp = 100;
      comp.maxHp = 100;
      comp.isDead = false;
    }

    ECSWorld.instance.enemies.push(enemy);

    console.log("Spawn OK");
    console.log("Enemy count:", ECSWorld.instance.enemies.length);
  }
}