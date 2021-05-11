enum Tax {
  Taxation,
  TaxFree,
}

export class AdditionalInfo {
  tax?: Tax;
  origin?: string;
  brand?: string;
}
