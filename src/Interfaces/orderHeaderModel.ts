import { SD_Status } from "../Utility/SD";
import orderDetail from "./orderDetailModel";

export default interface orderHeader {
  orderHeaderId?: number;
  pickupName?: string;
  pickupPhoneNumber?: number;
  pickupEmail?: string;
  applicationUserId?: string;
  user?: any;
  orderTotal?: number;
  orderDate: Date;
  stripePaymentIntentId?: string;
  status?: SD_Status;
  totalItems?: number;
  orderDetails?: orderDetail[];
}
