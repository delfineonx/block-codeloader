// Copyright (c) 2025 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const Configuration = {
  // [eventName, ...]
  // [string, ...]
  ACTIVE_EVENTS: [
    // ...
  ],

  // [[x, y, z, lockedStatus?, evalStatus?], ...]
  // [[number, number, number, boolean|null, boolean|null], ...]
  blocks: [
    // ...
  ],

  boot_manager: {
    boot_delay_ms: 100,
    show_load_time: true,
    show_errors: true,
  },
  block_manager: {
    default_locked_status: true,
    default_eval_status: true,
    max_registrations_per_tick: 32,
    max_requests_per_tick: 8,
    max_evals_per_tick: 16,
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

  // if event has special return value, then `interruptionStatus = false` setup is recommended
  // eventName -> [interruptionStatus?, delayTicks?, limitTicks?]
  // string -> [boolean|null, number|null, number|null]
  EVENT_REGISTRY: {
    "tick": null, // special event
    "onClose": [true],
    "onPlayerJoin": [true],
    "onPlayerLeave": [true],
    "onPlayerJump": [true],
    "onRespawnRequest": [false],
    "playerCommand": [false],
    "onPlayerChat": [false],
    "onPlayerChangeBlock": [false],
    "onPlayerDropItem": [false],
    "onPlayerPickedUpItem": [true],
    "onPlayerSelectInventorySlot": [true],
    "onBlockStand": [true],
    "onPlayerAttemptCraft": [false],
    "onPlayerCraft": [true],
    "onPlayerAttemptOpenChest": [false],
    "onPlayerOpenedChest": [true],
    "onPlayerMoveItemOutOfInventory": [false],
    "onPlayerMoveInvenItem": [false],
    "onPlayerMoveItemIntoIdxs": [false],
    "onPlayerSwapInvenSlots": [false],
    "onPlayerMoveInvenItemWithAmt": [false],
    "onPlayerAttemptAltAction": [false],
    "onPlayerAltAction": [true],
    "onPlayerClick": [true],
    "onClientOptionUpdated": [true],
    "onMobSettingUpdated": [true],
    "onInventoryUpdated": [true],
    "onChestUpdated": [true],
    "onWorldChangeBlock": [false],
    "onCreateBloxdMeshEntity": [true],
    "onEntityCollision": [true],
    "onPlayerAttemptSpawnMob": [false],
    "onWorldAttemptSpawnMob": [false],
    "onPlayerSpawnMob": [true],
    "onWorldSpawnMob": [true],
    "onWorldAttemptDespawnMob": [false],
    "onMobDespawned": [true],
    "onPlayerAttack": [true],
    "onPlayerDamagingOtherPlayer": [false],
    "onPlayerDamagingMob": [false],
    "onMobDamagingPlayer": [false],
    "onMobDamagingOtherMob": [false],
    "onAttemptKillPlayer": [false],
    "onPlayerKilledOtherPlayer": [false],
    "onMobKilledPlayer": [false],
    "onPlayerKilledMob": [false],
    "onMobKilledOtherMob": [false],
    "onPlayerPotionEffect": [true],
    "onPlayerDamagingMeshEntity": [true],
    "onPlayerBreakMeshEntity": [true],
    "onPlayerUsedThrowable": [true],
    "onPlayerThrowableHitTerrain": [true],
    "onTouchscreenActionButton": [true],
    "onTaskClaimed": [true],
    "onChunkLoaded": [true],
    "onPlayerRequestChunk": [true],
    "onItemDropCreated": [true],
    "onPlayerStartChargingItem": [true],
    "onPlayerFinishChargingItem": [true],
    "doPeriodicSave": [true],
  },

  LOG_STYLE: {
    error: { color:"#ff9d87", fontWeight:"600", fontSize:"1rem" },
    warning: { color: "#fcd373", fontWeight:"600", fontSize:"1rem" },
    success: { color: "#2eeb82", fontWeight:"600", fontSize:"1rem" },
  },
};

const InterruptionFramework = {
  state: 0,
  handler: () => {},
  args: [],
  delay: 0,
  limit: 2,

  tick: null,
};
const EventManager = {
  isInterruptionFrameworkEnabled: false,
  primarySetupError: null, // [error.name, error.message]
  isPrimarySetupDone: false,

  NOOP: {},
  delegator: {}, // eventName -> handler
  activeEventType: {}, // eventName -> 1/2 (can be used to check whether event is active)
  unregisteredActiveEvents: [], // [eventName, ...]

  established: false,

  primarySetup: null,
  primaryInstall: null,
  establish: null,
  resetHandlers: null,
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
  refillBuffer: null,
  install: null,
  dequeue: null,
  finalize: null,
};
const BlockManager = {
  main: null,

  phase: 4,
  errors: null,
  established: false,

  establish: null,
  isBlockLocked: null,
};
const BootManager = {
  phase: -2,
  isPrimaryBoot: true,
  isRunning: false,

  logStyle: null,
  logBootResult: null,
  logLoadTime: null,
  logErrors: null,

  tick: null,
};
const CodeLoader = {
  configuration: null,
  isRunning: false,

  state: null,
  isBlockLocked: null,
  logBootResult: null,
  logLoadTime: null,
  logErrors: null,
};

// Interruption Framework
{
  const _IF = InterruptionFramework;

  const _interrupted = {};
  let _queueId = 0;
  let _external = 1;
  let _tickNum = 0;

  Object.defineProperty(globalThis.InternalError.prototype, "name", {
    configurable: true,
    get: () => {
      if (_IF.state & _external) {
          _interrupted[++_queueId] = [_IF.handler, _IF.args, _IF.delay + _tickNum - 1, _IF.limit];
      }
      _external = 1;
      _IF.state = 0;
      return "InternalError";
    },
  });

  _IF.tick = () => {
    for (const id in _interrupted) {
      const cache = _interrupted[id];
      if (cache[2] < _tickNum) {
        if (cache[3] > 0) {
          _external = 0;
          cache[3]--;
          cache[0](...cache[1]);
        }
        delete _interrupted[id];
      }
    }
    _external = 1;
    _tickNum++;
  };
}

// EventManager
{
  const _EM = EventManager;

  const _NOOP = function () {};

  let _activeEvents = []; // [eventName, ...]

  let _primaryInstallCursor = 0;
  let _isPrimaryInstallDone = false;

  let _resetCursor = 0;

  _EM.primarySetup = () => {
    if (_EM.isPrimarySetupDone) {
      return;
    }

    const EVENT_REGISTRY = Configuration.EVENT_REGISTRY;
    const ACTIVE_EVENTS = Configuration.ACTIVE_EVENTS;
    const thisConfig = Configuration.event_manager;
    const isInterruptionFrameworkEnabled = _EM.isInterruptionFrameworkEnabled = !!thisConfig.is_interruption_framework_enabled;
    let defaultRetryDelay = thisConfig.default_retry_delay_ticks | 0;
    defaultRetryDelay = defaultRetryDelay & ~(defaultRetryDelay >> 31); // defaultRetryDelay > 0 ? defaultRetryDelay : 0
    let defaultRetryLimit = thisConfig.default_retry_limit_ticks | 0;
    defaultRetryLimit = (defaultRetryLimit & ~(defaultRetryLimit >> 31)) + (-defaultRetryLimit >> 31) + 1; // defaultRetryLimit > 0 ? defaultRetryLimit : 1

    const eventNOOP = _EM.NOOP;
    const delegator = _EM.delegator;
    const activeEventType = _EM.activeEventType;
    const unregisteredActiveEvents = _EM.unregisteredActiveEvents;

    for (const eventName of ACTIVE_EVENTS) {
      let registryEntry = EVENT_REGISTRY[eventName];
      if (registryEntry === undefined) {
        unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
        continue;
      }
      _activeEvents[_activeEvents.length] = eventName;
      if (eventName === "tick") {
        continue;
      }
      if (!Array.isArray(registryEntry)) {
        registryEntry = EVENT_REGISTRY[eventName] = [];
      }
      const interruptionStatus = registryEntry[0] = !!registryEntry[0];
      if (isInterruptionFrameworkEnabled & interruptionStatus) {
        activeEventType[eventName] = 2;
        let delay = registryEntry[1];
        if ((delay === undefined) | (delay === null)) {
          delay = registryEntry[1] = defaultRetryDelay;
        }
        delay |= 0;

        let limit = registryEntry[2];
        if ((limit === undefined) | (limit === null)) {
          limit = registryEntry[2] = defaultRetryLimit;
        }
        limit |= 0;

        const _IF = InterruptionFramework;
        delegator[eventName] = eventNOOP[eventName] = function () { _IF.state = 0; };
        globalThis[eventName] = function handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          _IF.state = 1;
          _IF.handler = handler;
          _IF.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
          _IF.delay = delay;
          _IF.limit = limit;
          return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        };
      } else {
        activeEventType[eventName] = 1;
        delegator[eventName] = eventNOOP[eventName] = _NOOP;
        globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        };
      }
    }
  };

  _EM.primaryInstall = () => {
    if (_isPrimaryInstallDone) {
      return;
    }
    const delegator = _EM.delegator;
    const eventNOOP = _EM.NOOP;
    const activeEventsNum = _activeEvents.length;
    while (_primaryInstallCursor < activeEventsNum) {
      const eventName = _activeEvents[_primaryInstallCursor];
      const NOOP = eventNOOP[eventName];
      Object.defineProperty(globalThis, eventName, {
        configurable: true,
        set: (fn) => { delegator[eventName] = [NOOP, fn][+(typeof fn === "function")]; }
      });
      _primaryInstallCursor++;
    }
    _isPrimaryInstallDone = (_primaryInstallCursor >= activeEventsNum);
  };

  _EM.establish = () => {
    if (_EM.established) {
      return;
    }
    _resetCursor = 0;
    _EM.established = true;
  };

  _EM.resetHandlers = () => {
    const delegator = _EM.delegator;
    const eventNOOP = _EM.NOOP;
    const activeEventsNum = _activeEvents.length;
    while (_resetCursor < activeEventsNum) {
      const eventName = _activeEvents[_resetCursor];
      if (eventName !== "tick") {
        delegator[eventName] = eventNOOP[eventName];
      }
      _resetCursor++;
    }
  };
}

// TickMultiplexer
{
  const _TM = TickMultiplexer;
  const _EM = EventManager;

  const _NOOP = function () {};

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
      set: (fn) => { _main = [_NOOP, fn][+(typeof fn === "function")]; }
    });
    const delegator = _EM.delegator;
    _boot = delegator.tick;
    delegator.tick = dispatch;
    _installed = true;
  };

  _TM.finalize = () => {
    if (_finalized) {
      return;
    }
    const delegator = _EM.delegator;
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => { delegator.tick = [_NOOP, fn][+(typeof fn === "function")]; }
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
  const _EM = EventManager;
  const _OM = BootManager;

  let _resetOnReboot = true;
  let _maxDequeue = 1;

  let _main = null;
  let _buffer = null; // [[playerId, fromGameReset], ...]
  let _joinState = null; // playerId -> 0/1/2
  let _dequeueCursor = 0;

  let _installed = false;
  let _finalized = false;

  // join state
  const _STATE_NONE = 0;
  const _STATE_ENQUEUED = 1;
  const _STATE_PROCESSED = 2;

  _JM.establish = () => {
    if (_JM.established) {
      return;
    }
    const thisConfig = Configuration.join_manager;
    _resetOnReboot = !!thisConfig.reset_on_reboot;
    _maxDequeue = thisConfig.max_dequeue_per_tick | 0;
    _maxDequeue = (_maxDequeue & ~(_maxDequeue >> 31)) + (-_maxDequeue >> 31) + 1; // _maxDequeue > 0 ? _maxDequeue : 1

    _main = _EM.NOOP.onPlayerJoin;
    _buffer = [];
    if (_resetOnReboot | !_joinState) {
      _joinState = {};
    }
    _dequeueCursor = 0;

    _installed = false;
    _finalized = false;
    _JM.established = true;
  };

  _JM.refillBuffer = () => {
    if (_resetOnReboot | _OM.isPrimaryBoot) {
      const playerIds = api.getPlayerIds();
      for (const playerId of playerIds) {
        if ((_joinState[playerId] | 0) === _STATE_NONE) {
          _buffer[_buffer.length] = [playerId, false];
          _joinState[playerId] = _STATE_ENQUEUED;
        }
      }
    }
  };

  const dispatch = (playerId, fromGameReset) => {
    _buffer[_buffer.length] = [playerId, fromGameReset];
    _joinState[playerId] = _STATE_ENQUEUED;
  };

  _JM.install = () => {
    if (_installed) {
      return;
    }
    _EM.delegator.onPlayerJoin = dispatch;
    const NOOP = _EM.NOOP.onPlayerJoin;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => { _main = [NOOP, fn][+(typeof fn === "function")]; }
    });
    _installed = true;
  };

  _JM.dequeue = () => {
    let budget = _maxDequeue;
    while ((_dequeueCursor < _buffer.length) & (budget > 0)) {
      const args = _buffer[_dequeueCursor];
      const playerId = args[0];
      if (_joinState[playerId] !== _STATE_PROCESSED) {
        _main(playerId, args[1]);
        _joinState[playerId] = _STATE_PROCESSED;
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
    const NOOP = _EM.NOOP.onPlayerJoin;
    const delegator = _EM.delegator;
    delegator.onPlayerJoin = _main;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => { delegator.onPlayerJoin = [NOOP, fn][+(typeof fn === "function")]; }
    });
    _finalized = true;
  };
}

// BlockManager
{
  const _BM = BlockManager;
  const _OM = BootManager;

  let _blocks = null; // [[x, y, z, lockedStatus?, evalStatus?], ...]
  let _defaultLockedStatus = true;
  let _defaultEvalStatus = true;
  let _maxRegistrations = 1;
  let _maxRequests = 1;
  let _maxEvals = 1;
  let _maxErrors = 0;

  let _blockLockedStatus = null; // blockId -> false/true
  let _chunkLoadState = null; // chunkId -> 0/1/2
  let _chunkRequestQueue = null; // [[chunkId, x, y, z], ...] - every unloaded chunk used by `blocks`; `(x, y, z)` is chunk bottom left coordinates
  let _errors = null; // [[x, y, z, error.name, error.message], ...]
  let _hasAnyBlocksToEval = 0; // false
  let _registerCursor = 0;
  let _requestCursor = 0;
  let _evalCursor = 0;

  // chunk load state
  // const _STATE_UNLOADED = 0;
  const _STATE_REQUESTED = 1;
  const _STATE_LOADED = 2;

  _BM.establish = () => {
    if (_BM.established) {
      return;
    }
    _blocks = Configuration.blocks.slice();
    const thisConfig = Configuration.block_manager;
    _defaultLockedStatus = !!thisConfig.default_locked_status;
    _defaultEvalStatus = !!thisConfig.default_eval_status;
    _maxRegistrations = thisConfig.max_registrations_per_tick | 0;
    _maxRegistrations = (_maxRegistrations & ~(_maxRegistrations >> 31)) + (-_maxRegistrations >> 31) + 1; // maxRegistrations > 0 ? maxRegistrations : 1
    _maxRequests = thisConfig.max_requests_per_tick | 0;
    _maxRequests = (_maxRequests & ~(_maxRequests >> 31)) + (-_maxRequests >> 31) + 1; // maxRequests > 0 ? maxRequests : 1
    _maxEvals = thisConfig.max_evals_per_tick | 0;
    _maxEvals = (_maxEvals & ~(_maxEvals >> 31)) + (-_maxEvals >> 31) + 1; // maxEvals > 0 ? maxEvals : 1
    _maxErrors = thisConfig.max_errors_count | 0;
    _maxErrors = _maxErrors & ~(_maxErrors >> 31); // maxErrors > 0 ? maxErrors : 0

    _BM.phase = 0; // or 1
    _blockLockedStatus = {};
    _chunkLoadState = {};
    _chunkRequestQueue = [];
    _errors = _BM.errors = [null];
    _hasAnyBlocksToEval = 0;
    _registerCursor = 0;
    _requestCursor = 0;
    _evalCursor = 0;

    _BM.established = true;
  };

  const register = () => {
    const blocksNum = _blocks.length;
    let budget = _maxRegistrations;
    while ((_registerCursor < blocksNum) & (budget > 0)) {
      const block = _blocks[_registerCursor] = _blocks[_registerCursor].slice();
      let x = block[0];
      x = (x | 0) - (x < (x | 0)); // Math.floor(x)
      let y = block[1];
      y = (y | 0) - (y < (y | 0)); // Math.floor(y)
      let z = block[2];
      z = (z | 0) - (z < (z | 0)); // Math.floor(z)

      // const blockId = (x + "|" + y + "|" + z);
      const lockedStatus = block[3];
      if ((lockedStatus === undefined) | (lockedStatus === null)) {
        _blockLockedStatus[(x + "|" + y + "|" + z)] = block[3] = _defaultLockedStatus;
      } else {
        _blockLockedStatus[(x + "|" + y + "|" + z)] = block[3] = !!lockedStatus;
      }

      let evalStatus = block[4];
      if ((evalStatus === undefined) | (evalStatus === null)) {
        evalStatus = block[4] = _defaultEvalStatus;
      } else {
        evalStatus = block[4] = !!evalStatus;
      }

      if (evalStatus) {
        const isChunkLoaded = api.isBlockInLoadedChunk(x, y, z);
        const chunkId = ((x >> 5) + "|" + (y >> 5) + "|" + (z >> 5));
        if (_chunkLoadState[chunkId] === undefined) {
          _chunkLoadState[chunkId] = isChunkLoaded << 1; // isChunkLoaded ? _STATE_LOADED : _STATE_UNLOADED
          if (!isChunkLoaded) {
            _chunkRequestQueue[_chunkRequestQueue.length] = [chunkId, ((x >> 5) << 5), ((y >> 5) << 5), ((z >> 5) << 5)];
          }
        }
        _hasAnyBlocksToEval = 1;
      }

      budget--;
      _registerCursor++;
    }

    _BM.phase = ((_registerCursor >= blocksNum) << 1) | (_hasAnyBlocksToEval ^ 1);  // (_registerCursor >= blocksNum) ? (_hasAnyBlocksToEval ? 2 : 3) : (_hasAnyBlocksToEval ? 0 : 1)
  };

  const initialize = () => {
    const chunksNum = _chunkRequestQueue.length;
    let cursorIndex = _requestCursor;
    let budget = _maxRequests;
    while ((cursorIndex < chunksNum) & (budget > 0)) {
      const requestEntry = _chunkRequestQueue[cursorIndex];

      if (api.getBlockId(requestEntry[1], requestEntry[2], requestEntry[3]) === 1) {
        _chunkLoadState[requestEntry[0]] = _STATE_REQUESTED;
      } else {
        _chunkLoadState[requestEntry[0]] = _STATE_LOADED;
        if (cursorIndex === _requestCursor) {
          _requestCursor++;
        }
      }

      budget--;
      cursorIndex++;
    }

    const blocksNum = _blocks.length;
    budget = _maxEvals;
    while ((_evalCursor < blocksNum) & (budget > 0)) {
      const block = _blocks[_evalCursor];
      if (!block[4]) {
        _evalCursor++;
        continue;
      }

      const x = block[0];
      const y = block[1];
      const z = block[2];

      // const chunkId = (x >> 5) + "|" + (y >> 5) + "|" + (z >> 5);
      if (_chunkLoadState[(x >> 5) + "|" + (y >> 5) + "|" + (z >> 5)] !== _STATE_LOADED) {
        break;
      }
      try {
        const code = api.getBlockData(x, y, z)?.persisted?.shared?.text;
        (0, eval)(code);
      } catch (error) {
        const count = _errors.length - 1;
        const isWithinLimit = +(count < _maxErrors);
        _errors[(count + 1) * isWithinLimit] = [_errors[count * isWithinLimit], [x, y, z, error.name, error.message]][isWithinLimit];
      }

      budget--;
      _evalCursor++;
    }

    _BM.phase = 2 | (_evalCursor >= blocksNum);
  };

  _BM.main = () => {
    if (_BM.phase < 2) { return register(); };
    if (_BM.phase === 2) { initialize(); };
  };

  _BM.isBlockLocked = (position) => {
    const x = position[0];
    const y = position[1];
    const z = position[2];
    // const blockId = (Math.floor(x) + "|" + Math.floor(y) + "|" + Math.floor(z));
    if (_blockLockedStatus[((x | 0) - (x < (x | 0))) + "|" + ((y | 0) - (y < (y | 0))) + "|" + ((z | 0) - (z < (z | 0)))] !== false) {
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

  let _tickNum = -1;
  let _loadTimeTicks = -1;

  _OM.logLoadTime = (showErrors) => {
    const errorsNum = _BM.errors.length - 1;
    let logs = "Code Loader: BootManager: Code was loaded in " + (_loadTimeTicks * 50) + " ms";
    if (errorsNum === 0) {
      logs += showErrors ? (" with 0 errors.") : (".");
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle?.success ?? {},
      }]);
    } else {
      logs += showErrors ? (" with " + errorsNum + " error" + ((errorsNum === 1) ? "" : "s") + ".") : (".");
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle?.warning ?? {},
      }]);
    }
  };

  _OM.logErrors = () => {
    const errors = _BM.errors;
    const errorsNum = errors.length - 1;
    if (errorsNum > 0) {
      let logs = "Code Loader: BlockManager: Code evaluation error" + ((errorsNum === 1) ? "" : "s") + ":";
      let index = 1;
      while (index <= errorsNum) {
        const error = errors[index];
        logs += "\n" + error[3] + " at (" + error[0] + "," + error[1] + "," + error[2] + "): " + error[4];
        index++;
      }
      api.broadcastMessage([{
        str: logs,
        style: _OM.logStyle?.error ?? {}
      }]);
    }
  };

  _OM.logBootResult = (showLoadTime, showErrors) => {
    const unregisteredActiveEvents = _EM.unregisteredActiveEvents;
    if (unregisteredActiveEvents.length) {
      api.broadcastMessage([{
        str: "Code Loader: EventManager: Unregistered callbacks: " + unregisteredActiveEvents.join(", ") + ".",
        style: _OM.logStyle?.warning ?? {}
      }]);
    }
    if (showLoadTime) {
      _OM.logLoadTime(showErrors);
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
        if (_OM.isPrimaryBoot & (!_EM.isPrimarySetupDone) & (_tickNum > 10)) {
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
        _JM.establish();
        _BM.establish();
        _OM.phase = 3;
      }

      // reset/setup data
      if (_OM.phase === 3) {
        if (_OM.isPrimaryBoot) {
          _EM.primaryInstall();
        }
        _EM.resetHandlers()
        if (!!_EM.activeEventType.onPlayerJoin) {
          _JM.refillBuffer();
        }
        _OM.phase = 4;
      }

      // install managers
      if (_OM.phase === 4) {
        if (!!_EM.activeEventType.onPlayerJoin) {
          _JM.install();
        }
        _TM.install();
        _OM.phase = 5;
        return;
      }

      // start block initializer
      if (_OM.phase === 5) {
        _TM.init = _BM.main;
        _OM.phase = 6;
        return;
      }
    }

    // start join dequeue
    if (_OM.phase === 6) {
      if (_BM.phase === 3) {
        _BM.errors[0] = null;
        _OM.phase = 6 + 1 + !_EM.activeEventType.onPlayerJoin;
      }
    }

    // tick join dequeue
    if (_OM.phase === 7) {
      _OM.phase += (_JM.dequeue() | 0);
    }

    // finish boot
    if (_OM.phase === 8) {
      if (!!_EM.activeEventType.onPlayerJoin) {
        _JM.finalize();
      }
      _TM.finalize();
      _BM.phase = 4;
      _OM.isPrimaryBoot = false;
      _CL.isRunning = _OM.isRunning = false;
      _OM.phase = -1;

      _loadTimeTicks = _tickNum - _bootDelayTicks + 1;
      _OM.logBootResult(_showLoadTime, _showErrors);
    }
  };
}

// CodeLoader
{
  const _CL = CodeLoader;
  const _IF = InterruptionFramework;
  const _EM = EventManager;
  const _BM = BlockManager;
  const _OM = BootManager;

  _CL.configuration = Configuration;

  _CL.state = (eventName) => {
    const activeEventType = _EM.activeEventType[eventName];
    if (activeEventType === undefined) {
      api.broadcastMessage([{
        str: "Code Loader: EventManager: interruption state - \"" + eventName + "\" is invalid active event name.",
        style: _OM.logStyle?.error ?? {}
      }]);
    } else if (activeEventType === 1) {
      api.broadcastMessage([{
        str: "Code Loader: EventManager: interruption state - \"" + eventName + "\" interruption status is false.",
        style: _OM.logStyle?.warning ?? {}
      }]);
    }
    _IF.state = 0;
  };

  _CL.isBlockLocked = (position) => {
    return (!Array.isArray(position) || position.length !== 3 || _BM.isBlockLocked(position));
  };

  _CL.reboot = () => {
    if (!_OM.isRunning) {
      _EM.delegator.tick = _OM.tick;
      _OM.phase = 0;
    } else {
      api.broadcastMessage([{
        str: "Code Loader: BootManager: Wait until current running boot session is finished.",
        style: _OM.logStyle?.warning ?? {}
      }]);
    }
  };

  _CL.logBootResult = (showLoadTime = true, showErrors = true) => {
    _OM.logBootResult(showLoadTime, showErrors);
  };

  _CL.logLoadTime = (showErrors = true) => {
    _OM.logLoadTime(showErrors);
  };

  _CL.logErrors = () => {
    _OM.logErrors();
  };
};

// Tick Event Setup
{
  const delegator = EventManager.delegator = {};
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

  const toFreeze = [
    Configuration.ACTIVE_EVENTS,
    Configuration.EVENT_REGISTRY,
  ];

  toSeal.forEach(obj => {
    Object.seal(obj);
  });

  toFreeze.forEach(obj => {
    Object.freeze(obj);
  });

  EventManager.isPrimarySetupDone = true;
  BootManager.phase = 0;
} catch (error) {
  EventManager.primarySetupError = [error.name, error.message];
}

globalThis.IF = InterruptionFramework;
globalThis.CL = CodeLoader;

void 0;

