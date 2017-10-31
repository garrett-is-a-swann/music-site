import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class IndexView implements OnInit {
    bands: string[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get('/api/bands').subscribe(data => {
            //console.log(data)
            for(var index in data)
            {
                //console.log(data[index])
                this.bands.push(data[index]['name'])
            }
        });
    }
    title = 'app';

    typed = ''

    onKey(value: string, isClicked: boolean) { // without type info
        this.typed = value;
        console.log(isClicked);
        if( isClicked ) {
            this.http.post('/api/bands',
                // Build POST to send
                {
                    name:this.typed
                })
            .subscribe(); // Sends POST
        }
    }
}
