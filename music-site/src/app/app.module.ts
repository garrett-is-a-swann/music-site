import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { IndexView } from './app.component';

//import {BrowserModule} from '@angular/platform-browser';
//import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        IndexView,
        //BrowserModule,
        // Include it under 'imports' in your application module
        // after BrowserModule.
        //HttpClientModule,
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [IndexView]
})
export class AppModule { }
