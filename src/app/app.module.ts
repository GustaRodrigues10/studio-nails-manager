import { LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { Relatorio } from './pages/relatorio/relatorio.component';
import { CadastroServicos } from './pages/cadastro-servicos/cadastro-servicos.component';
import { Sobre } from './pages/sobre/sobre.component';
import { DetalheServico } from './pages/detalhe-servico/detalhe-servico.component';
import { Login } from './pages/login/login.component';
import { CadastroCliente } from './pages/cadastro-cliente/cadastro-cliente.component';
import { Logo } from './components/logo/logo.component';
import { CabecalhoSite } from './components/cabecalho-site/cabecalho-site.component';
import { RodapeSite } from './components/rodape-site/rodape-site.component';
import { MenuAdmin } from './components/menu-admin/menu-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Formata moeda e números no padrão brasileiro (ex.: R$ 45,00)
registerLocaleData(localePt);

@NgModule({
  declarations: [
    App,
    HomeComponent,
    Relatorio,
    CadastroServicos,
    Sobre,
    DetalheServico,
    Login,
    CadastroCliente,
    Logo,
    CabecalhoSite,
    RodapeSite,
    MenuAdmin,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [App],
})
export class AppModule {}
