import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorOptionsDialogComponent } from './editor-options-dialog.component';

describe('EditorOptionsDialogComponent', () => {
  let component: EditorOptionsDialogComponent;
  let fixture: ComponentFixture<EditorOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorOptionsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
