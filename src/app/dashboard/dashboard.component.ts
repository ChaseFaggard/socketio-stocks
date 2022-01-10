import { Component, OnInit } from '@angular/core';

import { faHome, faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public darkMode: boolean = false

  public faHome = faHome
  public faUserCircle = faUserCircle
  public faCog = faCog

  constructor(private themeService: ThemeService) { 
    themeService.darkMode.subscribe((darkMode: boolean) => {
      this.darkMode = darkMode
    })
  }

  ngOnInit(): void { }

  toggleMode = (event: any) => this.darkMode = event.detail

}
