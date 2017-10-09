import {Component, OnInit}  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app",
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private _route: ActivatedRoute) {}
    ngOnInit() {}
}

