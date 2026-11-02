import { Component } from '@angular/core';
import { ServicosService, Servico } from '../../services/servicos.service';

@Component({
  selector: 'app-cadastro-servicos',
  standalone: false,
  styleUrl: './cadastro-servicos.component.css',
  templateUrl: './cadastro-servicos.component.html',
})
export class CadastroServicos {

  nome = '';
  categoria = '';
  descricao = '';
  preco = 0;
  duracao = 0;
  imagem = '';

  servicos: Servico[];

  constructor(private servicosService: ServicosService) {
    this.servicos = this.servicosService.listarServicos();
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
  alert('Preencha os campos corretamente! O preço deve ser positivo e a duração deve ser um número inteiro maior que zero.');
  return;
}

  const dadosServico: Servico = {
    id: this.idEmEdicao ?? Date.now(),
    nome: this.nome,
    categoria: this.categoria,
    descricao: this.descricao,
    preco: this.preco,
    duracao: this.duracao,
    imagem: this.imagem || '/images/manicure-classica.jpg'
  };

  if (this.idEmEdicao !== null) {
    this.servicosService.editarServico(dadosServico);
    alert('Serviço atualizado com sucesso!');
  } else {
    this.servicosService.adicionarServico(dadosServico);
    alert('Serviço cadastrado com sucesso!');
  }

  this.servicos = this.servicosService.listarServicos();

  this.idEmEdicao = null;
  this.nome = '';
  this.categoria = '';
  this.descricao = '';
  this.preco = 0;
  this.duracao = 0;
  this.imagem = '';
}

  idEmEdicao: number | null = null;

  editarServico(servico: any) {
    this.idEmEdicao = servico.id;

    this.nome = servico.nome;
    this.categoria = servico.categoria;
    this.descricao = servico.descricao;
    this.preco = servico.preco;
    this.duracao = servico.duracao;
    this.imagem = servico.imagem;
  }

excluirServico(id: number) {
  const confirmar = confirm('Deseja realmente excluir este serviço?');

  if (confirmar) {
    this.servicosService.excluirServico(id);

    this.servicos = this.servicosService.listarServicos();

    if (this.idEmEdicao === id) {
      this.idEmEdicao = null;
    }

    alert('Serviço excluído com sucesso!');
  }
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

