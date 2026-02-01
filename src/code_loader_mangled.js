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
    show_execution_logs: false,
  },
  block_manager:{
    is_chest_mode: false,
    max_executions_per_tick: 8,
    max_errors_count: 32,
  },
  join_manager:{
    reset_on_reboot: true,
    max_dequeue_per_tick: 16,
  },
  event_manager:{
    is_framework_enabled: false,
    default_retry_limit: 2,
  },
  EVENT_REGISTRY:{
    tick: null,
    onClose: [],
    onPlayerJoin: [],
    onPlayerLeave: [],
    onPlayerJump: [],
    onRespawnRequest: [[0,-10000,0]],
    playerCommand: [undefined],
    onPlayerChat: [null],
    onPlayerChangeBlock: ["preventChange"],
    onPlayerDropItem: ["preventDrop"],
    onPlayerPickedUpItem: [],
    onPlayerSelectInventorySlot: [],
    onBlockStand: [],
    onPlayerAttemptCraft: ["preventCraft"],
    onPlayerCraft: [],
    onPlayerAttemptOpenChest: ["preventOpen"],
    onPlayerOpenedChest: [],
    onPlayerMoveItemOutOfInventory: ["preventChange"],
    onPlayerMoveInvenItem: ["preventChange"],
    onPlayerMoveItemIntoIdxs: ["preventChange"],
    onPlayerSwapInvenSlots: ["preventChange"],
    onPlayerMoveInvenItemWithAmt: ["preventChange"],
    onPlayerAttemptAltAction: ["preventAction"],
    onPlayerAltAction: [],
    onPlayerClick: [],
    onClientOptionUpdated: [],
    onMobSettingUpdated: [],
    onInventoryUpdated: [],
    onChestUpdated: [],
    onWorldChangeBlock: ["preventChange"],
    onCreateBloxdMeshEntity: [],
    onEntityCollision: [],
    onPlayerAttemptSpawnMob: ["preventSpawn"],
    onWorldAttemptSpawnMob: ["preventSpawn"],
    onPlayerSpawnMob: [],
    onWorldSpawnMob: [],
    onWorldAttemptDespawnMob: ["preventDespawn"],
    onMobDespawned: [],
    onPlayerAttack: [],
    onPlayerDamagingOtherPlayer: ["preventDamage"],
    onPlayerDamagingMob: ["preventDamage"],
    onMobDamagingPlayer: ["preventDamage"],
    onMobDamagingOtherMob: ["preventDamage"],
    onAttemptKillPlayer: ["preventDeath"],
    onPlayerKilledOtherPlayer: ["keepInventory"],
    onMobKilledPlayer: ["keepInventory"],
    onPlayerKilledMob: ["preventDrop"],
    onMobKilledOtherMob: ["preventDrop"],
    onPlayerPotionEffect: [],
    onPlayerDamagingMeshEntity: [],
    onPlayerBreakMeshEntity: [],
    onPlayerUsedThrowable: [],
    onPlayerThrowableHitTerrain: [],
    onTouchscreenActionButton: [],
    onTaskClaimed: [],
    onChunkLoaded: [],
    onPlayerRequestChunk: [],
    onItemDropCreated: [],
    onPlayerStartChargingItem: [],
    onPlayerFinishChargingItem: [],
    doPeriodicSave: [],
  },
  STYLES:[
    "#FF775E","500","0.95rem",
    "#FFC23D","500","0.95rem",
    "#20DD69","500","0.95rem",
    "#52B2FF","500","0.95rem"
  ]
};


