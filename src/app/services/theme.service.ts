import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/User';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  public theme = new BehaviorSubject<string>('theme-purple') // Default theme

  constructor(private userService: UserService) {
    this.userService.user.subscribe((user: User|null) => {
      if(user != null) {
        this.theme.next(user.theme)
        this.darkMode.next(user.darkMode)
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
