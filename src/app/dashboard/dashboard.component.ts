import { Component, OnInit } from '@angular/core';

import { faHome, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ThemeService } from '../services/theme.service';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public darkMode: boolean = false
  public theme: string = 'theme-purple'

  public faHome = faHome
  public faUserCircle = faUserCircle
  public faCog = faCog
  public faBell = faBell
  public faSignOutAlt = faSignOutAlt

  public accountPopup:boolean = false

  public displayName: string = ''
  public photoUrl: string = ''

  constructor(private themeService: ThemeService, private userService: UserService) { 
    this.userService.user.subscribe(async (user: User|null) => {
      if(user != null) { 
        this.displayName = user.displayName
        this.photoUrl = user.photoUrl
        this.themeService.darkMode.subscribe((darkMode: boolean) => this.darkMode = darkMode)
        this.themeService.theme.subscribe((theme: string) => this.theme = theme)
      }
    })
  }

  ngOnInit(): void { }

  logout = (): void => { this.userService.logout() }

  getThemeAndMode = (): string => {
    const mode = this.darkMode ? 'mode-dark' : 'mode-light'
    return mode + ' ' + this.theme
  }

}
