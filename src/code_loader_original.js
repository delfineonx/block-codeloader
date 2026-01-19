// Copyright (c) 2025-2026 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const configuration = {
  // [[eventName, fallbackValue?], ...]
  // [[string, boolean|string|number|object|null|"undefined"], ...]
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
    is_chest_data: false,
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
  // string -> [boolean|string|number|object|null|undefined, boolean|null, number|null]
  EVENT_REGISTRY: {
    "tick": null, // special event
    "onClose": [false],
    "onPlayerJoin": [false],
    "onPlayerLeave": [false],
    "onPlayerJump": [false],
    "onRespawnRequest": [[0, -100000, 0]],
    "playerCommand": [null],
    "onPlayerChat": [null],
    "onPlayerChangeBlock": ["preventChange"],
    "onPlayerDropItem": ["preventDrop"],
    "onPlayerPickedUpItem": [false],
    "onPlayerSelectInventorySlot": [false],
    "onBlockStand": [false],
    "onPlayerAttemptCraft": ["preventCraft"],
    "onPlayerCraft": [false],
    "onPlayerAttemptOpenChest": ["preventOpen"],
    "onPlayerOpenedChest": [false],
    "onPlayerMoveItemOutOfInventory": ["preventChange"],
    "onPlayerMoveInvenItem": ["preventChange"],
    "onPlayerMoveItemIntoIdxs": ["preventChange"],
    "onPlayerSwapInvenSlots": ["preventChange"],
    "onPlayerMoveInvenItemWithAmt": ["preventChange"],
    "onPlayerAttemptAltAction": ["preventAction"],
    "onPlayerAltAction": [false],
    "onPlayerClick": [false],
    "onClientOptionUpdated": [false],
    "onMobSettingUpdated": [false],
    "onInventoryUpdated": [false],
    "onChestUpdated": [false],
    "onWorldChangeBlock": ["preventChange"],
    "onCreateBloxdMeshEntity": [false],
    "onEntityCollision": [false],
    "onPlayerAttemptSpawnMob": ["preventSpawn"],
    "onWorldAttemptSpawnMob": ["preventSpawn"],
    "onPlayerSpawnMob": [false],
    "onWorldSpawnMob": [false],
    "onWorldAttemptDespawnMob": ["preventDespawn"],
    "onMobDespawned": [false],
    "onPlayerAttack": [false],
    "onPlayerDamagingOtherPlayer": ["preventDamage"],
    "onPlayerDamagingMob": ["preventDamage"],
    "onMobDamagingPlayer": ["preventDamage"],
    "onMobDamagingOtherMob": ["preventDamage"],
    "onAttemptKillPlayer": ["preventDeath"],
    "onPlayerKilledOtherPlayer": ["keepInventory"],
    "onMobKilledPlayer": ["keepInventory"],
    "onPlayerKilledMob": ["preventDrop"],
    "onMobKilledOtherMob": ["preventDrop"],
    "onPlayerPotionEffect": [false],
    "onPlayerDamagingMeshEntity": [false],
    "onPlayerBreakMeshEntity": [false],
    "onPlayerUsedThrowable": [false],
    "onPlayerThrowableHitTerrain": [false],
    "onTouchscreenActionButton": [false],
    "onTaskClaimed": [false],
    "onChunkLoaded": [false],
    "onPlayerRequestChunk": [false],
    "onItemDropCreated": [false],
    "onPlayerStartChargingItem": [false],
    "onPlayerFinishChargingItem": [false],
    "doPeriodicSave": [false],
  },

  STYLES: [
    "#FF775E", "500", "0.95rem", // error
    "#FFC23D", "500", "0.95rem", // warning
    "#20DD69", "500", "0.95rem", // success
    "#52B2FF", "500", "0.95rem", // info
  ],
};

const _NOOP = function () { };
const _PREFIX = "Code Loader";
const _log = (message, type) => {
  const styledText = _log.STYLES[type];
  styledText[0].str = message;
  api.broadcastMessage(styledText);
};

