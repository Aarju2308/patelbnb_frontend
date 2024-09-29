import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Page, Pageable, Sort } from '../../core/model/request.model';
import { CardListing } from '../../landlord/model/listing.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {


  @Input() pageableData!: Page<CardListing>;
  @Output() pageChange = new EventEmitter<PageEvent>();

  sort: Sort = {
    empty: false,
    sorted: false,
    unsorted: false,
  };

  pageable: Pageable = {
    pageNumber: 0,
    pageSize: 0,
    sort: this.sort,
    offset: 0,
    paged: false,
    unpaged: false,
  };

  pagedData: Page<CardListing> = {
    totalElements: 0,
    number: 0,
    size: 20,
    content: [],
    pageable: this.pageable,
    last: false,
    totalPages: 0,
    first: false,
    numberOfElements: 0,
    empty: false,
    sort: this.sort,
  };

  ngOnInit(): void {
    this.updatePagedData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageableData']) {
      this.updatePagedData();
    }
  }

  private updatePagedData(): void {
    if (this.pageableData) {
      this.pagedData = this.pageableData;
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

}
