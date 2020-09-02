export class BuyerSearchModel {
  constructor(
    public ids?: number[],
    public  firstNames?: string[],
    public lastNames?: string[],
    public surNames?: string[],
    public phoneNumbers?: string[],
    public emails?: string[],
    public userOrAnonymousIds?: string[]
  ) {
  }
}
