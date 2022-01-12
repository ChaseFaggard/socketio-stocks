export interface User {
    displayName: string,
    id: string,
    email:string,
    photoUrl: string,
    theme:string,
    darkMode:boolean,
    tickInterval:number,
    tickers: string[]
    //This is where we're going to put notif stuff, but we need to figure out how to organize that first
}