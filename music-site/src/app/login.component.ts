import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit { 
    ngOnInit(): void {
    }

    title = 'Login'

    username = '';
    password = '';



}

/*====================================================


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'register',
    templateUrl: './register.c.html'
})

export class RegisterComponent implements OnInit { 
    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
    }

    title = 'Registration'
    
    username = '';
    password = '';
    email_addr = '';

    //Error flags
    usernameError = '';
    email_addrError = '';
    passwordError = '';

    errors: string[]=[];

    onKey(userString: string, emailString: string, passString: string): void{
        this.username = userString;
        this.password = passString;
        this.email_addr = emailString;
    }

    registerSubmit(): void {
        console.log('asda')
        this.usernameError = '';
        this.email_addrError = '';
        this.passwordError = '';
        this.http.post('/api/register',
        // Build POST to send
        {
            username:this.username
            ,email:this.email_addr
            ,password:this.password
        })
        .subscribe((data:any) => {
            console.log(data)
            console.log(data['username'])
            this.usernameError = data.username?data.username:'';
            this.email_addrError = data.email?data.email:'';
            this.passwordError = data.password?data.password:'';
        }); // Sends POST
        console.log(this.usernameError)
    }
}*/