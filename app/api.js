const root='https://make.fun/api/';const memory=new Map(),pending=new Map();
export let cacheNotice='';
function stored(path){try{return JSON.parse(sessionStorage.getItem('mf:'+path))}catch{return null}}
export async function get(path,{refresh=false}={}){const hit=memory.get(path)||stored(path);if(hit&&!refresh&&Date.now()-hit.at<30000)return hit.data;if(pending.has(path))return pending.get(path);const task=(async()=>{try{const headers={Accept:'application/json'};if(hit?.etag)headers['If-None-Match']=hit.etag;let response;for(let attempt=0;attempt<2;attempt++){response=await fetch(root+path,{method:'GET',headers,signal:AbortSignal.timeout(12000)});if(response.status!==503||attempt)break;await new Promise(r=>setTimeout(r,600))}if(response.status===304&&hit){hit.at=Date.now();memory.set(path,hit);return hit.data}if(!response.ok)throw Error(`make.fun returned ${response.status}`);const data=await response.json(),entry={data,etag:response.headers.get('ETag'),at:Date.now()};memory.set(path,entry);try{sessionStorage.setItem('mf:'+path,JSON.stringify(entry))}catch{}cacheNotice='';return data}catch(e){if(hit){cacheNotice='Showing cached data · connection unavailable';return hit.data}throw e}finally{pending.delete(path)}})();pending.set(path,task);return task}
export const list=()=>get('competitions?status=open&activity=times');
export const competition=slug=>get('competitions/'+encodeURIComponent(slug));
export const leaderboard=slug=>get('competitions/'+encodeURIComponent(slug)+'/leaderboard');
export const profile=handle=>get('profiles/'+encodeURIComponent(handle));
