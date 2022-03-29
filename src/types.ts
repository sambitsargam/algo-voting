export type Team = {
    Name: string,
    Total: number,
}

export type Dapp = {
    Id: number,
    Team1: Team,
    Team2: Team,
    Winner: string,
    Escrow: string,
    LimitDate: number,
    EndDate: number,
}

export type Account = {
    address: string,
    short: string,
}

export type DappLocalState = {
    dapp: Dapp;
    Team: string,
    Bet: number,
    account: Account,
}
