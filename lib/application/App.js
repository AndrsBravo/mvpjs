import AppImport  from "./AppImport";
class AppResources {
  static #import;
  constructor() {}
  get import() {
    if (!AppResources.#import) {
      AppResources.#import = new AppImport();
    }
    return AppResources.#import;
  }
}

const app = new AppResources();
export { app };
