import { Component, ElementRef, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { DataObject, HistoricalDataObject, HistoricalStockObject } from 'src/app/Interfaces';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as Plotly from 'plotly.js-dist-min'; // afdasas
import { LoggerService } from 'src/app/services/logger.service';
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public activeIndex: number = 0;

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public liveData: DataObject[] = []
  public currentHistoricalData: HistoricalDataObject[] = []
  public stockData: HistoricalStockObject[] = []

  public newsImg: string = '';
  public newsHeadline: string = '';
  public newsUrl: string = '';

  candlestickData: any[] = []
  candlestickLayout: any
  candlestickConfig: any
  candlestickStyle: any

  public selectedLive: DataObject = {
    symbol: '',
    currentValue: 0
  }

  constructor(
    private logger: LoggerService,
    private stockService: StockService,
    private newsService: NewsService,
    private themeService: ThemeService,
    private elementRef: ElementRef,
    private localService: LocalStorageService,
    private userService: UserService) {

    this.stockService.liveData.subscribe((data: DataObject[] | null) => {
      if (data != null) this.liveData = data
    })

    this.getStockData()
  }

  ngOnInit(): void { }

  public async getStockData() {
    localStorage.removeItem('historical')
    if (this.localService.hasHistorical()) this.stockData = this.localService.getHistorical()!
    else {
      this.stockData = await this.stockService.requestHistorical(this.userService.user.value!.tickers)
      this.localService.saveHistorical(this.stockData)
    }
    await this.getHistorical()
    await this.getNews()
  }

  public changeIndex(next: boolean) {
    if (next && this.activeIndex < this.stockData.length - 1) this.activeIndex++;
    else if (!next && this.activeIndex > 0) this.activeIndex--

    console.log(this.activeIndex)
    this.getHistorical()
  }

  public async getNews() {
    let news = await this.newsService.newsCall('NBR')
    this.localService.saveNews(news)
    console.log(news)
    this.newsImg = news.newsImg;
    this.newsHeadline = news.newsHeadline;
    this.newsUrl = news.newsUrl;
  }

  public async getHistorical() {
    this.currentHistoricalData = this.stockData[this.activeIndex].data

    const abc = {
      x: Array.from(this.currentHistoricalData.slice((this.currentHistoricalData.length - 7), this.currentHistoricalData.length), item => item.timestamp.slice(0, 10)),
      close: Array.from(this.currentHistoricalData.slice((this.currentHistoricalData.length - 7), this.currentHistoricalData.length), item => item.close),
      decreasing: { line: { color: '#7f7f7f' } },
      high: Array.from(this.currentHistoricalData.slice((this.currentHistoricalData.length - 7), this.currentHistoricalData.length), item => item.high),
      increasing: { line: { color: '#17becf' } },
      line: { color: 'rgba(31,119,180,1)' },
      low: Array.from(this.currentHistoricalData.slice((this.currentHistoricalData.length - 7), this.currentHistoricalData.length), item => item.low),
      open: Array.from(this.currentHistoricalData.slice((this.currentHistoricalData.length - 7), this.currentHistoricalData.length), item => item.open),
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y',
    }
    const layout = {
      height: '400',
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
        title: '',
        type: 'date',
        color: 'white',
        rangeslider: {
          visible: false
        },
        showgrid: false
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        type: 'linear',
        showgrid: false,
        color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    const config = {
      displayModeBar: false,
      responsive: true
    }

    const style = {
      width: '100%',
      height: '100%'
    }

    this.candlestickData = [abc];
    this.candlestickLayout = layout;
    this.candlestickConfig = config;
    this.candlestickStyle = style;

    Plotly.newPlot('graph', this.candlestickData, this.candlestickLayout, this.candlestickConfig)

    this.themeService.darkMode.subscribe((darkMode: boolean) => {
      this.candlestickLayout.xaxis.color = darkMode ? 'white' : 'black'
      this.candlestickLayout.yaxis.color = darkMode ? 'white' : 'black'
      Plotly.restyle('graph', this.candlestickLayout)
    })

    this.themeService.theme.subscribe((theme: string) => {
      this.candlestickData[0].increasing.line.color = getComputedStyle(this.elementRef.nativeElement).getPropertyValue('--theme-color')
      Plotly.redraw('graph')
    })

  }
}
