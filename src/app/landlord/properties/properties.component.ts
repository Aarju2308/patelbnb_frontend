import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { LandlordListingService } from '../landlord-listing.service';
import { ToastService } from '../../layout/toast.service';
import { CardListing, EditListing } from '../model/listing.model';
import { CardListingComponent } from '../../shared/card-listing/card-listing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PropertiesCreateComponent } from '../properties-create/properties-create.component';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CardListingComponent,FontAwesomeModule],
  providers:[DialogService],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit,OnDestroy {


  landlordListingService = inject(LandlordListingService);
  toastService = inject(ToastService);
  dialogService = inject(DialogService);
  ref : DynamicDialogRef | undefined;

  listings : Array<CardListing> | undefined = [];
  editListing : EditListing | undefined;

  loadingDeletion : boolean = false;
  loadingFetchAll : boolean = false;

  constructor(){
    this.listenFetchAll();
    this.listenDeleteByPublicId()
  }

  private listenFetchAll(){
    effect(()=>{
      const allListingState = this.landlordListingService.getAllSig();
      if( allListingState.status === 'OK' && allListingState.value){
        this.loadingFetchAll = false;
        this.listings = allListingState.value;
      }else if(allListingState.status === 'ERROR'){
        this.toastService.send({severity:"error",summary:"Error", detail:"Error while loading listing"})  
      }
    })
  }

  listenEditListing(){
    effect(()=>{
      const singleListingState = this.landlordListingService.getSingleSig();
      console.log('singleListingState:', singleListingState); // Add this line
      if( singleListingState.status === 'OK' && singleListingState.value){
        this.editListing = singleListingState.value;
      }else if(singleListingState.status === 'ERROR'){
        this.toastService.send({severity:"error",summary:"Error", detail:"Error while getting listing"})  
      }
    })
  }

  private listenDeleteByPublicId(){
    effect(()=>{
      const deleteState = this.landlordListingService.deleteSig();
      if (deleteState.status === 'OK' && deleteState.value) {
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings?.splice(listingToDeleteIndex!, 1);
        this.toastService.send({severity:"success",summary:"Deleted Successfully", detail:"Listing deleted successfully"})
      }else if(deleteState.status === 'ERROR' ){
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings![listingToDeleteIndex!].loading = false;
        this.toastService.send({severity:"error",summary:"Error", detail:"Error while deleting listing"})  
      }
      this.loadingDeletion = false;
    })
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fetchListing()
  }

  onDeleteListing(listing : CardListing){
    listing.loading = true;
    this.toastService.sendConfirm("Are you sure you want to delete this Listing", () => this.confirmDelete(listing),this.cancleDelete.bind(this))
    listing.loading = false;
  }

  confirmDelete(listing : CardListing){this.landlordListingService.delete(listing.publicId);this.landlordListingService.resetDelete()}
  cancleDelete(){this.toastService.send({severity:"info",summary:"Info", detail:"Listing has not been deleted"}); }

  private fetchListing(){
    this.loadingFetchAll = true;
    this.landlordListingService.getAll();
  }

  onEditListing(existingListing: CardListing): void {
    existingListing.loading = true;

    this.landlordListingService.getSingle(existingListing.publicId).subscribe({
      next: (singleListing) => {
        if (singleListing) {
          this.editListing = singleListing;
          this.editListing.location = existingListing.location;
          console.log(this.editListing.id)
          this.ref = this.dialogService.open(PropertiesCreateComponent, {
            width: "60%",
            header: "Edit your ptlbnb home",
            closable: true,
            focusOnShow: true,
            modal: true,
            showHeader: true,
            data: {
              listing: this.editListing
            }
          });

          this.ref.onClose.subscribe((updatedListing) => {
            if (updatedListing) {
              // Handle the updated listing if necessary
            }
            existingListing.loading = false;
          });
        } else {
          this.toastService.send({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching listing details'
          });
          existingListing.loading = false;
        }
      },
      error: (err) => {
        console.error('Error occurred while fetching single listing:', err);
        this.toastService.send({
          severity: 'error',
          summary: 'Error',
          detail: 'Error occurred while fetching listing details'
        });
        existingListing.loading = false;
      }
    });
  }
}
