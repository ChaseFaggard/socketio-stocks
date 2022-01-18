import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../Interfaces';
import { UserService } from '../services/user.service';
import { faKey, faEnvelope, faSignature } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  public signupForm: FormGroup
  public isLoggedin: boolean = false
  public displayLogin = true

  public faKey = faKey
  public faEnvelope = faEnvelope
  public faGoogle = faGoogle
  public faSignature = faSignature

  public loginEmail: string = ''
  public loginPassword: string = ''

  public signupName: string = ''
  public signupPassword: string = ''
  public signupEmail: string = ''
  
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private userService: UserService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })


    const subscription = this.userService.user.subscribe((user: User|null) => {
      console.log(`User: ${JSON.stringify(user)}`)
      if(user != null) {
        this.router.navigate(['dashboard/home'])
        subscription.unsubscribe()
      }
    })
  }

  ngOnInit() { }

  loginWithGoogle = async () => await this.userService.loginGoogle()



  login = async () => {
    const form = this.loginForm.value
    await this.userService.login(form.email, form.password)
  }

  signup = async () => {
    const form = this.signupForm.value
    await this.userService.createUser(form.name, form.email, form.password)
  }

  checkLoginErrors = (): void => {

  }

  checkSignupErrors = (): void => {

  }

}
