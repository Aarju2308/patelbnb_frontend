import { Component, inject } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DisplayPicture } from '../../landlord/model/listing.model';

@Component({
  selector: 'app-view-all-images-dialog',
  standalone: true,
  imports: [],
  templateUrl: './view-all-images-dialog.component.html',
  styleUrl: './view-all-images-dialog.component.scss'
})
export class ViewAllImagesDialogComponent {

  dialogService = inject(DialogService);
  ref : DynamicDialogRef | undefined;

  pictures : Array<DisplayPicture> = [];

  constructor(public config : DynamicDialogConfig){
    if (this.config.data?.pictures) {
      this.pictures = this.config.data?.pictures;
      console.log(this.pictures)
    }
  }

}
