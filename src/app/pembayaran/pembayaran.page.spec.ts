import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PembayaranPage } from './pembayaran.page';

describe('PembayaranPage', () => {
  let component: PembayaranPage;
  let fixture: ComponentFixture<PembayaranPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PembayaranPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PembayaranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
