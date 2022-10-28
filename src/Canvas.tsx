import { useRef, useEffect, useState, MouseEvent, TouchEvent } from "react";
import createEnemy from "./classes/Enemy";
import Actor from "./classes/Actor";
import createPlayer, { Player } from "./classes/Player";
import { Location } from "./classes/methods";
import { canvasHeight, canvasWidth } from "./config";

const Canvas = () => {
    // const [coords, setCoords] = useState({ x: 0, y: 0 });

    let coords = { x: 0, y: 0 };
    const [points, setPoints] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    //   const fpsRef = useRef<number>(0);
    const requestRef = useRef<undefined | number>();
    const oldTimeStampRef = useRef<Date | undefined>();
    const clickStart = useRef<boolean>(false);
    const mouseLocation = useRef<Location>({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
    });
    // let mouseLocation: Location = ;
    // console.log(`refresh`,clickStart.current);

    function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
        // mouseLocation.x = (Actor.player as Player).x;
        // mouseLocation.y = (Actor.player as Player).y;

        let newX =
            event.clientX - (event?.target as HTMLInputElement).offsetLeft;
        let newY =
            event.clientY - (event?.target as HTMLInputElement).offsetTop;
        if (
            Math.hypot(
                newX - (Actor.player as Player).x,
                newY - (Actor.player as Player).y
            ) <= (Actor.player as Player).radius
        ) {
            clickStart.current = true;
            (Actor.player as Player).hspeed = 0;
            (Actor.player as Player).vspeed = 0;
        }
    }
    function handleMouseUp(event: MouseEvent<HTMLCanvasElement>) {
        let newX =
            event.clientX - (event?.target as HTMLInputElement).offsetLeft;
        let newY =
            event.clientY - (event?.target as HTMLInputElement).offsetTop;

        if (!clickStart.current) {
            if (
                Math.hypot(
                    newX - (Actor.player as Player).x,
                    newY - (Actor.player as Player).y
                ) > (Actor.player as Player).radius
            ) {
                // setCoords({
                //     x: newX,
                //     y: newY,
                // });
                coords = {
                    x: newX,
                    y: newY,
                };
                (Actor.player as Player).target = { x: newX, y: newY };
                (Actor.player as Player).updateSpeedAndAngle();
            }
        } else {
            clickStart.current = false;
            let speed = Math.hypot(
                mouseLocation.current.x - (Actor.player as Player).x,
                mouseLocation.current.y - (Actor.player as Player).y
            );
            let angle = Math.atan2(
                (Actor.player as Player).y - mouseLocation.current.y,
                (Actor.player as Player).x - mouseLocation.current.x
            );
            (Actor.player as Player).hspeed = speed * Math.cos(angle);
            (Actor.player as Player).vspeed = speed * Math.sin(angle);
            (Actor.player as Player).angle = angle;

            mouseLocation.current.x = (Actor.player as Player).x;
            mouseLocation.current.y = (Actor.player as Player).y;
        }
    }

    function handleMouseOut(event: MouseEvent<HTMLCanvasElement>) {
        clickStart.current = false;
        mouseLocation.current.x = (Actor.player as Player).x;
        mouseLocation.current.y = (Actor.player as Player).y;
    }

    function handleMouseMove(
        event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
    ) {
        // if (clickStart.current) {
        // |TouchEvent<HTMLCanvasElement>
        let newX: number, newY: number;
        if ("touches" in event) {
            newX =
                event.touches[0].clientX -
                (event?.target as HTMLInputElement).offsetLeft;
            newY =
                event.touches[0].clientY -
                (event?.target as HTMLInputElement).offsetTop;
        } else {
            newX =
                event.clientX - (event?.target as HTMLInputElement).offsetLeft;
            newY =
                event.clientY - (event?.target as HTMLInputElement).offsetTop;
        }
        mouseLocation.current.x = newX;
        mouseLocation.current.y = newY;
        // }
    }

    function drawHitline(ctx: CanvasRenderingContext2D) {
        if (clickStart.current) {
            let width = Math.max(
                Math.hypot(
                    mouseLocation.current.x - (Actor.player as Player).x,
                    mouseLocation.current.y - (Actor.player as Player).y
                ) / 50,
                2
            );

            // ctx.strokeStyle = "#000000";
            ctx.strokeStyle = `rgb(${200 * (width / 7)}, 0, 0)`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo((Actor.player as Player).x, (Actor.player as Player).y);
            ctx.lineTo(mouseLocation.current.x, mouseLocation.current.y);
            ctx.stroke();
        }
    }

    function drawEverything(ctx: CanvasRenderingContext2D) {
        Actor.instanceList.forEach((a) => a.draw(ctx));
    }

    function moveEverything(secondsPassed: number) {
        Actor.enemyList.forEach((a) => a.updateSpeedAndAngle());
        Actor.instanceList.forEach((a) => a.move(secondsPassed));
        Actor.detectCollisions();
    }

    let secondsPassed: number = 0;
    function gameLoop(ctx: CanvasRenderingContext2D) {
        let timeStamp = new Date();
        if (oldTimeStampRef.current != undefined) {
            secondsPassed =
                (Number(timeStamp) - Number(oldTimeStampRef.current)) / 1000;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            moveEverything(secondsPassed);
            drawHitline(ctx);
            drawEverything(ctx);
            //   fpsRef.current = Math.round(1 / secondsPassed);
        }

        oldTimeStampRef.current = timeStamp;
        requestRef.current = window.requestAnimationFrame(() => gameLoop(ctx));

        setPoints(Actor.points);
    }

    useEffect(() => {
        if (!Actor.player) {
            createPlayer({ x: canvasWidth / 2, y: canvasHeight / 2 });
        }
        // createEnemy({
        //     x: (Actor.player as Player).x,
        //     y: (Actor.player as Player).y,
        // });
        // createEnemy({
        //     x: (Actor.player as Player).x,
        //     y: (Actor.player as Player).y,
        // });
        // createEnemy({x:(Actor.player as Player).x,y:(Actor.player as Player).y});

        if (canvasRef.current !== null) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasHeight;
        } else {
            throw new Error("No canvas is found.");
        }
        if (canvasCtxRef.current !== null) {
            drawEverything(canvasCtxRef.current as CanvasRenderingContext2D);
        } else {
            throw new Error("No canvas context is found.");
        }
        requestRef.current = window.requestAnimationFrame(() =>
            gameLoop(canvasCtxRef.current as CanvasRenderingContext2D)
        );
        return () => cancelAnimationFrame(requestRef.current as number);
    }, []);

    return (
        <>
            <p>
                {/* x:{coords.x} y:{coords.y} */}
                points: {points}
            </p>
            <canvas
                tabIndex={0}
                ref={canvasRef}
                // onKeyDown={()=>replaceEverything(canvasCtxRef.current as CanvasRenderingContext2D)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseOut}
            />
        </>
    );
};

export default Canvas;
