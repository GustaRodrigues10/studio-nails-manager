import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Agendamento, AgendamentosService } from '../../services/agendamentos.service';
import { ClientesService } from '../../services/clientes.service';

// Página "Meus agendamentos": a cliente vê e cancela os próprios agendamentos
@Component({
  selector: 'app-meus-agendamentos',
  standalone: false,
  templateUrl: './meus-agendamentos.component.html',
  styleUrl: './meus-agendamentos.component.css',
})
export class MeusAgendamentos implements OnInit {
  agendamentos: Agendamento[] = [];
  carregando = false;
  erro = '';
  mensagem = '';
  cancelandoId: string | null = null;

  constructor(
    public clientesService: ClientesService,
    private agendamentosService: AgendamentosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.clientesService.clienteLogado) {
      this.carregarAgendamentos();
    }
  }

  // GET - Busca os agendamentos e mostra só os da cliente logada
  carregarAgendamentos(): void {
    const cliente = this.clientesService.clienteLogado;
    if (!cliente) {
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.agendamentosService.listarAgendamentos().subscribe({
      next: (dados) => {
        this.agendamentos = dados
          .filter((a) => a.clienteEmail === cliente.email)
          .sort((a, b) => (a.data || '').localeCompare(b.data || '') || a.horario.localeCompare(b.horario));
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.erro = 'Não foi possível carregar seus agendamentos. Verifique o JSON-Server.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Só pode cancelar agendamento confirmado e com 24 horas ou mais de antecedência
  podeCancelar(agendamento: Agendamento): boolean {
    if (agendamento.status !== 'Confirmado' || !agendamento.data) {
      return false;
    }
    const [ano, mes, dia] = agendamento.data.split('-').map(Number);
    const [hora, minuto] = agendamento.horario.split(':').map(Number);
    const inicio = new Date(ano, mes - 1, dia, hora, minuto);
    return inicio.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  }

  // PATCH - Muda o status do agendamento para "Cancelado"
  cancelar(agendamento: Agendamento): void {
    if (!this.podeCancelar(agendamento) || this.cancelandoId) {
      return;
    }

    const confirmar = confirm(
      `Deseja cancelar ${agendamento.servico} em ${this.formatarData(agendamento.data)}, às ${agendamento.horario}?`,
    );
    if (!confirmar) {
      return;
    }

    this.cancelandoId = agendamento.id;
    this.mensagem = '';
    this.erro = '';

    this.agendamentosService.atualizarStatus(agendamento.id, 'Cancelado').subscribe({
      next: (atualizado) => {
        agendamento.status = atualizado.status;
        this.cancelandoId = null;
        this.mensagem = 'Agendamento cancelado. O horário ficou livre para outra cliente.';
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao cancelar agendamento:', erro);
        this.cancelandoId = null;
        this.erro = 'Não foi possível cancelar o agendamento. Tente novamente.';
        this.cdr.detectChanges();
      },
    });
  }

  // AAAA-MM-DD -> DD/MM/AAAA
  formatarData(data?: string): string {
    if (!data) {
      return '';
    }
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
