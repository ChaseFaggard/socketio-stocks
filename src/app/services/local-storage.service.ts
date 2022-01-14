import { Injectable } from '@angular/core';
import { HistoricalData, HistoricalStockObject, NewsData, User } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Saves a key - value pair to local storage
  save = (key: string, value: string) => localStorage.setItem(key, value)

  // Gets a value from local storage from a key
  get = (key: string): string | null => localStorage.getItem(key)

  // Checks if a key exist in local storage
  has = (key: string): boolean => localStorage[key]

  // Saves a user to local storage
  saveUser = (user: User | null): void => { this.save('user', JSON.stringify(user)) }

  //saveHistorical = ()

  // Retrieves a user from local storage
  getUser = (): User | null => {
    const user: string | null = this.get('user')
    if (user) return JSON.parse(user)
    return null
  }

  // Checks if a user exist in local storage
  hasUser = (): boolean => this.has('user')


  //Take allll of the pieces that check for a user, and just replace it with historical data! ez pz
  saveHistorical = (data: HistoricalStockObject[]): void => { this.save('historical', JSON.stringify(data)) }

  hasHistorical = (): boolean => this.has('historical')

  getHistorical = (): HistoricalStockObject[] | null => {
    const data: string | null = this.get('historical')
    if (data) return JSON.parse(data)
    return null
  }

  //Take alllll of the pieces for check a user, add a parameter for what ticker we're saving data for, and bam! ez pz gg no re
  saveNews = (tickerNews: NewsData): void => { this.save(`${tickerNews.ticker}-news`, JSON.stringify(tickerNews)) }

  hasNews = (ticker:string):boolean => this.has(`${ticker}-news`)

  getNews = (ticker:string): NewsData | null => {
    const data: string | null = this.get(`${ticker}-news`)
    if (data) return JSON.parse(data)
    return null
  }
}
