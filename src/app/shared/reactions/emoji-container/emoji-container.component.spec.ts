import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiContainerComponent } from './emoji-container.component';

describe('EmojiContainerComponent', () => {
  let component: EmojiContainerComponent;
  let fixture: ComponentFixture<EmojiContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmojiContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
