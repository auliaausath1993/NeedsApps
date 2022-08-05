import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProfilPage } from './edit-profil.page';

describe('EditProfilPage', () => {
  let component: EditProfilPage;
  let fixture: ComponentFixture<EditProfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
