import { Injectable } from '@angular/core';

export interface Servico {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  duracao: number;
  imagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  private servicos: Servico[] = [
    {
      id: 1,
      nome: 'Manicure clássica',
      categoria: 'Mãos e unhas',
      descricao: 'Cuidado delicado das cutículas, hidratação e a sua cor favorita.',
      preco: 45,
      duracao: 45,
      imagem: '/images/manicure-classica.jpg'
    },
    {
      id: 2,
      nome: 'Esmaltação em gel',
      categoria: 'Mãos e unhas',
      descricao: 'Brilho intenso e acabamento impecável por muito mais tempo.',
      preco: 90,
      duracao: 60,
      imagem: '/images/esmaltacao-gel.jpg'
    },
    {
      id: 3,
      nome: 'Spa dos pés',
      categoria: 'Pés e bem-estar',
      descricao: 'Esfoliação, hidratação e esmaltação para renovar seus passos.',
      preco: 75,
      duracao: 60,
      imagem: '/images/spa-pes.jpg'
    }
  ];

  listarServicos(): Servico[] {
    return this.servicos;

  }
  
adicionarServico(servico: Servico): void {
  this.servicos.push(servico);
}

editarServico(servicoAtualizado: Servico): void {
  const posicao = this.servicos.findIndex(
    servico => servico.id === servicoAtualizado.id
  );

  if (posicao !== -1) {
    this.servicos[posicao] = servicoAtualizado;
  }
}

excluirServico(id: number): void {
  this.servicos = this.servicos.filter(
    servico => servico.id !== id
  );
}
}