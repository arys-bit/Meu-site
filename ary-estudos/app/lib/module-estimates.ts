// Old imports always created exactly these four fields with 30 minutes.
// Edited imports and manual forms cannot be distinguished reliably; preserve them.
export function isKnownAutomaticEstimate(record:any){const d=record.data;return record.kind==='module'&&Number(d.minutes)===30&&(d.estimateSource==='automatic'||(record.version===1&&Object.keys(d).sort().join(',')==='done,minutes,name,subject'));}
export function clearAutomaticEstimate(data:any){return {...data,minutes:null,estimateSource:'none',removedAutomaticEstimate:30};}
export function hasEstimate(data:any){return data.minutes!==''&&data.minutes!=null&&Number.isFinite(Number(data.minutes))&&Number(data.minutes)>0;}
