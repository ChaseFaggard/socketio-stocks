import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/User';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  public theme = new BehaviorSubject<string>('theme-purple') // Default theme

  constructor(private dbService: DatabaseService) {
    this.dbService.user.subscribe((user: User) => {
      this.theme.next(user.theme)
      this.darkMode.next(user.darkMode)
    })
  }

  toggleMode = (): void => {
    this.darkMode.next(!this.darkMode.value)
    this.dbService.updateUser('darkMode', this.darkMode.value)
  }

  setTheme = (theme: string) => {
    this.theme.next(theme)
    this.dbService.updateUser('theme', theme)
  }

}
