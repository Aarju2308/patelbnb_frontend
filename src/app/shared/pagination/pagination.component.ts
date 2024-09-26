import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Page } from '../../core/model/request.model';
import { CardListing } from '../../landlord/model/listing.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() pageableData!: Page<CardListing>; // Use a generic type if necessary
  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
