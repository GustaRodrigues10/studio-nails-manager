import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Relatorio } from './relatorio.component';

describe('Relatorio', () => {
  let component: Relatorio;
  let fixture: ComponentFixture<Relatorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Relatorio],
    }).compileComponents();

    fixture = TestBed.createComponent(Relatorio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
