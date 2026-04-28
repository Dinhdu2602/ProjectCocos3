import { _decorator, Component, Button } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass, property } = _decorator;

@ccclass('ButtonCloseSetting')
export class ButtonCloseSetting extends Component {

    @property(Button)
    button: Button = null!;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    onDestroy() {
        this.button.node.off(Button.EventType.CLICK, this.onClick, this);
    }

    onClick() {
        eventEmitter.emit(EVENT.CLOSE_SETTING);
    }
}
