import { EventTarget } from "cc";
export default class EventManager {
  private static _instance: EventManager;
  private eventTarget = new EventTarget();

  public static get instance(): EventManager {
    if (!this._instance) {
      this._instance = new EventManager();
    }
    return this._instance;
  }

  on(event: string, callback: (...args: any[]) => void, target?: any) {
    this.eventTarget.on(event, callback, target);
  }

  off(event: string, callback: (...args: any[]) => void, target?: any) {
    this.eventTarget.off(event, callback, target);
  }

  emit(event: string, data?: any) {
    this.eventTarget.emit(event, data);
  }
}
