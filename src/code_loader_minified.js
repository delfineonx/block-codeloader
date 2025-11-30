// Copyright (c) 2025 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const Configuration={
ACTIVE_EVENTS:[
/* ... */
],
blocks:[
/* ... */
],
boot_manager:{
boot_delay_ms:100,
show_load_time:true,
show_errors:true,
},
block_manager:{
default_locked_status:true,
default_eval_status:true,
max_registrations_per_tick:32,
max_requests_per_tick:8,
max_evals_per_tick:16,
max_errors_count:32,
},
join_manager:{
reset_on_reboot:true,
max_dequeue_per_tick:16,
},
event_manager:{
is_interruption_framework_enabled:false,
default_retry_delay_ticks:0,
default_retry_limit_ticks:2,
},
EVENT_REGISTRY:{
tick:null,
onClose:[!0],
onPlayerJoin:[!0],
onPlayerLeave:[!0],
onPlayerJump:[!0],
onRespawnRequest:[!1],
playerCommand:[!1],
onPlayerChat:[!1],
onPlayerChangeBlock:[!1],
onPlayerDropItem:[!1],
onPlayerPickedUpItem:[!0],
onPlayerSelectInventorySlot:[!0],
onBlockStand:[!0],
onPlayerAttemptCraft:[!1],
onPlayerCraft:[!0],
onPlayerAttemptOpenChest:[!1],
onPlayerOpenedChest:[!0],
onPlayerMoveItemOutOfInventory:[!1],
onPlayerMoveInvenItem:[!1],
onPlayerMoveItemIntoIdxs:[!1],
onPlayerSwapInvenSlots:[!1],
onPlayerMoveInvenItemWithAmt:[!1],
onPlayerAttemptAltAction:[!1],
onPlayerAltAction:[!0],
onPlayerClick:[!0],
onClientOptionUpdated:[!0],
onMobSettingUpdated:[!0],
onInventoryUpdated:[!0],
onChestUpdated:[!0],
onWorldChangeBlock:[!1],
onCreateBloxdMeshEntity:[!0],
onEntityCollision:[!0],
onPlayerAttemptSpawnMob:[!1],
onWorldAttemptSpawnMob:[!1],
onPlayerSpawnMob:[!0],
onWorldSpawnMob:[!0],
onWorldAttemptDespawnMob:[!1],
onMobDespawned:[!0],
onPlayerAttack:[!0],
onPlayerDamagingOtherPlayer:[!1],
onPlayerDamagingMob:[!1],
onMobDamagingPlayer:[!1],
onMobDamagingOtherMob:[!1],
onAttemptKillPlayer:[!1],
onPlayerKilledOtherPlayer:[!1],
onMobKilledPlayer:[!1],
onPlayerKilledMob:[!1],
onMobKilledOtherMob:[!1],
onPlayerPotionEffect:[!0],
onPlayerDamagingMeshEntity:[!0],
onPlayerBreakMeshEntity:[!0],
onPlayerUsedThrowable:[!0],
onPlayerThrowableHitTerrain:[!0],
onTouchscreenActionButton:[!0],
onTaskClaimed:[!0],
onChunkLoaded:[!0],
onPlayerRequestChunk:[!0],
onItemDropCreated:[!0],
onPlayerStartChargingItem:[!0],
onPlayerFinishChargingItem:[!0],
doPeriodicSave:[!0],
},
LOG_STYLE:{
error:{color:"#ff9d87",fontWeight:"600",fontSize:"1rem"},
warning:{color:"#fcd373",fontWeight:"600",fontSize:"1rem"},
success:{color:"#2eeb82",fontWeight:"600",fontSize:"1rem"},
},
};

