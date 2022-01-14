import { Component, ElementRef, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import * as Plotly from 'plotly.js';
import { DataObject, HistoricalData, HistoricalObject, LiveData } from 'src/app/Interfaces';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoggerService } from 'src/app/services/logger.service';
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public activeIndex:number = 0;

  public theme: string = ''

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public liveData: DataObject[] = []
  public historicalData: HistoricalObject[] = []

  candlestickData: object[] = []
  candlestickLayout: object = {}
  candlestickConfig: object = {}
  candlestickStyle: object = {}

  public selectedLive: DataObject = {
    symbol: '',
    currentValue: 0
  }

  constructor(
    private logger: LoggerService, 
    private stockService: StockService, 
    private themeService: ThemeService, 
    private elementRef: ElementRef, 
    private localService:LocalStorageService) {
    console.log(`Theme: ${this.theme}`)

    this.stockService.liveData.subscribe((data: DataObject[] | null) => {
      if (data != null) this.liveData = data
    })

    this.getHistorical()
  }

  ngOnInit(): void { }

  public changeIndex(next:boolean) {
    if(next && this.activeIndex < 1 /*replace this with tickers.length*/) this.activeIndex++;
    else if(!next && this.activeIndex > 0) this.activeIndex--

    console.log(this.activeIndex)
    this.getHistorical()
  }

  public async getHistorical() {
    if(this.localService.hasHistorical())
    {
      const allData = this.localService.getHistorical()
      this.historicalData = allData!.data[this.activeIndex]
    }
    else{
      const allData = await this.stockService.requestHistorical(['ABC', 'NBR'])
      this.localService.saveHistorical(allData)
      this.historicalData = allData!.data[this.activeIndex]
    }

    const abc = {
      x: Array.from(this.historicalData.slice((this.historicalData.length - 7), this.historicalData.length), item => item.data[0].timestamp.slice(0, 10)),
      close: Array.from(this.historicalData.slice((this.historicalData.length - 7), this.historicalData.length), item => item.data[0].close),
      decreasing: { line: { color: this.theme } },
      high: Array.from(this.historicalData.slice((this.historicalData.length - 7), this.historicalData.length), item => item.data[0].high),
      increasing: { line: { color: '#17becf' } },
      line: { color: 'rgba(31,119,180,1)' },
      low: Array.from(this.historicalData.slice((this.historicalData.length - 7), this.historicalData.length), item => item.data[0].low),
      open: Array.from(this.historicalData.slice((this.historicalData.length - 7), this.historicalData.length), item => item.data[0].open),
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y',
    }
    const layout = {
      dragmode: 'zoom',
      margin: {
        r: 10,
        t: 25,
        b: 40,
        l: 60
      },
      showlegend: false,
      xaxis: {
        autorange: true,
        domain: [0, 1],
        range: ['2022-01-06 12:00', '2022-01-12 12:00'],
        title: 'Date',
        type: 'date',
        rangeslider: {
          visible: false
        }
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        //range: [this.findLow(), this.findHigh()],
        type: 'linear'
      }
    }

    const config = {
      displayModeBar: false
    }

    this.candlestickData = [abc];
    this.candlestickLayout = layout;
    this.candlestickConfig = config;

  }

  findHigh():number {
    let highest = 0;
    this.historicalData.forEach(item => { if (item.data[0].high > highest) { highest = item.data[0].high } })
    console.log(highest + Math.ceil(highest / 2))
    return highest + Math.ceil(highest / 2)
  }

  findLow():number {
    let lowest = this.findHigh();
    this.historicalData.forEach(item => { if (item.data[0].low < lowest) { lowest = item.data[0].low } })
    console.log(lowest - Math.floor(lowest / 2))
    return lowest - Math.floor(lowest / 2)
  }
}
