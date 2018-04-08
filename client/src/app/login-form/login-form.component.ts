import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
    response: string;
    username_error:string;
    password_error:string;

    constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.redirect()
    }

    async redirect() {
        if( await this.auth.isAuthenticated() ){
            this.router.navigate(['']);
        }
    }

    postForm(username:string, password:string) {
        this.response = 'Authenticating...';
        this.auth.login(username, password)
            .then((data:any) =>{
                if(data.success) {
                    //Redirect Here
                    this.response = 'Authentication successful.';
                }
                else {
                    this.response = data.message;
                    if(data.mode == 2) {
                        this.password_error = 'invalid'
                    }
                }
                this.redirect()
            });
    }

}
