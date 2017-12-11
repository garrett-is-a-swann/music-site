import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'profile',
    templateUrl: './profile.c.html'
})

export class ProfileComponent implements OnInit { 
    constructor(private http: HttpClient) {
    }

    //On intialization, we will display already saved graph-lists and band names
    //of default graph-list.
    ngOnInit(): void {
        //We will use array of user graphs here.
        let graphs = ["Graph1", "Graph2", "Graph3", "Graph4"]; 
        for (let i in graphs) {
           console.log(graphs[i]);
           if(i == "0") {
                document.getElementById("graphlist").innerHTML += "<a class=\"list-group-item list-group-item-action active pt-1\" style=\"height:35px;\" data-toggle=\"list\" href=\"\">" + graphs[i] + "</a>";
           }
           else {
            document.getElementById("graphlist").innerHTML += "<a class=\"list-group-item list-group-item-action pt-1\" style=\"height:35px;\" data-toggle=\"list\" href=\"\">" + graphs[i] + "</a>";
            }
        }

        //This will be the array of Bands from the default graph
        let bands = ["Red Hot Chili Peppers", "Ataxia", "Coheed and Cambria", "Queens of the Stone Age", "Royal Blood"];
        for(let i in bands) {
            document.getElementById("list_bands").innerHTML += "<li class=\"list-group-item list-group-item-into list-group-item-action pt-1\" style=\"height:35px;\">" + bands[i] + "</li>";
        }

    }
 
    profile_name = 'My Profile'
    
    username = 'usernameTMP';
    password = 'passTMP';
    email_addr = 'emailTMP';

    //Error flags
    usernameError = '';
    email_addrError = '';
    passwordError = '';

    errors: string[]=[];
    

    /*for(var name of this.graphs) {
        console.log(name);
       // 
    } */ 

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

    addGraph() {
        document.getElementById("graphlist").innerHTML += "<a class=\"list-group-item list-group-item-action pt-1\" style=\"height:35px;\" data-toggle=\"list\" href=\"\">" + (<HTMLInputElement>document.getElementById("newGraph")).value + "</a>";
        (<HTMLInputElement>document.getElementById("newGraph")).value = "";
    }
}
