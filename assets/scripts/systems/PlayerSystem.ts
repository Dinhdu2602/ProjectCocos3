import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerSystem')
export class PlayerSystem extends Component {

    @property(Node)
    playerNode: Node = null!;

    private moveSpeed: number = 300;

    private inputDirection: Vec3 = new Vec3();

    onLoad() {
        this.registerInput(); 
    }

    onDestroy() {
        this.unregisterInput();
    }

    update(deltaTime: number) {
        this.handleMovement(deltaTime);
    }

    //========== INPUT ===========
    private registerInput() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private unregisterInput() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    private onKeyDown(event: EventKeyboard) {
        this.updateDirection(event.keyCode, true);
    }

    private onKeyUp(event: EventKeyboard) {
        this.updateDirection(event.keyCode, false);
    }

    private updateDirection(keyCode: KeyCode, isPressed: boolean) {
        const value = isPressed ? 1 : 0;
        switch(keyCode) {
            case KeyCode.KEY_W:
                this.inputDirection.y = value;
                break;
            case KeyCode.KEY_S:
                this.inputDirection.y = isPressed ? -1 : 0;
                break;
            case KeyCode.KEY_A:
                this.inputDirection.x = isPressed ? -1 : 0;
                break;
            case KeyCode.KEY_D:
                this.inputDirection.x = isPressed ? 1: 0;
                break;
        }
    }

    //========== MOVEMENT ========
    private handleMovement(deltaTime: number) {
        if (this.inputDirection.length() === 0) return;

        const direction = this.inputDirection.clone().normalize();
        const moveOffset = this.calculateMoveOffset(direction, deltaTime);

        this.applyMovement(moveOffset);
    }

    private calculateMoveOffset(direction: Vec3, deltaTime: number): Vec3 {
        return new Vec3(
            direction.x * this.moveSpeed * deltaTime,
            direction.y * this.moveSpeed * deltaTime,
            0
        );
    }
    
    private applyMovement(offset: Vec3) {
        const newPosition = this.playerNode.position.clone().add(offset);
        this.playerNode.setPosition(newPosition);
    }
}
