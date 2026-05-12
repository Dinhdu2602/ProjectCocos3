import { _decorator, Component, Sprite, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Symbol')
export class Symbol extends Component {

    @property(Sprite)
    icon: Sprite = null;

    private symbolId = 0;

    setSymbol(id: number, frame: SpriteFrame){
        this.symbolId = id;
        this.icon.spriteFrame = frame;
    }
    
    getId() {
        return this.symbolId;
    }
}

