import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public darkMode: boolean = false

  public faHome = faHome

  constructor(private route: ActivatedRoute, private router: Router) { 
    const page = route.snapshot.paramMap.get("page")
    if(page == null || page == 'home') { }
    else if(page == 'account') { }
    else if(page == 'settings') { }
    else this.router.navigate(['page-not-found'])
  }

  ngOnInit(): void { }

}
