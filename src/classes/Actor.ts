import { canvasHeight, canvasWidth } from "../config";

import { circleIntersect } from "../utilities";
import { Player } from "./Player";
import { Enemy } from "./Enemy";

type ActorT = Enemy | Player;

export default class Actor {
    static instanceList: ActorT[] = [];
    // static instanceList: Map<string,ActorT>;
    static enemyList: Enemy[] = [];
    static player: Player | null = null;
    static points =0;

    public static detectCollisions() {
        let obj1;
        let obj2;

        // Reset collision state of all objects
        for (let i = 0; i < Actor.instanceList.length; i++) {
            Actor.instanceList[i].isColliding = false;
        }

        // Start checking for collisions
        for (let i = 0; i < Actor.instanceList.length; i++) {
            obj1 = Actor.instanceList[i];
            for (let j = i + 1; j < Actor.instanceList.length; j++) {
                obj2 = Actor.instanceList[j];

                // Compare object1 with object2
                if (
                    circleIntersect(
                        obj1.x,
                        obj1.y,
                        obj1.radius,
                        obj2.x,
                        obj2.y,
                        obj2.radius
                    )
                ) {
                    Actor.collisionResolve(obj1, obj2);
                    if (i>0){                        
                        Actor.removeItem(j);
                        Actor.removeItem(i);
                        console.log(j,i)
                    }
                    Actor.surfaceResistance(obj1, obj2);
                }
            }
        }

        const restitution = 0.9;
        detectEdgeCollisions();

        function detectEdgeCollisions() {
            let obj;
            for (let i = 0; i < Actor.instanceList.length; i++) {
                obj = Actor.instanceList[i];

                // Check for left and right
                if (obj.x < obj.radius) {
                    obj.hspeed = Math.abs(obj.hspeed) * restitution;
                    obj.x = obj.radius;
                    resetAngle(obj);
                } else if (obj.x > canvasWidth - obj.radius) {
                    obj.hspeed = -Math.abs(obj.hspeed) * restitution;
                    obj.x = canvasWidth - obj.radius;
                    resetAngle(obj);
                }

                // Check for bottom and top
                if (obj.y < obj.radius) {
                    obj.vspeed = Math.abs(obj.vspeed) * restitution;
                    obj.y = obj.radius;
                    resetAngle(obj);
                } else if (obj.y > canvasHeight - obj.radius) {
                    obj.vspeed = -Math.abs(obj.vspeed) * restitution;
                    obj.y = canvasHeight - obj.radius;
                    resetAngle(obj);
                }
            }
            function resetAngle(obj: ActorT) {
                obj.angle = Math.atan2(obj.vspeed, obj.hspeed);
            }
        }
    }

    static collisionResolve(obj1: ActorT, obj2: ActorT): void {
        // https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics

        obj1.isColliding = true;
        obj2.isColliding = true;
        let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
        let distance = Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y);
        let vCollisionNorm = {
            x: vCollision.x / distance,
            y: vCollision.y / distance,
        };

        let vRelativeVelocity = {
            x: obj1.hspeed - obj2.hspeed,
            y: obj1.vspeed - obj2.vspeed,
        };
        let collisionSpeed =
            vRelativeVelocity.x * vCollisionNorm.x +
            vRelativeVelocity.y * vCollisionNorm.y;
        collisionSpeed *= Math.min(obj1.restitution, obj2.restitution);

        if (collisionSpeed < 0) {
            return;
        }

        obj1.hspeed -= collisionSpeed * vCollisionNorm.x;
        obj1.vspeed -= collisionSpeed * vCollisionNorm.y;
        obj2.hspeed += collisionSpeed * vCollisionNorm.x;
        obj2.vspeed += collisionSpeed * vCollisionNorm.y;
    }

    public static removeItem(i:number){
        const lastItem = Actor.instanceList[Actor.instanceList.length-1];
        Actor.instanceList[i].destroy?.();
        Actor.instanceList[i]=lastItem;
        Actor.instanceList.pop();
    }

    static surfaceResistance(obj1: ActorT, obj2: ActorT): void {
        if (
            Math.max(
                Math.hypot(obj1.hspeed, obj1.vspeed),
                Math.hypot(obj2.hspeed, obj2.vspeed)
            ) > 10
        ) {
            return;
        }

        const angleBetweenNodes = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        const distanceBetweenNodes = Math.hypot(
            obj2.y - obj1.y,
            obj2.x - obj1.x
        );
        const supposedDistance = obj1.radius + obj2.radius;

        // console.log(`there is a collision with `+angleBetweenNodes+` degree.`);
        obj1.x -=
            Math.cos(angleBetweenNodes) *
            (supposedDistance - distanceBetweenNodes) *
            (obj1.radius / supposedDistance);
        obj1.y -=
            Math.sin(angleBetweenNodes) *
            (supposedDistance - distanceBetweenNodes) *
            (obj1.radius / supposedDistance);
        obj2.x +=
            Math.cos(angleBetweenNodes) *
            (supposedDistance - distanceBetweenNodes) *
            (obj2.radius / supposedDistance);
        obj2.y +=
            Math.sin(angleBetweenNodes) *
            (supposedDistance - distanceBetweenNodes) *
            (obj2.radius / supposedDistance);
    }
}
