import { MouseEvent, TouchEvent } from "react";
import { canvasHeight, canvasWidth } from "./config";

export const randomHeight = (offset: number = 0) =>
    Math.random() * (canvasHeight - offset) + offset / 2;
export const randomWidth = (offset: number = 0) =>
    Math.random() * (canvasWidth - offset) + offset / 2;

export function circleIntersect(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
) {
    // Calculate the distance between the two circles
    let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= (r1 + r2) * (r1 + r2);
}

export function getClientCoordinates(
    event: MouseEvent | TouchEvent,
    end = false
) {
    let newX: number, newY: number;
    if ("touches" in event) {
        if (!end) {
            newX =
                event.touches[0].clientX -
                (event?.target as HTMLInputElement).offsetLeft;
            newY =
                event.touches[0].clientY -
                (event?.target as HTMLInputElement).offsetTop;
        } else {
            newX =
                event.changedTouches[0].clientX -
                (event?.target as HTMLInputElement).offsetLeft;
            newY =
                event.changedTouches[0].clientY -
                (event?.target as HTMLInputElement).offsetTop;
        }
    } else {
        newX = event.clientX - (event?.target as HTMLInputElement).offsetLeft;
        newY = event.clientY - (event?.target as HTMLInputElement).offsetTop;
    }
    return [newX, newY];
}
