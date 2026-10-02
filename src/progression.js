export const DIFFICULTIES={easy:{label:'Easy',botStart:3,botSpeed:.65,botPickup:.7,botDamage:.5,playerDamage:1.4,protection:50,huntPlayer:false},medium:{label:'Medium',botStart:4,botSpeed:.82,botPickup:.45,botDamage:.75,playerDamage:1.15,protection:35,huntPlayer:true},hard:{label:'Hard',botStart:4,botSpeed:1,botPickup:.35,botDamage:1,playerDamage:1,protection:25,huntPlayer:true}};
export const difficultyForMatch=completed=>completed<1?'easy':completed<2?'medium':'hard';
export function readProgress(storage){try{return Math.max(0,Number.parseInt(storage.getItem('hordes.completedMatches.v1'),10)||0);}catch{return 0;}}
export function saveProgress(storage,completed){try{storage.setItem('hordes.completedMatches.v1',String(completed));}catch{/* Gameplay works when storage is unavailable. */}}