{
  let A=configuration,
  B={
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
  C={
    create:null,
    check:null,
    build:null,
    dispose:null
  },
  D={
    SM:null,
    config:null,
    isPrimaryBoot:!0,
    isRunning:!1,
    pointer:0,
    reboot:null,
    bootLogs:null,
    errorLogs:null,
    executionLogs:null,
    completeLogs:null
  },
  _A=eval,
  _B=api.getBlock,
  E=api.getBlockId,
  _C=api.setBlock,
  _D=api.getBlockData,
  _E=api.getStandardChestItems,
  _F=api.getStandardChestItemSlot,
  F=api.setStandardChestItemSlot,
  _G=api.setCallbackValueFallback,
  _H=api.getPlayerIds,
  _I=api.broadcastMessage,
  G=function(){},
  _J=[],
  H="Code Loader",
  _K=Object.create(null),
  _L=[],
  I=[],
  _M=1,
  _N=1,
  _O=1,
  _P=0,
  J=H+" SM: ",
  K=[],
  L=0,
  M=1,
  _Q="Bedrock",
  N="Boat",
  _R={customAttributes:{_:null}},
  _S={customAttributes:{_:[]}},
  O=_S.customAttributes._,
  P=[],
  _T,
  _U,
  _V,
  _W,
  _X,
  _Y,
  _Z,
  _a,
  _b,
  Q,
  R,
  _c,
  S,
  _d,
  T,
  U,
  V,
  W,
  _e=H+" EM: ",
  X=Object.create(null),
  Y=Object.create(null),
  _f=!1,
  _g=null,
  Z=[],
  a=[],
  _h=0,
  b,
  c,
  d,
  e,
  f,
  _i=H+" JM: ",
  _j,
  g,
  h,
  i=[],
  j={},
  k,
  _k=H+" BM: ",
  _l,
  l,
  m=[null],
  n,
  o,
  p,
  _m,
  q,
  r,
  s,
  _n,
  t,
  u,
  v,
  _o,
  _p=H+" OM: ",
  _=-2,
  w=!0,
  x=-1,
  y=!1,
  z,
  _q,
  _r,
  _s,
  _t;

  const $=(A,B)=>{
    let C=_J[B];
    C[0].str=A;
    _I(C)
  },
  $A=()=>{
    let B=A.join_manager,
    C=A.block_manager,
    D=A.boot_manager;
    d=0;
    e=G;
    f=G;
    if(b){
      _j=!!B.reset_on_reboot;
      g=B.max_dequeue_per_tick|0;
      g=(g&~(g>>31))+(-g>>31)+1;
      h=G;
      if(!w){
        i.length=0;
        if(_j){j={}}
      }
      k=0
    }
    l=A.BLOCKS instanceof Array?A.BLOCKS:[];
    n=!!C.is_chest_mode;
    o=C.max_executions_per_tick|0;
    o=(o&~(o>>31))+(-o>>31)+1;
    p=C.max_errors_count|0;
    p=p&~(p>>31);
    m.length=1;
    m[0]=null;
    _m=0;
    q=0;
    if(n){
      r=!1;
      s={};
      _n=1;
      t=0;
      u=0
    }
    z=(D.boot_delay_ms|0)*.02|0;
    z=z&~(z>>31);
    _q=!!D.show_boot_logs;
    _r=!!D.show_error_logs;
    _s=!!D.show_execution_logs;
    _t=-1
  },
  $B=()=>{
    B.state=0;
    if(!_P){
      B.args=_L;
      B.cache=null;
      return
    }
    _M=0;
    B.wasInterrupted=!0;
    while(_O<_N){
      I=_K[_O];
      if(I[2]>0){
        I[2]--;
        B.phase=I[3];
        B.cache=I[4];
        I[0](...I[1])
      }
      delete _K[_O++];
      _P--
    }
    B.state=0;
    B.args=_L;
    B.cache=null;
    B.wasInterrupted=!1;
    _M=1
  },
  $C=(A,B)=>{
    let C=A[0],
    D=A[1],
    G=A[2],
    H=B[0],
    I=B[1],
    K=B[2];
    if(C>H||D>I||G>K){
      $(J+"Invalid region bounds. lowPos must be <= highPos on all axes.",1);
      return !0
    }
    if(E(C,D,G)===1){return !1}
    _C(C,D,G,_Q);
    F([C,D,G],0,N,null,void 0,{
      customAttributes:{
        region:[C,D,G,H,I,K]
      }
    });
    $(J+"Registry unit created at ("+C+", "+D+", "+G+").",2);
    return !0
  },
  $D=A=>{
    if(E(A[0],A[1],A[2])===1){return !1}
    let B=_F(A,0)?.attributes?.customAttributes?.region;
    if(!B){
      $(J+"No valid registry unit found.",1)
    }else{
      $(J+"Storage covers region from ("+B[0]+", "+B[1]+", "+B[2]+") to ("+B[3]+", "+B[4]+", "+B[5]+").",3)
    }
    return !0
  },
  $E=(A,B,C)=>{
    if(M===1){
      if(E(A[0],A[1],A[2])===1){return !1}
      let D=_F(A,0)?.attributes?.customAttributes?.region;
      if(!D){
        $(J+"No valid registry unit found.",1);
        return !0
      }
      _T=D[0];
      _U=D[1];
      _V=D[2];
      _W=D[3];
      _X=D[4];
      _Y=D[5];
      let G=(_W-_T+1)*(_X-_U+1)*(_Y-_V+1)-1,
      H=B.length+3>>2;
      if(G<H){
        $(J+"Not enough space. Need "+H+" storage units, but region holds "+G+".",0);
        return !0
      }
      _Z=_T;
      _a=_U;
      _b=_V;
      Q={};
      S=0;
      T=1;
      W=0;
      M=2
    }
    let I=_Z,
    K=_a,
    L=_b,
    R=C,
    U=B.length,
    V,X,Y,Z,a,b,c,d,e,
    f,g,h,i,j,k,l,m;
    while(S<U){
      if(M===2){
        I++;
        if(I>_W){
          I=_T;
          L++;
          if(L>_Y){
            L=_V;
            K++;
            if(K>_X){
              $(J+"Region overflow on storage build at ("+A[0]+", "+A[1]+", "+A[2]+").",0);
              return !0
            }
          }
        }
        j=(I>>5)+"|"+(K>>5)+"|"+(L>>5);
        if(!Q[j]){
          if(E(I,K,L)===1){return !1}
          Q[j]=!0
        }
        _C(I,K,L,_Q);
        _Z=I;
        _a=K;
        _b=L;
        _c=[I,K,L];
        _d=0;
        M=3
      }
      while(_d<4&&S<U){
        if(M===3){
          f=B[S];
          g=f[0];
          h=f[1];
          i=f[2];
          j=(g>>5)+"|"+(h>>5)+"|"+(i>>5);
          if(!Q[j]){
            if(E(g,h,i)===1){return !1}
            Q[j]=!0
          }
          V=_D(g,h,i)?.persisted?.shared?.text;
          if(V?.length>0){
            l=0;
            X=0;
            Y=0;
            Z=JSON.stringify(V);
            a=1;
            b=Z.length-1;
            while(a<b){
              c=a+1950;
              if(c>b){c=b}
              c-=Z[c-1]==="\\";
              while(a<c){
                d=Z.indexOf("\\",a);
                if(d===-1||d>=c){
                  e=c-a;
                  a+=e;
                  Y+=e;
                  break
                }
                if(d>a){
                  e=d-a;
                  a+=e;
                  Y+=e
                }
                a+=2;
                Y+=1
              }
              P[l++]=V.slice(X,Y);
              X=Y
            }
            P.length=l;
            M=4
          }
        }
        if(M===4){
          k=_d*9;
          l=0;
          m=P.length;
          while(l<m){
            _R.customAttributes._=P[l];
            F(_c,k+l,N,null,void 0,_R);
            l++
          }
          _d++;
          M=3
        }
        S++
      }
      if(W>=243){
        F(A,T,N,null,void 0,_S);
        O.length=0;
        W=0;
        T++
      }
      O[W++]=I;
      O[W++]=K;
      O[W++]=L;
      M=2;
      R--;
      if(R<=0){return !1}
    }
    F(A,T,N,null,void 0,_S);
    _R.customAttributes._=null;
    O.length=0;
    P.length=0;
    Q=null;
    _c=null;
    $(J+"Built storage at ("+A[0]+", "+A[1]+", "+A[2]+").",2);
    M=1;
    return !0
  },
  $F=(A,B)=>{
    if(M===1){
      if(E(A[0],A[1],A[2])===1){return !1}
      R=_E(A);
      if(!R[0]?.attributes?.customAttributes?.region){
        $(J+"No valid registry unit found.",1);
        R=null;
        return !0
      }
      Q={};
      T=1;
      V=0;
      M=2
    }
    let C=B,
    D,G,H,I,K;
    while(D=R[T]){
      if(M===2){
        U=D.attributes.customAttributes._;
        V=0;
        W=U.length;
        M=3
      }
      if(M===3){
        while(V<W){
          G=U[V];
          H=U[V+1];
          I=U[V+2];
          K=(G>>5)+"|"+(H>>5)+"|"+(I>>5);
          if(!Q[K]){
            if(E(G,H,I)===1){return !1}
            Q[K]=!0
          }
          _C(G,H,I,"Air");
          V+=3;
          C--;
          if(C<=0){return !1}
        }
        F(A,T,"Air");
        T++;
        M=2
      }
    }
    $(J+"Disposed storage at ("+A[0]+", "+A[1]+", "+A[2]+").",2);
    Q=null;
    R=null;
    U=null;
    M=1;
    return !0
  },
  $G=()=>{
    let A=K.length,
    B=L<A;
    while(B){
      try{
        if(!K[L]()){break}
      }catch(C){
        $(J+"Task error on tick - "+C.name+": "+C.message,0)
      }
      B=++L<A
    }
    if(!B){
      L=0;
      K.length=0
    }
  },
  $H=()=>{
    if(_f){return}
    let C=B,
    D=A.EVENT_REGISTRY,
    E=A.ACTIVE_EVENTS,
    F=A.event_manager,
    H=!!F.is_framework_enabled,
    I=F.default_retry_limit|0;
    I=(I&~(I>>31))+(-I>>31)+1;
    let J=0,
    K=E.length;
    while(J<K){
      let L=E[J];
      if(L==="tick"){
        J++;
        continue
      }
      let M=D[L];
      if(M===void 0){
        Z[Z.length]=L;
        J++;
        continue
      }
      if(!(M instanceof Array)){
        M=D[L]=[]
      }
      let N=!!M[1];
      if(L!=="onPlayerJoin"){
        a[a.length]=L;
        let O=G;
        X[L]=P=>{O=P instanceof Function?P:G};
        Y[L]=()=>O;
        if(H&&N){
          let Q=M[2];
          if(Q==null){Q=I}
          Q|=0;
          globalThis[L]=function(R,S,T,U,V,W,c,d,e){
            C.state=1;
            C.fn=O;
            C.args=[R,S,T,U,V,W,c,d,e];
            C.limit=Q;
            C.phase=1048576;
            try{
              return O(R,S,T,U,V,W,c,d,e)
            }finally{
              C.state=0
            }
          }
        }else{
          globalThis[L]=function(R,S,T,U,V,W,c,d,e){
            return O(R,S,T,U,V,W,c,d,e)
          }
        }
      }else{
        b=$N;
        X.onPlayerJoin=f=>{b=f instanceof Function?f:G};
        Y.onPlayerJoin=()=>b;
        if(H&&N){
          let g=M[2];
          if(g==null){g=I}
          g|=0;
          globalThis.onPlayerJoin=function(h,i){
            C.state=1;
            C.fn=b;
            C.args=[h,i];
            C.limit=g;
            C.phase=1048576;
            try{
              return b(h,i)
            }finally{
              C.state=0
            }
          }
        }else{
          globalThis[L]=function(h,i){
            return b(h,i)
          }
        }
      }
      J++
    }
  },
  $I=()=>{
    let B=A.EVENT_REGISTRY,
    C=a.length;
    while(_h<C){
      let D=a[_h];
      _G(D,B[D][0]);
      Object.defineProperty(globalThis,D,{
        configurable:!0,
        set:X[D],
        get:Y[D]
      });
      _h++
    }
    if(b){
      Object.defineProperty(globalThis,"onPlayerJoin",{
        configurable:!0,
        set:E=>{b=E instanceof Function?E:G},
        get:()=>b
      })
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:F=>{c=F instanceof Function?F:G},
      get:()=>c
    })
  },
  $J=()=>{
    let A=a.length;
    while(d<A){
      X[a[d]](G);
      d++
    }
    if(b){b=G}
  },
  $K=()=>{
    $B();
    f(50);
    e()
  },
  $L=()=>{
    let A=G;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:B=>{f=A=B instanceof Function?B:G},
      get:()=>A
    });
    e=c;
    c=$K
  },
  $M=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:A=>{c=A instanceof Function?A:G},
      get:()=>c
    });
    c=f;
    e=G
  },
  $N=(A,B)=>{
    let C=i.length;
    i[C]=A;
    i[C+1]=B;
    j[A]=1
  },
  $O=()=>{
    b=$N;
    let A=G;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:B=>{h=A=B instanceof Function?B:G},
      get:()=>A
    })
  },
  $P=()=>{
    if(_j||w){
      let A=_H(),
      B=0,
      C,D;
      while(C=A[B]){
        if(!j[C]){
          D=i.length;
          i[D]=C;
          i[D+1]=!1;
          j[C]=1
        }
        B++
      }
    }
  },
  $Q=()=>{
    let A=g,
    C,D;
    while(k<i.length&&A>0){
      C=i[k];
      if(j[C]!==2){
        D=i[k+1];
        j[C]=2;
        k+=2;
        B.state=1;
        B.fn=h;
        B.args=[C,D];
        B.limit=2;
        B.phase=1048576;
        try{
          h(C,D)
        }catch(error){
          B.state=0;
          $(_i+error.name+": "+error.message,0)
        }
        B.state=0;
        k-=2;
        A--
      }
      k+=2
    }
    return k>=i.length
  },
  $R=()=>{
    b=h;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:A=>{b=A instanceof Function?A:G},
      get:()=>b
    });
    i.length=0
  },
  $S=()=>{
    let A=o,
    B=l.length,
    C,E,F,G,H;
    while(q<B){
      C=l[q];
      if(!C||C.length<3){
        D.pointer=++q;
        continue
      }
      E=C[0];
      F=C[1];
      G=C[2];
      if((C[3]=_B(E,F,G))==="Unloaded"){return !1}
      try{
        H=_D(E,F,G)?.persisted?.shared?.text;
        _A(H)
      }catch(I){
        m[++_m*+(m.length-1<p)]=[I.name,I.message,E,F,G]
      }
      D.pointer=++q;
      A--;
      if(A<=0){return !1}
    }
    return !0
  },
  $T=()=>{
    if(!r){
      let A=l[0];
      if(!A||A.length<3){return !0}
      if(E(A[0],A[1],A[2])===1){return !1}
      v=_E(A);
      if(!v[0]?.attributes?.customAttributes?.region){return !0}
      r=!0
    }
    let B=o,
    C,F,G,H,I,J,K,L,M,N,O;
    while(C=v[_n]){
      F=C.attributes.customAttributes._;
      G=F.length-2;
      while(t<G){
        H=F[t];
        I=F[t+1];
        J=F[t+2];
        K=(H>>5)+"|"+(I>>5)+"|"+(J>>5);
        if(!s[K]){
          if(E(H,I,J)===1){return !1}
          s[K]=!0
        }
        if(u===0){
          _o=_E([H,I,J])
        }
        while(u<4){
          L="";M=u*9;
          N=0;
          while(N<9&&(O=_o[M+N])){
            L+=O.attributes.customAttributes._;
            N++
          }
          if(N===0){
            D.pointer++;
            break
          }
          try{
            _A(L)
          }catch(P){
            m[++_m*+(m.length-1<p)]=[P.name,P.message,H,I,J,u]
          }
          u++;
          D.pointer++;
          B--;
          if(B<=0){return !1}
        }
        u=0;
        t+=3
      }
      t=0;
      _n++
    }
    return !0
  },
  $U=()=>{
    _l=n?$T:$S
  },
  $V=()=>{
    m[0]=null;
    s=null;
    v=null;
    _o=null
  },
  $W=A=>{
    let B="Code was loaded in "+_t*50+" ms",
    C=m.length-1;
    if(A){
      B+=C>0?" with "+C+" error"+(C===1?"":"s")+".":" with 0 errors."
    }else{
      B+="."
    }
    $(_p+B,1+(C<=0))
  },
  $X=A=>{
    let B=m.length-1;
    if(B>0){
      let C="Code execution error"+(B===1?"":"s")+":",
      D;
      if(n){
        for(let E=1;E<=B;E++){
          D=m[E];
          C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+") in partition ("+D[5]+"): "+D[1]
        }
      }else{
        for(let F=1;F<=B;F++){
          D=m[F];C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+"): "+D[1]
        }
      }
      $(_k+C,0)
    }else if(A){
      $(_k+"No code execution errors.",2)
    }
  },
  $Y=()=>{
    let A="",
    B;
    if(n){
      if(r){
        B=l[0];
        A="Executed storage data at ("+B[0]+", "+B[1]+", "+B[2]+")."
      }else{
        A="No storage data found."
      }
    }else{
      let C=0,
      D=l.length;
      for(let E=0;E<D;E++){
        B=l[E];
        if(B[3]){
          A+='\n"'+B[3]+'" at ('+B[0]+", "+B[1]+", "+B[2]+")";
          C++
        }
      }
      A="Executed "+C+" block"+(C===1?"":"s")+" data"+(C===0?".":":")+A
    }
    $(_k+A,3)
  },
  $Z=(A,B,C)=>{
    if(Z.length){
      $(_e+'Unknown active events: "'+Z.join('", "')+'".',1)
    }
    if(A){
      $W(B)
    }
    if(B){
      $X(!A)
    }
    if(C){
      $Y()
    }
  },
  $a=()=>{
    x++;
    if(_<3){
      if(_===-2){
        if(!_f&&x>20){
          let A=_e+"Error on primary setup - "+_g?.[0]+": "+_g?.[1]+".",
          B=_H(),
          C=0,
          E;
          while(E=B[C]){
            if(api.checkValid(E)){
              api.kickPlayer(E,A)
            }
            C++
          }
        }
        return
      }
      if(_===0){
        $A();
        _=1
      }
      if(_===1){
        if(x<z){return}
        _=2
      }
      if(_===2){
        if(w){
          $I()
        }else{
          $J()
        }
        if(b){
          $O();
          $P()
        }
        $U();
        $L();
        _=3
      }
    }
    if(_===3&&_l()){
      $V();
      _=4+!b
    }
    if(_===4&&$Q()){
      $R();
      _=5
    }
    if(_===5){
      $M();
      D.isPrimaryBoot=w=!1;
      D.isRunning=y=!1;
      _=-1;
      _t=x-z+1;
      $Z(_q,_r,_s)
    }
  };
  B.tick = $B;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(_M){
        if(B.state){
          _K[_N++]=[B.fn,B.args,B.limit,B.phase,B.cache];
          _P++
        }
      }else{
        I[3]=B.phase;
        B.wasInterrupted=!1;
        _M=1
      }
      B.state=0;
      return"InternalError"
    }
  });
  C.create=(A,B)=>{
    K[K.length]=()=>$C(A,B)
  };
  C.check=A=>{
    K[K.length]=()=>$D(A)
  };
  C.build=(A,B,C=8)=>{
    K[K.length]=()=>$E(A,B,C)
  };
  C.dispose=(A,B=32)=>{
    K[K.length]=()=>$F(A,B)
  };
  D.SM=C;
  D.config=A;
  D.reboot=()=>{
    if(!y){
      x=0;
      D.isRunning=y=!0;
      D.pointer=0;
      c=$a;
      _=0
    }else{
      $(_p+"Reboot request was denied.",1)
    }
  };
  D.bootLogs=(A=!0)=>{
    $W(A)
  };
  D.errorLogs=(A=!0)=>{
    $X(A)
  };
  D.executionLogs=()=>{
    $Y()
  };
  D.completeLogs=(A=!0,B=!0,C=!1)=>{
    $Z(A,B,C)
  };
  c=$a;
  X.tick=A=>{c=A instanceof Function?A:G};
  Y.tick=()=>c;
  globalThis.tick=function(){
    c(50);
    if(K.length){$G()}
  };
  try{
    x=0;
    D.isRunning=y=!0;
    D.pointer=0;
    $H();
    let E=A.STYLES;
    for(let F=0;F<4;F++){
      _J[F]=[{
        str:"",
        style:{
          color:E[F*3],
          fontWeight:E[F*3+1],
          fontSize:E[F*3+2]
        }
      }]
    }
    let G=Object.seal,
    H=Object.freeze;
    G(A);
    G(A.boot_manager);
    G(A.block_manager);
    G(A.join_manager);
    G(A.event_manager);
    H(A.EVENT_REGISTRY);
    H(A.STYLES);
    G(B);
    H(C);
    G(D);
    _f=!0;
    _=0
  }catch(I){
    _g=[I.name,I.message]
  }
  globalThis.IF=B;
  globalThis.CL=D;
  void 0
}

