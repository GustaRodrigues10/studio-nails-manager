import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AgendamentosService, Agendamento } from '../../services/agendamentos.service';

@Component({
  selector: 'app-relatorio',
  standalone: false,
  styleUrl: './relatorio.component.css',
  templateUrl: './relatorio.component.html',
})
export class Relatorio implements OnInit {
  receitasSemanais = [
    { semana: '01–07 out', valor: 2480 },
    { semana: '08–14 out', valor: 2900 },
    { semana: '15–21 out', valor: 3280 },
    { semana: '22–31 out', valor: 3820 },
  ];

  agendamentos: Agendamento[] = [];

  pesquisaCliente = '';
  statusSelecionado = 'Todos os status';

  carregandoAgendamentos = true;
  erroAgendamentos = '';

  constructor(
    private agendamentosService: AgendamentosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  // GET - Carrega os agendamentos pela API
  carregarAgendamentos(): void {
    this.carregandoAgendamentos = true;
    this.erroAgendamentos = '';

    this.agendamentosService.listarAgendamentos().subscribe({
      next: (dados) => {
        this.agendamentos = dados;
        this.carregandoAgendamentos = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.erroAgendamentos =
          'Não foi possível carregar os agendamentos. Verifique o JSON-Server.';
        this.carregandoAgendamentos = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Pesquisa e filtro realizados pelo Service
  get agendamentosFiltrados(): Agendamento[] {
    return this.agendamentosService.pesquisarAgendamentos(
      this.agendamentos,
      this.pesquisaCliente,
      this.statusSelecionado,
    );
  }
}
