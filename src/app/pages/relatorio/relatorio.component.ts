import { Component } from '@angular/core';

@Component({
  selector: 'app-relatorio',
  standalone: false,
  styleUrl: './relatorio.component.css',
  templateUrl: './relatorio.component.html',
})
export class Relatorio {

  receitasSemanais = [
    { semana: '01–07 out', valor: 2480 },
    { semana: '08–14 out', valor: 2900 },
    { semana: '15–21 out', valor: 3280 },
    { semana: '22–31 out', valor: 3820 }
  ];

  agendamentos = [
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

pesquisaCliente = '';
statusSelecionado = 'Todos os status';

get agendamentosFiltrados() {
  return this.agendamentos.filter(agendamento => {

    const correspondeNome = agendamento.cliente
      .toLowerCase()
      .includes(this.pesquisaCliente.toLowerCase().trim());

    const correspondeStatus =
      this.statusSelecionado === 'Todos os status' ||
      agendamento.status === this.statusSelecionado;

    return correspondeNome && correspondeStatus;
  });
}

}