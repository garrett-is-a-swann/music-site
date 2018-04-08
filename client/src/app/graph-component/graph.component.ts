import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

    cy = undefined;
    node_style = {'background-color': '#A1E6A5',
            'height': '75%',
            'width': '75%',
            'font-size': '20%',
            'font-weight': '500',
            'border-color': 'green',
        'border-width': '3px'}

    save_alert:boolean=true;

    graphselector_val=''
    graphSelected(value) {
        console.log(this.graphselector_val)
    }

    constructor(private http: HttpClient) {}

    ngOnInit() {

        this.cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            layout: {
                name: 'cose-bilkent',
                fit: true,             
                padding: 5,            
                randomize: true,     
                nodeRepulsion: 200000,   
                idealEdgeLength: 400,    
                edgeElasticity: 0.9,       
                nestingFactor: 0.9,        
                gravity: 0.4,             
                numIter: 2500,        
                tile: true,                
                animate: true,             
                tilingPaddingVertical: 80,  
                tilingPaddingHorizontal: 80
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

        this.boing();
    }

    postBand(bandinput) {
        this.http.post('/api/music/bands',
            // Build POST to send
            {
                name:bandinput
            }).subscribe((data:any) => {
                if(data.success) {
                    this.graphPush(data.json.name, data.json.genres);
                }
                else {
                }
            });
    }



    boing() {
        // Add elasticity 
        this.cy.layout({
            name: 'cose-bilkent',
            fit: true,             
            padding: 5,            
            randomize: true,     
            nodeRepulsion: 200000,   
            idealEdgeLength: 400,    
            edgeElasticity: 0.9,       
            nestingFactor: 0.9,        
            gravity: 0.4,             
            numIter: 2500,        
            tile: true,                
            animate: true,             
            tilingPaddingVertical: 80,  
            tilingPaddingHorizontal: 80
        }).run();
        this.cy.resize();
        this.cy.fit();
    }

    inflate(node) {
        var w = parseInt(node.renderedStyle('width'));
        var fs = parseInt(node.renderedStyle('font-size'));
        node.style('width', (w+30)+'%');
        node.style('height', (w+30)+'%');
        node.style('font-size', fs+8+'%');
    }

    graphPush(band_name:string, genre_psv:string): void {
        let genres: string[] = genre_psv.split('|');

        // Create / Inflate Nodes
        for(var i=0; i<genres.length; i++) {
            if(this.cy.$id(genres[i]).isNode()) {
                this.inflate(this.cy.$id(genres[i]))
            } else {
                this.cy.add({
                    data: {id: genres[i]}
                    ,style: this.node_style
                });
            }
        }

        for(var i=0; i<genres.length; i++) {
            for(var j=0; j<genres.length; j++) {
                if( i==j 
                    || this.cy.$id(genres[i]+"/"+genres[j]).isEdge()  
                    || this.cy.$id(genres[j]+"/"+genres[i]).isEdge()) 
                {
                    continue;
                }
                this.cy.add({
                    data: {
                        id: genres[i] + '/' + genres[j],
                        source: genres[i],
                        target: genres[j],
                    }
                });
            }
        }
        this.boing();
    }
}
