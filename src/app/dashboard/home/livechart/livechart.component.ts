import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min'; 
import { candleData } from 'src/app/Interfaces';
import { StockService } from 'src/app/services/stock.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'livechart',
  templateUrl: './livechart.component.html',
  styleUrls: ['./livechart.component.scss']
})
export class LiveChartComponent implements OnInit, AfterViewInit {
  public candlestickData: candleData[] = []
  public candlestickLayout: any
  public candlestickConfig: any

  public candleInterval: any
  
  public drawGraph: boolean = true

  constructor(private stockService: StockService, private themeService: ThemeService, private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.buildChart()
    this.stockService.candlestickData.subscribe((candlestickData: candleData[]) => {
      this.candlestickData = candlestickData
      if(this.drawGraph) Plotly.react('livechart', this.candlestickData as any, this.candlestickLayout, this.candlestickConfig)
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void { this.drawGraph = false }

  buildChart = async () => {

    const data = {
      x: [(new Date()).getTime().toString()],
      close: [0],
      decreasing: { line: { color: '#7f7f7f' } },
      high: [0],
      increasing: { line: { color: '#17becf' } },
      line: { color: 'rgba(31,119,180,1)' },
      low: [0],
      open: [0],
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y',
    }
    const layout = {
      height: '150',
      width: '250',
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
        showgrid: false,
        visible: false
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        type: 'linear',
        showgrid: false,
        color: 'white',
        visible: false
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    const config = {
      displayModeBar: false,
      responsive: true
    }

    this.candlestickData = [data];
    this.candlestickLayout = layout;
    this.candlestickConfig = config;

    await Plotly.newPlot('livechart', this.candlestickData as any, this.candlestickLayout, this.candlestickConfig)


    this.themeService.theme.subscribe((theme: string) => {
      const color = this.themeService.colors.find(color => color.theme == theme)!
      this.candlestickData[0].increasing.line.color = color.color
      if(this.drawGraph) Plotly.redraw('livechart')
    })

  }

}
