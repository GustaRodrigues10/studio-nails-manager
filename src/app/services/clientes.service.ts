import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  celular: string;
  senha: string; // projeto acadêmico: senha guardada sem criptografia no JSON-Server
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000/clientes';

  // Cliente que entrou na conta (fica guardado enquanto a página estiver aberta)
  clienteLogado: Cliente | null = null;

  constructor(private http: HttpClient) {}

  // GET - Procura um cliente pelo e-mail
  buscarPorEmail(email: string): Observable<Cliente | undefined> {
    const emailProcurado = email.trim().toLowerCase();

    return this.http
      .get<Cliente[]>(this.apiUrl)
      .pipe(map((clientes) => clientes.find((c) => c.email.toLowerCase() === emailProcurado)));
  }

  // POST - Cadastra um novo cliente
  cadastrar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  entrar(cliente: Cliente): void {
    this.clienteLogado = cliente;
  }

  sair(): void {
    this.clienteLogado = null;
  }
}
