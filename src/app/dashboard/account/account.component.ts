import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { DatabaseService } from 'src/app/services/database.service';
import { ThemeService } from 'src/app/services/theme.service';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public checked: boolean

  public socialUser: SocialUser = new SocialUser

  public displayName:string

  constructor(private themeService: ThemeService, private socialService: SocialAuthService, private dbService:DatabaseService) {
    this.checked = themeService.darkMode.value
    socialService.authState.subscribe((user: SocialUser) => this.socialUser = user )
    this.displayName = this.dbService.user.displayName;
  }

  ngOnInit(): void { }

  clicked = () => this.themeService.toggleMode(this.dbService.user.id)

  setTheme = (theme: string): void => { this.themeService.setTheme(this.dbService.user.id, theme) }

  checkActive = (theme: string): string => theme === this.themeService.theme ? 'active' : ''

}
