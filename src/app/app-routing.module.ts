import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrizComponent } from './paginas/matriz/matriz.component';
import { ResultadosComponent } from './paginas/resultados/resultados.component';

const routes: Routes = [
  {path:'', redirectTo:'matriz', pathMatch:'full'},
  {path: 'matriz', component: MatrizComponent},
  {path: 'resultados', component: ResultadosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
