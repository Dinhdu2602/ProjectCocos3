# **SOFTWARE REQUIREMENT SPECIFICATION(SRS)**
# **PROJECT: HERO SURVIVAL**
# 1. GIỚI THIỆU
## 1.1 Mục tiêu
Tài liệu này mô tả toàn bộ yêu cầu chức năng và phi chức năng của game demo **Hero Survival**, nhằm:

- Làm khung phát triển game
- Giúp dễ maintain, debug
- Định hướng mở rộng sau này
-------
## 1.2 Mô tả tổng quan
Hero Survival là game:

- Thể loại: Top-down Survival Shooter
- Nền tảng: Desktop/Web
- Engine: Cocos Creator 3.7.3

Người chơi:

- Điều khiển nhân vật
- Tiêu diệt quái
- Sống sót trong thời gian giới hạn
------------
# 2. TỔNG QUAN HỆ THỐNG
## 2.1 Kiến trúc tổng thể
Hệ thống chia thành các module chính:

- `Core System (quản lí game)`
- `Gameplay System`
- `UI System`
- `Event System`

Hệ thống sử dụng:

- `Component-based architecture (ECS mindset)`
- `Event-driven communication giữa các module`
-----------
## 2.2 Luồng game

1. Người chơi vào `Lobby`
2. Nhấn `Start` -> vào `Playing`
3. Trong `Playing`:
        
    - Di chuyển
    - Bắn
    - Tiêu diệt quái
4. Khi: 
    - Hết thời gian hoặc chết -> `Result`
5. Người chơi:
    - `Replay` hoặc về `Lobby`
---------------
# 3. GAMEPLAY REQUIREMENTS
## 3.1 Điều khiển nhân vật
**Input**

|Phím	|Chức năng|
|------------|-------------|
|W|Di chuyển lên|
|S|Di chuyển xuống|
|A|	Di chuyển trái|
|D|	Di chuyển phải|
|E|	Đổi đạn loại 1|
|R|	Đổi đạn loại 2|
|T|	Đổi đạn loại 3|
------------------
## 3.2 Cơ chế di chuyển
- Nhân vật di chuyển theo 4 hướng
- Có thể di chuyển chéo (W + D, ...)
- Tốc độ di chuyển là `hằng số`
- Không được vượt ra khỏi màn hình
------------
## 3.3 Cơ chế bắn
- Nhân vật tự đông bắn hoặc bắn theo input
- Đạn được spawn từ vị trí nhân vật
- Bay theo hướng xác định
-----------
## 3.4 Hệ thống đạn
Game có nhiều loại đạn:
**Bullet loại 1 (Normal)**

- Gây damage cơ bản
- Biến mất khi trúng enemy

**Bullet loại 2 (Pierce)**

- Xuyên qua nhiều enemy
- Giảm damage theo số lần xuyên (optional)

**Bullet loại 3 (Explosive)**

- Gây damage diện rộng
- Có hiệu ứng nổ
---------
## 3.5 Hệ thống quái
**Các loại quái:**

**Enemy loại A (Chaser)**
 
 - Di chuyển về phía player

**Enemy loại B (Ranger)**

 - Giữ khoảng cách với player
 - Chỉ tấn công khi trong range

**Enemy loại C (Kamikaze)**

 - Di chuyển nhanh
 - Tấn công trực tiếp
-----------
## 3.6 Cơ chế gây damage
 - `Bullet` trúng `Enemy` -> trừ HP `Enemy`
 - `Enemy` chạm `Player` -> trừ HP `Player`
 - Khi HP = 0:

    - `Entity` bị destroy
-----------
## 3.7 Hệ thống thời gian
 - Mỗi màn có thời gian giới hạn
 - Hiển thị bằng `UI Timer`
 - Khi hết thời gian:

    - Kết thúc game
    - Chuyển sang màn `Result`
-----------
## 3.8 Hệ thống điểm
 - Tiêu diệt `Enemy` -> Cộng điểm
 - Điểm hiển thị trên UI
-----------
# 4. SYSTEM REQUIREMENTS:
## 4.2 Event System
- Hệ thống sử dụng EventEmitter để giao tiếp giữa các module lớn

**Ví dụ event:**

- Game Start
- Game Over
- Enemy Die
- Player Hit
----------
## 4.3 Room System
Room là module trung tâm:

