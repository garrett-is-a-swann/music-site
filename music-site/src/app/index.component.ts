import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css'],
})
export class IndexView implements OnInit, AfterViewInit{
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


    // Init Cytoscape with Jquery
    ngAfterViewInit(): void {
       cytoscape({
            container: document.getElementById('cy'), // container to render in
            elements: [
                { data: { id: 'a' } },
                { data: { id: 'b' } },
                { data: { id: 'c' } },
                { data: { id: 'd' } },
                { data: { id: 'e' } },
                { data: { id: 'f' } },
                {
                    data: {
                        id: 'ab',
                        source: 'a',
                        target: 'b'
                    }
                },
                {
                    data: {
                        id: 'cd',
                        source: 'c',
                        target: 'd'
                    }
                },
                {
                    data: {
                        id: 'ef',
                        source: 'e',
                        target: 'f'
                    }
                },
                {
                    data: {
                        id: 'ac',
                        source: 'a',
                        target: 'c'
                    }
                },
                {
                    data: {
                        id: 'be',
                        source: 'b',
                        target: 'e'
                    }
                }
            ],
            layout: {
                name: 'cose'
            },
            style: [
                {
                    selector: 'node',
                    style: {
                        'width': '50%',
                        'height': '50%',
                        'background-color': 'red',
                        'label': 'data(id)',
                        'text-valign': 'center'
                    }
                }]
        });
    };

}
