import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KontenPage } from './konten.page';

describe('KontenPage', () => {
  let component: KontenPage;
  let fixture: ComponentFixture<KontenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KontenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