- Quản lý state 
- Quản lý timer
- Gửi event đến các `Layer`
-----------
## 4.4 Timer System
- Nhận event từ `Room`
- Đếm thời gian
- Gửi event khi hết thời gian
-----------
#  5. UI & LAYER ARCHITECTURE
---

## 5.1 Screen System (Cấp cao nhất)

Game được chia thành các màn hình chính:

### 5.1.1. Loading Screen (Optional nhưng nên có)

* Hiển thị khi load tài nguyên
* Có thể thêm progress bar

---

### 5.1.2. Lobby Screen

Chức năng:

* Bắt đầu game
* Mở setting

Thành phần:

* Nút `Start`
* Nút `Setting`

---

### 5.2.3. Playing Screen

Chức năng:

* Hiển thị gameplay
* Chứa toàn bộ game runtime

---

### 5.2.4. Result Screen

Chức năng:

* Hiển thị kết quả game

Thành phần:

* Score
* Nút `Replay`
* Nút `Exit`

---

## 5.2 Layer System (Bên trong Playing Screen)

Playing Screen được chia thành các layer riêng biệt:

```
Game Layer (Root)
│
├── MapLayer
├── PlayerLayer
├── EnemyLayer
├── BulletLayer
├── EffectLayer
└── UILayer (HUD)
```

---

### MapLayer

* Chứa background
* Có thể mở rộng: map scrolling

---

### PlayerLayer

* Chứa Player
* Quản lý hiển thị và position Player

---

###  EnemyLayer

* Chứa tất cả Enemy
* Spawn / destroy Enemy

---

###  BulletLayer

* Chứa toàn bộ Bullet
* Quản lý vòng đời Bullet

---

###  EffectLayer

* Hiệu ứng:

  * Explosion
  * Hit effect
  * Screen shake (visual)

---

###  UILayer (HUD)

Hiển thị:

* HP Player
* Timer
* Score

---

## 5.3 Popup Layer (Global Layer)

Popup không thuộc riêng Screen nào:

### Popup Layer

* Luôn nằm trên cùng
* Dùng cho:

  * Setting Popup
  * Result Popup
  * Pause Popup (optional)

---

## 5.4 Popup System

### Setting Popup

* Bật/Tắt sound
* Có thể thêm: volume

---

### Result Popup (nếu không dùng riêng Screen)

* Hiển thị Score
* Nút Replay
* Nút Exit

---

# 6. GAME STATE SYSTEM

---

## 6.1 Global Game State

| State   | Mô tả                 |
| ------- | --------------------- |
| LOADING | Load tài nguyên       |
| LOBBY   | Màn hình chính        |
| PLAYING | Đang chơi             |
| PAUSE   | Tạm dừng              |
| RESULT  | Kết quả               |
| EXIT    | Thoát game / về lobby |

---

## 6.2 Transition

* LOADING → LOBBY
* LOBBY → PLAYING
* PLAYING → PAUSE
* PAUSE → PLAYING
* PLAYING → RESULT
* RESULT → PLAYING (Replay)
* RESULT → LOBBY
* PLAYING → EXIT

---

## 6.3 In-Game State (Sub State)

### Player State

| State  | Mô tả     |
| ------ | --------- |
| IDLE   | Đứng yên  |
| MOVE   | Di chuyển |
| ATTACK | Đang bắn  |
| HIT    | Bị trúng  |
| DEAD   | Chết      |

---

### Enemy State

| State  | Mô tả       |
| ------ | ----------- |
| IDLE   | Chưa active |
| MOVE   | Di chuyển   |
| ATTACK | Tấn công    |
| HIT    | Bị trúng    |
| DEAD   | Chết        |

---

### Bullet State

| State   | Mô tả          |
| ------- | -------------- |
| SPAWN   | Vừa tạo        |
| FLY     | Đang bay       |
| HIT     | Trúng mục tiêu |
| DESTROY | Biến mất       |

---

# 7. SYSTEM RESPONSIBILITY (RẤT QUAN TRỌNG)

---

## 7.1 Player System

* Xử lý input
* Di chuyển
* Bắn
* Quản lý HP

---

## 7.2 Enemy System

* AI di chuyển
* Tấn công
* Nhận damage

---

## 7.3 Bullet System

* Spawn bullet
* Di chuyển bullet
* Detect collision

---

## 7.4 Damage System

* Tính damage
* Áp dụng damage

---

## 7.5 Spawn System

* Sinh enemy theo thời gian

---

## 7.6 UI System

* Cập nhật HP
* Cập nhật score
* Cập nhật timer

