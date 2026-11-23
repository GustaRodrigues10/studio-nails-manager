import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente, ClientesService } from '../../services/clientes.service';
import { Agendamento } from '../../services/agendamentos.service';
import { ReservaPendente, ReservaService } from '../../services/reserva.service';

// Validador do formulário: a senha e a confirmação precisam ser iguais
function senhasIguais(formulario: AbstractControl): ValidationErrors | null {
  const senha = formulario.get('senha')?.value;
  const confirmacao = formulario.get('confirmarSenha')?.value;
  return senha === confirmacao ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro-cliente',
  standalone: false,
  templateUrl: './cadastro-cliente.component.html',
})
export class CadastroCliente {
  formularioCadastro: FormGroup;
  mostrarSenha = false;
  enviando = false;
  mensagemErro = '';

  reservaConfirmada: ReservaPendente | null = null;
  agendamentoConfirmado: Agendamento | null = null;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    public reservaService: ReservaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formularioCadastro = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/.*\S.*/)]],
        email: ['', [Validators.required, Validators.email]],
        // Aceita (11) 99999-9999, 11 99999-9999 ou 11999999999
        celular: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/)]],
        // Mínimo de 8 caracteres, com pelo menos uma letra e um número
        senha: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
          ],
        ],
        confirmarSenha: ['', Validators.required],
        termos: [false, Validators.requiredTrue],
      },
      { validators: senhasIguais },
    );
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formularioCadastro.get(nomeCampo);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  // Mostra o erro de senhas diferentes depois que a confirmação foi preenchida
  get senhasNaoConferem(): boolean {
    const confirmacao = this.formularioCadastro.get('confirmarSenha');
    return (
      this.formularioCadastro.hasError('senhasDiferentes') &&
      !!confirmacao &&
      (confirmacao.touched || confirmacao.dirty) &&
      !!confirmacao.value
    );
  }

  criarConta(): void {
    if (this.enviando) {
      return;
    }

    // Bloqueia o envio de formulário inválido
    if (this.formularioCadastro.invalid) {
      this.formularioCadastro.markAllAsTouched();
      return;
    }

    const valores = this.formularioCadastro.getRawValue();
    const novoCliente = {
      nome: String(valores.nome).trim(),
      email: String(valores.email).trim().toLowerCase(),
      celular: String(valores.celular).trim(),
      senha: String(valores.senha),
    };

    this.enviando = true;
    this.mensagemErro = '';

    // GET - Verifica se o e-mail já está cadastrado
    this.clientesService.buscarPorEmail(novoCliente.email).subscribe({
      next: (existente) => {
        if (existente) {
          this.enviando = false;
          this.mensagemErro = 'Já existe uma conta com este e-mail. Tente entrar.';
          this.cdr.detectChanges();
          return;
        }

        // POST - Cadastra o novo cliente
        this.clientesService.cadastrar(novoCliente).subscribe({
          next: (cliente) => {
            this.clientesService.entrar(cliente);
            this.finalizarAcesso(cliente);
          },
          error: (erro) => this.mostrarErroApi(erro),
        });
      },
      error: (erro) => this.mostrarErroApi(erro),
    });
  }

  private mostrarErroApi(erro: unknown): void {
    console.error('Erro no cadastro:', erro);
    this.enviando = false;
    this.mensagemErro = 'Não foi possível conectar à API. Verifique o JSON-Server.';
    this.cdr.detectChanges();
  }

  // Se havia uma reserva pendente, cria o agendamento; senão, volta ao início
  private finalizarAcesso(cliente: Cliente): void {
    const reserva = this.reservaService.reservaPendente;

    if (!reserva) {
      this.enviando = false;
      alert('Conta criada com sucesso!');
      this.router.navigate(['/home']);
      return;
    }

    this.reservaService.confirmarReserva(reserva, cliente).subscribe({
      next: (agendamento) => {
        this.enviando = false;
        this.reservaConfirmada = reserva;
        this.agendamentoConfirmado = agendamento;
        this.reservaService.limparReserva();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao confirmar agendamento:', erro);
        this.enviando = false;
        this.mensagemErro = 'Conta criada, mas não foi possível confirmar o agendamento.';
        this.cdr.detectChanges();
      },
    });
  }
}
