import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from '../../category/category.service';
import { Category, CategoryName } from '../../category/category.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule,],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  categoryService : CategoryService = inject(CategoryService);

  categories : Category[] | undefined;

  currentActiveCategory = this.categoryService.getCategoryByDefault();

  isHome : boolean = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.listenRouter()
    this.currentActiveCategory.activated = false;
    this.fetchCategories();
  }

  listenRouter() {
    this.router.events.pipe(
      filter((evt) : evt is NavigationEnd => evt instanceof NavigationEnd)
    ).subscribe({
      next:(evt:NavigationEnd)=>{
        this.isHome = evt.url.split("?")[0] === "/";
        if (this.isHome && evt.url.indexOf("?") === -1) {
          const categoryByTechnicalName  = this.categoryService.getCategoryByTechnicalName("ALL");
          this.categoryService.changeCategory(categoryByTechnicalName!)
        }
      }
    });

    this.activatedRoute.queryParams
      .pipe(
        map(params => params['category'])
      ).subscribe({
        next:(categoryName : CategoryName) => {
          const category = this.categoryService.getCategoryByTechnicalName(categoryName);
          if (category) {
            this.activateCategory(category);
            this.categoryService.changeCategory(category);
          }
        }
      })
  }

  activateCategory(category : Category){
    this.currentActiveCategory.activated = false;
    this.currentActiveCategory = category;
    this.currentActiveCategory.activated = true;
  }

  onChangeCategory(category : Category){
    this.activateCategory(category);
    this.router.navigate([],{
      queryParams:{"category":category.technicalName},
      relativeTo : this.activatedRoute
    })
  }

  fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }

  

}
