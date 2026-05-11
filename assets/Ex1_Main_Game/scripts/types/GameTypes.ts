export interface JoinGameResponse {
    mainBet: string;
    jackpot: Record<string, number>;
    wallet: number;
}

export interface BetLevel {
    betId: string;
    totalBet: number;
    betDenom: number;
}

export interface SpinResponse {
    betId: string;
    matrix: number[];
    winAmount: number;
}