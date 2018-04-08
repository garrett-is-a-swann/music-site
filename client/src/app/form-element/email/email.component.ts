import { Component, OnInit } from '@angular/core';
import { ClockService } from '../clock.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-email',
    providers: [ ClockService ],
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
    model: string = '';
    error: string = '';
    style: string = '';

    constructor(private http: HttpClient, private clock: ClockService) {
        clock.init(()=>{this.postValidate()});
    }

    ngOnInit() {
    }

    validate() {
        this.clock.restart()
    }

    postValidate() {
        // Face check the data
        if( this.model.length == 0) {
            this.style = '';
            return;
        }
        if( /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.exec(this.model) == null) 
        {
            this.style='invalid';
            this.error="Error: This field is for emails, not gobbledygook.";
            return;
        }
        // Ask the server
        this.http.post('/api/auth/validate-email', 
            {email:this.model})
            .subscribe((data:any) => {
                if(data.success) {
                    this.style = 'valid';
                    this.error = '';
                }
                else {
                    this.style = 'invalid';
                    this.error = data.message;
                }
            });
    }

}
