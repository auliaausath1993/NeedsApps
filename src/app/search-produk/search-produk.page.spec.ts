import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchProdukPage } from './search-produk.page';

describe('SearchProdukPage', () => {
  let component: SearchProdukPage;
  let fixture: ComponentFixture<SearchProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
