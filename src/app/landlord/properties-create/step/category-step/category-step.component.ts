import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { Category, CategoryName } from '../../../../layout/category/category.model';
import { CategoryService } from '../../../../layout/category/category.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-category-step',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './category-step.component.html',
  styleUrl: './category-step.component.scss'
})
export class CateroryStepComponent implements OnInit {

  categoryName = input.required<CategoryName>();

  @Output()
  categoryChange = new EventEmitter<CategoryName>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  categoryService = inject(CategoryService);
  categories: Category[] | undefined;


  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    if (this.categoryName !== undefined) {
      this.stepValidityChange.emit(true);
    }
  }

  onSelectCategory(newCategory : CategoryName){
    this.categoryChange.emit(newCategory);
    this.stepValidityChange.emit(true);
  }



}
