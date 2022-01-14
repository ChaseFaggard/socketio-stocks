import { Component, ElementRef, OnInit} from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import * as Plotly from 'plotly.js-dist-min'; // afdasas
import { DataObject, HistoricalObject } from 'src/app/Interfaces';
import { LoggerService } from 'src/app/services/logger.service';
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public liveData: DataObject[] = []
  public historicalData: HistoricalObject[] = []

  candlestickData: any[] = []
  candlestickLayout: any
  candlestickConfig: any
  candlestickStyle: any

  public selectedLive: DataObject = {
    symbol: '',
    currentValue: 0
  }

  constructor(private logger: LoggerService, private stockService: StockService, private themeService:ThemeService, private elementRef:ElementRef) {

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
      decreasing: { line: { color: '#7f7f7f' } },
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
          visible:false
        },
        showgrid: false
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        range: [2000, 4000],
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

  /* Plotly Notes */
  /*
  * Set height to 100% in style to fit to parent div
  * Remove toolbar in config
  * Declare type by saying type: candlestick
  * plotly.js will populate by itself
  * 
  */
}
