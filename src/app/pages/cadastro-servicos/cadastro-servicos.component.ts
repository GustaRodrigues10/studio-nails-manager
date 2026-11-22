import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servico, ServicosService } from '../../services/servicos.service';

@Component({
  selector: 'app-cadastro-servicos',
  standalone: false,
  templateUrl: './cadastro-servicos.component.html',
  styleUrl: './cadastro-servicos.component.css',
})
export class CadastroServicos implements OnInit {
  formularioServico: FormGroup;
  servicos: Servico[] = [];
  idEmEdicao: string | null = null;
  salvando = false;

  constructor(
    private servicosService: ServicosService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.formularioServico = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      categoria: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      duracao: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      imagem: [''],
    });
  }

  ngOnInit(): void {
    this.carregarServicos();
  }

  // GET - Lista os serviços cadastrados na API
  carregarServicos(): void {
    this.servicosService.buscarServicosApi().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar serviços:', erro);
        alert('Não foi possível carregar os serviços da API.');
        this.cdr.detectChanges();
      },
    });
  }

  // POST ou PUT - Cadastra ou atualiza um serviço
  salvarServico(): void {
    if (this.salvando) {
      return;
    }

    if (this.formularioServico.invalid) {
      this.formularioServico.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const valores = this.formularioServico.getRawValue();

    const dadosServico = {
      nome: String(valores.nome).trim(),
      categoria: String(valores.categoria),
      descricao: String(valores.descricao).trim(),
      preco: Number(valores.preco),
      duracao: Number(valores.duracao),
      imagem: String(valores.imagem || '').trim() || '/images/manicure-classica.jpg',
    };

    this.salvando = true;

    if (this.idEmEdicao !== null) {
      const servicoAtualizado: Servico = {
        id: this.idEmEdicao,
        ...dadosServico,
      };

      this.servicosService.editarServicoApi(servicoAtualizado).subscribe({
        next: () => {
          this.salvando = false;
          this.carregarServicos();
          this.limparFormulario();
          alert('Serviço atualizado com sucesso!');
          this.cdr.detectChanges();
        },
        error: (erro) => {
          this.salvando = false;
          console.error('Erro ao atualizar serviço:', erro);
          alert('Não foi possível atualizar o serviço.');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.servicosService.adicionarServicoApi(dadosServico).subscribe({
        next: () => {
          this.salvando = false;
          this.carregarServicos();
          this.limparFormulario();
          alert('Serviço cadastrado com sucesso!');
          this.cdr.detectChanges();
        },
        error: (erro) => {
          this.salvando = false;
          console.error('Erro ao cadastrar serviço:', erro);
          alert('Não foi possível cadastrar o serviço.');
          this.cdr.detectChanges();
        },
      });
    }
  }

  // Preenche o formulário para edição
  editarServico(servico: Servico): void {
    this.idEmEdicao = servico.id;

    this.formularioServico.patchValue({
      nome: servico.nome,
      categoria: servico.categoria,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao: servico.duracao,
      imagem: servico.imagem,
    });

    this.formularioServico.markAsPristine();
    this.formularioServico.markAsUntouched();
    this.cdr.detectChanges();
  }

  // DELETE - Exclui um serviço da API
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
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao excluir serviço:', erro);
        alert('Não foi possível excluir o serviço.');
        this.cdr.detectChanges();
      },
    });
  }

  // Limpa os campos e cancela a edição
  limparFormulario(): void {
    this.idEmEdicao = null;

    this.formularioServico.reset({
      nome: '',
      categoria: '',
      descricao: '',
      preco: 0,
      duracao: 0,
      imagem: '',
    });

    this.cdr.detectChanges();
  }

  // Verifica se um campo deve mostrar erro
  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formularioServico.get(nomeCampo);

    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }
}
