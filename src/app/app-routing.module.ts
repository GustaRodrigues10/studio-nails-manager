import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { Relatorio } from './pages/relatorio/relatorio.component';
import { CadastroServicos } from './pages/cadastro-servicos/cadastro-servicos.component';
import { Sobre } from './pages/sobre/sobre.component';
import { DetalheServico } from './pages/detalhe-servico/detalhe-servico.component';
import { Login } from './pages/login/login.component';
import { CadastroCliente } from './pages/cadastro-cliente/cadastro-cliente.component';
import { MeusAgendamentos } from './pages/meus-agendamentos/meus-agendamentos.component';

const routes: Routes = [
  // Site do ateliê (área da cliente)
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sobre', component: Sobre },
  { path: 'servicos/:id', component: DetalheServico },
  { path: 'login', component: Login },
  { path: 'cadastro', component: CadastroCliente },
  { path: 'meus-agendamentos', component: MeusAgendamentos },

  // Área administrativa
  { path: 'relatorio', component: Relatorio },
  { path: 'cadastro-servicos', component: CadastroServicos },

  // Qualquer endereço desconhecido volta para o início
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled', // permite links como /home#servicos
      scrollPositionRestoration: 'enabled' // nova página abre no topo
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
