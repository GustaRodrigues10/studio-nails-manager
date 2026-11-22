
import { Injectable } from '@angular/core';

export interface Agendamento {
  id: number;
  horario: string;
  cliente: string;
  servico: string;
  profissional: string;
  valor: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {

  private agendamentos: Agendamento[] = [
    {
      id: 1,
      horario: '10:00',
      cliente: 'Beatriz Almeida',
      servico: 'Manicure clássica',
      profissional: 'Ana Oliveira',
      valor: 45,
      status: 'Confirmado'
    },
    {
      id: 2,
      horario: '11:00',
      cliente: 'Camila Santos',
      servico: 'Esmaltação em gel',
      profissional: 'Clara Lima',
      valor: 90,
      status: 'Concluído'
    },
    {
      id: 3,
      horario: '13:30',
      cliente: 'Juliana Ribeiro',
      servico: 'Spa dos pés',
      profissional: 'Ana Oliveira',
      valor: 75,
      status: 'Confirmado'
    },
    {
      id: 4,
      horario: '14:00',
      cliente: 'Fernanda Costa',
      servico: 'Manicure clássica',
      profissional: 'Clara Lima',
      valor: 45,
      status: 'Confirmado'
    },
    {
      id: 5,
      horario: '15:30',
      cliente: 'Luiza Martins',
      servico: 'Esmaltação em gel',
      profissional: 'Clara Lima',
      valor: 90,
      status: 'Cancelado'
    }
  ];

  listarAgendamentos(): Agendamento[] {
    return [...this.agendamentos];
  }

  pesquisarAgendamentos(
    pesquisaCliente: string,
    statusSelecionado: string
  ): Agendamento[] {
    const pesquisa = pesquisaCliente.toLowerCase().trim();

    return this.agendamentos.filter(agendamento => {
      const correspondeNome = agendamento.cliente
        .toLowerCase()
        .includes(pesquisa);

      const correspondeStatus =
        statusSelecionado === 'Todos os status' ||
        agendamento.status === statusSelecionado;

      return correspondeNome && correspondeStatus;
    });
  }
}
