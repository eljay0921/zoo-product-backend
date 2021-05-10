export class CreateMasterItemsResult {
  constructor(private readonly seq: number) {
    this.ok = false;
    this.messages = [];
  }

  ok: boolean;
  masterItemId?: number;
  messages?: string[];
}
