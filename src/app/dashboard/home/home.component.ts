import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/interfaces/User';
import { StockService } from 'src/app/services/stock.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public faArrowLeft = faArrowLeft
  public faArrowRight = faArrowRight

  public tickInterval: number = 5

  public data: any

  constructor(private stockService: StockService, private userService: UserService) { 

    this.userService.user.subscribe((user: User|null) => {
      if(user != null) this.tickInterval = user.tickInterval
    })

    this.stockService.newInterval(1, ['NBR', 'ABC'])

    this.stockService.liveData().subscribe((data: any) => {
      console.log(data)
      this.data = data.data
    })


  }

  ngOnInit(): void {

  }

}
