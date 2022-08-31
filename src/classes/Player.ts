import { canvasHeight, canvasWidth } from '../config'
import Actor from './Actor';
import earth from '../assets/earth.svg'

type Location = {x:number, y:number}
export default class Player extends Actor{


    public type: string;
    private image: HTMLImageElement;


    constructor(target:Location,x=canvasWidth/2,y=canvasHeight/2){
        super(x,y,23.5,0,target,false);
        // this.target = target;
        // this.emoji =`🌍`;
        const earthImage = document.createElement("img");
        earthImage.src = earth;
        this.image=earthImage;
        this.type='player';
        this.angle = Math.atan2(target.y-this.y,target.x-this.x);
        Actor.player=this;

        // Actor.instanceList.push(this);
    }

    public updateSpeedAndAngle(){
        let distanceToTarget = Math.hypot(this.y-this.target.y,this.x-this.target.x);
        this.angle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
        let speed = Math.min(100,distanceToTarget);
        this.hspeed=speed*Math.cos(this.angle);
        this.vspeed=speed*Math.sin(this.angle);
    }

    public draw(ctx:CanvasRenderingContext2D) {


        if (!this.image.complete){
            this.image.addEventListener('load', (e) => {
                ctx.drawImage(this.image,this.x-this.radius,this.radius); 
            });
        }
        else{
            
            // Set the origin to the center of the circle, rotate the context, move the origin back
            ctx.translate(this.x,this.y);
            ctx.rotate(this.angle+Math.PI/2);
            ctx.translate(-this.x,-this.y);

            // Draw the image, rotated           
            ctx.drawImage(this.image,this.x-this.radius,this.y-this.radius); 
            // Reset transformation matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        }
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}