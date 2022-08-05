import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MidtransDevPage } from './midtrans-dev.page';

describe('MidtransDevPage', () => {
  let component: MidtransDevPage;
  let fixture: ComponentFixture<MidtransDevPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidtransDevPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MidtransDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
