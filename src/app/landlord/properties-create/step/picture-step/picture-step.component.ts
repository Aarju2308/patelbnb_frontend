import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NewListingPicture } from '../../../model/picture.model';

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [
    FontAwesomeModule,
    InputTextModule,
    ButtonModule   
  ],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent implements OnInit {


  pictures = input.required<Array<NewListingPicture>>();

  @Output()
  picturesChange = new EventEmitter<Array<NewListingPicture>>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.validatePictures();
  }

  onUploadNewPicture(target : EventTarget | null){
    const pictureFileList = this.extractFileFromTarget(target);
    if (pictureFileList!= null) {
      for (let i = 0; i < pictureFileList.length; i++) {
        const picture = pictureFileList.item(i);
       
        if (picture != null) {
          const displayPicture: NewListingPicture = {
            file : picture,
            urlDisplay : URL.createObjectURL(picture)
          }
          this.pictures().push(displayPicture);
        }
      }
      this.picturesChange.emit(this.pictures());
      this.validatePictures();
    }
  }

  validatePictures() {
   if (this.pictures().length >= 5) {
    this.stepValidityChange.emit(true);
   }else{
    this.stepValidityChange.emit(false);
   }
  }

  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if(target == null || htmlInputTarget == null){
      return null;
    }
    return htmlInputTarget.files;
  }

  onTrashPicture(pictureToDelete : NewListingPicture){
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete,1);
    this.validatePictures();
  }

}
