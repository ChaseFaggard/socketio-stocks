import { Component, OnInit } from '@angular/core';

import { faHome, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: SocialUser = new SocialUser

  public darkMode: boolean = false

  public faHome = faHome
  public faUserCircle = faUserCircle
  public faCog = faCog
  public faBell = faBell
  public faSignOutAlt = faSignOutAlt

  public accountPopup:boolean = false

  constructor(private themeService: ThemeService, private socialService: SocialAuthService) { 

    themeService.darkMode.subscribe((darkMode: boolean) => {
      this.darkMode = darkMode
    })

    socialService.authState.subscribe((user: SocialUser) => {
      if(user != null) this.user = user
    })

  }

  ngOnInit(): void { }

  toggleMode = (event: any) => this.darkMode = event.detail

  logout = (): void => { this.socialService.signOut() }

}
