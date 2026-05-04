
# Game Design Patterns Documentation  
*Applied for Cocos Creator + ECS Architecture*

---

## Overview

Tài liệu này mô tả các Design Pattern được áp dụng trong dự án game nhằm:

- Giảm coupling giữa các module
- Tăng khả năng mở rộng (scalability)
- Cải thiện maintainability
- Chuẩn hóa kiến trúc hệ thống

---

# 1. Singleton Pattern

## 1.1 Purpose
Đảm bảo một class chỉ có **một instance duy nhất** và cung cấp global access.

---

## 1.2 Definition
Singleton là creational pattern kiểm soát việc khởi tạo object để tránh việc tạo nhiều instance không cần thiết.

---

## 1.3 Applicability
Sử dụng khi:
- Hệ thống chỉ cần một instance duy nhất
- Nhiều module cần truy cập cùng resource
- Cần quản lý global state

---

## 1.4 Structure
- Static instance
- Controlled constructor
- Public access method

---

## 1.5 Implementation

```ts
class GameManager {
    private static _instance: GameManager;

    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    public state: GameState;
}
````

---

## 1.6 Advantages

* Single source of truth
* Dễ truy cập toàn cục
* Tiết kiệm tài nguyên

---

## 1.7 Disadvantages

* Tight coupling
* Khó test
* Khó mở rộng

---

## 1.8 Use in Project

* `GameManager`
* `ECSWorld`
* AudioManager (future)
* InputManager (future)

---

## 1.9 When NOT to use

* Cần nhiều instance
* Cần test độc lập
* Hệ thống cần modular cao

---

# 2. Observer Pattern (Event-driven)

## 2.1 Purpose

Thiết lập giao tiếp giữa các module theo hướng **loose coupling**.

---

## 2.2 Definition

Observer là pattern cho phép một object phát event và nhiều object khác lắng nghe.

---

## 2.3 Applicability

* Nhiều hệ thống cần phản ứng cùng một event
* UI, animation, sound, gameplay logic

---

## 2.4 Structure

* Publisher (Emitter)
* Subscriber (Listener)
* Event channel

---

## 2.5 Implementation

```ts
eventEmitter.emit("PLAYER_HIT", damage);

eventEmitter.on("PLAYER_HIT", this.updateUI, this);
eventEmitter.on("PLAYER_HIT", this.playSound, this);
```

---

## 2.6 Advantages

* Loose coupling
* Dễ mở rộng
* Phù hợp event-driven architecture

---

## 2.7 Disadvantages

* Khó debug
* Có thể memory leak
* Event overload

---

## 2.8 Use in Project

* Collision → Damage
* Damage → UI
* Damage → Sound / Effect

---

## 2.9 When NOT to use

* Logic đơn giản
* Cần flow rõ ràng

---

# 3. Factory Pattern

## 3.1 Purpose

Tách logic tạo object khỏi nơi sử dụng.

---

## 3.2 Definition

Factory cung cấp interface tạo object mà không cần biết class cụ thể.

---

## 3.3 Applicability

* Nhiều loại object cùng type
* Logic tạo phức tạp
* Cần mở rộng

---

## 3.4 Structure

* Factory class
* Product interface
* Concrete product

---

## 3.5 Implementation

```ts
class BulletFactory {
    static create(type: string): Bullet {
        switch(type) {
            case "normal": return new NormalBullet();
            case "explosive": return new ExplosiveBullet();
        }
    }
}
```

---

## 3.6 Advantages

* Dễ mở rộng
* Tách biệt creation logic
* Giảm duplication

---

## 3.7 Disadvantages

* Tăng complexity
* Over-engineering nếu lạm dụng

---

## 3.8 Use in Project

* Spawn enemy
* Spawn bullet
* Item drop

---

## 3.9 When NOT to use

* Chỉ có một loại object
* Logic đơn giản

---

# 4. State Pattern

## 4.1 Purpose

Quản lý hành vi dựa trên trạng thái.

---

## 4.2 Definition

State pattern cho phép object thay đổi hành vi khi state thay đổi.

---

## 4.3 Applicability

* AI behavior
* Game state
* Player state

---

## 4.4 Structure

* State interface
* Concrete states
* Context

---

## 4.5 Implementation

```ts
interface State {
    update(): void;
}

class IdleState implements State {}
class AttackState implements State {}
```

---

## 4.6 Advantages

* Tránh if-else phức tạp
* Dễ mở rộng
* Code rõ ràng

---

## 4.7 Disadvantages

* Nhiều class
* Có thể overkill

---

## 4.8 Use in Project

* Game state (`GameManager`)
* Enemy AI
* Player behavior

---

## 4.9 When NOT to use

* Ít state
* Logic đơn giản

---

# 5. Strategy Pattern

## 5.1 Purpose

Cho phép thay đổi hành vi runtime.

---

## 5.2 Definition

Strategy định nghĩa nhiều thuật toán và cho phép thay đổi linh hoạt.

---

## 5.3 Applicability

* Nhiều cách xử lý cùng hành vi
* Cần thay đổi runtime

---

## 5.4 Structure

* Strategy interface
* Concrete strategies
* Context

---

## 5.5 Implementation

```ts
interface AttackStrategy {
    execute(): void;
}

class FireStrategy implements AttackStrategy {}
class IceStrategy implements AttackStrategy {}
```

---

## 5.6 Advantages

* Tránh if-else
* Dễ mở rộng
* Tách biệt logic

---

## 5.7 Disadvantages

* Tăng số lượng class
* Phức tạp hơn

---

## 5.8 Use in Project

* Bullet type:

  * Normal
  * Pierce
  * Explosion
* Enemy attack type

---

## 5.9 When NOT to use

* Chỉ có một hành vi
* Không cần thay đổi runtime

---

# ECS Architecture

## Purpose

Tách biệt data và logic để tối ưu performance và scalability.

---

## Structure

* Entity → ID
* Component → Data
* System → Logic

---

## Use in Project

* EnemyComponent
* BulletSystem
* CollisionSystem
* DamageSystem

---

## Benefits

* Dễ mở rộng
* Performance tốt
* Phù hợp game real-time

---

# 📊 System Flow (Example)

```
Bullet →
    CollisionSystem →
        DamageSystem →
            EventEmitter →
                UI Update
                Sound
                Effect
```

---

#  Conclusion

Các pattern được áp dụng nhằm:

* Chuẩn hóa kiến trúc
* Giảm phụ thuộc giữa module
* Tăng khả năng mở rộng
* Hỗ trợ phát triển lâu dài

---

# Notes

* Không lạm dụng design pattern
* Luôn chọn pattern dựa trên problem thực tế
* Ưu tiên simplicity trước, sau đó mới đến abstraction

