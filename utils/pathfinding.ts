import { Position, TileType } from '../types';

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: Node | null;
}

// Manhattan distance heuristic
const heuristic = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const isWalkable = (tile: TileType): boolean => {
  return tile !== TileType.WATER && tile !== TileType.ROCK;
};

export const findPath = (
  start: Position,
  end: Position,
  tiles: TileType[][],
  width: number,
  height: number
): Position[] => {
  const startX = Math.round(start.x);
  const startY = Math.round(start.y);
  const endX = Math.round(end.x);
  const endY = Math.round(end.y);

  // If start or end is out of bounds, return empty
  if (
    startX < 0 || startX >= width || startY < 0 || startY >= height ||
    endX < 0 || endX >= width || endY < 0 || endY >= height
  ) {
    return [];
  }

  // If end is not walkable, find the nearest walkable neighbor
  if (!isWalkable(tiles[endY][endX])) {
      // Simple search for nearest walkable tile
      const neighbors = [
          { x: endX + 1, y: endY },
          { x: endX - 1, y: endY },
          { x: endX, y: endY + 1 },
          { x: endX, y: endY - 1 },
      ];
      let found = false;
      for (const n of neighbors) {
          if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height && isWalkable(tiles[n.y][n.x])) {
              // Update end target to this neighbor
              // Note: We don't update endX/endY variable here because we want to return the path to the original request 
              // or close to it. But for A* we need a valid target.
              // Let's just return empty if clicked directly on obstacle for now, 
              // or maybe handle it in UI.
              // For now: return empty path if target is obstacle.
              return [];
          }
      }
      return [];
  }

  const openList: Node[] = [];
  const closedList: boolean[][] = Array(height).fill(false).map(() => Array(width).fill(false));

  const startNode: Node = {
    x: startX,
    y: startY,
    g: 0,
    h: heuristic({ x: startX, y: startY }, { x: endX, y: endY }),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;

  openList.push(startNode);

  while (openList.length > 0) {
    // Sort by f value (lowest first)
    openList.sort((a, b) => a.f - b.f);
    const currentNode = openList.shift()!;

    // Found destination
    if (currentNode.x === endX && currentNode.y === endY) {
      const path: Position[] = [];
      let curr: Node | null = currentNode;
      while (curr) {
        path.push({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }
      // Path is reversed (end -> start), so reverse it
      // Also remove the start node itself as we are already there
      return path.reverse().slice(1);
    }

    closedList[currentNode.y][currentNode.x] = true;

    const neighbors = [
      { x: currentNode.x, y: currentNode.y - 1 }, // Up
      { x: currentNode.x, y: currentNode.y + 1 }, // Down
      { x: currentNode.x - 1, y: currentNode.y }, // Left
      { x: currentNode.x + 1, y: currentNode.y }, // Right
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x < 0 || neighbor.x >= width ||
        neighbor.y < 0 || neighbor.y >= height
      ) {
        continue;
      }

      if (closedList[neighbor.y][neighbor.x]) {
        continue;
      }

      if (!isWalkable(tiles[neighbor.y][neighbor.x])) {
        continue;
      }

      const gScore = currentNode.g + 1;
      let neighborNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

      if (!neighborNode) {
        neighborNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: gScore,
          h: heuristic(neighbor, { x: endX, y: endY }),
          f: 0,
          parent: currentNode,
        };
        neighborNode.f = neighborNode.g + neighborNode.h;
        openList.push(neighborNode);
      } else if (gScore < neighborNode.g) {
        neighborNode.g = gScore;
        neighborNode.f = neighborNode.g + neighborNode.h;
        neighborNode.parent = currentNode;
      }
    }
  }

  // No path found
  return [];
};