---

## 7.7 Room / Game Manager

Đóng vai trò trung tâm:

* Quản lý state
* Dispatch event
* Điều phối các system

---

# 8. DESIGN RULES (RẤT QUAN TRỌNG)

---

## 8.1 Layer Rule

* Mỗi layer chỉ chứa 1 loại entity
* Không xử lý logic nặng trong layer
* Layer chỉ dùng để tổ chức scene

---

## 8.2 State Rule

* Không viết logic trực tiếp trong state
* State chỉ dùng để điều hướng flow

---

## 8.3 Event Rule

* System lớn → dùng event
* Object nhỏ → gọi trực tiếp

---

## 8.4 Separation Rule

* Player không biết Enemy
* Enemy không biết UI
* Tất cả giao tiếp qua system/event

---

#  9. GHI CHÚ KIẾN TRÚC

* Layer = tổ chức hiển thị
* Screen = tổ chức UI
* State = tổ chức logic

=> Ba thứ này phải tách biệt hoàn toàn

---

# 6. SOUND REQUIREMENTS
## 6.1 Sound Effect 
 - Bắn
 - Trúng
 - Enemy chết
---------
## 6.2 Background Music
 - Lobby 
 - Gameplay
--------
## 6.3 Setting
 - Cho phép bật/tắt sound
---------
# 7. UNIQUE FEATURES
## 7.1 Hệ thống đổi đạn (Bullet Swap):
 - Người chơi đổi đạn bằng phím `E, R, T`
 - Mỗi loại tạo gameplay khác nhau
---------
## 7.2 Combo System
 - Bắn liên tục -> Tăng `Damage`
 - Miss -> Reset combo
---------
## 7.3 Hit Feedback
 - Enemy bị hit -> flash
 - Player bị hit -> rung màn hình
---------
## 7.4 Event-driven Design
 - `Room` phát eventevent -> Các module nhận
 - Giảm phụ thuộc giữa các hệ thống
---------
# 8. NON-FUNCTIONAL REQUIREMENTS
## 8.1 Code Quality:
- Code phải dễ đọc, dễ hiểu
- Không viết tắt tên biến
- `Function` chỉ làm một nhiệm vụ
---------
## 8.2 Performance:
- Game chạy mượt **(>= 60 FPS)**
- Hạn chế draw call
- Tối ưu `Prefab` và `Sprite`
---------
## 8.3 Maintainability
- Code tách module rõ ràng
- Dễ thêm tính năng mới
---------
# 9. FUTURE EXTENSION:
- Skill System
- Boss
- Upgrade weapon
- Multiplayer
--------
# 10. SEQUENCE FLOW (RUNTIME FLOW)

## 10.1 Flow: Player Attack → Enemy Damage

### Mô tả:

Luồng xử lý khi player tấn công và gây damage lên enemy.

### Trình tự:

1. `Player` đang ở trạng thái `PLAYING`

2. `Player` thực hiện hành động bắn

3. Hệ thống tạo `Bullet` tại vị trí `Player`

4. `Bullet` được gán:

   * **Hướng bay**
   * **Tốc độ**
   * **Damage**

5. `Bullet` di chuyển mỗi frame

6. Khi `Bullet` va chạm `Enemy`:

   * Xác định `Enemy` bị trúng
   * Gửi yêu cầu xử lý damage

7. Damage System xử lý:

   * Trừ HP của `Enemy`
   * Kiểm tra HP còn lại

8. Nếu `Enemy` còn HP:

   * `Enemy` tiếp tục hành vi

9. Nếu `Enemy` hết HP:

   * `Enemy` bị destroy
   * Gửi event `"Enemy Die"`

10. `UI System` nhận event:

* Cập nhật `Score`
* Hiển thị hiệu ứng

---

## 10.2 Flow: Enemy Attack → Player Damage

### Trình tự:

1. `Enemy` phát hiện `Player` trong phạm vi

2. `Enemy` thực hiện hành động tấn công

3. Khi `Enemy` chạm `Player`:

   * Gửi yêu cầu gây damage

4. `Damage System`:

   * Trừ HP `Player`
   * Kiểm tra HP

5. Nếu `Player` còn sống:

   * Cập nhật UI HP

6. Nếu `Player` chết:

   * Gửi event `"Game Over"`
   * Chuyển state → `RESULT`

---

## 10.3 Flow: Game Start

1. Người chơi ở màn `Lobby`

