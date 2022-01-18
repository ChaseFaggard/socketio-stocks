import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Interfaces';
import { DatabaseService } from './database.service';
import { LocalStorageService } from './local-storage.service';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = new BehaviorSubject<User | null>(null)

  public socialUser: SocialUser = new SocialUser

  public loggedIn = new BehaviorSubject<boolean>(false)

  constructor(private socialService: SocialAuthService, private localService:LocalStorageService, private dbService: DatabaseService) { 

    // Save user to local storage 
    this.user.subscribe((user: User|null) => {
      if(user != null) this.localService.saveUser(user)
    })

    this.socialService.authState.subscribe(async (user: SocialUser) => { 
      this.socialUser = user
      if(user == null) {  
        this.loggedIn.next(false)
        this.socialUser = user
      } 
      else { // Logged in google
        console.log('Logged in with google')
        if(this.loggedIn.value == false) {
          await this.getUser()
          this.loggedIn.next(true)
        }
      }
    })
  }

  // Initalize user to local storage or databse if local is empty
  getUser = async () => {
    if(this.localService.hasUser()) this.user.next(this.localService.getUser())
    else this.user.next(await this.dbService.getUserById(this.socialUser.id))
  }

  logout = ():void => {
    this.loggedIn.next(false)
    this.user.next(null)
    this.localService.saveUser(null)
    if(this.socialUser != null) this.socialService.signOut()
  }

  loginGoogle = async (): Promise<User> => { 
    this.loggedIn.next(true)
    const socialUser: SocialUser = await this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID)
    const user:User = await this.dbService.getUserById(socialUser.id)
    if(user) {
      if(user.photoUrl !== socialUser.photoUrl) {
        this.dbService.updateUser(user, 'photoUrl', socialUser.photoUrl)
        user.photoUrl = socialUser.photoUrl
      }
      this.user.next(user) 
    }
    else {
     const newUser:User = await this.dbService.generateUser(socialUser.id, socialUser.firstName, socialUser.email, socialUser.photoUrl)
     this.user.next(newUser)
    }
    return this.user.value!
  }

  login = async (email: string, password: string) => {
    const user: User = await this.dbService.getRecord('stonks', 'email', email)
    if(user) {
      const loginInfo = await this.dbService.getRecord('stonks-login', 'id', user.id)
      if(loginInfo && bcrypt.compareSync(password, loginInfo.password)) {
        this.user.next(user)
        this.loggedIn.next(true)
      }
    }

  }


  createUser = async (name: string, email: string, password: string): Promise<User|null> => {
    this.loggedIn.next(true)
    if((await this.dbService.checkUserByEmail(email)) == false) {
      const id = Math.random().toString(36).substring(2, 11)
      const salt = bcrypt.genSaltSync(10);
      const pass = bcrypt.hashSync(password, salt);
      const user = await this.dbService.addLogin(id, name, email, pass)
      if(user) {
        this.user.next(user)
        return user
      }
    }
    return null
  }

  addTicker = async (ticker: string) => {
    let index = this.user.value!.tickers.findIndex((t: string) => ticker == t)
    if(index == -1) { // Not found
      let newTickers: string[] = [...this.user.value!.tickers, ticker]
      await this.updateUser('tickers', newTickers)
    } else console.log('Ticker already exists... not adding')
  }

  deleteTicker = async (ticker: string) => {
    let index = this.user.value!.tickers.findIndex((t: string) => ticker == t)
    if(index != -1) {
      let newTickers: string[] = [...this.user.value!.tickers]
      newTickers.splice(index, 1)
      await this.updateUser('tickers', newTickers)
    } else console.log('Ticker to delete not found... not deleting')
  }

  updateUser = async (key: string, value: any) => {
    const currentItem = (this.user.value as any)[key]
    if(JSON.stringify(currentItem) !== JSON.stringify(value)) { // Update user if the change is different
      const updatedUser: User = await this.dbService.updateUser(this.user.value!, key, value)
      this.user.next(updatedUser)
    } else console.log('Update not needed... change is the same')
  }

}
