export interface MovingObject {
    target: Location;
    angle: number;
    hspeed: number;
    vspeed: number;
    x: number;
    y: number;
    hasFriction: boolean;
    image: HTMLImageElement;
    radius: number;
    restitution: number;
    isColliding: boolean;
}

export type Location = { x: number; y: number };

export function updateSpeedAndAngleGeneric(obj: MovingObject) {
    let distanceToTarget = Math.hypot(
        obj.y - obj.target.y,
        obj.x - obj.target.x
    );
    obj.angle = Math.atan2(obj.target.y - obj.y, obj.target.x - obj.x);
    let speed = Math.min(100, distanceToTarget);
    obj.hspeed = speed * Math.cos(obj.angle);
    obj.vspeed = speed * Math.sin(obj.angle);
}

export function moveGeneric(secondsPassed: number, obj: MovingObject) {
    if (Math.hypot(obj.vspeed, obj.hspeed) < 0.1) {
        return;
    }

    if (obj.hasFriction) {
        obj.hspeed = 0.999 * obj.hspeed;
        obj.vspeed = 0.999 * obj.vspeed;
    }

    obj.x += obj.hspeed * secondsPassed;
    obj.y += obj.vspeed * secondsPassed;
}

export function drawGeneric(ctx: CanvasRenderingContext2D, obj: MovingObject, withOutline:boolean =false) {
    if (!obj.image.complete) {
        obj.image.addEventListener("load", () => {
            ctx.drawImage(obj.image, obj.x - obj.radius, obj.radius);
            obj.radius = obj.image.naturalWidth / 2;
        });
    } else {
        // Set the origin to the center of the circle, rotate the context, move the origin back
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.angle + Math.PI / 2);
        ctx.translate(-obj.x, -obj.y);

        // Draw the image, rotated
        ctx.drawImage(obj.image, obj.x - obj.radius, obj.y - obj.radius);
        // Reset transformation matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // console.log(obj.x, obj.y, obj.radius)

    if(withOutline){
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
