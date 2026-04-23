import { _decorator, Component, Button } from 'cc';
import  { eventEmitter}  from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass, property } = _decorator;

@ccclass('StartButton')
export class StartButton extends Component {

    @property(Button)
    button: Button = null!;

    start() {
        this.button.node.on(Button.EventType.CLICK, this.onClickStart, this);
    }

    onDestroy() {
        this.button.node.off(Button.EventType.CLICK, this.onClickStart, this);
    }

    private onClickStart() {
        console.log("[UI] Click Start");

        eventEmitter.emit(EVENT.GAME_START);
    }
}