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

        console.log(this.config);
        var pass_error = document.getElementById("password_err");
        var conf_pass_error = document.getElementById("confirm_password_err");
        var username_error = document.getElementById("username_err");
        var email_error = document.getElementById("email_err");

        if(pass_error != null) {
            pass_error.style.display = "none";
            conf_pass_error.style.display = "none";
            username_error.style.display = "none";
            email_error.style.display = "none";
        }

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
                            pass_error.style.display = "block";
                            conf_pass_error.style.display = "block";
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

                this.config.fields.username.error = !data.success?data.errors.username:'';
                if(this.config.fields.username.error != '') {
                    this.config.fields["username"].error = "Username is already in use.";
                    username_error.style.display = "block";
                }

                this.config.fields.email.error = !data.success?data.errors.email:'';
                if(this.config.fields.email.error != '') {
                    this.config.fields["email"].error = "Email has been taken.";
                    email_error.style.display = "block";
                }

                this.config.fields.password.error= !data.success?data.errors.password:'';
                console.log(this.config.fields.username.error, this.config.fields.email.error, this.config.fields.password.error)

                if(this.config.fields.username.error == '' && this.config.fields.email.error == '' && this.config.fields.password.error == '') {
                    document.getElementById("reg_success").hidden = false;
                    
                }

            }); // Sends POST
        }

    }
}

