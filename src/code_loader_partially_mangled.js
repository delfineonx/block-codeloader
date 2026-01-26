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
    max_executions_per_tick: 16,
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
  let _CF=configuration,
  _IF={
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
  _SM={
    create:null,
    check:null,
    build:null,
    dispose:null
  },
  _CL={
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
  _eval=eval,
  _getBlock=api.getBlock,
  _getBlockId=api.getBlockId,
  _setBlock=api.setBlock,
  _getBlockData=api.getBlockData,
  _getStandardChestItems=api.getStandardChestItems,
  _getStandardChestItemSlot=api.getStandardChestItemSlot,
  _setStandardChestItemSlot=api.setStandardChestItemSlot,
  _setCallbackValueFallback=api.setCallbackValueFallback,
  _getPlayerIds=api.getPlayerIds,
  _broadcastMessage=api.broadcastMessage,
  _NOOP=function(){},
  _STYLES=[],
  _PREFIX="Code Loader",
  _IF_interrupted=Object.create(null),
  _IF_emptyArgs=[],
  _IF_element=[],
  _IF_external=1,
  _IF_enqueueId=1,
  _IF_dequeueId=1,
  _IF_queueSize=0,
  _SM_prefix=_PREFIX+" SM: ",
  _SM_taskQueue=[],
  _SM_taskIndex=0,
  _SM_taskPhase=1,
  _SM_blockType="Bedrock",
  _SM_itemType="Boat",
  _SM_storageItemData={customAttributes:{_:null}},
  _SM_registryItemData={customAttributes:{_:[]}},
  _SM_storageCoordsBuffer=_SM_registryItemData.customAttributes._,
  _SM_dataChunksBuffer=[],
  _SM_lowX,
  _SM_lowY,
  _SM_lowZ,
  _SM_highX,
  _SM_highY,
  _SM_highZ,
  _SM_storageX,
  _SM_storageY,
  _SM_storageZ,
  _SM_isChunkLoaded,
  _SM_registryItems,
  _SM_storagePosition,
  _SM_blockIndex,
  _SM_partition,
  _SM_registrySlotIndex,
  _SM_coordsList,
  _SM_coordsIndex,
  _SM_coordsCount,
  _EM_prefix=_PREFIX+" EM: ",
  _EM_setEventHandler=Object.create(null),
  _EM_getEventHandler=Object.create(null),
  _EM_isSetupDone=!1,
  _EM_setupError=null,
  _EM_unknownActiveEvents=[],
  _EM_activeEvents=[],
  _EM_installCursor=0,
  _EM_join_handler,
  _EM_tick_handler,
  _EM_resetCursor,
  _TM_boot,
  _TM_main,
  _JM_prefix=_PREFIX+" JM: ",
  _JM_resetOnReboot,
  _JM_maxDequeuePerTick,
  _JM_main,
  _JM_buffer=[],
  _JM_state={},
  _JM_dequeueCursor,
  _BM_prefix=_PREFIX+" BM: ",
  _BM_executor,
  _BM_blocks,
  _BM_errors=[],
  _BM_isChestMode,
  _BM_maxExecutionsPerTick,
  _BM_maxErrorsCount,
  _BM_errorIndex,
  _BM_blockIndex,
  _BM_isRegistryLoaded,
  _BM_isChunkLoaded,
  _BM_registrySlotIndex,
  _BM_coordsIndex,
  _BM_partition,
  _BM_registryItems,
  _BM_storageItems,
  _OM_prefix=_PREFIX+" OM: ",
  _OM_phase=-2,
  _OM_isPrimaryBoot=!0,
  _OM_tickNum=-1,
  _OM_isRunning=!1,
  _OM_bootDelayTicks,
  _OM_showBootLogs,
  _OM_showErrorLogs,
  _OM_showExecutionLogs,
  _OM_loadTimeTicks;

  const _log=(message,type)=>{
    let styledText=_STYLES[type];
    styledText[0].str=message;
    _broadcastMessage(styledText)
  },
  _establish=()=>{
    let JM_config=_CF.join_manager,
    BM_config=_CF.block_manager,
    OM_config=_CF.boot_manager;
    _EM_resetCursor=0;
    _TM_boot=_NOOP;
    _TM_main=_NOOP;
    if(_EM_join_handler){
      _JM_resetOnReboot=!!JM_config.reset_on_reboot;
      _JM_maxDequeuePerTick=JM_config.max_dequeue_per_tick|0;
      _JM_maxDequeuePerTick=(_JM_maxDequeuePerTick&~(_JM_maxDequeuePerTick>>31))+(-_JM_maxDequeuePerTick>>31)+1;
      _JM_main=_NOOP;
      if(!_OM_isPrimaryBoot){
        _JM_buffer.length=0;
        if(_JM_resetOnReboot){_JM_state={}}
      }
      _JM_dequeueCursor=0
    }
    _BM_blocks=_CF.BLOCKS instanceof Array?_CF.BLOCKS:[];
    _BM_isChestMode=!!BM_config.is_chest_mode;
    _BM_maxExecutionsPerTick=BM_config.max_executions_per_tick|0;
    _BM_maxExecutionsPerTick=(_BM_maxExecutionsPerTick&~(_BM_maxExecutionsPerTick>>31))+(-_BM_maxExecutionsPerTick>>31)+1;
    _BM_maxErrorsCount=BM_config.max_errors_count|0;
    _BM_maxErrorsCount=_BM_maxErrorsCount&~(_BM_maxErrorsCount>>31);
    _BM_errors.length=1;
    _BM_errors[0]=null;
    _BM_errorIndex=0;
    _BM_blockIndex=0;
    if(_BM_isChestMode){
      _BM_isRegistryLoaded=!1;
      _BM_isChunkLoaded={};
      _BM_registrySlotIndex=1;
      _BM_coordsIndex=0;
      _BM_partition=0
    }
    _OM_bootDelayTicks=(OM_config.boot_delay_ms|0)*.02|0;
    _OM_bootDelayTicks=_OM_bootDelayTicks&~(_OM_bootDelayTicks>>31);
    _OM_showBootLogs=!!OM_config.show_boot_logs;
    _OM_showErrorLogs=!!OM_config.show_error_logs;
    _OM_showExecutionLogs=!!OM_config.show_execution_logs;
    _OM_loadTimeTicks=-1
  },
  _IF_tick=()=>{
    _IF.state=0;
    if(!_IF_queueSize){
      _IF.args=_IF_emptyArgs;
      _IF.cache=null;
      return
    }
    _IF_external=0;
    _IF.wasInterrupted=!0;
    while(_IF_dequeueId<_IF_enqueueId){
      _IF_element=_IF_interrupted[_IF_dequeueId];
      if(_IF_element[2]>0){
        _IF_element[2]--;
        _IF.phase=_IF_element[3];
        _IF.cache=_IF_element[4];
        _IF_element[0](..._IF_element[1])
      }
      delete _IF_interrupted[_IF_dequeueId++];
      _IF_queueSize--
    }
    _IF.state=0;
    _IF.args=_IF_emptyArgs;
    _IF.cache=null;
    _IF.wasInterrupted=!1;
    _IF_external=1
  },
  _SM_create=(lowPosition,highPosition)=>{
    let lowX=lowPosition[0],
    lowY=lowPosition[1],
    lowZ=lowPosition[2],
    highX=highPosition[0],
    highY=highPosition[1],
    highZ=highPosition[2];
    if(lowX>highX||lowY>highY||lowZ>highZ){
      _log(_SM_prefix+"Invalid region bounds. lowPos must be <= highPos on all axes.",1);
      return !0
    }
    if(_getBlockId(lowX,lowY,lowZ)===1){return !1}
    _setBlock(lowX,lowY,lowZ,_SM_blockType);
    _setStandardChestItemSlot([lowX,lowY,lowZ],0,_SM_itemType,null,void 0,{
      customAttributes:{
        region:[lowX,lowY,lowZ,highX,highY,highZ]
      }
    });
    _log(_SM_prefix+"Registry unit created at ("+lowX+", "+lowY+", "+lowZ+").",2);
    return !0
  },
  _SM_check=registryPosition=>{
    if(_getBlockId(registryPosition[0],registryPosition[1],registryPosition[2])===1){return !1}
    let region=_getStandardChestItemSlot(registryPosition,0)?.attributes?.customAttributes?.region;
    if(!region){
      _log(_SM_prefix+"No valid registry unit found.",1)
    }else{
      _log(_SM_prefix+"Storage covers region from ("+region[0]+", "+region[1]+", "+region[2]+") to ("+region[3]+", "+region[4]+", "+region[5]+").",3)
    }
    return !0
  },
  _SM_build=(registryPosition,blocks,maxStorageUnitsPerTick)=>{
    if(_SM_taskPhase===1){
      if(_getBlockId(registryPosition[0],registryPosition[1],registryPosition[2])===1){return !1}
      let region=_getStandardChestItemSlot(registryPosition,0)?.attributes?.customAttributes?.region;
      if(!region){
        _log(_SM_prefix+"No valid registry unit found.",1);
        return !0
      }
      _SM_lowX=region[0];
      _SM_lowY=region[1];
      _SM_lowZ=region[2];
      _SM_highX=region[3];
      _SM_highY=region[4];
      _SM_highZ=region[5];
      let capacity=(_SM_highX-_SM_lowX+1)*(_SM_highY-_SM_lowY+1)*(_SM_highZ-_SM_lowZ+1)-1,
      required=blocks.length+3>>2;
      if(capacity<required){
        _log(_SM_prefix+"Not enough space. Need "+required+" storage units, but region holds "+capacity+".",0);
        return !0
      }
      _SM_storageX=_SM_lowX;
      _SM_storageY=_SM_lowY;
      _SM_storageZ=_SM_lowZ;
      _SM_isChunkLoaded={};
      _SM_blockIndex=0;
      _SM_registrySlotIndex=1;
      _SM_coordsCount=0;
      _SM_taskPhase=2
    }
    let sx=_SM_storageX,
    sy=_SM_storageY,
    sz=_SM_storageZ,
    budget=maxStorageUnitsPerTick,
    blocksCount=blocks.length,
    rawData,rawStart,rawEnd,escapedData,escapedCursor,escapedDataEnd,escapedChunkEnd,backslashPosition,runLength,
    block,bx,by,bz,chunkId,storageSlotBaseIndex,chunkIndex,chunksLength;
    while(_SM_blockIndex<blocksCount){
      if(_SM_taskPhase===2){
        sx++;
        if(sx>_SM_highX){
          sx=_SM_lowX;
          sz++;
          if(sz>_SM_highZ){
            sz=_SM_lowZ;
            sy++;
            if(sy>_SM_highY){
              _log(_SM_prefix+"Region overflow on storage build at ("+registryPosition[0]+", "+registryPosition[1]+", "+registryPosition[2]+").",0);
              return !0
            }
          }
        }
        chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
        if(!_SM_isChunkLoaded[chunkId]){
          if(_getBlockId(sx,sy,sz)===1){return !1}
          _SM_isChunkLoaded[chunkId]=!0
        }
        _setBlock(sx,sy,sz,_SM_blockType);
        _SM_storageX=sx;
        _SM_storageY=sy;
        _SM_storageZ=sz;
        _SM_storagePosition=[sx,sy,sz];
        _SM_partition=0;
        _SM_taskPhase=3
      }
      while(_SM_partition<4&&_SM_blockIndex<blocksCount){
        if(_SM_taskPhase===3){
          block=blocks[_SM_blockIndex];
          bx=block[0];
          by=block[1];
          bz=block[2];
          chunkId=(bx>>5)+"|"+(by>>5)+"|"+(bz>>5);
          if(!_SM_isChunkLoaded[chunkId]){
            if(_getBlockId(bx,by,bz)===1){return !1}
            _SM_isChunkLoaded[chunkId]=!0
          }
          rawData=_getBlockData(bx,by,bz)?.persisted?.shared?.text;
          if(rawData?.length>0){
            chunkIndex=0;
            rawStart=0;
            rawEnd=0;
            escapedData=JSON.stringify(rawData);
            escapedCursor=1;
            escapedDataEnd=escapedData.length-1;
            while(escapedCursor<escapedDataEnd){
              escapedChunkEnd=escapedCursor+1950;
              if(escapedChunkEnd>escapedDataEnd){escapedChunkEnd=escapedDataEnd}
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
              _SM_dataChunksBuffer[chunkIndex++]=rawData.slice(rawStart,rawEnd);
              rawStart=rawEnd
            }
            _SM_dataChunksBuffer.length=chunkIndex;
            _SM_taskPhase=4
          }
        }
        if(_SM_taskPhase===4){
          storageSlotBaseIndex=_SM_partition*9;
          chunkIndex=0;
          chunksLength=_SM_dataChunksBuffer.length;
          while(chunkIndex<chunksLength){
            _SM_storageItemData.customAttributes._=_SM_dataChunksBuffer[chunkIndex];
            _setStandardChestItemSlot(_SM_storagePosition,storageSlotBaseIndex+chunkIndex,_SM_itemType,null,void 0,_SM_storageItemData);
            chunkIndex++
          }
          _SM_partition++;
          _SM_taskPhase=3
        }
        _SM_blockIndex++
      }
      if(_SM_coordsCount>=243){
        _setStandardChestItemSlot(registryPosition,_SM_registrySlotIndex,_SM_itemType,null,void 0,_SM_registryItemData);
        _SM_storageCoordsBuffer.length=0;
        _SM_coordsCount=0;
        _SM_registrySlotIndex++
      }
      _SM_storageCoordsBuffer[_SM_coordsCount++]=sx;
      _SM_storageCoordsBuffer[_SM_coordsCount++]=sy;
      _SM_storageCoordsBuffer[_SM_coordsCount++]=sz;
      _SM_taskPhase=2;
      budget--;
      if(budget<=0){return !1}
    }
    _setStandardChestItemSlot(registryPosition,_SM_registrySlotIndex,_SM_itemType,null,void 0,_SM_registryItemData);
    _SM_storageItemData.customAttributes._=null;
    _SM_storageCoordsBuffer.length=0;
    _SM_dataChunksBuffer.length=0;
    _SM_isChunkLoaded=null;
    _SM_storagePosition=null;
    _log(_SM_prefix+"Built storage at ("+registryPosition[0]+", "+registryPosition[1]+", "+registryPosition[2]+").",2);
    _SM_taskPhase=1;
    return !0
  },
  _SM_dispose=(registryPosition,maxStorageUnitsPerTick)=>{
    if(_SM_taskPhase===1){
      if(_getBlockId(registryPosition[0],registryPosition[1],registryPosition[2])===1){return !1}
      _SM_registryItems=_getStandardChestItems(registryPosition);
      if(!_SM_registryItems[0]?.attributes?.customAttributes?.region){
        _log(_SM_prefix+"No valid registry unit found.",1);
        _SM_registryItems=null;
        return !0
      }
      _SM_isChunkLoaded={};
      _SM_registrySlotIndex=1;
      _SM_coordsIndex=0;
      _SM_taskPhase=2
    }
    let budget=maxStorageUnitsPerTick,
    registryItem,sx,sy,sz,chunkId;
    while(registryItem=_SM_registryItems[_SM_registrySlotIndex]){
      if(_SM_taskPhase===2){
        _SM_coordsList=registryItem.attributes.customAttributes._;
        _SM_coordsIndex=0;
        _SM_coordsCount=_SM_coordsList.length;
        _SM_taskPhase=3
      }
      if(_SM_taskPhase===3){
        while(_SM_coordsIndex<_SM_coordsCount){
          sx=_SM_coordsList[_SM_coordsIndex];
          sy=_SM_coordsList[_SM_coordsIndex+1];
          sz=_SM_coordsList[_SM_coordsIndex+2];
          chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
          if(!_SM_isChunkLoaded[chunkId]){
            if(_getBlockId(sx,sy,sz)===1){return !1}
            _SM_isChunkLoaded[chunkId]=!0
          }
          _setBlock(sx,sy,sz,"Air");
          _SM_coordsIndex+=3;
          budget--;
          if(budget<=0){return !1}
        }
        _setStandardChestItemSlot(registryPosition,_SM_registrySlotIndex,"Air");
        _SM_registrySlotIndex++;
        _SM_taskPhase=2
      }
    }
    _log(_SM_prefix+"Disposed storage at ("+registryPosition[0]+", "+registryPosition[1]+", "+registryPosition[2]+").",2);
    _SM_isChunkLoaded=null;
    _SM_registryItems=null;
    _SM_coordsList=null;
    _SM_taskPhase=1;
    return !0
  },
  _SM_tick=()=>{
    let tasksCount=_SM_taskQueue.length,
    isActive=_SM_taskIndex<tasksCount;
    while(isActive){
      try{
        if(!_SM_taskQueue[_SM_taskIndex]()){break}
      }catch(error){
        _log(_SM_prefix+"Task error on tick - "+error.name+": "+error.message,0)
      }
      isActive=++_SM_taskIndex<tasksCount
    }
    if(!isActive){
      _SM_taskIndex=0;
      _SM_taskQueue.length=0
    }
  },
  _EM_setup=()=>{
    if(_EM_isSetupDone){return}
    let IF_=_IF,
    EVENT_REGISTRY=_CF.EVENT_REGISTRY,
    ACTIVE_EVENTS=_CF.ACTIVE_EVENTS,
    EM_config=_CF.event_manager,
    isFrameworkEnabled=!!EM_config.is_framework_enabled,
    defaultRetryLimit=EM_config.default_retry_limit|0;
    defaultRetryLimit=(defaultRetryLimit&~(defaultRetryLimit>>31))+(-defaultRetryLimit>>31)+1;
    let setupIndex=0,
    setupCount=ACTIVE_EVENTS.length;
    while(setupIndex<setupCount){
      let eventName=ACTIVE_EVENTS[setupIndex];
      if(eventName==="tick"){
        setupIndex++;
        continue
      }
      let registryEntry=EVENT_REGISTRY[eventName];
      if(registryEntry===void 0){
        _EM_unknownActiveEvents[_EM_unknownActiveEvents.length]=eventName;
        setupIndex++;
        continue
      }
      if(!(registryEntry instanceof Array)){
        registryEntry=EVENT_REGISTRY[eventName]=[]
      }
      let interruptionStatus=!!registryEntry[1];
      if(eventName!=="onPlayerJoin"){
        _EM_activeEvents[_EM_activeEvents.length]=eventName;
        let handler=_NOOP;
        _EM_setEventHandler[eventName]=fn=>{handler=fn instanceof Function?fn:_NOOP};
        _EM_getEventHandler[eventName]=()=>handler;
        if(isFrameworkEnabled&&interruptionStatus){
          let retryLimit=registryEntry[2];
          if(retryLimit==null){retryLimit=defaultRetryLimit}
          retryLimit|=0;
          globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            IF_.state=1;
            IF_.fn=handler;
            IF_.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
            IF_.limit=retryLimit;
            IF_.phase=1048576;
            try{
              return handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
            }finally{
              IF_.state=0
            }
          }
        }else{
          globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            return handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
          }
        }
      }else{
        _EM_join_handler=_JM_dispatch;
        _EM_setEventHandler.onPlayerJoin=fn=>{_EM_join_handler=fn instanceof Function?fn:_NOOP};
        _EM_getEventHandler.onPlayerJoin=()=>_EM_join_handler;
        if(isFrameworkEnabled&&interruptionStatus){
          let retryLimit=registryEntry[2];
          if(retryLimit==null){retryLimit=defaultRetryLimit}
          retryLimit|=0;
          globalThis.onPlayerJoin=function(arg0,arg1){
            IF_.state=1;
            IF_.fn=_EM_join_handler;
            IF_.args=[arg0,arg1];
            IF_.limit=retryLimit;
            IF_.phase=1048576;
            try{
              return _EM_join_handler(arg0,arg1)
            }finally{
              IF_.state=0
            }
          }
        }else{
          globalThis[eventName]=function(arg0,arg1){
            return _EM_join_handler(arg0,arg1)
          }
        }
      }
      setupIndex++
    }
  },
  _EM_install=()=>{
    let EVENT_REGISTRY=_CF.EVENT_REGISTRY,
    activeEventsCount=_EM_activeEvents.length;
    while(_EM_installCursor<activeEventsCount){
      let eventName=_EM_activeEvents[_EM_installCursor];
      _setCallbackValueFallback(eventName,EVENT_REGISTRY[eventName][0]);
      Object.defineProperty(globalThis,eventName,{
        configurable:!0,
        set:_EM_setEventHandler[eventName],
        get:_EM_getEventHandler[eventName]
      });
      _EM_installCursor++
    }
    if(_EM_join_handler){
      Object.defineProperty(globalThis,"onPlayerJoin",{
        configurable:!0,
        set:fn=>{_EM_join_handler=fn instanceof Function?fn:_NOOP},
        get:()=>_EM_join_handler
      })
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{_EM_tick_handler=fn instanceof Function?fn:_NOOP},
      get:()=>_EM_tick_handler
    })
  },
  _EM_reset=()=>{
    let activeEventsCount=_EM_activeEvents.length;
    while(_EM_resetCursor<activeEventsCount){
      _EM_setEventHandler[_EM_activeEvents[_EM_resetCursor]](_NOOP);
      _EM_resetCursor++
    }
    if(_EM_join_handler){_EM_join_handler=_NOOP}
  },
  _TM_dispatch=()=>{
    _IF_tick();
    _TM_main(50);
    _TM_boot()
  },
  _TM_install=()=>{
    let bootEventHandler=_NOOP;
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{_TM_main=bootEventHandler=fn instanceof Function?fn:_NOOP},
      get:()=>bootEventHandler
    });
    _TM_boot=_EM_tick_handler;
    _EM_tick_handler=_TM_dispatch
  },
  _TM_finalize=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{_EM_tick_handler=fn instanceof Function?fn:_NOOP},
      get:()=>_EM_tick_handler
    });
    _EM_tick_handler=_TM_main;
    _TM_boot=_NOOP
  },
  _JM_dispatch=(playerId,fromGameReset)=>{
    let index=_JM_buffer.length;
    _JM_buffer[index]=playerId;
    _JM_buffer[index+1]=fromGameReset;
    _JM_state[playerId]=1
  },
  _JM_install=()=>{
    _EM_join_handler=_JM_dispatch;
    let bootEventHandler=_NOOP;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{_JM_main=bootEventHandler=fn instanceof Function?fn:_NOOP},
      get:()=>bootEventHandler
    })
  },
  _JM_scan=()=>{
    if(_JM_resetOnReboot||_OM_isPrimaryBoot){
      let playerIds=_getPlayerIds(),
      cursor=0,
      playerId,index;
      while(playerId=playerIds[cursor]){
        if(!_JM_state[playerId]){
          index=_JM_buffer.length;
          _JM_buffer[index]=playerId;
          _JM_buffer[index+1]=!1;
          _JM_state[playerId]=1
        }
        cursor++
      }
    }
  },
  _JM_dequeue=()=>{
    let budget=_JM_maxDequeuePerTick,
    playerId,fromGameReset;
    while(_JM_dequeueCursor<_JM_buffer.length&&budget>0){
      playerId=_JM_buffer[_JM_dequeueCursor];
      if(_JM_state[playerId]!==2){
        fromGameReset=_JM_buffer[_JM_dequeueCursor+1];
        _JM_state[playerId]=2;
        _JM_dequeueCursor+=2;
        _IF.state=1;
        _IF.fn=_JM_main;
        _IF.args=[playerId,fromGameReset];
        _IF.limit=2;
        _IF.phase=1048576;
        try{
          _JM_main(playerId,fromGameReset)
        }catch(error){
          _IF.state=0;
          _log(_JM_prefix+error.name+": "+error.message,0)
        }
        _IF.state=0;
        _JM_dequeueCursor-=2;
        budget--
      }
      _JM_dequeueCursor+=2
    }
    return _JM_dequeueCursor>=_JM_buffer.length
  },
  _JM_finalize=()=>{
    _EM_join_handler=_JM_main;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{_EM_join_handler=fn instanceof Function?fn:_NOOP},
      get:()=>_EM_join_handler
    });
    _JM_buffer.length=0
  },
  _BM_blockExecutor=()=>{
    let budget=_BM_maxExecutionsPerTick,
    blocksCount=_BM_blocks.length,
    block,bx,by,bz,code;
    while(_BM_blockIndex<blocksCount){
      block=_BM_blocks[_BM_blockIndex];
      if(!block||block.length<3){
        _CL.pointer=++_BM_blockIndex;
        continue
      }
      bx=block[0];
      by=block[1];
      bz=block[2];
      if((block[3]=_getBlock(bx,by,bz))==="Unloaded"){return !1}
      try{
        code=_getBlockData(bx,by,bz)?.persisted?.shared?.text;
        _eval(code)
      }catch(error){
        _BM_errors[++_BM_errorIndex*+(_BM_errors.length-1<_BM_maxErrorsCount)]=[error.name,error.message,bx,by,bz]
      }
      _CL.pointer=++_BM_blockIndex;
      budget--;
      if(budget<=0){return !1}
    }
    return !0
  },
  _BM_storageExecutor=()=>{
    if(!_BM_isRegistryLoaded){
      let registryPosition=_BM_blocks[0];
      if(!registryPosition||registryPosition.length<3){return !0}
      if(_getBlockId(registryPosition[0],registryPosition[1],registryPosition[2])===1){return !1}
      _BM_registryItems=_getStandardChestItems(registryPosition);
      if(!_BM_registryItems[0]?.attributes?.customAttributes?.region){return !0}
      _BM_isRegistryLoaded=!0
    }
    let budget=_BM_maxExecutionsPerTick,
    registryItem,coordsList,coordsCount,sx,sy,sz,chunkId,code,storageSlotBaseIndex,chunkIndex,storageItem;
    while(registryItem=_BM_registryItems[_BM_registrySlotIndex]){
      coordsList=registryItem.attributes.customAttributes._;
      coordsCount=coordsList.length-2;
      while(_BM_coordsIndex<coordsCount){
        sx=coordsList[_BM_coordsIndex];
        sy=coordsList[_BM_coordsIndex+1];
        sz=coordsList[_BM_coordsIndex+2];
        chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
        if(!_BM_isChunkLoaded[chunkId]){
          if(_getBlockId(sx,sy,sz)===1){return !1}
          _BM_isChunkLoaded[chunkId]=!0
        }
        if(_BM_partition===0){
          _BM_storageItems=_getStandardChestItems([sx,sy,sz])
        }
        while(_BM_partition<4){
          code="";storageSlotBaseIndex=_BM_partition*9;
          chunkIndex=0;
          while(chunkIndex<9&&(storageItem=_BM_storageItems[storageSlotBaseIndex+chunkIndex])){
            code+=storageItem.attributes.customAttributes._;
            chunkIndex++
          }
          if(chunkIndex===0){
            _CL.pointer++;
            break
          }
          try{
            _eval(code)
          }catch(error){
            _BM_errors[++_BM_errorIndex*+(_BM_errors.length-1<_BM_maxErrorsCount)]=[error.name,error.message,sx,sy,sz,_BM_partition]
          }
          _BM_partition++;
          _CL.pointer++;
          budget--;
          if(budget<=0){return !1}
        }
        _BM_partition=0;
        _BM_coordsIndex+=3
      }
      _BM_coordsIndex=0;
      _BM_registrySlotIndex++
    }
    return !0
  },
  _BM_install=()=>{
    _BM_executor=_BM_isChestMode?_BM_storageExecutor:_BM_blockExecutor
  },
  _BM_finalize=()=>{
    _BM_errors[0]=null;
    _BM_isChunkLoaded=null;
    _BM_registryItems=null;
    _BM_storageItems=null
  },
  _OM_bootLogs=showErrors=>{
    let message="Code was loaded in "+_OM_loadTimeTicks*50+" ms",
    errorsCount=_BM_errors.length-1;
    if(showErrors){
      message+=errorsCount>0?" with "+errorsCount+" error"+(errorsCount===1?"":"s")+".":" with 0 errors."
    }else{
      message+="."
    }
    _log(_OM_prefix+message,1+(errorsCount<=0))
  },
  _OM_errorLogs=showSuccess=>{
    let errorsCount=_BM_errors.length-1;
    if(errorsCount>0){
      let message="Code execution error"+(errorsCount===1?"":"s")+":",
      error;
      if(_BM_isChestMode){
        for(let index=1;index<=errorsCount;index++){
          error=_BM_errors[index];
          message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+") in partition ("+error[5]+"): "+error[1]
        }
      }else{
        for(let index=1;index<=errorsCount;index++){
          error=_BM_errors[index];message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+"): "+error[1]
        }
      }
      _log(_BM_prefix+message,0)
    }else if(showSuccess){
      _log(_BM_prefix+"No code execution errors.",2)
    }
  },
  _OM_executionLogs=()=>{
    let message="",
    block;
    if(_BM_isChestMode){
      if(_BM_isRegistryLoaded){
        block=_BM_blocks[0];
        message="Executed storage data at ("+block[0]+", "+block[1]+", "+block[2]+")."
      }else{
        message="No storage data found."
      }
    }else{
      let amount=0,
      blocksCount=_BM_blocks.length;
      for(let index=0;index<blocksCount;index++){
        block=_BM_blocks[index];
        if(block[3]){
          message+='\n"'+block[3]+'" at ('+block[0]+", "+block[1]+", "+block[2]+")";
          amount++
        }
      }
      message="Executed "+amount+" block"+(amount===1?"":"s")+" data"+(amount===0?".":":")+message
    }
    _log(_BM_prefix+message,3)
  },
  _OM_completeLogs=(showBoot,showErrors,showExecution)=>{
    if(_EM_unknownActiveEvents.length){
      _log(_EM_prefix+'Unknown active events: "'+_EM_unknownActiveEvents.join('", "')+'".',1)
    }
    if(showBoot){
      _OM_bootLogs(showErrors)
    }
    if(showErrors){
      _OM_errorLogs(!showBoot)
    }
    if(showExecution){
      _OM_executionLogs()
    }
  },
  _OM_tick=()=>{
    _OM_tickNum++;
    if(_OM_phase<3){
      if(_OM_phase===-2){
        if(!_EM_isSetupDone&&_OM_tickNum>20){
          let message=_EM_prefix+"Error on primary setup - "+_EM_setupError?.[0]+": "+_EM_setupError?.[1]+".",
          playerIds=_getPlayerIds(),
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
      if(_OM_phase===0){
        _establish();
        _OM_phase=1
      }
      if(_OM_phase===1){
        if(_OM_tickNum<_OM_bootDelayTicks){return}
        _OM_phase=2
      }
      if(_OM_phase===2){
        if(_OM_isPrimaryBoot){
          _EM_install()
        }else{
          _EM_reset()
        }
        if(_EM_join_handler){
          _JM_install();
          _JM_scan()
        }
        _BM_install();
        _TM_install();
        _OM_phase=3
      }
    }
    if(_OM_phase===3&&_BM_executor()){
      _BM_finalize();
      _OM_phase=4+!_EM_join_handler
    }
    if(_OM_phase===4&&_JM_dequeue()){
      _JM_finalize();
      _OM_phase=5
    }
    if(_OM_phase===5){
      _TM_finalize();
      _CL.isPrimaryBoot=_OM_isPrimaryBoot=!1;
      _CL.isRunning=_OM_isRunning=!1;
      _OM_phase=-1;
      _OM_loadTimeTicks=_OM_tickNum-_OM_bootDelayTicks+1;
      _OM_completeLogs(_OM_showBootLogs,_OM_showErrorLogs,_OM_showExecutionLogs)
    }
  };
  _IF.tick = _IF_tick;
  Object.defineProperty(globalThis.InternalError.prototype,"name",{
    configurable:!0,
    get:()=>{
      if(_IF_external){
        if(_IF.state){
          _IF_interrupted[_IF_enqueueId++]=[_IF.fn,_IF.args,_IF.limit,_IF.phase,_IF.cache];
          _IF_queueSize++
        }
      }else{
        _IF_element[3]=_IF.phase;
        _IF.wasInterrupted=!1;
        _IF_external=1
      }
      _IF.state=0;
      return"InternalError"
    }
  });
  _SM.create=(lowPosition,highPosition)=>{
    _SM_taskQueue[_SM_taskQueue.length]=()=>_SM_create(lowPosition,highPosition)
  };
  _SM.check=registryPosition=>{
    _SM_taskQueue[_SM_taskQueue.length]=()=>_SM_check(registryPosition)
  };
  _SM.build=(registryPosition,blocks,maxStorageUnitsPerTick=8)=>{
    _SM_taskQueue[_SM_taskQueue.length]=()=>_SM_build(registryPosition,blocks,maxStorageUnitsPerTick)
  };
  _SM.dispose=(registryPosition,maxStorageUnitsPerTick=32)=>{
    _SM_taskQueue[_SM_taskQueue.length]=()=>_SM_dispose(registryPosition,maxStorageUnitsPerTick)
  };
  _CL.SM=_SM;
  _CL.config=_CF;
  _CL.reboot=()=>{
    if(!_OM_isRunning){
      _OM_tickNum=0;
      _CL.isRunning=_OM_isRunning=!0;
      _CL.pointer=0;
      _EM_tick_handler=_OM_tick;
      _OM_phase=0
    }else{
      _log(_OM_prefix+"Reboot request was denied.",1)
    }
  };
  _CL.bootLogs=(showErrors=!0)=>{
    _OM_bootLogs(showErrors)
  };
  _CL.errorLogs=(showSuccess=!0)=>{
    _OM_errorLogs(showSuccess)
  };
  _CL.executionLogs=()=>{
    _OM_executionLogs()
  };
  _CL.completeLogs=(showBoot=!0,showErrors=!0,showExecution=!1)=>{
    _OM_completeLogs(showBoot,showErrors,showExecution)
  };
  _EM_tick_handler=_OM_tick;
  _EM_setEventHandler.tick=fn=>{_EM_tick_handler=fn instanceof Function?fn:_NOOP};
  _EM_getEventHandler.tick=()=>_EM_tick_handler;
  globalThis.tick=function(){
    _EM_tick_handler(50);
    if(_SM_taskQueue.length){_SM_tick()}
  };
  try{
    _OM_tickNum=0;
    _CL.isRunning=_OM_isRunning=!0;
    _CL.pointer=0;
    _EM_setup();
    let configStyles=_CF.STYLES;
    for(let type=0;type<4;type++){
      _STYLES[type]=[{
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
    seal(_CF);
    seal(_CF.boot_manager);
    seal(_CF.block_manager);
    seal(_CF.join_manager);
    seal(_CF.event_manager);
    freeze(_CF.EVENT_REGISTRY);
    freeze(_CF.STYLES);
    seal(_IF);
    freeze(_SM);
    seal(_CL);
    _EM_isSetupDone=!0;
    _OM_phase=0
  }catch(error){
    _EM_setupError=[error.name,error.message]
  }
  globalThis.IF=_IF;
  globalThis.CL=_CL;
  void 0
}

// 26/01/2026
