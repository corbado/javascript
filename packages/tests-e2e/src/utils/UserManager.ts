/**
 * This class is used to manage the user for the integration tests.
 * It is used to generate a unique user for each test run.
 */
class UserManager {
  static #userList: string[] = [];
  static #index = 0;

  // This method is used to generate a unique user for each test run.
  public static getUserForSignup(): string {
    const timestamp = Date.now();
    const randomness = Math.floor(Math.random() * 9000) + 1000;
    const user = `integration-test+${timestamp % 9}${randomness}${this.#index}`;
    this.#userList.push(user);
    this.#index++;
    return user;
  }

  // This method is used to retrieve the user for login.
  public static getUserForLogin(index = 0): string {
    if (index < 0 || index >= this.#userList.length) {
      throw new Error('Invalid index for login user retrieval.');
    }
    return this.#userList[index];
  }

  // Useful for debugging and for cleaning up the user after the test run.
  public static getAllUser(): string[] {
    return this.#userList;
  }
}

export default UserManager;
