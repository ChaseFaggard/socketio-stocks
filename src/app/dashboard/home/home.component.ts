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

}
