import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  public theme: string = 'theme-purple' // Default theme

  constructor(private dbService: DatabaseService) {
    this.theme = this.dbService.user.theme;
   }

  toggleMode = (id:string): void => {
    this.darkMode.next(!this.darkMode.value)
    this.dbService.updateUser(id, 'darkMode', this.darkMode.value)
    this.dbService.user.darkMode = this.darkMode.value
  }

  setTheme = (id:string, theme: string) => {
    this.theme = theme
    this.dbService.updateUser(id, 'theme', theme)
    this.dbService.user.theme = theme
  }

}
