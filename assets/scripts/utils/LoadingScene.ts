import { _decorator, Component, ProgressBar, Label, director } from 'cc';
import { eventEmitter } from '../core/EventEmitter';
import { EVENT } from '../constants/EventKey';
import { GameState } from '../core/GameState';
const { ccclass, property } = _decorator;

type Segment = {
    from: number;
    to: number;
    duration: number;
};
    
@ccclass('LoadingScene')
export class LoadingScene extends Component {
    @property(ProgressBar)
    loadingProgress: ProgressBar | null = null;

    @property(Label)
    labelLoading: Label | null = null;

    @property
    minStepTime = 0.3;

    @property
    maxStepTime = 1.0;

    @property
    gatePercent = 0.92;

    private _segments: Segment[] = [];
    private _currentSegIdx = 0;
    private _segTime = 0;

    private _displayProgress = 0;
    private _realProgress = 0;
    private _realDone = false;

    onLoad() {
        this._buildSegments();
    }

    onEnable(): void {
        this._resetState();
        this._buildSegments();
        this._render();
    }

    private _resetState() {
        this._currentSegIdx = 0;
        this._segTime = 0;

        this._displayProgress = 0;
        this._realProgress = 0;
        this._realDone = false;
    }

    public setRealProgress(p: number) {
        this._realProgress = Math.max(0, Math.min(1, p));
        if (this._realProgress >= 1) {
            this._realDone = true;
        }
    }

    private _buildSegments() {
        const rnd = (a: number, b: number) => a + Math.random() * (b - a);

        this._segments = [
            { from: 0.0, to: 0.3, duration: rnd(this.minStepTime, this.maxStepTime) },
            { from: 0.3, to: 0.6, duration: rnd(this.minStepTime, this.maxStepTime) },
            { from: 0.6, to: this.gatePercent, duration: rnd(this.minStepTime, this.maxStepTime * 1.5) },
            { from: this.gatePercent, to: 1.0, duration: 0.4 },
        ];
    }

    private _easeOutCubic(t: number) {
        return 1 - Math.pow(1 - t, 3);
    }

    private _easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    update(dt: number) {
        if (!this.loadingProgress || !this.labelLoading) return;
        if (this._currentSegIdx >= this._segments.length) return;

        const seg = this._segments[this._currentSegIdx];

        this._segTime += dt;
        const t = Math.min(1, this._segTime / seg.duration);

        const eased = this._currentSegIdx < 2
            ? this._easeOutCubic(t)
            : this._easeInOutQuad(t);

        this._displayProgress = seg.from + (seg.to - seg.from) * eased;

        this._render();

        if (t >= 1) {
            this._currentSegIdx++;
            this._segTime = 0;

            if (this._currentSegIdx >= this._segments.length) {
                this._displayProgress = 1;
                this._render();
                this._onFinish();
            }
        }
    }

    private _render() {
        this.loadingProgress!.progress = this._displayProgress;
        this.labelLoading!.string = `Loading... ${(this._displayProgress * 100).toFixed(0)}%`;
    }

    private _onFinish() {
        this.scheduleOnce(() => {
            // this.node.active = false;
            director.loadScene("sceneDemo");
            eventEmitter.emit(EVENT.GAME_START);
            // eventEmitter.emit(EVENT.SHOW, GameState.START);
        }, 0.2);
    }
}


