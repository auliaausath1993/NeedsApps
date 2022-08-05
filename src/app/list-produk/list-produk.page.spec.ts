import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListProdukPage } from './list-produk.page';

describe('ListProdukPage', () => {
  let component: ListProdukPage;
  let fixture: ComponentFixture<ListProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
