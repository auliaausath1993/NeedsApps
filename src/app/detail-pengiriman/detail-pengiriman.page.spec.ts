import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailPengirimanPage } from './detail-pengiriman.page';

describe('DetailPengirimanPage', () => {
  let component: DetailPengirimanPage;
  let fixture: ComponentFixture<DetailPengirimanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPengirimanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPengirimanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
