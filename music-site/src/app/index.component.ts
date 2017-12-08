import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css'],
})
export class IndexView implements OnInit, AfterViewInit{
    constructor(private http: HttpClient) {}

    graphPush(band_name:string, genre_psv:string): void {
        // Simplify String
        var condensed_input = band_name.replace(/\s/g, '').toLowerCase();

        //PARSES GENRE STRINGS FROM BAND AND LOADS THEM INTO INTO ARRAY 'genres'
        let genres: string[] = genre_psv.split('|');

        //IF THERE IS ONLY ONE GENRE ASSOCIATED WITH THE BAND...
        if(genres.length == 1) {
            var node_name = genres[0];
            if(this.cy.$id(node_name).isNode()) {
                var node = this.cy.$id(node_name);
                var w = parseInt(node.renderedStyle('width'));
                var fs = parseInt(node.renderedStyle('font-size'));
                node.style('width', (w+30)+'%');
                node.style('height', (w+30)+'%');
                node.style('font-size', fs+8+'%');
            }
            else {
                this.cy.add({
                    data: { id: node_name },
                    style: {'background-color': '#A1E6A5',
                        'height': '65%',
                        'width': '65%',
                        'font-size': '10%',
                        'font-weight': '500',
                        'border-color': 'green',
                        'border-width': '3px'}
                });
            }
            this.cy.fit();
            var dist_node = this.cy.$id('9');
            dist_node.data('parent', 'a');

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
        else {
            for(var i=0; i<genres.length-1; i++) {
                if(i == genres.length) {
                    if(i == 0) {

                    }
                    return;
                }
                else {
                    var genre = genres[i]
                    for(var j=i+1; j<genres.length; j++) {
                        var a_node_name = genres[i];
                        var b_node_name = genres[j];
                        if(this.cy.$id(a_node_name).isNode() && j == i+1 && i == 0) {
                            var node = this.cy.$id(a_node_name);
                            var w = parseInt(node.renderedStyle('width'));
                            var fs = parseInt(node.renderedStyle('font-size'));
                            node.style('width', (w+30)+'%');
                            node.style('height', (w+30)+'%');
                            node.style('font-size', fs+8+'%');
                        }
                        else {
                            if(!this.cy.$id(a_node_name).isNode()) {
                                this.cy.add({
                                    data: { id: a_node_name },
                                    style: {'background-color': '#A1E6A5',
                                        'height': '65%',
                                        'width': '65%',
                                        'font-size': '10%',
                                        'font-weight': '500',
                                        'border-color': 'green',
                                        'border-width': '3px'}
                                });
                            }
                        }
                        if(this.cy.$id(b_node_name).isNode() && i == 0) {
                            var node = this.cy.$id(b_node_name);
                            var w = parseInt(node.renderedStyle('width'));
                            var fs = parseInt(node.renderedStyle('font-size'));
                            node.style('width', (w+30)+'%');
                            node.style('height', (w+30)+'%');
                            node.style('font-size', fs+8+'%');
                        }
                        else {
                            if(!this.cy.$id(b_node_name).isNode()) {
                                this.cy.add({
                                    data: { id: b_node_name },
                                    style: {'background-color': '#A1E6A5',
                                        'height': '65%',
                                        'width': '65%',
                                        'font-size': '10%',
                                        'font-weight': '500',
                                        'border-color': 'green',
                                        'border-width': '3px'}
                                });
                            }
                        }
                        this.cy.fit();


                        if(this.cy.$id(a_node_name+"/"+b_node_name).isEdge() == false && 
                            this.cy.$id(b_node_name+"/"+a_node_name).isEdge() == false) {
                            this.cy.add({
                                data: {
                                    id: a_node_name + '/' + b_node_name,
                                    source: a_node_name,
                                    target: b_node_name,
                                }
                            });
                        }

                    }
                }

            }
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
        }

    }



    ngOnInit(): void {
        console.log('memes');
        this.http.get('/api/bands').subscribe((data:any) => {
            console.log(data)
            if(data.success) {
                for(var i = 0; i < data.json.length; i++) {
                    this.graphPush(data.json[i].name, data.json[i].genres)
                }
            }
        });
    }


    userInput = '';
    bandError = '';

    cy = undefined;

    // Init Cytoscape with Jquery
    ngAfterViewInit(): void {
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

    };

    myFunction(input) {
        this.bandError = '';
        this.http.post('/api/bands',
            // Build POST to send
            {
                name:this.userInput
            }).subscribe((data:any) => {
                console.log(data)
                if(data.success) {
                    this.graphPush(data.json.name, data.json.genres);
                }
                else {
                    this.bandError = data.message;
                }
            });
        this.userInput = '';
    }

}
