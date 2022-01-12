import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight
  
  constructor() { }

  ngOnInit(): void {
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
