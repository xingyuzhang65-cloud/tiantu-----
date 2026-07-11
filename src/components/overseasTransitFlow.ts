import type { AddressFormState } from './overseasTransitAddress';

export type CreatedTransitInstruction = {
  code: string;
  name: string;
  type: string;
  unit: string;
  price: string;
  currency: string;
  description: string;
  quantity: string;
  addedAt: string;
  addedBy: string;
};
export type CreatedTransitChildOrder = {
  id: string;
  parentHeadWaybillNo: string;
  addressForm: AddressFormState;
  instructions: CreatedTransitInstruction[];
  fbaCode: string;
  customerName: string;
  destination: string;
  channel: string;
  childCreatedAt: string;
  orderSeq: number;
  transferNo: string;
  latestRoute: string;
  customerRemark: string;
  overseasWarehouseRemark: string;
  warehouseCode: string;
  zipCode: string;
  orderType: string;
  salesman: string;
  merchandiser: string;
  status: '待确认';
  packages: number;
  weight: string;
  volume: string;
  inboundTime: string;
  boxNumbers: string[];
};

const createdTransitChildOrders: CreatedTransitChildOrder[] = [];
const removedStorageBoxCounts: Record<string, number> = {};
const removedStorageBoxNumbers: Record<string, string[]> = {};
const listeners = new Set<() => void>();

export const getCreatedTransitChildOrders = () => [...createdTransitChildOrders];

export const getRemovedStorageBoxCount = (parentHeadWaybillNo: string) => removedStorageBoxCounts[parentHeadWaybillNo] || 0;

export const getRemovedStorageBoxNumbers = (parentHeadWaybillNo: string) => removedStorageBoxNumbers[parentHeadWaybillNo] || [];

export const subscribeOverseasTransitFlow = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const submitStorageBoxesAsTransitChild = (order: CreatedTransitChildOrder) => {
  createdTransitChildOrders.push(order);
  removedStorageBoxCounts[order.parentHeadWaybillNo] = (removedStorageBoxCounts[order.parentHeadWaybillNo] || 0) + order.boxNumbers.length;
  removedStorageBoxNumbers[order.parentHeadWaybillNo] = [...(removedStorageBoxNumbers[order.parentHeadWaybillNo] || []), ...order.boxNumbers];
  listeners.forEach((listener) => listener());
};
