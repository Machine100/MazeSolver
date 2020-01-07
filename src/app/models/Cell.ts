export class Cell {
    id:         string
    shortestPath: boolean 
    visited:    boolean
    discovered: boolean
    explored:   boolean
    blocked:    boolean
    onStack:    boolean
    hasCursor:  boolean
    startCell:  boolean
    finishCell: boolean
    wallUp:     boolean
    wallDown:   boolean
    wallLeft:   boolean
    wallRight:  boolean
}