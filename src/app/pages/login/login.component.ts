import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente, ClientesService } from '../../services/clientes.service';
import { Agendamento } from '../../services/agendamentos.service';
import { ReservaPendente, ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
})
export class Login {
  formularioLogin: FormGroup;
  mostrarSenha = false;
  enviando = false;
  mensagemErro = '';

  // Preenchidos quando a reserva pendente é confirmada após o login
  reservaConfirmada: ReservaPendente | null = null;
  agendamentoConfirmado: Agendamento | null = null;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    public reservaService: ReservaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formularioLogin.get(nomeCampo);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  entrar(): void {
    if (this.enviando) {
      return;
    }

    // Bloqueia o envio de formulário inválido
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const { email, senha } = this.formularioLogin.getRawValue();
    this.enviando = true;
    this.mensagemErro = '';

    // GET - Procura o cliente pelo e-mail e confere a senha
    this.clientesService.buscarPorEmail(email).subscribe({
      next: (cliente) => {
        if (!cliente || cliente.senha !== senha) {
          this.enviando = false;
          this.mensagemErro = 'E-mail ou senha incorretos.';
          this.cdr.detectChanges();
          return;
        }

        this.clientesService.entrar(cliente);
        this.finalizarAcesso(cliente);
      },
      error: (erro) => {
        console.error('Erro ao entrar:', erro);
        this.enviando = false;
        this.mensagemErro = 'Não foi possível conectar à API. Verifique o JSON-Server.';
        this.cdr.detectChanges();
      },
    });
  }

  // Se havia uma reserva pendente, cria o agendamento; senão, volta ao início
  private finalizarAcesso(cliente: Cliente): void {
    const reserva = this.reservaService.reservaPendente;

    if (!reserva) {
      this.enviando = false;
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
        this.mensagemErro = 'Você entrou, mas não foi possível confirmar o agendamento.';
        this.cdr.detectChanges();
      },
    });
  }
}
