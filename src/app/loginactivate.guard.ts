import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
//suggestion: too many unused imports
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, filter, first, map, Observable, take, tap } from 'rxjs';
import { User } from './Interfaces';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.userService.user.subscribe((user: User|null) => {
      if(user == null) this.router.navigate(['login'])
    })
    
    return true
  }
}
