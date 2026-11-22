import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servico {
  id: string;
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

  private apiUrl = 'http://localhost:3000/servicos';

  constructor(private http: HttpClient) {}

  // GET - Buscar todos os serviços na API
  buscarServicosApi(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  // POST - Cadastrar um novo serviço na API
  adicionarServicoApi(
    servico: Omit<Servico, 'id'>
  ): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  excluirServicoApi(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

  // PUT - Atualizar um serviço existente na API
  editarServicoApi(servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(
      `${this.apiUrl}/${servico.id}`,
      servico
    );
  }

  // Lista temporária utilizada pelas páginas antigas
  private servicos: Servico[] = [
    {
      id: '1',
      nome: 'Manicure clássica',
      categoria: 'Mãos e unhas',
      descricao: 'Cuidado delicado das cutículas, hidratação e a sua cor favorita.',
      preco: 45,
      duracao: 45,
      imagem: '/images/manicure-classica.jpg'
    },
    {
      id: '2',
      nome: 'Esmaltação em gel',
      categoria: 'Mãos e unhas',
      descricao: 'Brilho intenso e acabamento impecável por muito mais tempo.',
      preco: 90,
      duracao: 60,
      imagem: '/images/esmaltacao-gel.jpg'
    },
    {
      id: '3',
      nome: 'Spa dos pés',
      categoria: 'Pés e bem-estar',
      descricao: 'Esfoliação, hidratação e esmaltação para renovar seus passos.',
      preco: 75,
      duracao: 60,
      imagem: '/images/spa-pes.jpg'
    }
  ];

  // Método antigo - Listar serviços em memória
  listarServicos(): Servico[] {
    return this.servicos;
  }

  // Método antigo - Adicionar serviço em memória
  adicionarServico(servico: Servico): void {
    this.servicos.push(servico);
  }

  // Método antigo - Editar serviço em memória
  editarServico(servicoAtualizado: Servico): void {
    const posicao = this.servicos.findIndex(
      servico => servico.id === servicoAtualizado.id
    );

    if (posicao !== -1) {
      this.servicos[posicao] = servicoAtualizado;
    }
  }

  // Método antigo - Excluir serviço em memória
  excluirServico(id: string): void {
    this.servicos = this.servicos.filter(
      servico => servico.id !== id
    );
  }
}