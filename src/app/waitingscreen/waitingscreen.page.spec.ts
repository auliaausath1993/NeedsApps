import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingscreenPage } from './waitingscreen.page';

describe('WaitingscreenPage', () => {
  let component: WaitingscreenPage;
  let fixture: ComponentFixture<WaitingscreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingscreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
