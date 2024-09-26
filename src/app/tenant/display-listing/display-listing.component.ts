import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { TenantListingService } from '../tenant-listing.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../layout/toast.service';
import { CategoryService } from '../../layout/category/category.service';
import { CountryService } from '../../landlord/properties-create/step/location-step/country.service';
import { DisplayPicture, Listing } from '../../landlord/model/listing.model';
import { Category } from '../../layout/category/category.model';
import { map } from 'rxjs';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AvatarComponent } from '../../layout/navbar/avatar/avatar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewAllImagesDialogComponent } from '../view-all-images-dialog/view-all-images-dialog.component';
import { BookDateComponent } from '../book-date/book-date.component';

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    AvatarComponent,
    BookDateComponent
  ],
  providers:[DialogService],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss'
})
export class DisplayListingComponent implements OnInit,OnDestroy {

  tenantListingService : TenantListingService = inject(TenantListingService);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);
  dialogService = inject(DialogService);
  ref : DynamicDialogRef | undefined;

  listing : Listing | undefined;
  category : Category | undefined;
  currentPublicId = "";

  loading:boolean = true;

  constructor(){
    this.listenToFetchListing()
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetOneByPublicId();
  }
  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(params => params['id'])
    ).subscribe({
      next: publicId => this.fetchListing(publicId)
    })
  }

  private fetchListing(publicId: string) {
    this.loading = true;
    this.currentPublicId = publicId;
    this.tenantListingService.getOneByPublicId(publicId);
  }

  listenToFetchListing() {
    effect(()=>{
      const listingByPublicIdSig = this.tenantListingService.getOneByPublicIdSig();
      if (listingByPublicIdSig.status === 'OK') {
        this.loading = false;
        this.listing = listingByPublicIdSig.value;
        console.log(this.listing)
        if (this.listing) {
          this.listing.pictures = this.putCoverPictureFirst(this.listing.pictures);
          this.category =  this.categoryService.getCategoryByTechnicalName(this.listing.category);
          this.countryService.getCountryByCode(this.listing.location).subscribe({
            next:country => {
              if (this.listing) {
                this.listing.location = country.region + ", " + country.name.common
              }
            }
          })
        }
      }else if (listingByPublicIdSig.status === 'ERROR') {
        this.loading = false;
        this.toastService.send({severity:"error",summary:"Error",detail:"Error while fetching listing"})
      }
    });
  }

  putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    const coverIndex = pictures.findIndex((picture : DisplayPicture) => picture.isCover);
    if (coverIndex) {
      const cover = pictures[coverIndex];
      pictures.splice(coverIndex,1);
      pictures.unshift(cover);
    }
    return pictures;
  }

  showMore(){
    this.ref = this.dialogService.open(ViewAllImagesDialogComponent,
      {
        width: "60%",
        header: this.listing!.description.title.value,
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true,
        data:{
          pictures: this.listing!.pictures,
        }
      }
    )
  }


}
