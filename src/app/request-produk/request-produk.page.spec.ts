import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestProdukPage } from './request-produk.page';

describe('RequestProdukPage', () => {
  let component: RequestProdukPage;
  let fixture: ComponentFixture<RequestProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
