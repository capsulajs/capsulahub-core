export class ServiceA {
  public readonly proxy: object;

  constructor() {
    this.proxy = {
      greet: (name: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          if (!name) {
            reject(`No name to greet has been provided :(`);
          }
          resolve(`Nice to meet you, dear ${name}`);
        });
      },
    };
  }
}
