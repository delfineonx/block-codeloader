// Copyright (c) 2025 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const Configuration={
ACTIVE_EVENTS:[
/* ... */
],
BLOCKS:[
/* ... */
],
boot_manager:{
boot_delay_ms: 100,
show_load_time: true,
show_executed_blocks: false,
show_errors: true,
},
block_manager:{
default_locked_status: true,
default_execution_status: true,
max_registrations_per_tick: 32,
max_chunk_requests_per_tick: 8,
max_executions_per_tick: 16,
max_errors_count: 32,
},
join_manager:{
reset_on_reboot: true,
max_dequeue_per_tick: 16,
},
event_manager:{
is_interruption_framework_enabled: false,
default_retry_delay_ticks: 0,
default_retry_limit_ticks: 2,
},
EVENT_REGISTRY:{
tick:null,
onClose:[!1],
onPlayerJoin:[!1],
onPlayerLeave:[!1],
onPlayerJump:[!1],
onRespawnRequest:[[0,-200000,0]],
playerCommand:[null],
onPlayerChat:[null],
onPlayerChangeBlock:["preventChange"],
onPlayerDropItem:["preventDrop"],
onPlayerPickedUpItem:[!1],
onPlayerSelectInventorySlot:[!1],
onBlockStand:[!1],
onPlayerAttemptCraft:["preventCraft"],
onPlayerCraft:[!1],
onPlayerAttemptOpenChest:["preventOpen"],
onPlayerOpenedChest:[!1],
onPlayerMoveItemOutOfInventory:["preventChange"],
onPlayerMoveInvenItem:["preventChange"],
onPlayerMoveItemIntoIdxs:["preventChange"],
onPlayerSwapInvenSlots:["preventChange"],
onPlayerMoveInvenItemWithAmt:["preventChange"],
onPlayerAttemptAltAction:["preventAction"],
onPlayerAltAction:[!1],
onPlayerClick:[!1],
onClientOptionUpdated:[!1],
onMobSettingUpdated:[!1],
onInventoryUpdated:[!1],
onChestUpdated:[!1],
onWorldChangeBlock:["preventChange"],
onCreateBloxdMeshEntity:[!1],
onEntityCollision:[!1],
onPlayerAttemptSpawnMob:["preventSpawn"],
onWorldAttemptSpawnMob:["preventSpawn"],
onPlayerSpawnMob:[!1],
onWorldSpawnMob:[!1],
onWorldAttemptDespawnMob:["preventDespawn"],
onMobDespawned:[!1],
onPlayerAttack:[!1],
onPlayerDamagingOtherPlayer:["preventDamage"],
onPlayerDamagingMob:["preventDamage"],
onMobDamagingPlayer:["preventDamage"],
onMobDamagingOtherMob:["preventDamage"],
onAttemptKillPlayer:["preventDeath"],
onPlayerKilledOtherPlayer:["keepInventory"],
onMobKilledPlayer:["keepInventory"],
onPlayerKilledMob:["preventDrop"],
onMobKilledOtherMob:["preventDrop"],
onPlayerPotionEffect:[!1],
onPlayerDamagingMeshEntity:[!1],
onPlayerBreakMeshEntity:[!1],
onPlayerUsedThrowable:[!1],
onPlayerThrowableHitTerrain:[!1],
onTouchscreenActionButton:[!1],
onTaskClaimed:[!1],
onChunkLoaded:[!1],
onPlayerRequestChunk:[!1],
onItemDropCreated:[!1],
onPlayerStartChargingItem:[!1],
onPlayerFinishChargingItem:[!1],
doPeriodicSave:[!1],
},
LOG_STYLE:{
error:{color:"#ff9d87",fontWeight:"600",fontSize:"1rem"},
warning:{color:"#fcd373",fontWeight:"600",fontSize:"1rem"},
success:{color:"#2eeb82",fontWeight:"600",fontSize:"1rem"},
},
};

