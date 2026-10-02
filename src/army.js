// A numeric reserve replaces one object per soldier. Only the leader and front
// warrior can be wounded: combat always consumes warriors before the leader.
export class Army {
 constructor(count=4){this.count=count;this.leader={type:'leader',hp:8};this.front={type:'warrior',hp:3};}
 get length(){return this.count;}
 get 0(){return this.count?this.leader:undefined;}
 at(index){return this.count?(index===0||this.count===1?this.leader:this.front):undefined;}
 slice(start,end){const army=new Army(Math.max(0,Math.min(this.count,end??this.count)-start));army.leader.hp=this.leader.hp;return army;}
 add(count){this.count+=count;}
 damage(amount){const before=this.count;if(this.count>1){const d=Math.min(amount,this.front.hp);this.front.hp-=d;amount-=d;if(this.front.hp<=0){this.count--;this.front.hp=3;}if(amount>0&&this.count>1){const killed=Math.min(this.count-1,Math.floor(amount/3));this.count-=killed;amount-=killed*3;if(this.count>1&&amount>0){this.front.hp=3-amount;amount=0;}}}if(this.count===1&&amount>0){this.leader.hp=Math.max(0,this.leader.hp-amount);if(this.leader.hp===0)this.count=0;}return{lost:before-this.count,leaderLost:before>0&&this.count===0};}
}
