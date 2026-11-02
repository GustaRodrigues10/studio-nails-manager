import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { Relatorio } from './pages/relatorio/relatorio.component';
import { CadastroServicos } from './pages/cadastro-servicos/cadastro-servicos.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'relatorio', component: Relatorio },
  { path: 'cadastro-servicos', component: CadastroServicos }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}