// Copyright (c) 2025-2026 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const configuration={
  ACTIVE_EVENTS:[
    /* ... */
  ],
  BLOCKS:[
    /* ... */
  ],
  boot_manager:{
    boot_delay_ms: 100,
    show_boot_logs: true,
    show_error_logs: true,
    show_execution_logs: false
  },
  block_manager:{
    is_chest_data: false,
    max_executions_per_tick: 16,
    max_errors_count: 32
  },
  join_manager:{
    reset_on_reboot: true,
    max_dequeue_per_tick: 16
  },
  event_manager:{
    is_framework_enabled: false,
    default_retry_limit: 2
  },
  EVENT_REGISTRY:{
    tick:null,
    onClose:[!1],
    onPlayerJoin:[!1],
    onPlayerLeave:[!1],
    onPlayerJump:[!1],
    onRespawnRequest:[[0,-100000,0]],
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
  STYLES:[
    "#FF775E","500","0.95rem",
    "#FFC23D","500","0.95rem",
    "#20DD69","500","0.95rem",
    "#52B2FF","500","0.95rem"
  ]
};


const _A=function(){},
_B="Code Loader",
_C=(a,b)=>{
  let c=_C.STYLES[b];
  c[0].str=a;
  api.broadcastMessage(c)
},
_D=configuration,
_E={
  state:0,
  fn:()=>{},
  args:[],
  limit:2,
  phase:1048576,
  cache:null,
  default:1048576,
  wasInterrupted:!1,
  tick:null
},
_F={
  a:!1,
  b:null,
  c:{},
  d:{},
  e:[],
  f:null,
  g:!1,
  h:null,
  i:null,
  j:null,
  k:null,
  l:null
},
_G={
  a:null,
  b:!1,
  c:null,
  d:null,
  e:null
},
_H={
  a:!1,
  b:null,
  c:null,
  d:null,
  e:null,
  f:null
},
_I={
  a:null,
  b:null,
  c:-1,
  d:null,
  e:null,
  f:!1,
  g:!1,
  h:!1,
  i:null,
  j:null
},
_J={
  a:-2,
  b:!0,
  c:!1,
  d:null,
  e:null,
  f:null,
  g:null,
  h:null
},
_K={
  create:null,
  check:null,
  build:null,
  dispose:null,
  tick:null
},
_L={
  SM:null,
  config:null,
  isPrimaryBoot:!0,
  isRunning:!1,
  reboot:null,
  bootLogs:null,
  errorLogs:null,
  executionLogs:null,
  completeLogs:null
};
{
  let A=_E,
  B={},
  C=[],
  D=1,
  E=[],
  F=1,
  G=1,
  H=0;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(D){
        if(A.state){
          B[F++]=[A.fn,A.args,A.limit,A.phase,A.cache];
          H++
        }
      }else{
        E[3]=A.phase;
        A.wasInterrupted=!1;
        D=1
      }
      A.state=0;
      return"InternalError"
    }
  });
  A.tick=()=>{
    A.state=0;
    if(!H){
      A.args=C;
      A.cache=null;
      return
    }
    D=0;
    A.wasInterrupted=!0;
    while(G<F){
      E=B[G];
      if(E[2]>0){
        E[2]--;
        A.phase=E[3];
        A.cache=E[4];
        E[0](...E[1])
      }
      delete B[G++];
      H--
    }
    A.state=0;
    A.args=C;
    A.cache=null;
    A.wasInterrupted=!1;
    D=1
  }
}
{
  let A=_D,
  B=_E,
  C=_F,
  D=api.setCallbackValueFallback,
  E=0,
  F=[],
  G,
  H,
  I,
  J;
  C.h=()=>{
    if(C.a){
      return
    }
    H=A.EVENT_REGISTRY;
    G=A.ACTIVE_EVENTS;
    let a=A.event_manager,
    b=!!a.is_framework_enabled,
    c=a.default_retry_limit|0;
    c=(c&~(c>>31))+(-c>>31)+1;
    let d=C.c,
    e=C.d,
    f=C.e,
    g=0,
    h=G.length;
    while(g<h){
      let i=G[g];
      if(i instanceof Array){
        i=i[0]
      }
      if(i==="tick"){
        g++;
        continue
      }
      let j=H[i];
      if(j===void 0){
        f[f.length]=i;
        g++;
        continue
      }
      F[F.length]=i;
      e[i]=!0;
      if(!(j instanceof Array)){
        j=H[i]=[!1]
      }
      let k=!!j[1];
      if(b&&k){
        let l=j[2];
        if(l==null){
          l=c
        }
        l|=0;
        d[i]=_A;
        globalThis[i]=function m(n,o,p,q,r,s,t,u,v){
          B.state=1;
          B.fn=m;
          B.args=[n,o,p,q,r,s,t,u,v];
          B.limit=l;
          B.phase=1048576;
          try{
            return d[i](n,o,p,q,r,s,t,u,v)
          }finally{
            B.state=0
          }
        }
      }else{
        d[i]=_A;
        globalThis[i]=function(n,o,p,q,r,s,t,u,v){
          return d[i](n,o,p,q,r,s,t,u,v)
        }
      }
      g++
    }
    e.tick=!0
  };
  C.i=()=>{
    let a=C.c,
    b=F.length;
    while(E<b){
      let c=F[E];
      Object.defineProperty(globalThis,c,{
        configurable:!0,
        set:d=>{
          if(d instanceof Function){
            a[c]=d
          }else{
            a[c]=_A
          }
        },
        get:()=>a[c]
      });
      E++
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:e=>{
        if(e instanceof Function){
          a.tick=e
        }else{
          a.tick=_A
        }
      },
      get:()=>a.tick
    })
  };
  C.j=()=>{
    if(C.g){
      return
    }
    G=A.ACTIVE_EVENTS;
    C.f=[];
    I=0;
    J=0;
    C.g=!0
  };
  C.k=()=>{
    let a=C.c,
    b=F.length;
    while(I<b){
      a[F[I]]=_A;
      I++
    }
  };
  C.l=()=>{
    let a=C.d,
    b=G.length,
    c,d;
    while(J<b){
      c=G[J];
      d=c;
      if(c instanceof Array){
        d=c[0]
      }
      if(d==="tick"){
        J++;
        continue
      }
      if(a[d]){
        let e;
        if(c instanceof Array){
          e=c[1]
        }
        if(e===void 0){
          e=H[d][0]
        }else if(e==="undefined"){
          e=void 0
        }
        D(d,e)
      }else{
        C.f[C.f.length]=d
      }
      J++
    }
  }
}
{
  let A=_E,
  B=_F,
  C=_G,
  D,
  E,
  F,
  G;
  C.c=()=>{
    if(C.b){
      return
    }
    D=_A;
    C.a=_A;
    E=_A;
    F=!1;
    G=!1;
    C.b=!0
  };
  let H=()=>{
    A.tick();
    D();
    C.a();
    E(50)
  };
  C.d=()=>{
    if(F){
      return
    }
    let a=B.c;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:b=>{
        if(b instanceof Function){
          E=b
        }else{
          E=_A
        }
      },
      get:()=>a.tick
    });
    D=B.c.tick;
    B.c.tick=H;
    F=!0
  };
  C.e=()=>{
    if(G){
      return
    }
    let a=B.c;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:b=>{
        if(b instanceof Function){
          a.tick=b
        }else{
          a.tick=_A
        }
      },
      get:()=>a.tick
    });
    a.tick=E;
    D=_A;
    C.a=_A;
    G=!0
  }
}
{
  let A=_D,
  B=_E,
  C=_F,
  D=_H,
  E=_J,
  F=_B+" JM: ",
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N;
  D.b=()=>{
    if(D.a){
      return
    }
    let a=A.join_manager;
    G=!!a.reset_on_reboot;
    H=a.max_dequeue_per_tick|0;
    H=(H&~(H>>31))+(-H>>31)+1;
    I=_A;
    J=[];
    if(G|!K){
      K={}
    }
    L=0;
    M=!1;
    N=!1;
    D.a=!0
  };
  let O=a=>{
    J[J.length]=a;
    K[a]=1
  };
  D.d=()=>{
    if(M){
      return
    }
    let a=C.c;
    a.onPlayerJoin=O;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:b=>{
        if(b instanceof Function){
          I=b
        }else{
          I=_A
        }
      },
      get:()=>a.onPlayerJoin
    });
    M=!0
  };
  D.c=()=>{
    if(G|E.b){
      let a=api.getPlayerIds(),
      b=0,
      c;
      while(c=a[b]){
        if(!K[c]){
          J[J.length]=c;
          K[c]=1
        }
        b++
      }
    }
  };
  D.e=()=>{
    let a=H,
    b;
    while(L<J.length&&a>0){
      b=J[L];
      if(K[b]!==2){
        L++;
        K[b]=2;
        B.state=1;
        B.fn=I;
        B.args=[b];
        B.limit=2;
        B.phase=1048576;
        try{
          I(b)
        }catch(c){
          B.state=0;
          _C(F+c.name+": "+c.message,0)
        }
        B.state=0;
        L--;
        a--
      }
      L++
    }
    return L>=J.length
  };
  D.f=()=>{
    if(N){
      return
    }
    let a=C.c;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:b=>{
        if(b instanceof Function){
          a.onPlayerJoin=b
        }else{
          a.onPlayerJoin=_A
        }
      },
      get:()=>a.onPlayerJoin
    });
    a.onPlayerJoin=I;
    J=null;
    N=!0
  }
}
{
  let A=_D,
  B=_I,
  C=api.getBlock,
  D=api.getBlockId,
  E=api.getBlockData,
  F=api.getStandardChestItems,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O;
  B.i=()=>{
    if(B.h){
      return
    }
    B.d=A.BLOCKS instanceof Array?A.BLOCKS:[];
    let a=A.block_manager;
    B.f=!!a.is_chest_data;
    G=a.max_executions_per_tick|0;
    G=(G&~(G>>31))+(-G>>31)+1;
    H=a.max_errors_count|0;
    H=H&~(H>>31);
    B.c=0;
    B.e=[null];
    I=0;
    J=0;
    B.g=!1;
    K=null;
    L=1;
    M=0;
    N=0;
    O=!1;
    B.h=!0
  };
  B.a=()=>{
    let a=B.d,
    b=B.e,
    c=G,
    d=a.length,
    e,f,g,h,i;
    while(J<d){
      e=a[J];
      if(!e||e.length<3){
        J++;
        continue
      }
      f=e[0];
      g=e[1];
      h=e[2];
      if((e[3]=C(f,g,h))==="Unloaded"){
        return
      }
      i=E(f,g,h)?.persisted?.shared?.text;
      try{
        (0,eval)(i)
      }catch(j){
        I++;
        b[I*+(b.length-1<H)]=[j.name,j.message,f,g,h]
      }
      J++;
      c--;
      if(c<=0){
        return
      }
    }
    B.c=1
  };
  B.b=()=>{
    let a=B.e;
    if(!B.g){
      let b=B.d[0];
      if(!b||b.length<3){
        B.c=1;
        return
      }
      if(D(b[0],b[1],b[2])===1){
        return
      }
      K=F(b);
      if(!K[0]?.attributes?.customAttributes?.region){
        B.c=1;
        return
      }
      B.g=!0
    }
    let c=G,
    d,e,f,g,h,i,j,k,l,m,n;
    while(d=K[L]){
      e=d.attributes.customAttributes._;
      f=e.length-2;
      while(M<f){
        g=e[M];
        h=e[M+1];
        i=e[M+2];
        if(D(g,h,i)===1){
          return
        }
        j=F([g,h,i]);
        while(N<4){
          k="";
          l=N*9;
          m=0;
          while(m<9&&(n=j[l+m])){
            k+=n.attributes.customAttributes._;
            m++
          }
          try{
            (0,eval)(k)
          }catch(o){
            I++;
            a[I*+(a.length-1<H)]=[o.name,o.message,g,h,i,N]
          }
          N++;
          c--;
          if(c<=0){
            return
          }
        }
        N=0;
        M+=3
      }
      M=0;
      L++
    }
    B.c=1
  };
  B.j=()=>{
    if(O){
      return
    }
    B.e[0]=null;
    K=null;
    O=!0
  }
}
{
  let A=_D,
  B=_F,
  C=_G,
  D=_H,
  E=_I,
  F=_J,
  G=_L,
  H=_B+" EM: ",
  I=_B+" BM: ",
  J=_B+" OM: ",
  K=-1,
  L,
  M,
  N,
  O,
  P;
  F.d=a=>{
    let b="Code was loaded in "+P*50+" ms",
    c=E.e.length-1;
    if(a){
      b+=c>0?" with "+c+" error"+(c===1?"":"s")+".":" with 0 errors."
    }else{
      b+="."
    }
    _C(J+b,1+(c<=0))
  };
  F.e=a=>{
    let b=E.e,
    c=b.length-1;
    if(c>0){
      let d="Code execution error"+(c===1?"":"s")+":",
      e;
      if(E.f){
        for(let f=1;f<=c;f++){
          e=b[f];
          d+="\n"+e[0]+" at ("+e[2]+", "+e[3]+", "+e[4]+") in partition ("+e[5]+"): "+e[1]
        }
      }else{
        for(let g=1;g<=c;g++){
          e=b[g];d+="\n"+e[0]+" at ("+e[2]+", "+e[3]+", "+e[4]+"): "+e[1]
        }
      }
      _C(I+d,0)
    }else if(a){
      _C(I+"No code execution errors.",2)
    }
  };
  F.f=()=>{
    let a=E.d,
    b="",
    c;
    if(E.f){
      if(E.g){
        c=a[0];
        b="Executed storage data at ("+c[0]+", "+c[1]+", "+c[2]+")."
      }else{
        b="No storage data found."
      }
    }else{
      let d=0,
      e=a.length;
      for(let f=0;f<e;f++){
        c=a[f];
        if(c[3]){
          b+='\n"'+c[3]+'" at ('+c[0]+", "+c[1]+", "+c[2]+")";
          d++
        }
      }
      b="Executed "+d+" block"+(d===1?"":"s")+" data"+(d===0?".":":")+b
    }
    _C(I+b,3)
  };
  F.g=(a,b,c)=>{
    if(B.e.length){
      _C(H+'Unregistered active events: "'+B.e.join('", "')+'".',1)
    }
    if(B.f.length){
      _C(H+'Invalid active events: "'+B.f.join('", "')+'".',1)
    }
    if(a){
      F.d(b)
    }
    if(b){
      F.e(!a)
    }
    if(c){
      F.f()
    }
  };
  F.h=()=>{
    K++;
    if(F.a<6){
      if(F.a===-2){
        if(F.b&&!B.a&&K>20){
          let a=B.b,
          b=H+"Error on primary setup - "+a?.[0]+": "+a?.[1]+".",
          c=api.getPlayerIds(),
          d=0,
          e;
          while(e=c[d]){
            if(api.checkValid(e)){
              api.kickPlayer(e,b)
            }
            d++
          }
        }
        return
      }
      if(F.a===0){
        K=0;
        let f=A.boot_manager;
        L=(f.boot_delay_ms|0)*.02|0;
        L=L&~(L>>31);
        M=!!f.show_boot_logs;
        N=!!f.show_error_logs;
        O=!!f.show_execution_logs;
        P=-1;
        B.g=!1;
        C.b=!1;
        D.a=!1;
        E.h=!1;
        G.isRunning=F.c=!0;
        F.a=1
      }
      if(F.a===1){
        if(K<L){
          return
        }
        F.a=2
      }
      if(F.a===2){
        B.j();
        C.c();
        if(B.d.onPlayerJoin){
          D.b()
        }
        E.i();
        F.a=3
      }
      if(F.a===3){
        if(F.b){
          B.i()
        }else{
          B.k()
        }
        B.l();
        F.a=4
      }
      if(F.a===4){
        if(B.d.onPlayerJoin){
          D.d();
          D.c()
        }
        C.d();
        F.a=5
      }
      if(F.a===5){
        if(E.f){
          C.a=E.b
        }else{
          C.a=E.a
        }
        F.a=6;
        return
      }
    }
    if(F.a===6){
      if(E.c===1){
        E.j();
        E.c=-1;
        F.a=7+!B.d.onPlayerJoin
      }
    }
    if(F.a===7){
      if(D.e()){
        D.f();
        F.a=8
      }
    }
    if(F.a===8){
      C.e();
      G.isPrimaryBoot=F.b=!1;
      G.isRunning=F.c=!1;
      F.a=-1;
      P=K-L+1;
      F.g(M,N,O)
    }
  }
}
{
  let A=_K,
  B=_B+" SM: ",
  C=api.setBlock,
  D=api.getBlockData,
  E=api.getStandardChestItems,
  F=api.setStandardChestItemSlot,
  G=[],
  H=0,
  I=1,
  J="Bedrock",
  K="Boat",
  L={customAttributes:{_:null}},
  M={customAttributes:{_:[]}},
  N=M.customAttributes._,
  O=[],
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y;
  let Z=(a,b,c,d,e,f,g,h,i)=>{
    let j=P,
    k=Q,
    l=R;
    if(I===1){
      P=j=c;
      Q=k=d;
      R=l=e;
      S=0;
      V=1;
      Y=0;
      I=2
    }
    let m=i,
    n=a.length,
    o,p,q,r,s,t,u,v,w,
    x,y,z,_;
    while(S<n){
      if(I===2){
        j++;
        if(j>f){
          j=c;
          l++;
          if(l>h){
            l=e;
            k++
          }
        }
        C(j,k,l,J);
        P=j;
        Q=k;
        R=l;
        T=0;
        U=[j,k,l];
        I=3
      }
      while(T<4&&S<n){
        if(I===3){
          x=a[S];
          o=D(x[0],x[1],x[2])?.persisted?.shared?.text;
          if(o?.length>0){
            z=0;
            p=0;
            q=0;
            r=JSON.stringify(o);
            s=1;
            t=r.length-1;
            while(s<t){
              u=s+1950;
              if(u>t){
                u=t
              }
              u-=r[u-1]==="\\";
              while(s<u){
                v=r.indexOf("\\",s);
                if(v===-1||v>=u){
                  w=u-s;
                  s+=w;
                  q+=w;
                  break
                }
                if(v>s){
                  w=v-s;
                  s+=w;
                  q+=w
                }
                s+=2;
                q+=1
              }
              O[z++]=o.slice(p,q);
              p=q
            }
            O.length=z;
            I=4
          }
        }
        if(I===4){
          y=T*9;
          z=0;
          _=O.length;
          while(z<_){
            L.customAttributes._=O[z];
            F(U,y+z,K,null,void 0,L);
            z++
          }
          T++;
          I=3
        }
        S++
      }
      if(Y>=243){
        F(b,V,K,null,void 0,M);
        V++;
        N.length=0;
        Y=0
      }
      N[Y++]=j;
      N[Y++]=k;
      N[Y++]=l;
      I=2;
      m--;
      if(m<=0){
        return !1
      }
    }
    F(b,V,K,null,void 0,M);
    L.customAttributes._=null;
    N.length=0;
    O.length=0;
    U=null;
    _C(B+"Built storage at ("+b[0]+", "+b[1]+", "+b[2]+").",2);
    I=1;
    return !0
  };
  let $=(a,b,c)=>{
    if(I===1){
      V=1;
      X=0;
      I=2
    }
    let d=c,
    e;
    while(e=b[V]){
      if(I===2){
        W=e.attributes.customAttributes._;
        X=0;
        Y=W.length;
        I=3
      }
      if(I===3){
        while(X<Y){
          C(W[X],W[X+1],W[X+2],"Air");
          X+=3;
          d--;
          if(d<=0){
            return !1
          }
        }
        F(a,V,"Air");
        V++;
        I=2
      }
    }
    _C(B+"Disposed storage at ("+a[0]+", "+a[1]+", "+a[2]+").",2);
    I=1;
    return !0
  };
  A.create=(a,b)=>{
    let c=a[0],
    d=a[1],
    e=a[2],
    f=b[0],
    g=b[1],
    h=b[2];
    if(c>f||d>g||e>h){
      _C(B+"Invalid region bounds. lowPos must be <= highPos on all axes.",1);
      return
    }
    C(c,d,e,J);
    F(a,0,K,null,void 0,{
      customAttributes:{
        region:[c,d,e,f,g,h]
      }
    });
    _C(B+"Registry unit created at ("+c+", "+d+", "+e+").",2)
  };
  A.check=a=>{
    let b=E(a),
    c=b[0]?.attributes?.customAttributes?.region;
    if(!c){
      _C(B+"No valid registry unit found.",1)
    }else{
      _C(B+"Storage covers region from ("+c[0]+", "+c[1]+", "+c[2]+") to ("+c[3]+", "+c[4]+", "+c[5]+").",3)
    }
  };
  A.build=(a,b,c=16)=>{
    let d=E(a),
    e=d[0]?.attributes?.customAttributes?.region;
    if(!e){
      _C(B+"No valid registry unit found.",1);
      return
    }
    let f=e[0],
    g=e[1],
    h=e[2],
    i=e[3],
    j=e[4],
    k=e[5],
    l=(i-f+1)*(j-g+1)*(k-h+1),
    m=b.length+7>>2;
    if(l<m){
      _C(B+"Not enough space. Need "+m+" storage units, but region holds "+l+".",0)
    }else{
      G[G.length]=()=>Z(b,a,f,g,h,i,j,k,c)
    }
  };
  A.dispose=(a,b=32)=>{
    let c=E(a);
    if(!c[0]?.attributes?.customAttributes?.region){
      _C(B+"No valid registry unit found.",1)
    }else{
      G[G.length]=()=>$(a,c,b)
    }
  };
  A.tick=()=>{
    let a=G.length;
    if(a){
      let b=H<a;
      while(b){
        try{
          if(!G[H]()){
            break
          }
        }catch(c){
          _C(B+"Task error on tick - "+c.name+": "+c.message,0)
        }
        b=++H<a
      }
      if(!b){
        H=0;
        G.length=0
      }
    }
  }
}
{
  let A=_F,
  B=_J,
  C=_L,
  D=_B+" OM: ";
  C.SM=_K;
  C.config=_D;
  C.reboot=()=>{
    if(!B.c){
      A.c.tick=B.h;
      B.a=0
    }else{
      _C(D+"Reboot request was denied.",1)
    }
  };
  C.bootLogs=(a=!0)=>{
    B.d(a)
  };
  C.errorLogs=(a=!0)=>{
    B.e(a)
  };
  C.executionLogs=()=>{
    B.f()
  };
  C.completeLogs=(a=!0,b=!0,c=!1)=>{
    B.g(a,b,c)
  }
}
try{
  let A=_K,
  B=_F.c;
  B.tick=_J.h;
  globalThis.tick=function(){
    B.tick(50);
    A.tick()
  };
  _F.h();
  let C=_D.STYLES,
  D=_C.STYLES=[];
  for(let E=0;E<4;E++){
    D[E]=[{
      str:"",
      style:{
        color:C[E*3],
        fontWeight:C[E*3+1],
        fontSize:C[E*3+2]
      }
    }]
  }
  let F=Object.seal,
  G=Object.freeze;
  F(_D);
  F(_D.boot_manager);
  F(_D.block_manager);
  F(_D.join_manager);
  F(_D.event_manager);
  G(_D.EVENT_REGISTRY);
  G(_D.STYLES);
  F(_E);
  G(_K);
  F(_L);
  _F.a=!0;
  _J.a=0
}catch(H){
  _F.b=[H.name,H.message]
}
globalThis.IF=_E;
globalThis.CL=_L;
void 0;

