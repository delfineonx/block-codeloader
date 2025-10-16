// Copyright (c) 2025 delfineonx
// This product includes "Codeloader" created by delfineonx.
// Licensed under the Apache License, Version 2.0 (the "License").

const CF=Object.seal({
  ACTIVE_EVENTS:Object.freeze([
    /* ... */
  ]),
  blocks:[
    /* ... */
  ],
  boot_manager:Object.seal({
    boot_delay_ms:200,
    show_load_time:true,
    show_errors:true
  }),
  join_queue:Object.seal({
    reset_on_reboot:true,
    max_dequeue_per_tick:8
  }),
  block_initializer:Object.seal({
    default_locked_status:true,
    default_eval_status:true,
    max_registrations_per_tick:32,
    max_evals_per_tick:16,
    max_error_logs:32
  }),
  interruption_manager:Object.seal({
    is_enabled:false,
    max_dequeue_per_tick:16,
    default_retry_delay_ms:0,
    default_retry_limit_ms:50,
    default_retry_interval_ms:0,
    default_retry_cooldown_ms:1000
  }),
  EVENT_REGISTRY:Object.seal({
    tick:null,
    onClose:[!0],
    onPlayerJoin:[!0],
    onPlayerLeave:[!0],
    onPlayerJump:[!0],
    onRespawnRequest:[!1],
    playerCommand:[!0],
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
    doPeriodicSave:[!0]
  }),
  LOG_STYLE:Object.seal({
    error:{
      color:"#ff9d87",
      fontWeight:"600",
      fontSize:"1rem"
    },
    warning:{
      color:"#fcd373",
      fontWeight:"600",
      fontSize:"1rem"
    },
    success:{
      color:"#2eeb82",
      fontWeight:"600",
      fontSize:"1rem"
    }
  })
});

