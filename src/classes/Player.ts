import earth from "../assets/earth.svg";
import Actor from "./Actor";
import {
    MovingObject,
    updateSpeedAndAngleGeneric,
    drawGeneric,
    moveGeneric,
    Location,
} from "./methods";
import { canvasHeight, canvasWidth } from "../config";

export interface Player extends MovingObject {
    updateSpeedAndAngle: () => void;
    move: (secondsPassed: number) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function createPlayer(
    target: Location,
    x = canvasWidth / 2,
    y = canvasHeight / 2
) {
    const earthImage = document.createElement("img");
    earthImage.src = earth;

    const playerObject: Player = {
        target: {
            x: target.x,
            y: target.y,
        },
        angle: Math.atan2(target.y - y, target.x - x),
        hspeed: 0,
        vspeed: 0,
        x,
        y,
        image: earthImage,
        radius: 0,
        restitution: 0.95,
        isColliding: false,
        hasFriction: true,
        updateSpeedAndAngle: () => updateSpeedAndAngleGeneric(playerObject),
        move: (secondsPassed: number) =>
            moveGeneric(secondsPassed, playerObject),
        draw: (ctx: CanvasRenderingContext2D) => drawGeneric(ctx, playerObject,true),
    };
    Actor.player = playerObject;
    Actor.instanceList.push(playerObject);
}
