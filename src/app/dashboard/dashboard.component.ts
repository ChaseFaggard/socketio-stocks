import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

import { faHome, faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';
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

  public items: MenuItem[] = []

  constructor(private themeService: ThemeService, private socialService: SocialAuthService) { 
    themeService.darkMode.subscribe((darkMode: boolean) => {
      this.darkMode = darkMode
    })

    socialService.authState.subscribe((user: SocialUser) => {
      if(user != null) this.user = user
    })

  }

  ngOnInit(): void { 
    this.items = [
      {label: 'New', icon: 'pi pi-fw pi-plus'},
      {label: 'Open', icon: 'pi pi-fw pi-download'},
      {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
    ]
  }

  toggleMode = (event: any) => this.darkMode = event.detail

}
