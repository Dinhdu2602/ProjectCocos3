import { _decorator, Component } from 'cc';
import { eventEmitter } from '../../core/EventEmitter';
import { EVENT } from '../../constants/EventKey';

const { ccclass } = _decorator;

@ccclass('ButtonLogout')
export class ButtonLogout extends Component {

    onClick() {
        console.log("CLICK LOGOUT");
        eventEmitter.emit(EVENT.EXIT_TO_LOBBY);
    }
}