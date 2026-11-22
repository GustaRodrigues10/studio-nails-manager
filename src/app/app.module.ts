import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { Relatorio } from './pages/relatorio/relatorio.component';
import { CadastroServicos } from './pages/cadastro-servicos/cadastro-servicos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [App, HomeComponent, Relatorio, CadastroServicos],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