const CF_=Configuration,IF_={state:0,handler:()=>{},args:[],delay:0,limit:2,tick:null},EM_={a:!1,b:null,c:!1,d:{},e:{},f:{},g:[],h:!1,i:null,j:null,k:null,l:null},TM_={a:null,b:!1,c:null,d:null,e:null},JM_={a:!1,b:null,c:null,d:null,e:null,f:null},BM_={a:null,b:4,c:null,d:!1,e:null,f:null},OM_={a:-2,b:!0,c:!1,d:null,e:null,f:null,g:null,h:null},CL_={configuration:null,isRunning:!1,state:null,isBlockLocked:null,logBootResult:null,logLoadTime:null,logErrors:null};
{let _IF=IF_,I={},D=0,E=1,N=0;Object.defineProperty(globalThis.InternalError.prototype,"name",{configurable:!0,get:()=>{if(_IF.state&E){I[++D]=[_IF.handler,_IF.args,_IF.delay+N-1,_IF.limit]}E=1;_IF.state=0;return"InternalError"}});_IF.tick=()=>{for(let d in I){let c=I[d];if(c[2]<N){if(c[3]>0){E=0;c[3]--;c[0](...c[1])}delete I[d]}}E=1;N++}}
{let _EM=EM_,N=function(){},A=[],I=0,D=!1,R=0;_EM.i=()=>{if(_EM.c){return}let a=CF_.EVENT_REGISTRY,b=CF_.ACTIVE_EVENTS,c=CF_.event_manager,d=_EM.a=!!c.is_interruption_framework_enabled,e=c.default_retry_delay_ticks|0;e=e&~(e>>31);let f=c.default_retry_limit_ticks|0;f=(f&~(f>>31))+(-f>>31)+1;let g=_EM.d,h=_EM.e,i=_EM.f,j=_EM.g;for(let k of b){let l=a[k];if(l===void 0){j[j.length]=k;continue}A[A.length]=k;if(k==="tick"){continue}if(!Array.isArray(l)){l=a[k]=[]}let m=l[0]=!!l[0];if(d&m){i[k]=2;let n=l[1];if(n===void 0|n===null){n=l[1]=e}n|=0;let o=l[2];if(o===void 0|o===null){o=l[2]=f}o|=0;let _IF=IF_;h[k]=g[k]=function(){_IF.state=0};globalThis[k]=function handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){_IF.state=1;_IF.handler=handler;_IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];_IF.delay=n;_IF.limit=o;return h[k](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)}}else{i[k]=1;h[k]=g[k]=N;globalThis[k]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){return h[k](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)}}}};_EM.j=()=>{if(D){return}let a=_EM.e,b=_EM.d,c=A.length;while(I<c){let d=A[I],e=b[d];Object.defineProperty(globalThis,d,{configurable:!0,set:fn=>{a[d]=[e,fn][+(typeof fn==="function")]}});I++}D=I>=c};_EM.k=()=>{if(_EM.h){return}R=0;_EM.h=!0};_EM.l=()=>{let a=_EM.e,b=_EM.d,c=A.length;while(R<c){let d=A[R];if(d!=="tick"){a[d]=b[d]}R++}}}
{let _TM=TM_,_EM=EM_,N=function(){},B=null,M=null,I=!1,F=!1;_TM.c=()=>{if(_TM.b){return}B=N;_TM.a=N;M=N;I=!1;F=!1;_TM.b=!0};const H=()=>{B();_TM.a();M()};_TM.d=()=>{if(I){return}Object.defineProperty(globalThis,"tick",{configurable:!0,set:fn=>{M=[N,fn][+(typeof fn==="function")]}});let a=_EM.e;B=a.tick;a.tick=H;I=!0};_TM.e=()=>{if(F){return}let a=_EM.e;Object.defineProperty(globalThis,"tick",{configurable:!0,set:fn=>{a.tick=[N,fn][+(typeof fn==="function")]}});a.tick=M;B=N;_TM.a=N;F=!0}}
{let _JM=JM_,_EM=EM_,_OM=OM_,R=!0,Q=1,M=null,B=null,J=null,C=0,I=!1,F=!1,N=0,E=1,P=2;_JM.b=()=>{if(_JM.a){return}let a=CF_.join_manager;R=!!a.reset_on_reboot;Q=a.max_dequeue_per_tick|0;Q=(Q&~(Q>>31))+(-Q>>31)+1;M=_EM.d.onPlayerJoin;B=[];if(R|!J){J={}}C=0;I=!1;F=!1;_JM.a=!0};_JM.c=()=>{if(R|_OM.b){let a=api.getPlayerIds();for(let b of a){if((J[b]|0)===N){B[B.length]=[b,!1];J[b]=E}}}};const H=(D,G)=>{B[B.length]=[D,G];J[D]=E};_JM.d=()=>{if(I){return}_EM.e.onPlayerJoin=H;let a=_EM.d.onPlayerJoin;Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:fn=>{M=[a,fn][+(typeof fn==="function")]}});I=!0};_JM.e=()=>{let a=Q;while(C<B.length&a>0){let b=B[C],c=b[0];if(J[c]!==P){M(c,b[1]);J[c]=P;a--}C++}return C>=B.length};_JM.f=()=>{if(F){return}let a=_EM.d.onPlayerJoin,b=_EM.e;b.onPlayerJoin=M;Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:fn=>{b.onPlayerJoin=[a,fn][+(typeof fn==="function")]}});F=!0}}
{let _BM=BM_,_OM=OM_,B=null,C=!0,V=!0,N=1,T=1,A=1,O=0,K=null,L=null,Q=null,R=null,Y=0,G=0,U=0,E=0,S=1,D=2;_BM.e=()=>{if(_BM.d){return}B=CF_.blocks.slice();let a=CF_.block_manager;C=!!a.default_locked_status;V=!!a.default_eval_status;N=a.max_registrations_per_tick|0;N=(N&~(N>>31))+(-N>>31)+1;T=a.max_requests_per_tick|0;T=(T&~(T>>31))+(-T>>31)+1;A=a.max_evals_per_tick|0;A=(A&~(A>>31))+(-A>>31)+1;O=a.max_errors_count|0;O=O&~(O>>31);_BM.b=0;K={};L={};Q=[];R=_BM.c=[null];Y=0;G=0;U=0;E=0;_BM.d=!0};const X=()=>{let a=B.length,b=N;while(G<a&b>0){let c=B[G]=B[G].slice(),x=c[0];x=(x|0)-(x<(x|0));let y=c[1];y=(y|0)-(y<(y|0));let z=c[2];z=(z|0)-(z<(z|0));let d=c[3];if(d===void 0|d===null){K[x+"|"+y+"|"+z]=c[3]=C}else{K[x+"|"+y+"|"+z]=c[3]=!!d}let e=c[4];if(e===void 0|e===null){e=c[4]=V}else{e=c[4]=!!e}if(e){let f=api.isBlockInLoadedChunk(x,y,z),g=(x>>5)+"|"+(y>>5)+"|"+(z>>5);if(L[g]===void 0){L[g]=f<<1;if(!f){Q[Q.length]=[g,x>>5<<5,y>>5<<5,z>>5<<5]}}Y=1}b--;G++}_BM.b=(G>=a)<<1|Y^1};const Z=()=>{let a=Q.length,b=U,c=T;while(b<a&c>0){let d=Q[b];if(api.getBlockId(d[1],d[2],d[3])===1){L[d[0]]=S}else{L[d[0]]=D;if(b===U){U++}}c--;b++}let e=B.length;c=A;while(E<e&c>0){let f=B[E];if(!f[4]){E++;continue}let x=f[0],y=f[1],z=f[2];if(L[(x>>5)+"|"+(y>>5)+"|"+(z>>5)]!==D){break}try{let g=api.getBlockData(x,y,z)?.persisted?.shared?.text;(0,eval)(g)}catch(h){let i=R.length-1,j=+(i<O);R[(i+1)*j]=[R[i*j],[x,y,z,h.name,h.message]][j]}c--;E++}_BM.b=2|E>=e};_BM.a=()=>{if(_BM.b<2){return X()}if(_BM.b===2){Z()}};_BM.f=P=>{let x=P[0],y=P[1],z=P[2];if(K[(x|0)-(x<(x|0))+"|"+((y|0)-(y<(y|0)))+"|"+((z|0)-(z<(z|0)))]!==!1){return!_OM.c}return!1}}
{let _OM=OM_,_EM=EM_,_TM=TM_,_JM=JM_,_BM=BM_,_CL=CL_,D=0,L=!0,E=!0,N=-1,T=-1;_OM.f=R=>{let a=_BM.c.length-1,b="Code Loader: BootManager: Code was loaded in "+(T*50)+" ms";if(a===0){b+=R?" with 0 errors.":".";api.broadcastMessage([{str:b,style:_OM.d?.success??{}}])}else{b+=R?" with "+a+" error"+(a===1?"":"s")+".":".";api.broadcastMessage([{str:b,style:_OM.d?.warning??{}}])}};_OM.g=()=>{let a=_BM.c,b=a.length-1;if(b>0){let c="Code Loader: BlockManager: Code evaluation error"+(b===1?"":"s")+":",d=1;while(d<=b){let e=a[d];c+="\n"+e[3]+" at ("+e[0]+","+e[1]+","+e[2]+"): "+e[4];d++}api.broadcastMessage([{str:c,style:_OM.d?.error??{}}])}};_OM.e=(W,R)=>{let a=_EM.g;if(a.length){api.broadcastMessage([{str:"Code Loader: EventManager: Unregistered callbacks: "+a.join(", ")+".",style:_OM.d?.warning??{}}])}if(W){_OM.f(R)}if(R){_OM.g()}};_OM.h=()=>{N++;if(_OM.a<6){if(_OM.a===-2){if(_OM.b&!_EM.c&N>10){let a=_EM.b,b=`Code Loader: EventManager: ${a===null?"Undefined e":"E"}rror on events primary setup${a===null?".":` - ${a[0]}: ${a[1]}.`}`,c=api.getPlayerIds();for(let d of c){if(api.checkValid(d)){api.kickPlayer(d,b)}}}return}if(_OM.a===0){N=0;let e=CF_.boot_manager;D=(e.boot_delay_ms|0)*.02|0;D=D&~(D>>31);L=!!e.show_load_time;E=!!e.show_errors;_OM.d={error:Object.assign({},CF_.LOG_STYLE.error),warning:Object.assign({},CF_.LOG_STYLE.warning),success:Object.assign({},CF_.LOG_STYLE.success)};T=-1;_EM.h=!1;_TM.b=!1;_JM.a=!1;_BM.d=!1;_CL.isRunning=_OM.c=!0;_OM.a=1}if(_OM.a===1){if(N<D){return}_OM.a=2}if(_OM.a===2){_EM.k();_TM.c();_JM.b();_BM.e();_OM.a=3}if(_OM.a===3){if(_OM.b){_EM.j()}_EM.l();if(!!_EM.f.onPlayerJoin){_JM.c()}_OM.a=4}if(_OM.a===4){if(!!_EM.f.onPlayerJoin){_JM.d()}_TM.d();_OM.a=5;return}if(_OM.a===5){_TM.a=_BM.a;_OM.a=6;return}}if(_OM.a===6){if(_BM.b===3){_BM.c[0]=null;_OM.a=6+1+!_EM.f.onPlayerJoin}}if(_OM.a===7){_OM.a+=_JM.e()|0}if(_OM.a===8){if(!!_EM.f.onPlayerJoin){_JM.f()}_TM.e();_BM.b=4;_OM.b=!1;_CL.isRunning=_OM.c=!1;_OM.a=-1;T=N-D+1;_OM.e(L,E)}}}
{let _CL=CL_,_IF=IF_,_EM=EM_,_BM=BM_,_OM=OM_;_CL.configuration=CF_;_CL.state=M=>{let T=_EM.f[M];if(T===void 0){api.broadcastMessage([{str:'Code Loader: EventManager: interruption state - "'+M+'" is invalid active event name.',style:_OM.d?.error??{}}])}else if(T===1){api.broadcastMessage([{str:'Code Loader: EventManager: interruption state - "'+M+'" interruption status is false.',style:_OM.d?.warning??{}}])}_IF.state=0};_CL.isBlockLocked=P=>{return!Array.isArray(P)||P.length!==3||_BM.f(P)};_CL.reboot=()=>{if(!_OM.c){_EM.e.tick=_OM.h;_OM.a=0}else{api.broadcastMessage([{str:"Code Loader: BootManager: Wait until current running boot session is finished.",style:_OM.d?.warning??{}}])}};_CL.logBootResult=(W=!0,R=!0)=>{_OM.e(W,R)};_CL.logLoadTime=(R=!0)=>{_OM.f(R)};_CL.logErrors=()=>{_OM.g()}}
{let d=EM_.e={};d.tick=OM_.h;globalThis.tick=function(){d.tick()}}
try{EM_.i();let s=[CF_,CF_.boot_manager,CF_.block_manager,CF_.join_manager,CF_.event_manager,CF_.LOG_STYLE,IF_,EM_,TM_,JM_,BM_,OM_,CL_],f=[CF_.ACTIVE_EVENTS,CF_.EVENT_REGISTRY];s.forEach(o=>{Object.seal(o)});f.forEach(o=>{Object.freeze(o)});EM_.c=!0;OM_.a=0}catch(e){EM_.b=[e.name,e.message]}
globalThis.IF=IF_;
globalThis.CL=CL_;
void 0;

