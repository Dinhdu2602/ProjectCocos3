import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('ButtonQuit')
export class ButtonQuit extends Component {

    onClick() {
        console.log("CLICK QUIT (Setting)");
        eventEmitter.emit(EVENT.EXIT_TO_LOBBY);
    }
}