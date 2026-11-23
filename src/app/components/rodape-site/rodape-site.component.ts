import { Component } from '@angular/core';

// Rodapé das páginas públicas
@Component({
  selector: 'app-rodape-site',
  standalone: false,
  templateUrl: './rodape-site.component.html',
})
export class RodapeSite {
  anoAtual = new Date().getFullYear();
}
