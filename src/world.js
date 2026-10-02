import {CONFIG,clamp} from './config.js';
import {ResourceGrid} from './spatial.js';
export function seededRandom(seed){let state=seed>>>0;return()=>{state=(state+0x6D2B79F5)>>>0;let t=Math.imul(state^(state>>>15),1|state);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296;};}
const segmentDistance=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);};
export function nearWater(map,p,margin=0){for(const s of map.streams)for(let i=1;i<s.points.length;i++)if(segmentDistance(p,s.points[i-1],s.points[i])<s.width/2+margin)return true;return false;}
export function sampleLand(map,random,{margin=65,waterMargin=24,center=null,radius=0,avoidTrees=true}={}){for(let i=0;i<80;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*radius,p=center?{x:clamp(center.x+Math.cos(a)*r,margin,CONFIG.world-margin),y:clamp(center.y+Math.sin(a)*r,margin,CONFIG.world-margin)}:{x:margin+random()*(CONFIG.world-margin*2),y:margin+random()*(CONFIG.world-margin*2)};if(nearWater(map,p,waterMargin))continue;if(avoidTrees&&map.decorGrid?.query(p.x,p.y,35).some(t=>t.kind==='tree'&&Math.hypot(t.x-p.x,t.y-p.y)<26))continue;return p;}return {...map.spawn};}
export function generateWorld(seed){const random=seededRandom(seed),world=CONFIG.world,map={seed,spawn:{x:world/2,y:world/2},streams:[],bridges:[],clearings:[],forests:[],decorations:[],patches:[]};
 // Streams and bridges are disabled pending a future visual redesign.
 map.clearings.push({...map.spawn,radius:280});for(let i=0;i<32;i++){const p=sampleLand(map,random,{margin:300,waterMargin:205,avoidTrees:false});map.clearings.push({...p,radius:170+random()*80});}
 for(let i=0;i<110;i++)map.patches.push({x:random()*world,y:random()*world,rx:100+random()*300,ry:75+random()*220,color:i%3});
 for(let i=0;i<48;i++){const center=sampleLand(map,random,{margin:180,waterMargin:55,avoidTrees:false}),radius=170+random()*250;map.forests.push({...center,radius});const count=30+Math.floor(random()*35);for(let j=0;j<count;j++){const a=random()*6.28,r=Math.sqrt(random())*radius,p={x:clamp(center.x+Math.cos(a)*r,45,world-45),y:clamp(center.y+Math.sin(a)*r,65,world-45)};if(nearWater(map,p,26)||map.clearings.some(c=>Math.hypot(p.x-c.x,p.y-c.y)<c.radius))continue;map.decorations.push({...p,kind:'tree',size:49+random()*32,shade:random()});}}
 for(let i=0;i<190;i++){const p=sampleLand(map,random,{margin:70,waterMargin:10,avoidTrees:false});if(Math.hypot(p.x-map.spawn.x,p.y-map.spawn.y)<200)continue;map.decorations.push({...p,kind:'rock',size:29+random()*25,shade:random()});}
 map.decorations.sort((a,b)=>a.y-b.y);map.decorGrid=new ResourceGrid(256);map.decorGrid.rebuild(map.decorations);return map;
}
