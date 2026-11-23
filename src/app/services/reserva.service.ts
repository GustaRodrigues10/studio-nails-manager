import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamento, AgendamentosService } from './agendamentos.service';
import { Cliente } from './clientes.service';

export interface Profissional {
  nome: string;
  especialidade: string;
  foto: string;
}

// Profissionais do ateliê (usadas no agendamento e no cadastro de serviços)
export const PROFISSIONAIS: Profissional[] = [
  { nome: 'Ana Oliveira', especialidade: 'Unhas naturais e gel', foto: '/images/profissional-ana.jpg' },
  { nome: 'Clara Lima', especialidade: 'Unhas naturais e gel', foto: '/images/profissional-clara.jpg' },
];

// Reserva escolhida na página do serviço, aguardando login/cadastro
export interface ReservaPendente {
  servicoId: string;
  servico: string;
  profissional: string;
  data: string; // AAAA-MM-DD
  dataTexto: string; // ex.: "Terça-feira, 24 de novembro de 2026"
  dataCurta: string; // ex.: "24/11"
  horario: string;
  valor: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  reservaPendente: ReservaPendente | null = null;

  constructor(private agendamentosService: AgendamentosService) {}

  guardarReserva(reserva: ReservaPendente): void {
    this.reservaPendente = reserva;
  }

  limparReserva(): void {
    this.reservaPendente = null;
  }

  // POST - Transforma a reserva pendente em um agendamento na API
  confirmarReserva(reserva: ReservaPendente, cliente: Cliente): Observable<Agendamento> {
    return this.agendamentosService.criarAgendamento({
      data: reserva.data,
      horario: reserva.horario,
      cliente: cliente.nome,
      clienteEmail: cliente.email,
      servico: reserva.servico,
      profissional: reserva.profissional,
      valor: reserva.valor,
      status: 'Confirmado',
    });
  }
}
