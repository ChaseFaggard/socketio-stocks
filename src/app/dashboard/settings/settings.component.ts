import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  intervals: Interval[] = []

  selectedInterval: Interval = {
    name: '',
    value: this.userService.user.value!.tickInterval
  }

  constructor(private userService: UserService) { 
    this.intervals = [
      {name: '1 sec', value: 1},
      {name: '5 sec', value: 5},
      {name: '15 sec', value : 15},
      {name: '1 min', value: 60},
      {name: '15 min', value: 300},
      {name: '15 min', value: 900}
    ] 
    this.userService.user.subscribe((user: User|null) => {
      if(user != null) {
        this.selectedInterval = this.intervals.find(interval => interval.value === user.tickInterval)!
      }
    })
  }

  ngOnInit(): void { }

  changeInterval = async (interval: number) => await this.userService.updateUser('tickInterval', interval)

}

interface Interval {
  name: string,
  value: number
}
