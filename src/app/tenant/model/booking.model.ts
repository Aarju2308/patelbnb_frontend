import { Dayjs } from "dayjs";
import { PriceVO } from "../../landlord/model/listing-vo.model";
import { DisplayPicture } from "../../landlord/model/listing.model";

export interface BookedDateDTOFromServer{
    startDate : Date,
    endDate : Date,
}

export interface BookedListing{
    location : string,
    cover : DisplayPicture,
    totalPrice : PriceVO,
    dates : BookedDateDTOFromServer,
    bookingPublicId : string,
    listingPublicId : string,
    loading : boolean
}

export interface CreateBooking{
    startDate : Date,
    endDate : Date,
    listingPublicId : string,
}

export interface BookedDatesDTOFromClient{
    startDate:Dayjs,
    endDate:Dayjs
}

export interface BookedDatesDTOFromServer{
    startDate:Date,
    endDate:Date
}

export interface BookedListing{
    location: string,
    cover: DisplayPicture,
    totalPrice : PriceVO,
    dates : BookedDateDTOFromServer,
    bookingPublicId:string,
    listingPublicId:string,
    loading:boolean
}