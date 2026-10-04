// Run snapshots are bounded; records belong to the participant, not its army.
export function createRun(id, time, count){return {id,startedAt:time,endedAt:null,army:count,largestArmy:count,survival:0,kills:0};}
export function createRecords(){return {largestArmy:0,longestSurvival:0,bestKills:0,runsFinished:0};}
export function updateRun(player,time){const run=player.run;if(run.endedAt!==null)return;run.army=player.units.length;run.largestArmy=Math.max(run.largestArmy,run.army);run.survival=Math.max(0,time-run.startedAt);const records=player.records;records.largestArmy=Math.max(records.largestArmy,run.largestArmy);records.longestSurvival=Math.max(records.longestSurvival,run.survival);records.bestKills=Math.max(records.bestKills,run.kills);}
export function finishRun(player,time,killer){updateRun(player,time);player.run.endedAt=time;player.records.runsFinished++;player.lastRun={...player.run,killer:killer?{id:killer.id,name:killer.name}:null};return player.lastRun;}
