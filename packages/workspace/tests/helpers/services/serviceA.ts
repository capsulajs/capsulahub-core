export class ServiceA {
  private message: string;

  constructor(message = 'Nice to meet you') {
    this.message = name;
  }

  greet(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!name) {
        reject('No name to greet has been provided :-(');
      }
      resolve(`${this.message}, dear ${name}`);
    });
  }
}
