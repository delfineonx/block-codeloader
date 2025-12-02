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

const InterruptionFramework={
  state:0,
  handler:()=>{},
  args:[],
  delay:0,
  limit:2,
  tick:null
},
EventManager={
  isInterruptionFrameworkEnabled:!1,
  primarySetupError:null,
  isPrimarySetupDone:!1,
  NOOP:{},
  delegator:{},
  activeEventType:{},
  unregisteredActiveEvents:[],
  established:!1,
  primarySetup:null,
  primaryInstall:null,
  establish:null,
  resetHandlers:null
},
TickMultiplexer={
  init:null,
  established:!1,
  establish:null,
  install:null,
  finalize:null
},
JoinManager={
  established:!1,
  establish:null,
  refillBuffer:null,
  install:null,
  dequeue:null,
  finalize:null
},
BlockManager={
  main:null,
  phase:4,
  errors:null,
  established:!1,
  establish:null,
  isBlockLocked:null
},
BootManager={
  phase:-2,
  isPrimaryBoot:!0,
  isRunning:!1,
  logStyle:null,
  logBootResult:null,
  logLoadTime:null,
  logErrors:null,
  tick:null
},
CodeLoader={
  configuration:null,
  isRunning:!1,
  state:null,
  isBlockLocked:null,
  logBootResult:null,
  logLoadTime:null,
  logErrors:null
};
// Interruption Framework
{
  let _IF=InterruptionFramework,
  _interrupted={},
  _queueId=0,
  _queueSize=0,
  _external=1,
  _tickNum=0;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(_IF.state&_external){
        _interrupted[++_queueId]=[_IF.handler,_IF.args,_IF.delay+_tickNum-1,_IF.limit];
        _queueSize++
      }
      _external=1;
      _IF.state=0;
      return"InternalError"
    }
  });
  _IF.tick=()=>{
    if(!_queueSize){
      _tickNum++;
      return
    }
    for(let id in _interrupted){
      let cache=_interrupted[id];
      if(cache[2]<_tickNum){
        if(cache[3]>0){
          _external=0;
          cache[3]--;
          cache[0](...cache[1])
        }
        delete _interrupted[id];
        _queueSize--
      }
    }
    _external=1;
    _tickNum++
  };
}
// EventManager
{
  let _EM=EventManager,
  _NOOP=function(){},
  _activeEvents=[],
  _primaryInstallCursor=0,
  _isPrimaryInstallDone=!1,
  _resetCursor=0;
  _EM.primarySetup=()=>{
    if(_EM.isPrimarySetupDone){
      return
    }
    let EVENT_REGISTRY=Configuration.EVENT_REGISTRY,
    ACTIVE_EVENTS=Configuration.ACTIVE_EVENTS,
    thisConfig=Configuration.event_manager,
    isInterruptionFrameworkEnabled=_EM.isInterruptionFrameworkEnabled=!!thisConfig.is_interruption_framework_enabled,
    defaultRetryDelay=thisConfig.default_retry_delay_ticks|0;
    defaultRetryDelay=defaultRetryDelay&~(defaultRetryDelay>>31);
    let defaultRetryLimit=thisConfig.default_retry_limit_ticks|0;
    defaultRetryLimit=(defaultRetryLimit&~(defaultRetryLimit>>31))+(-defaultRetryLimit>>31)+1;
    let eventNOOP=_EM.NOOP,
    delegator=_EM.delegator,
    activeEventType=_EM.activeEventType,
    unregisteredActiveEvents=_EM.unregisteredActiveEvents;
    for(let eventName of ACTIVE_EVENTS){
      let registryEntry=EVENT_REGISTRY[eventName];
      if(registryEntry===void 0){
        unregisteredActiveEvents[unregisteredActiveEvents.length]=eventName;
        continue
      }
      _activeEvents[_activeEvents.length]=eventName;
      if(eventName==="tick"){
        continue
      }
      if(!Array.isArray(registryEntry)){
        registryEntry=EVENT_REGISTRY[eventName]=[]
      }
      let interruptionStatus=registryEntry[0]=!!registryEntry[0];
      if(isInterruptionFrameworkEnabled&interruptionStatus){
        activeEventType[eventName]=2;
        let delay=registryEntry[1];
        if(delay===void 0|delay===null){
          delay=registryEntry[1]=defaultRetryDelay
        }
        delay|=0;
        let limit=registryEntry[2];
        if(limit===void 0|limit===null){
          limit=registryEntry[2]=defaultRetryLimit
        }
        limit|=0;
        let _IF=InterruptionFramework;
        delegator[eventName]=eventNOOP[eventName]=function(){_IF.state=0};
        globalThis[eventName]=function handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
          _IF.state=1;
          _IF.handler=handler;
          _IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
          _IF.delay=delay;
          _IF.limit=limit;
          return delegator[eventName](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
        }
      }else{
        activeEventType[eventName]=1;
        delegator[eventName]=eventNOOP[eventName]=_NOOP;
        globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
          return delegator[eventName](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
        }
      }
    }
    eventNOOP.tick=_NOOP
  };
  _EM.primaryInstall=()=>{
    if(_isPrimaryInstallDone){
      return
    }
    let delegator=_EM.delegator,
    eventNOOP=_EM.NOOP,
    activeEventsNum=_activeEvents.length;
    while(_primaryInstallCursor<activeEventsNum){
      let eventName=_activeEvents[_primaryInstallCursor],
      NOOP=eventNOOP[eventName];
      Object.defineProperty(globalThis,eventName,{
        configurable:!0,
        set:fn=>{delegator[eventName]=[NOOP,fn][+(typeof fn==="function")]}
      });
      _primaryInstallCursor++
    }
    _isPrimaryInstallDone=_primaryInstallCursor>=activeEventsNum
  };
  _EM.establish=()=>{
    if(_EM.established){
      return
    }
    _resetCursor=0;
    _EM.established=!0
  };
  _EM.resetHandlers=()=>{
    let delegator=_EM.delegator,
    eventNOOP=_EM.NOOP,
    activeEventsNum=_activeEvents.length;
    while(_resetCursor<activeEventsNum){
      let eventName=_activeEvents[_resetCursor];
      if(eventName!=="tick"){
        delegator[eventName]=eventNOOP[eventName]
      }
      _resetCursor++
    }
  }
}
// TickMultiplexer
{
  let _TM=TickMultiplexer,
  _EM=EventManager,
  _NOOP=function(){},
  _boot=null,
  _main=null,
  _installed=!1,
  _finalized=!1;
  _TM.establish=()=>{
    if(_TM.established){
      return
    }
    _boot=_NOOP;
    _TM.init=_NOOP;
    _main=_NOOP;
    _installed=!1;
    _finalized=!1;
    _TM.established=!0
  };
  const dispatch=()=>{
    _boot();
    _TM.init();
    _main()
  };
  _TM.install=()=>{
    if(_installed){
      return
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{_main=[_NOOP,fn][+(typeof fn==="function")]}
    });
    let delegator=_EM.delegator;
    _boot=delegator.tick;
    delegator.tick=dispatch;
    _installed=!0
  };
  _TM.finalize=()=>{
    if(_finalized){
      return
    }
    let delegator=_EM.delegator;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{delegator.tick=[_NOOP,fn][+(typeof fn==="function")]}
    });
    delegator.tick=_main;
    _boot=_NOOP;
    _TM.init=_NOOP;
    _finalized=!0
  }
}
// JoinManager
{
  let _JM=JoinManager,
  _EM=EventManager,
  _OM=BootManager,
  _resetOnReboot=!0,
  _maxDequeue=1,
  _main=null,
  _buffer=null,
  _joinState=null,
  _dequeueCursor=0,
  _installed=!1,
  _finalized=!1,
  _STATE_NONE=0,
  _STATE_ENQUEUED=1,
  _STATE_PROCESSED=2;
  _JM.establish=()=>{
    if(_JM.established){
      return
    }
    let thisConfig=Configuration.join_manager;
    _resetOnReboot=!!thisConfig.reset_on_reboot;
    _maxDequeue=thisConfig.max_dequeue_per_tick|0;
    _maxDequeue=(_maxDequeue&~(_maxDequeue>>31))+(-_maxDequeue>>31)+1;
    _main=_EM.NOOP.onPlayerJoin;
    _buffer=[];
    if(_resetOnReboot|!_joinState){
      _joinState={}
    }
    _dequeueCursor=0;
    _installed=!1;
    _finalized=!1;
    _JM.established=!0
  };
  _JM.refillBuffer=()=>{
    if(_resetOnReboot|_OM.isPrimaryBoot){
      let playerIds=api.getPlayerIds();
      for(let playerId of playerIds){
        if((_joinState[playerId]|0)===_STATE_NONE){
          _buffer[_buffer.length]=[playerId,!1];
          _joinState[playerId]=_STATE_ENQUEUED
        }
      }
    }
  };
  const dispatch=(playerId,fromGameReset)=>{
    _buffer[_buffer.length]=[playerId,fromGameReset];
    _joinState[playerId]=_STATE_ENQUEUED
  };
  _JM.install=()=>{
    if(_installed){
      return
    }
    _EM.delegator.onPlayerJoin=dispatch;
    let NOOP=_EM.NOOP.onPlayerJoin;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{_main=[NOOP,fn][+(typeof fn==="function")]}
    });
    _installed=!0
  };
  _JM.dequeue=()=>{
    let budget=_maxDequeue;
    while(_dequeueCursor<_buffer.length&budget>0){
      let args=_buffer[_dequeueCursor],
      playerId=args[0];
      if(_joinState[playerId]!==_STATE_PROCESSED){
        _main(playerId,args[1]);
        _joinState[playerId]=_STATE_PROCESSED;
        budget--
      }
      _dequeueCursor++
    }
    return _dequeueCursor>=_buffer.length
  };
  _JM.finalize=()=>{
    if(_finalized){
      return
    }
    let NOOP=_EM.NOOP.onPlayerJoin,
    delegator=_EM.delegator;
    delegator.onPlayerJoin=_main;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{delegator.onPlayerJoin=[NOOP,fn][+(typeof fn==="function")]}
    });
    _finalized=!0
  }
}
// BlockManager
{
  let _BM=BlockManager,
  _OM=BootManager,
  _blocks=null,
  _defaultLockedStatus=!0,
  _defaultEvalStatus=!0,
  _maxRegistrations=1,
  _maxRequests=1,
  _maxEvals=1,
  _maxErrors=0,
  _blockLockedStatus=null,
  _chunkLoadState=null,
  _chunkRequestQueue=null,
  _errors=null,
  _hasAnyBlocksToEval=0,
  _registerCursor=0,
  _requestCursor=0,
  _evalCursor=0,
  _STATE_REQUESTED=1,
  _STATE_LOADED=2;
  _BM.establish=()=>{
    if(_BM.established){
      return
    }
    _blocks=Configuration.blocks.slice();
    let thisConfig=Configuration.block_manager;
    _defaultLockedStatus=!!thisConfig.default_locked_status;
    _defaultEvalStatus=!!thisConfig.default_eval_status;
    _maxRegistrations=thisConfig.max_registrations_per_tick|0;
    _maxRegistrations=(_maxRegistrations&~(_maxRegistrations>>31))+(-_maxRegistrations>>31)+1;
    _maxRequests=thisConfig.max_requests_per_tick|0;
    _maxRequests=(_maxRequests&~(_maxRequests>>31))+(-_maxRequests>>31)+1;
    _maxEvals=thisConfig.max_evals_per_tick|0;
    _maxEvals=(_maxEvals&~(_maxEvals>>31))+(-_maxEvals>>31)+1;
    _maxErrors=thisConfig.max_errors_count|0;
    _maxErrors=_maxErrors&~(_maxErrors>>31);
    _BM.phase=0;
    _blockLockedStatus={};
    _chunkLoadState={};
    _chunkRequestQueue=[];
    _errors=_BM.errors=[null];
    _hasAnyBlocksToEval=0;
    _registerCursor=0;
    _requestCursor=0;
    _evalCursor=0;
    _BM.established=!0
  };
  const register=()=>{
    let blocksNum=_blocks.length,
    budget=_maxRegistrations;
    while(_registerCursor<blocksNum&budget>0){
      let block=_blocks[_registerCursor]=_blocks[_registerCursor].slice(),
      x=block[0];
      x=(x|0)-(x<(x|0));
      let y=block[1];
      y=(y|0)-(y<(y|0));
      let z=block[2];
      z=(z|0)-(z<(z|0));
      let lockedStatus=block[3];
      if(lockedStatus===void 0|lockedStatus===null){
        _blockLockedStatus[x+"|"+y+"|"+z]=block[3]=_defaultLockedStatus
      }else{
        _blockLockedStatus[x+"|"+y+"|"+z]=block[3]=!!lockedStatus
      }
      let evalStatus=block[4];
      if(evalStatus===void 0|evalStatus===null){
        evalStatus=block[4]=_defaultEvalStatus
      }else{
        evalStatus=block[4]=!!evalStatus
      }
      if(evalStatus){
        let isChunkLoaded=api.isBlockInLoadedChunk(x,y,z),
        chunkId=(x>>5)+"|"+(y>>5)+"|"+(z>>5);
        if(_chunkLoadState[chunkId]===void 0){
          _chunkLoadState[chunkId]=isChunkLoaded<<1;
          if(!isChunkLoaded){
            _chunkRequestQueue[_chunkRequestQueue.length]=[chunkId,x>>5<<5,y>>5<<5,z>>5<<5]
          }
        }
        _hasAnyBlocksToEval=1
      }
      budget--;
      _registerCursor++
    }
    _BM.phase=(_registerCursor>=blocksNum)<<1|_hasAnyBlocksToEval^1
  };
  const initialize=()=>{
    let chunksNum=_chunkRequestQueue.length,
    cursorIndex=_requestCursor,
    budget=_maxRequests;
    while(cursorIndex<chunksNum&budget>0){
      let requestEntry=_chunkRequestQueue[cursorIndex];
      if(api.getBlockId(requestEntry[1],requestEntry[2],requestEntry[3])===1){
        _chunkLoadState[requestEntry[0]]=_STATE_REQUESTED
      }else{
        _chunkLoadState[requestEntry[0]]=_STATE_LOADED;
        if(cursorIndex===_requestCursor){
          _requestCursor++
        }
      }
      budget--;
      cursorIndex++
    }
    let blocksNum=_blocks.length;
    budget=_maxEvals;
    while(_evalCursor<blocksNum&budget>0){
      let block=_blocks[_evalCursor];
      if(!block[4]){
        _evalCursor++;
        continue
      }
      let x=block[0],
      y=block[1],
      z=block[2];
      if(_chunkLoadState[(x>>5)+"|"+(y>>5)+"|"+(z>>5)]!==_STATE_LOADED){
        break
      }
      try{
        let code=api.getBlockData(x,y,z)?.persisted?.shared?.text;
        (0,eval)(code)
      }catch(error){
        let count=_errors.length-1,
        isWithinLimit=+(count<_maxErrors);
        _errors[(count+1)*isWithinLimit]=[_errors[count*isWithinLimit],[x,y,z,error.name,error.message]][isWithinLimit]
      }
      budget--;
      _evalCursor++
    }
    _BM.phase=2|_evalCursor>=blocksNum
  };
  _BM.main=()=>{
    if(_BM.phase<2){return register()}
    if(_BM.phase===2){initialize()}
  };
  _BM.isBlockLocked=position=>{
    let x=position[0],
    y=position[1],
    z=position[2];
    if(_blockLockedStatus[(x|0)-(x<(x|0))+"|"+((y|0)-(y<(y|0)))+"|"+((z|0)-(z<(z|0)))]!==!1){
      return!_OM.isRunning
    }
    return !1
  }
}
// BootManager
{
  let _OM=BootManager,
  _EM=EventManager,
  _TM=TickMultiplexer,
  _JM=JoinManager,
  _BM=BlockManager,
  _CL=CodeLoader,
  _bootDelayTicks=0,
  _showLoadTime=!0,
  _showErrors=!0,
  _tickNum=-1,
  _loadTimeTicks=-1;
  _OM.logLoadTime=showErrors=>{
    let errorsNum=_BM.errors.length-1,
    logs="Code Loader: BootManager: Code was loaded in "+(_loadTimeTicks*50)+" ms";
    if(errorsNum===0){
      logs+=showErrors?" with 0 errors.":".";
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle?.success??{}
      }])
    }else{
      logs+=showErrors?" with "+errorsNum+" error"+(errorsNum===1?"":"s")+".":".";
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle?.warning??{}
      }])
    }
  };
  _OM.logErrors=()=>{
    let errors=_BM.errors,
    errorsNum=errors.length-1;
    if(errorsNum>0){
      let logs="Code Loader: BlockManager: Code evaluation error"+(errorsNum===1?"":"s")+":",
      index=1;
      while(index<=errorsNum){
        let error=errors[index];
        logs+="\n"+error[3]+" at ("+error[0]+","+error[1]+","+error[2]+"): "+error[4];
        index++
      }
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle?.error??{}
      }])
    }
  };
  _OM.logBootResult=(showLoadTime,showErrors)=>{
    let unregisteredActiveEvents=_EM.unregisteredActiveEvents;
    if(unregisteredActiveEvents.length){
      api.broadcastMessage([{
        str:"Code Loader: EventManager: Unregistered callbacks: "+unregisteredActiveEvents.join(", ")+".",
        style:_OM.logStyle?.warning??{}
      }])
    }
    if(showLoadTime){
      _OM.logLoadTime(showErrors)
    }
    if(showErrors){
      _OM.logErrors()
    }
  };
  _OM.tick=()=>{
    _tickNum++;
    if(_OM.phase<6){
      if(_OM.phase===-2){
        if(_OM.isPrimaryBoot&!_EM.isPrimarySetupDone&_tickNum>10){
          let criticalError=_EM.primarySetupError,
          logs=`Code Loader: EventManager: ${criticalError===null?"Undefined e":"E"}rror on events primary setup${criticalError===null?".":` - ${criticalError[0]}: ${criticalError[1]}.`}`,
          playerIds=api.getPlayerIds();
          for(let playerId of playerIds){
            if(api.checkValid(playerId)){
              api.kickPlayer(playerId,logs)
            }
          }
        }
        return
      }
      if(_OM.phase===0){
        _tickNum=0;
        let thisConfig=Configuration.boot_manager;
        _bootDelayTicks=(thisConfig.boot_delay_ms|0)*.02|0;
        _bootDelayTicks=_bootDelayTicks&~(_bootDelayTicks>>31);
        _showLoadTime=!!thisConfig.show_load_time;
        _showErrors=!!thisConfig.show_errors;
        _OM.logStyle={
          error:Object.assign({},Configuration.LOG_STYLE.error),
          warning:Object.assign({},Configuration.LOG_STYLE.warning),
          success:Object.assign({},Configuration.LOG_STYLE.success)
        };
        _loadTimeTicks=-1;
        _EM.established=!1;
        _TM.established=!1;
        _JM.established=!1;
        _BM.established=!1;
        _CL.isRunning=_OM.isRunning=!0;
        _OM.phase=1
      }
      if(_OM.phase===1){
        if(_tickNum<_bootDelayTicks){
          return
        }
        _OM.phase=2
      }
      if(_OM.phase===2){
        _EM.establish();
        _TM.establish();
        if(!!_EM.activeEventType.onPlayerJoin){
          _JM.establish()
        }
        _BM.establish();
        _OM.phase=3
      }
      if(_OM.phase===3){
        if(_OM.isPrimaryBoot){
          _EM.primaryInstall()
        }
        _EM.resetHandlers();
        if(!!_EM.activeEventType.onPlayerJoin){
          _JM.refillBuffer()
        }
        _OM.phase=4
      }
      if(_OM.phase===4){
        if(!!_EM.activeEventType.onPlayerJoin){
          _JM.install()
        }
        _TM.install();
        _OM.phase=5;
        return
      }
      if(_OM.phase===5){
        _TM.init=_BM.main;
        _OM.phase=6;
        return
      }
    }
    if(_OM.phase===6){
      if(_BM.phase===3){
        _BM.errors[0]=null;
        _OM.phase=6+1+!_EM.activeEventType.onPlayerJoin
      }
    }
    if(_OM.phase===7){
      _OM.phase+=_JM.dequeue()|0
    }
    if(_OM.phase===8){
      if(!!_EM.activeEventType.onPlayerJoin){
        _JM.finalize()
      }
      _TM.finalize();
      _BM.phase=4;
      _OM.isPrimaryBoot=!1;
      _CL.isRunning=_OM.isRunning=!1;
      _OM.phase=-1;
      _loadTimeTicks=_tickNum-_bootDelayTicks+1;
      _OM.logBootResult(_showLoadTime,_showErrors)
    }
  }
}
// CodeLoader
{
  let _CL=CodeLoader,
  _IF=InterruptionFramework,
  _EM=EventManager,
  _BM=BlockManager,
  _OM=BootManager;
  _CL.configuration=Configuration;
  _CL.state=eventName=>{
    let activeEventType=_EM.activeEventType[eventName];
    if(activeEventType===void 0){
      api.broadcastMessage([{
        str:'Code Loader: EventManager: interruption state - "'+eventName+'" is invalid active event name.',
        style:_OM.logStyle?.error??{}
      }])
    }else if(activeEventType===1){
      api.broadcastMessage([{
        str:'Code Loader: EventManager: interruption state - "'+eventName+'" interruption status is false.',
        style:_OM.logStyle?.warning??{}
      }])
    }
    _IF.state=0
  };
  _CL.isBlockLocked=position=>{
    return!Array.isArray(position)||position.length!==3||_BM.isBlockLocked(position)
  };
  _CL.reboot=()=>{
    if(!_OM.isRunning){
      _EM.delegator.tick=_OM.tick;
      _OM.phase=0
    }else{
      api.broadcastMessage([{
        str:"Code Loader: BootManager: Wait until current running boot session is finished.",
        style:_OM.logStyle?.warning??{}
      }])
    }
  };
  _CL.logBootResult=(showLoadTime=!0,showErrors=!0)=>{
    _OM.logBootResult(showLoadTime,showErrors)
  };
  _CL.logLoadTime=(showErrors=!0)=>{
    _OM.logLoadTime(showErrors)
  };
  _CL.logErrors=()=>{
    _OM.logErrors()
  }
}
// Tick Event Setup
{
  let delegator=EventManager.delegator;
  delegator.tick=BootManager.tick;
  globalThis.tick=function(){
    delegator.tick()
  }
}
// Primary Setup
try{
  EventManager.primarySetup();
  let toSeal=[
    Configuration,
    Configuration.boot_manager,
    Configuration.block_manager,
    Configuration.join_manager,
    Configuration.event_manager,
    Configuration.LOG_STYLE,
    InterruptionFramework,
    EventManager,
    TickMultiplexer,
    JoinManager,
    BlockManager,
    BootManager,
    CodeLoader
  ],
  toFreeze=[
    Configuration.ACTIVE_EVENTS,
    Configuration.EVENT_REGISTRY
  ];
  toSeal.forEach(obj=>{
    Object.seal(obj)
  });
  toFreeze.forEach(obj=>{
    Object.freeze(obj)
  });
  EventManager.isPrimarySetupDone=!0;
  BootManager.phase=0
}catch(error){
  EventManager.primarySetupError=[error.name,error.message]
}
globalThis.IF=InterruptionFramework;
globalThis.CL=CodeLoader;
void 0;

