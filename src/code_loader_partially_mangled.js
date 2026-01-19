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


const _NOOP=function(){},
_PREFIX="Code Loader",
_log=(message,type)=>{
  let styledText=_log.STYLES[type];
  styledText[0].str=message;
  api.broadcastMessage(styledText)
},
InterruptionFramework={
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
EventManager={
  isPrimarySetupDone:!1,
  primarySetupError:null,
  delegator:{},
  isEventActive:{},
  unregisteredActiveEvents:[],
  invalidActiveEvents:null,
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
  executeBlockData:null,
  executeStorageData:null,
  phase:-1,
  blocks:null,
  errors:null,
  isChestData:!1,
  registryLoaded:!1,
  established:!1,
  establish:null,
  finalize:null
},
BootManager={
  phase:-2,
  isPrimaryBoot:!0,
  isRunning:!1,
  bootLogs:null,
  errorLogs:null,
  executionLogs:null,
  completeLogs:null,
  tick:null
},
StorageManager={
  create:null,
  check:null,
  build:null,
  dispose:null,
  tick:null
},
CodeLoader={
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
  let _IF=InterruptionFramework,
  _interrupted={},
  _emptyArgs=[],
  _external=1,
  _element=[],
  _enqueueId=1,
  _dequeueId=1,
  _queueSize=0;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(_external){
        if(_IF.state){
          _interrupted[_enqueueId++]=[_IF.fn,_IF.args,_IF.limit,_IF.phase,_IF.cache];
          _queueSize++
        }
      }else{
        _element[3]=_IF.phase;
        _IF.wasInterrupted=!1;
        _external=1
      }
      _IF.state=0;
      return"InternalError"
    }
  });
  _IF.tick=()=>{
    _IF.state=0;
    if(!_queueSize){
      _IF.args=_emptyArgs;
      _IF.cache=null;
      return
    }
    _external=0;
    _IF.wasInterrupted=!0;
    while(_dequeueId<_enqueueId){
      _element=_interrupted[_dequeueId];
      if(_element[2]>0){
        _element[2]--;
        _IF.phase=_element[3];
        _IF.cache=_element[4];
        _element[0](..._element[1])
      }
      delete _interrupted[_dequeueId++];
      _queueSize--
    }
    _IF.state=0;
    _IF.args=_emptyArgs;
    _IF.cache=null;
    _IF.wasInterrupted=!1;
    _external=1
  }
}
{
  let _CF=configuration,
  _IF=InterruptionFramework,
  _EM=EventManager,
  api_setCallbackValueFallback=api.setCallbackValueFallback,
  _primaryInstallCursor=0,
  _primaryActiveEvents=[],
  _activeEvents,
  _eventRegistry,
  _resetCursor,
  _setupCursor;
  _EM.primarySetup=()=>{
    if(_EM.isPrimarySetupDone){
      return
    }
    _eventRegistry=_CF.EVENT_REGISTRY;
    _activeEvents=_CF.ACTIVE_EVENTS;
    let thisConfig=_CF.event_manager,
    isFrameworkEnabled=!!thisConfig.is_framework_enabled,
    defaultRetryLimit=thisConfig.default_retry_limit|0;
    defaultRetryLimit=(defaultRetryLimit&~(defaultRetryLimit>>31))+(-defaultRetryLimit>>31)+1;
    let delegator=_EM.delegator,
    isEventActive=_EM.isEventActive,
    unregisteredActiveEvents=_EM.unregisteredActiveEvents,
    primaryIndex=0,
    activeEventsCount=_activeEvents.length;
    while(primaryIndex<activeEventsCount){
      let eventName=_activeEvents[primaryIndex];
      if(eventName instanceof Array){
        eventName=eventName[0]
      }
      if(eventName==="tick"){
        primaryIndex++;
        continue
      }
      let registryEntry=_eventRegistry[eventName];
      if(registryEntry===void 0){
        unregisteredActiveEvents[unregisteredActiveEvents.length]=eventName;
        primaryIndex++;
        continue
      }
      _primaryActiveEvents[_primaryActiveEvents.length]=eventName;
      isEventActive[eventName]=!0;
      if(!(registryEntry instanceof Array)){
        registryEntry=_eventRegistry[eventName]=[!1]
      }
      let interruptionStatus=!!registryEntry[1];
      if(isFrameworkEnabled&&interruptionStatus){
        let retryLimit=registryEntry[2];
        if(retryLimit==null){
          retryLimit=defaultRetryLimit
        }
        retryLimit|=0;
        delegator[eventName]=_NOOP;
        globalThis[eventName]=function handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
          _IF.state=1;
          _IF.fn=handler;
          _IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
          _IF.limit=retryLimit;
          _IF.phase=1048576;
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
      primaryIndex++
    }
    isEventActive.tick=!0
  };
  _EM.primaryInstall=()=>{
    let delegator=_EM.delegator,
    activeEventsCount=_primaryActiveEvents.length;
    while(_primaryInstallCursor<activeEventsCount){
      let eventName=_primaryActiveEvents[_primaryInstallCursor];
      Object.defineProperty(globalThis,eventName,{
        configurable:!0,
        set:fn=>{
          if(fn instanceof Function){
            delegator[eventName]=fn
          }else{
            delegator[eventName]=_NOOP
          }
        },
        get:()=>delegator[eventName]
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
      },
      get:()=>delegator.tick
    })
  };
  _EM.establish=()=>{
    if(_EM.established){
      return
    }
    _activeEvents=_CF.ACTIVE_EVENTS;
    _EM.invalidActiveEvents=[];
    _resetCursor=0;
    _setupCursor=0;
    _EM.established=!0
  };
  _EM.resetHandlers=()=>{
    let delegator=_EM.delegator,
    activeEventsCount=_primaryActiveEvents.length;
    while(_resetCursor<activeEventsCount){
      delegator[_primaryActiveEvents[_resetCursor]]=_NOOP;
      _resetCursor++
    }
  };
  _EM.setupFallbacks=()=>{
    let isEventActive=_EM.isEventActive,
    activeEventsCount=_activeEvents.length,
    eventEntry,eventName;
    while(_setupCursor<activeEventsCount){
      eventEntry=_activeEvents[_setupCursor];
      eventName=eventEntry;
      if(eventEntry instanceof Array){
        eventName=eventEntry[0]
      }
      if(eventName==="tick"){
        _setupCursor++;
        continue
      }
      if(isEventActive[eventName]){
        let fallbackValue;
        if(eventEntry instanceof Array){
          fallbackValue=eventEntry[1]
        }
        if(fallbackValue===void 0){
          fallbackValue=_eventRegistry[eventName][0]
        }else if(fallbackValue==="undefined"){
          fallbackValue=void 0
        }
        api_setCallbackValueFallback(eventName,fallbackValue)
      }else{
        _EM.invalidActiveEvents[_EM.invalidActiveEvents.length]=eventName
      }
      _setupCursor++
    }
  }
}
{
  let _IF=InterruptionFramework,
  _EM=EventManager,
  _TM=TickMultiplexer,
  _boot,
  _main,
  _installed,
  _finalized;
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
  let _dispatch=()=>{
    _IF.tick();
    _boot();
    _TM.init();
    _main(50)
  };
  _TM.install=()=>{
    if(_installed){
      return
    }
    let delegator=_EM.delegator;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          _main=fn
        }else{
          _main=_NOOP
        }
      },
      get:()=>delegator.tick
    });
    _boot=_EM.delegator.tick;
    _EM.delegator.tick=_dispatch;
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
      },
      get:()=>delegator.tick
    });
    delegator.tick=_main;
    _boot=_NOOP;
    _TM.init=_NOOP;
    _finalized=!0
  }
}
{
  let _CF=configuration,
  _IF=InterruptionFramework,
  _EM=EventManager,
  _JM=JoinManager,
  _OM=BootManager,
  _JMprefix=_PREFIX+" JM: ",
  _resetOnReboot,
  _maxDequeuePerTick,
  _main,
  _buffer,
  _joinState,
  _dequeueCursor,
  _installed,
  _finalized;
  _JM.establish=()=>{
    if(_JM.established){
      return
    }
    let thisConfig=_CF.join_manager;
    _resetOnReboot=!!thisConfig.reset_on_reboot;
    _maxDequeuePerTick=thisConfig.max_dequeue_per_tick|0;
    _maxDequeuePerTick=(_maxDequeuePerTick&~(_maxDequeuePerTick>>31))+(-_maxDequeuePerTick>>31)+1;
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
  let _dispatch=playerId=>{
    _buffer[_buffer.length]=playerId;
    _joinState[playerId]=1
  };
  _JM.install=()=>{
    if(_installed){
      return
    }
    let delegator=_EM.delegator;
    delegator.onPlayerJoin=_dispatch;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          _main=fn
        }else{
          _main=_NOOP
        }
      },
      get:()=>delegator.onPlayerJoin
    });
    _installed=!0
  };
  _JM.bufferPlayers=()=>{
    if(_resetOnReboot|_OM.isPrimaryBoot){
      let playerIds=api.getPlayerIds(),
      index=0,
      playerId;
      while(playerId=playerIds[index]){
        if(!_joinState[playerId]){
          _buffer[_buffer.length]=playerId;
          _joinState[playerId]=1
        }
        index++
      }
    }
  };
  _JM.dequeue=()=>{
    let budget=_maxDequeuePerTick,
    playerId;
    while(_dequeueCursor<_buffer.length&&budget>0){
      playerId=_buffer[_dequeueCursor];
      if(_joinState[playerId]!==2){
        _dequeueCursor++;
        _joinState[playerId]=2;
        _IF.state=1;
        _IF.fn=_main;
        _IF.args=[playerId];
        _IF.limit=2;
        _IF.phase=1048576;
        try{
          _main(playerId)
        }catch(error){
          _IF.state=0;
          _log(_JMprefix+error.name+": "+error.message,0)
        }
        _IF.state=0;
        _dequeueCursor--;
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
    let delegator=_EM.delegator;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{
        if(fn instanceof Function){
          delegator.onPlayerJoin=fn
        }else{
          delegator.onPlayerJoin=_NOOP
        }
      },
      get:()=>delegator.onPlayerJoin
    });
    delegator.onPlayerJoin=_main;
    _buffer=null;
    _finalized=!0
  }
}
{
  let _CF=configuration,
  _BM=BlockManager,
  api_getBlock=api.getBlock,
  api_getBlockId=api.getBlockId,
  api_getBlockData=api.getBlockData,
  api_getStandardChestItems=api.getStandardChestItems,
  _maxExecutionsPerTick,
  _maxErrorsCount,
  _errorIndex,
  _blockIndex,
  _registryItems,
  _registrySlotIndex,
  _coordsIndex,
  _partition,
  _finalized;
  _BM.establish=()=>{
    if(_BM.established){
      return
    }
    _BM.blocks=_CF.BLOCKS instanceof Array?_CF.BLOCKS:[];
    let thisConfig=_CF.block_manager;
    _BM.isChestData=!!thisConfig.is_chest_data;
    _maxExecutionsPerTick=thisConfig.max_executions_per_tick|0;
    _maxExecutionsPerTick=(_maxExecutionsPerTick&~(_maxExecutionsPerTick>>31))+(-_maxExecutionsPerTick>>31)+1;
    _maxErrorsCount=thisConfig.max_errors_count|0;
    _maxErrorsCount=_maxErrorsCount&~(_maxErrorsCount>>31);
    _BM.phase=0;
    _BM.errors=[null];
    _errorIndex=0;
    _blockIndex=0;
    _BM.registryLoaded=!1;
    _registryItems=null;
    _registrySlotIndex=1;
    _coordsIndex=0;
    _partition=0;
    _finalized=!1;
    _BM.established=!0
  };
  _BM.executeBlockData=()=>{
    let blocks=_BM.blocks,
    errors=_BM.errors,
    budget=_maxExecutionsPerTick,
    blocksCount=blocks.length,
    block,x,y,z,code;
    while(_blockIndex<blocksCount){
      block=blocks[_blockIndex];
      if(!block||block.length<3){
        _blockIndex++;
        continue
      }
      x=block[0];
      y=block[1];
      z=block[2];
      if((block[3]=api_getBlock(x,y,z))==="Unloaded"){
        return
      }
      code=api_getBlockData(x,y,z)?.persisted?.shared?.text;
      try{
        (0,eval)(code)
      }catch(error){
        _errorIndex++;
        errors[_errorIndex*+(errors.length-1<_maxErrorsCount)]=[error.name,error.message,x,y,z]
      }
      _blockIndex++;
      budget--;
      if(budget<=0){
        return
      }
    }
    _BM.phase=1
  };
  _BM.executeStorageData=()=>{
    let errors=_BM.errors;
    if(!_BM.registryLoaded){
      let registryPosition=_BM.blocks[0];
      if(!registryPosition||registryPosition.length<3){
        _BM.phase=1;
        return
      }
      if(api_getBlockId(registryPosition[0],registryPosition[1],registryPosition[2])===1){
        return
      }
      _registryItems=api_getStandardChestItems(registryPosition);
      if(!_registryItems[0]?.attributes?.customAttributes?.region){
        _BM.phase=1;
        return
      }
      _BM.registryLoaded=!0
    }
    let budget=_maxExecutionsPerTick,
    registryItem,coordsList,coordsLength,x,y,z,storageItems,code,storageSlotBaseIndex,chunkIndex,storageItem;
    while(registryItem=_registryItems[_registrySlotIndex]){
      coordsList=registryItem.attributes.customAttributes._;
      coordsLength=coordsList.length-2;
      while(_coordsIndex<coordsLength){
        x=coordsList[_coordsIndex];
        y=coordsList[_coordsIndex+1];
        z=coordsList[_coordsIndex+2];
        if(api_getBlockId(x,y,z)===1){
          return
        }
        storageItems=api_getStandardChestItems([x,y,z]);
        while(_partition<4){
          code="";
          storageSlotBaseIndex=_partition*9;
          chunkIndex=0;
          while(chunkIndex<9&&(storageItem=storageItems[storageSlotBaseIndex+chunkIndex])){
            code+=storageItem.attributes.customAttributes._;
            chunkIndex++
          }
          try{
            (0,eval)(code)
          }catch(error){
            _errorIndex++;
            errors[_errorIndex*+(errors.length-1<_maxErrorsCount)]=[error.name,error.message,x,y,z,_partition]
          }
          _partition++;
          budget--;
          if(budget<=0){
            return
          }
        }
        _partition=0;
        _coordsIndex+=3
      }
      _coordsIndex=0;
      _registrySlotIndex++
    }
    _BM.phase=1
  };
  _BM.finalize=()=>{
    if(_finalized){
      return
    }
    _BM.errors[0]=null;
    _registryItems=null;
    _finalized=!0
  }
}
{
  let _CF=configuration,
  _EM=EventManager,
  _TM=TickMultiplexer,
  _JM=JoinManager,
  _BM=BlockManager,
  _OM=BootManager,
  _CL=CodeLoader,
  _EMprefix=_PREFIX+" EM: ",
  _BMprefix=_PREFIX+" BM: ",
  _OMprefix=_PREFIX+" OM: ",
  _tickNum=-1,
  _bootDelayTicks,
  _showBootLogs,
  _showErrorLogs,
  _showExecutionLogs,
  _loadTimeTicks;
  _OM.bootLogs=showErrors=>{
    let message="Code was loaded in "+_loadTimeTicks*50+" ms",
    errorsCount=_BM.errors.length-1;
    if(showErrors){
      message+=errorsCount>0?" with "+errorsCount+" error"+(errorsCount===1?"":"s")+".":" with 0 errors."
    }else{
      message+="."
    }
    _log(_OMprefix+message,1+(errorsCount<=0))
  };
  _OM.errorLogs=showSuccess=>{
    let errors=_BM.errors,
    errorsCount=errors.length-1;
    if(errorsCount>0){
      let message="Code execution error"+(errorsCount===1?"":"s")+":",
      error;
      if(_BM.isChestData){
        for(let index=1;index<=errorsCount;index++){
          error=errors[index];
          message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+") in partition ("+error[5]+"): "+error[1]
        }
      }else{
        for(let index=1;index<=errorsCount;index++){
          error=errors[index];message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+"): "+error[1]
        }
      }
      _log(_BMprefix+message,0)
    }else if(showSuccess){
      _log(_BMprefix+"No code execution errors.",2)
    }
  };
  _OM.executionLogs=()=>{
    let blocks=_BM.blocks,
    message="",
    block;
    if(_BM.isChestData){
      if(_BM.registryLoaded){
        block=blocks[0];
        message="Executed storage data at ("+block[0]+", "+block[1]+", "+block[2]+")."
      }else{
        message="No storage data found."
      }
    }else{
      let amount=0,
      blocksCount=blocks.length;
      for(let index=0;index<blocksCount;index++){
        block=blocks[index];
        if(block[3]){
          message+='\n"'+block[3]+'" at ('+block[0]+", "+block[1]+", "+block[2]+")";
          amount++
        }
      }
      message="Executed "+amount+" block"+(amount===1?"":"s")+" data"+(amount===0?".":":")+message
    }
    _log(_BMprefix+message,3)
  };
  _OM.completeLogs=(showBoot,showErrors,showExecution)=>{
    if(_EM.unregisteredActiveEvents.length){
      _log(_EMprefix+'Unregistered active events: "'+_EM.unregisteredActiveEvents.join('", "')+'".',1)
    }
    if(_EM.invalidActiveEvents.length){
      _log(_EMprefix+'Invalid active events: "'+_EM.invalidActiveEvents.join('", "')+'".',1)
    }
    if(showBoot){
      _OM.bootLogs(showErrors)
    }
    if(showErrors){
      _OM.errorLogs(!showBoot)
    }
    if(showExecution){
      _OM.executionLogs()
    }
  };
  _OM.tick=()=>{
    _tickNum++;
    if(_OM.phase<6){
      if(_OM.phase===-2){
        if(_OM.isPrimaryBoot&&!_EM.isPrimarySetupDone&&_tickNum>20){
          let criticalError=_EM.primarySetupError,
          message=_EMprefix+"Error on primary setup - "+criticalError?.[0]+": "+criticalError?.[1]+".",
          playerIds=api.getPlayerIds(),
          index=0,
          playerId;
          while(playerId=playerIds[index]){
            if(api.checkValid(playerId)){
              api.kickPlayer(playerId,message)
            }
            index++
          }
        }
        return
      }
      if(_OM.phase===0){
        _tickNum=0;
        let thisConfig=_CF.boot_manager;
        _bootDelayTicks=(thisConfig.boot_delay_ms|0)*.02|0;
        _bootDelayTicks=_bootDelayTicks&~(_bootDelayTicks>>31);
        _showBootLogs=!!thisConfig.show_boot_logs;
        _showErrorLogs=!!thisConfig.show_error_logs;
        _showExecutionLogs=!!thisConfig.show_execution_logs;
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
          _JM.install();
          _JM.bufferPlayers()
        }
        _TM.install();
        _OM.phase=5
      }
      if(_OM.phase===5){
        if(_BM.isChestData){
          _TM.init=_BM.executeStorageData
        }else{
          _TM.init=_BM.executeBlockData
        }
        _OM.phase=6;
        return
      }
    }
    if(_OM.phase===6){
      if(_BM.phase===1){
        _BM.finalize();
        _BM.phase=-1;
        _OM.phase=7+!_EM.isEventActive.onPlayerJoin
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
      _CL.isPrimaryBoot=_OM.isPrimaryBoot=!1;
      _CL.isRunning=_OM.isRunning=!1;
      _OM.phase=-1;
      _loadTimeTicks=_tickNum-_bootDelayTicks+1;
      _OM.completeLogs(_showBootLogs,_showErrorLogs,_showExecutionLogs)
    }
  }
}
{
  let _SM=StorageManager,
  _SMprefix=_PREFIX+" SM: ",
  api_setBlock=api.setBlock,
  api_getBlockData=api.getBlockData,
  api_getStandardChestItems=api.getStandardChestItems,
  api_setStandardChestItemSlot=api.setStandardChestItemSlot,
  _taskQueue=[],
  _taskIndex=0,
  _taskPhase=1,
  _blockType="Bedrock",
  _itemType="Boat",
  _storageItemData={customAttributes:{_:null}},
  _registryItemData={customAttributes:{_:[]}},
  _storageCoordsBuffer=_registryItemData.customAttributes._,
  _dataChunksBuffer=[],
  _storageX,
  _storageY,
  _storageZ,
  _blockIndex,
  _partition,
  _storagePosition,
  _registrySlotIndex,
  _coordsList,
  _coordsIndex,
  _coordsLength;
  let _build=(blocks,registryPosition,lowX,lowY,lowZ,highX,highY,highZ,maxStorageUnitsPerTick)=>{
    let x=_storageX,
    y=_storageY,
    z=_storageZ;
    if(_taskPhase===1){
      _storageX=x=lowX;
      _storageY=y=lowY;
      _storageZ=z=lowZ;
      _blockIndex=0;
      _registrySlotIndex=1;
      _coordsLength=0;
      _taskPhase=2
    }
    let budget=maxStorageUnitsPerTick,
    blocksCount=blocks.length,
    rawData,rawStart,rawEnd,escapedData,escapedCursor,escapedDataEnd,escapedChunkEnd,backslashPosition,runLength,
    block,storageSlotBaseIndex,chunkIndex,chunksLength;
    while(_blockIndex<blocksCount){
      if(_taskPhase===2){
        x++;
        if(x>highX){
          x=lowX;
          z++;
          if(z>highZ){
            z=lowZ;
            y++
          }
        }
        api_setBlock(x,y,z,_blockType);
        _storageX=x;
        _storageY=y;
        _storageZ=z;
        _partition=0;
        _storagePosition=[x,y,z];
        _taskPhase=3
      }
      while(_partition<4&&_blockIndex<blocksCount){
        if(_taskPhase===3){
          block=blocks[_blockIndex];
          rawData=api_getBlockData(block[0],block[1],block[2])?.persisted?.shared?.text;
          if(rawData?.length>0){
            chunkIndex=0;
            rawStart=0;
            rawEnd=0;
            escapedData=JSON.stringify(rawData);
            escapedCursor=1;
            escapedDataEnd=escapedData.length-1;
            while(escapedCursor<escapedDataEnd){
              escapedChunkEnd=escapedCursor+1950;
              if(escapedChunkEnd>escapedDataEnd){
                escapedChunkEnd=escapedDataEnd
              }
              escapedChunkEnd-=escapedData[escapedChunkEnd-1]==="\\";
              while(escapedCursor<escapedChunkEnd){
                backslashPosition=escapedData.indexOf("\\",escapedCursor);
                if(backslashPosition===-1||backslashPosition>=escapedChunkEnd){
                  runLength=escapedChunkEnd-escapedCursor;
                  escapedCursor+=runLength;
                  rawEnd+=runLength;
                  break
                }
                if(backslashPosition>escapedCursor){
                  runLength=backslashPosition-escapedCursor;
                  escapedCursor+=runLength;
                  rawEnd+=runLength
                }
                escapedCursor+=2;
                rawEnd+=1
              }
              _dataChunksBuffer[chunkIndex++]=rawData.slice(rawStart,rawEnd);
              rawStart=rawEnd
            }
            _dataChunksBuffer.length=chunkIndex;
            _taskPhase=4
          }
        }
        if(_taskPhase===4){
          storageSlotBaseIndex=_partition*9;
          chunkIndex=0;
          chunksLength=_dataChunksBuffer.length;
          while(chunkIndex<chunksLength){
            _storageItemData.customAttributes._=_dataChunksBuffer[chunkIndex];
            api_setStandardChestItemSlot(_storagePosition,storageSlotBaseIndex+chunkIndex,_itemType,null,void 0,_storageItemData);
            chunkIndex++
          }
          _partition++;
          _taskPhase=3
        }
        _blockIndex++
      }
      if(_coordsLength>=243){
        api_setStandardChestItemSlot(registryPosition,_registrySlotIndex,_itemType,null,void 0,_registryItemData);
        _registrySlotIndex++;
        _storageCoordsBuffer.length=0;
        _coordsLength=0
      }
      _storageCoordsBuffer[_coordsLength++]=x;
      _storageCoordsBuffer[_coordsLength++]=y;
      _storageCoordsBuffer[_coordsLength++]=z;
      _taskPhase=2;
      budget--;
      if(budget<=0){
        return !1
      }
    }
    api_setStandardChestItemSlot(registryPosition,_registrySlotIndex,_itemType,null,void 0,_registryItemData);
    _storageItemData.customAttributes._=null;
    _storageCoordsBuffer.length=0;
    _dataChunksBuffer.length=0;
    _storagePosition=null;
    _log(_SMprefix+"Built storage at ("+registryPosition[0]+", "+registryPosition[1]+", "+registryPosition[2]+").",2);
    _taskPhase=1;
    return !0
  };
  let _dispose=(registryPosition,registryItems,maxStorageUnitsPerTick)=>{
    if(_taskPhase===1){
      _registrySlotIndex=1;
      _coordsIndex=0;
      _taskPhase=2
    }
    let budget=maxStorageUnitsPerTick,
    registryItem;
    while(registryItem=registryItems[_registrySlotIndex]){
      if(_taskPhase===2){
        _coordsList=registryItem.attributes.customAttributes._;
        _coordsIndex=0;
        _coordsLength=_coordsList.length;
        _taskPhase=3
      }
      if(_taskPhase===3){
        while(_coordsIndex<_coordsLength){
          api_setBlock(_coordsList[_coordsIndex],_coordsList[_coordsIndex+1],_coordsList[_coordsIndex+2],"Air");
          _coordsIndex+=3;
          budget--;
          if(budget<=0){
            return !1
          }
        }
        api_setStandardChestItemSlot(registryPosition,_registrySlotIndex,"Air");
        _registrySlotIndex++;
        _taskPhase=2
      }
    }
    _log(_SMprefix+"Disposed storage at ("+registryPosition[0]+", "+registryPosition[1]+", "+registryPosition[2]+").",2);
    _taskPhase=1;
    return !0
  };
  _SM.create=(lowPosition,highPosition)=>{
    let lowX=lowPosition[0],
    lowY=lowPosition[1],
    lowZ=lowPosition[2],
    highX=highPosition[0],
    highY=highPosition[1],
    highZ=highPosition[2];
    if(lowX>highX||lowY>highY||lowZ>highZ){
      _log(_SMprefix+"Invalid region bounds. lowPos must be <= highPos on all axes.",1);
      return
    }
    api_setBlock(lowX,lowY,lowZ,_blockType);
    api_setStandardChestItemSlot(lowPosition,0,_itemType,null,void 0,{
      customAttributes:{
        region:[lowX,lowY,lowZ,highX,highY,highZ]
      }
    });
    _log(_SMprefix+"Registry unit created at ("+lowX+", "+lowY+", "+lowZ+").",2)
  };
  _SM.check=registryPosition=>{
    let registryItems=api_getStandardChestItems(registryPosition),
    region=registryItems[0]?.attributes?.customAttributes?.region;
    if(!region){
      _log(_SMprefix+"No valid registry unit found.",1)
    }else{
      _log(_SMprefix+"Storage covers region from ("+region[0]+", "+region[1]+", "+region[2]+") to ("+region[3]+", "+region[4]+", "+region[5]+").",3)
    }
  };
  _SM.build=(registryPosition,blocks,maxStorageUnitsPerTick=16)=>{
    let registryItems=api_getStandardChestItems(registryPosition),
    region=registryItems[0]?.attributes?.customAttributes?.region;
    if(!region){
      _log(_SMprefix+"No valid registry unit found.",1);
      return
    }
    let lowX=region[0],
    lowY=region[1],
    lowZ=region[2],
    highX=region[3],
    highY=region[4],
    highZ=region[5],
    capacity=(highX-lowX+1)*(highY-lowY+1)*(highZ-lowZ+1),
    required=blocks.length+7>>2;
    if(capacity<required){
      _log(_SMprefix+"Not enough space. Need "+required+" storage units, but region holds "+capacity+".",0)
    }else{
      _taskQueue[_taskQueue.length]=()=>_build(blocks,registryPosition,lowX,lowY,lowZ,highX,highY,highZ,maxStorageUnitsPerTick)
    }
  };
  _SM.dispose=(registryPosition,maxStorageUnitsPerTick=32)=>{
    let registryItems=api_getStandardChestItems(registryPosition);
    if(!registryItems[0]?.attributes?.customAttributes?.region){
      _log(_SMprefix+"No valid registry unit found.",1)
    }else{
      _taskQueue[_taskQueue.length]=()=>_dispose(registryPosition,registryItems,maxStorageUnitsPerTick)
    }
  };
  _SM.tick=()=>{
    let tasksCount=_taskQueue.length;
    if(tasksCount){
      let isActive=_taskIndex<tasksCount;
      while(isActive){
        try{
          if(!_taskQueue[_taskIndex]()){
            break
          }
        }catch(error){
          _log(_SMprefix+"Task error on tick - "+error.name+": "+error.message,0)
        }
        isActive=++_taskIndex<tasksCount
      }
      if(!isActive){
        _taskIndex=0;
        _taskQueue.length=0
      }
    }
  }
}
{
  let _EM=EventManager,
  _OM=BootManager,
  _CL=CodeLoader,
  _OMprefix=_PREFIX+" OM: ";
  _CL.SM=StorageManager;
  _CL.config=configuration;
  _CL.reboot=()=>{
    if(!_OM.isRunning){
      _EM.delegator.tick=_OM.tick;
      _OM.phase=0
    }else{
      _log(_OMprefix+"Reboot request was denied.",1)
    }
  };
  _CL.bootLogs=(showErrors=!0)=>{
    _OM.bootLogs(showErrors)
  };
  _CL.errorLogs=(showSuccess=!0)=>{
    _OM.errorLogs(showSuccess)
  };
  _CL.executionLogs=()=>{
    _OM.executionLogs()
  };
  _CL.completeLogs=(showBoot=!0,showErrors=!0,showExecution=!1)=>{
    _OM.completeLogs(showBoot,showErrors,showExecution)
  }
}
try{
  let _SM=StorageManager,
  _delegator=EventManager.delegator;
  _delegator.tick=BootManager.tick;
  globalThis.tick=function(){
    _delegator.tick(50);
    _SM.tick()
  };
  EventManager.primarySetup();
  let configStyles=configuration.STYLES,
  logStyles=_log.STYLES=[];
  for(let type=0;type<4;type++){
    logStyles[type]=[{
      str:"",
      style:{
        color:configStyles[type*3],
        fontWeight:configStyles[type*3+1],
        fontSize:configStyles[type*3+2]
      }
    }]
  }
  let seal=Object.seal,
  freeze=Object.freeze;
  seal(configuration);
  seal(configuration.boot_manager);
  seal(configuration.block_manager);
  seal(configuration.join_manager);
  seal(configuration.event_manager);
  freeze(configuration.EVENT_REGISTRY);
  freeze(configuration.STYLES);
  seal(InterruptionFramework);
  freeze(StorageManager);
  seal(CodeLoader);
  EventManager.isPrimarySetupDone=!0;
  BootManager.phase=0
}catch(error){
  EventManager.primarySetupError=[error.name,error.message]
}
globalThis.IF=InterruptionFramework;
globalThis.CL=CodeLoader;
void 0;

