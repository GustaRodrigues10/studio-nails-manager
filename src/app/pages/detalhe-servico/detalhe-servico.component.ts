import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servico, ServicosService } from '../../services/servicos.service';
import { Agendamento, AgendamentosService } from '../../services/agendamentos.service';
import { ClientesService } from '../../services/clientes.service';
import {
  PROFISSIONAIS,
  Profissional,
  ReservaPendente,
  ReservaService,
} from '../../services/reserva.service';

interface DiaAgenda {
  iso: string; // AAAA-MM-DD
  diaSemana: string; // TER, QUA...
  dia: string; // 24
  texto: string; // Terça-feira, 24 de novembro de 2026
  curta: string; // 24/11
}

const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const DIAS_COMPLETOS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

@Component({
  selector: 'app-detalhe-servico',
  standalone: false,
  templateUrl: './detalhe-servico.component.html',
  styleUrl: './detalhe-servico.component.css',
})
export class DetalheServico implements OnInit {
  servico: Servico | null = null;
  carregando = true;
  erroCarregamento = '';

  profissionais: Profissional[] = [];
  dias: DiaAgenda[] = [];
  mesTexto = '';
  horarios = ['09:00', '10:00', '11:00', '13:30', '14:30', '16:00', '17:00', '18:00'];
  agendamentos: Agendamento[] = [];

  // Escolhas da cliente
  profissionalSelecionada = '';
  diaSelecionado: DiaAgenda | null = null;
  horarioSelecionado = '';

  mensagemErro = '';
  enviando = false;
  agendamentoConfirmado: Agendamento | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicosService: ServicosService,
    private agendamentosService: AgendamentosService,
    public clientesService: ClientesService,
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.dias = this.gerarDias();
    this.diaSelecionado = this.dias[0];

    // Lê o id da rota (ex.: /servicos/1)
    this.route.paramMap.subscribe((parametros) => {
      const id = parametros.get('id');
      if (id) {
        this.carregarServico(id);
      }
    });

    // GET - Agendamentos existentes, para riscar os horários ocupados
    this.agendamentosService.listarAgendamentos().subscribe({
      next: (dados) => {
        this.agendamentos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar agendamentos:', erro),
    });
  }

  // GET - Busca o serviço escolhido na API
  carregarServico(id: string): void {
    this.carregando = true;
    this.erroCarregamento = '';
    this.agendamentoConfirmado = null;

    this.servicosService.buscarServicoPorIdApi(id).subscribe({
      next: (servico) => {
        this.servico = servico;

        // Mostra só as profissionais que fazem este serviço
        this.profissionais = PROFISSIONAIS.filter(
          (p) => !servico.profissionais || servico.profissionais.includes(p.nome),
        );
        this.profissionalSelecionada = this.profissionais.length ? this.profissionais[0].nome : '';
        this.horarioSelecionado = '';

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar serviço:', erro);
        this.servico = null;
        this.erroCarregamento = 'Não foi possível carregar este serviço. Verifique o JSON-Server.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Gera os próximos 6 dias de atendimento (terça a sábado)
  gerarDias(): DiaAgenda[] {
    const lista: DiaAgenda[] = [];
    const data = new Date();
    data.setHours(12, 0, 0, 0);

    while (lista.length < 6) {
      data.setDate(data.getDate() + 1);
      const diaDaSemana = data.getDay();

      if (diaDaSemana >= 2 && diaDaSemana <= 6) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');

        lista.push({
          iso: `${data.getFullYear()}-${mes}-${dia}`,
          diaSemana: DIAS_CURTOS[diaDaSemana],
          dia: dia,
          texto: `${DIAS_COMPLETOS[diaDaSemana]}, ${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`,
          curta: `${dia}/${mes}`,
        });
      }
    }

    const primeiro = lista[0].iso.split('-');
    const nomeMes = MESES[Number(primeiro[1]) - 1];
    this.mesTexto = `${nomeMes.charAt(0).toUpperCase()}${nomeMes.slice(1)} de ${primeiro[0]}`;

    return lista;
  }

  // Um horário fica ocupado se já existe agendamento (não cancelado)
  // para a mesma profissional, no mesmo dia e horário
  horarioReservado(horario: string): boolean {
    return this.agendamentos.some(
      (a) =>
        a.data === this.diaSelecionado?.iso &&
        a.profissional === this.profissionalSelecionada &&
        a.horario === horario &&
        a.status !== 'Cancelado',
    );
  }

  selecionarProfissional(nome: string): void {
    this.profissionalSelecionada = nome;
    this.limparHorarioSeOcupado();
  }

  selecionarDia(dia: DiaAgenda): void {
    this.diaSelecionado = dia;
    this.limparHorarioSeOcupado();
  }

  selecionarHorario(horario: string): void {
    if (!this.horarioReservado(horario)) {
      this.horarioSelecionado = horario;
      this.mensagemErro = '';
    }
  }

  private limparHorarioSeOcupado(): void {
    if (this.horarioSelecionado && this.horarioReservado(this.horarioSelecionado)) {
      this.horarioSelecionado = '';
    }
  }

  // Horário de término = início + duração do serviço
  get horarioFim(): string {
    if (!this.horarioSelecionado || !this.servico) {
      return '';
    }
    const [horas, minutos] = this.horarioSelecionado.split(':').map(Number);
    const total = horas * 60 + minutos + Number(this.servico.duracao);
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  continuarAgendamento(): void {
    if (!this.servico || !this.profissionalSelecionada || !this.diaSelecionado || !this.horarioSelecionado) {
      this.mensagemErro = 'Escolha a profissional, o dia e o horário para continuar.';
      return;
    }

    const reserva: ReservaPendente = {
      servicoId: this.servico.id,
      servico: this.servico.nome,
      profissional: this.profissionalSelecionada,
      data: this.diaSelecionado.iso,
      dataTexto: this.diaSelecionado.texto,
      dataCurta: this.diaSelecionado.curta,
      horario: this.horarioSelecionado,
      valor: this.servico.preco,
    };

    const cliente = this.clientesService.clienteLogado;

    // Sem login: guarda a reserva e leva para a tela de entrar
    if (!cliente) {
      this.reservaService.guardarReserva(reserva);
      this.router.navigate(['/login']);
      return;
    }

    // Com login: cria o agendamento direto na API (POST)
    this.enviando = true;
    this.reservaService.confirmarReserva(reserva, cliente).subscribe({
      next: (agendamento) => {
        this.enviando = false;
        this.agendamentoConfirmado = agendamento;
        this.agendamentos.push(agendamento);
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao criar agendamento:', erro);
        this.enviando = false;
        this.mensagemErro = 'Não foi possível confirmar o agendamento. Tente novamente.';
        this.cdr.detectChanges();
      },
    });
  }

  novoAgendamento(): void {
    this.agendamentoConfirmado = null;
    this.horarioSelecionado = '';
  }
}
