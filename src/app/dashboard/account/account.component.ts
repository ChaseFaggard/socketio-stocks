import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { DatabaseService } from 'src/app/services/database.service';
import { ThemeService } from 'src/app/services/theme.service';
import { User } from 'src/app/Interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public checked: boolean = false

  public socialUser: SocialUser = new SocialUser

  public user: User = {
    displayName: '',
    id: '',
    email: '',
    theme: '',
    darkMode: false,
    tickInterval: 0,
    tickers: [],
    photoUrl: ''
  }

  constructor(private themeService: ThemeService, private userService: UserService) {
    this.userService.user.subscribe((user: User|null) => this.user = user!)
    this.themeService.darkMode.subscribe((darkMode: boolean) => this.checked = darkMode)
  }

  ngOnInit(): void { }

  clicked = () => this.themeService.toggleMode()

  setTheme = (theme: string): void => { this.themeService.setTheme(theme) }

  checkActive = (theme: string): string => theme === this.themeService.theme.value ? 'active' : ''

}