2. Nhấn nút `Start`

3. `Room` nhận event `Start`

4. `Room:`

   * Reset dữ liệu game
   * Reset `Player`
   * Reset `Enemy`
   * Reset `Score`

5. Chuyển state → `PLAYING`

6. Timer System:

   * Bắt đầu đếm thời gian

7. Spawn System:

   * Bắt đầu spawn `Enemy`

---

## 10.4 Flow: Game Over (Time Up)

1. `Timer` đạt 0

2. `Timer System` gửi event `"Time Up"`

3. `Room` nhận event:

   * Dừng gameplay
   * Dừng spawn

4. Chuyển state → `RESULT`

5. UI:

   * Hiển thị `Result Screen`
   * Hiển thị `Score`

---

## 10.5 Flow: Replay

1. Người chơi nhấn `Replay`

2. `Room` nhận event

3. Reset toàn bộ:

   * `Player`
   * `Enemy`
   * `Bullet`
   * `Timer`
   * `Score`

4. Chuyển state → `PLAYING`

---

## 10.6 Flow: Exit về Lobby

1. Người chơi nhấn `Exit`

2. `Room` nhận event

3. `Clear` toàn bộ dữ liệu:

   * Destroy tất cả entity
   * Reset state

4. Chuyển state → `LOBBY`

---

## 10.7 Flow: Swap Bullet

1. Người chơi nhấn phím `(E / R / T)`

2. `Player` nhận input

3. `Player`:

   * Thay đổi loại đạn hiện tại

4. Các `Bullet` spawn sau đó:

   * Sử dụng loại đạn mới

---

## 10.8 Flow: Combo System

1. `Player` bắn trúng `Enemy` liên tục

2. `Combo` tăng dần

3. Khi đạt threshold:

   * Tăng damage

4. Nếu miss:

   * Reset combo

---

# 11. DATA TABLE (GAME BALANCE)

---

## 11.1 Player Data

| Thuộc tính   | Giá trị     |
| ------------ | ----------- |
| Max HP       | 100         |
| Move Speed   | 200         |
| Attack Speed | 0.5s / shot |
| Damage       | 10          |

---

## 11.2 Bullet Data

### Bullet Normal

| Thuộc tính | Giá trị |
| ---------- | ------- |
| Speed      | 600     |
| Damage     | 10      |
| Life Time  | 2s      |
| Pierce     | No      |

---

### Bullet Pierce

| Thuộc tính | Giá trị         |
| ---------- | --------------- |
| Speed      | 500             |
| Damage     | 8               |
| Life Time  | 3s              |
| Pierce     | Yes (3 targets) |

---

### Bullet Explosive

| Thuộc tính | Giá trị |
| ---------- | ------- |
| Speed      | 450     |
| Damage     | 11      |
| Radius     | 100     |
| Life Time  | 2s      |

---

## 11.3 Enemy Data

### Enemy A (Chaser)

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| HP           | 30      |
| Speed        | 110     |
| Damage       | 10      |
| Attack Range | 20      |

---

### Enemy B (Ranger)

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| HP           | 50      |
| Speed        | 80      |
| Damage       | 8       |
| Attack Range | 150     |

---

### Enemy C (Kamikaze)

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| HP           | 20      |
| Speed        | 200     |
| Damage       | 15      |
| Attack Range | 10      |

---

## 11.4 Game Config

| Thuộc tính          | Giá trị |
| ------------------- | ------- |
| Game Duration       | 60s     |
| Spawn Interval      | 2s      |
| Max Enemy On Screen | 20      |

---

## 11.5 Combo System

| Level | Hits Required | Damage Bonus |
| ----- | ------------- | ------------ |
| 1     | 3             | +10%         |
| 2     | 6             | +20%         |
| 3     | 10            | +30%         |

---

## 11.6 Score System

| Action       | Score |
| ------------ | ----- |
| Kill Enemy A | +10   |
| Kill Enemy B | +20   |
| Kill Enemy C | +30   |

---

#  12. GHI CHÚ THIẾT KẾ

* Data Table có thể điều chỉnh để balance game
* Có thể tách thành config file sau này
* Sequence Flow dùng để debug logic runtime

---
# 13. KẾT LUẬN
Tài liệu này là nền tảng để:
    
- Phát triển game
- Debug hệ thống
- Mở rộng tính năng

Game được thiết kế theo hướng:

- Rõ ràng
- Có tổ chức
- Có khả năng scale


