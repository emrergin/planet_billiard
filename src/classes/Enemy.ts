import green1 from '../assets/green1.svg'
import blue1 from '../assets/blue1.svg'
import red1 from '../assets/red1.svg'
import { canvasHeight, canvasWidth } from '../config'

import {randomHeight,randomWidth} from '../utilities'
import Actor from './Actor';
import Player from './Player'


type EnemyColor = 'red' | 'blue' | 'green';

type Location = {x:number, y:number}

export default class Enemy extends Actor{

    // private x: number;
    // private y: number;
    private image: HTMLImageElement;
    private color: EnemyColor;
    private width: number;
    private height: number;
    private rotateSpeed:number;


    static assignImages (){
      const greenImage = document.createElement("img");
      greenImage.src = green1;
      
      const blueImage = document.createElement("img");
      blueImage.src = blue1; 

      const redImage = document.createElement("img");
      redImage.src = red1; 

      return new Map([['green',greenImage],['blue',blueImage],['red',redImage]])
    }

    static instanceList:Enemy[] = [];
  
    //maybe should be made more generic instead of 23.5
    constructor(
                target:Location ={x:canvasWidth/2,y:canvasHeight/2},
                x: number = randomWidth(23.5), 
                y: number = randomHeight(23.5), 
                speed: number=100,
                color: EnemyColor=['red','green','blue'][Math.floor(Math.random()*3)] as EnemyColor,
                hasFriction:boolean =false) {
      super(x,y,0,speed,target,hasFriction);
      // this.x = x;
      // this.y = y;
      this.color = color;
      this.image = Enemy.assignImages().get(color) as HTMLImageElement;
      this.width = this.image.naturalWidth||47;
      this.height = this.image.naturalHeight||47;
      this.radius = Math.max(this.width,this.height)/2;
      this.isColliding=false;
      this.rotateSpeed=Math.PI / 180;
      
      Enemy.instanceList.push(this);
  
      return this;
    }


    public draw(ctx:CanvasRenderingContext2D){  

        if (!this.image.complete){
            this.image.addEventListener('load', (e) => {
                ctx.drawImage(this.image,this.x-this.width/2,this.y-this.height/2); 
                this.width = this.image.naturalWidth;
                this.height = this.image.naturalHeight;
                this.radius = Math.max(this.width,this.height)/2;
            });
        }
        else{
           
            // Set the origin to the center of the circle, rotate the context, move the origin back
            ctx.translate(this.x,this.y);
            ctx.rotate(this.angle+Math.PI/2);
            ctx.translate(-this.x,-this.y);

            // Draw the image, rotated           
            ctx.drawImage(this.image,this.x-this.width/2,this.y-this.height/2); 
            // Reset transformation matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        }
        
    }  


    public replace(x: number = randomWidth(24), y: number = randomHeight(24)){
      this.x=x;
      this.y=y;
      this.angle = Math.random()*Math.PI*2;
    }

    public updateSpeedAndAngle(){
      if (!this.isColliding){
      this.target= {x:(Actor.player as Player).x,y:(Actor.player as Player).y}
      let currentSpeed = Math.hypot(this.hspeed,this.vspeed);
      let supposedAngle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
      // this.angle = supposedAngle;
      this.angle=updatedAngle(this.angle,supposedAngle,this.rotateSpeed);
      this.hspeed=currentSpeed*Math.cos(this.angle);
      this.vspeed=currentSpeed*Math.sin(this.angle);
      }
  }

  }



function updatedAngle(actorAngle:number,targetAngle:number,delta:number){
      if  (actorAngle - Math.PI > targetAngle ) {
        targetAngle += 2*Math.PI; 
      }
      if  (targetAngle - Math.PI > actorAngle ) {
        actorAngle += 2*Math.PI; 
      }
       
      if ( Math.abs(targetAngle - actorAngle) > delta ){      
        if (targetAngle > actorAngle){
          actorAngle += delta;
        }          
        else{
          actorAngle -= delta;
        }
      }    
      else{
        actorAngle = targetAngle;
      }  
      return actorAngle;
}