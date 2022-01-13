import { Component, ElementRef, OnInit} from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import * as Plotly from 'plotly.js';
import { DataObject, HistoricalData, HistoricalObject, LiveData } from 'src/app/Interfaces';
import { LoggerService } from 'src/app/services/logger.service';
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public theme:string = ''

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

  constructor(private logger: LoggerService, private stockService: StockService, private themeService:ThemeService, private elementRef:ElementRef) {
    console.log(`Theme: ${this.theme}`)
    
    this.stockService.liveData.subscribe((data: DataObject[] | null) => {
      if (data != null) this.liveData = data
    })

    this.getHistorical()
  }

  ngOnInit(): void { }

  public async getHistorical() {
    this.historicalData = (await this.stockService.requestHistorical(['ABC', 'NBR'])).data;
    console.log(this.historicalData)

    const abc = {
      x: Array.from(this.historicalData.slice(0, 7), item => item.data[0].timestamp.slice(0,10)),
      close: Array.from(this.historicalData.slice(0, 7), item => item.data[0].close),
      decreasing: { line: { color: this.theme } },
      high: Array.from(this.historicalData.slice(0, 7), item => item.data[0].high),
      increasing: { line: { color: '#17becf' } },
      line: { color: 'rgba(31,119,180,1)' },
      low: Array.from(this.historicalData.slice(0, 7), item => item.data[0].low),
      open: Array.from(this.historicalData.slice(0, 7), item => item.data[0].open),
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y',
    }
    console.log(abc)
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
          visible:false
        }
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        range: [2000, 4000],
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

  /* Plotly Notes */
  /*
  * Set height to 100% in style to fit to parent div
  * Remove toolbar in config
  * Declare type by saying type: candlestick
  * plotly.js will populate by itself
  * 
  */
}
