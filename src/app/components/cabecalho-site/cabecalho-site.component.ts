import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

// Cabeçalho das páginas públicas (Menu, Serviços, Sobre nós, Entrar)
@Component({
  selector: 'app-cabecalho-site',
  standalone: false,
  templateUrl: './cabecalho-site.component.html',
})
export class CabecalhoSite {
  // Recebe da página qual item do menu deve ficar destacado
  @Input() paginaAtiva = '';

  constructor(
    public clientesService: ClientesService,
    private router: Router,
  ) {}

  sair(): void {
    this.clientesService.sair();
    this.router.navigate(['/home']);
  }
}
