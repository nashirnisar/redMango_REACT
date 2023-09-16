import { cartItemModel } from "../../../Interfaces";
import { SD_Status } from "../../../Utility/SD";

export interface orderSummaryProps {
  data: {
    id?: number;
    cartItems?: cartItemModel[];
    cartTotal?: number;
    userId?: string;
    stripePaymentIntentId?: string;
    status?: SD_Status; // for showing status in order details page
  };
  userInput: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
}
