import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerSystem')
export class PlayerSystem extends Component {

    @property(Node)
    playerNode: Node = null!;

    private speed: number = 300;

    private direction: Vec3 = new Vec3(0, 0, 0);

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.direction.y = 1;
                break;
            case KeyCode.KEY_S:
                this.direction.y = -1;
                break;
            case KeyCode.KEY_A:
                this.direction.x = -1;
                break;
            case KeyCode.KEY_D:
                this.direction.x = 1;
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this.direction.y = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this.direction.x = 0;
                break;
        }
    }

    update(deltaTime: number) {
        if (this.direction.length() > 0) {

            const dir = this.direction.clone().normalize();

            const move = new Vec3(
                dir.x * this.speed * deltaTime,
                dir.y * this.speed * deltaTime,
                0
            );

            this.playerNode.setPosition(
                this.playerNode.position.clone().add(move)
            );
        }
    }
}