const InterruptionFramework = {
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
const EventManager = {
  isPrimarySetupDone: false,
  primarySetupError: null, // [error.name, error.message]
  delegator: {}, // eventName -> handler
  isEventActive: {}, // eventName -> true
  unregisteredActiveEvents: [], // [eventName, ...]

  invalidActiveEvents: null, // [eventName, ...]
  established: false,

  primarySetup: null,
  primaryInstall: null,
  establish: null,
  resetHandlers: null,
  setupFallbacks: null,
};
const TickMultiplexer = {
  init: null,

  established: false,

  establish: null,
  install: null,
  finalize: null,
};
const JoinManager = {
  established: false,

  establish: null,
  bufferPlayers: null,
  install: null,
  dequeue: null,
  finalize: null,
};
const BlockManager = {
  executeBlockData: null,
  executeStorageData: null,

  phase: -1,
  blocks: null, // [[x, y, z, blockName], ...]
  errors: null, // [[error.name, error.message, x, y, z, partition], ...]
  isChestData: false,
  registryLoaded: false,
  established: false,

  establish: null,
  finalize: null,
};
const BootManager = {
  phase: -2,
  isPrimaryBoot: true,
  isRunning: false,

  bootLogs: null,
  errorLogs: null,
  executionLogs: null,
  completeLogs: null,

  tick: null,
};
const StorageManager = {
  create: null,
  check: null,
  build: null,
  dispose: null,

  tick: null,
};
const CodeLoader = {
  SM: null,
  config: null,
  isPrimaryBoot: true,
  isRunning: false,

  reboot: null,
  bootLogs: null,
  errorLogs: null,
  executionLogs: null,
  completeLogs: null,
};

// Interruption Framework
{
  const _IF = InterruptionFramework;

  const _interrupted = {};
  const _emptyArgs = [];

  let _external = 1;
  let _element = [];
  let _enqueueId = 1;
  let _dequeueId = 1;
  let _queueSize = 0;

  Object.defineProperty(globalThis.InternalError.prototype, "name", {
    configurable: true,
    get: () => {
      if (_external) {
        if (_IF.state) {
          _interrupted[_enqueueId++] = [_IF.fn, _IF.args, _IF.limit, _IF.phase, _IF.cache];
          _queueSize++;
        }
      } else {
        _element[3] = _IF.phase;
        _IF.wasInterrupted = false;
        _external = 1;
      }
      _IF.state = 0;
      return "InternalError";
    },
  });

  _IF.tick = () => {
    _IF.state = 0;
    if (!_queueSize) {
      _IF.args = _emptyArgs;
      _IF.cache = null;
      return;
    }

    _external = 0;
    _IF.wasInterrupted = true;

    while (_dequeueId < _enqueueId) {
      _element = _interrupted[_dequeueId];
      if (_element[2] > 0) {
        _element[2]--;
        _IF.phase = _element[3];
        _IF.cache = _element[4];
        _element[0](..._element[1]);
      }
      delete _interrupted[_dequeueId++];
      _queueSize--;
    }

    _IF.state = 0;
    _IF.args = _emptyArgs;
    _IF.cache = null;
    _IF.wasInterrupted = false;
    _external = 1;
  };
}

// EventManager
{
  const _CF = configuration;
  const _IF = InterruptionFramework;
  const _EM = EventManager;

  const api_setCallbackValueFallback = api.setCallbackValueFallback;

  let _primaryInstallCursor = 0;
  let _primaryActiveEvents = []; // [eventName, ...]

  let _activeEvents;
  let _eventRegistry;
  let _resetCursor;
  let _setupCursor;

  _EM.primarySetup = () => {
    if (_EM.isPrimarySetupDone) {
      return;
    }

    _eventRegistry = _CF.EVENT_REGISTRY;
    _activeEvents = _CF.ACTIVE_EVENTS;
    const thisConfig = _CF.event_manager;
    const isFrameworkEnabled = !!thisConfig.is_framework_enabled;
    let defaultRetryLimit = thisConfig.default_retry_limit | 0;
    defaultRetryLimit = (defaultRetryLimit & ~(defaultRetryLimit >> 31)) + (-defaultRetryLimit >> 31) + 1; // defaultRetryLimit > 0 ? defaultRetryLimit : 1

    const delegator = _EM.delegator;
    const isEventActive = _EM.isEventActive;
    const unregisteredActiveEvents = _EM.unregisteredActiveEvents;

    let primaryIndex = 0;
    const activeEventsCount = _activeEvents.length;
    while (primaryIndex < activeEventsCount) {
      let eventName = _activeEvents[primaryIndex];
      if (eventName instanceof Array) {
        eventName = eventName[0];
      }
      if (eventName === "tick") {
        primaryIndex++;
        continue;
      }
      let registryEntry = _eventRegistry[eventName];
      if (registryEntry === undefined) {
        unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
        primaryIndex++;
        continue;
      }
      _primaryActiveEvents[_primaryActiveEvents.length] = eventName;
      isEventActive[eventName] = true;
      if (!(registryEntry instanceof Array)) {
        registryEntry = _eventRegistry[eventName] = [false];
      }
      const interruptionStatus = !!registryEntry[1];
      if (isFrameworkEnabled && interruptionStatus) {
        let retryLimit = registryEntry[2];
        if (retryLimit == null) {
          retryLimit = defaultRetryLimit;
        }
        retryLimit |= 0;
        delegator[eventName] = _NOOP;
        globalThis[eventName] = function handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          _IF.state = 1;
          _IF.fn = handler;
          _IF.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
          _IF.limit = retryLimit;
          _IF.phase = 1048576; // _IF.default;
          try {
            return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          } finally {
            _IF.state = 0;
          }
        };
      } else {
        delegator[eventName] = _NOOP;
        globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        };
      }
      primaryIndex++;
    }
    isEventActive.tick = true;
  };

  _EM.primaryInstall = () => {
    const delegator = _EM.delegator;
    const activeEventsCount = _primaryActiveEvents.length;
    while (_primaryInstallCursor < activeEventsCount) {
      const eventName = _primaryActiveEvents[_primaryInstallCursor];
      Object.defineProperty(globalThis, eventName, {
        configurable: true,
        set: (fn) => {
          if (fn instanceof Function) {
            delegator[eventName] = fn;
          } else {
            delegator[eventName] = _NOOP;
          }
        },
        get: () => delegator[eventName],
      });
      _primaryInstallCursor++;
    }
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          delegator.tick = fn;
        } else {
          delegator.tick = _NOOP;
        }
      },
      get: () => delegator.tick,
    });
  };

  _EM.establish = () => {
    if (_EM.established) {
      return;
    }
    _activeEvents = _CF.ACTIVE_EVENTS;
    _EM.invalidActiveEvents = [];
    _resetCursor = 0;
    _setupCursor = 0;
    _EM.established = true;
  };

  _EM.resetHandlers = () => {
    const delegator = _EM.delegator;
    const activeEventsCount = _primaryActiveEvents.length;
    while (_resetCursor < activeEventsCount) {
      delegator[_primaryActiveEvents[_resetCursor]] = _NOOP;
      _resetCursor++;
    }
  };

  _EM.setupFallbacks = () => {
    const isEventActive = _EM.isEventActive;
    const activeEventsCount = _activeEvents.length;
    let eventEntry, eventName;
    while (_setupCursor < activeEventsCount) {
      eventEntry = _activeEvents[_setupCursor];
      eventName = eventEntry;
      if (eventEntry instanceof Array) {
        eventName = eventEntry[0];
      }
      if (eventName === "tick") {
        _setupCursor++;
        continue;
      }
      if (isEventActive[eventName]) {
        let fallbackValue;
        if (eventEntry instanceof Array) {
          fallbackValue = eventEntry[1];
        }
        if (fallbackValue === undefined) {
          fallbackValue = _eventRegistry[eventName][0];
        } else if (fallbackValue === "undefined") {
          fallbackValue = undefined;
        }
        api_setCallbackValueFallback(eventName, fallbackValue);
      } else {
        _EM.invalidActiveEvents[_EM.invalidActiveEvents.length] = eventName;
      }
      _setupCursor++;
    }
  };
}

