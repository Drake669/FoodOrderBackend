export interface CreateOrderInput {
  _id: string;
  unit: number;
}

export interface ProcessOrderInputs {
  orderStatus: string;
  deliveryId: string;
  remarks: string;
  readyTime: number; // in minutes
  appliedOffers: boolean;
  offerId: string;
}
