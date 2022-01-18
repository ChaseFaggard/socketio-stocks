import { Component, OnInit } from '@angular/core';

import { faHome, faUserCircle, faCog, faSignOutAlt, faChartArea } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { User } from '../Interfaces';
import { StockService } from '../services/stock.service';
import { LoggerService } from '../services/logger.service';

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
  public faChartArea = faChartArea

  public accountPopup:boolean = false

  public displayName: string = ''
  public photoUrl: string = ''

  public tickInterval: number = 0
  public tickers: string[] = []

  constructor(private stockService: StockService, private themeService: ThemeService, private userService: UserService, private logger: LoggerService) { 
    
    this.userService.user.subscribe(async (user: User|null) => {
      if(user != null) { 
        this.displayName = user.displayName
        this.photoUrl = user.photoUrl
        if(this.tickInterval != user.tickInterval || this.tickers != user.tickers) {
          this.tickInterval = user.tickInterval
          this.tickers = user.tickers
          this.stockService.setInterval(this.tickInterval, this.tickers)
        }
      }
    })

    this.themeService.darkMode.subscribe((darkMode: boolean) => this.darkMode = darkMode)
    this.themeService.theme.subscribe((theme: string) => this.theme = theme)
  }

  ngOnInit(): void { }

  logout = (): void => { this.userService.logout() }

  getThemeAndMode = (): string => {
    const mode = this.darkMode ? 'mode-dark' : 'mode-light'
    return mode + ' ' + this.theme
  }

}
