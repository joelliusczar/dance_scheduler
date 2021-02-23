import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: "callCounter",
	template: `
		{{ping()}}
    <div id="top" class="brick {{klass}}" #topOne tabIndex="-1"></div>
    <div id="tow" class="brick {{klass}}" #twoOne tabIndex="-1"></div>
    <div>
      <button (click)="topOnClick()">Top</button>
			<button (click)="twoOnClick()">Two</button>
			<button (click)="switchClass()">Switch klass</button>
    </div>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
			}
			button {
				margin: 5px;
			}
      .brick {
        width: 100px;
        height: 100px;
			}
			.volcano:after {
				content: 'hiya';
				color: #000;
			}
      #top {
        background-color: #1ecbe1;
      }
      #tow {
        background-color: #e1341e;
      }
      .brick:focus {
        border-width: 1px;
        border-style: solid;
        border-color: black;
      }
    `
  ]
})
export class CallCounterComponent {
  @Input() name: string;
  @ViewChild("topOne") topOne: ElementRef;
  @ViewChild("twoOne") twoOne: ElementRef;
	klass = "brick";

  topOnClick() {
    console.log("top");
    this.topOne.nativeElement.focus();
  }

  twoOnClick() {
    console.log("two");
    this.twoOne.nativeElement.focus();
	}

	switchClass() {
		if(this.klass === 'volcano') {
			this.klass = undefined;
		}
		else {
			this.klass = 'volcano';
		}
	}
	
	ping() {
		console.log('ping');
	}
}