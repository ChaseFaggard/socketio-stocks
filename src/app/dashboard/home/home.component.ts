import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { candleData, DataObject, HistoricalDataObject, HistoricalStockObject } from 'src/app/Interfaces';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as Plotly from 'plotly.js-dist-min'; 
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  public activeIndex: number = 0;

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public liveData: DataObject[] = []
  public currentHistoricalData: HistoricalDataObject[] = []
  public stockData: HistoricalStockObject[] = []

  public newsImg: string = '';
  public newsHeadline: string = '';
  public newsUrl: string = '';

  public drawGraph: boolean = true

  public range: string = '1y'

  candlestickData: candleData[] = []
  candlestickLayout: any
  candlestickConfig: any
  candlestickStyle: any

  public selectedLive: DataObject = {
    symbol: '',
    currentValue: 0
  }

  constructor(
    private stockService: StockService,
    private newsService: NewsService,
    private themeService: ThemeService,
    private localService: LocalStorageService,
    private userService: UserService) {

    this.stockService.liveData.subscribe((data: DataObject[] | null) => {
      if (data != null) this.liveData = data
    })
  }

  ngAfterViewInit(): void {
    this.getStockData()
  }

  ngOnDestroy(): void { this.drawGraph = false }

  ngOnInit(): void { }

  public async getStockData() {
    this.stockData = await this.stockService.requestHistorical(this.userService.user.value!.tickers)
    this.localService.saveHistorical(this.stockData)
    if(this.stockData.length > 0) {
      await this.getHistorical()
      await this.getNews()
    }
   
  }

  public changeIndex(next?:boolean) {
    if(next != undefined) {
      if(next && this.activeIndex < this.stockData.length-1) this.activeIndex++;
      else if(!next && this.activeIndex > 0) this.activeIndex--
    }
    if(this.stockData.length > 0) {
      this.getHistorical()
      this.getNews()
    }
    this.stockService.tickerIndex = this.activeIndex
  }

  public async getNews() {
    let news = await this.newsService.newsCall(this.stockData[this.activeIndex].symbol)
    this.localService.saveNews(news)
    this.newsImg = news.newsImg;
    this.newsHeadline = news.newsHeadline;
    this.newsUrl = news.newsUrl;
  }

  public changeRange(range: string) {
    this.range = range
    let start: number = 0
    switch(range) {
      case '1w':
        start = 7
        break
      case '1m':
        start = 28
        break
      case '3m':
        start = 65
        break
      case '6m':
        start = 120
        break
      case '1y':
        start = 258
        break 
      default: start = 258
    }
    this.candlestickData[0].x = Array.from(this.currentHistoricalData.slice(this.currentHistoricalData.length - start, this.currentHistoricalData.length), item => item.timestamp.slice(0, 10))
    this.candlestickData[0].close = Array.from(this.currentHistoricalData.slice(this.currentHistoricalData.length - start, this.currentHistoricalData.length), item => item.close)
    this.candlestickData[0].open = Array.from(this.currentHistoricalData.slice(this.currentHistoricalData.length - start, this.currentHistoricalData.length), item => item.open)
    this.candlestickData[0].high = Array.from(this.currentHistoricalData.slice(this.currentHistoricalData.length - start, this.currentHistoricalData.length), item => item.high)
    this.candlestickData[0].low =Array.from(this.currentHistoricalData.slice(this.currentHistoricalData.length - start, this.currentHistoricalData.length), item => item.low)
    if(this.drawGraph) Plotly.redraw('graph')
  }

  public async getHistorical() {
    this.currentHistoricalData = this.stockData[this.activeIndex].data

    const abc = {
      x: Array.from(this.currentHistoricalData.slice(0, this.currentHistoricalData.length), item => item.timestamp.slice(0, 10)),
      close: Array.from(this.currentHistoricalData.slice(0, this.currentHistoricalData.length), item => item.close),
      decreasing: { line: { color: '#7f7f7f' } },
      high: Array.from(this.currentHistoricalData.slice(0, this.currentHistoricalData.length), item => item.high),
      increasing: { line: { color: '#17becf' } },
      line: { color: 'rgba(31,119,180,1)' },
      low: Array.from(this.currentHistoricalData.slice(0, this.currentHistoricalData.length), item => item.low),
      open: Array.from(this.currentHistoricalData.slice(0, this.currentHistoricalData.length), item => item.open),
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
        range: ['2021-01-17 12:00', '2022-01-17 12:00'],
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

    await Plotly.newPlot('graph', this.candlestickData as any, this.candlestickLayout, this.candlestickConfig)

    this.themeService.darkMode.subscribe((darkMode: boolean) => {
      this.candlestickLayout.xaxis.color = darkMode ? 'white' : 'black'
      this.candlestickLayout.yaxis.color = darkMode ? 'white' : 'black'
      if(this.drawGraph) Plotly.restyle('graph', this.candlestickLayout)
    })

    this.themeService.theme.subscribe((theme: string) => {
      const color = this.themeService.colors.find(color => color.theme == theme)!
      this.candlestickData[0].increasing.line.color = color.color
      if(this.drawGraph) Plotly.redraw('graph')
    })

  }
}
