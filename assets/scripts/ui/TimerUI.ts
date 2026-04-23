import { _decorator, Component, Label } from 'cc';
import { TimerSystem } from '../systems/TimerSystem';

const { ccclass, property } = _decorator;

@ccclass('TimerUI')
export class TimerUI extends Component {

    @property(Label)
    label: Label = null!;

    @property(TimerSystem)
    timerSystem: TimerSystem = null!;

    update() {
        if (!this.timerSystem) return;

        const time = Math.ceil(this.timerSystem.getTime());
        this.label.string = time.toString();
    }
}

