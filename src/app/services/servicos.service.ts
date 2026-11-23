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
  profissionais?: string[];
  disponivel?: boolean;
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

  // GET - Buscar um único serviço pelo id (usado na página de detalhe)
  buscarServicoPorIdApi(id: string): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  // POST - Cadastrar um novo serviço na API
  adicionarServicoApi(
    servico: Omit<Servico, 'id'>
  ): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  // DELETE - Excluir um serviço da API
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
}
