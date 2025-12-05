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
  }
};

const InterruptionFramework={
  state:0,
  handler:()=>{},
  args:[],
  delay:0,
  limit:1,
  phase:400000,
  cache:null,
  defaultPhase:400000,
  wasInterrupted:!1,
  tick:null
},
EventManager={
  primarySetupError:null,
  isPrimarySetupDone:!1,
  delegator:{},
  isEventActive:{},
  unregisteredActiveEvents:[],
  invalidActiveEvents:[],
  established:!1,
  primarySetup:null,
  primaryInstall:null,
  establish:null,
  resetHandlers:null,
  setupFallbacks:null
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
  bufferPlayers:null,
  install:null,
  dequeue:null,
  finalize:null
},
BlockManager={
  init:null,
  phase:4,
  blocks:null,
  errors:null,
  established:!1,
  establish:null,
  finalize:null,
  isBlockLocked:null
},
BootManager={
  phase:-2,
  isPrimaryBoot:!0,
  isRunning:!1,
  logStyle:null,
  logBootResult:null,
  logLoadTime:null,
  logExecutedBlocks:null,
  logErrors:null,
  tick:null
},
CodeLoader={
  configuration:null,
  isPrimaryBoot:!0,
  isRunning:!1,
  isBlockLocked:null,
  logBootResult:null,
  logLoadTime:null,
  logExecutedBlocks:null,
  logErrors:null
},
NOOP=function(){};
{
  let _IF=InterruptionFramework,
  _interrupted={},
  _enqueueId=0,
  _dequeueId=1,
  _queueSize=0,
  _element=[],
  _external=1,
  _tickNum=0;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(_external){
        if(_IF.state){
          _interrupted[++_enqueueId]=[_IF.phase,_IF.cache,_IF.handler,_IF.args,_IF.delay+_tickNum,_IF.limit];
          _queueSize++
        }
      }else{
        _element[0]=_IF.phase;
        _IF.wasInterrupted=!1;
        _external=1
      }
      _IF.cache=null;
      _IF.state=0;
      return"InternalError"
    }
  });
  _IF.tick=()=>{
    _IF.state=0;
    if(!_queueSize){
      _IF.cache=null;
      _tickNum++;
      return
    }
    _external=0;
    _IF.wasInterrupted=!0;
    let element,
    maxDequeueId=_enqueueId;
    while(_dequeueId<=maxDequeueId){
      element=_element=_interrupted[_dequeueId];
      if(element[4]<=_tickNum){
        if(element[5]>0){
          element[5]--;
          _IF.phase=element[0];
          _IF.cache=element[1];
          element[2](...element[3])
        }
        delete _interrupted[_dequeueId++];
        _queueSize--
      }else{
        delete _interrupted[_dequeueId++];
        _interrupted[++_enqueueId]=element
      }
    }
    _IF.state=0;
    _IF.cache=null;
    _IF.wasInterrupted=!1;
    _external=1;
    _tickNum++
  }
}
{
  let _EM=EventManager,
  _NOOP=NOOP,
  _primaryInstallCursor=0,
  _primaryActiveEvents=[],
  _activeEvents=null,
  _eventRegistry=null,
  _resetCursor=0,
  _setupCursor=0;
  _EM.primarySetup=()=>{
    if(_EM.isPrimarySetupDone){
      return
    }
    _eventRegistry=Configuration.EVENT_REGISTRY;
    _activeEvents=Configuration.ACTIVE_EVENTS;
    let thisConfig=Configuration.event_manager,
    isInterruptionFrameworkEnabled=!!thisConfig.is_interruption_framework_enabled,
    defaultRetryDelay=thisConfig.default_retry_delay_ticks|0;
    defaultRetryDelay=defaultRetryDelay&~(defaultRetryDelay>>31);
    let defaultRetryLimit=thisConfig.default_retry_limit_ticks|0;
    defaultRetryLimit=(defaultRetryLimit&~(defaultRetryLimit>>31))+(-defaultRetryLimit>>31)+1;
    let delegator=_EM.delegator,
    isEventActive=_EM.isEventActive,
    unregisteredActiveEvents=_EM.unregisteredActiveEvents,
    activeEventsNum=_activeEvents.length,
    index=0;
    while(index<activeEventsNum){
      let listEntry=_activeEvents[index],
      eventName=listEntry;
      if(listEntry instanceof Array){
        eventName=listEntry[0]
      }
      let registryEntry=_eventRegistry[eventName];
      if(registryEntry===void 0){
        unregisteredActiveEvents[unregisteredActiveEvents.length]=eventName;
        index++;
        continue
      }
      if(eventName==="tick"){
        index++;
        continue
      }
      _primaryActiveEvents[_primaryActiveEvents.length]=eventName;
      isEventActive[eventName]=!0;
      if(!(registryEntry instanceof Array)){
        registryEntry=_eventRegistry[eventName]=[!1]
      }
      let interruptionStatus=!!registryEntry[1];
      if(isInterruptionFrameworkEnabled&interruptionStatus){
        let delay=registryEntry[2];
        if(delay==null){
          delay=defaultRetryDelay
        }
        delay|=0;
        let limit=registryEntry[3];
        if(limit==null){
          limit=defaultRetryLimit
        }
        limit|=0;
        let _IF=InterruptionFramework;
        delegator[eventName]=_NOOP;
        globalThis[eventName]=function handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
          _IF.state=1;
          _IF.handler=handler;
          _IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
          _IF.delay=delay;
          _IF.limit=limit;
          _IF.phase=400000;
          try{
            return delegator[eventName](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
          }finally{
            _IF.state=0
          }
        }
      }else{
        delegator[eventName]=_NOOP;
        globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
          return delegator[eventName](arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
        }
      }
      index++
    }
    isEventActive.tick=!0
  };
  _EM.primaryInstall=()=>{
    let delegator=_EM.delegator,
    activeEventsNum=_primaryActiveEvents.length;
    while(_primaryInstallCursor<activeEventsNum){
      let eventName=_primaryActiveEvents[_primaryInstallCursor];
      Object.defineProperty(globalThis,eventName,{
        configurable:!0,
        set:fn=>{
          if(fn instanceof Function){
            delegator[eventName]=fn
          }else{
            delegator[eventName]=_NOOP
          }
        }
      });
      _primaryInstallCursor++
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          delegator.tick=fn
        }else{
          delegator.tick=_NOOP
        }
      }
    })
  };
  _EM.establish=()=>{
    if(_EM.established){
      return
    }
    _activeEvents=Configuration.ACTIVE_EVENTS;
    _EM.invalidActiveEvents=[];
    _resetCursor=0;
    _setupCursor=0;
    _EM.established=!0
  };
  _EM.resetHandlers=()=>{
    let delegator=_EM.delegator,
    activeEventsNum=_primaryActiveEvents.length;
    while(_resetCursor<activeEventsNum){
      delegator[_primaryActiveEvents[_resetCursor]]=_NOOP;
      _resetCursor++
    }
  };
  _EM.setupFallbacks=()=>{
    let isEventActive=_EM.isEventActive,
    activeEventsNum=_activeEvents.length;
    while(_setupCursor<activeEventsNum){
      let listEntry=_activeEvents[_setupCursor],
      eventName=listEntry;
      if(listEntry instanceof Array){
        eventName=listEntry[0]
      }
      if(eventName==="tick"){
        _setupCursor++;
        continue
      }
      if(isEventActive[eventName]){
        let fallbackValue;
        if(listEntry instanceof Array){
          fallbackValue=listEntry[1]
        }
        if(fallbackValue===void 0){
          fallbackValue=_eventRegistry[eventName][0]
        }else if(fallbackValue==="undefined"){
          fallbackValue=void 0
        }
        api.setCallbackValueFallback(eventName,fallbackValue)
      }else{
        _EM.invalidActiveEvents[_EM.invalidActiveEvents.length]=eventName
      }
      _setupCursor++
    }
  }
}
{
  let _TM=TickMultiplexer,
  _IF=InterruptionFramework,
  _EM=EventManager,
  _NOOP=NOOP,
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
  let dispatch=()=>{
    _IF.tick();
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
      set:fn=>{
        if(fn instanceof Function){
          _main=fn
        }else{
          _main=_NOOP
        }
      }
    });
    _boot=_EM.delegator.tick;
    _EM.delegator.tick=dispatch;
    _installed=!0
  };
  _TM.finalize=()=>{
    if(_finalized){
      return
    }
    let delegator=_EM.delegator;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          delegator.tick=fn
        }else{
          delegator.tick=_NOOP
        }
      }
    });
    delegator.tick=_main;
    _boot=_NOOP;
    _TM.init=_NOOP;
    _finalized=!0
  }
}
{
  let _JM=JoinManager,
  _IF=InterruptionFramework,
  _EM=EventManager,
  _OM=BootManager,
  _NOOP=NOOP,
  _resetOnReboot=!0,
  _maxDequeue=1,
  _main=null,
  _buffer=null,
  _joinState=null,
  _dequeueCursor=0,
  _installed=!1,
  _finalized=!1;
  _JM.establish=()=>{
    if(_JM.established){
      return
    }
    let thisConfig=Configuration.join_manager;
    _resetOnReboot=!!thisConfig.reset_on_reboot;
    _maxDequeue=thisConfig.max_dequeue_per_tick|0;
    _maxDequeue=(_maxDequeue&~(_maxDequeue>>31))+(-_maxDequeue>>31)+1;
    _main=_NOOP;
    _buffer=[];
    if(_resetOnReboot|!_joinState){
      _joinState={}
    }
    _dequeueCursor=0;
    _installed=!1;
    _finalized=!1;
    _JM.established=!0
  };
  let dispatch=(playerId,fromGameReset)=>{
    _buffer[_buffer.length]=[playerId,fromGameReset];
    _joinState[playerId]=1
  };
  _JM.install=()=>{
    if(_installed){
      return
    }
    _EM.delegator.onPlayerJoin=dispatch;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          _main=fn
        }else{
          _main=_NOOP
        }
      }
    });
    _installed=!0
  };
  _JM.bufferPlayers=()=>{
    if(_resetOnReboot|_OM.isPrimaryBoot){
      let playerIds=api.getPlayerIds(),
      playersNum=playerIds.length,
      index=0;
      while(index<playersNum){
        let playerId=playerIds[index];
        if(!_joinState[playerId]){
          _buffer[_buffer.length]=[playerId,!1];
          _joinState[playerId]=1
        }
        index++
      }
    }
  };
  _JM.dequeue=()=>{
    let budget=_maxDequeue;
    while(_dequeueCursor<_buffer.length&budget>0){
      let args=_buffer[_dequeueCursor],
      playerId=args[0];
      if(_joinState[playerId]!==2){
        _dequeueCursor++;
        _joinState[playerId]=2;
        _IF.state=1;
        _IF.handler=_main;
        _IF.args=args;
        _IF.delay=0;
        _IF.limit=1;
        _IF.phase=400000;
        try{
          _main(playerId,args[1])
        }catch(error){
          _IF.state=0;
          api.broadcastMessage("Code Loader: JoinManager: "+error.name+": "+error.message,{color:"#ff9d87"})
        }
        _IF.state=0;
        budget--;
        _dequeueCursor--
      }
      _dequeueCursor++
    }
    return _dequeueCursor>=_buffer.length
  };
  _JM.finalize=()=>{
    if(_finalized){
      return
    }
    let delegator=_EM.delegator;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          delegator.onPlayerJoin=fn
        }else{
          delegator.onPlayerJoin=_NOOP
        }
      }
    });
    delegator.onPlayerJoin=_main;
    _buffer=null;
    _finalized=!0
  }
}
{
  let _BM=BlockManager,
  _OM=BootManager,
  _defaultLockedStatus=!0,
  _defaultExecutionStatus=!0,
  _maxRegistrations=1,
  _maxRequests=1,
  _maxExecutions=1,
  _maxErrors=0,
  _blockLockedStatus=null,
  _isChunkLoaded=null,
  _hasAnyBlocksToEval=0,
  _registerCursor=0,
  _errorCursor=0,
  _executionCursor=0,
  _finalized=!1;
  _BM.establish=()=>{
    if(_BM.established){
      return
    }
    _BM.blocks=Configuration.BLOCKS instanceof Array?Configuration.BLOCKS.slice():[];
    let thisConfig=Configuration.block_manager;
    _defaultLockedStatus=!!thisConfig.default_locked_status;
    _defaultExecutionStatus=!!thisConfig.default_execution_status;
    _maxRegistrations=thisConfig.max_registrations_per_tick|0;
    _maxRegistrations=(_maxRegistrations&~(_maxRegistrations>>31))+(-_maxRegistrations>>31)+1;
    _maxRequests=thisConfig.max_chunk_requests_per_tick|0;
    _maxRequests=(_maxRequests&~(_maxRequests>>31))+(-_maxRequests>>31)+1;
    _maxExecutions=thisConfig.max_executions_per_tick|0;
    _maxExecutions=(_maxExecutions&~(_maxExecutions>>31))+(-_maxExecutions>>31)+1;
    _maxErrors=thisConfig.max_errors_count|0;
    _maxErrors=_maxErrors&~(_maxErrors>>31);
    _BM.phase=0;
    _blockLockedStatus={};
    _isChunkLoaded={};
    _BM.errors=[null];
    _hasAnyBlocksToEval=0;
    _registerCursor=0;
    _executionCursor=0;
    _errorCursor=0;
    _finalized=!1;
    _BM.established=!0
  };
  let register=()=>{
    let blocks=_BM.blocks,
    blocksNum=blocks.length,
    requestBudget=_maxRequests,
    registerBudget=_maxRegistrations;
    while(_registerCursor<blocksNum&registerBudget>0&requestBudget>0){
      let block=blocks[_registerCursor].slice(),
      x=block[0];
      x=(x|0)-(x<(x|0));
      let y=block[1];
      y=(y|0)-(y<(y|0));
      let z=block[2];
      z=(z|0)-(z<(z|0));
      let blockPositionId=x+"|"+y+"|"+z,
      lockedStatus=block[3];
      if(lockedStatus==null){
        _blockLockedStatus[blockPositionId]=_defaultLockedStatus
      }else{
        _blockLockedStatus[blockPositionId]=!!lockedStatus
      }
      let evalStatus=block[4];
      if(evalStatus==null){
        evalStatus=block[3]=_defaultExecutionStatus
      }else{
        evalStatus=block[3]=!!evalStatus
      }
      if(evalStatus){
        let chunkId=(x>>5)+"|"+(y>>5)+"|"+(z>>5);
        if(_isChunkLoaded[chunkId]===void 0){
          let blockName=block[4]=api.getBlock(x,y,z);
          if(blockName==="Unloaded"){
            _isChunkLoaded[chunkId]=!1;
            requestBudget--
          }else{
            _isChunkLoaded[chunkId]=!0
          }
        }else{
          block[4]="Unloaded"
        }
        _hasAnyBlocksToEval=1
      }else{
        block[4]=null
      }
      blocks[_registerCursor]=block;
      registerBudget--;
      _registerCursor++
    }
    _BM.phase=(_registerCursor>=blocksNum)<<1|_hasAnyBlocksToEval^1
  };
  let execute=()=>{
    let blocks=_BM.blocks,
    errors=_BM.errors,
    blocksNum=blocks.length,
    executionBudget=_maxExecutions;
    while(_executionCursor<blocksNum&executionBudget>0){
      let block=blocks[_executionCursor];
      if(!block[3]){
        _executionCursor++;
        continue
      }
      let x=block[0],
      y=block[1],
      z=block[2];
      if(block[4]==="Unloaded"){
        let blockName=api.getBlock(x,y,z);
        if(blockName==="Unloaded"){
          break
        }
        block[4]=blockName
      }
      try{
        let code=api.getBlockData(x,y,z)?.persisted?.shared?.text;
        (0,eval)(code)
      }catch(error){
        _errorCursor++;
        errors[_errorCursor*+(errors.length-1<_maxErrors)]=[x,y,z,error.name,error.message]
      }
      executionBudget--;
      _executionCursor++
    }
    _BM.phase=2|_executionCursor>=blocksNum
  };
  _BM.init=()=>{
    if(_BM.phase<2){return register()}
    if(_BM.phase===2){execute()}
  };
  _BM.finalize=()=>{
    if(_finalized){
      return
    }
    _BM.errors[0]=null;
    _isChunkLoaded=null;
    _finalized=!0
  };
  _BM.isBlockLocked=position=>{
    let x=position[0],
    y=position[1],
    z=position[2],
    blockPositionId=(x|0)-(x<(x|0))+"|"+((y|0)-(y<(y|0)))+"|"+((z|0)-(z<(z|0)));
    if(_blockLockedStatus[blockPositionId]!==!1){
      return!_OM.isRunning
    }
    return !1
  }
}  
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
  _showExecutedBlocks=!1,
  _tickNum=-1,
  _loadTimeTicks=-1;
  _OM.logLoadTime=showErrors=>{
    let errorsNum=_BM.errors.length-1,
    logs="Code Loader: BootManager: Code was loaded in "+_loadTimeTicks*50+" ms";
    if(errorsNum===0){
      logs+=showErrors?" with 0 errors.":".";
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle.success??{}
      }])
    }else{
      logs+=showErrors?" with "+errorsNum+" error"+(errorsNum===1?"":"s")+".":".";
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle.warning??{}
      }])
    }
  };
  _OM.logExecutedBlocks=()=>{
    let blocks=_BM.blocks,
    blocksNum=blocks.length,
    logs="",
    count=0,
    index=0;
    while(index<blocksNum){
      let block=blocks[index];
      if(block[3]){
        logs+='\n"'+block[4]+'" at ('+block[0]+", "+block[1]+", "+block[2]+")";
        count++
      }
      index++
    }
    logs="Code Loader: BlockManager: Executed "+count+" block"+(count===1?"":"s")+":"+logs;
    api.broadcastMessage([{
      str:logs,
      style:(_BM.errors.length-1?_OM.logStyle.warning:_OM.logStyle.success)??{}
    }])
  };
  _OM.logErrors=()=>{
    let errors=_BM.errors,
    errorsNum=errors.length-1;
    if(errorsNum>0){
      let logs="Code Loader: BlockManager: Code execution error"+(errorsNum===1?"":"s")+":",
      index=1;
      while(index<=errorsNum){
        let error=errors[index];
        logs+="\n"+error[3]+" at ("+error[0]+", "+error[1]+", "+error[2]+"): "+error[4];
        index++
      }
      api.broadcastMessage([{
        str:logs,
        style:_OM.logStyle.error??{}
      }])
    }
  };
  _OM.logBootResult=(showLoadTime,showErrors,showExecutedBlocks)=>{
    if(_EM.unregisteredActiveEvents.length){
      api.broadcastMessage([{
        str:"Code Loader: EventManager: Unregistered active events: \""+_EM.unregisteredActiveEvents.join("\", \"")+"\".",
        style:_OM.logStyle.warning??{}
      }])
    }
    if(_EM.invalidActiveEvents.length){
      api.broadcastMessage([{
        str:"Code Loader: EventManager: Invalid active events: \""+_EM.invalidActiveEvents.join("\", \"")+"\".",
        style:_OM.logStyle.warning??{}
      }])
    }
    if(showLoadTime){
      _OM.logLoadTime(showErrors)
    }
    if(showExecutedBlocks){
      _OM.logExecutedBlocks()
    }
    if(showErrors){
      _OM.logErrors()
    }
  };
  _OM.tick=()=>{
    _tickNum++;
    if(_OM.phase<6){
      if(_OM.phase===-2){
        if(_OM.isPrimaryBoot&!_EM.isPrimarySetupDone&_tickNum>20){
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
        _showExecutedBlocks=!!thisConfig.show_executed_blocks;
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
        if(_EM.isEventActive.onPlayerJoin){
          _JM.establish()
        }
        _BM.establish();
        _OM.phase=3
      }
      if(_OM.phase===3){
        if(_OM.isPrimaryBoot){
          _EM.primaryInstall()
        }else{
          _EM.resetHandlers()
        }
        _EM.setupFallbacks();
        _OM.phase=4
      }
      if(_OM.phase===4){
        if(_EM.isEventActive.onPlayerJoin){
          _JM.bufferPlayers();
          _JM.install()
        }
        _TM.install();
        _OM.phase=5
      }
      if(_OM.phase===5){
        _TM.init=_BM.init;
        _OM.phase=6;
        return
      }
    }
    if(_OM.phase===6){
      if(_BM.phase===3){
        _BM.finalize();
        _OM.phase=6+1+!_EM.isEventActive.onPlayerJoin
      }
    }
    if(_OM.phase===7){
      if(_JM.dequeue()){
        _JM.finalize();
        _OM.phase=8
      }
    }
    if(_OM.phase===8){
      _TM.finalize();
      _BM.phase=4;
      _CL.isPrimaryBoot=_OM.isPrimaryBoot=!1;
      _CL.isRunning=_OM.isRunning=!1;
      _OM.phase=-1;
      _loadTimeTicks=_tickNum-_bootDelayTicks+1;
      _OM.logBootResult(_showLoadTime,_showErrors,_showExecutedBlocks)
    }
  }
}
{
  let _CL=CodeLoader,
  _EM=EventManager,
  _BM=BlockManager,
  _OM=BootManager;
  _CL.configuration=Configuration;
  _CL.isBlockLocked=position=>{
    return position instanceof Array&&position.length===3&&_BM.isBlockLocked(position)
  };
  _CL.reboot=()=>{
    if(!_OM.isRunning){
      _EM.delegator.tick=_OM.tick;
      _OM.phase=0
    }else{
      api.broadcastMessage([{
        str:"Code Loader: BootManager: Wait until current running boot session is finished.",
        style:_OM.logStyle.warning??{}
      }])
    }
  };
  _CL.logBootResult=(showLoadTime=!0,showErrors=!0,showExecutedBlocks=!1)=>{
    _OM.logBootResult(showLoadTime,showErrors,showExecutedBlocks)
  };
  _CL.logLoadTime=(showErrors=!0)=>{
    _OM.logLoadTime(showErrors)
  };
  _CL.logErrors=()=>{
    _OM.logErrors()
  };
  _CL.logExecutedBlocks=()=>{
    _OM.logExecutedBlocks()
  }
}
{
  let delegator=EventManager.delegator;
  delegator.tick=BootManager.tick;
  globalThis.tick=function(){
    delegator.tick()
  }
}
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
  toSealNum=toSeal.length,
  index=0;
  while(index<toSealNum){
    Object.seal(toSeal[index]);
    index++
  }
  Object.freeze(Configuration.EVENT_REGISTRY);
  EventManager.isPrimarySetupDone=!0;
  BootManager.phase=0
}catch(error){
  EventManager.primarySetupError=[error.name,error.message]
}
globalThis.IF=InterruptionFramework;
globalThis.CL=CodeLoader;
void 0;

