export type ChecklistItem={id:string;text:string;done:boolean};
export function checklistProgress(items:ChecklistItem[]){const completed=items.filter(x=>x.done).length;return {completed,total:items.length,percent:items.length?Math.round(completed/items.length*100):0};}
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// Extract execution lines only. The original notes are never removed or changed.
export function checklistFromNotes(notes:string){const items:string[]=[];const add=(text:string)=>{text=text.trim().replace(/[.;]+$/,'');if(text&&!items.includes(text))items.push(text);};
 const chunks=String(notes||'').replace(/\r/g,'').split(/\n|\s*;\s*|\s+\|\s+/);
 let padletGroup=false;
 for(let raw of chunks){raw=raw.trim().replace(/^[\s☐☑✓✔•*\-–\d.)]+/,'').trim();if(!raw)continue;
 const n=normalize(raw);
 if(/^(observac|nota|prazo|avaliac|objetivo|importante)/.test(n)){padletGroup=false;continue;}
 const labels=raw.split(/,?\s+(?:e\s+)?(?=(?:videoaula|leitura|padlet)\s*[:—–-])/i);
 for(const part of labels){const p=normalize(part);if(/\bpadlets?\b/.test(p)){padletGroup=true;const quotes=[...part.matchAll(/[“"]([^”"]+)[”"]/g)].map(x=>x[1]);if(quotes.length){quotes.forEach(x=>add('Padlet — '+x));continue;}if(/^padlets?\s*:?\s*$/i.test(part))continue;add(part.replace(/^padlets?\s*[:—–-]?\s*/i,'Padlet — '));}
 else if(/\bvideoaulas?\b/.test(p)){padletGroup=false;add(/^(assistir|assistir a|assistir à)/i.test(part)?part:'Assistir à '+part.charAt(0).toLowerCase()+part.slice(1));}
 else if(/^(?:fazer (?:a )?)?leituras?\b/.test(p)){padletGroup=false;add(/^fazer/i.test(part)?part:'Fazer a '+part.charAt(0).toLowerCase()+part.slice(1));}
 else if(padletGroup&&/\?$/.test(part)){add('Padlet — '+part.replace(/^[“"]|[”"]$/g,''));}
 }
 }
 return items.map(text=>({id:crypto.randomUUID(),text,done:false}));
}
export function notesChecklistCandidates(records:any[]){const subjects=new Set(records.filter(r=>r.kind==='subject'&&normalize(r.data.name||'').trim()==='producao textual').map(r=>r.id));return records.filter(r=>r.kind==='module'&&subjects.has(r.data.subject)&&!records.some(c=>c.kind==='moduleChecklist'&&c.data.module===r.id)).map(r=>({module:r,items:checklistFromNotes(r.data.notes||'')})).filter(x=>x.items.length);}
