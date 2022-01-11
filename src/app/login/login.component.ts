import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { DatabaseService } from '../services/database.service';
import { LoggerService } from '../services/logger.service';

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
    private dbService: DatabaseService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
  }

  loginWithGoogle = async () => {

    const user:SocialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)

    this.socialUser = user;
    this.isLoggedin = (user != null)

    this.logger.log(`Checking for user: ${user.firstName} with email ${user.email} and id ${user.id}`)

    const userExist:boolean = await this.dbService.checkUser(user.id)

    if(userExist) this.logger.log('user found')
    else {
      this.logger.log('User not found. Adding to database...')
      await this.dbService.generateUser(user.id, user.firstName, user.email)
    }
    
    this.router.navigate(['dashboard/home'])

  }

  logOut = (): void => { this.socialAuthService.signOut() }

}
