import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JanelaComponent } from './janela.component';

describe('JanelaComponent', () => {
  let component: JanelaComponent;
  let fixture: ComponentFixture<JanelaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanelaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
