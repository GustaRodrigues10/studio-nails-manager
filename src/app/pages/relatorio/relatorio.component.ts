
import { Component } from '@angular/core';
import {
  AgendamentosService,
  Agendamento
} from '../../services/agendamentos.service';

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

  pesquisaCliente = '';
  statusSelecionado = 'Todos os status';

  constructor(
    private agendamentosService: AgendamentosService
  ) {}

  get agendamentos(): Agendamento[] {
    return this.agendamentosService.listarAgendamentos();
  }

  get agendamentosFiltrados(): Agendamento[] {
    return this.agendamentosService.pesquisarAgendamentos(
      this.pesquisaCliente,
      this.statusSelecionado
    );
  }
}
