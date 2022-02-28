import { Layout } from "mvp";

export default class extends Layout {
  constructor() {
    super({ name: "MyLayout", target: document.body, view: null });
  }

  start() {}
}
