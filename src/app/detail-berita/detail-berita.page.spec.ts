import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailBeritaPage } from './detail-berita.page';

describe('DetailBeritaPage', () => {
  let component: DetailBeritaPage;
  let fixture: ComponentFixture<DetailBeritaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBeritaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailBeritaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
