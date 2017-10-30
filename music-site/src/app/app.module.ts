import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IndexView } from './app.component';

import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        IndexView,
    ],
    imports: [
        BrowserModule,
        // Include it under 'imports' in your application module
        // after BrowserModule.
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [IndexView]
})
export class AppModule { }
