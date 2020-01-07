import { Injectable } from '@angular/core';
import { Cell } from './models/cell'

@Injectable({
  providedIn: 'root'
})
export class DisplaycontrolService {

  constructor() { }

  startRow: number
  startColumn: number
  cursorRow: number                     
  cursorColumn: number
  board: Cell[][]       //a 2D array of objects representing each space on the maze

  getId(row:number, column:number) {                           // returns an id given a row/column 
    return row.toString() + '_' + column.toString()
   
  }

  getRowColumn(id:string) {                                    // returns a row/column given an id
    const result:string[] = id.split('_')
    const location:number[] = []
    location[0] = Number(result[0])
    location[1] = Number(result[1])
    return location                // return the row and column
  }

  initBoard() {
    this.cursorRow = 0
    this.cursorColumn = 0
    let row:number = 0
    let column:number = 0
    this.board = [ [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[] ] 
    for (row=0; row<20; row++){
      for (column=0; column<20; column++){
          this.board[row][column] = {
            id: row.toString() + '_' + column.toString(),
            shortestPath: false, 
            visited: false,
            discovered: false,
            explored: false,
            blocked: false,
            onStack: false,
            hasCursor: false,
            startCell: false,
            finishCell: false,
            wallUp: true,
            wallDown: true,
            wallLeft: true,
            wallRight: true
          }
      }
    }
    console.log('board:', this.board)
  }

    redrawBoard (){
    let row:number = 0
    let column:number = 0
    for (row=0; row<20; row++){
      for (column=0; column<20; column++){
        const id:string = this.getId(row, column)
        let shortestPath:boolean = this.board[row][column].shortestPath
        let up:boolean = this.board[row][column].wallUp
        let down:boolean = this.board[row][column].wallDown
        let left:boolean = this.board[row][column].wallLeft
        let right:boolean = this.board[row][column].wallRight
        let blocked:boolean = this.board[row][column].blocked
        let hasCursor:boolean = this.board[row][column].hasCursor
        let onStack:boolean = this.board[row][column].onStack
        let startCell:boolean = this.board[row][column].startCell 
        let finishCell:boolean = this.board[row][column].finishCell
        let visited:boolean = this.board[row][column].visited
        let discovered:boolean = this.board[row][column].discovered
        let explored:boolean = this.board[row][column].explored
        if (up) { document.getElementById(id).classList.add('u') }
        if (!up) { document.getElementById(id).classList.remove('u') }
        if (down) { document.getElementById(id).classList.add('d') }
        if (!down) { document.getElementById(id).classList.remove('d') }
        if (left) { document.getElementById(id).classList.add('l') }
        if (!left) { document.getElementById(id).classList.remove('l') }
        if (right) { document.getElementById(id).classList.add('r') }
        if (!right) { document.getElementById(id).classList.remove('r') }
        if (blocked) { document.getElementById(id).classList.add('blocked') }
        if (!blocked) { document.getElementById(id).classList.remove('blocked') }
        if (hasCursor) { document.getElementById(id).classList.add('has-cursor') }
        if (!hasCursor) { document.getElementById(id).classList.remove('has-cursor') }
        if (onStack) { document.getElementById(id).classList.add('on-stack') }
        if (!onStack) { document.getElementById(id).classList.remove('on-stack') }
        if (startCell) { document.getElementById(id).classList.add('start-cell') }
        if (!startCell) { document.getElementById(id).classList.remove('start-cell') }
        if (finishCell) { document.getElementById(id).classList.add('finish-cell') }
        if (!finishCell) { document.getElementById(id).classList.remove('finish-cell') }
        if (visited) { document.getElementById(id).classList.add('visited') }
        if (!visited) { document.getElementById(id).classList.remove('visited') }
        if (discovered) { document.getElementById(id).classList.add('discovered') }
        if (!discovered) { document.getElementById(id).classList.remove('discovered') }
        if (explored) { document.getElementById(id).classList.add('explored') }
        if (!explored) { document.getElementById(id).classList.remove('explored') }
        if (shortestPath) { document.getElementById(id).classList.add('shortest-path') }
        if (!shortestPath) { document.getElementById(id).classList.remove('shortest-path') }
      }
    }
  }

  // fillCell (row:number, column:number) {
  //   const id:string = this.getId(row, column)
  //   this.board[row][column].filled = true                   //update state  
  //   this.redrawBoard()
  // }

  // clearCell (row:number, column:number) {
  //   const id:string = this.getId(row, column)
  //   this.board[row][column].filled = true                   //update state  
  //   this.redrawBoard()
  // }

  markStart (row:number, column:number) {
    const id:string = this.getId(row, column)
    this.board[row][column].startCell = true                //update display state
    this.startRow = row                                     //update state store
    this.startColumn = column
    this.redrawBoard()
  }

  markFinish (row:number, column:number) {
    const id:string = this.getId(row, column)
    this.board[row][column].finishCell = true               //update display state
    this.startRow = row                                     //update state store
    this.startColumn = column
    this.redrawBoard()
  }  

  markVisited (row:number, column:number) {
    this.board[this.cursorRow][this.cursorColumn].visited = true
    let id:string = this.getId(row, column)
    document.getElementById(id).classList.add('visited')
    //this.redrawBoard()
  }

  markDiscovered (row:number, column:number) {
    console.log('at markDiscovered', row, column)
     this.board[row][column].discovered = true               //update display state
     let id:string = this.getId(row, column)
     document.getElementById(id).classList.add('discovered')
     //this.redrawBoard()
  }

  markExplored (row:number, column:number) {
     this.board[row][column].explored = true               //update display state
     //this.redrawBoard()
     let id:string = this.getId(row, column)
     document.getElementById(id).classList.add('explored')
     //this.redrawBoard()
  }

  markOffStack (row:number, column:number) {
     this.board[row][column].onStack = false               //update display state
     //this.redrawBoard()
     let id:string = this.getId(row, column)
     document.getElementById(id).classList.remove('on-stack')
     //this.redrawBoard()
  }

  markOnStack (row:number, column:number) {
     this.board[row][column].onStack = true                //update display state
     //this.redrawBoard()
     let id:string = this.getId(row, column)
     //document.getElementById(id).classList.add('on-stack')
     this.redrawBoard()
  }

  markBlocked (row:number, column:number) {
     this.board[row][column].blocked= true                //update display state
     //this.redrawBoard()
     let id:string = this.getId(row, column)
     document.getElementById(id).classList.add('blocked')
  }

  markShortestPath (row:number, column:number) {
    this.board[row][column].shortestPath = true                //update display state
    let id:string = this.getId(row, column)
    document.getElementById(id).classList.add('shortest-path')
  }

  moveCursor(destinationRow:number, destinationColumn:number){
    this.board[this.cursorRow][this.cursorColumn].hasCursor = false    //update view state and 
    let cursorId:string = this.getId(this.cursorRow, this.cursorColumn) //update view CSS
    document.getElementById(cursorId).classList.remove('has-cursor')   //to remove previous cursor location
    this.cursorColumn = destinationColumn   //change the cursor location
    this.cursorRow = destinationRow         // 
    this.board[destinationRow][destinationColumn].hasCursor = true     //update view state and
    cursorId = this.getId(this.cursorRow, this.cursorColumn)            //update view CSS
    document.getElementById(cursorId).classList.add('has-cursor')             //to reflect new cursor location
    //console.log('currentcursorRow',this.cursorRow,'currentcursorColumn:',this.cursorColumn)
  }

  knockoutWalls(direction:string){
    console.log('at knockoutWalls', 'requesteddirection:', direction)
    switch (direction) {
      case 'down':
        this.board[this.cursorRow][this.cursorColumn].wallDown = false
        this.board[this.cursorRow + 1][this.cursorColumn].wallUp = false
        console.log('broke walls down')
        break
      case 'right':
        this.board[this.cursorRow][this.cursorColumn].wallRight = false
        this.board[this.cursorRow][this.cursorColumn + 1].wallLeft = false
        console.log('broke walls right')
        break
      case 'up':
        this.board[this.cursorRow][this.cursorColumn].wallUp = false
        this.board[this.cursorRow - 1][this.cursorColumn].wallDown = false
        console.log('broke walls up')
        break
      case 'left':
        this.board[this.cursorRow][this.cursorColumn].wallLeft = false
        this.board[this.cursorRow][this.cursorColumn - 1].wallRight = false
        console.log('broke walls left')
      }
  }
}
