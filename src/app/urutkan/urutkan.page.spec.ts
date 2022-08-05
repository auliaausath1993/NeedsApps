import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UrutkanPage } from './urutkan.page';

describe('UrutkanPage', () => {
  let component: UrutkanPage;
  let fixture: ComponentFixture<UrutkanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrutkanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UrutkanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
