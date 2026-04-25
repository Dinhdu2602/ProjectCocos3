

import { _decorator, Component, Prefab, instantiate, Vec3, Node } from "cc";
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
  private interval = 2;
  
  onLoad() {
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
    console.log("SpawnSystem running");
  }

  spawnEnemy() {
    const enemy = new Node("Enemy");

    const comp = enemy.addComponent(EnemyComponent);
    //console.log("EnemyComponent: ", comp);
    comp.hp = 100;
    enemy.setPosition(Math.random() * 800 - 400, Math.random() * 600 - 300, 0);

    this.enemyLayer.addChild(enemy);
    ECSWorld.instance.enemies.push(enemy);
    console.log("Spawn OK");
    console.log("Enemy count:", ECSWorld.instance.enemies.length);

    setTimeout(() => {
        if (!enemy || !enemy.isValid) return;
         if (GameManager.instance.state !== GameState.PLAYING) return;

        console.log("FAKE KILL ENEMY");

        comp.hp = 0;
    }, 5000);
  }
}
