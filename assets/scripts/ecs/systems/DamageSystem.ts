import { _decorator, Component } from "cc";
import { ECSWorld } from "../core/ECSWorld";
import { EnemyComponent } from "../components/EnemyComponent";
import { eventEmitter } from "../../core/EventEmitter";
import { EVENT } from "../../constants/EventKey";
import { GameState } from "../../core/GameState";
import GameManager from "../../core/GameManager";
import { EnemyConfig } from "../config/EnemyConfig";

const { ccclass } = _decorator;

@ccclass("DamageSystem")
export class DamageSystem extends Component {

  onLoad() {
    eventEmitter.on(EVENT.ENEMY_HIT, this.onEnemyHit, this);
  }

  onDestroy() {
    eventEmitter.off(EVENT.ENEMY_HIT, this.onEnemyHit, this);
  }


  onEnemyHit(data: { enemy: EnemyComponent; damage: number }) {
    const enemy = data.enemy;
    const damage = data.damage;

    if (!enemy || enemy.isDead) return;

    // =========================
    // 1. APPLY DAMAGE
    // =========================
    enemy.hp -= damage;
    if (enemy.hp < 0) enemy.hp = 0;

    console.log("ENEMY TAKE DAMAGE:", damage, "HP:", enemy.hp);

    // =========================
    // 2. HP BAR UPDATE
    // =========================
    if (enemy.hpBar && enemy.maxHp > 0) {
      enemy.hpBar.progress = enemy.hp / enemy.maxHp;
    }

    // =========================
    // 3. DAMAGE LABEL
    // =========================
    if (enemy.damageLabel?.node?.isValid) {
      enemy.damageLabel.string = `-${damage}`;
      enemy.damageLabel.node.active = true;

      this.scheduleOnce(() => {
        if (enemy.damageLabel?.node?.isValid) {
          enemy.damageLabel.node.active = false;
        }
      }, 0.25);
    }

    // =========================
    // 4. DIE
    // =========================
    if (enemy.hp <= 0 && !enemy.isDead) {
      enemy.isDead = true;

      console.log("Enemy Die");

      const score = EnemyConfig[enemy.type].score;

      eventEmitter.emit(EVENT.ENEMY_DIE, { score });

      // remove ECS
      const list = ECSWorld.instance.enemies;
      const index = list.indexOf(enemy.node);
      if (index !== -1) {
        list.splice(index, 1);
      }

      enemy.node.destroy();
    }
  }

  update(dt: number) {
    if (GameManager.instance.state !== GameState.PLAYING) return;

    ECSWorld.instance.enemies = ECSWorld.instance.enemies.filter(
      e => e && e.isValid
    );
  }
}