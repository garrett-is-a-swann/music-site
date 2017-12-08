import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import our Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.c';
import { ProfileComponent } from './profile.c';
import { IndexView } from './index.component';


@NgModule({ 
    declarations: [ 
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        IndexView
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        // Include it under 'imports' in your application module
        // after BrowserModule.
        FormsModule,
        HttpClientModule,
    ],
    exports: [ RouterModule ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
