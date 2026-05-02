const DB={
  users:{1:{id:1,name:'Root Admin',email:'root@vulnapp.lab',role:'superadmin',phone:'555-0000',ssn:'000-00-0001',creditCard:'4111-1111-1111-1111'},1001:{id:1001,name:'Alice Johnson',email:'alice@vulnapp.lab',role:'user',phone:'555-0101',ssn:'123-45-6789',creditCard:'4532-xxxx-xxxx-1234'},1002:{id:1002,name:'Bob Smith',email:'bob@vulnapp.lab',role:'user',phone:'555-0202',ssn:'987-65-4321',creditCard:'4716-xxxx-xxxx-5678'},1003:{id:1003,name:'Carol White',email:'carol@vulnapp.lab',role:'admin',phone:'555-0303',ssn:'456-78-9012',creditCard:'5500-xxxx-xxxx-9012'},9999:{id:9999,name:'Super Admin',email:'sadmin@vulnapp.lab',role:'superadmin',phone:'555-9999',ssn:'999-99-9999',creditCard:'4929-xxxx-xxxx-0000'},admin:{id:'admin',name:'System Admin',email:'admin@vulnapp.lab',role:'superadmin',phone:'555-ADMIN',ssn:'000-00-0000',creditCard:'ADMIN_CARD'}},
  orders:{'ORD-001':{id:'ORD-001',user_id:1001,items:['iPhone 15'],total:999,status:'delivered'},'ORD-002':{id:'ORD-002',user_id:1002,items:['MacBook Pro'],total:2499,status:'processing'},'ORD-003':{id:'ORD-003',user_id:1003,items:['AirPods','iPad'],total:799,status:'shipped'},'ORD-100':{id:'ORD-100',user_id:1001,items:['Secret Contract'],total:50000,status:'CONFIDENTIAL'}},
  docs:{1:{title:'My Notes',owner:1001,content:'Personal notes here...'},2:{title:'Team Report',owner:1002,content:'Q4 revenue: $2.4M'},3:{title:'HR Records',owner:1003,content:'Salaries: Alice=$95k Bob=$88k'},4:{title:'Admin Secrets',owner:1,content:'Master pass: P@ssw0rd!'},5:{title:'Investor Deck',owner:1001,content:'Pre-IPO valuation: $500M'}},
  apikeys:{100:{key:'sk-live-7h3R3@lD3@l',user:1001,scope:'read'},201:{key:'sk-live-B0bS3cr3tK3y',user:1001,scope:'read_write'},202:{key:'sk-live-C@r0l@dm1nK3y',user:1003,scope:'admin'}},
  messages:{5001:{from:'alice',to:'alice',content:'Meeting at 3pm reminder'},5002:{from:'bob',to:'carol',content:'Acquisition at $12M - KEEP CONFIDENTIAL'},5003:{from:'carol',to:'bob',content:'Wire: CH56 0483 5012 3456 7800 9'},5010:{from:'admin',to:'admin',content:'Backup creds: backup_user / Tr0ub4dor&3'}}
};
const invoices={};
for(let i=1;i<=9999;i++)invoices[String(i).padStart(4,'0')]={id:`INV-${String(i).padStart(4,'0')}`,company:['Acme Corp','TechStart LLC','Global Inc','SecretCo'][i%4],amount:(i*137.5).toFixed(2),date:`2024-${String((i%12)+1).padStart(2,'0')}-01`};

function toggleSidebar(el){
  const sb=document.getElementById('sidebar');
  sb.classList.toggle('open');
  document.getElementById('mob-arr').style.transform=sb.classList.contains('open')?'rotate(90deg)':'';
}

function setV(id,v){document.getElementById(id).value=v;}
function setURL(u){document.getElementById('url-display').value=u;}
function sendCurrentRequest(){setResp('resp-urlpath','[Use the panel controls to test each vulnerability]','');}
function getUser(id){const uid=isNaN(id)?id:parseInt(id);return DB.users[uid]||null;}
function j(d){return JSON.stringify(d,null,2);}
function simHash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)+s.charCodeAt(i);return Math.abs(h).toString(16).padStart(32,'0').substring(0,32);}

