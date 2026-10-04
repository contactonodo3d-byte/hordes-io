export const CONFIG={world:6000,duration:420,participants:12,bots:11,resources:1200,maxVisibleSoldiers:96,contactPadding:16,attackInterval:.32,speedDuration:18,growthDuration:35,conquestsForGrowth:3,villageDuration:12,villageReward:40,villageRadius:180,villageScale:5,maxTraces:1800,foodDuration:12,foodDamage:1.15};
export const FACTIONS={vikings:{name:'Vikings',shield:'#e5ba62',helmet:'#b2c3ca',cloth:'#72533c',title:'High King',symbol:'ᛟ'},romans:{name:'Romans',shield:'#c74d47',helmet:'#cbb475',cloth:'#a83934',title:'Emperor',symbol:'SPQR'},samurai:{name:'Samurai',shield:'#bf6f99',helmet:'#343a4d',cloth:'#713647',title:'Shogun',symbol:'✿'},spartans:{name:'Spartans',shield:'#dc8654',helmet:'#d4ae60',cloth:'#9b3934',title:'King',symbol:'Λ'},mongols:{name:'Mongols',shield:'#79bdc6',helmet:'#939eac',cloth:'#35646b',title:'Great Khan',symbol:'◆'},undead:{name:'Undead',shield:'#a8cb83',helmet:'#747d84',cloth:'#424653',title:'Lich King',symbol:'☠'}};
export const UNIT_TYPES={warrior:{health:3,damage:1},leader:{health:8,damage:2}};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const speed=count=>Math.max(135,285/(1+Math.sqrt(count)*.045));
export const radius=count=>20+Math.sqrt(count)*11;
const formations=[];
export function formation(index){if(formations[index])return formations[index];if(!index)return{x:0,y:0};const a=index*2.39996,r=23*Math.sqrt(index);return formations[index]={x:Math.cos(a)*r,y:Math.sin(a)*r};}
export const visibleCount=count=>Math.min(count,CONFIG.maxVisibleSoldiers);
// Area scales with the true army count; only the rendered troop count is bounded.
export const armyRadius=count=>Math.max(radius(count),23*Math.sqrt(Math.max(0,count-1))+12);
export function displayedFormation(index,count){const f=formation(index);const scale=count>96?armyRadius(count)/armyRadius(96):1;return{x:f.x*scale,y:f.y*scale};}

// Reward tier is measured before capture: small <50, medium <200, large >=200.
export const villageReward=count=>CONFIG.villageReward*(count<50?5:count<200?3:.5);
