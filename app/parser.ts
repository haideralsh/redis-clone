import Lexer, { Token } from "./lexer.js";

export default class Parser {
  private lexer: Lexer;

  constructor(input: string) {
    this.lexer = new Lexer(input);
  }

  parse() {
    let result = [];
    let token: Token;

    while ((token = this.lexer.next())) {
      let value = this.parseToken(token);
      result.push(value);
    }

    return result.flat();
  }

  private parseToken(token: Token) {
    switch (token.type) {
      case "BulkString":
      case "SimpleString":
        return token.value;

      case "Array":
        return token.value.map((t) => this.parseToken(t));
    }
  }
}
