import { canvasHeight, canvasWidth } from '../config'
import Actor from './Actor';

type Location = {x:number, y:number}
export default class Player extends Actor{

    // private code:string;
    // private x: number;
    // private y:number;
    // private radius:number;
    private emoji:string;
    // public target: Location;
    public type: string;
    // private hspeed: number;
    // private vspeed: number;
    // private angle: number;


    constructor(target:Location,x=canvasWidth/2,y=canvasHeight/2){
        super(x,y,23.5,0,target,false);
        // this.target = target;
        this.emoji =`🌍`;
        // this.x=x;
        // this.y=y;
        // this.radius=47;
        // this.hspeed=0;
        // this.vspeed=0;
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
        // https://stackoverflow.com/questions/56312457/how-to-load-and-draw-emojis-on-canvas-efficiently
        // const fontSize = this.size * (1.5)
        // const offset = Math.floor((fontSize) / 2)
      
        ctx.font = `${this.radius*2}px Arial`
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
      
        // let drawX = this.x+this.size/2;
        let drawY = this.y+this.radius/4;
      
        ctx.fillText(this.emoji, this.x, drawY)
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // console.log(this.x, this.y, this.radius/2, 0, 2 * Math.PI)
        ctx.stroke();
    }

    // public move(secondsPassed:number){
      
    //     // if (Math.hypot(this.vspeed,this.hspeed)<0.1){ 
    //     //   return;
    //     // }
  
    //     // if (!this.isColliding){
    //     //   this.recalibrateDirection();
    //     // }
  
    //     // if(this.hasFriction){
    //     //   this.hspeed=0.999*this.hspeed;
    //     //   this.vspeed=0.999*this.vspeed;
    //     // }
  
  
  
    //     this.x+=this.hspeed*secondsPassed;
    //     this.y+=this.vspeed*secondsPassed;
         
    //   }
}