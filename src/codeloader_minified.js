// Copyright (c) 2025 delfineonx
// This product includes "Codeloader" created by delfineonx.
// Licensed under the Apache License, Version 2.0 (the "License").

const Configuration={
ACTIVE_EVENTS:[
/* ... */
],
blocks:[
/* ... */
],
boot_manager:{
boot_delay_ms:200,
show_load_time:true,
show_errors:true,
},
block_manager:{
default_locked_status:true,
default_eval_status:true,
max_registrations_per_tick:32,
max_requests_per_tick:8,
max_evals_per_tick:16,
max_error_logs:32,
},
join_manager:{
reset_on_reboot:true,
max_dequeue_per_tick:8,
},
interruption_manager:{
is_enabled:false,
max_dequeue_per_tick:32,
default_retry_delay_ms:0,
default_retry_limit_ms:150,
default_retry_interval_ms:50,
default_retry_cooldown_ms:300,
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
}
};

const CF=Configuration,EM={I:null,N:null,d:null,A:null,a:null,u:null,E:null,t:0,r:0,P:!1,T:!1,e:!1,s_(){let S=this;if(!S.P){let I=S.I,l=!!CF.interruption_manager.is_enabled,R=I.R=CF.EVENT_REGISTRY,V=CF.ACTIVE_EVENTS,N=S.N=function(){},d=S.d,A=S.A=[],a=S.a={},u=S.u=[],p=I.d,O=I.N={},X=I.I={},D=p.D=I.D=[];I.U=new Int32Array(4);let Y=p.Y=I.Y=[],q=p.q=I.q=new Uint32Array(2),i=p.i=I.i=new Uint32Array(2),_=[null,null],x=0;for(let v of V){let e=R[v];if(void 0===e){u[u.length]=v;continue}A[A.length]=v;a[v]=!0;if("tick"!==v){_[0]=[];_[1]=e;e=R[v]=_[+Array.isArray(e)];let s=e[0]=!!e[0];if(l&s){I.a=!0;let c=x;X[v]=c;Y[c]=new Int32Array(6);let n=D[c]=[v,-1,new Array(9)],g=n[2];d[v]=O[v]=function(){I.setInterruptionState(v)};globalThis[v]=function(a0,a1,a2,a3,a4,a5,a6,a7,a8){q[c>>5]|=1<<(c&31);i[c>>5]|=1<<(c&31);n[1]=I.n;g[0]=a0;g[1]=a1;g[2]=a2;g[3]=a3;g[4]=a4;g[5]=a5;g[6]=a6;g[7]=a7;g[8]=a8;return d[v](a0,a1,a2,a3,a4,a5,a6,a7,a8)};x++}else{d[v]=N;globalThis[v]=function(a0,a1,a2,a3,a4,a5,a6,a7,a8){return d[v](a0,a1,a2,a3,a4,a5,a6,a7,a8)}}}}}},i_(){let S=this;if(!S.T){let _=[null,null],n=S.I.N,d=S.d,A=S.A,l=A.length,c=S.t;_[1]=S.N;while(c<l){let v=A[c];_[0]=n[v];let O=_[+(void 0===_[0])];Object.defineProperty(globalThis,v,{configurable:!0,set:F=>{d[v]=[O,F][+("function"===typeof F)]}});c=++S.t}S.T=c>=l}return S.T},e_(){if(!this.e){this.r=0;this.e=!0}},r_(){let S=this,_=[null,null],n=S.I.N,d=S.d,A=S.A,l=A.length,c=S.r;_[1]=S.N;while(c<l){let v=A[c];if("tick"!==v){_[0]=n[v];d[v]=_[+(void 0===_[0])]}c=++S.r}return c>=l}},IM={N:null,I:null,D:null,R:null,U:null,Q:1,n:-1,Y:null,q:null,i:null,s:0,a:!1,e:!1,e_(){let S=this;if(!S.e){let C=CF.interruption_manager,U=S.U,d=(0|C.default_retry_delay_ms)*.02|0;U[0]=d&~(d>>31);let l=(0|C.default_retry_limit_ms)*.02|0;U[1]=l&~(l>>31);let i=(0|C.default_retry_interval_ms)*.02|0;U[2]=i&~(i>>31);let w=(0|C.default_retry_cooldown_ms)*.02|0;U[3]=(w&~(w>>31))+(-w>>31)+1;let Q=0|C.max_dequeue_per_tick;S.Q=(Q&~(Q>>31))+(-Q>>31)+1;S.n=0;S.q[0]=0;S.q[1]=0;S.i[0]=0;S.i[1]=0;S.s=0;S.e=!0}},s_(){let S=this,_=[null,null],D=S.D,R=S.R,U=S.U,Y=S.Y,l=Y.length,c=S.s;while(c<l){let v=D[c][0],r=R[v],y=Y[c];y[0]=0;y[1]=0;let e=r[1],d=(0|e)*.02|0;_[0]=d&~(d>>31);_[1]=U[0];y[2]=_[void 0===e|null===e];let n=r[2],m=(0|n)*.02|0;_[0]=m&~(m>>31);_[1]=U[1];y[3]=_[void 0===n|null===n];let j=r[3],i=(0|j)*.02|0;_[0]=i&~(i>>31);_[1]=U[2];y[4]=_[void 0===j|null===j];let x=r[4],w=(0|x)*.02|0;_[0]=(w&~(w>>31))+(-w>>31)+1;_[1]=U[3];y[5]=_[void 0===x|null===x];c=++S.s}return c>=l},setInterruptionState(v){let x=this.I[v];this.q[x>>5]&=~(1<<(31&x));this.i[x>>5]&=~(1<<(31&x))},d:{E:null,B:null,D:null,Y:null,q:null,i:null,n:0,u:0,w:0,b:0,d:null,y:null,get 1(){let s=this;s.b=s.i[s.w]&-s.i[s.w];let x=s.w<<5|31-Math.clz32(s.b);s.d=s.D[x];let y=s.y=s.Y[x],_=1;_^=s[_*(s.n-s.d[1]<=y[2])*2];_^=s[_*(y[1]>=s.n)*3];_^=s[_*(y[0]>=y[3])*4];_^=s[_*!(y[0]%(y[4]+1))*5];s[_*6];s[!!s.i[s.w]&s.u>0]},get 2(){this.i[this.w]&=~this.b;return 1},get 3(){this.q[this.w]&=~this.b;this.i[this.w]&=~this.b;return 1},get 4(){let s=this,y=s.y,r=(y[3]+y[4])/(y[4]+1)|0;if(r>1){api.broadcastMessage([{str:`Codeloader: InterruptionManager: "${s.d[0]}" has been dropped after ${r} consecutive interrupted retry ticks.`,style:s.B.g?.e??{}}])}let a=s.d[2];a[0]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=void 0;y[0]=0;y[1]=s.n+y[5];s.q[s.w]&=~s.b;s.i[s.w]&=~s.b;return 1},get 5(){let s=this;s.y[0]++;let a=s.d[2];s.E.d[s.d[0]].apply(null,a);a[0]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=void 0;s.y[0]=0;s.u--;return 1},get 6(){this.y[0]++;this.i[this.w]&=~this.b;return 1}},q_(){let s=this;if(s.q[0]|s.q[1]){let d=s.d;d.n=s.n;d.u=s.Q;let w=d.w=0;while(w<2){s.i[w]|=s.q[w];d[!!s.i[w]&d.u>0];w=++d.w}}}},TM={E:null,I:null,B:null,b:null,i:null,m:null,e:!1,t:!1,f:!1,e_(){let S=this;if(!S.e){let N=S.E.N;S.b=N;S.i=N;S.m=N;S.t=!1;S.f=!1;S.e=!0}},d_(){TM.b();TM.i();TM.m()},t_(){TM.I.n++;TM.m();TM.I.q_()},i_(){let S=this;if(!S.t){let N=S.E.N,d=S.E.d;Object.defineProperty(globalThis,"tick",{configurable:!0,set:F=>{S.m=[N,F][+("function"===typeof F)]}});S.b=d.tick;d.tick=S.d_;S.t=!0}},f_(){let S=this;if(!S.f){let N=S.E.N,d=S.E.d;if(!S.I.a){Object.defineProperty(globalThis,"tick",{configurable:!0,set:F=>{d.tick=[N,F][+("function"===typeof F)]}}),d.tick=S.m}else{d.tick=S.t_}S.b=N;S.i=N;S.f=!0}}},JM={E:null,B:null,I:null,r:!0,q:1,m:null,b:null,j:null,d:0,e:!1,t:!1,f:!1,J:{N:0,Q:1,P:2},e_(){let S=this;if(!S.e){let C=CF.join_manager;S.r=!!C.reset_on_reboot;let q=0|C.max_dequeue_per_tick;S.q=(q&~(q>>31))+(-q>>31)+1;S.m=S.E.N;S.b=[];S.j=[S.j,{}][S.r|!S.j];S.d=0;S.t=!1;S.f=!1;S.e=!0}},s_(){let S=this;if(S.r|S.B.P){let l=api.getPlayerIds(),b=S.b,j=S.j,N=S.J.N,Q=S.J.Q;for(let p of l){if((0|j[p])===N){b[b.length]=[p,!1];j[p]=Q}}}return!0},d_(p,r){JM.b[JM.b.length]=[p,r];JM.j[p]=JM.J.Q},i_(){let S=this;if(!S.t){S.E.d.onPlayerJoin=S.d_;let n=S.I.N.onPlayerJoin,N=[n,S.E.N][+(void 0===n)];Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:F=>{S.m=[N,F][+("function"===typeof F)]}});S.t=!0}},q_(){let S=this,m=S.m,b=S.b,j=S.j,P=S.J.P,u=S.q,c=S.d;while(c<b.length&u>0){let a=b[c],p=a[0];if(j[p]!==P){m(p,a[1]);j[p]=P;u--}c=++S.d}return c>=b.length},f_(){let S=this;if(!S.f){let n=S.I.N.onPlayerJoin,N=[n,S.E.N][+(void 0===n)],d=S.E.d;d.onPlayerJoin=S.m;Object.defineProperty(globalThis,"onPlayerJoin",{configurable:!0,set:F=>{d.onPlayerJoin=[N,F][+("function"===typeof F)]}});S.f=!0}}},BM={B:null,b:null,k:!0,v:!0,G:1,R:1,V:1,O:0,h:-1,K:null,L:null,Q:null,E:null,N:!1,g:0,r:0,a:0,e:!1,T:{U:0,R:1,D:2},e_(){let S=this;if(!S.e){S.b=Array.isArray(CF.blocks)?CF.blocks.slice():[];let C=CF.block_manager;S.k=!!C.default_locked_status;S.v=!!C.default_eval_status;let G=0|C.max_registrations_per_tick;S.G=(G&~(G>>31))+(-G>>31)+1;let R=0|C.max_requests_per_tick;S.R=(R&~(R>>31))+(-R>>31)+1;let V=0|C.max_evals_per_tick;S.V=(V&~(V>>31))+(-V>>31)+1;let O=0|C.max_error_logs;S.O=O&~(O>>31);S.h=1;S.K={};S.L={};S.Q=[];S.E=[];S.N=!1;S.g=0;S.r=0;S.a=0;S.e=!0}},m_(){BM[BM.h]},get 1(){let S=this,_=[null,null],b=S.b,k=S.k,v=S.v,K=S.K,L=S.L,Q=S.Q,n=b.length,u=S.G,c=S.g;while(c<n&u>0){let B=b[c]=b[c].slice(),x=B[0]=(B[0]|0)-(B[0]<(B[0]|0)&1),y=B[1]=(B[1]|0)-(B[1]<(B[1]|0)&1),z=B[2]=(B[2]|0)-(B[2]<(B[2]|0)&1),i=x+"|"+y+"|"+z;_[0]=!!B[3];_[1]=k;K[i]=B[3]=_[void 0===B[3]|null===B[3]];_[0]=!!B[4];_[1]=v;let V=B[4]=_[void 0===B[4]|null===B[4]];if(V){let l=api.isBlockInLoadedChunk(x,y,z),i=(x>>5)+"|"+(y>>5)+"|"+(z>>5);if(void 0===L[i]){L[i]=l<<1;if(!l){Q[Q.length]=[i,x>>5<<5,y>>5<<5,z>>5<<5]}}S.N=!0}u--;c=++S.g}S.h=1+(c>=n)*(!S.N+1)},get 2(){let S=this,L=S.L,R=S.T.R,D=S.T.D;{let Q=S.Q,n=Q.length,u=S.R,c=S.r;while(c<n&u>0){let e=Q[c],i=e[0];if(1===api.getBlockId(e[1],e[2],e[3])){L[i]=R}else{L[i]=D;c===S.r&&S.r++}u--;c++}}{let b=S.b,O=S.O,E=S.E,n=b.length,u=S.V,c=S.a;while(c<n&u>0){let B=b[c];if(!B[4]){c=++S.a;continue}let x=B[0],y=B[1],z=B[2],i=(x>>5)+"|"+(y>>5)+"|"+(z>>5);if(L[i]!==D){break}try{let C=api.getBlockData(x,y,z)?.persisted?.shared?.text;(0,eval)(C)}catch(e){if(E.length<O){E[E.length]=[x,y,z,e.name,e.message]}}c=++S.a;u--}}S.h=2+(S.a>=S.b.length)},isBlockLocked(p){let x=(p[0]|0)-(p[0]<(p[0]|0)&1),y=(p[1]|0)-(p[1]<(p[1]|0)&1),z=(p[2]|0)-(p[2]<(p[2]|0)&1),i=x+"|"+y+"|"+z,k=this.K[i];return!!(!this.B.R&[!!k,!0][+(void 0===k)])}},OM={E:null,I:null,T:null,J:null,B:null,d:0,l:!0,e:!0,g:null,h:-1,n:-1,t:-1,P:!0,R:!1,tick(){OM.n++;OM[OM.h]},get 12(){let S=this;if(S.P){if(!S.E.P&S.n>=10){let e=S.E.E,o=`Codeloader: EventManager: ${null===e?"Undefined e":"E"}rror on events primary setup${null===e?".":` - ${e[0]}: ${e[1]}.`}`,l=api.getPlayerIds();for(let p of l){if(api.playerIsInGame(p)){api.kickPlayer(p,o)}}}}},get 1(){let S=this;if(!S.R){S.n=0;let C=CF.boot_manager,d=(0|C.boot_delay_ms)*.02|0;S.d=d&~(d>>31);S.l=!!C.show_load_time;S.e=!!C.show_errors;S.g={e:Object.assign({},CF.LOG_STYLE.error),w:Object.assign({},CF.LOG_STYLE.warning),s:Object.assign({},CF.LOG_STYLE.success)};S.t=-1;S.E.e=!1;S.I.e=!1;S.T.e=!1;S.J.e=!1;S.B.e=!1;S.R=!0;S.h=2;S[S.h]}},get 2(){let S=this;S.h=2+(S.n>=S.d);S[S.h*(S.n>=S.d)]},get 3(){let S=this;S.E.e_();S.I.e_();S.T.e_();S.J.e_();S.B.e_();S.h=4},get 4(){let S=this,c=1;if(S.P){c&=S.E.i_()}if(c&&S.E.r_()){S.h=5;S[S.h]}},get 5(){let S=this,c=1;if(S.I.a){c&=S.I.s_()}if(S.E.a.onPlayerJoin){c&=S.J.s_()}S.h=5+c;S[S.h*c]},get 6(){if(this.E.a.onPlayerJoin){this.J.i_()}this.T.i_();this.h=7},get 7(){this.T.i=this.B.m_;this.h=8},get 8(){if(3===this.B.h){this.h=8+(1+!this.E.a.onPlayerJoin);this[this.h]}},get 9(){if(this.J.q_()){this.h=10;this[this.h]}},get 10(){let S=this;if(S.E.a.onPlayerJoin){S.J.f_()}S.T.f_();S.B.h=-1;S.P=!1;S.R=!1;S.h=-1;S.t=S.n-S.d+1;S.r_(S.l,S.e)},r_(l,e){let u=this.E.u;if(u.length){api.broadcastMessage([{str:`Codeloader: EventManager: Unregistered callbacks: ${u.join(", ")}.`,style:this.g?.w??{}}])}l&&this.l_(e);e&&this.e_()},l_(e){let t=50*this.t,c=this.B.E.length,o=`Codeloader: BootManager: Code was loaded in ${t} ms`+[`.`,` with ${c} error${c===1?"":"s"}.`][+e];api.broadcastMessage([{str:o,style:[this.g?.s,this.g?.w][+(c>0)]??{}}])},e_(){let E=this.B.E;if(E.length>0){let o=`Codeloader: BlockManager: Code evaluation error${1===E.length?"":"s"}: `;for(const e of E){o+=`\n${e[3]} at (${e[0]}, ${e[1]}, ${e[2]}): ${e[4]} `}api.broadcastMessage([{str:o,style:this.g?.e??{}}])}}},CL=globalThis.Codeloader={event_manager:null,interruption_manager:null,tick_multiplexer:null,join_manager:null,block_manager:null,boot_manager:null,configuration:null,get isRunning(){return OM.R},setInterruptionState(v){let x=IM.I[v];if(void 0===x){if(EM.a[v]){api.broadcastMessage([{str:`Codeloader: InterruptionManager: setInterruptionState - "${v}" interruption status is false.`,style:OM.g?.w??{}}])}else{api.broadcastMessage([{str:`Codeloader: InterruptionManager: setInterruptionState - "${v}" is invalid active event name.`,style:OM.g?.e??{}}])}return}IM.setInterruptionState(v)},isBlockLocked(p){return!Array.isArray(p)||3!==p.length||BM.isBlockLocked(p)},reboot(){if(!OM.R){EM.d.tick=OM.tick;OM.h=1}else{api.broadcastMessage([{str:"Codeloader: BootManager: Wait until current running boot session is finished.",style:OM.g?.w??{}}])}},logBootResult(l=!0,e=!0){OM.r_(l,e)},logLoadTime(e=!0){OM.l_(e)},logErrors(){OM.e_()}};EM.I=IM;IM.d.E=EM;IM.d.B=OM;TM.E=EM;TM.I=IM;TM.B=OM;JM.E=EM;JM.I=IM;JM.B=OM;BM.B=OM;OM.E=EM;OM.I=IM;OM.T=TM;OM.J=JM;OM.B=BM;CL.configuration=CF;CL.event_manager=EM;CL.interruption_manager=IM;CL.tick_multiplexer=TM;CL.join_manager=JM;CL.block_manager=BM;CL.boot_manager=OM;{let d=EM.d={};EM.t=0;EM.P=!1;EM.T=!1;OM.h=12;OM.P=!0;OM.R=!1;OM.n=0;d.tick=OM.tick;globalThis.tick=function(){d.tick()}}try{EM.s_();[CF,CF.boot_manager,CF.block_manager,CF.join_manager,CF.interruption_manager,CF.LOG_STYLE,EM,IM,TM,JM,BM,OM].forEach(o=>{Object.seal(o)});[CF.ACTIVE_EVENTS,CF.EVENT_REGISTRY,CL].forEach(o=>{Object.freeze(o)});EM.P=!0;OM.h=1}catch(e){EM.E=[e.name,e.message]}
void 0;

