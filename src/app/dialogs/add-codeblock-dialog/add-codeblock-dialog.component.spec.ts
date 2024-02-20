import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCodeblockDialogComponent } from './add-codeblock-dialog.component';

describe('AddCodeblockDialogComponent', () => {
  let component: AddCodeblockDialogComponent;
  let fixture: ComponentFixture<AddCodeblockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCodeblockDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCodeblockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
