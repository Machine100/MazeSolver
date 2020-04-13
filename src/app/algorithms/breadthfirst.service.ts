import { Injectable } from '@angular/core';
import { DisplaycontrolService } from 'src/app/displaycontrol.service';

@Injectable({
  providedIn: 'root'
})
export class BreadthfirstService {

  constructor(private displayControl: DisplaycontrolService) { }

  algoFinished: boolean
  sourceStack: string[]           // ids of nodes from where algo found the node
  traversalStack: string[]        // main output of the search algorithm
  stackPointer: number            // points to an index on the traversalStack
  shortestPath: string[]          // contains the shortest path from the start node to a given destination node

  init() {                        // Initialize values before starting algorithim
    console.log('at init()')
    this.algoFinished = false
    this.sourceStack = []
    this.traversalStack = []
    this.shortestPath = []
    this.stackPointer = 0
    this.displayControl.cursorRow = this.displayControl.startRow
    this.displayControl.cursorColumn = this.displayControl.startColumn
    // markings for the initial node:
      this.traversalStack[0] = this.displayControl.getId(this.displayControl.startRow,this.displayControl.startColumn)  //push start onto traversalstack                            // set first entry in traversalStack to start position
      this.sourceStack[0] = 'end'                                                                       // push ___ onto sourcestack for start location
      this.displayControl.markDiscovered(this.displayControl.startRow,this.displayControl.startColumn)  // mark start as discovered
      this.displayControl.markExplored(this.displayControl.startRow,this.displayControl.startColumn)    // mark start as explored
  }

  private _delayTimer () {
    return new Promise((resolve) => {
      setTimeout( () => {
        console.log('delayTimer Resolved')
        resolve()
      },30)                                      // set to 25 for production
    })
  }

  async runAlgo() {
    while(!this.algoFinished) {
      this.stepAlgo()
      await this._delayTimer()
      // console.log ('traversalStack:', this.traversalStack)
      // console.log ('sourceStack:', this.sourceStack)
    }
    this.findShortestPath('2_2')    // this static value for testing. Eventually make it moveable.
    this.markShortestPath()
  }

  stepAlgo() {
    console.log('at stepAlgo()')
    // console.log(this.traversalStack)
    console.log('stackLength', this.traversalStack.length)
    console.log('stackPointer:', this.stackPointer)
    this.exploreNeighbors()                     // visit all neighbors and place unexplored ones onto traversalStack
    if (this.stackPointer +1 === this.traversalStack.length) {
      console.log ('algo complete')
      this.algoFinished = true
      return
    }
    ++this.stackPointer                         // move stack i to next stack location
    const nextLocation: string = this.traversalStack[this.stackPointer]
    const destinationCursorRowCol: number[] = this.displayControl.getRowColumn(nextLocation)
    this.displayControl.moveCursor(destinationCursorRowCol[0], destinationCursorRowCol[1])
  }

  exploreNeighbors() {
    console.log ('cursor at:', this.displayControl.cursorRow,this.displayControl.cursorColumn)
    this._processDown()                         // validate each direction
    this._processRight()
    this._processUp()
    this._processLeft()
    this.displayControl.markExplored(this.displayControl.cursorRow,this.displayControl.cursorColumn)
  }

  private _processDown() {
    if (this.displayControl.cursorRow === 19) { console.log ('down rejected'); return } // check for board boundary
    let validMove = true
    const destinationRow = this.displayControl.cursorRow + 1
    const destinationColumn = this.displayControl.cursorColumn
    const destinationId: string = this.displayControl.getId(destinationRow,destinationColumn)
    const cursorId: string = this.displayControl.getId(this.displayControl.cursorRow, this.displayControl.cursorColumn)
    if (this.displayControl.board[destinationRow][destinationColumn].blocked) { console.log ('down rejected for block'); return } //check for blocked node

    if ( this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn].wallDown ) {
      console.log('rejected for wall')
      return
    }

