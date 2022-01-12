import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { User } from '../interfaces/User';
import { DatabaseService } from '../services/database.service';
import { LoggerService } from '../services/logger.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup|null = null;
  socialUser: SocialUser = new SocialUser;
  isLoggedin: boolean = false;  
  
  constructor(
    private formBuilder: FormBuilder, 
    private socialAuthService: SocialAuthService,
    private router: Router,
    private logger: LoggerService,
    private userService: UserService
  ) { 
    const subscription = this.userService.user.subscribe((user: User|null) => {
      console.log(`User: ${JSON.stringify(user)}`)
      if(user != null) {
        this.router.navigate(['dashboard/home'])
        subscription.unsubscribe()
      }
    })
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });   
  }

  loginWithGoogle = async () => {

    const user: User = await this.userService.loginGoogle()
    
    if(user) this.router.navigate(['dashboard/home'])

  }

  login = async () => {

  }

}