// TickMultiplexer
{
  const _IF = InterruptionFramework;
  const _EM = EventManager;
  const _TM = TickMultiplexer;

  let _boot;
  let _main;
  let _installed;
  let _finalized;

  _TM.establish = () => {
    if (_TM.established) {
      return;
    }
    _boot = _NOOP;
    _TM.init = _NOOP;
    _main = _NOOP;

    _installed = false;
    _finalized = false;
    _TM.established = true;
  };

  const _dispatch = () => {
    _IF.tick();
    _boot();
    _TM.init();
    _main(50);
  };

  _TM.install = () => {
    if (_installed) {
      return;
    }
    const delegator = _EM.delegator;
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          _main = fn;
        } else {
          _main = _NOOP;
        }
      },
      get: () => delegator.tick,
    });
    _boot = _EM.delegator.tick;
    _EM.delegator.tick = _dispatch;
    _installed = true;
  };

  _TM.finalize = () => {
    if (_finalized) {
      return;
    }
    const delegator = _EM.delegator;
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          delegator.tick = fn;
        } else {
          delegator.tick = _NOOP;
        }
      },
      get: () => delegator.tick,
    });
    delegator.tick = _main;
    _boot = _NOOP;
    _TM.init = _NOOP;
    _finalized = true;
  };
}

