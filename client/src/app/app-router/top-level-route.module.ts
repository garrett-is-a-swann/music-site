import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


//import { ForOhForComponent } from '../for-oh-for/for-oh-for.component';
import { IndexComponent } from '../index/index.component';
import { AppComponent } from '../app.component';



const routes: Routes = [
    { path: '', component: AppComponent },
    { path: '**', component: IndexComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)

    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class TopLevelRouteModule { }
