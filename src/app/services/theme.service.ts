import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  public theme = new BehaviorSubject<string>('') // Default theme

  public colors = [
    { theme: 'theme-purple', color: 'rgb(129 117 255)'},
    { theme: 'theme-pink', color: 'rgb(243, 154, 157)' },
    { theme: 'theme-blue', color: 'rgb(109, 177, 191)' },
    { theme: 'theme-orange', color: 'rgb(255, 152, 118)' },
    { theme: 'theme-yellow', color: 'rgb(255, 202, 93)' },
    { theme: 'theme-green', color: 'rgb(105, 186, 164)' }
  ]

  constructor(private userService: UserService) {
    this.userService.user.subscribe((user: User|null) => {
      if(user != null) {
        if(user.theme != this.theme.value) this.theme.next(user.theme)
        if(user.darkMode != this.darkMode.value) {
          this.darkMode.next(user.darkMode)
        }
        user.darkMode ? document.body.style.background = 'rgb(41, 39, 39)' : document.body.style.background = 'white'
      }
    })
  }

  toggleMode = (): void => {
    this.darkMode.next(!this.darkMode.value)
    this.userService.updateUser('darkMode', this.darkMode.value)
  }

  setTheme = (theme: string) => {
    this.theme.next(theme)
    this.userService.updateUser('theme', theme)
  }

}
