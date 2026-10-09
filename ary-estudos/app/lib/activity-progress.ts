import {addDays,dayKey,StudyRecord} from './study';
const dateOf=(value:any)=>value?String(value).length===10?String(value):dayKey(new Date(value)):'';
export function stampCompletion(kind:string,data:any,old?:StudyRecord,date=dayKey()){
 const next={...data};
 if(['module','task','assessment'].includes(kind))next.completedDate=data.done?(old?.data.done?(old.data.completedDate||dateOf(old.updated)||data.completedDate||date):date):'';
 const key=kind==='moduleChecklist'?'items':kind==='settings'&&data.preference==='plannerOccurrence'?'checks':'';
 if(key)next[key]=(data[key]||[]).map((item:any,index:number)=>{const previous=key==='items'?old?.data[key]?.find((x:any)=>x.id===item.id):old?.data[key]?.[index];return {...item,completedDate:item.done?(previous?.done?(previous.completedDate||dateOf(old?.updated)||item.completedDate||date):date):''}});
 return next;
}
export function activityEvents(records:StudyRecord[],course='',subject=''){
 const events:{id:string;date:string;title:string;subject:string;course:string;kind:string}[]=[];
 const push=(r:StudyRecord,key:string,date:any,title:string,kind:string,subjectId=r.data.subject||'',courseId=r.data.course||'')=>{const s=records.find(x=>x.kind==='subject'&&x.id===subjectId);courseId=courseId||s?.data.course||'';if((subject&&subject!==subjectId)||(course&&course!==courseId))return;const d=dateOf(date);if(d)events.push({id:r.id+':'+key,date:d,title,subject:subjectId,course:courseId,kind})};
 for(const r of records){const d=r.data;if(['module','task','assessment'].includes(r.kind)&&d.done)push(r,'done',d.completedDate||r.updated,d.name||d.title,r.kind);
 if(r.kind==='moduleChecklist'){const module=records.find(x=>x.kind==='module'&&x.id===d.module);if(module)for(const item of d.items||[])if(item.done)push(r,item.id,item.completedDate||r.updated,item.text,'checklist',module.data.subject)}
 if(r.kind==='settings'&&d.preference==='plannerOccurrence'&&!d.hidden)for(const [i,item] of (d.checks||[]).entries())if(item.done)push(r,String(i),item.completedDate||r.updated||d.date,d.title+' — '+item.text,'planner');
 if(r.kind==='review')for(const [i,h] of (d.history||[]).entries())push(r,String(i),h.date,d.title,'review');
 if(r.kind==='session')push(r,'session',d.date,d.content||'Sessão de estudo','session');
 if(r.kind==='score')push(r,'score',d.date,d.title||'Exercícios registrados','score');
 }
 return events;
}
export function activitySeries(records:StudyRecord[],count:number,end=dayKey(),course='',subject=''){
 const events=activityEvents(records,course,subject);return Array.from({length:count},(_,i)=>{const date=addDays(end,i-count+1);return {date,count:events.filter(x=>x.date===date).length,minutes:records.filter(x=>x.kind==='session'&&x.data.date===date&&(!subject||x.data.subject===subject)&&(!course||records.some(s=>s.kind==='subject'&&s.id===x.data.subject&&s.data.course===course))).reduce((n,x)=>n+(Number(x.data.minutes)||0),0)}})
}
