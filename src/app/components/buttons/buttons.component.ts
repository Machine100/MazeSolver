import { Component, OnInit } from '@angular/core';
import { DisplaycontrolService } from 'src/app/displaycontrol.service';
import { BreadthfirstService } from 'src/app/algorithms/breadthfirst.service';
import { MazerecursivebacktrackerService } from 'src/app/algorithms/mazerecursivebacktracker.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(
    private displayControl: DisplaycontrolService,
    private breadthfirst: BreadthfirstService,
    private mazeRecursiveBacktracker: MazerecursivebacktrackerService) {}

  ngOnInit() {
    this.onInit()
  }

  onInit() {
    this.displayControl.initBoard()
    this.displayControl.markStart(2, 2)
    this.displayControl.markFinish(17, 17)
    this.displayControl.redrawBoard()
  }

  onStepBreadth() {
    this.breadthfirst.init()
    this.breadthfirst.runAlgo()
  }

  onStartMazeRecursiveBacktracker() {
    this.mazeRecursiveBacktracker.onInitStack()
    this.mazeRecursiveBacktracker.onFireoffAlgo()
  }
}
