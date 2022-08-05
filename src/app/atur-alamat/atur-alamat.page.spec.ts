import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AturAlamatPage } from './atur-alamat.page';

describe('AturAlamatPage', () => {
  let component: AturAlamatPage;
  let fixture: ComponentFixture<AturAlamatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AturAlamatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AturAlamatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
