import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AturBahasaPage } from './atur-bahasa.page';

describe('AturBahasaPage', () => {
  let component: AturBahasaPage;
  let fixture: ComponentFixture<AturBahasaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AturBahasaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AturBahasaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
