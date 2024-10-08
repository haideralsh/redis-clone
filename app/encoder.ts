import { RespType, RespValue } from "./resp.js";

export default class Encoder {
  static bulkString(...values: string[]) {
    let output = values.join(RespValue.Crlf);

    return `${RespType.BulkString}${output.length}${RespValue.Crlf}${output}${RespValue.Crlf}`;
  }

  static simpleString(...values: string[]) {
    return `${RespType.SimpleString}${values.join(" ")}${RespValue.Crlf}`;
  }

  static nil() {
    return `${RespType.BulkString}${RespValue.Nil}${RespValue.Crlf}`;
  }

  static array(...values: string[]) {
    let length = values.length;
    let elements = values.map((value) => Encoder.bulkString(value)).join("");

    return `${RespType.Array}${length}${RespValue.Crlf}${elements}`;
  }
}
