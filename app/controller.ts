import { Cli } from "./cli.js";
import { Encoder } from "./encoder.js";
import { Store } from "./store.js";

export class Controller {
  private cmd: string;
  private args: string[];
  private store: Store;
  private cli: Cli;

  constructor(value: string[], store: Store, cli: Cli) {
    [this.cmd, ...this.args] = value;
    this.store = store;
    this.cli = new Cli();
  }

  handle() {
    switch (this.cmd) {
      case "ping":
        return this.handlePing();

      case "echo":
        return this.handleEcho();

      case "set":
        return this.handleSet();

      case "get":
        return this.handleGet();

      case "info":
        return this.handleInfo();
    }
  }

  private handleEcho() {
    return Encoder.simpleString(this.args.join(" "));
  }

  private handlePing() {
    return Encoder.simpleString("PONG");
  }

  private handleGet() {
    let [key] = this.args;
    let value = this.store.get(key);
    if (value) return Encoder.simpleString(value);

    return Encoder.nil();
  }

  private handleSet() {
    const [key, value, ...opts] = this.args;
    let [opt, optVal] = opts;

    switch (opt) {
      case "px":
        let timeToLive = parseInt(optVal);
        this.store.set(key, value, timeToLive);

      default:
        this.store.set(key, value);
    }

    return Encoder.simpleString("OK");
  }

  private handleInfo() {
    let replicaof = this.cli.replicaof;

    if (replicaof) {
      let [masterHost] = this.cli.replicaof;
      return Encoder.bulkString("role:slave");
    }

    return Encoder.bulkString("role:master");
  }
}
