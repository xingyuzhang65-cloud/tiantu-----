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
  containerNo?: string;
  billOfLadingNo?: string;
  customerRemark: string;
  overseasWarehouseRemark: string;
  warehouseCode: string;
  zipCode: string;
  orderType: string;
  salesman: string;
  merchandiser: string;
  status: '待确认' | '已确认' | '已下单' | '转运中' | '签收' | '取消';
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
export const confirmCreatedTransitChildOrders = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '待确认') {
      order.status = '已确认';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};

export const cancelCreatedTransitChildOrders = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (!idSet.has(order.id) || (order.status !== '待确认' && order.status !== '已确认')) return;

    order.status = '取消';
    removedStorageBoxCounts[order.parentHeadWaybillNo] = Math.max(
      0,
      (removedStorageBoxCounts[order.parentHeadWaybillNo] || 0) - order.boxNumbers.length,
    );

    const canceledBoxNumbers = new Set(order.boxNumbers);
    removedStorageBoxNumbers[order.parentHeadWaybillNo] = (removedStorageBoxNumbers[order.parentHeadWaybillNo] || [])
      .filter((boxNumber) => !canceledBoxNumbers.has(boxNumber));

    changed = true;
  });

  if (changed) listeners.forEach((listener) => listener());
};
export const markCreatedTransitChildOrdersAsOrdered = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '已确认') {
      order.status = '已下单';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};
export const rollbackCreatedTransitChildOrdersToConfirmed = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '已下单') {
      order.status = '已确认';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};

export const shipCreatedTransitChildOrders = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '已下单') {
      order.status = '转运中';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};
export const signCreatedTransitChildOrders = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '转运中') {
      order.status = '签收';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};

export const rollbackCreatedTransitChildOrdersToOrdered = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '转运中') {
      order.status = '已下单';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};
export const rollbackSignedCreatedTransitChildOrdersToTransit = (orderIds: string[]) => {
  const idSet = new Set(orderIds);
  let changed = false;

  createdTransitChildOrders.forEach((order) => {
    if (idSet.has(order.id) && order.status === '签收') {
      order.status = '转运中';
      changed = true;
    }
  });

  if (changed) listeners.forEach((listener) => listener());
};
