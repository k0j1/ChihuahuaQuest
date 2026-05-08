import { TREASURE_REGISTRY as OLD_REGISTRY } from './services/geminiService';

const initial = OLD_REGISTRY.map((t, idx) => {
    let v = t.value;
    if (t.name.includes("伝説") && v < 15000) v = 15000;
    return { ...t, value: v };
});

// Since "伝説" items are guaranteed to be >= 15000, if we sort by value, they will be near the top.
initial.sort((a,b) => {
    // If one is 伝説 and the other isn't, 伝説 goes higher to guarantee it's in the top 50
    const aDen = a.name.includes("伝説");
    const bDen = b.name.includes("伝説");
    if (aDen && !bDen) return 1;
    if (!aDen && bDen) return -1;
    return a.value - b.value;
});

initial.forEach((item, index) => {
    let newValue = item.value;
    
    if (index < 50) {
        newValue = Math.max(1, Math.min(99, item.value));
        if (newValue >= 100) newValue = 99; // cap
    } else if (index < 200) {
        newValue = Math.max(100, Math.min(999, item.value));
    } else if (index < 350) {
        newValue = Math.max(1000, Math.min(4999, item.value));
    } else if (index < 449) {
        newValue = Math.max(5000, Math.min(14999, item.value));
    } else {
        newValue = Math.max(15000, Math.min(100000, item.value));
    }
    
    // Safety
    if (item.name.includes("伝説") && newValue < 15000) {
        newValue = 15000;
    }
    
    item.value = newValue;
});

let c=0,uc=0,r=0,e=0,l=0;
for(const t of initial){
    if(t.value>=15000)l++;
    else if(t.value>=5000)e++;
    else if(t.value>=1000)r++;
    else if(t.value>=100)uc++;
    else c++;
}
console.log('Common: '+c+', Uncommon: '+uc+', Rare: '+r+', Epic: '+e+', Legendary: '+l);
