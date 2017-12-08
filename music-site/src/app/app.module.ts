import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import our Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './register.c';
import { ProfileComponent } from './profile.c';
import { IndexView } from './index.component';
import { LoginComponent } from './login/login';
import { FormComponent } from './form/form';

// Import Services
import { AuthService } from './services/auth.service';


@NgModule({ 
    declarations: [ 
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        IndexView,
        FormComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        // Include it under 'imports' in your application module
        // after BrowserModule.
        FormsModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [ RouterModule ],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }
