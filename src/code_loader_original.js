// Copyright (c) 2025 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const Configuration = {
  // [[eventName, fallbackValue?], ...]
  // [[string, boolean|string|number|object|null|"undefined"], ...]
  ACTIVE_EVENTS: [
    // ...
  ],

  // [[x, y, z, lockedStatus?, executionStatus?], ...]
  // [[number, number, number, boolean|null, boolean|null], ...]
  BLOCKS: [
    // ...
  ],

  boot_manager: {
    boot_delay_ms: 100,
    show_load_time: true,
    show_executed_blocks: false,
    show_errors: true,
  },
  block_manager: {
    default_locked_status: true,
    default_execution_status: true,
    max_registrations_per_tick: 32,
    max_chunk_requests_per_tick: 8,
    max_executions_per_tick: 16,
    max_errors_count: 32,
  },
  join_manager: {
    reset_on_reboot: true,
    max_dequeue_per_tick: 16,
  },
  event_manager: {
    is_interruption_framework_enabled: false,
    default_retry_delay_ticks: 0,
    default_retry_limit_ticks: 2,
  },

  // eventName -> [fallbackValue?, interruptionStatus?, delayTicks?, limitTicks?]
  // string -> [boolean|string|number|object|null|undefined, boolean|null, number|null, number|null]
  EVENT_REGISTRY: {
    "tick": null, // special event
    "onClose": [false],
    "onPlayerJoin": [false],
    "onPlayerLeave": [false],
    "onPlayerJump": [false],
    "onRespawnRequest": [[0, -200000, 0]],
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

  LOG_STYLE: {
    error: { color: "#ff9d87", fontWeight: "600", fontSize: "1rem" },
    warning: { color: "#fcd373", fontWeight: "600", fontSize: "1rem" },
    success: { color: "#2eeb82", fontWeight: "600", fontSize: "1rem" },
  },
};

const InterruptionFramework = {
  state: 0,
  handler: () => { },
  args: [],
  delay: 0,
  limit: 1,

  phase: 400000,
  cache: null,

  defaultPhase: 400000,
  wasInterrupted: false,

  tick: null,
};
const EventManager = {
  primarySetupError: null, // [error.name, error.message]
  isPrimarySetupDone: false,

  delegator: {}, // eventName -> handler
  isEventActive: {}, // eventName -> true
  unregisteredActiveEvents: [], // [eventName, ...]

  invalidActiveEvents: [], // [eventName, ...]
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
  init: null,

  phase: 4,
  blocks: null, // [[x, y, z, executionStatus, blockName], ...]
  errors: null, // [[x, y, z, error.name, error.message], ...]
  established: false,

  establish: null,
  finalize: null,
  isBlockLocked: null,
};
const BootManager = {
  phase: -2,
  isPrimaryBoot: true,
  isRunning: false,

  logStyle: null,
  logBootResult: null,
  logLoadTime: null,
  logExecutedBlocks: null,
  logErrors: null,

  tick: null,
};
const CodeLoader = {
  configuration: null,
  isPrimaryBoot: true,
  isRunning: false,

  isBlockLocked: null,
  logBootResult: null,
  logLoadTime: null,
  logExecutedBlocks: null,
  logErrors: null,
};
const NOOP = function () { };

// Interruption Framework
{
  const _IF = InterruptionFramework;

  const _interrupted = {};
  let _enqueueId = 0;
  let _dequeueId = 1;
  let _queueSize = 0;
  let _element = [];
  let _external = 1;
  let _tickNum = 0;

  Object.defineProperty(globalThis.InternalError.prototype, "name", {
    configurable: true,
    get: () => {
      if (_external) {
        if (_IF.state) {
          _interrupted[++_enqueueId] = [_IF.phase, _IF.cache, _IF.handler, _IF.args, _IF.delay + _tickNum, _IF.limit];
          _queueSize++;
        }
      } else {
        _element[0] = _IF.phase;
        _IF.wasInterrupted = false;
        _external = 1;
      }
      _IF.cache = null;
      _IF.state = 0;
      return "InternalError";
    },
  });

  _IF.tick = () => {
    _IF.state = 0;
    if (!_queueSize) {
      _IF.cache = null;
      _tickNum++;
      return;
    }

    _external = 0;
    _IF.wasInterrupted = true;

    let element;
    const maxDequeueId = _enqueueId;
    while (_dequeueId <= maxDequeueId) {
      element = _element = _interrupted[_dequeueId];
      if (element[4] <= _tickNum) {
        if (element[5] > 0) {
          element[5]--;
          _IF.phase = element[0];
          _IF.cache = element[1];
          element[2](...element[3]);
        }
        delete _interrupted[_dequeueId++];
        _queueSize--;
      } else {
        delete _interrupted[_dequeueId++];
        _interrupted[++_enqueueId] = element;
      }
    }

    _IF.state = 0;
    _IF.cache = null;
    _IF.wasInterrupted = false;
    _external = 1;
    _tickNum++;
  };
}

// EventManager
{
  const _EM = EventManager;

  const _NOOP = NOOP;

  let _primaryInstallCursor = 0;
  let _primaryActiveEvents = []; // [eventName, ...]

  let _activeEvents = null;
  let _eventRegistry = null;
  let _resetCursor = 0;
  let _setupCursor = 0;

  _EM.primarySetup = () => {
    if (_EM.isPrimarySetupDone) {
      return;
    }

    _eventRegistry = Configuration.EVENT_REGISTRY;
    _activeEvents = Configuration.ACTIVE_EVENTS;
    const thisConfig = Configuration.event_manager;
    const isInterruptionFrameworkEnabled = !!thisConfig.is_interruption_framework_enabled;
    let defaultRetryDelay = thisConfig.default_retry_delay_ticks | 0;
    defaultRetryDelay = defaultRetryDelay & ~(defaultRetryDelay >> 31); // defaultRetryDelay > 0 ? defaultRetryDelay : 0
    let defaultRetryLimit = thisConfig.default_retry_limit_ticks | 0;
    defaultRetryLimit = (defaultRetryLimit & ~(defaultRetryLimit >> 31)) + (-defaultRetryLimit >> 31) + 1; // defaultRetryLimit > 0 ? defaultRetryLimit : 1

    const delegator = _EM.delegator;
    const isEventActive = _EM.isEventActive;
    const unregisteredActiveEvents = _EM.unregisteredActiveEvents;

    const activeEventsNum = _activeEvents.length;
    let index = 0;
    while (index < activeEventsNum) {
      const listEntry = _activeEvents[index];
      let eventName = listEntry;
      if (listEntry instanceof Array) {
        eventName = listEntry[0];
      }
      let registryEntry = _eventRegistry[eventName];
      if (registryEntry === undefined) {
        unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
        index++;
        continue;
      }
      if (eventName === "tick") {
        index++;
        continue;
      }
      _primaryActiveEvents[_primaryActiveEvents.length] = eventName;
      isEventActive[eventName] = true;
      if (!(registryEntry instanceof Array)) {
        registryEntry = _eventRegistry[eventName] = [false];
      }
      const interruptionStatus = !!registryEntry[1];
      if (isInterruptionFrameworkEnabled & interruptionStatus) {
        let delay = registryEntry[2];
        if (delay == null) {
          delay = defaultRetryDelay;
        }
        delay |= 0;

        let limit = registryEntry[3];
        if (limit == null) {
          limit = defaultRetryLimit;
        }
        limit |= 0;

        const _IF = InterruptionFramework;
        delegator[eventName] = _NOOP;
        globalThis[eventName] = function handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          _IF.state = 1;
          _IF.handler = handler;
          _IF.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
          _IF.delay = delay;
          _IF.limit = limit;
          _IF.phase = 400000; // _IF.defaultPhase;
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
      index++;
    }
    isEventActive.tick = true;
  };

  _EM.primaryInstall = () => {
    const delegator = _EM.delegator;
    const activeEventsNum = _primaryActiveEvents.length;
    while (_primaryInstallCursor < activeEventsNum) {
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
    });
  };

  _EM.establish = () => {
    if (_EM.established) {
      return;
    }
    _activeEvents = Configuration.ACTIVE_EVENTS;
    _EM.invalidActiveEvents = [];
    _resetCursor = 0;
    _setupCursor = 0;
    _EM.established = true;
  };

  _EM.resetHandlers = () => {
    const delegator = _EM.delegator;
    const activeEventsNum = _primaryActiveEvents.length;
    while (_resetCursor < activeEventsNum) {
      delegator[_primaryActiveEvents[_resetCursor]] = _NOOP;
      _resetCursor++;
    }
  };

  _EM.setupFallbacks = () => {
    const isEventActive = _EM.isEventActive;
    const activeEventsNum = _activeEvents.length;
    while (_setupCursor < activeEventsNum) {
      const listEntry = _activeEvents[_setupCursor];
      let eventName = listEntry;
      if (listEntry instanceof Array) {
        eventName = listEntry[0];
      }
      if (eventName === "tick") {
        _setupCursor++;
        continue;
      }
      if (isEventActive[eventName]) {
        let fallbackValue;
        if (listEntry instanceof Array) {
          fallbackValue = listEntry[1];
        }
        if (fallbackValue === undefined) {
          fallbackValue = _eventRegistry[eventName][0];
        } else if (fallbackValue === "undefined") {
          fallbackValue = undefined;
        }
        api.setCallbackValueFallback(eventName, fallbackValue);
      } else {
        _EM.invalidActiveEvents[_EM.invalidActiveEvents.length] = eventName;
      }
      _setupCursor++;
    }
  };
}

// TickMultiplexer
{
  const _TM = TickMultiplexer;
  const _IF = InterruptionFramework;
  const _EM = EventManager;

  const _NOOP = NOOP;

  let _boot = null;
  let _main = null;

  let _installed = false;
  let _finalized = false;

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

  const dispatch = () => {
    _IF.tick();
    _boot();
    _TM.init();
    _main();
  };

  _TM.install = () => {
    if (_installed) {
      return;
    }
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          _main = fn;
        } else {
          _main = _NOOP;
        }
      },
    });
    _boot = _EM.delegator.tick;
    _EM.delegator.tick = dispatch;
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
    });
    delegator.tick = _main;
    _boot = _NOOP;
    _TM.init = _NOOP;
    _finalized = true;
  };
}

// JoinManager
{
  const _JM = JoinManager;
  const _IF = InterruptionFramework;
  const _EM = EventManager;
  const _OM = BootManager;

  const _NOOP = NOOP;

  let _resetOnReboot = true;
  let _maxDequeue = 1;

  let _main = null;
  let _buffer = null; // [[playerId, fromGameReset], ...]
  let _joinState = null; // playerId -> 0/1/2
  let _dequeueCursor = 0;

  let _installed = false;
  let _finalized = false;

  _JM.establish = () => {
    if (_JM.established) {
      return;
    }
    const thisConfig = Configuration.join_manager;
    _resetOnReboot = !!thisConfig.reset_on_reboot;
    _maxDequeue = thisConfig.max_dequeue_per_tick | 0;
    _maxDequeue = (_maxDequeue & ~(_maxDequeue >> 31)) + (-_maxDequeue >> 31) + 1; // _maxDequeue > 0 ? _maxDequeue : 1

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

  const dispatch = (playerId, fromGameReset) => {
    _buffer[_buffer.length] = [playerId, fromGameReset];
    _joinState[playerId] = 1;
  };

  _JM.install = () => {
    if (_installed) {
      return;
    }
    _EM.delegator.onPlayerJoin = dispatch;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => {
        if (fn instanceof Function) {
          _main = fn;
        } else {
          _main = _NOOP;
        }
      },
    });
    _installed = true;
  };

  _JM.bufferPlayers = () => {
    if (_resetOnReboot | _OM.isPrimaryBoot) {
      const playerIds = api.getPlayerIds();
      const playersNum = playerIds.length;
      let index = 0;
      while (index < playersNum) {
        const playerId = playerIds[index];
        if (!_joinState[playerId]) {
          _buffer[_buffer.length] = [playerId, false];
          _joinState[playerId] = 1;
        }
        index++;
      }
    }
  };

  _JM.dequeue = () => {
    let budget = _maxDequeue;
    while ((_dequeueCursor < _buffer.length) & (budget > 0)) {
      const args = _buffer[_dequeueCursor];
      const playerId = args[0];
      if (_joinState[playerId] !== 2) {
        _dequeueCursor++;
        _joinState[playerId] = 2;

        _IF.state = 1;
        _IF.handler = _main;
        _IF.args = args;
        _IF.delay = 0;
        _IF.limit = 1;
        _IF.phase = 400000; // _IF.defaultPhase
        try {
          _main(playerId, args[1]);
        } catch (error) {
          _IF.state = 0;
          api.broadcastMessage("Code Loader: JoinManager: " + error.name + ": " + error.message, { color: "#ff9d87" });
        }
        _IF.state = 0;

        budget--;
        _dequeueCursor--;
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
      }
    });
    delegator.onPlayerJoin = _main;
    _buffer = null;
    _finalized = true;
  };
}

// BlockManager
{
  const _BM = BlockManager;
  const _OM = BootManager;

  let _defaultLockedStatus = true;
  let _defaultExecutionStatus = true;
  let _maxRegistrations = 1;
  let _maxRequests = 1;
  let _maxExecutions = 1;
  let _maxErrors = 0;

  let _blockLockedStatus = null; // blockId -> false/true
  let _isChunkLoaded = null; // chunkId -> false/true
  let _hasAnyBlocksToEval = 0; // false
  let _registerCursor = 0;
  let _errorCursor = 0;
  let _executionCursor = 0;
  let _finalized = false;

  _BM.establish = () => {
    if (_BM.established) {
      return;
    }
    _BM.blocks = (Configuration.BLOCKS instanceof Array) ? Configuration.BLOCKS.slice() : [];
    const thisConfig = Configuration.block_manager;
    _defaultLockedStatus = !!thisConfig.default_locked_status;
    _defaultExecutionStatus = !!thisConfig.default_execution_status;
    _maxRegistrations = thisConfig.max_registrations_per_tick | 0;
    _maxRegistrations = (_maxRegistrations & ~(_maxRegistrations >> 31)) + (-_maxRegistrations >> 31) + 1; // maxRegistrations > 0 ? maxRegistrations : 1
    _maxRequests = thisConfig.max_chunk_requests_per_tick | 0;
    _maxRequests = (_maxRequests & ~(_maxRequests >> 31)) + (-_maxRequests >> 31) + 1; // maxRequests > 0 ? maxRequests : 1
    _maxExecutions = thisConfig.max_executions_per_tick | 0;
    _maxExecutions = (_maxExecutions & ~(_maxExecutions >> 31)) + (-_maxExecutions >> 31) + 1; // maxEvals > 0 ? maxEvals : 1
    _maxErrors = thisConfig.max_errors_count | 0;
    _maxErrors = _maxErrors & ~(_maxErrors >> 31); // maxErrors > 0 ? maxErrors : 0

    _BM.phase = 0; // or 1
    _blockLockedStatus = {};
    _isChunkLoaded = {};
    _BM.errors = [null];
    _hasAnyBlocksToEval = 0;
    _registerCursor = 0;
    _executionCursor = 0;
    _errorCursor = 0;
    _finalized = false;

    _BM.established = true;
  };

  const register = () => {
    const blocks = _BM.blocks;
    const blocksNum = blocks.length;
    let requestBudget = _maxRequests;
    let registerBudget = _maxRegistrations;
    while ((_registerCursor < blocksNum) & (registerBudget > 0) & (requestBudget > 0)) {
      const block = blocks[_registerCursor].slice();
      let x = block[0];
      x = (x | 0) - (x < (x | 0)); // Math.floor(x)
      let y = block[1];
      y = (y | 0) - (y < (y | 0)); // Math.floor(y)
      let z = block[2];
      z = (z | 0) - (z < (z | 0)); // Math.floor(z)

      const blockPositionId = (x + "|" + y + "|" + z);
      const lockedStatus = block[3];
      if (lockedStatus == null) {
        _blockLockedStatus[blockPositionId] = _defaultLockedStatus;
      } else {
        _blockLockedStatus[blockPositionId] = !!lockedStatus;
      }

      let evalStatus = block[4];
      if (evalStatus == null) {
        evalStatus = block[3] = _defaultExecutionStatus;
      } else {
        evalStatus = block[3] = !!evalStatus;
      }

      if (evalStatus) {
        const chunkId = ((x >> 5) + "|" + (y >> 5) + "|" + (z >> 5));
        if (_isChunkLoaded[chunkId] === undefined) {
          const blockName = block[4] = api.getBlock(x, y, z);
          if (blockName === "Unloaded") {
            _isChunkLoaded[chunkId] = false;
            requestBudget--;
          } else {
            _isChunkLoaded[chunkId] = true;
          }
        } else {
          block[4] = "Unloaded";
        }
        _hasAnyBlocksToEval = 1;
      } else {
        block[4] = null;
      }

      blocks[_registerCursor] = block;

      registerBudget--;
      _registerCursor++;
    }

    _BM.phase = ((_registerCursor >= blocksNum) << 1) | (_hasAnyBlocksToEval ^ 1);  // (_registerCursor >= blocksNum) ? (_hasAnyBlocksToEval ? 2 : 3) : (_hasAnyBlocksToEval ? 0 : 1);
  };

  const execute = () => {
    const blocks = _BM.blocks;
    const errors = _BM.errors;
    const blocksNum = blocks.length;
    let executionBudget = _maxExecutions;
    while ((_executionCursor < blocksNum) & (executionBudget > 0)) {
      const block = blocks[_executionCursor];
      if (!block[3]) {
        _executionCursor++;
        continue;
      }

      const x = block[0];
      const y = block[1];
      const z = block[2];

      if (block[4] === "Unloaded") {
        const blockName = api.getBlock(x, y, z);
        if (blockName === "Unloaded") {
          break;
        }
        block[4] = blockName;
      }

      try {
        const code = api.getBlockData(x, y, z)?.persisted?.shared?.text;
        (0, eval)(code);
      } catch (error) {
        _errorCursor++;
        errors[_errorCursor * +((errors.length - 1) < _maxErrors)] = [x, y, z, error.name, error.message];
      }

      executionBudget--;
      _executionCursor++;
    }

    _BM.phase = 2 | (_executionCursor >= blocksNum);
  };

  _BM.init = () => {
    if (_BM.phase < 2) { return register(); };
    if (_BM.phase === 2) { execute(); };
  };

  _BM.finalize = () => {
    if (_finalized) {
      return;
    }
    _BM.errors[0] = null;
    _isChunkLoaded = null;
    _finalized = true;
  };

  _BM.isBlockLocked = (position) => {
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const blockPositionId =
      ((x | 0) - (x < (x | 0))) + "|" + // Math.floor(x)
      ((y | 0) - (y < (y | 0))) + "|" + // Math.floor(y)
      ((z | 0) - (z < (z | 0)));        // Math.floor(z)
    if (_blockLockedStatus[blockPositionId] !== false) {
      return !_OM.isRunning;
    }
    return false;
  };
}

// BootManager
{
  const _OM = BootManager;
  const _EM = EventManager;
  const _TM = TickMultiplexer;
  const _JM = JoinManager;
  const _BM = BlockManager;
  const _CL = CodeLoader;

  let _bootDelayTicks = 0;
  let _showLoadTime = true;
  let _showErrors = true;
  let _showExecutedBlocks = false;

  let _tickNum = -1;
  let _loadTimeTicks = -1;

  _OM.logLoadTime = (showErrors) => {
    const errorsNum = _BM.errors.length - 1;
    let logs = "Code Loader: BootManager: Code was loaded in " + (_loadTimeTicks * 50) + " ms";
    if (errorsNum === 0) {
      logs += showErrors ? (" with 0 errors.") : (".");
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle.success ?? {},
      }]);
    } else {
      logs += showErrors ? (" with " + errorsNum + " error" + ((errorsNum === 1) ? "" : "s") + ".") : (".");
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle.warning ?? {},
      }]);
    }
  };

  _OM.logExecutedBlocks = () => {
    const blocks = _BM.blocks;
    const blocksNum = blocks.length;
    let logs = "";
    let count = 0;
    let index = 0;
    while (index < blocksNum) {
      const block = blocks[index];
      if (block[3]) {
        logs += "\n\"" + block[4] + "\" at (" + block[0] + ", " + block[1] + ", " + block[2] + ")";
        count++;
      }
      index++;
    }
    logs = "Code Loader: BlockManager: Executed " + count + " block" + ((count === 1) ? "" : "s") + ":" + logs;
    api.broadcastMessage([{
      str: logs,
      style: ((_BM.errors.length - 1) ? _OM.logStyle.warning : _OM.logStyle.success) ?? {},
    }]);
  };

  _OM.logErrors = () => {
    const errors = _BM.errors;
    const errorsNum = errors.length - 1;
    if (errorsNum > 0) {
      let logs = "Code Loader: BlockManager: Code execution error" + ((errorsNum === 1) ? "" : "s") + ":";
      let index = 1;
      while (index <= errorsNum) {
        const error = errors[index];
        logs += "\n" + error[3] + " at (" + error[0] + ", " + error[1] + ", " + error[2] + "): " + error[4];
        index++;
      }
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle.error ?? {},
      }]);
    }
  };

  _OM.logBootResult = (showLoadTime, showErrors, showExecutedBlocks) => {
    if (_EM.unregisteredActiveEvents.length) {
      api.broadcastMessage([{
        str: "Code Loader: EventManager: Unregistered active events: \"" + _EM.unregisteredActiveEvents.join("\", \"") + "\".",
        style: _OM.logStyle.warning ?? {},
      }]);
    }
    if (_EM.invalidActiveEvents.length) {
      api.broadcastMessage([{
        str: "Code Loader: EventManager: Invalid active events: \"" + _EM.invalidActiveEvents.join("\", \"") + "\".",
        style: _OM.logStyle.warning ?? {},
      }]);
    }
    if (showLoadTime) {
      _OM.logLoadTime(showErrors);
    }
    if (showExecutedBlocks) {
      _OM.logExecutedBlocks();
    }
    if (showErrors) {
      _OM.logErrors();
    }
  };

  _OM.tick = () => {
    _tickNum++;

    if (_OM.phase < 6) {
      // ensure primary setup
      if (_OM.phase === -2) {
        if (_OM.isPrimaryBoot & (!_EM.isPrimarySetupDone) & (_tickNum > 20)) {
          const criticalError = _EM.primarySetupError;
          const logs = `Code Loader: EventManager: ${(criticalError === null) ? "Undefined e" : "E"}rror on events primary setup${(criticalError === null) ? "." : ` - ${criticalError[0]}: ${criticalError[1]}.`}`;
          const playerIds = api.getPlayerIds();
          for (const playerId of playerIds) {
            if (api.checkValid(playerId)) {
              api.kickPlayer(playerId, logs);
            }
          }
        }
        return;
      }

      // start boot
      if (_OM.phase === 0) {
        _tickNum = 0;

        const thisConfig = Configuration.boot_manager;
        _bootDelayTicks = ((thisConfig.boot_delay_ms | 0) * 0.02) | 0;
        _bootDelayTicks = _bootDelayTicks & ~(_bootDelayTicks >> 31); // bootDelayTicks > 0 ? bootDelayTicks : 0
        _showLoadTime = !!thisConfig.show_load_time;
        _showErrors = !!thisConfig.show_errors;
        _showExecutedBlocks = !!thisConfig.show_executed_blocks;
        _OM.logStyle = {
          error: Object.assign({}, Configuration.LOG_STYLE.error),
          warning: Object.assign({}, Configuration.LOG_STYLE.warning),
          success: Object.assign({}, Configuration.LOG_STYLE.success),
        };

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
          _JM.bufferPlayers();
          _JM.install();
        }
        _TM.install();
        _OM.phase = 5;
      }

      // start block initializer
      if (_OM.phase === 5) {
        _TM.init = _BM.init;
        _OM.phase = 6;
        return;
      }
    }

    // finish block initializer
    if (_OM.phase === 6) {
      if (_BM.phase === 3) {
        _BM.finalize();
        _OM.phase = 6 + 1 + !_EM.isEventActive.onPlayerJoin;
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
      _BM.phase = 4;
      _CL.isPrimaryBoot = _OM.isPrimaryBoot = false;
      _CL.isRunning = _OM.isRunning = false;
      _OM.phase = -1;

      _loadTimeTicks = _tickNum - _bootDelayTicks + 1;
      _OM.logBootResult(_showLoadTime, _showErrors, _showExecutedBlocks);
    }
  };
}

// CodeLoader
{
  const _CL = CodeLoader;
  const _EM = EventManager;
  const _BM = BlockManager;
  const _OM = BootManager;

  _CL.configuration = Configuration;

  _CL.isBlockLocked = (position) => {
    return ((position instanceof Array) && (position.length === 3) && _BM.isBlockLocked(position));
  };

  _CL.reboot = () => {
    if (!_OM.isRunning) {
      _EM.delegator.tick = _OM.tick;
      _OM.phase = 0;
    } else {
      api.broadcastMessage([{
        str: "Code Loader: BootManager: Wait until current running boot session is finished.",
        style: _OM.logStyle.warning ?? {},
      }]);
    }
  };

  _CL.logBootResult = (showLoadTime = true, showErrors = true, showExecutedBlocks = false) => {
    _OM.logBootResult(showLoadTime, showErrors, showExecutedBlocks);
  };

  _CL.logLoadTime = (showErrors = true) => {
    _OM.logLoadTime(showErrors);
  };

  _CL.logErrors = () => {
    _OM.logErrors();
  };

  _CL.logExecutedBlocks = () => {
    _OM.logExecutedBlocks();
  };
};

// Tick Event Setup
{
  const delegator = EventManager.delegator;
  delegator.tick = BootManager.tick;
  globalThis.tick = function () {
    delegator.tick();
  };
}

// Primary Setup
try {
  EventManager.primarySetup();

  const toSeal = [
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
    CodeLoader,
  ];

  const toSealNum = toSeal.length;
  let index = 0;
  while (index < toSealNum) {
    Object.seal(toSeal[index]);
    index++;
  }

  Object.freeze(Configuration.EVENT_REGISTRY);

  EventManager.isPrimarySetupDone = true;
  BootManager.phase = 0;
} catch (error) {
  EventManager.primarySetupError = [error.name, error.message];
}

globalThis.IF = InterruptionFramework;
globalThis.CL = CodeLoader;

void 0;

