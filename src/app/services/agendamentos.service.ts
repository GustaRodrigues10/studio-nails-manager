import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agendamento {
  id: string;
  horario: string;
  cliente: string;
  servico: string;
  profissional: string;
  valor: number;
  status: string;
  data?: string; // formato AAAA-MM-DD (usado nos agendamentos feitos pelo site)
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentosService {
  private apiUrl = 'http://localhost:3000/agendamentos';

  constructor(private http: HttpClient) {}

  // GET - Busca os agendamentos no JSON-Server
  listarAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  // POST - Cria um novo agendamento no JSON-Server
  criarAgendamento(agendamento: Omit<Agendamento, 'id'>): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, agendamento);
  }

  // Pesquisa e filtra os dados recebidos da API
  pesquisarAgendamentos(
    agendamentos: Agendamento[],
    pesquisaCliente: string,
    statusSelecionado: string,
  ): Agendamento[] {
    const pesquisa = pesquisaCliente.toLowerCase().trim();

    return agendamentos.filter((agendamento) => {
      const correspondeNome = agendamento.cliente.toLowerCase().includes(pesquisa);

      const correspondeStatus =
        statusSelecionado === 'Todos os status' || agendamento.status === statusSelecionado;

      return correspondeNome && correspondeStatus;
    });
  }
}
