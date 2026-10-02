// Rebuilt five times per second. New spawns insert immediately; pickups mark entries removed.
export class ResourceGrid{
 constructor(size=240){this.size=size;this.cells=new Map();}
 add(r){r.removed=false;const key=Math.floor(r.x/this.size)+','+Math.floor(r.y/this.size);let cell=this.cells.get(key);if(!cell)this.cells.set(key,cell=[]);cell.push(r);}
 rebuild(resources){this.cells.clear();for(const r of resources)this.add(r);}
 query(x,y,radius){const found=[],minX=Math.floor((x-radius)/this.size),maxX=Math.floor((x+radius)/this.size),minY=Math.floor((y-radius)/this.size),maxY=Math.floor((y+radius)/this.size);const collect=cell=>{if(cell)for(const r of cell)if(!r.removed)found.push(r);};if((maxX-minX+1)*(maxY-minY+1)>this.cells.size*2){for(const [key,cell] of this.cells){const [cx,cy]=key.split(',').map(Number);if(cx>=minX&&cx<=maxX&&cy>=minY&&cy<=maxY)collect(cell);}}else{for(let cx=minX;cx<=maxX;cx++)for(let cy=minY;cy<=maxY;cy++)collect(this.cells.get(cx+','+cy));}return found;}
}
