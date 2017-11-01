import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { IndexView } from './app.component';
import { LoginComponent } from './login.component';

import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

@NgModule({ 
    declarations: [ 
        IndexView,
        LoginComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        // Include it under 'imports' in your application module
        // after BrowserModule.
        HttpClientModule,
    ],
    exports: [ RouterModule ],
    providers: [],
    bootstrap: [IndexView]
})
export class AppModule { }
