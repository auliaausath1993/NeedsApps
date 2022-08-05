import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KonfirmasiPesananPage } from './konfirmasi-pesanan.page';

describe('KonfirmasiPesananPage', () => {
  let component: KonfirmasiPesananPage;
  let fixture: ComponentFixture<KonfirmasiPesananPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KonfirmasiPesananPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KonfirmasiPesananPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