// JoinManager
{
  const _CF = configuration;
  const _IF = InterruptionFramework;
  const _EM = EventManager;
  const _JM = JoinManager;
  const _OM = BootManager;
  const _JMprefix = _PREFIX + " JM: ";

  let _resetOnReboot;
  let _maxDequeuePerTick;
  let _main;
  let _buffer; // [playerId, ...]
  let _joinState; // playerId -> 0/1/2
  let _dequeueCursor;
  let _installed;
  let _finalized;

  _JM.establish = () => {
    if (_JM.established) {
      return;
    }
    const thisConfig = _CF.join_manager;
    _resetOnReboot = !!thisConfig.reset_on_reboot;
    _maxDequeuePerTick = thisConfig.max_dequeue_per_tick | 0;
    _maxDequeuePerTick = (_maxDequeuePerTick & ~(_maxDequeuePerTick >> 31)) + (-_maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1

    _main = _NOOP;
    _buffer = [];
    if (_resetOnReboot | !_joinState) {
      _joinState = {};
    }
    _dequeueCursor = 0;

    _installed = false;
    _finalized = false;
    _JM.established = true;
  };

  const _dispatch = (playerId) => {
    _buffer[_buffer.length] = playerId;
    _joinState[playerId] = 1;
  };

  _JM.install = () => {
    if (_installed) {
      return;
    }
    const delegator = _EM.delegator;
    delegator.onPlayerJoin = _dispatch;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          _main = fn;
        } else {
          _main = _NOOP;
        }
      },
      get: () => delegator.onPlayerJoin,
    });
    _installed = true;
  };

  _JM.bufferPlayers = () => {
    if (_resetOnReboot | _OM.isPrimaryBoot) {
      const playerIds = api.getPlayerIds();
      let index = 0;
      let playerId;
      while (playerId = playerIds[index]) {
        if (!_joinState[playerId]) {
          _buffer[_buffer.length] = playerId;
          _joinState[playerId] = 1;
        }
        index++;
      }
    }
  };

  _JM.dequeue = () => {
    let budget = _maxDequeuePerTick;
    let playerId;
    while ((_dequeueCursor < _buffer.length) && (budget > 0)) {
      playerId = _buffer[_dequeueCursor];
      if (_joinState[playerId] !== 2) {
        _dequeueCursor++;
        _joinState[playerId] = 2;

        _IF.state = 1;
        _IF.fn = _main;
        _IF.args = [playerId];
        _IF.limit = 2;
        _IF.phase = 1048576; // _IF.default
        try {
          _main(playerId);
        } catch (error) {
          _IF.state = 0;
          _log(_JMprefix + error.name + ": " + error.message, 0);
        }
        _IF.state = 0;

        _dequeueCursor--;
        budget--;
      }
      _dequeueCursor++;
    }
    return (_dequeueCursor >= _buffer.length);
  };

  _JM.finalize = () => {
    if (_finalized) {
      return;
    }
    const delegator = _EM.delegator;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          delegator.onPlayerJoin = fn;
        } else {
          delegator.onPlayerJoin = _NOOP;
        }
      },
      get: () => delegator.onPlayerJoin,
    });
    delegator.onPlayerJoin = _main;
    _buffer = null;
    _finalized = true;
  };
}

// BlockManager
{
  const _CF = configuration;
  const _BM = BlockManager;

  const api_getBlock = api.getBlock;
  const api_getBlockId = api.getBlockId;
  const api_getBlockData = api.getBlockData;
  const api_getStandardChestItems = api.getStandardChestItems;

  let _maxExecutionsPerTick;
  let _maxErrorsCount;
  let _errorIndex;
  let _blockIndex;
  let _registryItems;
  let _registrySlotIndex;
  let _coordsIndex;
  let _partition;
  let _finalized;

  _BM.establish = () => {
    if (_BM.established) {
      return;
    }
    _BM.blocks = (_CF.BLOCKS instanceof Array) ? _CF.BLOCKS : [];
    const thisConfig = _CF.block_manager;
    _BM.isChestData = !!thisConfig.is_chest_data;
    _maxExecutionsPerTick = thisConfig.max_executions_per_tick | 0;
    _maxExecutionsPerTick = (_maxExecutionsPerTick & ~(_maxExecutionsPerTick >> 31)) + (-_maxExecutionsPerTick >> 31) + 1; // maxExecutionsPerTick > 0 ? maxExecutionsPerTick : 1
    _maxErrorsCount = thisConfig.max_errors_count | 0;
    _maxErrorsCount = _maxErrorsCount & ~(_maxErrorsCount >> 31); // maxErrorsCount > 0 ? maxErrorsCount : 0

    _BM.phase = 0;
    _BM.errors = [null];
    _errorIndex = 0;
    _blockIndex = 0;
    _BM.registryLoaded = false;
    _registryItems = null;
    _registrySlotIndex = 1;
    _coordsIndex = 0;
    _partition = 0;
    _finalized = false;

    _BM.established = true;
  };

  _BM.executeBlockData = () => {
    const blocks = _BM.blocks;
    const errors = _BM.errors;

    let budget = _maxExecutionsPerTick;
    const blocksCount = blocks.length;
    let block, x, y, z, code;
    while (_blockIndex < blocksCount) {
      block = blocks[_blockIndex];
      if (!block || block.length < 3) {
        _blockIndex++;
        continue;
      }

      x = block[0];
      y = block[1];
      z = block[2];

      if ((block[3] = api_getBlock(x, y, z)) === "Unloaded") {
        return;
      }

      code = api_getBlockData(x, y, z)?.persisted?.shared?.text;

      try {
        (0, eval)(code);
      } catch (error) {
        _errorIndex++;
        errors[_errorIndex * +((errors.length - 1) < _maxErrorsCount)] = [error.name, error.message, x, y, z];
      }

      _blockIndex++;

      budget--;
      if (budget <= 0) {
        return;
      }
    }

    _BM.phase = 1;
  };

  _BM.executeStorageData = () => {
    const errors = _BM.errors;

    if (!_BM.registryLoaded) {
      const registryPosition = _BM.blocks[0];
      if (!registryPosition || registryPosition.length < 3) {
        _BM.phase = 1;
        return;
      }
      if (api_getBlockId(registryPosition[0], registryPosition[1], registryPosition[2]) === 1) {
        return;
      }
      _registryItems = api_getStandardChestItems(registryPosition);
      if (!_registryItems[0]?.attributes?.customAttributes?.region) {
        _BM.phase = 1;
        return;
      }
      _BM.registryLoaded = true;
    }

    let budget = _maxExecutionsPerTick;
    let registryItem, coordsList, coordsLength, x, y, z, storageItems, code, storageSlotBaseIndex, chunkIndex, storageItem;
    while (registryItem = _registryItems[_registrySlotIndex]) {
      coordsList = registryItem.attributes.customAttributes._;
      coordsLength = coordsList.length - 2;
      while (_coordsIndex < coordsLength) {
        x = coordsList[_coordsIndex];
        y = coordsList[_coordsIndex + 1];
        z = coordsList[_coordsIndex + 2];

        if (api_getBlockId(x, y, z) === 1) {
          return;
        }

        storageItems = api_getStandardChestItems([x, y, z]);

        while (_partition < 4) {
          code = "";
          storageSlotBaseIndex = _partition * 9;
          chunkIndex = 0;
          while (chunkIndex < 9 && (storageItem = storageItems[storageSlotBaseIndex + chunkIndex])) {
            code += storageItem.attributes.customAttributes._;
            chunkIndex++;
          }

          try {
            (0, eval)(code);
          } catch (error) {
            _errorIndex++;
            errors[_errorIndex * +((errors.length - 1) < _maxErrorsCount)] = [error.name, error.message, x, y, z, _partition];
          }

          _partition++;

          budget--;
          if (budget <= 0) {
            return;
          }
        }
        _partition = 0;
        _coordsIndex += 3;
      }
      _coordsIndex = 0;
      _registrySlotIndex++;
    }

    _BM.phase = 1;
  };

  _BM.finalize = () => {
    if (_finalized) {
      return;
    }
    _BM.errors[0] = null;
    _registryItems = null;
    _finalized = true;
  };
}

