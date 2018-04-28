import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'dot',
  template: `<div class="dot no-drag"><ng-content></ng-content></div>`,
  styles: [
    `
    .dot {

      display: inline-block;
      align-items: center;
      justify-content: center;
      
      font-family: monospace;
      cursor: pointer;
      font-size: 16px;
      
      
    }

    .dot:before {
      content:'';
      float: left;
      width: auto;
    }
    

    .no-drag {
      -webkit-app-region: no-drag

    }


    `
  ]
})
export class DotComponent implements OnInit {
  @Input() input

  constructor() {}

  ngOnInit() {}
}
