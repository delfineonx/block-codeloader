// Copyright (c) 2025-2026 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const configuration = {
  // [eventName, ...]
  // [string, ...]
  ACTIVE_EVENTS: [
    // ...
  ],

  // [[x, y, z], ...]
  // [[number, number, number], ...]
  BLOCKS: [
    // ...
  ],

  boot_manager: {
    boot_delay_ms: 100,
    show_boot_logs: true,
    show_error_logs: true,
    show_execution_logs: false,
  },
  block_manager: {
    is_chest_mode: false,
    max_executions_per_tick: 16,
    max_errors_count: 32,
  },
  join_manager: {
    reset_on_reboot: true,
    max_dequeue_per_tick: 16,
  },
  event_manager: {
    is_framework_enabled: false,
    default_retry_limit: 2,
  },

  // eventName -> [fallbackValue?, interruptionStatus?, retryLimit?]
  // string -> [any, boolean|null, number|null]
  EVENT_REGISTRY: {
    tick: null, // special event
    onClose: [],
    onPlayerJoin: [],
    onPlayerLeave: [],
    onPlayerJump: [],
    onRespawnRequest: [[0, -10000, 0]],
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

  STYLES: [
    "#FF775E", "500", "0.95rem", // error
    "#FFC23D", "500", "0.95rem", // warning
    "#20DD69", "500", "0.95rem", // success
    "#52B2FF", "500", "0.95rem"  // info
  ],
};

