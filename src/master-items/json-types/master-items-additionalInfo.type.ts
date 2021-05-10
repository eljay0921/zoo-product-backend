enum Tax {
  Taxation,
  TaxFree,
}

export class MasterItemAdditionalInfo {
  tax?: Tax;
  origin?: string;
  brand?: string;
}
