import { _decorator, Component, Slider } from 'cc';
import AudioManager from '../manager/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('SettingPopup')
export class SettingPopup extends Component {

    @property(Slider)
    bgmSlider: Slider = null!;

    @property(Slider)
    sfxSlider: Slider = null!;

    onLoad() {
    
        this.bgmSlider.progress = 1;
        this.sfxSlider.progress = 1;

        this.registerEvent();
    }

    registerEvent() {
        this.bgmSlider.node.on('slide', this.onBGMChange, this);
        this.sfxSlider.node.on('slide', this.onSFXChange, this);
    }

    private onBGMChange(slider: Slider) {
        const value = slider.progress; // 0 → 1

        console.log("BGM:", value);

        AudioManager.instance.setBGMVolume(value);
    }

    private onSFXChange(slider: Slider) {
        const value = slider.progress;

        console.log("SFX:", value);

        AudioManager.instance.setSFXVolume(value);
    }
}