function setResp(id,text,cls){
  const el=document.getElementById(id);
  el.className='resp-box'+(cls?' '+cls:'');
  el.textContent=text;
}

let activeNavItem=document.querySelector('.nav-item.active');

const urlMap={'url-path':'https://vulnapp.lab/profile/1001','query-string':'https://vulnapp.lab/settings?user_id=1001','sequential':'https://vulnapp.lab/orders/ORD-001','incremental':'https://vulnapp.lab/docs/1','post-body':'https://vulnapp.lab/profile/update','json-body':'https://vulnapp.lab/api/transfer','base64':'https://vulnapp.lab/user/MTAwMQ==','hidden-fields':'https://vulnapp.lab/address/update','custom-headers':'https://vulnapp.lab/api/internal','cookies':'https://vulnapp.lab/account','jwt':'https://vulnapp.lab/api/me','oauth':'https://vulnapp.lab/api/me?access_token=tok_1001_rw_profile','referer':'https://vulnapp.lab/internal/reports/1001','graphql':'https://vulnapp.lab/graphql','websocket':'wss://vulnapp.lab/chat','uuid':'https://vulnapp.lab/docs/550e8400-e29b-41d4-a716-446655440001','filenames':'https://vulnapp.lab/files/user1001_report.pdf','api-enum':'https://vulnapp.lab/api/v1/orders/1001','bulk-ops':'https://vulnapp.lab/api/bulk/delete','nested-json':'https://vulnapp.lab/api/orders/update','array-params':'https://vulnapp.lab/api/users?user_id[]=1001','admin-panel':'https://vulnapp.lab/admin/users/1001','api-keys':'https://vulnapp.lab/api/keys/201','password-reset':'https://vulnapp.lab/reset','invoices':'https://vulnapp.lab/invoice/INV-0042.pdf','messages':'https://vulnapp.lab/messages/5001','roles':'https://vulnapp.lab/api/plan/update','hashed-ids':'https://vulnapp.lab/profile/hash'};

function showPanel(id,el,lvClass){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  el.classList.add('active');
  if(urlMap[id])setURL(urlMap[id]);
  if(id==='hashed-ids')updateHashedID();
  if(id==='base64')updateB64();
}