const TM={
  B:null,
  I:null,
  b:null,
  i:null,
  m:null,
  s:!1,
  t:!1,
  f:!1,
  s_(){
    if(!this.s){
      this.b=this.B.N;
      this.i=this.B.N;
      this.m=this.B.N;
      this.t=!1;
      this.f=!1;
      this.s=!0
    }
  },
  d_(){
    let s=TM;
    s.b();
    s.i();
    s.m()
  },
  t_(){
    let t=TM;
    t.I.n++;
    t.m();
    t.I.q_()
  },
  i_(){
    if(!this.t){
      this.m=globalThis._tick;
      let s=this;
      Object.defineProperty(globalThis,"_tick",{
        configurable:!0,
        get:()=>s.d_,
        set(F){s.m="function"===typeof F?F:s.B.N}
      });
      this.b=this.m;
      this.m=this.B.N;
      this.t=!0
    }
  },
  f_(){
    if(!this.f){
      this.I.a?
      Object.defineProperty(globalThis,"_tick",{
        value:this.t_,
        writable:!0,
        configurable:!0
      }):
      Object.defineProperty(globalThis,"_tick",{
        value:this.m,
        writable:!0,
        configurable:!0
      });
      this.b=this.B.N;
      this.i=this.B.N;
      this.f=!0
    }
  }
},
CM={
  B:null,
  I:null,
  i:null,
  m:null,
  s:!1,
  t:!1,
  f:!1,
  s_(){
    if(!this.s){
      this.i=this.B.N;
      this.m=this.B.N;
      this.t=!1;
      this.f=!1;
      this.s=!0
    }
  },
  d_(d,c,p){
    let s=CM;
    s.i(d);
    return s.m(d,c,p)
  },
  i_(){
    if(!this.t){
      let s=this,
      N=this.I.N.onChunkLoaded??this.B.N;
      Object.defineProperty(globalThis,"_onChunkLoaded",{
        configurable:!0,
        get:()=>s.d_,
        set(F){s.m="function"===typeof F?F:N}
      });
      this.t=!0
    }
  },
  f_(){
    if(!this.f){
      Object.defineProperty(globalThis,"_onChunkLoaded",{
        value:this.m,
        writable:!0,
        configurable:!0
      });
      this.i=this.B.N;
      this.f=!0
    }
  }
},
JQ={
  B:null,
  I:null,
  m:null,
  s:!1,
  t:!1,
  f:!1,
  r:!0,
  q:1,
  b:null,
  j:null,
  c:0,
  J:{
    N:0,
    Q:1,
    P:2
  },
  s_(){
    if(!this.s){
      this.m=this.B.N;
      let C=CF.join_queue;
      this.r=!!C.reset_on_reboot;
      let q=0|C.max_dequeue_per_tick;
      this.q=(q&~(q>>31))+(-q>>31)+1;
      this.b=[];
      this.r?(this.j={}):(this.j||(this.j={}));
      this.c=0;
      this.t=!1;
      this.f=!1;
      this.s=!0
    }
  },
  e_(){
    if(this.r||this.B.P){
      let l=api.getPlayerIds(),
      b=this.b,
      j=this.j,
      N=this.J.N,
      Q=this.J.Q;
      for(let p of l){
        if((0|j[p])===N){
          b[b.length]=[p,!1];
          j[p]=Q
        }
      }
    }
    return!0
  },
  d_(p,r){
    let s=JQ;
    s.b[s.b.length]=[p,r];
    s.j[p]=s.J.Q
  },
  i_(){
    if(!this.t){
      let s=this,
      N=this.I.N.onPlayerJoin??this.B.N;
      Object.defineProperty(globalThis,"_onPlayerJoin",{
        configurable:!0,
        get:()=>s.d_,
        set(F){s.m="function"==typeof F?F:N}
      });
      this.t=!0
    }
  },
  q_(){
    let m=this.m,
    b=this.b,
    j=this.j,
    P=this.J.P,
    g=this.q,
    c=this.c;
    while(c<b.length&&g>0){
      let a=b[c],
      p=a[0],
      r=a[1];
      if(j[p]!==P){
        m(p,r);
        j[p]=P;
        g--
      }
      c=++this.c
    }
    return c>=b.length
  },
  f_(){
    if(!this.f){
      Object.defineProperty(globalThis,"_onPlayerJoin",{
        value:this.m,
        writable:!0,
        configurable:!0
      });
      this.f=!0
    }
  }
},
BI={
  B:null,
  s:!1,
  b:null,
  k:!0,
  v:!0,
  R:1,
  V:1,
  G:0,
  h:-1,
  K:null,
  D:null,
  L:null,
  E:null,
  c:0,
  C:0,
  n:-1,
  t:{
    q:0,
    n:0,
    v:0
  },
  O:19,
  X:5,
  S:{
    U:0,
    Q:1,
    N:2,
    O:3
  },
  F:(0,eval),
  s_(){
    if(!this.s){
      this.b=Array.isArray(CF.blocks)?CF.blocks.slice():[];
      let C=CF.block_initializer;
      this.k=!!C.default_locked_status;
      this.v=!!C.default_eval_status;
      let R=0|C.max_registrations_per_tick;
      this.R=(R&~(R>>31))+(-R>>31)+1;
      let V=0|C.max_evals_per_tick;
      this.V=(V&~(V>>31))+(-V>>31)+1;
      let G=0|C.max_error_logs;
      this.G=G&~(G>>31);
      this.h=0;
      this.K={};
      this.D=new Array(this.b.length);
      this.L={};
      this.E=[];
      this.c=0;
      this.C=0;
      this.n=this.b.length-1;
      this.t.q=0;
      this.t.n=0;
      this.t.v=0;
      this.s=!0
    }
  },
  t_(){
    if(0===this.h)return this.e_();
    if(1===this.h)this.m_()
  },
  e_(){
    let b=this.b,
    k=this.k,
    v=this.v,
    K=this.K,
    D=this.D,
    L=this.L,
    n=this.n,
    O=this.O,
    X=this.X,
    N=O-X,
    g=this.R,
    c=this.c;
    while(c<=n&&g>0){
      let B=b[c]=b[c].slice(),
      x=B[0]=(0|B[0])-((B[0]<(0|B[0]))&1),
      y=B[1]=(0|B[1])-((B[1]<(0|B[1]))&1),
      z=B[2]=(0|B[2])-((B[2]<(0|B[2]))&1),
      m=(((x>>X)+(1<<N))*(1<<(N+1))+((y>>X)+(1<<N)))*(1<<(N+1))+((z>>X)+(1<<N)),
      e=K[m];
      e||(e=K[m]={});
      let M=((x&((1<<X)-1))<<(2*X))|((y&((1<<X)-1))<<X)|(z&((1<<X)-1));
      (void 0===B[3]||null===B[3])?e[M]=B[3]=k:e[M]=B[3]=!!B[3];
      let V=(void 0===B[4]||null===B[4])?B[4]=v:B[4]=!!B[4],
      d=(x>>5)+"|"+(y>>5)+"|"+(z>>5);
      D[c]=d;
      if(V){
        let s=api.isBlockInLoadedChunk(x,y,z);
        L[d]=(s<<1)|s
      }
      g--;
      c=++this.c
    }
    if(c>n){
      this.h=!(n+1)+1
    }
  },
  m_(){
    let b=this.b,
    G=this.G,
    D=this.D,
    L=this.L,
    E=this.E,
    n=this.n,
    t=this.t,
    Q=this.S.Q,
    N=this.S.N,
    O=this.S.O,
    F=this.F,
    g=this.V,
    C=this.C;
    while(C<=n&&g>0){
      let B=b[C];
      if(!B[4]){
        C=++this.C;
        continue
      }
      let x=B[0],
      y=B[1],
      z=B[2],
      d=D[C],
      l=L[d];
      if(l===O){
        try{
          let c=api.getBlockData(x,y,z)?.persisted?.shared?.text;
          F(c)
        }catch(e){
          if(E.length<G){
            E[E.length]=[x,y,z,e.name,e.message]
          }
        }
        t.v++;
        g--;
        C=++this.C;
        continue
      }
      if(l===N){
        L[d]=O;
        continue
      }
      if(l===Q){
        if(api.isBlockInLoadedChunk(x,y,z)){
          L[d]=N;
          t.n++;
          continue
        }
        break
      }
      api.getBlock(x,y,z);
      L[d]=Q;
      t.q++;
      break
    }
    if(C>n){
      this.h=2
    }
  },
  c_(d){
    let l=this.L[d];
    if(l===this.S.Q||l===this.S.U){
      this.L[d]=this.S.N;
      this.t.n++
    }
  },
  k_(p){
    let x=(0|p[0])-((p[0]<(0|p[0]))&1),
    y=(0|p[1])-((p[1]<(0|p[1]))&1),
    z=(0|p[2])-((p[2]<(0|p[2]))&1),
    O=this.O,
    X=this.X,
    N=O-X,
    m=(((x>>X)+(1<<N))*(1<<(N+1))+((y>>X)+(1<<N)))*(1<<(N+1))+((z>>X)+(1<<N)),
    M=((x&((1<<X)-1))<<(2*X))|((y&((1<<X)-1))<<X)|(z&((1<<X)-1));
    return !this.B.R&&!!(this.K[m]?.[M]??!0)
  }
},
IM={
  a:!1,
  B:null,
  N:null,
  s:!1,
  I:null,
  D:null,
  R:null,
  U:null,
  Y:null,
  n:-1,
  i:null,
  q:null,
  Q:1,
  c:0,
  t:{
    C:0,
    T:1,
    D:2,
    L:3,
    I:4,
    W:5,
    R:-1,
    Y:-2
  },
  d:{
    N:0,
    T:1,
    A:2
  },
  s_(){
    if(!this.s){
      this.R=CF.EVENT_REGISTRY;
      let C=CF.interruption_manager,
      U=this.U,
      t=this.t,
      O=t.Y,
      d=((0|C.default_retry_delay_ms)*.02)|0;
      U[t.D+O]=d&~(d>>31);
      let l=((0|C.default_retry_limit_ms)*.02)|0;
      U[t.L+O]=l&~(l>>31);
      let i=((0|C.default_retry_interval_ms)*.02)|0;
      U[t.I+O]=i&~(i>>31);
      let w=((0|C.default_retry_cooldown_ms)*.02)|0;
      U[t.W+O]=(w&~(w>>31))+(-w>>31)+1;
      this.n=0;
      this.i[0]=0;
      this.i[1]=0;
      this.q[0]=0;
      this.q[1]=0;
      let Q=0|C.max_dequeue_per_tick;
      this.Q=(Q&~(Q>>31))+(-Q>>31)+1;
      this.c=0;
      this.s=!0
    }
  },
  e_(){
    let D=this.D,
    R=this.R,
    U=this.U,
    Y=this.Y,
    t=this.t,
    E=t.C,
    V=t.T,
    F=t.D,
    M=t.L,
    J=t.I,
    X=t.W,
    S=t.R,
    Z=t.Y,
    N=this.d.N,
    l=Y.length,
    c=this.c;
    while(c<l){
      let e=D[c][N],
      r=R[e],
      y=Y[c];
      y[E]=0;
      y[V]=0;
      let f=r[F+S];
      if(void 0===f||null===f)y[F]=U[F+Z];
      else{
        let d=((0|f)*.02)|0;
        y[F]=d&~(d>>31)
      }
      let m=r[M+S];
      if(void 0===m||null===m)y[M]=U[M+Z];
      else{
        let l=((0|m)*.02)|0;
        y[M]=l&~(l>>31)
      }
      let j=r[J+S];
      if(void 0===j||null===j)y[J]=U[J+Z];
      else{
        let i=((0|j)*.02)|0;
        y[J]=i&~(i>>31)
      }
      let x=r[X+S];
      if(void 0===x||null===x)y[X]=U[X+Z];
      else{
        let w=((0|x)*.02)|0;
        y[X]=(w&~(w>>31))+(-w>>31)+1
      }
      c=++this.c
    }
    return c>=l
  },
  i_(x){
    this.q[x>>5]&=~(1<<(31&x));
    this.i[x>>5]&=~(1<<(31&x))
  },
  q_(){
    let q=this.q;
    if(!q[0]&&!q[1]){return}
    let D=this.D,
    Y=this.Y,
    n=this.n,
    i=this.i,
    t=this.t,
    E=t.C,
    U=t.T,
    F=t.D,
    M=t.L,
    J=t.I,
    X=t.W,
    e=this.d,
    N=e.N,
    T=e.T,
    A=e.A,
    g=this.Q,
    w=0;
    while(w<2){
      i[w]|=q[w];
      while(i[w]&&g>0){
        let b=i[w]&-i[w],
        x=(w<<5)|(31-Math.clz32(b)),
        d=D[x],
        y=Y[x];
        if(n-d[T]<=y[F]){
          i[w]&=~b;
          continue
        }
        if(y[U]>=n){
          q[w]&=~b;
          i[w]&=~b;
          continue
        }
        if(y[E]>=y[M]){
          let r=((y[M]+y[J])/(y[J]+1))|0;
          if(r>1){
            api.broadcastMessage([{
              str:`Codeloader: InterruptionManager: "${d[N]}" has been dropped after ${r} consecutive interrupted retry ticks.`,
              style:this.B.g?.e??{}
            }])
          }
          let a=d[A];
          a[0]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=void 0;
          y[E]=0;
          y[U]=n+y[X];
          q[w]&=~b;
          i[w]&=~b;
          continue
        }
        if(!(y[E]%(y[J]+1))){
          y[E]++;
          let a=d[A];
          if(a){
            let f="_"+d[N];
            globalThis[f].apply(null,a);
            a[0]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=void 0
          }
          y[E]=0;
          g--;
          continue
        }
        y[E]++;
        i[w]&=~b
      }
      w++
    }
  }
},
BM={
  P:!0,
  N:null,
  a:null,
  u:null,
  E:null,
  S:!1,
  d:0,
  l:!0,
  e:!0,
  g:null,
  R:!1,
  h:-1,
  n:-1,
  t:-1,
  tick(){
    this.n++;
    if(0===this.h){
      this.s_()
    }
    if(1===this.h){
      this.w_()
    }
    if(2===this.h){
      this.u_()
    }
    if(3===this.h){
      return this.e_()
    }
    if(4===this.h){
      return this.i_()
    }
    if(5===this.h){
      return this.n_()
    }
    if(6===this.h){
      this.q_()
    }
    if(7===this.h){
      this.t_()
    }
    if(8===this.h){
      this.f_()
    }
  },
  s_(){
    if(!this.R){
      this.R=!0;
      this.n=0;
      if(!this.S){
        let e=this.E,
        G=`Codeloader: BootManager: ${null==e?"Uncaught e":"E"}rror on events primary setup${null==e?".":` - ${e[0]}: ${e[1]}.`}`,
        l=api.getPlayerIds();
        for(let p of l){
          api.kickPlayer(p,G)
        }
        return
      }
      let C=CF.boot_manager,
      d=((0|C.boot_delay_ms)*.02)|0;
      this.d=d&~(d>>31);
      this.l=!!C.show_load_time;
      this.e=!!C.show_errors;
      this.g={
        e:Object.assign({},CF.LOG_STYLE.error),
        w:Object.assign({},CF.LOG_STYLE.warning),
        s:Object.assign({},CF.LOG_STYLE.success)
      };
      this.t=-1;
      TM.s=!1;
      CM.s=!1;
      JQ.s=!1;
      BI.s=!1;
      IM.s=!1;
      this.h=1
    }
  },
  w_(){
    if(this.n>=this.d){
      this.h=2
    }
  },
  u_(){
    TM.s_();
    CM.s_();
    JQ.s_();
    BI.s_();
    IM.s_();
    this.h=3
  },
  e_(){
    let c=!0;
    if(this.a.onPlayerJoin){
      c&&=JQ.e_()
    }
    if(IM.a){
      c&&=IM.e_()
    }
    if(c){
      this.h=4
    }
  },
  i_(){
    if(this.a.onPlayerJoin){
      JQ.i_()
    }
    CM.i_();
    TM.i_();
    this.h=5
  },
  n_(){
    TM.i=function(){
      BI.t_()
    };
    CM.i=function(d){
      BI.c_(d)
    };
    this.h=6
  },
  q_(){
    if(2===BI.h){
      CM.f_();
      if(this.a.onPlayerJoin&&JQ.t)this.h=7;
      else{this.h=8}
    }
  },
  t_(){
    if (JQ.q_()){
      this.h=8
    }
  },
  f_(){
    if(this.a.onPlayerJoin){
      JQ.f_()
    }
    TM.f_();
    this.t=this.n-this.d+1;
    BI.h=-1;
    this.h=-1;
    this.R=!1;
    this.R_(this.l,this.e)
  },
  R_(l,e){
    this.u.length&&api.broadcastMessage([{
      str:`Codeloader: BootManager: Unregistered callbacks: ${this.u.join(", ")}.`,
      style:this.g?.w??{}
    }]);
    l&&this.T_(e);
    e&&this.E_()
  },
  T_(e){
    let t=50*this.t,
    c=BI.E.length,
    G=`Codeloader: BootManager: Code was loaded in ${t} ms`;
    e?G+=` with ${c} error${1===c?"":"s"}.`:G+=".";
    api.broadcastMessage([{
      str:G,
      style:(c>0?this.g?.w:this.g?.s)??{}
    }])
  },
  E_(){
    let E=BI.E;
    if(E.length>0){
      let G=`Codeloader: BlockInitializer: Code evaluation error${1===E.length?"":"s"}: `;
      for(let e of E){
        G+=`\n${e[3]} at (${e[0]}, ${e[1]}, ${e[2]}): ${e[4]} `
      }
      api.broadcastMessage([{
        str:G,
        style:this.g?.e??{}
      }])
    }
  },
  P_(){
    if(this.S){return}
    this.P=!0;
    this.R=!1;
    let e=!!CF.interruption_manager.is_enabled,
    R=CF.EVENT_REGISTRY,
    A=CF.ACTIVE_EVENTS,
    N=this.N=function(){},
    a=this.a={},
    u=this.u=[],
    I=IM;
    I.N={};
    I.U=new Int32Array(4);
    let i=I.i=new Uint32Array(2),
    q=I.q=new Uint32Array(2),
    J=I.I={},
    D=I.D=[],
    Y=I.Y=[],
    x=0;
    for(let m of A){
      if(!Object.hasOwn(R,m)){
        u[u.length]=m;
        continue
      }
      a[m]=!0;
      if("tick"!==m){
        let f="_"+m,
        s=!!R[m][0];
        if(e&&s){
          I.a=!0;
          let X=x;
          J[m]=X;
          Y[X]=new Int32Array(6);
          let d=D[X]=[m,-1,new Array(9)],
          a=d[2];
          globalThis[f]=I.N[m]=function(){I.i_(X)};
          globalThis[m]=function(a0,a1,a2,a3,a4,a5,a6,a7,a8){
            q[X>>5]=i[X>>5]|=1<<(31&X);
            d[1]=I.n;
            a[0]=a0;
            a[1]=a1;
            a[2]=a2;
            a[3]=a3;
            a[4]=a4;
            a[5]=a5;
            a[6]=a6;
            a[7]=a7;
            a[8]=a8;
            return globalThis[f](a0,a1,a2,a3,a4,a5,a6,a7,a8)
          };
          x++
        }else{
          globalThis[f]=N;
          globalThis[m]=function(a0,a1,a2,a3,a4,a5,a6,a7,a8){
            return globalThis[f](a0,a1,a2,a3,a4,a5,a6,a7,a8)
          }
        }
      }
    }
    if(!a.onChunkLoaded){
      globalThis._onChunkLoaded=N;
      globalThis.onChunkLoaded=function(a0,a1,a2){
        return globalThis._onChunkLoaded(a0,a1,a2)
      }
    }
    this.S=!0
  }
};
globalThis.Codeloader=Object.freeze({
  get configuration(){
    return CF
  },
  get isRunning(){
    return BM.R;
  },
  get errors(){
    return BI.E.slice()
  },
  setInterruptionState(m){
    let x=IM.I[m];
    if(void 0===x){
      BM.a[m]?
      api.broadcastMessage([{
        str:`Codeloader: InterruptionManager: setInterruptionState - "${m}" interruption status is false.`,
        style:BM.g?.w??{}
      }]):
      api.broadcastMessage([{
        str:`Codeloader: InterruptionManager: setInterruptionState - "${m}" is invalid active event name.`,
        style:BM.g?.e??{}
      }]);
      return
    }
    IM.i_(x)
  },
  isBlockLocked(p){
    return !Array.isArray(p)||3!==p.length||BI.k_(p)
  },
  reboot(){
    let B=BM;
    !B.R?
    (
      B.P=!1,
      B.h=0,
      globalThis._tick=function(){
        B.tick()
      }
    ):
    api.broadcastMessage([{
      str:"Codeloader: BootManager: Wait until current running boot session is finished.",
      style:B.g?.w??{}
    }])
  },
  logBootResult(l=!0,e=!0){
    BM.R_(l,e)
  },
  logLoadTime(e=!0){
    BM.T_(e)
  },
  logErrors(){
    BM.E_()
  }
});
TM.B=BM;
TM.I=IM;
CM.B=BM;
CM.I=IM;
JQ.B=BM;
JQ.I=IM;
BI.B=BM;
IM.B=BM;
try{
  BM.P_()
}catch(e){
  BM.E=[e.name,e.message]
}
BM.h=0;
globalThis._tick=function(){
  BM.tick()
};
globalThis.tick=function(){
  globalThis._tick()
};
void 0;