{
  const _CF = configuration;
  const _IF = {
    state: 0,
    fn: () => { },
    args: [],
    limit: 2,
    phase: 1048576,
    cache: null,

    default: 1048576,
    wasInterrupted: false,

    tick: null,
  };
  const _SM = {
    create: null,
    check: null,
    build: null,
    dispose: null,
  };
  const _CL = {
    SM: null,
    config: null,
    isPrimaryBoot: true,
    isRunning: false,
    pointer: 0,

    reboot: null,
    bootLogs: null,
    errorLogs: null,
    executionLogs: null,
    completeLogs: null,
  };

  /* ================ FIELDS ================ */

    /* ---------------- Shared ---------------- */
  const _eval = eval;
  const _getBlock = api.getBlock;
  const _getBlockId = api.getBlockId;
  const _setBlock = api.setBlock;
  const _getBlockData = api.getBlockData;
  const _getStandardChestItems = api.getStandardChestItems;
  const _getStandardChestItemSlot = api.getStandardChestItemSlot;
  const _setStandardChestItemSlot = api.setStandardChestItemSlot;
  const _setCallbackValueFallback = api.setCallbackValueFallback;
  const _getPlayerIds = api.getPlayerIds;
  const _broadcastMessage = api.broadcastMessage;
  const _NOOP = function () { };
  const _STYLES = [];
  const _PREFIX = "Code Loader";

    /* ---------------- Interruption Framework ---------------- */
  const _IF_interrupted = Object.create(null); // id -> [fn, args, limit, phase, cache]
  const _IF_emptyArgs = [];
  let _IF_element = [];
  let _IF_external = 1;
  let _IF_enqueueId = 1;
  let _IF_dequeueId = 1;
  let _IF_queueSize = 0;

    /* ---------------- Storage Manager ---------------- */
  const _SM_prefix = _PREFIX + " SM: ";
  const _SM_taskQueue = [];
  let _SM_taskIndex = 0;
  let _SM_taskPhase = 1;
  const _SM_blockType = "Bedrock";
  const _SM_itemType = "Boat";
  const _SM_storageItemData = { customAttributes: { _: null } };
  const _SM_registryItemData = { customAttributes: { _: [] } };
  const _SM_storageCoordsBuffer = _SM_registryItemData.customAttributes._;
  const _SM_dataChunksBuffer = [];
  let _SM_lowX;
  let _SM_lowY;
  let _SM_lowZ;
  let _SM_highX;
  let _SM_highY;
  let _SM_highZ;
  let _SM_storageX;
  let _SM_storageY;
  let _SM_storageZ;
  let _SM_isChunkLoaded; // "cx|cy|cz" -> true
  let _SM_registryItems;
  let _SM_storagePosition; // [sx, sy, sz]
  let _SM_blockIndex;
  let _SM_partition;
  let _SM_registrySlotIndex;
  let _SM_coordsList; // [sx, sy, sz, ...]
  let _SM_coordsIndex;
  let _SM_coordsCount;

    /* ---------------- Event Manager ---------------- */
  const _EM_prefix = _PREFIX + " EM: ";
  const _EM_setEventHandler = Object.create(null); // eventName -> closure setter
  const _EM_getEventHandler = Object.create(null); // eventName -> closure getter
  let _EM_isSetupDone = false;
  let _EM_setupError = null;
  let _EM_unknownActiveEvents = []; // [eventName, ...]
  let _EM_activeEvents = []; // [eventName, ...]
  let _EM_installCursor = 0;
  let _EM_join_handler;
  let _EM_tick_handler;
  let _EM_resetCursor;

    /* ---------------- Tick Multiplexer ---------------- */
  let _TM_boot;
  let _TM_main;

    /* ---------------- Join Manager ---------------- */
  const _JM_prefix = _PREFIX + " JM: ";
  let _JM_resetOnReboot;
  let _JM_maxDequeuePerTick;
  let _JM_main;
  const _JM_buffer = []; // [playerId, fromGameReset, ...]
  let _JM_state = {}; // playerId -> 0/1/2
  let _JM_dequeueCursor;

    /* ---------------- Block Manager ---------------- */
  const _BM_prefix = _PREFIX + " BM: ";
  let _BM_executor;
  let _BM_blocks; // [[x, y, z, blockName], ...]
  const _BM_errors = []; // [[name, message, x, y, z, partition?], ...]
  let _BM_isChestMode;
  let _BM_maxExecutionsPerTick;
  let _BM_maxErrorsCount;
  let _BM_errorIndex;
  let _BM_blockIndex;
  let _BM_isRegistryLoaded;
  let _BM_isChunkLoaded; // "cx|cy|cz" -> true
  let _BM_registrySlotIndex;
  let _BM_coordsIndex;
  let _BM_partition;
  let _BM_registryItems;
  let _BM_storageItems;

    /* ---------------- Boot Manager ---------------- */
  const _OM_prefix = _PREFIX + " OM: ";
  let _OM_phase = -2;
  let _OM_isPrimaryBoot = true;
  let _OM_tickNum = -1;
  let _OM_isRunning = false;
  let _OM_bootDelayTicks;
  let _OM_showBootLogs;
  let _OM_showErrorLogs;
  let _OM_showExecutionLogs;
  let _OM_loadTimeTicks;

  /* ================ METHODS ================ */

    /* ---------------- Shared ---------------- */
  const _log = (message, type) => {
    const styledText = _STYLES[type];
    styledText[0].str = message;
    _broadcastMessage(styledText);
  };

  const _establish = () => {
    const JM_config = _CF.join_manager;
    const BM_config = _CF.block_manager;
    const OM_config = _CF.boot_manager;

    _EM_resetCursor = 0;
    
    _TM_boot = _NOOP;
    _TM_main = _NOOP;
    
    if (_EM_join_handler) {
      _JM_resetOnReboot = !!JM_config.reset_on_reboot;
      _JM_maxDequeuePerTick = JM_config.max_dequeue_per_tick | 0;
      _JM_maxDequeuePerTick = (_JM_maxDequeuePerTick & ~(_JM_maxDequeuePerTick >> 31)) + (-_JM_maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1
      _JM_main = _NOOP;
      if (!_OM_isPrimaryBoot) {
        _JM_buffer.length = 0;
        if (_JM_resetOnReboot) { _JM_state = {}; }
      }
      _JM_dequeueCursor = 0;
    }
    
    _BM_blocks = (_CF.BLOCKS instanceof Array) ? _CF.BLOCKS : [];
    _BM_isChestMode = !!BM_config.is_chest_mode;
    _BM_maxExecutionsPerTick = BM_config.max_executions_per_tick | 0;
    _BM_maxExecutionsPerTick = (_BM_maxExecutionsPerTick & ~(_BM_maxExecutionsPerTick >> 31)) + (-_BM_maxExecutionsPerTick >> 31) + 1; // maxExecutionsPerTick > 0 ? maxExecutionsPerTick : 1
    _BM_maxErrorsCount = BM_config.max_errors_count | 0;
    _BM_maxErrorsCount = _BM_maxErrorsCount & ~(_BM_maxErrorsCount >> 31); // maxErrorsCount > 0 ? maxErrorsCount : 0
    _BM_errors.length = 1;
    _BM_errors[0] = null;
    _BM_errorIndex = 0;
    _BM_blockIndex = 0;
    if (_BM_isChestMode) {
      _BM_isRegistryLoaded = false;
      _BM_isChunkLoaded = {};
      _BM_registrySlotIndex = 1;
      _BM_coordsIndex = 0;
      _BM_partition = 0;
    }
    
    _OM_bootDelayTicks = ((OM_config.boot_delay_ms | 0) * 0.02) | 0;
    _OM_bootDelayTicks = _OM_bootDelayTicks & ~(_OM_bootDelayTicks >> 31); // bootDelayTicks > 0 ? bootDelayTicks : 0
    _OM_showBootLogs = !!OM_config.show_boot_logs;
    _OM_showErrorLogs = !!OM_config.show_error_logs;
    _OM_showExecutionLogs = !!OM_config.show_execution_logs;
    _OM_loadTimeTicks = -1;
  };

    /* ---------------- Interruption Framework ---------------- */
  const _IF_tick = () => {
    _IF.state = 0;
    if (!_IF_queueSize) {
      _IF.args = _IF_emptyArgs;
      _IF.cache = null;
      return;
    }

    _IF_external = 0;
    _IF.wasInterrupted = true;

    while (_IF_dequeueId < _IF_enqueueId) {
      _IF_element = _IF_interrupted[_IF_dequeueId];
      if (_IF_element[2] > 0) {
        _IF_element[2]--;
        _IF.phase = _IF_element[3];
        _IF.cache = _IF_element[4];
        _IF_element[0](..._IF_element[1]);
      }
      delete _IF_interrupted[_IF_dequeueId++];
      _IF_queueSize--;
    }

    _IF.state = 0;
    _IF.args = _IF_emptyArgs;
    _IF.cache = null;
    _IF.wasInterrupted = false;
    _IF_external = 1;
  };

    /* ---------------- Storage Manager ---------------- */
  const _SM_create = (lowPosition, highPosition) => {
    const lowX = lowPosition[0];
    const lowY = lowPosition[1];
    const lowZ = lowPosition[2];
    const highX = highPosition[0];
    const highY = highPosition[1];
    const highZ = highPosition[2];

    if (lowX > highX || lowY > highY || lowZ > highZ) {
      _log(_SM_prefix + "Invalid region bounds. lowPos must be <= highPos on all axes.", 1);
      return true;
    }

    if (_getBlockId(lowX, lowY, lowZ) === 1) { return false; }

    _setBlock(lowX, lowY, lowZ, _SM_blockType);
    _setStandardChestItemSlot([lowX, lowY, lowZ], 0, _SM_itemType, null, undefined, {
      customAttributes: {
        region: [lowX, lowY, lowZ, highX, highY, highZ]
      }
    });

    _log(_SM_prefix + "Registry unit created at (" + lowX + ", " + lowY + ", " + lowZ + ").", 2);

    return true;
  };

  const _SM_check = (registryPosition) => {
    if (_getBlockId(registryPosition[0], registryPosition[1], registryPosition[2]) === 1) { return false; }

    const region = _getStandardChestItemSlot(registryPosition, 0)?.attributes?.customAttributes?.region;
    if (!region) {
      _log(_SM_prefix + "No valid registry unit found.", 1);
    } else {
      _log(_SM_prefix + "Storage covers region from (" + region[0] + ", " + region[1] + ", " + region[2] + ") to (" + region[3] + ", " + region[4] + ", " + region[5] + ").", 3);
    }

    return true;
  };

  const _SM_build = (registryPosition, blocks, maxStorageUnitsPerTick) => {
    if (_SM_taskPhase === 1) {
      if (_getBlockId(registryPosition[0], registryPosition[1], registryPosition[2]) === 1) { return false; }

      const region = _getStandardChestItemSlot(registryPosition, 0)?.attributes?.customAttributes?.region;
      if (!region) {
        _log(_SM_prefix + "No valid registry unit found.", 1);
        return true;
      }

      _SM_lowX = region[0];
      _SM_lowY = region[1];
      _SM_lowZ = region[2];
      _SM_highX = region[3];
      _SM_highY = region[4];
      _SM_highZ = region[5];

      const capacity = (_SM_highX - _SM_lowX + 1) * (_SM_highY - _SM_lowY + 1) * (_SM_highZ - _SM_lowZ + 1) - 1;
      const required = (blocks.length + 3) >> 2;
      if (capacity < required) {
        _log(_SM_prefix + "Not enough space. Need " + required + " storage units, but region holds " + capacity + ".", 0);
        return true;
      }

      _SM_storageX = _SM_lowX;
      _SM_storageY = _SM_lowY;
      _SM_storageZ = _SM_lowZ;
      _SM_isChunkLoaded = {};
      _SM_blockIndex = 0;
      _SM_registrySlotIndex = 1;
      _SM_coordsCount = 0;

      _SM_taskPhase = 2;
    }

    let sx = _SM_storageX;
    let sy = _SM_storageY;
    let sz = _SM_storageZ;
    
    let budget = maxStorageUnitsPerTick;
    const blocksCount = blocks.length;
    let rawData, rawStart, rawEnd, escapedData, escapedCursor, escapedDataEnd, escapedChunkEnd, backslashPosition, runLength;
    let block, bx, by, bz, chunkId, storageSlotBaseIndex, chunkIndex, chunksLength;
    while (_SM_blockIndex < blocksCount) {
      if (_SM_taskPhase === 2) {
        sx++;
        if (sx > _SM_highX) {
          sx = _SM_lowX;
          sz++;
          if (sz > _SM_highZ) {
            sz = _SM_lowZ;
            sy++;
            if (sy > _SM_highY) {
              _log(_SM_prefix + "Region overflow on storage build at (" + registryPosition[0] + ", " + registryPosition[1] + ", " + registryPosition[2] + ").", 0);
              return true;
            }
          }
        }

        chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
        if (!_SM_isChunkLoaded[chunkId]) {
          if (_getBlockId(sx, sy, sz) === 1) { return false; }
          _SM_isChunkLoaded[chunkId] = true;
        }

        _setBlock(sx, sy, sz, _SM_blockType);
        _SM_storageX = sx;
        _SM_storageY = sy;
        _SM_storageZ = sz;
        _SM_storagePosition = [sx, sy, sz];
        _SM_partition = 0;

        _SM_taskPhase = 3;
      }

      while (_SM_partition < 4 && _SM_blockIndex < blocksCount) {
        if (_SM_taskPhase === 3) {
          block = blocks[_SM_blockIndex];
          bx = block[0];
          by = block[1];
          bz = block[2];
          chunkId = (bx >> 5) + "|" + (by >> 5) + "|" + (bz >> 5);
          if (!_SM_isChunkLoaded[chunkId]) {
            if (_getBlockId(bx, by, bz) === 1) { return false; }
            _SM_isChunkLoaded[chunkId] = true;
          }
          rawData = _getBlockData(bx, by, bz)?.persisted?.shared?.text;
          if (rawData?.length > 0) {
            chunkIndex = 0;
            rawStart = 0;
            rawEnd = 0;
            escapedData = JSON.stringify(rawData);
            escapedCursor = 1;
            escapedDataEnd = escapedData.length - 1;
            while (escapedCursor < escapedDataEnd) {
              escapedChunkEnd = escapedCursor + 1950;
              if (escapedChunkEnd > escapedDataEnd) { escapedChunkEnd = escapedDataEnd; }
              escapedChunkEnd -= (escapedData[escapedChunkEnd - 1] === "\\");
              while (escapedCursor < escapedChunkEnd) {
                backslashPosition = escapedData.indexOf("\\", escapedCursor);
                if (backslashPosition === -1 || backslashPosition >= escapedChunkEnd) {
                  runLength = escapedChunkEnd - escapedCursor;
                  escapedCursor += runLength;
                  rawEnd += runLength;
                  break;
                }
                if (backslashPosition > escapedCursor) {
                  runLength = backslashPosition - escapedCursor;
                  escapedCursor += runLength;
                  rawEnd += runLength;
                }
                escapedCursor += 2;
                rawEnd += 1;
              }
              _SM_dataChunksBuffer[chunkIndex++] = rawData.slice(rawStart, rawEnd);
              rawStart = rawEnd;
            }
            _SM_dataChunksBuffer.length = chunkIndex;
            _SM_taskPhase = 4;
          }
        }
        if (_SM_taskPhase === 4) {
          storageSlotBaseIndex = _SM_partition * 9;
          chunkIndex = 0;
          chunksLength = _SM_dataChunksBuffer.length;
          while (chunkIndex < chunksLength) {
            _SM_storageItemData.customAttributes._ = _SM_dataChunksBuffer[chunkIndex];
            _setStandardChestItemSlot(_SM_storagePosition, storageSlotBaseIndex + chunkIndex, _SM_itemType, null, undefined, _SM_storageItemData);
            chunkIndex++;
          }
          _SM_partition++;
          _SM_taskPhase = 3;
        }
        _SM_blockIndex++;
      }

      if (_SM_coordsCount >= 243) {
        _setStandardChestItemSlot(registryPosition, _SM_registrySlotIndex, _SM_itemType, null, undefined, _SM_registryItemData);
        _SM_storageCoordsBuffer.length = 0;
        _SM_coordsCount = 0;
        _SM_registrySlotIndex++;
      }

      _SM_storageCoordsBuffer[_SM_coordsCount++] = sx;
      _SM_storageCoordsBuffer[_SM_coordsCount++] = sy;
      _SM_storageCoordsBuffer[_SM_coordsCount++] = sz;

      _SM_taskPhase = 2;

      budget--;
      if (budget <= 0) { return false; }
    }

    _setStandardChestItemSlot(registryPosition, _SM_registrySlotIndex, _SM_itemType, null, undefined, _SM_registryItemData);

    _SM_storageItemData.customAttributes._ = null;
    _SM_storageCoordsBuffer.length = 0;
    _SM_dataChunksBuffer.length = 0;
    _SM_isChunkLoaded = null;
    _SM_storagePosition = null;

    _log(_SM_prefix + "Built storage at (" + registryPosition[0] + ", " + registryPosition[1] + ", " + registryPosition[2] + ").", 2);

    _SM_taskPhase = 1;
    return true;
  };

  const _SM_dispose = (registryPosition, maxStorageUnitsPerTick) => {
    if (_SM_taskPhase === 1) {
      if (_getBlockId(registryPosition[0], registryPosition[1], registryPosition[2]) === 1) { return false; }

      _SM_registryItems = _getStandardChestItems(registryPosition);
      if (!_SM_registryItems[0]?.attributes?.customAttributes?.region) {
        _log(_SM_prefix + "No valid registry unit found.", 1);
        _SM_registryItems = null;
        return true;
      }

      _SM_isChunkLoaded = {};
      _SM_registrySlotIndex = 1;
      _SM_coordsIndex = 0;

      _SM_taskPhase = 2;
    }
    
    let budget = maxStorageUnitsPerTick;
    let registryItem, sx, sy, sz, chunkId;
    while (registryItem = _SM_registryItems[_SM_registrySlotIndex]) {
      if (_SM_taskPhase === 2) {
        _SM_coordsList = registryItem.attributes.customAttributes._;
        _SM_coordsIndex = 0;
        _SM_coordsCount = _SM_coordsList.length;
        _SM_taskPhase = 3;
      }

      if (_SM_taskPhase === 3) {
        while (_SM_coordsIndex < _SM_coordsCount) {
          sx = _SM_coordsList[_SM_coordsIndex];
          sy = _SM_coordsList[_SM_coordsIndex + 1];
          sz = _SM_coordsList[_SM_coordsIndex + 2];

          chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
          if (!_SM_isChunkLoaded[chunkId]) {
            if (_getBlockId(sx, sy, sz) === 1) { return false; }
            _SM_isChunkLoaded[chunkId] = true;
          }

          _setBlock(sx, sy, sz, "Air");

          _SM_coordsIndex += 3;

          budget--;
          if (budget <= 0) { return false; }
        }

        _setStandardChestItemSlot(registryPosition, _SM_registrySlotIndex, "Air");

        _SM_registrySlotIndex++;
        _SM_taskPhase = 2;
      }
    }

    _log(_SM_prefix + "Disposed storage at (" + registryPosition[0] + ", " + registryPosition[1] + ", " + registryPosition[2] + ").", 2);

    _SM_isChunkLoaded = null;
    _SM_registryItems = null;
    _SM_coordsList = null;

    _SM_taskPhase = 1;
    return true;
  };

  const _SM_tick = () => {
    const tasksCount = _SM_taskQueue.length;
    let isActive = _SM_taskIndex < tasksCount;
    while (isActive) {
      try {
        if (!_SM_taskQueue[_SM_taskIndex]()) { break; }
      } catch (error) {
        _log(_SM_prefix + "Task error on tick - " + error.name + ": " + error.message, 0);
      }
      isActive = ++_SM_taskIndex < tasksCount;
    }
    if (!isActive) {
      _SM_taskIndex = 0;
      _SM_taskQueue.length = 0;
    }
  };

    /* ---------------- Event Manager ---------------- */
  const _EM_setup = () => {
    if (_EM_isSetupDone) { return; }

    const IF_ = _IF;
    const EVENT_REGISTRY = _CF.EVENT_REGISTRY;
    const ACTIVE_EVENTS = _CF.ACTIVE_EVENTS;
    const EM_config = _CF.event_manager;
    const isFrameworkEnabled = !!EM_config.is_framework_enabled;
    let defaultRetryLimit = EM_config.default_retry_limit | 0;
    defaultRetryLimit = (defaultRetryLimit & ~(defaultRetryLimit >> 31)) + (-defaultRetryLimit >> 31) + 1; // defaultRetryLimit > 0 ? defaultRetryLimit : 1

    let setupIndex = 0;
    const setupCount = ACTIVE_EVENTS.length;
    while (setupIndex < setupCount) {
      let eventName = ACTIVE_EVENTS[setupIndex];
      if (eventName === "tick") {
        setupIndex++;
        continue;
      }
      let registryEntry = EVENT_REGISTRY[eventName];
      if (registryEntry === undefined) {
        _EM_unknownActiveEvents[_EM_unknownActiveEvents.length] = eventName;
        setupIndex++;
        continue;
      }
      if (!(registryEntry instanceof Array)) {
        registryEntry = EVENT_REGISTRY[eventName] = [];
      }
      const interruptionStatus = !!registryEntry[1];
      if (eventName !== "onPlayerJoin") {
        _EM_activeEvents[_EM_activeEvents.length] = eventName;
        let handler = _NOOP;
        _EM_setEventHandler[eventName] = (fn) => { handler = (fn instanceof Function) ? fn : _NOOP };
        _EM_getEventHandler[eventName] = () => handler;
        if (isFrameworkEnabled && interruptionStatus) {
          let retryLimit = registryEntry[2];
          if (retryLimit == null) { retryLimit = defaultRetryLimit; }
          retryLimit |= 0;
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            IF_.state = 1;
            IF_.fn = handler;
            IF_.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
            IF_.limit = retryLimit;
            IF_.phase = 1048576; // _IF.default;
            try {
              return handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            } finally {
              IF_.state = 0;
            }
          };
        } else {
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            return handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          };
        }
      } else {
        _EM_join_handler = _JM_dispatch;
        _EM_setEventHandler.onPlayerJoin = (fn) => { _EM_join_handler = (fn instanceof Function) ? fn : _NOOP };
        _EM_getEventHandler.onPlayerJoin = () => _EM_join_handler;
        if (isFrameworkEnabled && interruptionStatus) {
          let retryLimit = registryEntry[2];
          if (retryLimit == null) { retryLimit = defaultRetryLimit; }
          retryLimit |= 0;
          globalThis.onPlayerJoin = function (arg0, arg1) {
            IF_.state = 1;
            IF_.fn = _EM_join_handler;
            IF_.args = [arg0, arg1];
            IF_.limit = retryLimit;
            IF_.phase = 1048576; // _IF.default;
            try {
              return _EM_join_handler(arg0, arg1);
            } finally {
              IF_.state = 0;
            }
          };
        } else {
          globalThis[eventName] = function (arg0, arg1) {
            return _EM_join_handler(arg0, arg1);
          };
        }
      }
      setupIndex++;
    }
  };

  const _EM_install = () => {
    const EVENT_REGISTRY = _CF.EVENT_REGISTRY;
    const activeEventsCount = _EM_activeEvents.length;
    while (_EM_installCursor < activeEventsCount) {
      const eventName = _EM_activeEvents[_EM_installCursor];
      _setCallbackValueFallback(eventName, EVENT_REGISTRY[eventName][0]);
      Object.defineProperty(globalThis, eventName, {
        configurable: true,
        set: _EM_setEventHandler[eventName],
        get: _EM_getEventHandler[eventName],
      });
      _EM_installCursor++;
    }
    if (_EM_join_handler) {
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: (fn) => { _EM_join_handler = (fn instanceof Function) ? fn : _NOOP },
        get: () => _EM_join_handler,
      });
    }
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
        set: (fn) => { _EM_tick_handler = (fn instanceof Function) ? fn : _NOOP },
        get: () => _EM_tick_handler,
    });
  };

  const _EM_reset = () => {
    const activeEventsCount = _EM_activeEvents.length;
    while (_EM_resetCursor < activeEventsCount) {
      _EM_setEventHandler[_EM_activeEvents[_EM_resetCursor]](_NOOP);
      _EM_resetCursor++;
    }
    if (_EM_join_handler) { _EM_join_handler = _NOOP; }
  };

    /* ---------------- Tick Multiplexer ---------------- */
  const _TM_dispatch = () => {
    _IF_tick();
    _TM_main(50);
    _TM_boot();
  };

  const _TM_install = () => {
    let bootEventHandler = _NOOP;
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => { _TM_main = bootEventHandler = (fn instanceof Function) ? fn : _NOOP; },
      get: () => bootEventHandler,
    });
    _TM_boot = _EM_tick_handler;
    _EM_tick_handler = _TM_dispatch;
  };

  const _TM_finalize = () => {
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => { _EM_tick_handler = (fn instanceof Function) ? fn : _NOOP },
      get: () => _EM_tick_handler,
    });
    _EM_tick_handler = _TM_main;
    _TM_boot = _NOOP;
  };

    /* ---------------- Join Manager ---------------- */
  const _JM_dispatch = (playerId, fromGameReset) => {
    const index = _JM_buffer.length;
    _JM_buffer[index] = playerId;
    _JM_buffer[index + 1] = fromGameReset;
    _JM_state[playerId] = 1;
  };

  const _JM_install = () => {
    _EM_join_handler = _JM_dispatch;
    let bootEventHandler = _NOOP;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => { _JM_main = bootEventHandler = (fn instanceof Function) ? fn : _NOOP; },
      get: () => bootEventHandler,
    });
  };

  const _JM_scan = () => {
    if (_JM_resetOnReboot || _OM_isPrimaryBoot) {
      const playerIds = _getPlayerIds();
      let cursor = 0;
      let playerId, index;
      while (playerId = playerIds[cursor]) {
        if (!_JM_state[playerId]) {
          index = _JM_buffer.length;
          _JM_buffer[index] = playerId;
          _JM_buffer[index + 1] = false;
          _JM_state[playerId] = 1;
        }
        cursor++;
      }
    }
  };

  const _JM_dequeue = () => {
    let budget = _JM_maxDequeuePerTick;
    let playerId, fromGameReset;
    while ((_JM_dequeueCursor < _JM_buffer.length) && (budget > 0)) {
      playerId = _JM_buffer[_JM_dequeueCursor];
      if (_JM_state[playerId] !== 2) {
        fromGameReset = _JM_buffer[_JM_dequeueCursor + 1];
        _JM_state[playerId] = 2;
        _JM_dequeueCursor += 2;

        _IF.state = 1;
        _IF.fn = _JM_main;
        _IF.args = [playerId, fromGameReset];
        _IF.limit = 2;
        _IF.phase = 1048576; // _IF.default
        try {
          _JM_main(playerId, fromGameReset);
        } catch (error) {
          _IF.state = 0;
          _log(_JM_prefix + error.name + ": " + error.message, 0);
        }
        _IF.state = 0;

        _JM_dequeueCursor -= 2;
        budget--;
      }
      _JM_dequeueCursor += 2;
    }
    return (_JM_dequeueCursor >= _JM_buffer.length);
  };

  const _JM_finalize = () => {
    _EM_join_handler = _JM_main;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => { _EM_join_handler = (fn instanceof Function) ? fn : _NOOP },
      get: () => _EM_join_handler,
    });
    _JM_buffer.length = 0;
  };

    /* ---------------- Block Manager ---------------- */
  const _BM_blockExecutor = () => {
    let budget = _BM_maxExecutionsPerTick;
    const blocksCount = _BM_blocks.length;
    let block, bx, by, bz, code;
    while (_BM_blockIndex < blocksCount) {
      block = _BM_blocks[_BM_blockIndex];
      if (!block || block.length < 3) {
        _CL.pointer = ++_BM_blockIndex;
        continue;
      }

      bx = block[0];
      by = block[1];
      bz = block[2];

      if ((block[3] = _getBlock(bx, by, bz)) === "Unloaded") { return false; }

      try {
        code = _getBlockData(bx, by, bz)?.persisted?.shared?.text;
        _eval(code);
      } catch (error) {
        _BM_errors[(++_BM_errorIndex) * +((_BM_errors.length - 1) < _BM_maxErrorsCount)] = [error.name, error.message, bx, by, bz];
      }

      _CL.pointer = ++_BM_blockIndex;

      budget--;
      if (budget <= 0) { return false; }
    }

    return true;
  };

  const _BM_storageExecutor = () => {
    if (!_BM_isRegistryLoaded) {
      const registryPosition = _BM_blocks[0];
      if (!registryPosition || registryPosition.length < 3) { return true; }
      if (_getBlockId(registryPosition[0], registryPosition[1], registryPosition[2]) === 1) { return false; }
      _BM_registryItems = _getStandardChestItems(registryPosition);
      if (!_BM_registryItems[0]?.attributes?.customAttributes?.region) { return true; }
      _BM_isRegistryLoaded = true;
    }

    let budget = _BM_maxExecutionsPerTick;
    let registryItem, coordsList, coordsCount, sx, sy, sz, chunkId, code, storageSlotBaseIndex, chunkIndex, storageItem;
    while (registryItem = _BM_registryItems[_BM_registrySlotIndex]) {
      coordsList = registryItem.attributes.customAttributes._;
      coordsCount = coordsList.length - 2;
      while (_BM_coordsIndex < coordsCount) {
        sx = coordsList[_BM_coordsIndex];
        sy = coordsList[_BM_coordsIndex + 1];
        sz = coordsList[_BM_coordsIndex + 2];

        chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
        if (!_BM_isChunkLoaded[chunkId]) {
          if (_getBlockId(sx, sy, sz) === 1) { return false; }
          _BM_isChunkLoaded[chunkId] = true;
        }

        if (_BM_partition === 0) {
          _BM_storageItems = _getStandardChestItems([sx, sy, sz]);
        }

        while (_BM_partition < 4) {
          code = "";
          storageSlotBaseIndex = _BM_partition * 9;
          chunkIndex = 0;
          while (chunkIndex < 9 && (storageItem = _BM_storageItems[storageSlotBaseIndex + chunkIndex])) {
            code += storageItem.attributes.customAttributes._;
            chunkIndex++;
          }

          if (chunkIndex === 0) {
            _CL.pointer++;
            break;
          }

          try {
            _eval(code);
          } catch (error) {
            _BM_errors[(++_BM_errorIndex) * +((_BM_errors.length - 1) < _BM_maxErrorsCount)] = [error.name, error.message, sx, sy, sz, _BM_partition];
          }

          _BM_partition++;
          _CL.pointer++;

          budget--;
          if (budget <= 0) { return false; }
        }
        _BM_partition = 0;
        _BM_coordsIndex += 3;
      }
      _BM_coordsIndex = 0;
      _BM_registrySlotIndex++;
    }

    return true;
  };

  const _BM_install = () => {
    _BM_executor = _BM_isChestMode ? _BM_storageExecutor : _BM_blockExecutor; 
  };

  const _BM_finalize = () => {
    _BM_errors[0] = null;
    _BM_isChunkLoaded = null;
    _BM_registryItems = null;
    _BM_storageItems = null;
  };

    /* ---------------- Boot Manager ---------------- */
  const _OM_bootLogs = (showErrors) => {
    let message = "Code was loaded in " + (_OM_loadTimeTicks * 50) + " ms";
    const errorsCount = _BM_errors.length - 1;
    if (showErrors) {
      message += (errorsCount > 0) ? (" with " + errorsCount + " error" + ((errorsCount === 1) ? "" : "s") + ".") : (" with 0 errors.");
    } else {
      message += ".";
    }
    _log(_OM_prefix + message, 1 + (errorsCount <= 0));
  };

  const _OM_errorLogs = (showSuccess) => {
    const errorsCount = _BM_errors.length - 1;
    if (errorsCount > 0) {
      let message = "Code execution error" + ((errorsCount === 1) ? "" : "s") + ":";
      let error;
      if (_BM_isChestMode) {
        for (let index = 1; index <= errorsCount; index++) {
          error = _BM_errors[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + ") in partition (" + error[5] + "): " + error[1];
        }
      } else {
        for (let index = 1; index <= errorsCount; index++) {
          error = _BM_errors[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + "): " + error[1];
        }
      }
      _log(_BM_prefix + message, 0);
    } else if (showSuccess) {
      _log(_BM_prefix + "No code execution errors.", 2);
    }
  };

  const _OM_executionLogs = () => {
    let message = "";
    let block;
    if (_BM_isChestMode) {
      if (_BM_isRegistryLoaded) {
        block = _BM_blocks[0];
        message = "Executed storage data at (" + block[0] + ", " + block[1] + ", " + block[2] + ").";
      } else {
        message = "No storage data found.";
      }
    } else {
      let amount = 0;
      const blocksCount = _BM_blocks.length;
      for (let index = 0; index < blocksCount; index++) {
        block = _BM_blocks[index];
        if (block[3]) {
          message += "\n\"" + block[3] + "\" at (" + block[0] + ", " + block[1] + ", " + block[2] + ")";
          amount++;
        }
      }
      message = "Executed " + amount + " block" + ((amount === 1) ? "" : "s") + " data" + ((amount === 0) ? "." : ":") + message;
    }
    _log(_BM_prefix + message, 3);
  };

  const _OM_completeLogs = (showBoot, showErrors, showExecution) => {
    if (_EM_unknownActiveEvents.length) {
      _log(_EM_prefix + "Unknown active events: \"" + _EM_unknownActiveEvents.join("\", \"") + "\".", 1);
    }
    if (showBoot) {
      _OM_bootLogs(showErrors);
    }
    if (showErrors) {
      _OM_errorLogs(!showBoot);
    }
    if (showExecution) {
      _OM_executionLogs();
    }
  };

  const _OM_tick = () => {
    _OM_tickNum++;

    if (_OM_phase < 3) {
      if (_OM_phase === -2) {
        if (!_EM_isSetupDone && _OM_tickNum > 20) {
          const message = _EM_prefix + "Error on primary setup - " + _EM_setupError?.[0] + ": " + _EM_setupError?.[1] + ".";
          const playerIds = _getPlayerIds();
          let index = 0;
          let playerId;
          while (playerId = playerIds[index]) {
            if (api.checkValid(playerId)) {
              api.kickPlayer(playerId, message);
            }
            index++;
          }
        }
        return;
      }

      if (_OM_phase === 0) {
        _establish();
        _OM_phase = 1;
      }

      if (_OM_phase === 1) {
        if (_OM_tickNum < _OM_bootDelayTicks) { return; }
        _OM_phase = 2;
      }

      if (_OM_phase === 2) {
        if (_OM_isPrimaryBoot) {
          _EM_install();
        } else {
          _EM_reset();
        }
        if (_EM_join_handler) {
          _JM_install();
          _JM_scan();
        }
        _BM_install();
        _TM_install();
        _OM_phase = 3;
      }
    }

    if (_OM_phase === 3 && _BM_executor()) {
      _BM_finalize()
      _OM_phase = 4 + !_EM_join_handler;
    }

    if (_OM_phase === 4 && _JM_dequeue()) {
      _JM_finalize();
      _OM_phase = 5;
    }

    if (_OM_phase === 5) {
      _TM_finalize();
      _CL.isPrimaryBoot = _OM_isPrimaryBoot = false;
      _CL.isRunning = _OM_isRunning = false;
      _OM_phase = -1;

      _OM_loadTimeTicks = _OM_tickNum - _OM_bootDelayTicks + 1;
      _OM_completeLogs(_OM_showBootLogs, _OM_showErrorLogs, _OM_showExecutionLogs);
    }
  };


  /* ================ SETUP ================ */

    /* ---------------- Interruption Framework ---------------- */
  _IF.tick = _IF_tick;

  Object.defineProperty(globalThis.InternalError.prototype, "name", {
    configurable: true,
    get: () => {
      if (_IF_external) {
        if (_IF.state) {
          _IF_interrupted[_IF_enqueueId++] = [_IF.fn, _IF.args, _IF.limit, _IF.phase, _IF.cache];
          _IF_queueSize++;
        }
      } else {
        _IF_element[3] = _IF.phase;
        _IF.wasInterrupted = false;
        _IF_external = 1;
      }
      _IF.state = 0;
      return "InternalError";
    },
  });

    /* ---------------- Storage Manager ---------------- */
  _SM.create = (lowPosition, highPosition) => {
    _SM_taskQueue[_SM_taskQueue.length] = () => _SM_create(lowPosition, highPosition);
  };

  _SM.check = (registryPosition) => {
    _SM_taskQueue[_SM_taskQueue.length] = () => _SM_check(registryPosition);
  };

  _SM.build = (registryPosition, blocks, maxStorageUnitsPerTick = 8) => {
    _SM_taskQueue[_SM_taskQueue.length] = () => _SM_build(registryPosition, blocks, maxStorageUnitsPerTick);
  };

  _SM.dispose = (registryPosition, maxStorageUnitsPerTick = 32) => {
    _SM_taskQueue[_SM_taskQueue.length] = () => _SM_dispose(registryPosition, maxStorageUnitsPerTick);
  };

    /* ---------------- Code Loader ---------------- */
  _CL.SM = _SM;

  _CL.config = _CF;

  _CL.reboot = () => {
    if (!_OM_isRunning) {
      _OM_tickNum = 0;
      _CL.isRunning = _OM_isRunning = true;
      _CL.pointer = 0;
      _EM_tick_handler = _OM_tick;
      _OM_phase = 0;
    } else {
      _log(_OM_prefix + "Reboot request was denied.", 1);
    }
  };

  _CL.bootLogs = (showErrors = true) => {
    _OM_bootLogs(showErrors);
  };

  _CL.errorLogs = (showSuccess = true) => {
    _OM_errorLogs(showSuccess);
  };

  _CL.executionLogs = () => {
    _OM_executionLogs();
  };

  _CL.completeLogs = (showBoot = true, showErrors = true, showExecution = false) => {
    _OM_completeLogs(showBoot, showErrors, showExecution);
  };

    /* ---------------- Tick Event ---------------- */
  _EM_tick_handler = _OM_tick;
  _EM_setEventHandler.tick = (fn) => { _EM_tick_handler = (fn instanceof Function) ? fn : _NOOP; };
  _EM_getEventHandler.tick = () => _EM_tick_handler;
  globalThis.tick = function () {
    _EM_tick_handler(50);
    if (_SM_taskQueue.length) { _SM_tick(); }
  };

    /* ---------------- Primary Boot ---------------- */
  try {
    _OM_tickNum = 0;
    _CL.isRunning = _OM_isRunning = true;
    _CL.pointer = 0;

    _EM_setup();

    const configStyles = _CF.STYLES;
    for (let type = 0; type < 4; type++) {
      _STYLES[type] = [{
        str: "",
        style: {
          color: configStyles[type * 3],
          fontWeight: configStyles[type * 3 + 1],
          fontSize: configStyles[type * 3 + 2],
        }
      }];
    }

    const seal = Object.seal;
    const freeze = Object.freeze;
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

    _EM_isSetupDone = true;
    _OM_phase = 0;
  } catch (error) {
    _EM_setupError = [error.name, error.message];
  }

  globalThis.IF = _IF;
  globalThis.CL = _CL;

  void 0;
}

// 26/01/2026
