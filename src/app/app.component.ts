import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import { LoggerService } from './services/logger.service';
import { StockService } from './services/stock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private stockService: StockService, private logger: LoggerService) { 
  }

  getLatency = async () => {
    const ping = await this.stockService.getLatency()
    console.log(`Latency: ${ping}ms`)
  }

}
