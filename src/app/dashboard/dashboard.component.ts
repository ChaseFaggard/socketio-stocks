import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { 
    const page = route.snapshot.paramMap.get("page")
    if(page == null || page == 'home') { }
    else if(page == 'account') { }
    else if(page == 'settings') { }
    else this.router.navigate(['page-not-found'])
  }

  ngOnInit(): void { }

}
