import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('ButtonExit')
export class ButtonExit extends Component {

    onClick() {
        console.log("CLICK EXIT (Pause)");
        eventEmitter.emit(EVENT.EXIT_TO_LOBBY);
    }
}
