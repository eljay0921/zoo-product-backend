enum SendType {
  None,
  ECoupon,
  DoorToDoor,
  Post,
  Quick,
  Direct,
  Cargo,
  Joint,
  Center,
  Visit,
}

enum SendPayType {
  None,
  Arrived,
  Free,
  Condition,
  Group,
  Individual,
}

export class SellingItemInfo {
  sendType?: SendType;
  sendPayType?: SendPayType;
  sourceMarket?: string;
  sellerId?: string;
  sellingItemNo?: string;
  itemLink?: string;
}
