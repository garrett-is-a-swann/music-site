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
    userid;
    graphs_arr = [];
    username;

    ngOnInit(): void {
        //We will use array of user graphs here.
        var data_graphs;

        this.http.get('/api/user').subscribe((data_graphs:any) => {
            if(data_graphs.success) {
                this.userid = data_graphs.json.userid;
                for(let entry in data_graphs.json.list) {
                    console.log((data_graphs.json.list[entry]).id + ": " + (data_graphs.json.list[entry]).name);

                    this.graphs_arr.push({id: data_graphs.json.list[entry].id, name: data_graphs.json.list[entry].name})
                }
                console.log(data_graphs.json)
                if(data_graphs.json.list.length) {
                    this.http.get('/api/user/' + data_graphs.json.userid + '/list/' + data_graphs.json.list[0].id).subscribe((data_bands:any) => {
                        if(data_bands.success) {
                            for(let entry in data_bands.json.band) {
                                console.log((data_bands.json.band[entry]).name + ": " + (data_bands.json.band[entry]).name);
                                document.getElementById("list_bands").innerHTML += "<li class=\"list-group-item list-group-item-into list-group-item-action pt-1\" style=\"height:35px;\">" + (data_bands.json.band[entry]).name + "</li>";
                            }
                        }
                        else {
                            console.log(data_bands.message);
                        }
                    });
                }
            }
            else {
                console.log(data_graphs.message);
            }
        });

        this.http.get('/api/user/' + this.userid).subscribe((name_data:any) => {
            if(data_graphs.success) {
                this.username = name_data.json.name;
            }
        });
    }

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

    addGraph() {

        var graph_name = (<HTMLInputElement>document.getElementById("newGraph")).value

        this.http.post('/api/user',
        {
            name:graph_name
        }).subscribe((data:any) => {
            if(data.success){
                document.getElementById("graphlist").innerHTML += "<a class=\"list-group-item list-group-item-action pt-1\" style=\"height:35px;\" data-toggle=\"list\" href=\"\">" + (<HTMLInputElement>document.getElementById("newGraph")).value + "</a>";
                (<HTMLInputElement>document.getElementById("newGraph")).value = "";
            }
            else {
                // Display some error from data.message
            }
        });
            ;

    }

    showGraphContents(graph_name) {

        console.log(graph_name);

        this.http.get('/api/user/' + this.userid + '/list/' + graph_name.id).subscribe((data_bands:any) => {
            console.log(data_bands)
            document.getElementById("list_bands").innerHTML = "";
            if(data_bands.success) {
                for(let entry in data_bands.json) {
                    console.log((data_bands.json[entry]).name + ": " + (data_bands.json[entry]).name);
                    document.getElementById("list_bands").innerHTML += "<li class=\"list-group-item list-group-item-into list-group-item-action pt-1\" style=\"height:35px;\">" + (data_bands.json[entry]).name + "</li>";
                }
            }
            else {
                console.log(data_bands.message);
            }
        });

    }

}
