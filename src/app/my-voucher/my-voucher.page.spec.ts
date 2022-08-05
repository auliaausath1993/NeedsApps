import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyVoucherPage } from './my-voucher.page';

describe('MyVoucherPage', () => {
  let component: MyVoucherPage;
  let fixture: ComponentFixture<MyVoucherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyVoucherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyVoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
