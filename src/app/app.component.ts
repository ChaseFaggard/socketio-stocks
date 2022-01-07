import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import { StockService } from './services/stock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private stockService: StockService) { 

    setInterval(this.getLatency, 1000)

    this.getData()

  }

  getData = async () => {
     let response: Object = await this.stockService.getData({
       'request-type': 'list'
     })

     console.log(response)

     response = await this.stockService.getData({
      'request-type': 'live',
      symbols: ['ABC']
    })

    console.log(response)
  }

  getResponse = async (requestType: string) => {
    const response = await this.stockService.getResponseType(requestType)
    console.log(response)
  }

  getLatency = async () => {
    const ping = await this.stockService.getLatency()
    console.log(`Latency: ${ping}ms`)
  }

}
