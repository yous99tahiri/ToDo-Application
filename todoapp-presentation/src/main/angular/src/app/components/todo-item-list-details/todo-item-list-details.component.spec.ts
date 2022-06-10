import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemListDetailsComponent } from './todo-item-list-details.component';

describe('TodoItemListDetailsComponent', () => {
  let component: TodoItemListDetailsComponent;
  let fixture: ComponentFixture<TodoItemListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoItemListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
