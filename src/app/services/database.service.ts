import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private static readonly TABLE = 'stonks'

  private headers = {
    headers: {
      'Authorization': `Bearer ${environment.M3O_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  constructor(private http:HttpClient, private logger:LoggerService) {  }

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

  public getRecord = async (table: string, key: string, value: any): Promise<any> => {
    const data = {
      query: `${key} == '${value}'`,
      table: table
    }
    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Read`, data, this.headers).subscribe(
        (res: any) => resolve(res.records[0]),
        (err: any) => reject(err)
      )
    })
  }

  public getUserById = async (id: string): Promise<User> => {
    const data = {
      id: id,
      table: DatabaseService.TABLE
    }
    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Read`, data, this.headers).subscribe(
        (res: any) => resolve(res.records[0]),
        (err: any) => reject(err)
      )
    })
  }

  public async updateUser(user: User, param: string, value: any): Promise<User> {
    
    (user as any)[param] = value

    this.logger.log(`Updating id ${user.id}'s ${param} parameter with new value ${value}`)
    let data = {
      "table" : "stonks",
      "record" : {
        "id" : user.id,
        [param] : value,
      }
    }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Update`, data, this.headers).subscribe(
        (res) => {
          resolve(user)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public async checkUserByEmail(email: string):Promise<boolean>{
    const users = await this.getUsers()
    return users.some(item => item.email == email)
  }

  public async addLogin(id: string, name: string, email: string, password: string): Promise<User> {
    const data = {
      "record" : {
        id: id,
        password: password
      },
      "table": "stonks-login"
    }
    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Create`, data, this.headers).subscribe(
        (res) => {
          resolve(this.generateUser(id, name, email, ''))
        },
        (err) => reject(err)
      )
    })
  }
  
  public async generateUser(id: string, name:string, email:string,  photoUrl: string): Promise<User> {
    let newUser: User = {
      displayName: name,
      id: id,
      email: email,
      theme: 'theme-purple',
      darkMode: false,
      tickInterval: 1,
      candleInterval: 10,
      tickers: [],
      photoUrl: photoUrl
    }
    let data = {
      "record": newUser,
      "table": "stonks"
    }
    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Create`, data, this.headers).subscribe(
        (res) => {
          resolve(newUser)
        }, (err) => {
          reject(err);
        }
      )
    })
  }
}
