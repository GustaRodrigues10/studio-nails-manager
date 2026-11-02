import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  servicos = [
    {
      id: 1,
      nome: 'Manicure clássica',
      descricao: 'Cuidado delicado das cutículas, hidratação e a sua cor favorita.',
      preco: 45,
      duracao: 45,
      categoria: 'Mãos e unhas',
      imagem: '/images/manicure-classica.jpg'
    },
    {
      id: 2,
      nome: 'Esmaltação em gel',
      descricao: 'Brilho intenso e acabamento impecável por muito mais tempo.',
      preco: 90,
      duracao: 60,
      categoria: 'Mãos e unhas',
      imagem: '/images/esmaltacao-gel.jpg'
    },
    {
      id: 3,
      nome: 'Spa dos pés',
      descricao: 'Esfoliação, hidratação e esmaltação para renovar seus passos.',
      preco: 75,
      duracao: 60,
      categoria: 'Pés e bem-estar',
      imagem: '/images/spa-pes.jpg'
    }
  ];
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