import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  formControl: FormControl = new FormControl<string>("");
  spellcheck: boolean = true;

  constructor() {}

  private addConcat(newvalue: string): void {
    this.formControl.setValue(this.formControl.value.concat("\n", newvalue));
  }

  bold(): void {
    this.addConcat("**bold**");
  }

  italic(): void {
    this.addConcat("*italic*");
  }

  strikethrough(): void {
    this.addConcat("~~strikethrough~~");
  }

  quote(): void {
    this.addConcat("> Quote");
  }

  link(): void {
    this.addConcat("[Example website](http://www.example.com)");
  }

  image(): void {
    this.addConcat("![alt text](link/to/logo.png \"Logo Title Text 1\")");
  }

  code(): void {
    this.addConcat("```\ncode here\n```");
  }

  list_bulleted(): void {
    this.addConcat("- Element 1\n- Element 2\n- Element 3");
  }

  list_numbered(): void {
    this.addConcat("1. First element\n2. Second element\n3. Third element");
  }

  table(): void {
    this.addConcat("| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |");
  }

  header(level: number): void {
    if(level < 1 || level > 6) return;
    let str = "";
    for(let i = 0; i < level; i++) {
      str += "#";
    }
    this.addConcat(`${str} Header ${level}`);
  }

  save_to_file(): void {
    const data = this.formControl.value;
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/markdown" }));
    a.download = "markdownfile.md";
    a.click();
  }
}
