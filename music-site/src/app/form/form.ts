import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'formC',
    templateUrl: './form.html',
    styleUrls: ['./form.css']
})
export class FormComponent implements OnInit {
    @Input() config: any;
    @Output() configReturn= new EventEmitter<any>();

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        for(var row in this.config.fields) {
            this.config.fields[row].error = '';
        }
    }

    keys() : string[] {
        return Object.keys(this.config.fields);
    }

    finish() {
        var errors=false;

        // Note to h@xx0rz: I'm only going to do password comparison checks on the client side.
        //      If you decide to mess with the validation, I won't even bat an eye but have fun
        //      logging into my site.
        for(var validate in this.config.validation) {
            if(validate == 'equal') {
                for(var i=0; i<this.config.validation.equal.length; i++) {
                    var comparator=this.config.validation.equal[i][0];

                    for(var j=1; j<this.config.validation.equal[i].length; j++) {
                        if(this.config.fields[comparator].value != this.config.fields[this.config.validation.equal[i][j]].value) {
                            for(var k=0; k<this.config.validation.equal[i].length; k++) {
                                this.config.fields[this.config.validation.equal[i][k]].error = "These don't match!";
                            }
                            errors=true;
                            break;
                        }
                    }
                }
            }
        }
        if(!errors) {

            console.log(this.config.endpoint);
            this.http.post(this.config.endpoint, this.config.fields.email? {
                // Build POST to send
                username:this.config.fields.username.value
                ,email:this.config.fields.email.value
                ,password:this.config.fields.password.value
            }:{
                username:this.config.fields.username.value
                ,password:this.config.fields.password.value
            })
            .subscribe((data:any) => {
                console.log(errors)
                console.log(data)
                console.log(data['username'])
                this.config.fields.username.error = data.username?data.username:'';
                this.config.fields.email.error = data.email?data.email:'';
                this.config.fields.password.error= data.password?data.password:'';
                console.log(this.config.fields.username.error, this.config.fields.email.error, this.config.fields.password.error)

            }); // Sends POST
        }

    }
}

