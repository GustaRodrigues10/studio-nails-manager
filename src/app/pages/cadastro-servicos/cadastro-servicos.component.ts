import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Servico, ServicosService } from '../../services/servicos.service';

// Validador do grupo de profissionais: pelo menos uma precisa estar marcada
function peloMenosUmaProfissional(grupo: AbstractControl): ValidationErrors | null {
  const valor = grupo.value;
  return valor.ana || valor.clara ? null : { nenhumaProfissional: true };
}

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

  // Opções exibidas nos campos de seleção
  duracoes = [30, 45, 60, 75, 90, 120];
  imagens = [
    { caminho: '/images/manicure-classica.jpg', nome: 'Manicure clássica' },
    { caminho: '/images/esmaltacao-gel.jpg', nome: 'Esmaltação em gel' },
    { caminho: '/images/spa-pes.jpg', nome: 'Spa dos pés' },
    { caminho: '/images/manicure-image.jpg', nome: 'Mãos (destaque)' },
  ];

  constructor(
    private servicosService: ServicosService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.formularioServico = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      categoria: ['', Validators.required],
      descricao: [
        '',
        [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(500)],
      ],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      duracao: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      imagem: ['/images/manicure-classica.jpg'],
      profissionais: this.fb.group(
        {
          ana: [true],
          clara: [true],
        },
        { validators: peloMenosUmaProfissional },
      ),
      disponivel: [true],
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

    // Converte as caixas marcadas em uma lista de nomes
    const profissionais: string[] = [];
    if (valores.profissionais.ana) {
      profissionais.push('Ana Oliveira');
    }
    if (valores.profissionais.clara) {
      profissionais.push('Clara Lima');
    }

    const dadosServico = {
      nome: String(valores.nome).trim(),
      categoria: String(valores.categoria),
      descricao: String(valores.descricao).trim(),
      preco: Number(valores.preco),
      duracao: Number(valores.duracao),
      imagem: String(valores.imagem || '').trim() || '/images/manicure-classica.jpg',
      profissionais: profissionais,
      disponivel: Boolean(valores.disponivel),
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

    // Serviços antigos sem a lista de profissionais ficam com as duas marcadas
    const lista = servico.profissionais ?? ['Ana Oliveira', 'Clara Lima'];

    this.formularioServico.patchValue({
      nome: servico.nome,
      categoria: servico.categoria,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao: servico.duracao,
      imagem: servico.imagem,
      profissionais: {
        ana: lista.includes('Ana Oliveira'),
        clara: lista.includes('Clara Lima'),
      },
      disponivel: servico.disponivel !== false,
    });

    this.formularioServico.markAsPristine();
    this.formularioServico.markAsUntouched();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      imagem: '/images/manicure-classica.jpg',
      profissionais: { ana: true, clara: true },
      disponivel: true,
    });

    this.cdr.detectChanges();
  }

  // Verifica se um campo deve mostrar erro
  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formularioServico.get(nomeCampo);

    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  // Quantidade de caracteres digitados na descrição
  get tamanhoDescricao(): number {
    return (this.formularioServico.get('descricao')?.value || '').length;
  }
}
