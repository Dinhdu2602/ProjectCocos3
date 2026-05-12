import { _decorator, Component, Label, Button } from "cc";

import { GameEventManager } from "./core/GameEventManager";

//import { formatMoney } from './utils/utils';

import { BetLevel } from "./types/GameTypes";
import { GameDirector } from "./core/GameDirector";

import * as utils from "./utils/utils";

const { ccclass, property } = _decorator;

@ccclass("MainUI")
export class MainUI extends Component {
  @property(Label)
  walletLabel: Label = null;

  @property(Label)
  jackpotLabel: Label = null;

  @property(Label)
  betTotalLabel: Label = null;

  @property(Label)
  creditLabel: Label = null;

  @property(Label)
  betSizeLabel: Label = null;

  @property(Label)
  winAmountLabel: Label = null;

  @property(Button)
  btnPlus: Button = null;

  @property(Button)
  btnMinus: Button = null;

  @property(Button)
  btnSpin: Button = null;

  @property(GameDirector)
  gameDirector: GameDirector = null!;

  private eventManager: GameEventManager = null;

  private wallet = 0;


  private currentBetIndex = 0;

  private betLevels: BetLevel[] = [];

  private jackpotValues: number[] = [];

  onLoad() {
    console.log("MAIN UI LOADED");
    this.eventManager = this.node.parent.getComponent(GameEventManager);
    console.log("EVENT MANAGER: ", this.eventManager);
    this.eventManager.on("JOIN_GAME_SUCCESS", this.onJoinGameSuccess, this);
    this.eventManager.on("SPIN_FINISHED", this.onSpinFinished, this);
    this.disableButtons();
  }

  onDestroy() {
    this.eventManager?.off("JOIN_GAME_SUCCESS", this.onJoinGameSuccess, this);
    this.eventManager?.off("SPIN_FINISHED", this.onSpinFinished, this);
  }

  disableButtons() {
    this.btnPlus.interactable = false;
    this.btnMinus.interactable = false;
    this.btnSpin.interactable = false;
  }

  enableButtons() {
    this.btnSpin.interactable = true;
    this.updateButtonState();
  }

  updateButtonState() {
    this.btnMinus.interactable = this.currentBetIndex > 0;
    this.btnPlus.interactable =
      this.currentBetIndex < this.betLevels.length - 1;
  }

  onJoinGameSuccess(data) {
    console.log("JOIN_GAME_SUCCESS", data);
    this.parseMainBet(data.mainBet);
    this.wallet = data.wallet;
    this.jackpotValues = Object.keys(data.jackpot).map(
      (key) => data.jackpot[key],
    );
    this.currentBetIndex = 0;
    this.updateAll();
    this.enableButtons();
  }

  parseMainBet(mainBet: string) {
    this.betLevels = mainBet.split(",").map((item) => {
      const [betId, totalBet] = item.split(";");
      const value = Number(totalBet);
      return {
        betId,
        totalBet: value,
        betDenom: value / 25,
      };
    });
  }

  updateAll() {
    this.updateUI();
    this.updateButtonState();
  }
  updateUI() {
    console.log(
      this.walletLabel,
      this.jackpotLabel,
      this.betTotalLabel,
      this.creditLabel,
      this.betSizeLabel,
    );
    const bet = this.betLevels[this.currentBetIndex];
    //this.walletLabel.string = "$" + formatMoney(this.wallet);
    utils.tweenMoney(
      this.walletLabel,
      0.6,
      this.wallet,
      { acceptRunDown: true },
      (value) => "$" + utils.formatMoney(value),
    );
    //this.jackpotLabel.string = "$" + formatMoney(this.jackpotValues[this.currentBetIndex]);
    utils.tweenMoney(
      this.jackpotLabel,
      0.6,
      this.jackpotValues[this.currentBetIndex],
      { acceptRunDown: true },
      (value) => "$" + utils.formatMoney(value),
    );
    //this.betTotalLabel.string = "$" + formatMoney(bet.totalBet);
    utils.tweenMoney(
      this.betTotalLabel,
      0.6,
      bet.totalBet,
      { acceptRunDown: true },
      (value) => "$" + utils.formatMoney(value),
    );
    this.creditLabel.string = "25 Credits";
    //this.betSizeLabel.string = "$" + formatMoney(bet.betDenom);
    utils.tweenMoney(
      this.betSizeLabel,
      0.6,
      bet.betDenom,
      { acceptRunDown: true },
      (value) => "$" + utils.formatMoney(value),
    );
    
  }

  onClickPlus() {
    if (this.currentBetIndex < this.betLevels.length - 1) {
      this.currentBetIndex++;
      this.updateAll();
    }
  }

  onClickMinus() {
    if (this.currentBetIndex > 0) {
      this.currentBetIndex--;
      this.updateAll();
    }
  }

  onClickSpin() {
    this.disableButtons();
    const currentBet = this.betLevels[this.currentBetIndex];
    this.wallet -= currentBet.totalBet;
    this.updateUI();
    this.gameDirector.sendSpinRequest(currentBet.betId);
  }

  onSpinFinished(data: any) {
    console.log("SPIN_FINISHED:", data);

    const winAmount = data.winAmount;

    //this.winAmountLabel.string = "$" + utils.formatMoney(winAmount);
    utils.tweenMoney(
      this.winAmountLabel,
      0.6,
      winAmount,
      { acceptRunDown: true },
      (value) => "Amount: $" + utils.formatMoney(value),
    );

    this.wallet += winAmount;

    this.updateUI();

    this.enableButtons();
  }
}
