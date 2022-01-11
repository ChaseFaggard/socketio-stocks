import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public checked: boolean

  public user: SocialUser = new SocialUser

  constructor(private themeService: ThemeService, private socialService: SocialAuthService) {
    this.checked = themeService.darkMode.value
    socialService.authState.subscribe((user: SocialUser) => this.user = user )
  }

  ngOnInit(): void { }

  clicked = () => this.themeService.toggleMode()

  setTheme = (theme: string): void => { this.themeService.setTheme(theme) }

  checkActive = (theme: string): string => theme === this.themeService.theme ? 'active' : ''

}
