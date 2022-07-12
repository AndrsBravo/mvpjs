import { Entity } from "mvp";
export class Todo extends Entity {
  constructor() {
    super("Todo", "Todo", {});

    const data = [
      { id: 1, task: "Crear las plantillas" },
      { id: 2, task: "Crear las vistas" },
      { id: 3, task: "Crear los modelos" },
      { id: 4, task: "Crear los controladores" },
      { id: 4, task: "Crear las entidades" },
    ];

    this.setData(data);
  }
}
