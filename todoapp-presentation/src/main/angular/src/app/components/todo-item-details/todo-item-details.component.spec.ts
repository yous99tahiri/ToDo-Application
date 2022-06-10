import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemDetailsComponent } from './todo-item-details.component';

describe('TodoItemDetailsComponent', () => {
  let component: TodoItemDetailsComponent;
  let fixture: ComponentFixture<TodoItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoItemDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
