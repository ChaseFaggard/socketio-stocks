import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  headers = {
    headers: {
      'Authorization': `Bearer ${environment.M3O_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  constructor(private http:HttpClient) { 
    console.log(environment.M3O_KEY)
  }

  accessDatabase() {
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
      console.log(err)
    }
    return users;
  }
  
}
