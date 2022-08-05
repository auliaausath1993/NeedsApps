import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailScanPage } from './detail-scan.page';

describe('DetailScanPage', () => {
  let component: DetailScanPage;
  let fixture: ComponentFixture<DetailScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
