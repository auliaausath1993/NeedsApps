import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KritikSaranPage } from './kritik-saran.page';

describe('KritikSaranPage', () => {
  let component: KritikSaranPage;
  let fixture: ComponentFixture<KritikSaranPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KritikSaranPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KritikSaranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
