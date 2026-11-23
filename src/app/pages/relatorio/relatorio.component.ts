import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AgendamentosService, Agendamento } from '../../services/agendamentos.service';

interface ServicoFavorito {
  nome: string;
  percentual: number;
}

@Component({
  selector: 'app-relatorio',
  standalone: false,
  styleUrl: './relatorio.component.css',
  templateUrl: './relatorio.component.html',
})
export class Relatorio implements OnInit {
  // Valores demonstrativos do gráfico (não são calculados pela API)
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

  // Paginação da tabela
  itensPorPagina = 5;
  paginaAtual = 1;

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

  // Somente os agendamentos da página atual
  get agendamentosDaPagina(): Agendamento[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.agendamentosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina));
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  // Ao pesquisar ou filtrar, volta para a primeira página
  alterarPesquisa(valor: string): void {
    this.pesquisaCliente = valor;
    this.paginaAtual = 1;
  }

  alterarStatus(valor: string): void {
    this.statusSelecionado = valor;
    this.paginaAtual = 1;
  }

  // Calculado a partir dos agendamentos da API (cancelados não entram)
  get servicosFavoritos(): ServicoFavorito[] {
    const validos = this.agendamentos.filter((a) => a.status !== 'Cancelado');
    const contagem: { [servico: string]: number } = {};

    for (const agendamento of validos) {
      contagem[agendamento.servico] = (contagem[agendamento.servico] || 0) + 1;
    }

    return Object.keys(contagem)
      .map((nome) => ({
        nome,
        percentual: Math.round((contagem[nome] / validos.length) * 100),
      }))
      .sort((a, b) => b.percentual - a.percentual);
  }

  // Mostra a data no formato DD/MM (para agendamentos feitos pelo site)
  formatarData(data?: string): string {
    if (!data) {
      return '';
    }
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}`;
  }

  // Botão "Exportar relatório": abre a janela de impressão / salvar em PDF
  exportarRelatorio(): void {
    window.print();
  }
}
