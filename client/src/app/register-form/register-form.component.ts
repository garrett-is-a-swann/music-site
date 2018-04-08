import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
    firstname: string;
    lastname: string;
    response: string;

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() {
    }

    postForm(username, password, email) {
        this.response = 'Registering...';
        this.http.post('/api/auth/register', 
            {   username:username
                ,password:password
                ,email:email
                ,firstname:this.firstname
                ,lastname:this.lastname
            })
        .subscribe((data:any) => {
            if(data.success) {
                //Redirect Here
                this.response = 'Successfully registered!'
                this.auth.login(username, password, '/lobby')
            }
            else if (data.json) {
                this.response = 'Failed to register.'
            }
        });
    }
}
