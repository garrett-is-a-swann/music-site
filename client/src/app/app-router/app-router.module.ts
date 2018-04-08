import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { IndexComponent } from '../index/index.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { GraphComponent } from '../graph-component/graph.component';
//import { ForOhForComponent } from '../for-oh-for/for-oh-for.component';
//import { LobbyComponent } from '../lobby/lobby.component';

import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';

const routes: Routes = [
    {   path: ''
        ,component: IndexComponent 
        ,children: [
            { path: '', component: GraphComponent },
            { path: 'login', component: LoginFormComponent },
            { path: 'register',  component: RegisterFormComponent },
            {
                path: ''
                ,canActivateChild: [AuthGuardService]
                ,children: [
                    //{ path: '', redirectTo: '/lobby', pathMatch: 'full' },
                    //{ path: 'lobby', component: ProfileComponent },
                    //{ path: 'lobby/:tab', component: ProfileComponent },
                ]
            }
        ],
    },
    { path: '**', component: IndexComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuardService,
        AuthService,
        //ProfileService
    ],
    declarations: [
    ]
})
export class AppRouterModule { }
