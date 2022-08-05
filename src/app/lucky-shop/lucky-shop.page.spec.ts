import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LuckyShopPage } from './lucky-shop.page';

describe('LuckyShopPage', () => {
  let component: LuckyShopPage;
  let fixture: ComponentFixture<LuckyShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckyShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuckyShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
