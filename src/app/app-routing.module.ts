import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrizComponent } from './paginas/matriz/matriz.component';

const routes: Routes = [
  {path:'', redirectTo:'matriz', pathMatch:'full'},
  {path: 'matriz', component: MatrizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
