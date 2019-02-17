import { getDistance, Point } from '@react-ts-monorepo/common';

interface Line {
  from: Point;
  to: Point;
}

export var getLength = function (line: Line) {
    return getDistance(line.from, line.to);
};