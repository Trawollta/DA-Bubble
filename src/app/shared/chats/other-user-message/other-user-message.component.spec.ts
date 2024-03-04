import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserMessageComponent } from './other-user-message.component';

describe('OtherUserMessageComponent', () => {
  let component: OtherUserMessageComponent;
  let fixture: ComponentFixture<OtherUserMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherUserMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherUserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
