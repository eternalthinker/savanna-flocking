import { Updatable } from "./Updatable";

export class Layer {
  private updatables: Set<Updatable> = new Set<Updatable>();

  registerUpdatable(u: Updatable) {
    this.updatables.add(u);
  }

  deregisterUpdatable(u: Updatable) {
    this.updatables.delete(u);
  }

  update() {
    this.updatables.forEach(u => u.update());
  }
}
