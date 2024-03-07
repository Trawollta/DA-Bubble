import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowContactsComponent } from './show-contacts.component';

describe('ShowContactsComponent', () => {
  let component: ShowContactsComponent;
  let fixture: ComponentFixture<ShowContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowContactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
