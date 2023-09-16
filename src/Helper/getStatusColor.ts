import { SD_Status } from "../Utility/SD";

const getStatusColor = (status: SD_Status) => {
  return status === SD_Status.CONFIRMED
    ? "primary"
    : SD_Status.PENDING
    ? "secondary"
    : SD_Status.CANCELLED
    ? "danger"
    : SD_Status.BEING_COOKED
    ? "info"
    : SD_Status.COMPLETED
    ? "success"
    : SD_Status.READY_FOR_PICKUP && "warning";
};
export default getStatusColor;
