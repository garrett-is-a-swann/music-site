import { Injectable } from '@angular/core';
import { 
    CanActivate
    ,Router
    ,ActivatedRouteSnapshot
    ,RouterStateSnapshot
    ,CanActivateChild
    ,Route
    ,CanLoad
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad{
    constructor(private authService: AuthService, private router: Router) { 
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        return await this.checkLogin(url);
    }

    async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return await this.canActivate(route, state);
    }

    async canLoad(route: Route) {
          let url = `/${route.path}`;

          return await this.checkLogin(url);
    }

    async checkLogin(url:string) {
        if(await this.authService.isAuthenticated()) {return true;}

        this.authService.redirectUrl = url;
        console.log('Redirecting here')
        this.router.navigate(['/login']);
        return false;
    }

}
