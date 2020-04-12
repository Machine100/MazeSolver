import { Injectable } from '@angular/core';
import { DisplaycontrolService } from 'src/app/displaycontrol.service';
import { resolve, delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class MazerecursivebacktrackerService {

  constructor(private displayControl:DisplaycontrolService) { }

  stack: string[]
  algoFinished: boolean

  onInitStack(){
    this.stack = []
    this.displayControl.moveCursor (this.displayControl.startRow, this.displayControl.startColumn)
    this.displayControl.markVisited(this.displayControl.cursorRow,this.displayControl.cursorColumn) // mark inital position as visited
  }

  private _delayTimer() {
    return new Promise((resolve) => {
      setTimeout ( ()=> {
        resolve()
      },0)               //set to 30 for production
    })
  }
  
  async onFireoffAlgo(){         //  board must have already been created, Must have stack initialized, Need check for valid start&end position
    this.algoFinished = false
    while (!this.algoFinished) {                            // step algo until maze generation is complete
      await this._stepAlgo()
      await this._delayTimer()
      console.log('---single algo step complete---')
    }
  }

  private async _stepAlgo(){                         
    let cursorId:string = this.displayControl.cursorRow.toString() + this.displayControl.cursorColumn.toString(); 
    let chosenDirection:string = 'none'
    while (chosenDirection === 'none') {
      chosenDirection = this._chooseMove();
      if (chosenDirection === 'none') { 
        this._backTrack()
        await this._delayTimer()
        if (this.stack.length === 0) { this.algoFinished = true; return }            //maze is complete
      }
    }
    const destinationLocation:number[] = this._getDestinationLocation(chosenDirection)
    this.displayControl.knockoutWalls(chosenDirection)
    this.displayControl.moveCursor(destinationLocation[0], destinationLocation[1])
    cursorId = this.displayControl.cursorRow.toString() + '_' + this.displayControl.cursorColumn.toString(); 
    this.stack.push(cursorId)                //push destination onto stack
    this.displayControl.markOnStack(this.displayControl.cursorRow, this.displayControl.cursorColumn)
  }
  
  private _chooseMove() {
    let resultDown:boolean = false
    let resultRight:boolean = false
    let resultUp:boolean = false
    let resultLeft:boolean = false
    if (this.displayControl.cursorRow    != 19) {resultDown = this._checkDown()}    // check that moves are within 
    if (this.displayControl.cursorColumn != 19) {resultRight = this._checkRight()}  // the outside boundrary and then
    if (this.displayControl.cursorRow    != 0) {resultUp = this._checkUp()}        // each direction
    if (this.displayControl.cursorColumn != 0) {resultLeft = this._checkLeft()}
    //console.log('right:',resultRight,'down:',resultDown,'left:',resultLeft,'up:',resultUp)
    for (let i=0; i<30; i++){
      let random:number = (Math.floor(Math.random()*4))
      if (random === 0 && resultDown) {return 'down'}
      if (random === 1 && resultRight) {return 'right'}
      if (random === 2 && resultUp) {return 'up'}
      if (random === 3 && resultLeft) {return 'left'}
    }
    return 'none'     // cursor is at a dead end
  }

  private _checkDown(){
    let onStack:boolean = false
    let cell = this.displayControl.board[this.displayControl.cursorRow + 1][this.displayControl.cursorColumn]
    this.stack.forEach(stackItem=>{        //check if id is on stack
      if (stackItem === cell.id) {onStack=true}
    })   
    if (cell.visited || cell.blocked || onStack) { return false }
    else return true
  }
  
  private _checkRight(){
    let onStack:boolean = false
    let cell = this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn + 1]
    this.stack.forEach(stackItem=>{        //check if id is on stack
      if (stackItem === cell.id) {onStack=true}
    })   
    if (cell.visited || cell.blocked || onStack) { return false }
    else return true
  }
  
  
  private _checkLeft(){
    let onStack:boolean = false
    let cell = this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn - 1]
    this.stack.forEach(stackItem=>{        //check if id is on stack
      if (stackItem === cell.id) {onStack=true}
    })   
    if (cell.visited || cell.blocked || onStack) { return false }
    else return true
  }

  private _checkUp(){
    let onStack:boolean = false
    let cell = this.displayControl.board[this.displayControl.cursorRow - 1][this.displayControl.cursorColumn]
    this.stack.forEach(item=>{             //check if id is on stack
      if (item === cell.id) {onStack=true}
    })   
    if (cell.visited || cell.blocked || onStack) { return false }
    else return true
  }

  private _getDestinationLocation(direction:string) {
    let destination:number[] = []  
    if (direction==='down') { 
      destination[0] = this.displayControl.cursorRow  + 1
      destination[1] = this.displayControl.cursorColumn
    }
    if (direction==='up') { 
      destination[0] = this.displayControl.cursorRow  - 1
      destination[1] = this.displayControl.cursorColumn
    }
    if (direction==='left') { 
      destination[0] = this.displayControl.cursorRow
      destination[1] = this.displayControl.cursorColumn - 1
    }
    if (direction==='right') { 
      destination[0] = this.displayControl.cursorRow
      destination[1] = this.displayControl.cursorColumn +1
    }
    return destination
  }

  private async _backTrack(){
    //console.log ('at _backTrack')
    await this._delayTimer()
    this.displayControl.markVisited(this.displayControl.cursorRow, this.displayControl.cursorColumn)
    const poppedLocation:number[] = this._popStack()
    if (this.stack.length === 0) {console.log('mazecomplete'); this.algoFinished = true; return}       //maze is complete
    this.displayControl.moveCursor(poppedLocation[0], poppedLocation[1])   //set master cursor position to stackpop position
  }

  private _popStack () {
    const poppedId:string = this.stack.pop()
    const poppedLocation:number[] = this.displayControl.getRowColumn(poppedId)
    //this.displayControl.board[poppedRowColumn[0]][poppedRowColumn[1]].onStack = false  //update display state
    //document.getElementById(poppedId).classList.remove('on-stack') //update display element 
    this.displayControl.markOffStack(poppedLocation[0], poppedLocation[1])
    return poppedLocation
  }

  pushStack (id:string) {
    this.stack.push(id)
    const poppedRowColumn:number[] = this.displayControl.getRowColumn(id)
    //this.displayControl.board[poppedRowColumn[0]][poppedRowColumn[1]].onStack = true  //update display state
    this.displayControl.markOnStack(poppedRowColumn[0], poppedRowColumn[1])
  }

}
