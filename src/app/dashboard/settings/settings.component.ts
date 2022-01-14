import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces';
import { StockService } from 'src/app/services/stock.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public intervals: Interval[] = []

  public tickers: string[] = []

  public filteredTickers: string[] = []
  
  public userTickers: string[] = []

  public selectedTicker: string = ''

  public selectedInterval: Interval = {
    name: '',
    value: this.userService.user.value!.tickInterval
  }

  constructor(private userService: UserService, private stockService: StockService) { 

    this.getTickers()

    this.intervals = [
      {name: '1 sec', value: 1},
      {name: '5 sec', value: 5},
      {name: '15 sec', value : 15},
      {name: '1 min', value: 60},
      {name: '15 min', value: 300},
      {name: '15 min', value: 900}
    ] 
    this.userService.user.subscribe((user: User|null) => {
      if(user != null) {
        this.selectedInterval = this.intervals.find(interval => interval.value === user.tickInterval)!
        this.userTickers = user.tickers
      }
    })
  }

  ngOnInit(): void { }

  getTickers = async () => this.tickers = (await this.stockService.requestList())

  filterTickers = (event: any) => {
    let filtered: any[] = []
    let query = event.query
    for(let ticker of this.tickers) {
      if(ticker.toLowerCase().indexOf(query.toLowerCase()) == 0) filtered.push(ticker)
    }
    this.filteredTickers = filtered
  }

  changeInterval = async (interval: number) => await this.userService.updateUser('tickInterval', interval)

  addTicker = async (ticker: string) => {
    await this.userService.addTicker(ticker)
  }

}

interface Interval {
  name: string,
  value: number
}