const CF_=Configuration,IF_={state:0,handler:()=>{},args:[],delay:0,limit:1,phase:400000,cache:null,defaultPhase:400000,wasInterrupted:!1,tick:null},EM_={a:null,b:!1,c:{},d:{},e:[],f:[],g:!1,h:null,i:null,j:null,k:null,l:null},TM_={a:null,b:!1,c:null,d:null,e:null},JM_={a:!1,b:null,c:null,d:null,e:null,f:null},BM_={a:null,b:4,c:null,d:null,e:!1,f:null,g:null,h:null},OM_={a:-2,b:!0,c:!1,d:null,e:null,f:null,g:null,h:null,i:null},CL_={configuration:null,isRunning:!1,isBlockLocked:null,logBootResult:null,logLoadTime:null,logExecutedBlocks:null,logErrors:null},N_=function(){};
{let W=IF_,I={},E=0,D=1,S=0,L=[],X=1,N=0;Object.defineProperty(globalThis.InternalError.prototype,"name",{configurable:!0,get:()=>{if(X){if(W.state){I[++E]=[W.phase,W.cache,W.handler,W.args,W.delay+N,W.limit];S++}}else{L[0]=W.phase;W.wasInterrupted=!1;X=1}W.cache=null;W.state=0;return"InternalError"}});W.tick=()=>{W.state=0;if(!S){W.cache=null;N++;return}X=0;W.wasInterrupted=!0;let l,m=E;while(D<=m){l=L=I[D];if(l[4]<=N){if(l[5]>0){l[5]--;W.phase=l[0];W.cache=l[1];l[2](...l[3])}delete I[D++];S--}else{delete I[D++];I[++E]=l}}W.state=0;W.cache=null;W.wasInterrupted=!1;X=1;N++}}
{let V=EM_,N=N_,C=0,P=[],A=null,G=null,R=0,S=0;V.h=()=>{if(V.b){return}G=CF_.EVENT_REGISTRY;A=CF_.ACTIVE_EVENTS;let a=CF_.event_manager,b=!!a.is_interruption_framework_enabled,c=a.default_retry_delay_ticks|0;c=c&~(c>>31);let d=a.default_retry_limit_ticks|0;d=(d&~(d>>31))+(-d>>31)+1;let e=V.c,f=V.d,g=V.e,h=A.length,i=0;while(i<h){let j=A[i],k=j;if(j instanceof Array){k=j[0]}let l=G[k];if(l===void 0){g[g.length]=k;i++;continue}if(k==="tick"){i++;continue}P[P.length]=k;f[k]=!0;if(!(l instanceof Array)){l=G[k]=[!1]}let m=!!l[1];if(b&m){let n=l[2];if(n==null){n=c}n|=0;let o=l[3];if(o==null){o=d}o|=0;let p=IF_;e[k]=N;globalThis[k]=function handler(a0,a1,a2,a3,a4,a5,a6,a7,a8){p.state=1;p.handler=handler;p.args=[a0,a1,a2,a3,a4,a5,a6,a7,a8];p.delay=n;p.limit=o;p.phase=400000;try{return e[k](a0,a1,a2,a3,a4,a5,a6,a7,a8)}finally{p.state=0}}}else{e[k]=N;globalThis[k]=function(a0,a1,a2,a3,a4,a5,a6,a7,a8){return e[k](a0,a1,a2,a3,a4,a5,a6,a7,a8)}}i++}f.tick=!0};V.i=()=>{let a=V.c,b=P.length;while(C<b){let c=P[C];Object.defineProperty(globalThis,c,{configurable:!0,set:F=>{if(F instanceof Function){a[c]=F}else{a[c]=N}}});C++}Object.defineProperty(globalThis,"tick",{configurable:!0,set:F=>{if(F instanceof Function){a.tick=F}else{a.tick=N}}})};V.j=()=>{if(V.g){return}A=CF_.ACTIVE_EVENTS;V.f=[];R=0;S=0;V.g=!0};V.k=()=>{let a=V.c,b=P.length;while(R<b){a[P[R]]=N;R++}};V.l=()=>{let a=V.d,b=A.length;while(S<b){let c=A[S],d=c;if(c instanceof Array){d=c[0]}if(d==="tick"){S++;continue}if(a[d]){let e;if(c instanceof Array){e=c[1]}if(e===void 0){e=G[d][0]}else if(e==="undefined"){e=void 0}api.setCallbackValueFallback(d,e)}else{V.f[V.f.length]=d}S++}}}
{let X=TM_,W=IF_,V=EM_,N=N_,B=null,M=null,L=!1,Z=!1;X.c=()=>{if(X.b){return}B=N;X.a=N;M=N;L=!1;Z=!1;X.b=!0};let H=()=>{W.tick();B();X.a();M()};X.d=()=>{if(L){return}Object.defineProperty(globalThis,"tick",{configurable:!0,set:F=>{if(F instanceof Function){M=F}else{M=N}}});B=V.c.tick;V.c.tick=H;L=!0};X.e=()=>{if(Z){return}let a=V.c;Object.defineProperty(globalThis,"tick",{configurable:!0,set:F=>{if(F instanceof Function){a.tick=F}else{a.tick=N}}});a.tick=M;B=N;X.a=N;Z=!0}}
{let J=JM_,W=IF_,V=EM_,Y=OM_,N=N_,R=!0,Q=1,M=null,B=null,S=null,C=0,L=!1,Z=!1;J.b=()=>{if(J.a){return}let a=CF_.join_manager;R=!!a.reset_on_reboot;Q=a.max_dequeue_per_tick|0;Q=(Q&~(Q>>31))+(-Q>>31)+1;M=N;B=[];if(R|!S){S={}}C=0;L=!1;Z=!1;J.a=!0};let H=(a0,a1)=>{B[B.length]=[a0,a1];S[a0]=1};J.d=()=>{if(L){return}V.c.onPlayerJoin=H;Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:F=>{if(F instanceof Function){M=F}else{M=N}}});L=!0};J.c=()=>{if(R|Y.b){let a=api.getPlayerIds(),b=a.length,c=0;while(c<b){let d=a[c];if(!S[d]){B[B.length]=[d,!1];S[d]=1}c++}}};J.e=()=>{let a=Q;while(C<B.length&a>0){let b=B[C],c=b[0];if(S[c]!==2){C++;S[c]=2;W.state=1;W.handler=M;W.args=b;W.delay=0;W.limit=1;W.phase=400000;M(c,b[1]);W.state=0;a--;C--}C++}return C>=B.length};J.f=()=>{if(Z){return}let a=V.c;Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:F=>{if(F instanceof Function){a.onPlayerJoin=F}else{a.onPlayerJoin=N}}});a.onPlayerJoin=M;B=null;Z=!0}}
{let B=BM_,Y=OM_,C=!0,A=!0,I=1,Q=1,V=1,O=0,K=null,L=null,H=0,G=0,E=0,X=0,Z=!1;B.f=()=>{if(B.e){return}B.c=CF_.BLOCKS instanceof Array?CF_.BLOCKS.slice():[];let a=CF_.block_manager;C=!!a.default_locked_status;A=!!a.default_execution_status;I=a.max_registrations_per_tick|0;I=(I&~(I>>31))+(-I>>31)+1;Q=a.max_chunk_requests_per_tick|0;Q=(Q&~(Q>>31))+(-Q>>31)+1;V=a.max_executions_per_tick|0;V=(V&~(V>>31))+(-V>>31)+1;O=a.max_errors_count|0;O=O&~(O>>31);B.b=0;K={};L={};B.d=[null];H=0;G=0;X=0;E=0;Z=!1;B.e=!0};let T=()=>{let a=B.c,b=a.length,c=Q,d=I;while(G<b&d>0&c>0){let e=a[G].slice(),x=e[0];x=(x|0)-(x<(x|0));let y=e[1];y=(y|0)-(y<(y|0));let z=e[2];z=(z|0)-(z<(z|0));let f=x+"|"+y+"|"+z,g=e[3];if(g==null){K[f]=C}else{K[f]=!!g}let h=e[4];if(h==null){h=e[3]=A}else{h=e[3]=!!h}if(h){let i=(x>>5)+"|"+(y>>5)+"|"+(z>>5);if(L[i]===void 0){let j=e[4]=api.getBlock(x,y,z);if(j==="Unloaded"){L[i]=!1;c--}else{L[i]=!0}}else{e[4]="Unloaded"}H=1}else{e[4]=null}a[G]=e;d--;G++}B.b=(G>=b)<<1|H^1};let U=()=>{let a=B.c,b=B.d,c=a.length,d=V;while(X<c&d>0){let e=a[X];if(!e[3]){X++;continue}let x=e[0],y=e[1],z=e[2];if(e[4]==="Unloaded"){let f=api.getBlock(x,y,z);if(f==="Unloaded"){break}e[4]=f}try{let f=api.getBlockData(x,y,z)?.persisted?.shared?.text;(0,eval)(f)}catch(g){E++;b[E*+(b.length-1<O)]=[x,y,z,g.name,g.message]}d--;X++}B.b=2|X>=c};B.a=()=>{if(B.b<2){return T()}if(B.b===2){U()}};B.g=()=>{if(Z){return}B.d[0]=null;L=null;Z=!0};B.h=a=>{let x=a[0],y=a[1],z=a[2],b=(x|0)-(x<(x|0))+"|"+((y|0)-(y<(y|0)))+"|"+((z|0)-(z<(z|0)));if(K[b]!==!1){return!Y.c}return!1}}
{let Y=OM_,V=EM_,Z=TM_,J=JM_,B=BM_,C=CL_,D=0,L=!0,E=!0,X=!1,N=-1,T=-1;Y.f=a=>{let b=B.d.length-1,c="Code Loader: BootManager: Code was loaded in "+T*50+" ms";if(b===0){c+=a?" with 0 errors.":".";api.broadcastMessage([{str:c,style:Y.d.success??{}}])}else{c+=a?" with "+b+" error"+(b===1?"":"s")+".":".";api.broadcastMessage([{str:c,style:Y.d.warning??{}}])}};Y.g=()=>{let a=B.c,b=a.length,c="",d=0,e=0;while(e<b){let f=a[e];if(f[3]){c+='\n"'+f[4]+'" at ('+f[0]+", "+f[1]+", "+f[2]+")";d++}e++}c="Code Loader: BlockManager: Executed "+d+" block"+(d===1?"":"s")+":"+c;api.broadcastMessage([{str:c,style:(B.d.length-1?Y.d.warning:Y.d.success)??{}}])};Y.h=()=>{let a=B.d,b=a.length-1;if(b>0){let c="Code Loader: BlockManager: Code execution error"+(b===1?"":"s")+":",d=1;while(d<=b){let e=a[d];c+="\n"+e[3]+" at ("+e[0]+", "+e[1]+", "+e[2]+"): "+e[4];d++}api.broadcastMessage([{str:c,style:Y.d.error??{}}])}};Y.e=(a,b,c)=>{if(V.e.length){api.broadcastMessage([{str:'Code Loader: EventManager: Unregistered active events: "'+V.e.join('", "')+'".',style:Y.d.warning??{}}])}if(V.f.length){api.broadcastMessage([{str:'Code Loader: EventManager: Invalid active events: "'+V.f.join('", "')+'".',style:Y.d.warning??{}}])}if(a){Y.f(b)}if(c){Y.g()}if(b){Y.h()}};Y.i=()=>{N++;if(Y.a<6){if(Y.a===-2){if(Y.b&!V.b&N>20){let a=V.a,b=`Code Loader: EventManager: ${a===null?"Undefined e":"E"}rror on events primary setup${a===null?".":` - ${a[0]}: ${a[1]}.`}`,c=api.getPlayerIds();for(let d of c){if(api.checkValid(d)){api.kickPlayer(d,b)}}}return}if(Y.a===0){N=0;let e=CF_.boot_manager;D=(e.boot_delay_ms|0)*.02|0;D=D&~(D>>31);L=!!e.show_load_time;E=!!e.show_errors;X=!!e.show_executed_blocks;Y.d={error:Object.assign({},CF_.LOG_STYLE.error),warning:Object.assign({},CF_.LOG_STYLE.warning),success:Object.assign({},CF_.LOG_STYLE.success)};T=-1;V.g=!1;Z.b=!1;J.a=!1;B.e=!1;C.isRunning=Y.c=!0;Y.a=1}if(Y.a===1){if(N<D){return}Y.a=2}if(Y.a===2){V.j();Z.c();if(V.d.onPlayerJoin){J.b()}B.f();Y.a=3}if(Y.a===3){if(Y.b){V.i()}else{V.k()}V.l();Y.a=4}if(Y.a===4){if(V.d.onPlayerJoin){J.c();J.d()}Z.d();Y.a=5}if(Y.a===5){Z.a=B.a;Y.a=6;return}}if(Y.a===6){if(B.b===3){B.g();Y.a=6+1+!V.d.onPlayerJoin}}if(Y.a===7){if(J.e()){J.f();Y.a=8}}if(Y.a===8){Z.e();B.b=4;Y.b=!1;C.isRunning=Y.c=!1;Y.a=-1;T=N-D+1;Y.e(L,E,X)}}}
{let C=CL_,V=EM_,B=BM_,Y=OM_;C.configuration=CF_;C.isBlockLocked=a=>{return a instanceof Array&&a.length===3&&B.h(a)};C.reboot=()=>{if(!Y.c){V.c.tick=Y.i;Y.a=0}else{api.broadcastMessage([{str:"Code Loader: BootManager: Wait until current running boot session is finished.",style:Y.d.warning??{}}])}};C.logBootResult=(a=!0,b=!0,c=!1)=>{Y.e(a,b,c)};C.logLoadTime=(a=!0)=>{Y.f(a)};C.logErrors=()=>{Y.h()};C.logExecutedBlocks=()=>{Y.g()}}
{let a=EM_.c;a.tick=OM_.i;globalThis.tick=function(){a.tick()}}
try{EM_.h();let a=[CF_,CF_.boot_manager,CF_.block_manager,CF_.join_manager,CF_.event_manager,CF_.LOG_STYLE,IF_,EM_,TM_,JM_,BM_,OM_,CL_],b=a.length,c=0;while(c<b){Object.seal(a[c]);c++}Object.freeze(CF_.EVENT_REGISTRY);EM_.b=!0;OM_.a=0}catch(error){EM_.a=[error.name,error.message]}
globalThis.IF=IF_;
globalThis.CL=CL_;
void 0;

