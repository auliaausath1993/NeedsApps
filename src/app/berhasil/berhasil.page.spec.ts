import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BerhasilPage } from './berhasil.page';

describe('BerhasilPage', () => {
  let component: BerhasilPage;
  let fixture: ComponentFixture<BerhasilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerhasilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BerhasilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
