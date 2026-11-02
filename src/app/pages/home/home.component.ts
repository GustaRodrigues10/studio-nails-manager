import { Component } from '@angular/core';
import { ServicosService, Servico } from '../../services/servicos.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  servicos: Servico[];

constructor(private servicosService: ServicosService) {
  this.servicos = this.servicosService.listarServicos();
}
  categoriaSelecionada = 'Todos os serviços';

get servicosFiltrados() {
  if (this.categoriaSelecionada === 'Todos os serviços') {
    return this.servicos;
  }

  return this.servicos.filter(servico =>
    servico.categoria === this.categoriaSelecionada
  );
}

selecionarCategoria(categoria: string) {
  this.categoriaSelecionada = categoria;
}

}