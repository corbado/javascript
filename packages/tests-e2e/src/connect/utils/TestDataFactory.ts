export class TestDataFactory {
  static phoneNumber = '+1234567890';
  static password = 'TestPassword123!';

  static generateEmail(): string {
    const currentMilliseconds = Date.now();

    return `integration-test+${currentMilliseconds}@corbado.com`;
  }
}
