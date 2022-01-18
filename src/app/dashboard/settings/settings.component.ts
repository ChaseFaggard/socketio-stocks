import { Component, OnInit } from '@angular/core';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
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

  public candleIntervals: Interval[] = []

  public tickers: string[] = []

  public filteredTickers: string[] = []
  
  public userTickers: string[] = []

  public selectedTicker: string = ''

  public faMinus = faMinusCircle

  public selectedInterval: Interval = {
    name: '',
    value: this.userService.user.value!.tickInterval
  }

  public selectedCandleInterval: Interval = {
    name: '',
    value: this.userService.user.value!.candleInterval
  }

  constructor(private userService: UserService, private stockService: StockService) { 

    this.getTickers()

    this.intervals = [
      {name: '1 sec', value: 1},
      {name: '5 sec', value: 5},
      {name: '15 sec', value : 15},
      {name: '1 min', value: 60}
    ] 

    this.candleIntervals = [
      {name: '10 sec', value: 10},
      {name: '30 sec', value : 30},
      {name: '1 min', value: 60},
      {name: '5 min', value: 300},
      {name: '15 min', value: 900},
      {name: '30 min', value: 1800}
    ] 
    this.userService.user.subscribe((user: User|null) => {
      if(user != null) {
        this.selectedInterval = this.intervals.find(interval => interval.value === user.tickInterval)!
        this.selectedCandleInterval = this.candleIntervals.find(interval => interval.value === user.candleInterval)!
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
      if(this.userTickers.findIndex( t => t === ticker) == -1 && 
        ticker.toLowerCase().indexOf(query.toLowerCase()) == 0) filtered.push(ticker)
    }
    this.filteredTickers = filtered
  }

  changeInterval = async (interval: number) => await this.userService.updateUser('tickInterval', interval)

  changeCandleInterval = async (interval: number) => await this.userService.updateUser('candleInterval', interval)

  addTicker = async (ticker: string) => await this.userService.addTicker(ticker)
  deleteTicker = async (ticker: string) => await this.userService.deleteTicker(ticker)

}

interface Interval {
  name: string,
  value: number
}
