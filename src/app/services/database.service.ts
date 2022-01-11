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
    this.getUsers()
    .then(data => {
      let user = data.find(item => item.id === id)!;
      this.user = user;
      console.log(this.user)
    })
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
  
}
