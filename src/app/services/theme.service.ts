import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  public theme:string = 'theme-purple' // Default theme

  constructor() { }

  toggleMode = (): void => this.darkMode.next(!this.darkMode.value) 

  setTheme = (theme: string) => this.theme = theme

}
