export interface User {
    displayName: string,
    id: string,
    email: string,
    photoUrl: string,
    theme: string,
    darkMode: boolean,
    tickInterval: number,
    tickers: string[]
    //This is where we're going to put notif stuff, but we need to figure out how to organize that first
}

export type DataObject = {
    symbol: string
    currentValue: number
}

export interface LiveData {
    'response-type': string,
    data: DataObject[]
}

export type HistoricalDataObject = {
    timestamp: string,
    open: number,
    high: number,
    low: number,
    close: number
}

export type HistoricalStockObject = {
    symbol: string
    data: HistoricalDataObject[]
}

export interface HistoricalData {
    'response-type': string,
    data: HistoricalStockObject[]
}

export interface ListData {
    'response-type': string,
    symbols: string[]
}

export interface NewsData {
    ticker: string,
    newsUrl: string,
    newsHeadline: string,
    newsImg: string
}