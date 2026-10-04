// A provider should request a one-use offer, then resolve it after ad completion.
// Default is disabled. No advertising/network code is present here.
export const RECOVERY_DEFAULTS={rewardedRecoveryEnabled:false,rewardedRecoveryChance:.15,rewardedRecoveryPercentage:.5,rewardedRecoveryCooldown:120};
export class RewardedRecovery{
 constructor(config={},random=Math.random){this.config={...RECOVERY_DEFAULTS,...config};this.random=random;this.offers=new Map();this.lastOffer=new Map();this.sequence=0;}
 offer(player,time){this.offers.delete(player.id);const c=this.config;if(!c.rewardedRecoveryEnabled||time-(this.lastOffer.get(player.id)??-Infinity)<Math.max(0,c.rewardedRecoveryCooldown)||this.random()>=Math.max(0,Math.min(1,c.rewardedRecoveryChance)))return null;const offer={token:++this.sequence,playerId:player.id,runId:player.run.id,army:Math.floor(player.lastRun.largestArmy*Math.max(0,Math.min(1,c.rewardedRecoveryPercentage)))};this.offers.set(player.id,offer);this.lastOffer.set(player.id,time);return offer;}
 complete(player,token,success){const offer=this.offers.get(player.id);if(!offer||offer.token!==token||offer.runId!==player.run.id||player.alive)return false;this.offers.delete(player.id);if(!success)return false;player.pendingRecovery=offer.army;return true;}
 clear(player){this.offers.delete(player.id);}
}