/*
_CF
_IF
_SM
_CL
_getBlockId
_setStandardChestItemSlot
_NOOP
_PREFIX
_IF_element
_SM_prefix
_SM_taskQueue
_SM_taskIndex
_SM_taskPhase
_SM_itemType
_SM_storageCoordsBuffer
_SM_dataChunksBuffer
_SM_isChunkLoaded
_SM_registryItems
_SM_blockIndex
_SM_registrySlotIndex
_SM_coordsList
_SM_coordsIndex
_SM_coordsCount
_EM_setEventHandler
_EM_getEventHandler
_EM_unknownActiveEvents
_EM_activeEvents
_EM_join_handler
_EM_tick_handler
_EM_resetCursor
_TM_boot
_TM_main
_JM_maxDequeuePerTick
_JM_main
_JM_buffer
_JM_state
_JM_dequeueCursor
_BM_blocks
_BM_errors
_BM_isChestMode
_BM_maxExecutionsPerTick
_BM_maxErrorsCount
_BM_blockIndex
_BM_isRegistryLoaded
_BM_isChunkLoaded
_BM_coordsIndex
_BM_partition
_BM_registryItems
_OM_phase
_OM_isPrimaryBoot
_OM_tickNum
_OM_isRunning
_OM_bootDelayTicks
_log
*/

// 01/02/2026
