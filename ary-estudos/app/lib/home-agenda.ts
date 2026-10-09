import {calendarDate,calendarTime} from './calendar';
type RecordItem={id:string;kind:string;data:any};
export function homeAgenda(records:RecordItem[],today:string,now=new Date()){
 const tasks=records.filter(x=>x.kind==='task'&&!x.data.done&&x.data.date<=today).sort((a,b)=>String(a.data.date).localeCompare(String(b.data.date))||String(a.data.time||'').localeCompare(String(b.data.time||''))).slice(0,4);
 const lessons=records.flatMap(r=>{const d=r.data;if(d.done||d.hidden)return [];let date=d.date,time=d.time||'';if(r.kind==='event'){if(!/aula|curso|estudo|faculdade/i.test(d.title||'')||!d.start)return [];date=calendarDate(d.start);time=calendarTime(d.start);if(!d.allDay&&new Date(d.end||d.start)<now)return [];}else if(r.kind==='task'){if(!['Conteúdo','Videoaula','Leitura'].includes(d.type||'Conteúdo')&&!d.module)return [];}else if(r.kind==='assessment'){if(d.type!=='Aula obrigatória')return [];}else return [];if(!date||date<today)return [];return [{record:r,date,time}];}).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,3);
 return {tasks,lessons};
}
