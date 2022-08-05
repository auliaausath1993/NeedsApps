import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailProdukPage } from './detail-produk.page';

describe('DetailProdukPage', () => {
  let component: DetailProdukPage;
  let fixture: ComponentFixture<DetailProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
