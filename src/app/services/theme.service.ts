import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode = new BehaviorSubject<boolean>(false)

  constructor() { }

  toggleMode = (): void => this.darkMode.next(!this.darkMode.value) 

}
