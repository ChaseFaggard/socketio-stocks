import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public user:User = {
    displayName: '',
    id: '',
    email: '',
    theme: '',
    darkMode: false,
    tickInterval: 0,
    tickers: []
  }

  headers = {
    headers: {
      'Authorization': `Bearer ${environment.M3O_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  constructor(private http:HttpClient, private logger:LoggerService) { 
    console.log(environment.M3O_KEY)
  }

  public async setUser(id:string){
    const users = await this.getUsers();
    this.user = users.find(item => item.id === id)!
  }

  public accessDatabase() {
    const data = { "table": "stonks" }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Read`, data, this.headers).subscribe(
        (res) => {
          //console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public async getUsers() {
    let users: User[] = [];
    try {
      let response: any = await this.accessDatabase();
      users = response.records
    }
    catch (err) {
      this.logger.log(err)
    }
    return users;
  }

  public async updateUser(id:string, param:string, newValue:string|string[]|boolean){
    this.logger.log(`Updating id ${id}'s ${param} parameter with new value ${newValue}`)
    let data = {
      "table" : "stonks",
      "record" : {
        "id" : id,
        [param] : newValue,
      }
    }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Update`, data, this.headers).subscribe(
        (res) => {
          console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public async checkUser(id:string):Promise<boolean>{
    const users = await this.getUsers();
    return users.some(item => item.id == id)
  }
  
  public async generateUser(id: string, name:string, email:string) {
    let newUser = {
      displayName: name,
      id: id,
      email: email,
      theme: 'theme-purple',
      darkMode: false,
      tickInterval: 1,
      tickers: []
    }
    let data = {
      "record": newUser,
      "table": "stonks"
    }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Create`, data, this.headers).subscribe(
        (res) => {
          console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }
}
