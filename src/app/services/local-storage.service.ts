import { Injectable } from '@angular/core';
import { User } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Saves a key - value pair to local storage
  save = (key: string, value: string) => localStorage.setItem(key, value)

  // Gets a value from local storage from a key
  get = (key: string): string|null => localStorage.getItem(key)

  // Checks if a key exist in local storage
  has = (key: string): boolean => localStorage[key]

  // Saves a user to local storage
  saveUser = (user: User|null): void => { this.save('user', JSON.stringify(user)) }

  //saveHistorical = ()

  // Retrieves a user from local storage
  getUser = (): User|null => {
    const user: string|null = this.get('user')
    if(user) return JSON.parse(user)
    return null
  }

  // Checks if a user exist in local storage
  hasUser = (): boolean => this.has('user')
}
