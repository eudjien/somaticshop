export class PasswordOptionsModel {
  constructor(
    public requireDigit: boolean,
    public requireLowercase: boolean,
    public requireNonAlphanumeric: boolean,
    public requireUppercase: boolean,
    public requiredLength: number,
    public requiredUniqueChars: number
  ) {
  }
}
