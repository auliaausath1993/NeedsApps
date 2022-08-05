import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailInfoPage } from './detail-info.page';

describe('DetailInfoPage', () => {
  let component: DetailInfoPage;
  let fixture: ComponentFixture<DetailInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
