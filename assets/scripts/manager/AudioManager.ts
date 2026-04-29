import { _decorator, Component, AudioSource, AudioClip } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export default class AudioManager extends Component {
  public static instance: AudioManager;

  @property(AudioSource)
  bgmSource: AudioSource = null!;

  @property(AudioSource)
  sfxSource: AudioSource = null!;

  @property(AudioClip)
  bgmClip: AudioClip = null!;

  @property(AudioClip)
  clickClip: AudioClip = null!;

  @property(AudioClip)
  coinClip: AudioClip = null!;

  private bgmVolume: number = 1;
  private sfxVolume: number = 1;

  onLoad() {
    if (AudioManager.instance) {
      this.destroy();
      return;
    }
    AudioManager.instance = this;
  }

  // ===== BGM =====
  playBGM() {
    if (!this.bgmSource || !this.bgmClip) return;

    this.bgmSource.clip = this.bgmClip;
    this.bgmSource.loop = true;
    this.bgmSource.volume = this.bgmVolume;
    this.bgmSource.play();
  }

  stopBGM() {
    this.bgmSource.stop();
  }

  setBGMVolume(value: number) {
    this.bgmVolume = value;

    if (this.bgmSource) {
      this.bgmSource.volume = value;

      if (value <= 0) {
        this.bgmSource.pause();
      } else {
        if (!this.bgmSource.playing) {
          this.bgmSource.play();
        }
      }
    }
  }

  // ===== SFX =====
  playClick() {
    this.playSFX(this.clickClip);
  }

  playCoin() {
    this.playSFX(this.coinClip);
  }

  playSFX(clip: AudioClip) {
    if (!clip || this.sfxVolume <= 0) return;
    this.sfxSource.playOneShot(clip, this.sfxVolume);
  }

  setSFXVolume(value: number) {
    this.sfxVolume = value;

    if (this.sfxSource) {
        this.sfxSource.volume = value;
    }
  }
}
