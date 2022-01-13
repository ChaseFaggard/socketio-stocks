import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { DataObject, LiveData } from 'src/app/Interfaces';
import { LoggerService } from 'src/app/services/logger.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public liveData: DataObject[] = []

  public selectedLive: DataObject = {
    symbol: '',
    currentValue: 0
  }

  constructor(private stockService: StockService) { 
    this.stockService.liveData.subscribe((data: DataObject[]|null) => {
      if(data != null) this.liveData = data
    })
  }

  ngOnInit(): void { }

  /* Plotly Notes */
  /*
  * Set height to 100% in style to fit to parent div
  * Remove toolbar in config
  * Declare type by saying type: candlestick
  * plotly.js will populate by itself
  * 
  */
}
