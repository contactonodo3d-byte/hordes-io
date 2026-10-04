import {Army} from './army.js';
import {CONFIG,armyRadius,distance} from './config.js';
import {sampleLand} from './world.js';
import {createRun,createRecords,updateRun,finishRun} from './run-stats.js';
import {RewardedRecovery} from './rewarded-recovery.js';
export class PlayerLifecycle{
 constructor(session,options={}){this.session=session;this.delay=options.respawnDelay??1.5;this.recovery=new RewardedRecovery(options,session.random);this.nextId=0;}
 register(player){player.id=++this.nextId;player.startingArmy=player.units.length;player.records=createRecords();player.run=createRun(1,this.session.time,player.units.length);player.latestKiller=null;player.lastRun=null;player.respawnAt=null;player.pendingRecovery=null;player.protectedUntil=0;updateRun(player,this.session.time);return player;}
 die(player,killer,previousArmy){if(!player.run)this.register(player);if(player.run.endedAt!==null)return;const s=this.session;finishRun(player,s.time,killer);player.lastRun.armyBeforeDeath=previousArmy;player.latestKiller=killer?{id:killer.id,name:killer.name}:null;player.alive=false;player.units=new Army(0);player.respawnAt=s.time+this.delay;player.opponents=[];player.target=null;player.siege=null;player.moving=false;player.mount=null;player.speedUntil=player.growthUntil=player.fedUntil=player.attackUntil=0;player.desperate=false;
 for(const r of s.resources){if(r.owner===player)r.owner=null;if(r.assailant===player){r.assailant=null;r.progress=0;}}
 for(const h of s.hordes){if(h.target===player)h.target=null;h.opponents=h.opponents.filter(name=>name!==player.name);}
 this.recovery.offer(player,s.time);s.sound('death',player);}
 safestSpawn(player){const s=this.session;let best=null,bestClearance=-Infinity;const count=Math.max(player.startingArmy,player.pendingRecovery??0);for(let i=0;i<64;i++){const spot=sampleLand(s.map,s.random,{margin:150});let clearance=Infinity;for(const other of s.hordes)if(other!==player&&other.alive)clearance=Math.min(clearance,distance(spot,other)-armyRadius(other.units.length)-armyRadius(count));if(clearance>bestClearance){best=spot;bestClearance=clearance;}if(clearance>500)break;}return best;}
 respawn(player){if(player.alive||player.respawnAt===null)return false;const s=this.session,spot=this.safestSpawn(player),count=Math.max(player.startingArmy,player.pendingRecovery??0);const fresh=s.makeHorde(player.name,spot.x,spot.y,count,player.color,player.faction);Object.assign(player,fresh);player.run=createRun(player.run.id+1,s.time,count);player.respawnAt=null;player.pendingRecovery=null;player.protectedUntil=s.time+Math.max(3,player===s.player?s.rules.protection:3);this.recovery.clear(player);updateRun(player,s.time);return true;}
 update(){const s=this.session;for(const player of s.hordes){if(!player.run)this.register(player);if(player.alive)updateRun(player,s.time);else if(player.respawnAt!==null&&s.time>=player.respawnAt)this.respawn(player);}}
 debugComplete(player){const offer=this.recovery.offers.get(player.id);return !!offer&&this.recovery.complete(player,offer.token,true);}
}
