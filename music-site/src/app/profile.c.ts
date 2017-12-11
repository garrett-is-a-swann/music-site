import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'profile',
    templateUrl: './profile.c.html'
})

export class ProfileComponent implements OnInit { 
    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
    }

    title = 'My Profile'
    
    username = 'usernameTMP';
    password = 'passTMP';
    email_addr = 'emailTMP';

    //Error flags
    usernameError = '';
    email_addrError = '';
    passwordError = '';

    errors: string[]=[];

    myFunction() {
        var x = document.getElementById("ChangeUser");
        if(x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        var b = document.getElementById("ChangeUserButton");
        if(b.style.display === "none") {
            b.style.display = "block";
        } else {
            b.style.display = "none";
        }
    }

    showForm() {
        var x = document.getElementById("newGraph");
        var y = document.getElementById("newGraphButton");
        if (x.style.display == "none") {
            x.style.display = "block";
            y.style.display = "block";
        } else {
            x.style.display = "none";
            y.style.display = "none";
        }
    }
}
