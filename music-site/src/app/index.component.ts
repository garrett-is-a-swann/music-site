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

    cy = undefined;

    JSONARRAY = [["Ataxia","experimental rock|post-punk|psychedelic rock|electronica|art rock"],
        ["Audioslave","alternative metal|post-grunge|alternative rock|hard rock"],
        ["Axis of Justice","alternative rock"],
        ["Dominus","death metal"],
        ["Future User","electronic rock"],
        ["Jane's Addiction","funk metal|neo-psychedelia|alternative metal|alternative rock|psychedelic rock"],
        ["John Frusciante","rock"],
        ["One Day as a Lion","rap rock"],
        ["Prophets of Rage","rap metal|rap rock"],
        ["Rage Against the Machine","rap rock|alternative metal|funk metal|rap metal|nu metal"],
        ["Red Hot Chili Peppers","alternative rock|funk rock|rap rock|funk metal"],
        ["Soundgarden","hard rock|alternative metal|alternative rock|heavy metal|grunge"],
        ["Street Sweeper Social Club","funk rock|hard rock|rap rock"],
        ["System of a Down","nu metal|hard rock|progressive metal|alternative metal"],
        ["Temple of the Dog","grunge"],
        ["The Last Internationale","alternative rock"],
        ["The Mars Volta","progressive rock|experimental rock"],
        ["The Nightwatchman","folk rock"],
        ["Volbeat","psychobilly|heavy metal|hard rock"],
        ["WAKRAT","hard rock|alternative rock|punk rock"],
        ["fuck", "fucking rock n' roll, bitch"]];

    onKey(enter) {
        /*for(var i = 0; i < this.JSONARRAY.length; i++) {
            var obj = this.JSONARRAY[i];
            console.log(obj[0]);
        }*/
    }
    

    // Init Cytoscape with Jquery
    ngAfterViewInit(): void {
       this.cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
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

    myFunction(input) {

        //FINDS BAND FROM JSON OBJECT
        var band_exists = false;
        for(var i = 0; i < this.JSONARRAY.length; i++) {
            var obj = this.JSONARRAY[i];
            var genres_string = "";
            if(input == obj[0]) {
                band_exists = true;
                console.log(obj[0]);
                genres_string = obj[1];
                break;
            }
        }
        if(band_exists == false) {
            console.log("Band \""+input+"\" does not exist.");
            return;
        }

        //PARSES GENRE STRINGS FROM BAND AND LOADS THEM INTO INTO ARRAY 'genres'
        var genres = genres_string.split('|');

        //IF THERE IS ONLY ONE GENRE ASSOCIATED WITH THE BAND...
        if(genres.length == 1) {
            var node_name = genres[0];
            if(this.cy.$id(node_name).isNode()) {
                var node = this.cy.$id(node_name);
                var w = parseInt(node.renderedStyle('width'));
                node.style('width', (w+10)+'%');
                node.style('height', (w+10)+'%');
                //node.style('padding', (parseInt(node.renderedStyle('padding'))+10)+'px')
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
                name: 'cose',
                fit: true,
                nodeRepulsion: 650000,
                gravity: 4,
                padding: 10
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
                    console.log(i);
                    for(var j=i+1; j<genres.length; j++) {
                        var a_node_name = genres[i];
                        var b_node_name = genres[j];
                       // console.log(a_node_name + "/" + b_node_name);
                       if(this.cy.$id(a_node_name).isNode() && j == i+1 && i == 0) {
                            var node = this.cy.$id(a_node_name);
                            var w = parseInt(node.renderedStyle('width'));
                            var fs = parseInt(node.renderedStyle('font-size'));
                            node.style('width', (w+15)+'%');
                            node.style('height', (w+15)+'%');
                            node.style('font-size', fs+3+'%');
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
                            node.style('width', (w+15)+'%');
                            node.style('height', (w+15)+'%');
                            node.style('font-size', fs+3+'%');
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
                         //   alert("shit do not exist");
                            this.cy.add({
                                data: {
                                    id: a_node_name + '/' + b_node_name,
                                    source: a_node_name,
                                    target: b_node_name,
                                    /*style: {'source-distance-from-node': '100%',
                                        'target-distance-from-node': '100%'
                                    }*/
                                }
                            });
                            //if(this.cy.$id(a_node_name
                        }

                    }
                }
                
            }
            this.cy.layout({
                name: 'cose'
            }).run();
        }

        /*JUST ADDING NODE A
        if(b_node_name == "" && a_node_name != "") {
            if(this.cy.$id(a_node_name).isNode()) {
                var node = this.cy.$id(a_node_name);
                var w = parseInt(node.renderedStyle('width'));
                node.style('width', (w+10)+'%');
                node.style('height', (w+10)+'%');
                node.style('padding', (parseInt(node.renderedStyle('padding'))+10)+'px')
            }
            else {
                this.cy.add({
                data: { id: a_node_name },
                style: {'background-color': 'green',
                        'height': '65%',
                        'width': '65%'}
                });
            }
            this.cy.fit();
            var dist_node = this.cy.$id('9');
            dist_node.data('parent', 'a');
           // alert(dist_node.isParent());
        }

        /*JUST ADDING NODE B
        if(a_node_name == "" && b_node_name != "") {
            if(this.cy.$id(b_node_name).isNode()) {
                var node = this.cy.$id(b_node_name);
                var w = parseInt(node.renderedStyle('width'));
                node.style('width', (w+10)+'%');
                node.style('height', (w+10)+'%');
            }
            else {
                this.cy.add({
                data: { id: b_node_name },
                style: {'background-color': 'green',
                        'height': '65%',
                        'width': '65%'}
                });
            }
            this.cy.fit();
        }

        /*ADDING BOTH NODE A AND B WITH EDGE(A,B)
        if(a_node_name != "" && b_node_name != "") {
            if(this.cy.$id(a_node_name).isNode()) {
                var node = this.cy.$id(a_node_name);
                var w = parseInt(node.renderedStyle('width'));
                node.style('width', (w+10)+'%');
                node.style('height', (w+10)+'%');
            }
            else {
                this.cy.add({
                data: { id: a_node_name },
                style: {'background-color': 'green',
                        'height': '65%',
                        'width': '65%'}
                });
            }
            if(this.cy.$id(b_node_name).isNode()) {
                var node = this.cy.$id(b_node_name);
                var w = parseInt(node.renderedStyle('width'));
                node.style('width', (w+10)+'%');
                node.style('height', (w+10)+'%');
            }
            else {
                this.cy.add({
                data: { id: b_node_name },
                style: {'background-color': 'green',
                        'height': '65%',
                        'width': '65%'}
                });
            }
            this.cy.fit();

            if(this.cy.$id(a_node_name+"/"+b_node_name).isEdge() == false && 
                this.cy.$id(b_node_name+"/"+a_node_name).isEdge() == false) {
             //   alert("shit do not exist");
                this.cy.add({
                    data: {
                        id: a_node_name + '/' + b_node_name,
                        source: a_node_name,
                        target: b_node_name
                    }
                });
            }
        }*/


    }

}


