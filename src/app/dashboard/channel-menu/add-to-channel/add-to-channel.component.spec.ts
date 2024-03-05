import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToChannelComponent } from './add-to-channel.component';

describe('AddToChannelComponent', () => {
  let component: AddToChannelComponent;
  let fixture: ComponentFixture<AddToChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
