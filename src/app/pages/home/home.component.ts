import { Component, OnInit } from '@angular/core';
import { ServicosService, Servico } from '../../services/servicos.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  servicos: Servico[] = [];
  categoriaSelecionada = 'Todos os serviços';
  erroCarregamento = '';

  constructor(private servicosService: ServicosService) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    this.servicosService.buscarServicosApi().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.erroCarregamento = '';
      },
      error: (erro) => {
        console.error('Erro ao buscar serviços:', erro);
        this.erroCarregamento = 'Não foi possível carregar os serviços.';
      }
    });
  }

  get servicosFiltrados(): Servico[] {
    if (this.categoriaSelecionada === 'Todos os serviços') {
      return this.servicos;
    }

    return this.servicos.filter(servico =>
      servico.categoria === this.categoriaSelecionada
    );
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }
}