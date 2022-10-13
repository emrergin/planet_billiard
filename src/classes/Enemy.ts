import green1 from "../assets/green1.svg";
import blue1 from "../assets/blue1.svg";
import red1 from "../assets/red1.svg";
// import { canvasHeight, canvasWidth } from "../config";

import { randomHeight, randomWidth } from "../utilities";
import Actor from "./Actor";
import { Player } from "./Player";

import {
    MovingObject,
    drawGeneric,
    moveGeneric,
    Location,
} from "./methods";
// import Enemy from './EnemyOld'

type EnemyColor = "red" | "blue" | "green";

export interface Enemy extends MovingObject {
    rotateSpeed: number;
    color: EnemyColor;
    updateSpeedAndAngle: () => void;
    move: (secondsPassed: number) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

const greenImage = document.createElement("img");
greenImage.src = green1;

const blueImage = document.createElement("img");
blueImage.src = blue1;

const redImage = document.createElement("img");
redImage.src = red1;

const imageMap = new Map([
    ["green", greenImage],
    ["blue", blueImage],
    ["red", redImage],
]);

function updatedAngle(actorAngle: number, targetAngle: number, delta: number) {
    if (actorAngle - Math.PI > targetAngle) {
        targetAngle += 2 * Math.PI;
    }
    if (targetAngle - Math.PI > actorAngle) {
        actorAngle += 2 * Math.PI;
    }

    if (Math.abs(targetAngle - actorAngle) > delta) {
        if (targetAngle > actorAngle) {
            actorAngle += delta;
        } else {
            actorAngle -= delta;
        }
    } else {
        actorAngle = targetAngle;
    }
    return actorAngle;
}

function updateSpeedAndAngleEnemy(obj: Enemy) {
    if (!obj.isColliding) {
        obj.target = {
            x: (Actor.player as Player).x,
            y: (Actor.player as Player).y,
        };
        let currentSpeed = Math.hypot(obj.hspeed, obj.vspeed);
        let supposedAngle = Math.atan2(
            obj.target.y - obj.y,
            obj.target.x - obj.x
        );
        obj.angle = updatedAngle(obj.angle, supposedAngle, obj.rotateSpeed);
        obj.hspeed = currentSpeed * Math.cos(obj.angle);
        obj.vspeed = currentSpeed * Math.sin(obj.angle);
    }
}

export default function createEnemy(
    target: Location,
    x = randomWidth(23.5),
    y = randomHeight(23.5),
    speed = 100,
    color: EnemyColor = ["red", "green", "blue"][
        Math.floor(Math.random() * 3)
    ] as EnemyColor,
    friction: number = 0
) {
    const angle = Math.atan2(target.y - y, target.x - x);
    const enemyObject: Enemy = {
        target: {
            x: target.x,
            y: target.y,
        },
        angle,
        hspeed: Math.cos(angle) * speed,
        vspeed: Math.sin(angle) * speed,
        x,
        y,
        image: imageMap.get(color) as HTMLImageElement,
        radius: 0,
        restitution: 0.95,
        isColliding: false,
        friction,
        rotateSpeed: Math.PI / 180,
        color,
        updateSpeedAndAngle: () => updateSpeedAndAngleEnemy(enemyObject),
        move: (secondsPassed: number) =>
            moveGeneric(secondsPassed, enemyObject),
        draw: (ctx: CanvasRenderingContext2D) => drawGeneric(ctx, enemyObject),
    };
    Actor.instanceList.push(enemyObject);
    Actor.enemyList.push(enemyObject);
}


function replace(obj:Enemy,x: number = randomWidth(23.5), y: number = randomHeight(23.5)) {
    obj.x = x;
    obj.y = y;
    obj.angle = Math.random() * Math.PI * 2;
}