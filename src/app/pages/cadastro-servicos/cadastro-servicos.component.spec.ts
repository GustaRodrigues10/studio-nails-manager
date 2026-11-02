import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroServicos } from './cadastro-servicos.component';

describe('CadastroServicos', () => {
  let component: CadastroServicos;
  let fixture: ComponentFixture<CadastroServicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroServicos],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroServicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
