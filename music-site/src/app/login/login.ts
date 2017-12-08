import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../form/form';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
    test: string = 'just a test';

    constructor(private auth: AuthService) {}

    ngOnInit(): void {
    }

    loginConfig = {
        endpoint:'api/authenticate',
        fields:{
            username:{type:'input', field:'text',  placeholder:'Username', id:'username', value:'' },
            password:{type:'input', field:'password', placeholder:'Password', id:'password', value:''},
            submit:{type:'button', text:'Login', style:'success'}
        },
        validation:{}
    };
    registerConfig = {
        endpoint:'api/register',
        fields:{
            username:{type:'input', field:'text',  placeholder:'Username', id:'username', value:'' },
            email:{type:'input', field:'text', placeholder:'Email', id:'email', value:''},
            password:{type:'input', field:'password', placeholder:'Password', id:'password', value:''},
            confirm_password:{type:'input', field:'password', placeholder:'Confirm Password', id:'confirm_password', value:''},
            submit:{type:'button', text:'Submit', style:'success'},
        },
        validation:{equal:[['password','confirm_password']], valid_email:['email'], not_taken:[{type:'username',id:'username'},{type:'email',id:'email'}]}
    };
}
