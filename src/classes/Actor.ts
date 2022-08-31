import { canvasHeight, canvasWidth } from '../config'

import {randomHeight,randomWidth,circleIntersect} from '../utilities'
import Player from './Player'

type Location = {x:number, y:number}

export default class Actor {

    public x: number;
    public y: number;
    public hspeed: number;
    public vspeed: number;
    public angle: number;
    private restitution:number;
    public radius:number;
    public target: Location;
    public isColliding:boolean;
    private hasFriction:boolean;
    public type:string;



    static instanceList:Actor[] = [];
    static player:Player|null;
  
    //maybe should be made more generic instead of 23.5
    constructor(x: number = randomWidth(23.5), 
                y: number = randomHeight(23.5), 
                radius:number = 23.5,
                speed: number=100,
                target:Location ={x:canvasWidth/2,y:canvasHeight/2},
                hasFriction:boolean =true) {
      this.x = x;
      this.y = y;
      this.target=target;
      this.angle = Math.atan2(target.y-this.y,target.x-this.x);
      this.hspeed=Math.cos(this.angle)*speed;
      this.vspeed=Math.sin(this.angle)*speed;
      this.restitution=0.95;
      this.isColliding=false;
      this.hasFriction=hasFriction;
      this.radius=radius;
      this.type='actor';
      
      Actor.instanceList.push(this);
  
      return this;
    }

    public static detectCollisions(){
      let obj1;
      let obj2;
  
      // Reset collision state of all objects
      for (let i = 0; i < Actor.instanceList.length; i++) {
        Actor.instanceList[i].isColliding = false;
      }
  
      // Start checking for collisions
      for (let i = 0; i < Actor.instanceList.length; i++)
      {
          obj1 = Actor.instanceList[i];
          for (let j = i + 1; j < Actor.instanceList.length; j++)
          {
              obj2 = Actor.instanceList[j];
  
              // Compare object1 with object2
              if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x,obj2.y,obj2.radius)){
                    Actor.collisionResolve(obj1,obj2);
                    Actor.surfaceResistance(obj1,obj2);
              }
          }
      }

      const restitution = 0.90;
      detectEdgeCollisions();

      function detectEdgeCollisions()
      {
          let obj;
          for (let i = 0; i < Actor.instanceList.length; i++)
          {
              obj = Actor.instanceList[i];
     
              // Check for left and right
              if (obj.x < obj.radius){
                  obj.hspeed = Math.abs(obj.hspeed) * restitution;
                  obj.x = obj.radius;
              }else if (obj.x > canvasWidth - obj.radius){
                  obj.hspeed = -Math.abs(obj.hspeed) * restitution;
                  obj.x = canvasWidth - obj.radius;
              }
     
              // Check for bottom and top
              if (obj.y < obj.radius){
                  obj.vspeed = Math.abs(obj.vspeed) * restitution;
                  obj.y = obj.radius;
              } else if (obj.y > canvasHeight - obj.radius){
                  obj.vspeed = -Math.abs(obj.vspeed) * restitution;
                  obj.y = canvasHeight - obj.radius;
              }
          }
     }      
    }

    

    public move(secondsPassed:number){
      
      if (Math.hypot(this.vspeed,this.hspeed)<0.1){ 
        return;
      }

      if(this.hasFriction){
        this.hspeed=0.999*this.hspeed;
        this.vspeed=0.999*this.vspeed;
      }



      this.x+=this.hspeed*secondsPassed;
      this.y+=this.vspeed*secondsPassed;
       
    }

    public replace(x: number = randomWidth(24), y: number = randomHeight(24)){
      this.x=x;
      this.y=y;
      this.angle = Math.random()*Math.PI*2;
    }

    public updateSpeedAndAngle(){
        console.log('This actor does not have a retarget method');
    }

    public draw(ctx:CanvasRenderingContext2D){
        console.log('This actor does not have a draw method');
    }

    static collisionResolve(obj1:Actor,obj2:Actor):void{
      // https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
 
      obj1.isColliding=true;
      obj2.isColliding=true;
      let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
      let distance = Math.hypot(obj2.x-obj1.x,obj2.y-obj1.y);
      let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};

      let vRelativeVelocity = {x: obj1.hspeed - obj2.hspeed , y: obj1.vspeed  - obj2.vspeed };
      let collisionSpeed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
      collisionSpeed *= Math.min(obj1.restitution, obj2.restitution);

      if (collisionSpeed<0){
        return; 
      }

      obj1.hspeed -= (collisionSpeed * vCollisionNorm.x);
      obj1.vspeed -= (collisionSpeed * vCollisionNorm.y);
      obj2.hspeed += (collisionSpeed * vCollisionNorm.x);
      obj2.vspeed += (collisionSpeed * vCollisionNorm.y);
    }

    static surfaceResistance(obj1:Actor,obj2:Actor):void{
        if (Math.max(Math.hypot(obj1.hspeed,obj1.vspeed),Math.hypot(obj2.hspeed,obj2.vspeed))>10){return}
        
        const angleBetweenNodes = Math.atan2(obj2.y-obj1.y,obj2.x-obj1.x);
        const distanceBetweenNodes = Math.hypot(obj2.y-obj1.y,obj2.x-obj1.x);
        const supposedDistance=obj1.radius+obj2.radius;
        
          // console.log(`there is a collision with `+angleBetweenNodes+` degree.`);
          obj1.x -= Math.cos(angleBetweenNodes)*(supposedDistance-distanceBetweenNodes)*(obj1.radius/supposedDistance);
          obj1.y -= Math.sin(angleBetweenNodes)*(supposedDistance-distanceBetweenNodes)*(obj1.radius/supposedDistance); 
          obj2.x += Math.cos(angleBetweenNodes)*(supposedDistance-distanceBetweenNodes)*(obj2.radius/supposedDistance);
          obj2.y += Math.sin(angleBetweenNodes)*(supposedDistance-distanceBetweenNodes)*(obj2.radius/supposedDistance);
    }
  }



