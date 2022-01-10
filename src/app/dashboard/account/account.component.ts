import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public checked: boolean

  constructor(private themeService: ThemeService) {
    this.checked = themeService.darkMode.value
  }

  ngOnInit(): void { }

  clicked = () => this.themeService.toggleMode()

}
