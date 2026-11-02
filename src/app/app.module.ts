import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { Relatorio } from './pages/relatorio/relatorio.component';
import { CadastroServicos } from './pages/cadastro-servicos/cadastro-servicos.component';

@NgModule({
  declarations: [App, HomeComponent, Relatorio, CadastroServicos],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
