import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaChatThreadComponent } from './textarea-chat-thread.component';

describe('TextareaChatThreadComponent', () => {
  let component: TextareaChatThreadComponent;
  let fixture: ComponentFixture<TextareaChatThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaChatThreadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextareaChatThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
