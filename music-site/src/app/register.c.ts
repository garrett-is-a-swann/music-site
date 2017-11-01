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

    onKey(userString: string, emailString: string, passString: string): void{
        this.username = userString;
        this.password = passString;
        this.email_addr = emailString;
    }

    registerSubmit(): void {
        this.http.post('/api/register',
        // Build POST to send
        {
            username:this.username
            ,email:this.email_addr
            ,password:this.password
        })
        .subscribe((data:any) => {
            this.usernameError = data.username?data.username:'';
            this.email_addrError = data.email?data.email:'';
            this.passwordError = data.password?data.password:'';
        }); // Sends POST
    }
}