function doURLPath(){
  const id=document.getElementById('urlpath-id').value;
  setURL('https://vulnapp.lab/profile/'+id);
  const u=getUser(id);
  if(!u){setResp('resp-urlpath','HTTP 404 Not Found\n{"error":"User not found"}','resp-err');return;}
  const own=(id=='1001');
  setResp('resp-urlpath',`HTTP 200 OK\n${own?'[OK] Viewing your own profile':'[IDOR FOUND] Accessing another user\'s profile!'}\n\n${j(u)}`,own?'resp-ok':'resp-vuln');
}
function doQueryString(){
  const id=document.getElementById('qs-id').value;
  const u=getUser(id);
  if(!u){setResp('resp-qs','HTTP 404\n{"error":"User not found"}','resp-err');return;}
  const own=(id=='1001');
  setResp('resp-qs',`HTTP 200 OK\n${own?'[OK] Your settings':'[IDOR] Foreign account settings exposed!'}\n\n${j({settings:{email:u.email,phone:u.phone,role:u.role}})}`,own?'resp-ok':'resp-vuln');
}
function doSequential(){
  const id='ORD-'+document.getElementById('seq-id').value;
  const o=DB.orders[id];
  if(!o){setResp('resp-seq',`HTTP 404\n{"error":"${id} not found"}`,'resp-err');return;}
  const own=(o.user_id===1001);
  setResp('resp-seq',`HTTP 200 OK\n${own?'[OK] Your order':'[IDOR] Another user\'s order!'}\n\n${j(o)}`,own?'resp-ok':'resp-vuln');
}
function doIncremental(){
  const id=parseInt(document.getElementById('incr-id').value);
  const d=DB.docs[id];
  if(!d){setResp('resp-incr',`HTTP 404\n{"error":"Doc ${id} not found"}`,'resp-err');return;}
  const own=(d.owner===1001);
  setResp('resp-incr',`HTTP 200 OK\n${own?'[OK] Your document':'[IDOR] Private document accessed!'}\n\n${j(d)}`,own?'resp-ok':'resp-vuln');
}
function doPostBody(){
  const uid=document.getElementById('post-uid').value;
  const email=document.getElementById('post-email').value;
  const phone=document.getElementById('post-phone').value;
  if(!getUser(uid)){setResp('resp-post','HTTP 404\n{"error":"User not found"}','resp-err');return;}
  const own=(uid=='1001');
  setResp('resp-post',`HTTP 200 OK\n${own?'[OK] Your profile updated':'[IDOR] Modified another user\'s profile!'}\n\n${j({updated:{user_id:parseInt(uid),email,phone}})}`,own?'resp-ok':'resp-vuln');
}
function doJSON(){
  try{
    const body=JSON.parse(document.getElementById('json-body').value);
    const own=(body.user_id===1001);
    setResp('resp-json',`HTTP 200 OK\n${own?'[OK] Your transfer':'[IDOR] Transfer from another account!'}\n\n${j({result:'Transfer processed',from:`user_${body.user_id}`,amount:body.amount,to:body.to_account})}`,own?'resp-ok':'resp-vuln');
  }catch(e){setResp('resp-json','HTTP 400\n{"error":"Invalid JSON: '+e.message+'"}','resp-err');}
}
function updateB64(){
  const raw=document.getElementById('b64-raw').value;
  document.getElementById('b64-enc').value=btoa(raw);
  setURL('https://vulnapp.lab/user/'+btoa(raw));
}
function doBase64(){
  const enc=document.getElementById('b64-enc').value;
  let decoded;try{decoded=atob(enc);}catch(e){setResp('resp-b64','Error: Invalid base64','resp-err');return;}
  const u=getUser(decoded);
  if(!u){setResp('resp-b64',`Decoded: "${decoded}"\nHTTP 404 - User not found`,'resp-err');return;}
  const own=(decoded=='1001');
  setResp('resp-b64',`Decoded: "${decoded}"\n${own?'[OK]':'[IDOR] User exposed via base64!'}\n\n${j(u)}`,own?'resp-ok':'resp-vuln');
}
function doHiddenField(){
  const uid=document.getElementById('hf-uid').value;
  if(!getUser(uid)){setResp('resp-hf','HTTP 404\n{"error":"User not found"}','resp-err');return;}
  const own=(uid=='1001');
  setResp('resp-hf',`HTTP 200 OK\n${own?'[OK] Your address updated':'[IDOR] Updated another user\'s address!'}\n\n${j({user_id:parseInt(uid),address:{street:document.getElementById('hf-street').value,city:document.getElementById('hf-city').value}})}`,own?'resp-ok':'resp-vuln');
}
function doCustomHeader(){
  const uid=document.getElementById('hdr-uid').value;
  const u=getUser(uid);
  if(!u){setResp('resp-hdr',`HTTP 404\nX-User-ID: ${uid} not found`,'resp-err');return;}
  const own=(uid=='1001');
  setResp('resp-hdr',`HTTP 200 OK\n${own?'[OK]':'[IDOR] X-User-ID header trusted blindly!'}\n\nX-User-ID: ${uid}\nAuthorized as: ${u.name} (${u.role})\n\n${j(u)}`,own?'resp-ok':'resp-vuln');
}
function doCookie(){
  const uid=document.getElementById('ck-uid').value;
  const role=document.getElementById('ck-role').value;
  const u=getUser(uid);
  const own=(uid=='1001'&&role==='user');
  setResp('resp-ck',`HTTP 200 OK\n${own?'[OK] Normal session':'[IDOR/ESCALATION] Cookie manipulated!'}\n\ncookie user_id: ${uid}\ncookie role: ${role}\n\n${u?j(u):'{"id":'+uid+',"role":"'+role+'"}'}`,own?'resp-ok':'resp-vuln');
}
function doJWT(){
  const sub=document.getElementById('jwt-sub').value;
  const role=document.getElementById('jwt-role').value;
  const alg=document.getElementById('jwt-alg').value;
  const own=(sub==='alice_1001'&&role==='user'&&alg==='HS256');
  const bypass=(alg==='none');
  setResp('resp-jwt',`${own?'[OK] Valid JWT':bypass?'[CRITICAL] alg:none — signature skipped!':'[IDOR] JWT payload tampered!'}\n\n${j({header:{alg,typ:'JWT'},payload:{sub,role,iat:1714000000},signature_verified:!bypass&&own})}`,own?'resp-ok':'resp-vuln');
}
function doOAuth(){
  const tok=document.getElementById('oauth-token').value;
  const uid=tok.split('_')[1];
  const own=(uid==='1001');
  const u=getUser(uid);
  setResp('resp-oauth',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Token contains another user\'s ID!'}\n\nToken: "${tok}"\nExtracted uid: ${uid}\n\n${u?j({user:u}):'{"user":{"id":"'+uid+'"}}'}`,own?'resp-ok':'resp-vuln');
}
function doReferer(){
  const ref=document.getElementById('ref-hdr').value;
  const trusted=ref.includes('/admin')||ref.includes('/dashboard');
  setResp('resp-ref',`HTTP ${trusted?'200 OK':'403 Forbidden'}\n${trusted?'[IDOR] Access granted via spoofed Referer!':'[OK] Access denied'}\n\nReferer: ${ref}\nDecision: ${trusted?'GRANTED':'DENIED'}${trusted?'\n\n{"revenue":500000,"users":1200,"notes":"Pre-IPO confidential"}':''}`,trusted?'resp-vuln':'resp-ok');
}
function doGraphQL(){
  const q=document.getElementById('gql-query').value;
  const m=q.match(/user\(id:\s*(\d+)\)/);
  if(!m){setResp('resp-gql','GraphQL Error: Invalid query','resp-err');return;}
  const id=parseInt(m[1]);
  const u=DB.users[id];
  const own=(id===1001);
  if(!u){setResp('resp-gql',`{"data":{"user":null},"errors":[{"message":"Not found"}]}`,'resp-err');return;}
  setResp('resp-gql',`${own?'[OK]':'[IDOR] No auth on GraphQL resolver!'}\n\n{"data":{"user":${j(u)}}}`,own?'resp-ok':'resp-vuln');
}
function doWebSocket(){
  try{
    const msg=JSON.parse(document.getElementById('ws-msg').value);
    const own=(msg.target_user===1001);
    const msgs=Object.values(DB.messages).slice(0,own?1:2);
    setResp('resp-ws',`WS frame received\n${own?'[OK]':'[IDOR] Reading private messages!'}\n\n${j({type:'messages',data:msgs})}`,own?'resp-ok':'resp-vuln');
  }catch(e){setResp('resp-ws','WS Error: Invalid JSON','resp-err');}
}
function doUUID(){
  const uuid=document.getElementById('uuid-val').value;
  const own=uuid.endsWith('440001');
  setResp('resp-uuid',`HTTP 200 OK\n${own?'[OK]':'[IDOR] UUID guessed/enumerated!'}\n\n${j({doc_id:uuid,owner:own?1001:1002,content:own?'Personal notes...':'CONFIDENTIAL: Acquisition $47M - do not disclose'})}`,own?'resp-ok':'resp-vuln');
}
function doFilename(){
  const fn=document.getElementById('fn-val').value;
  const own=fn.includes('1001')&&!fn.includes('admin');
  const isAdmin=fn.includes('admin');
  setResp('resp-fn',`HTTP 200 OK\nContent-Type: application/pdf\n${own?'[OK] Your file':'[IDOR] Another user\'s file!'}\n\n${j({file:fn,content:isAdmin?'root_pass=Toor@2024 db_pass=Sup3rS3cr3t':own?'Alice Q1 Report - Revenue: $234K':'Bob Q1 Report - Salary: $88,000'})}`,own?'resp-ok':'resp-vuln');
}
let enumRunning=false;
function doAPIEnum(){
  const id=document.getElementById('enum-id').value;
  setURL('https://vulnapp.lab/api/v1/orders/'+id);
  const own=(id=='1001');
  setResp('resp-enum',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Order from different user!'}\n\n${j({order_id:parseInt(id),user_id:own?1001:1002,amount:(parseInt(id)*17.3).toFixed(2),status:['pending','shipped','delivered'][id%3]})}`,own?'resp-ok':'resp-vuln');
}
function startEnum(){
  if(enumRunning)return;
  enumRunning=true;
  const btn=document.getElementById('enum-btn');
  btn.textContent='ENUMERATING...';
  let log='[ENUMERATION ATTACK — /api/v1/orders/]\n\n',i=1000,max=1010;
  function step(){
    if(i>max){enumRunning=false;btn.textContent='ENUMERATE 1000-1010';log+='\n[DONE] '+((max-1000+1))+' orders found across multiple users!';setResp('resp-enum',log,'resp-vuln');return;}
    log+=`GET /orders/${i} → 200 OK → uid:${[1001,1002,1003,1001,1002,1001,1003,1002,1001,1003,1002][i-1000]} $${(i*17.3).toFixed(0)}\n`;
    setResp('resp-enum',log,'resp-vuln');i++;setTimeout(step,100);
  }
  step();
}
function doBulk(){
  try{
    const body=JSON.parse(document.getElementById('bulk-body').value);
    const ids=body.user_ids;
    const unauth=ids.filter(id=>id!==1001);
    const own=(unauth.length===0);
    setResp('resp-bulk',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Unauthorized IDs processed in bulk!'}\n\n${j({processed:ids.length,auth:[1001],unauth_processed:unauth,result:own?'1 deleted':'ALL deleted including unauthorized'})}`,own?'resp-ok':'resp-vuln');
  }catch(e){setResp('resp-bulk','HTTP 400: Invalid JSON','resp-err');}
}
function doNested(){
  try{
    const body=JSON.parse(document.getElementById('nested-body').value);
    const uid=body.order.user_id;
    const own=(uid===1001);
    setResp('resp-nested',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Nested user_id tampered — wrong order modified!'}\n\n${j({updated:true,order:body.order})}`,own?'resp-ok':'resp-vuln');
  }catch(e){setResp('resp-nested','HTTP 400: Invalid JSON','resp-err');}
}
function doArray(){
  const ids=document.getElementById('arr-ids').value.split(',').map(s=>s.trim()).filter(Boolean);
  const unauth=ids.filter(id=>id!=='1001');
  const own=(unauth.length===0);
  setURL('https://vulnapp.lab/api/users?'+ids.map(id=>`user_id[]=${id}`).join('&'));
  setResp('resp-arr',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Array contained unauthorized IDs!'}\n\n${j({results:ids.map(id=>({user_id:parseInt(id),data:DB.users[parseInt(id)]||{id,name:'User '+id}}))})}`,own?'resp-ok':'resp-vuln');
}
function doAdmin(){
  const id=document.getElementById('adm-id').value;
  const own=(id==='1001');
  if(own){setResp('resp-adm','HTTP 403 Forbidden\n[OK] Admin access required\n{"error":"You are not an admin"}','resp-err');return;}
  const u=getUser(id);
  setResp('resp-adm',`HTTP 200 OK\n[IDOR] Admin panel accessed without admin role!\n\n${j({admin_panel:true,target_user:id,data:u||{role:'superadmin'},your_role:'user',note:'isLoggedIn() checked, isAdmin() NOT checked'})}`, 'resp-vuln');
}
function doAPIKey(){
  const id=parseInt(document.getElementById('apikey-id').value);
  const k=DB.apikeys[id];
  if(!k){setResp('resp-apikey',`HTTP 404\n{"error":"Key ${id} not found"}`,'resp-err');return;}
  const own=(k.user===1001&&id===201);
  setResp('resp-apikey',`HTTP 200 OK\n${own?'[OK] Your key':'[IDOR] Another user\'s production API key!'}\n\n${j({key_id:id,...k})}`,own?'resp-ok':'resp-vuln');
}
function doResetToken(){
  const uid=document.getElementById('rst-uid').value;
  const ts=document.getElementById('rst-ts').value;
  const token=simHash(uid+ts);
  document.getElementById('rst-tok').value=token;
  setURL('https://vulnapp.lab/reset?token='+token+'&uid='+uid);
  const own=(uid==='1001');
  const u=getUser(uid);
  setResp('resp-rst',`HTTP 200 OK\n${own?'[OK]':'[IDOR] Reset token forged for another user!'}\n\ntoken = hash(uid+timestamp)\n= hash("${uid}${ts}")\n= ${token}\n\n${j({valid:true,email:u?u.email:'user'+uid+'@vulnapp.lab',action:'password_reset_allowed'})}`,own?'resp-ok':'resp-vuln');
}
function doInvoice(){
  const num=document.getElementById('inv-num').value;
  setURL('https://vulnapp.lab/invoice/INV-'+num+'.pdf');
  const inv=invoices[num];
  if(!inv){setResp('resp-inv',`HTTP 404\n{"error":"Invoice INV-${num} not found"}`,'resp-err');return;}
  const own=(parseInt(num)===42);
  setResp('resp-inv',`HTTP 200 OK\nContent-Type: application/pdf\n${own?'[OK] Your invoice':'[IDOR] Another company\'s invoice!'}\n\n${j(inv)}`,own?'resp-ok':'resp-vuln');
}
function doMessage(){
  const id=parseInt(document.getElementById('msg-id').value);
  setURL('https://vulnapp.lab/messages/'+id);
  const m=DB.messages[id];
  if(!m){setResp('resp-msg',`HTTP 404\n{"error":"Message ${id} not found"}`,'resp-err');return;}
  const own=(id===5001);
  setResp('resp-msg',`HTTP 200 OK\n${own?'[OK] Your message':'[IDOR] Private message exposed!'}\n\n${j({id,...m})}`,own?'resp-ok':'resp-vuln');
}
function doRole(){
  const uid=document.getElementById('role-uid').value;
  const rid=document.getElementById('role-id').value;
  const plans={1:'Free (5/day)',2:'Pro ($9.99)',3:'Enterprise (unlimited)',4:'GOD MODE'};
  const own=(uid==='1001'&&rid==='1');
  setResp('resp-role',`HTTP 200 OK\n${own?'[OK]':'[IDOR/ESCALATION] Privilege escalated without payment!'}\n\n${j({user_id:parseInt(uid),role_id:parseInt(rid),plan:plans[rid]||'Unknown',billing_bypass:rid!=='1'})}`,own?'resp-ok':'resp-vuln');
}
function updateHashedID(){
  const raw=document.getElementById('hash-raw').value;
  const h=simHash(raw);
  document.getElementById('hash-val').value=h;
  setURL('https://vulnapp.lab/profile/'+h);
}
function doHashedID(){
  updateHashedID();
  const raw=document.getElementById('hash-raw').value;
  const h=document.getElementById('hash-val').value;
  const u=getUser(raw);
  if(!u){setResp('resp-hash',`HTTP 404\nhash=${h}\nresolved to "${raw}" — not found`,'resp-err');return;}
  const own=(raw==='1001');
  setResp('resp-hash',`HTTP 200 OK\n${own?'[OK]':'[IDOR] hash(small_int) reversed via rainbow table!'}\n\nhash: ${h}\nreversed to: "${raw}"\n\n${j(u)}`,own?'resp-ok':'resp-vuln');
}
updateHashedID();
updateB64();