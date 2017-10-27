import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class IndexView{// implements OnInit {
    //bands: string[];

    //constructor(private http: HttpClient) {}

    //ngOnInit(): void {
        //this.http.get('/bands').subscribe(data => {
            //this.bands = data['name']
            //});
        //}
    title = 'app';
    clickMessage="You're a cool dude"
    clicked = false

    typed = ''

    onKey(value: string) { // without type info
        this.typed = value;
    }
}
