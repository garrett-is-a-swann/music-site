import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private isLoggedin:boolean = false;
    private reload:boolean = true;
    private auth_user:string = 'NULL';

    state_change : EventEmitter<boolean> = new EventEmitter();

    redirectUrl: string = '';
    
    constructor(private http: HttpClient, private router: Router) {
    }

    checkAuthenticated() {
        return new Promise((resolve, reject) => {
            if(this.isLoggedin == true) {
                resolve(true)
            }
            this.http.get('/api/auth/is-auth')
                .subscribe((data:any) =>{
                    this.reload=false;
                    if(data.success) {
                        this.isLoggedin = true;
                        this.auth_user = data.username;

                        // Handle event last
                        this.state_change.emit(this.isLoggedin);
                        resolve(true);
                    }
                    else {
                        this.isLoggedin = false;

                        // Handle event last
                        this.state_change.emit(this.isLoggedin);
                        resolve(false);
                    }
                });
        })
    }

    login(username:string, password:string, navigate?) {
        return new Promise((resolve, reject) => {
            this.http.post('/api/auth/login', {username:username,password:password})
                .subscribe((data:any) =>{
                    if(data.success) {
                        this.isLoggedin = true;
                        this.auth_user = username;

                        // Handle event last
                        this.state_change.emit(this.isLoggedin);
                        if(navigate)
                        setTimeout(()=>{
                            this.router.navigate([navigate])}, 500)
                        resolve({success:true, message: 'Authentication successful.'});
                    }
                    else {
                        this.isLoggedin = false;
                        this.auth_user = '';

                        // Handle event last
                        this.state_change.emit(this.isLoggedin);
                        resolve({success:false, mode: data.mode, message: data.message});
                    }
                });
        })
    }

    logout() {
        this.isLoggedin = false;
        this.state_change.emit(this.isLoggedin);
        return new Promise((resolve, reject) => {
            this.http.get('/api/auth/logout')
                .subscribe((data:any) => {
                    if(data.success) {
                        this.isLoggedin = false;
                        this.auth_user = '';

                        // Handle event last
                        this.state_change.emit(this.isLoggedin);
                        resolve({success:true, message: 'Logout successful.'});
                    }
                    else {
                        this.isLoggedin = false;
                        this.state_change.emit(this.isLoggedin);

                        // Maybe insert a Snackbar error here.
                        resolve({success:false, message: "There's a broken pipe somewhere."})
                    }
                });
        })
    }
    
    isAuthenticated() {
        return new Promise((resolve, reject) => {
            if(this.reload) {
                this.checkAuthenticated().then(resp => {
                    resolve(resp)});
            } else {
                resolve(this.isLoggedin);
            }
        })
    }

    whoAuthenticated() {
            return this.auth_user;
    }

    stateChangeEmitter() {
        return this.state_change;
    }

}
