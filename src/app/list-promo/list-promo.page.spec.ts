import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPromoPage } from './list-promo.page';

describe('ListPromoPage', () => {
  let component: ListPromoPage;
  let fixture: ComponentFixture<ListPromoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPromoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPromoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
