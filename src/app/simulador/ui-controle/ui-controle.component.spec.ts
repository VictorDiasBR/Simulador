import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiControleComponent } from './ui-controle.component';

describe('UiControleComponent', () => {
  let component: UiControleComponent;
  let fixture: ComponentFixture<UiControleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiControleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
