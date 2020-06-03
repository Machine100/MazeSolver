import { Component, OnInit } from '@angular/core';
import { DisplaycontrolService } from 'src/app/displaycontrol.service';
import { BreadthfirstService } from 'src/app/algorithms/breadthfirst.service';
import { MazerecursivebacktrackerService } from 'src/app/algorithms/mazerecursivebacktracker.service';
import { Button } from 'protractor';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  generateButtonDepressed: boolean              // these ensure the user adheres to the intended
  solveButtonDepressed: boolean                 // order for button selection, which is:
  mazeGenerating: boolean                       // generate, golve, then clear in that order only
  mazeGenerated: boolean                        //
  mazeSolving: boolean                          //
  mazeSolved: boolean                           //


  constructor(
    private displayControl: DisplaycontrolService,
    private breadthfirst: BreadthfirstService,
    private mazeRecursiveBacktracker: MazerecursivebacktrackerService) {}

  ngOnInit() {                                   // initalize everything on the board
    this.displayControl.initBoard()
    this.displayControl.markStart(2, 2)
    this.displayControl.markFinish(17, 17)
    this.displayControl.redrawBoard()
    this.generateButtonDepressed = false; this.mazeGenerated = false; this.mazeGenerating = false
    this.solveButtonDepressed = false; this.mazeSolved = false
  }

  async onGenerateMaze() {
    if (this.mazeGenerating) { console.log('maze is already being generated'); return }
    if (this.mazeGenerated) { console.log('maze already generated'); return }
    this.mazeGenerating = true
    document.getElementById('generate-button').style.color = 'red'
    await this.mazeRecursiveBacktracker.onInitStack()     // When you call a function, it goes on the call stack
    await this.mazeRecursiveBacktracker.onFireoffAlgo()   // therefore you don't need to use Async/Await.
    this.mazeGenerating = false
    this.mazeGenerated = true
  }

  async onSolveMaze() {
    if (!this.mazeGenerated) { console.log('maze not generated yet'); return }
    if (this.mazeSolving) { console.log('maze is already being solved'); return }
    if (this.mazeSolved) { console.log('maze already solved '); return }
    this.mazeSolving = true
    document.getElementById('solve-button').style.color = 'red'
    await this.breadthfirst.init()
    await this.breadthfirst.runAlgo()
    this.mazeSolving = false
    this.mazeSolved = true
  }

  onClearBoard() {
    if (!this.mazeSolved) { return }
    this.displayControl.initBoard()
    this.displayControl.markStart(2, 2)
    this.displayControl.markFinish(17, 17)
    this.displayControl.redrawBoard()
    this.generateButtonDepressed = false; this.mazeGenerated = false; this.mazeGenerating = false
    this.solveButtonDepressed = false; this.mazeSolved = false; this.mazeSolving = false
    document.getElementById('generate-button').style.color = '#3ffd1c'
    document.getElementById('solve-button').style.color = '#3ffd1c'
  }
}
