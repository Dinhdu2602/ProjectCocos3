import { _decorator, Component, Prefab, instantiate, Vec3, Node } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";

const { ccclass, property } = _decorator;

@ccclass("SpawnSystem")
export class SpawnSystem extends Component {
  @property(Prefab)
  enemyPrefab: Prefab = null!;

  @property(Node)
  enemyLayer: Node = null!;

  private timer = 0;
  private interval = 2;

  onEnable() {
    console.log("SpawnSystem ENABLED");
  }

  onDisable() {
    console.log("SpawnSystem DISABLED");
  }

  update(dt: number) {
    //console.log("SpawnSystem running");
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

    enemy.setPosition(Math.random() * 800 - 400, Math.random() * 600 - 300, 0);

    this.enemyLayer.addChild(enemy);
    ECSWorld.instance.enemies.push(enemy);
    console.log("Spawn OK");
    console.log("Enemy count:", ECSWorld.instance.enemies.length);
    this.timer = 0;
  }
}
