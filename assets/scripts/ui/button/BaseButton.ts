import { _decorator, Component, Button } from 'cc';
import AudioManager from '../../manager/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('BaseButton')
export class BaseButton extends Component {

    @property(Button)
    button: Button = null!;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    onDestroy() {
        this.button.node.off(Button.EventType.CLICK, this.onClick, this);
    }

    private onClick() {
        AudioManager.instance.playClick(); 
    }
}