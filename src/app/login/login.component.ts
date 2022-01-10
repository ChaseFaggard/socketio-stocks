import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
    
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.socialUser = user;
      this.isLoggedin = (user != null)
      if(this.isLoggedin) this.router.navigate(['dashboard/home'])
    })
  }

  loginWithGoogle = (): void => {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then(() => this.router.navigate(['dashboard/home']))
  }

  logOut = (): void => { this.socialAuthService.signOut() }

}
