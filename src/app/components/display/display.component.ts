import { Component, OnInit } from '@angular/core';
import { DisplaycontrolService } from 'src/app/displaycontrol.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  constructor(private displayControl:DisplaycontrolService) { }

  ngOnInit() {
  }

  onClick(id:string) {
    console.log('click at ', id)
    let idRowCol:number[] = this.displayControl.getRowColumn(id)
    this.displayControl.markBlocked(idRowCol[0],idRowCol[1])
  }
}
