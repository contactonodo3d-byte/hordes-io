import {pilotCharacter} from './pilot-assets.js';
import {FACTIONS} from './config.js';
export function facingForVector(x,y,previous=1){return Math.abs(x)>Math.max(2,Math.hypot(x,y)*.08)?(x<0?-1:1):previous;}
// Separate cached left/right frames: only a weapon swings, never the character.
export function createCharacterSprite(faction,leader,mounted,frame,facing=1){
 if(faction==='vikings'){const pilot=pilotCharacter(leader,mounted,frame,facing);if(pilot)return pilot;}
 const canvas=document.createElement('canvas');canvas.width=leader?220:96;canvas.height=leader?272:120;const c=canvas.getContext('2d'),f=FACTIONS[faction];c.scale(leader?2:1.5,leader?2:1.5);c.translate(leader?55:32,leader?68:40);c.scale(facing,1);c.scale(leader?1.65:1,leader?1.65:1);
 const worried=frame>=12&&frame<16,fallen=frame>=16;const moving=worried||frame>0&&frame<4,attacking=frame>=4&&frame<8,phase=moving?(worried?frame-12:frame)*Math.PI*2/3:attacking?(frame-4)*Math.PI/2:(frame-8)*Math.PI/2,gait=moving?Math.sin(phase)*3:0;
 const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};const line=(x,y,xx,yy,color,w=2)=>{c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
 ellipse(0,18,mounted?26:13,5,'#0b201c66');if(fallen){const collapse=Math.min(1,(frame-16)/3);c.translate(0,collapse*17);c.scale(1,1-collapse*.65);}
 if(mounted){const coat=faction==='undead'?'#839288':faction==='romans'?'#d5c5a8':'#956a47';for(const [x,sign] of [[-17,1],[-10,-1],[11,-1],[18,1]])line(x,5,x+gait*sign,20-gait*sign,coat,4);ellipse(0,3,24,11,coat);c.fillStyle=coat;c.beginPath();c.moveTo(12,-2);c.lineTo(19,-24);c.lineTo(28,-23);c.lineTo(29,-9);c.lineTo(22,1);c.fill();ellipse(26,-22,9,5,coat);line(21,-26,20,-32,'#453328');line(27,-26,26,-32,'#453328');line(-22,1,-31,10+gait,'#453328',4);line(18,-20,12,-3,'#453328',4);ellipse(28,-23,1,1,'#192b27');line(23,-18,7,-5,'#e0c895',1);c.fillStyle=f.cloth;c.fillRect(-10,-8,19,14);line(-10,5,9,5,'#d8b568');c.translate(-2,-11);}
 c.fillStyle=f.cloth;c.beginPath();c.moveTo(-7,-9);c.lineTo(-17-gait*.5,12);c.lineTo(-1,15);c.lineTo(4,-4);c.fill();if(leader)line(-16-gait*.5,11,-2,14,'#d9b775',1.5);
 line(-3,6,-5+gait,16,'#3b3431',4);line(3,6,6-gait,16,'#3b3431',4);ellipse(0,-2,7,11,f.helmet);c.strokeStyle='#253238';c.lineWidth=1;c.stroke();line(-6,3,6,3,leader?'#e1c071':f.shield,3);ellipse(-6,-8,5,4,faction==='vikings'?'#b4a68a':f.helmet);
 const skin=faction==='undead'?'#dedcc7':'#d9ad87';ellipse(2,-17,6,7,skin);c.fillStyle=skin;c.fillRect(6,-19,4,4);ellipse(6,-19,1,1,'#222d2d');ellipse(1,-23,7,4,f.helmet);
 if(faction==='vikings'){ellipse(4,-11,5,5,'#8d603e');line(-3,-25,-7,-31,'#e5d8b1');line(5,-25,8,-31,'#e5d8b1');}
 if(faction==='romans'||faction==='spartans'){line(0,-26,0,-34,f.cloth,4);line(-4,-18,-4,-12,f.helmet,3);if(leader){line(-4,-24,5,-24,'#e4c476',2);}}
 if(faction==='samurai'){line(-6,-23,9,-23,'#30394a',3);line(-5,-26,-7,-32,'#e2bd65');line(-7,-32,1,-27,'#e2bd65');for(let y=-3;y<7;y+=3)line(-5,y,5,y,'#96556b');c.fillStyle='#794155';c.fillRect(0,-15,7,3);}
 if(faction==='mongols'){c.fillStyle='#6e4c37';c.beginPath();c.moveTo(-6,-22);c.lineTo(0,-33);c.lineTo(7,-22);c.fill();line(-6,-22,7,-22,'#d1c3a8',3);line(4,-12,9,-10,'#493229');}
 if(faction==='undead'){ellipse(6,-19,1.5,1.5,'#75ead2');for(let y=-4;y<6;y+=3)line(-5,y,4,y,'#d1ceb7',1.5);line(4,-12,8,-12,'#3c4648');}
 if(leader&&!['samurai','mongols'].includes(faction)){c.fillStyle='#e4c06a';c.beginPath();c.moveTo(-5,-25);c.lineTo(-7,-32);c.lineTo(-1,-28);c.lineTo(3,-35);c.lineTo(5,-28);c.lineTo(10,-31);c.lineTo(8,-25);c.fill();ellipse(3,-28,1,1,'#b64b50');}
 if(worried){line(3,-23,8,-24,'#47352e',1.5);ellipse(8,-13,2,3,'#50352d');ellipse(11,-25+(frame%2)*3,1.5,3,'#a9e4ef');line(-9,-32,-11,-38,'#eec569',1);line(-14,-28,-19,-30,'#eec569',1);}
 // Shield stays upright while the arm/weapon cycles through attack poses.
 if(!['mongols','undead'].includes(faction)){ellipse(-7,0,6,8,f.shield);c.strokeStyle='#dfc58b';c.lineWidth=leader?1.5:1;c.stroke();c.fillStyle='#efdcaa';c.font='bold 8px system-ui';c.textAlign='center';c.fillText(faction==='spartans'?'Λ':faction==='samurai'?'✿':faction==='romans'?'I':'ᛟ',-7,3);}
 c.save();c.translate(8,-4);if(attacking)c.rotate(-.5+Math.sin(phase)*.9);
 if(faction==='mongols'){c.strokeStyle='#d8b777';c.lineWidth=2;c.beginPath();c.arc(2,0,10,-1.4,1.4);c.stroke();line(4,-10,4,10,'#d8b777',1);}else if(faction==='undead'){line(3,15,3,-18,'#9983b8',2);ellipse(3,-19,4,4,'#79d9c7');}else if(faction==='vikings'){line(3,12,3,-15,'#8a6440');c.fillStyle='#d1dce0';c.beginPath();c.moveTo(3,-14);c.lineTo(11,-18);c.lineTo(11,-9);c.lineTo(3,-11);c.fill();}else{line(3,10,3,-1,'#74533a');line(-1,-1,7,-1,'#e3c36d');c.fillStyle='#d8e5e5';c.beginPath();c.moveTo(1,-2);c.lineTo(3,-22);c.lineTo(5,-2);c.fill();}c.restore();return canvas;
}
