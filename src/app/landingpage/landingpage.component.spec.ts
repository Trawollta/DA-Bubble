import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LangingpageComponent } from './landingpage.component';

describe('LoginComponent', () => {
  let component: LangingpageComponent;
  let fixture: ComponentFixture<LangingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangingpageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LangingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
