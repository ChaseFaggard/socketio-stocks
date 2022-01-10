import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private logs: string[] = [] // List of all logs

  private logInProduction: boolean = false // Set to true if you want console logs in production

  constructor() { }

  log = (message: any): void => {
    if(environment.production == false || this.logInProduction == true) console.log(message)
    this.logs.push(message)
  }

  logAll = (): void => { for(let log of this.logs) console.log(log) }

}
