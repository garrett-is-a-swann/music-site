import { Component, OnInit, Input } from '@angular/core';
import { ClockService } from '../clock.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    providers: [ ClockService ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @Input('formtype') logintype: string;
    model: string = '';
    error: string = '';
    style: string = 'required';

    constructor(private http: HttpClient, private clock: ClockService) {
        clock.init(()=>{this.postValidate()});
    }

    ngOnInit() {
    }

    keydown() {
        this.clock.restart()
        this.error = '';
        this.style = 'validating';
    }

    validate() {  // Keyup
        this.clock.restart() 
        if(/^[a-zA-Z0-9._!@$~|-]{0,64}$/.exec(this.model) != null) {
            this.style = 'validating';
            this.error = ''
        }
        else if(/[^a-zA-Z0-9._!@$~|-]/.exec(this.model) != null) {
            this.style = 'invalid';
            this.error = 'Error: Cannot use characters: [ '
                + (this.model.match(/[^a-zA-Z0-9._!@$~|-]/g)
                .filter((value, index, self) => {
                    return self.indexOf(value) === index;
                })+'').replace(/([^a-zA-Z0-9._!@$~|-],)/g,(match, offset, str) => {return match[0]})+' ]'
        }
        else {
            this.style = 'invalid';
            this.error = 'Error: Usernames must be 4-64 characters.'
        }
    };

    postValidate() {
        if( this.error.length > 0 ) {
            return;
        }
        if( this.model.length == 0) {
            this.style = 'required';
            return
        }
        if( /^[a-zA-Z0-9._!@$~|-]{4,64}$/.exec(this.model) == null 
            && this.style != 'invalid') 
        {
            this.style = 'invalid';
            this.error='Error: Usernames must be 4-64 characters.'
            return
        }
        this.http.post('/api/auth/validate-username', 
            {username:this.model})
            .subscribe((data:any) => {
                if(data.success) {
                    if(this.logintype == 'register') {
                        if(data.mode == 0 ){
                            this.style = 'valid';
                            this.error = '';
                        }
                        else {
                            this.style = 'invalid';
                            this.error = data.message;
                        }
                    }
                    if(this.logintype == 'login') {
                        if(data.mode == 1 ){
                            this.style = 'valid';
                            this.error = '';
                        }
                        else {
                            this.style = 'invalid';
                            this.error = 'Username not registered';
                        }
                    }
                }
                else {
                    this.style = 'invalid';
                    this.error = data.message;
                }
            });
    }

}
