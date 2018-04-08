import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TopLevelRouteModule } from './app-router/top-level-route.module';
import { AppRouterModule } from './app-router/app-router.module';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
    import { LoginComponent } from './form-element/login/login.component';
    import { PasswordComponent } from './form-element/password/password.component';
    import { EmailComponent } from './form-element/email/email.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { GraphComponent } from './graph-component/graph.component';
import { IndexComponent } from './index/index.component';
//import { RegisterComponent } from './register.c';
//import { ProfileComponent } from './profile.c';
//import { IndexView } from './index.component';
//import { LoginComponent } from './login/login';
//import { FormComponent } from './form/form';




@NgModule({ 
    declarations: [ 
        AppComponent,
        IndexComponent,
        LoginFormComponent,
            LoginComponent,
            PasswordComponent,
            EmailComponent,
        RegisterFormComponent,
        GraphComponent,
        //LoginComponent,
        //RegisterComponent,
        //ProfileComponent,
        //IndexView,
        //FormComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRouterModule,
        TopLevelRouteModule 
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