    console.log('for down, checing destination:',destinationRow,destinationColumn)
    const cell = this.displayControl.board[destinationRow][destinationColumn]
    if (cell.discovered === true) { validMove = false }   // check if destination node is already discovered
    if (validMove) {                                      // if not, discover it.
      this.displayControl.markDiscovered(destinationRow, destinationColumn)
      this.traversalStack.push(destinationId)
      this.sourceStack.push(cursorId)
     // this.displayControl.markSource(destinationRow, destinationColumn)
    }
    return
  }

  private _processRight() {
    if (this.displayControl.cursorColumn === 19) { console.log ('right rejected'); return } // check for board boundary
    let validMove = true
    const destinationRow = this.displayControl.cursorRow
    const destinationColumn = this.displayControl.cursorColumn + 1
    const destinationId: string = this.displayControl.getId(destinationRow,destinationColumn)
    const cursorId: string = this.displayControl.getId(this.displayControl.cursorRow, this.displayControl.cursorColumn)
    if (this.displayControl.board[destinationRow][destinationColumn].blocked) { console.log ('down rejected for block'); return } //check for blocked node

    if (this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn].wallRight ) {
      console.log('rejected for wall')
      return
    }

    console.log('for Right, checing destination:',destinationRow,destinationColumn)
    const cell = this.displayControl.board[destinationRow][destinationColumn]
    if (cell.discovered === true) { validMove = false }   // check if destination node already discovered
    if (validMove) {                                      // if not, discover it
      this.displayControl.markDiscovered(destinationRow, destinationColumn)
      this.traversalStack.push(destinationId)
      this.sourceStack.push(cursorId)
      // this.displayControl.markSource(destinationRow, destinationColumn)
    }
    return
  }

  private _processUp() {                                                             // these look for new discoveries
    if (this.displayControl.cursorRow === 0) { console.log ('up rejected'); return } // check for board boundary
    let validMove = true
    const destinationRow = this.displayControl.cursorRow - 1
    const destinationColumn = this.displayControl.cursorColumn
    const destinationId: string = this.displayControl.getId(destinationRow,destinationColumn)
    const cursorId: string = this.displayControl.getId(this.displayControl.cursorRow, this.displayControl.cursorColumn)
    if (this.displayControl.board[destinationRow][destinationColumn].blocked) { console.log ('down rejected for block'); return } //check for blocked node

    if (this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn].wallUp) {
      console.log('rejected for wall')                   // these sections added to enable solving of maze.
      return
    }

    console.log('for up, checing destination:', destinationRow, destinationColumn)
    const cell = this.displayControl.board[destinationRow][destinationColumn]
    if (cell.discovered === true) { validMove = false }
    if (validMove) {
      this.displayControl.markDiscovered(destinationRow, destinationColumn)
      this.traversalStack.push(destinationId)
      this.sourceStack.push(cursorId)
      // this.displayControl.markSource(destinationRow, destinationColumn)
    }
    return
  }

  private _processLeft() {
    if (this.displayControl.cursorColumn === 0) { console.log ('left rejected'); return } // check for board boundary
    let validMove = true
    const destinationRow = this.displayControl.cursorRow
    const destinationColumn = this.displayControl.cursorColumn - 1
    const destinationId: string = this.displayControl.getId(destinationRow, destinationColumn)
    const cursorId: string = this.displayControl.getId(this.displayControl.cursorRow, this.displayControl.cursorColumn)
    if (this.displayControl.board[destinationRow][destinationColumn].blocked) { console.log ('down rejected for block'); return } //check for blocked node

    if (this.displayControl.board[this.displayControl.cursorRow][this.displayControl.cursorColumn].wallLeft ) {
      console.log('rejected for wall')
      return
    }

    console.log('for left, checing destination:',destinationRow,destinationColumn)
    const cell = this.displayControl.board[destinationRow][destinationColumn]
    if (cell.discovered === true) { validMove = false }      // check if id is already discovered
    if (validMove) {
      this.displayControl.markDiscovered(destinationRow, destinationColumn)
      this.traversalStack.push(destinationId)
      this.sourceStack.push(cursorId)
      // this.displayControl.markSource(destinationRow, destinationColumn)
    }
    return
  }

  findShortestPath(destinationCell: string) {                // given a destination node, trace it back to the starting node
    console.log('at shortestpath')                           // by tracing discovering nodes.
    let cursor: string = destinationCell
    const failSafe = 0
    let keepgoing = true
    while (keepgoing) {                                      // starting at fromCell, find it's discoverer, push that into array, change next to current, 
      const discoverer: string = this._findDiscoverer(cursor)   // find discoverer of cell under cursor
      console.log('cursor:', cursor,' discoverer: ', discoverer )
      this.shortestPath.push(discoverer)                     // push that discoverer into sp array
      if (discoverer === 'end') { console.log('ending'); keepgoing = false; break }
      if (failSafe > 700) { console.log('no solution. failsafe triggered.'); keepgoing = false; break }   //hacky way to prevent infinite loop errors
      cursor = discoverer                                    // move cursor:string to next node on shortest path 
    }
    console.log('Shortest Path Array:', this.shortestPath)
  }

  private _findDiscoverer(id: string) {                       // given an id, return the cell that discovered it
    let discoverer: string
    for (let i = 0; i <= this.traversalStack.length; i++) {
      if (this.traversalStack[i] === id) { discoverer = this.sourceStack[i]; break }
       }
    return discoverer
  }

  markShortestPath() {
    console.log('at markShortestPath()')
    this.shortestPath.forEach( (element) => {
      if (!(element === 'end')) {                             // do not attempt to process the ending node
        const elementRowColumn: number[] = this.displayControl.getRowColumn(element)
        this.displayControl.markShortestPath(elementRowColumn[0], elementRowColumn[1])
        console.log('loop in markShortestPath')
      }
    })
  }
}
