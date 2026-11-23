import { Component } from '@angular/core';

// Página "Sobre nós": apresenta a história e os valores do ateliê
@Component({
  selector: 'app-sobre',
  standalone: false,
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css',
})
export class Sobre {
  // Lista exibida com *ngFor na faixa de valores
  valores = [
    {
      icone: '♡',
      titulo: 'Cuidado de verdade',
      texto: 'Escuta, delicadeza e atenção do primeiro olá ao último detalhe.',
    },
    {
      icone: '⛉',
      titulo: 'Beleza com segurança',
      texto: 'Instrumentais esterilizados e materiais individuais em cada atendimento.',
    },
    {
      icone: '✦',
      titulo: 'Seu estilo, sua essência',
      texto: 'Técnicas e cores escolhidas para valorizar a beleza que já é sua.',
    },
  ];
}
