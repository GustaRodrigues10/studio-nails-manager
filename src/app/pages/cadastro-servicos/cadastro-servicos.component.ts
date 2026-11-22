import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServicosService, Servico } from '../../services/servicos.service';

@Component({
  selector: 'app-cadastro-servicos',
  standalone: false,
  styleUrl: './cadastro-servicos.component.css',
  templateUrl: './cadastro-servicos.component.html',
})
export class CadastroServicos implements OnInit {

  nome = '';
  categoria = '';
  descricao = '';
  preco = 0;
  duracao = 0;
  imagem = '';

  servicos: Servico[] = [];

  constructor(
  private servicosService: ServicosService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
  this.servicosService.buscarServicosApi().subscribe({
    next: (dados) => {
      this.servicos = dados;
      this.cdr.detectChanges();
    },
    error: (erro) => {
      console.error('Erro ao carregar serviços:', erro);
      alert('Não foi possível carregar os serviços da API.');
    }
  });
}

  salvarServico() {
    if (
      !this.nome.trim() ||
      !this.categoria ||
      !this.descricao.trim() ||
      !Number.isFinite(this.preco) ||
      this.preco <= 0 ||
      !Number.isFinite(this.duracao) ||
      !Number.isInteger(this.duracao) ||
      this.duracao <= 0
    ) {
      alert('Preencha os campos corretamente!');
      return;
    }

    const dadosServico = {
      nome: this.nome,
      categoria: this.categoria,
      descricao: this.descricao,
      preco: this.preco,
      duracao: this.duracao,
      imagem: this.imagem || '/images/manicure-classica.jpg'
    };

    if (this.idEmEdicao !== null) {
  const servicoAtualizado: Servico = {
    id: this.idEmEdicao,
    ...dadosServico
  };

  this.servicosService.editarServicoApi(servicoAtualizado).subscribe({
    next: () => {
      this.carregarServicos();
      this.limparFormulario();
      alert('Serviço atualizado com sucesso na API!');
    },
    error: (erro) => {
      console.error('Erro ao atualizar serviço:', erro);
      alert('Não foi possível atualizar o serviço.');
    }
  });

} else {
      // Cadastro persistente pelo JSON-Server
      this.servicosService.adicionarServicoApi(dadosServico).subscribe({
        next: () => {
          this.carregarServicos();
          this.limparFormulario();
          alert('Serviço cadastrado com sucesso na API!');
        },
        error: (erro) => {
          console.error('Erro ao cadastrar serviço:', erro);
          alert('Erro ao salvar. Verifique se o JSON-Server está ligado.');
        }
      });
    }
  }

  idEmEdicao: string | null = null;

  editarServico(servico: any) {
    this.idEmEdicao = servico.id;

    this.nome = servico.nome;
    this.categoria = servico.categoria;
    this.descricao = servico.descricao;
    this.preco = servico.preco;
    this.duracao = servico.duracao;
    this.imagem = servico.imagem;
  }

  excluirServico(id: string): void {
  const confirmar = confirm('Deseja realmente excluir este serviço?');

  if (!confirmar) {
    return;
  }

  this.servicosService.excluirServicoApi(id).subscribe({
    next: () => {
      this.carregarServicos();

      if (this.idEmEdicao === id) {
        this.limparFormulario();
      }

      alert('Serviço excluído com sucesso!');
    },
    error: (erro) => {
      console.error('Erro ao excluir serviço:', erro);
      alert('Não foi possível excluir o serviço.');
    }
  });
}

  limparFormulario() {
    this.idEmEdicao = null;
    this.nome = '';
    this.categoria = '';
    this.descricao = '';
    this.preco = 0;
    this.duracao = 0;
    this.imagem = '';
  }
}