// BootManager
{
  const _CF = configuration;
  const _EM = EventManager;
  const _TM = TickMultiplexer;
  const _JM = JoinManager;
  const _BM = BlockManager;
  const _OM = BootManager;
  const _CL = CodeLoader;
  const _EMprefix = _PREFIX + " EM: ";
  const _BMprefix = _PREFIX + " BM: ";
  const _OMprefix = _PREFIX + " OM: ";

  let _tickNum = -1;

  let _bootDelayTicks;
  let _showBootLogs;
  let _showErrorLogs;
  let _showExecutionLogs;
  let _loadTimeTicks;

  _OM.bootLogs = (showErrors) => {
    let message = "Code was loaded in " + (_loadTimeTicks * 50) + " ms";
    const errorsCount = _BM.errors.length - 1;
    if (showErrors) {
      message += (errorsCount > 0) ? (" with " + errorsCount + " error" + ((errorsCount === 1) ? "" : "s") + ".") : (" with 0 errors.");
    } else {
      message += ".";
    }
    _log(_OMprefix + message, 1 + (errorsCount <= 0));
  };

  _OM.errorLogs = (showSuccess) => {
    const errors = _BM.errors;
    const errorsCount = errors.length - 1;
    if (errorsCount > 0) {
      let message = "Code execution error" + ((errorsCount === 1) ? "" : "s") + ":";
      let error;
      if (_BM.isChestData) {
        for (let index = 1; index <= errorsCount; index++) {
          error = errors[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + ") in partition (" + error[5] + "): " + error[1];
        }
      } else {
        for (let index = 1; index <= errorsCount; index++) {
          error = errors[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + "): " + error[1];
        }
      }
      _log(_BMprefix + message, 0);
    } else if (showSuccess) {
      _log(_BMprefix + "No code execution errors.", 2);
    }
  };

  _OM.executionLogs = () => {
    const blocks = _BM.blocks;
    let message = "";
    let block;
    if (_BM.isChestData) {
      if (_BM.registryLoaded) {
        block = blocks[0];
        message = "Executed storage data at (" + block[0] + ", " + block[1] + ", " + block[2] + ").";
      } else {
        message = "No storage data found.";
      }
    } else {
      let amount = 0;
      const blocksCount = blocks.length;
      for (let index = 0; index < blocksCount; index++) {
        block = blocks[index];
        if (block[3]) {
          message += "\n\"" + block[3] + "\" at (" + block[0] + ", " + block[1] + ", " + block[2] + ")";
          amount++;
        }
      }
      message = "Executed " + amount + " block" + ((amount === 1) ? "" : "s") + " data" + ((amount === 0) ? "." : ":") + message;
    }
    _log(_BMprefix + message, 3);
  };

  _OM.completeLogs = (showBoot, showErrors, showExecution) => {
    if (_EM.unregisteredActiveEvents.length) {
      _log(_EMprefix + "Unregistered active events: \"" + _EM.unregisteredActiveEvents.join("\", \"") + "\".", 1);
    }
    if (_EM.invalidActiveEvents.length) {
      _log(_EMprefix + "Invalid active events: \"" + _EM.invalidActiveEvents.join("\", \"") + "\".", 1);
    }
    if (showBoot) {
      _OM.bootLogs(showErrors);
    }
    if (showErrors) {
      _OM.errorLogs(!showBoot);
    }
    if (showExecution) {
      _OM.executionLogs();
    }
  };

  _OM.tick = () => {
    _tickNum++;

    if (_OM.phase < 6) {
      // ensure primary setup
      if (_OM.phase === -2) {
        if (_OM.isPrimaryBoot && (!_EM.isPrimarySetupDone) && (_tickNum > 20)) {
          const criticalError = _EM.primarySetupError;
          const message = _EMprefix + "Error on primary setup - " + criticalError?.[0] + ": " + criticalError?.[1] + ".";
          const playerIds = api.getPlayerIds();
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

      // start boot
      if (_OM.phase === 0) {
        _tickNum = 0;
        
        const thisConfig = _CF.boot_manager;
        _bootDelayTicks = ((thisConfig.boot_delay_ms | 0) * 0.02) | 0;
        _bootDelayTicks = _bootDelayTicks & ~(_bootDelayTicks >> 31); // bootDelayTicks > 0 ? bootDelayTicks : 0
        _showBootLogs = !!thisConfig.show_boot_logs;
        _showErrorLogs = !!thisConfig.show_error_logs;
        _showExecutionLogs = !!thisConfig.show_execution_logs;
        
        _loadTimeTicks = -1;

        _EM.established = false;
        _TM.established = false;
        _JM.established = false;
        _BM.established = false;

        _CL.isRunning = _OM.isRunning = true;
        _OM.phase = 1;
      }

      // main boot process delay
      if (_OM.phase === 1) {
        if (_tickNum < _bootDelayTicks) {
          return;
        }
        _OM.phase = 2;
      }

      // establish managers
      if (_OM.phase === 2) {
        _EM.establish();
        _TM.establish();
        if (_EM.isEventActive.onPlayerJoin) {
          _JM.establish();
        }
        _BM.establish();
        _OM.phase = 3;
      }

      // reset/setup events
      if (_OM.phase === 3) {
        if (_OM.isPrimaryBoot) {
          _EM.primaryInstall();
        } else {
          _EM.resetHandlers();
        }
        _EM.setupFallbacks();
        _OM.phase = 4;
      }

      // install managers
      if (_OM.phase === 4) {
        if (_EM.isEventActive.onPlayerJoin) {
          _JM.install();
          _JM.bufferPlayers();
        }
        _TM.install();
        _OM.phase = 5;
      }

      // start data initializer
      if (_OM.phase === 5) {
        if (_BM.isChestData) {
          _TM.init = _BM.executeStorageData;
        } else {
          _TM.init = _BM.executeBlockData;
        }
        _OM.phase = 6;
        return;
      }
    }

    // finish data initializer
    if (_OM.phase === 6) {
      if (_BM.phase === 1) {
        _BM.finalize();
        _BM.phase = -1;
        _OM.phase = 7 + !_EM.isEventActive.onPlayerJoin;
      }
    }

    // tick join dequeue
    if (_OM.phase === 7) {
      if (_JM.dequeue()) {
        _JM.finalize();
        _OM.phase = 8;
      }
    }

    // finish boot
    if (_OM.phase === 8) {
      _TM.finalize();
      _CL.isPrimaryBoot = _OM.isPrimaryBoot = false;
      _CL.isRunning = _OM.isRunning = false;
      _OM.phase = -1;

      _loadTimeTicks = _tickNum - _bootDelayTicks + 1;
      _OM.completeLogs(_showBootLogs, _showErrorLogs, _showExecutionLogs);
    }
  };
}

// StorageManager
{
  const _SM = StorageManager;
  const _SMprefix = _PREFIX + " SM: ";

  const api_setBlock = api.setBlock;
  const api_getBlockData = api.getBlockData;
  const api_getStandardChestItems = api.getStandardChestItems;
  const api_setStandardChestItemSlot = api.setStandardChestItemSlot;

  const _taskQueue = [];
  let _taskIndex = 0;
  let _taskPhase = 1;

  const _blockType = "Bedrock";
  const _itemType = "Boat";
  const _storageItemData = { customAttributes: { _: null } };
  const _registryItemData = { customAttributes: { _: [] } };
  const _storageCoordsBuffer = _registryItemData.customAttributes._;
  const _dataChunksBuffer = [];

  let _storageX;
  let _storageY;
  let _storageZ;
  let _blockIndex;
  let _partition;
  let _storagePosition;
  let _registrySlotIndex;
  let _coordsList;
  let _coordsIndex;
  let _coordsLength;

  const _build = (blocks, registryPosition, lowX, lowY, lowZ, highX, highY, highZ, maxStorageUnitsPerTick) => {
    let x = _storageX;
    let y = _storageY;
    let z = _storageZ;
    
    if (_taskPhase === 1) {
      _storageX = x = lowX;
      _storageY = y = lowY;
      _storageZ = z = lowZ;
      _blockIndex = 0;
      _registrySlotIndex = 1;
      _coordsLength = 0;
      _taskPhase = 2;
    }
    
    let budget = maxStorageUnitsPerTick;
    const blocksCount = blocks.length;
    let rawData, rawStart, rawEnd, escapedData, escapedCursor, escapedDataEnd, escapedChunkEnd, backslashPosition, runLength;
    let block, storageSlotBaseIndex, chunkIndex, chunksLength;
    while (_blockIndex < blocksCount) {
      if (_taskPhase === 2) {
        x++;
        if (x > highX) {
          x = lowX;
          z++;
          if (z > highZ) {
            z = lowZ;
            y++;
          }
        }
        api_setBlock(x, y, z, _blockType);
        _storageX = x;
        _storageY = y;
        _storageZ = z;
        _partition = 0;
        _storagePosition = [x, y, z];
        _taskPhase = 3;
      }

      while (_partition < 4 && _blockIndex < blocksCount) {
        if (_taskPhase === 3) {
          block = blocks[_blockIndex];
          rawData = api_getBlockData(block[0], block[1], block[2])?.persisted?.shared?.text;
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
              _dataChunksBuffer[chunkIndex++] = rawData.slice(rawStart, rawEnd);
              rawStart = rawEnd;
            }
            _dataChunksBuffer.length = chunkIndex;
            _taskPhase = 4;
          }
        }
        if (_taskPhase === 4) {
          storageSlotBaseIndex = _partition * 9;
          chunkIndex = 0;
          chunksLength = _dataChunksBuffer.length;
          while (chunkIndex < chunksLength) {
            _storageItemData.customAttributes._ = _dataChunksBuffer[chunkIndex];
            api_setStandardChestItemSlot(_storagePosition, storageSlotBaseIndex + chunkIndex, _itemType, null, undefined, _storageItemData);
            chunkIndex++;
          }
          _partition++;
          _taskPhase = 3;
        }
        _blockIndex++;
      }

      if (_coordsLength >= 243) {
        api_setStandardChestItemSlot(registryPosition, _registrySlotIndex, _itemType, null, undefined, _registryItemData);
        _registrySlotIndex++;
        _storageCoordsBuffer.length = 0;
        _coordsLength = 0;
      }

      _storageCoordsBuffer[_coordsLength++] = x;
      _storageCoordsBuffer[_coordsLength++] = y;
      _storageCoordsBuffer[_coordsLength++] = z;

      _taskPhase = 2;

      budget--;
      if (budget <= 0) {
        return false;
      }
    }

    api_setStandardChestItemSlot(registryPosition, _registrySlotIndex, _itemType, null, undefined, _registryItemData);

    _storageItemData.customAttributes._ = null;
    _storageCoordsBuffer.length = 0;
    _dataChunksBuffer.length = 0;
    _storagePosition = null;

    _log(_SMprefix + "Built storage at (" + registryPosition[0] + ", " + registryPosition[1] + ", " + registryPosition[2] + ").", 2);

    _taskPhase = 1;
    return true;
  };

  const _dispose = (registryPosition, registryItems, maxStorageUnitsPerTick) => {
    if (_taskPhase === 1) {
      _registrySlotIndex = 1;
      _coordsIndex = 0;
      _taskPhase = 2;
    }
    
    let budget = maxStorageUnitsPerTick;
    let registryItem;
    while (registryItem = registryItems[_registrySlotIndex]) {
      if (_taskPhase === 2) {
        _coordsList = registryItem.attributes.customAttributes._;
        _coordsIndex = 0;
        _coordsLength = _coordsList.length;
        _taskPhase = 3;
      }

      if (_taskPhase === 3) {
        while (_coordsIndex < _coordsLength) {
          api_setBlock(_coordsList[_coordsIndex], _coordsList[_coordsIndex + 1], _coordsList[_coordsIndex + 2], "Air");
          _coordsIndex += 3;
          budget--;
          if (budget <= 0) {
            return false;
          }
        }
        api_setStandardChestItemSlot(registryPosition, _registrySlotIndex, "Air");
        _registrySlotIndex++;
        _taskPhase = 2;
      }
    }

    _log(_SMprefix + "Disposed storage at (" + registryPosition[0] + ", " + registryPosition[1] + ", " + registryPosition[2] + ").", 2);

    _taskPhase = 1;
    return true;
  };

  _SM.create = (lowPosition, highPosition) => {
    const lowX = lowPosition[0];
    const lowY = lowPosition[1];
    const lowZ = lowPosition[2];
    const highX = highPosition[0];
    const highY = highPosition[1];
    const highZ = highPosition[2];
    if (lowX > highX || lowY > highY || lowZ > highZ) {
      _log(_SMprefix + "Invalid region bounds. lowPos must be <= highPos on all axes.", 1);
      return;
    }
    api_setBlock(lowX, lowY, lowZ, _blockType);
    api_setStandardChestItemSlot(lowPosition, 0, _itemType, null, undefined, {
      customAttributes: {
        region: [lowX, lowY, lowZ, highX, highY, highZ]
      }
    });
    _log(_SMprefix + "Registry unit created at (" + lowX + ", " + lowY + ", " + lowZ + ").", 2);
  };

  _SM.check = (registryPosition) => {
    const registryItems = api_getStandardChestItems(registryPosition);
    const region = registryItems[0]?.attributes?.customAttributes?.region;
    if (!region) {
      _log(_SMprefix + "No valid registry unit found.", 1);
    } else {
      _log(_SMprefix + "Storage covers region from (" + region[0] + ", " + region[1] + ", " + region[2] + ") to (" + region[3] + ", " + region[4] + ", " + region[5] + ").", 3);
    }
  };

  _SM.build = (registryPosition, blocks, maxStorageUnitsPerTick = 16) => {
    const registryItems = api_getStandardChestItems(registryPosition);
    const region = registryItems[0]?.attributes?.customAttributes?.region;
    if (!region) {
      _log(_SMprefix + "No valid registry unit found.", 1);
      return;
    }

    const lowX = region[0];
    const lowY = region[1];
    const lowZ = region[2];
    const highX = region[3];
    const highY = region[4];
    const highZ = region[5];

    const capacity = (highX - lowX + 1) * (highY - lowY + 1) * (highZ - lowZ + 1);
    const required = (blocks.length + 7) >> 2;
    if (capacity < required) {
      _log(_SMprefix + "Not enough space. Need " + required + " storage units, but region holds " + capacity + ".", 0);
    } else {
      _taskQueue[_taskQueue.length] = () => _build(blocks, registryPosition, lowX, lowY, lowZ, highX, highY, highZ, maxStorageUnitsPerTick);
    }
  };

  _SM.dispose = (registryPosition, maxStorageUnitsPerTick = 32) => {
    const registryItems = api_getStandardChestItems(registryPosition);
    if (!registryItems[0]?.attributes?.customAttributes?.region) {
      _log(_SMprefix + "No valid registry unit found.", 1);
    } else {
      _taskQueue[_taskQueue.length] = () => _dispose(registryPosition, registryItems, maxStorageUnitsPerTick);
    }
  };

  _SM.tick = () => {
    const tasksCount = _taskQueue.length;
    if (tasksCount) {
      let isActive = _taskIndex < tasksCount;
      while (isActive) {
        try {
          if (!_taskQueue[_taskIndex]()) {
            break;
          }
        } catch (error) {
          _log(_SMprefix + "Task error on tick - " + error.name + ": " + error.message, 0);
        }
        isActive = ++_taskIndex < tasksCount;
      }
      if (!isActive) {
        _taskIndex = 0;
        _taskQueue.length = 0;
      }
    }
  };
}

// CodeLoader
{
  const _EM = EventManager;
  const _OM = BootManager;
  const _CL = CodeLoader;
  const _OMprefix = _PREFIX + " OM: ";

  _CL.SM = StorageManager;
  
  _CL.config = configuration;

  _CL.reboot = () => {
    if (!_OM.isRunning) {
      _EM.delegator.tick = _OM.tick;
      _OM.phase = 0;
    } else {
      _log(_OMprefix + "Reboot request was denied.", 1);
    }
  };

  _CL.bootLogs = (showErrors = true) => {
    _OM.bootLogs(showErrors);
  };

  _CL.errorLogs = (showSuccess = true) => {
    _OM.errorLogs(showSuccess);
  };

  _CL.executionLogs = () => {
    _OM.executionLogs();
  };

  _CL.completeLogs = (showBoot = true, showErrors = true, showExecution = false) => {
    _OM.completeLogs(showBoot, showErrors, showExecution);
  };
};

// Primary Setup
try {
  const _SM = StorageManager;
  const _delegator = EventManager.delegator;
  _delegator.tick = BootManager.tick;
  globalThis.tick = function () {
    _delegator.tick(50);
    _SM.tick();
  };

  EventManager.primarySetup();

  const configStyles = configuration.STYLES;
  const logStyles = _log.STYLES = [];
  for (let type = 0; type < 4; type++) {
    logStyles[type] = [{
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

  EventManager.isPrimarySetupDone = true;
  BootManager.phase = 0;
} catch (error) {
  EventManager.primarySetupError = [error.name, error.message];
}

globalThis.IF = InterruptionFramework;
globalThis.CL = CodeLoader;

void 0;

