// Copyright (c) 2025 delfineonx
// This product includes "Codeloader" created by delfineonx.
// Licensed under the Apache License, Version 2.0 (the "License").

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
    boot_delay_ms: 200,
    show_load_time: true,
    show_errors: true,
  },
  block_manager: {
    default_locked_status: true,
    default_eval_status: true,
    max_registrations_per_tick: 32,
    max_requests_per_tick: 8,
    max_evals_per_tick: 16,
    max_error_logs: 32,
  },
  join_manager: {
    reset_on_reboot: true,
    max_dequeue_per_tick: 8,
  },
  interruption_manager: {
    is_enabled: false,
    max_dequeue_per_tick: 32,
    default_retry_delay_ms: 0,
    default_retry_limit_ms: 150,
    default_retry_interval_ms: 50,
    default_retry_cooldown_ms: 300,
  },

  // if event has special return value, then `interruptionStatus = false` setup is recommended
  // eventName -> [interruptionStatus?, delayMs?, limitMs?, intervalMs?, cooldownMs?]
  // string -> [boolean|null, number|null, number|null, number|null, number|null]
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
    error: {
      color: "#ff9d87",
      fontWeight: "600",
      fontSize: "1rem"
    },
    warning: {
      color: "#fcd373",
      fontWeight: "600",
      fontSize: "1rem"
    },
    success: {
      color: "#2eeb82",
      fontWeight: "600",
      fontSize: "1rem"
    },
  },
};

const EventManager = {
  interruption_manager: null,

  NOOP: null,
  delegator: null, // eventName -> delegatorFunction
  activeEvents: null, // [eventName, ...]
  isEventActive: null, // eventName -> true
  unregisteredActiveEvents: null, // [eventName, ...]
  primarySetupError: null, // [error.name, error.message]

  primaryInstallCursor: 0,
  resetCursor: 0,

  isPrimarySetupDone: false,
  isPrimaryInstallDone: false,
  established: false,

  primarySetup() {
    if (!this.isPrimarySetupDone) {
      const interruption_manager = this.interruption_manager;
      const isInterruptionManagerEnabled = !!Configuration.interruption_manager.is_enabled;
      const primaryEventRegistry = interruption_manager.eventRegistry = Configuration.EVENT_REGISTRY;
      const primaryActiveEvents = Configuration.ACTIVE_EVENTS;

      const NOOP = this.NOOP = function () { };
      const delegator = this.delegator;
      const activeEvents = this.activeEvents = [];
      const isEventActive = this.isEventActive = {};
      const unregisteredActiveEvents = this.unregisteredActiveEvents = [];

      const interruption_dispatcher = interruption_manager.dispatcher;
      const interruptionNOOP = interruption_manager.NOOP = {};
      const eventIndexByName = interruption_manager.eventIndexByName = {};
      const eventDataByIndex = interruption_dispatcher.eventDataByIndex = interruption_manager.eventDataByIndex = [];
      interruption_manager.defaultRetryTicks = new Int32Array(4);
      const eventRetryTicksByIndex = interruption_dispatcher.eventRetryTicksByIndex = interruption_manager.eventRetryTicksByIndex = [];
      const dequeueStateMask = interruption_dispatcher.dequeueStateMask = interruption_manager.dequeueStateMask = new Uint32Array(2);
      const iterationStateMask = interruption_dispatcher.iterationStateMask = interruption_manager.iterationStateMask = new Uint32Array(2);

      const caseCache = [null, null];
      let interruptionEventIndex = 0;
      for (const eventName of primaryActiveEvents) {
        let registryEntry = primaryEventRegistry[eventName];
        if (registryEntry === undefined) {
          unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
          continue;
        }
        activeEvents[activeEvents.length] = eventName;
        isEventActive[eventName] = true;
        if (eventName !== "tick") {
          caseCache[0] = [];
          caseCache[1] = registryEntry;
          registryEntry = primaryEventRegistry[eventName] = caseCache[+(Array.isArray(registryEntry))]
          const interruptionStatus = registryEntry[0] = !!registryEntry[0];
          if (isInterruptionManagerEnabled & interruptionStatus) {
            interruption_manager.isActive = true;
            const eventIndex = interruptionEventIndex;
            eventIndexByName[eventName] = eventIndex;
            eventRetryTicksByIndex[eventIndex] = new Int32Array(6);
            const eventData = eventDataByIndex[eventIndex] = [eventName, -1, new Array(9)];
            const args = eventData[2];
            delegator[eventName] = interruptionNOOP[eventName] = function () { interruption_manager.setInterruptionState(eventName); };
            globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              dequeueStateMask[eventIndex >> 5] |= (1 << (eventIndex & 31));
              iterationStateMask[eventIndex >> 5] |= (1 << (eventIndex & 31));
              eventData[1] = interruption_manager.tickCount;
              args[0] = arg0;
              args[1] = arg1;
              args[2] = arg2;
              args[3] = arg3;
              args[4] = arg4;
              args[5] = arg5;
              args[6] = arg6;
              args[7] = arg7;
              args[8] = arg8;
              return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            };
            interruptionEventIndex++;
          } else {
            delegator[eventName] = NOOP;
            globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              return delegator[eventName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            };
          }
        }
      }
    }
  },

  primaryInstall() {
    if (!this.isPrimaryInstallDone) {
      const caseCache = [null, null];

      const interruptionNOOP = this.interruption_manager.NOOP;

      caseCache[1] = this.NOOP;
      const delegator = this.delegator;
      const activeEvents = this.activeEvents;

      const len = activeEvents.length;
      let cursorIndex = this.primaryInstallCursor;
      while (cursorIndex < len) {
        const eventName = activeEvents[cursorIndex];
        caseCache[0] = interruptionNOOP[eventName];
        const NOOP = caseCache[+(caseCache[0] === undefined)];
        Object.defineProperty(globalThis, eventName, {
          configurable: true,
          set: (fn) => { delegator[eventName] = [NOOP, fn][+(typeof fn === "function")]; }
        });
        cursorIndex = ++this.primaryInstallCursor;
      }
      this.isPrimaryInstallDone = (cursorIndex >= len);
    }
    return this.isPrimaryInstallDone;
  },

  establish() {
    if (!this.established) {
      this.resetCursor = 0;
      this.established = true;
    }
  },

  resetHandlers() {
    const caseCache = [null, null];

    const interruptionNOOP = this.interruption_manager.NOOP;

    caseCache[1] = this.NOOP;
    const delegator = this.delegator;
    const activeEvents = this.activeEvents;

    const len = activeEvents.length;
    let cursorIndex = this.resetCursor;
    while (cursorIndex < len) {
      const eventName = activeEvents[cursorIndex];
      if (eventName !== "tick") {
        caseCache[0] = interruptionNOOP[eventName];
        delegator[eventName] = caseCache[+(caseCache[0] === undefined)];
      }
      cursorIndex = ++this.resetCursor;
    }
    return (cursorIndex >= len);
  },
};

const InterruptionManager = {
  NOOP: null, // eventName -> interruptionNOOPfunction
  eventIndexByName: null, // eventName -> eventIndex
  eventDataByIndex: null, // [[eventName, tickTimestamp, [arg0, ..., arg8]], ...]

  eventRegistry: null, // eventName -> [interruptionStatus?, delayMs?, limitMs?, gapMs?, cooldownMs?]
  defaultRetryTicks: null, // Int32Array([delay, limit, interval, cooldown])
  maxDequeuePerTick: 1,

  tickCount: -1,
  eventRetryTicksByIndex: null, // [Int32Array([counter, cooldownTimestamp, delay, limit, interval, cooldown]), ...]
  dequeueStateMask: null, // Uint32Array(2)
  iterationStateMask: null, // Uint32Array(2)
  seedCursor: 0,

  isActive: false,
  established: false,

  establish() {
    if (!this.established) {
      const thisConfiguration = Configuration.interruption_manager;
      const defaultRetryTicks = this.defaultRetryTicks;
      const delayTicks = ((thisConfiguration.default_retry_delay_ms | 0) * 0.02) | 0;
      defaultRetryTicks[0] = delayTicks & ~(delayTicks >> 31); // delayTicks > 0 ? delayTicks : 0
      const limitTicks = ((thisConfiguration.default_retry_limit_ms | 0) * 0.02) | 0;
      defaultRetryTicks[1] = limitTicks & ~(limitTicks >> 31); // limitTicks > 0 ? limitTicks : 0
      const intervalTicks = ((thisConfiguration.default_retry_interval_ms | 0) * 0.02) | 0;
      defaultRetryTicks[2] = intervalTicks & ~(intervalTicks >> 31); // intervalTicks > 0 ? intervalTicks : 0
      const cooldownTicks = ((thisConfiguration.default_retry_cooldown_ms | 0) * 0.02) | 0;
      defaultRetryTicks[3] = (cooldownTicks & ~(cooldownTicks >> 31)) + (-cooldownTicks >> 31) + 1; // cooldownTicks > 0 ? cooldownTicks : 1
      const maxDequeuePerTick = thisConfiguration.max_dequeue_per_tick | 0;
      this.maxDequeuePerTick = (maxDequeuePerTick & ~(maxDequeuePerTick >> 31)) + (-maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1

      this.tickCount = 0;
      this.dequeueStateMask[0] = 0;
      this.dequeueStateMask[1] = 0;
      this.iterationStateMask[0] = 0;
      this.iterationStateMask[1] = 0;
      this.seedCursor = 0;

      this.established = true;
    }
  },

  seedEventRetryTicks() {
    const caseCache = [null, null];
    const eventDataByIndex = this.eventDataByIndex;

    const eventRegistry = this.eventRegistry;
    const defaultRetryTicks = this.defaultRetryTicks;

    const eventRetryTicksByIndex = this.eventRetryTicksByIndex;

    const len = eventRetryTicksByIndex.length;
    let cursorIndex = this.seedCursor;
    while (cursorIndex < len) {
      const eventName = eventDataByIndex[cursorIndex][0];
      const registryEntry = eventRegistry[eventName];
      const retryEntry = eventRetryTicksByIndex[cursorIndex];

      retryEntry[0] = 0;
      retryEntry[1] = 0;

      const delayMs = registryEntry[1];
      const delayTicks = ((delayMs | 0) * 0.02) | 0;
      caseCache[0] = delayTicks & ~(delayTicks >> 31); // delayTicks > 0 ? delayTicks : 0
      caseCache[1] = defaultRetryTicks[0];
      retryEntry[2] = caseCache[(delayMs === undefined) | (delayMs === null)];

      const limitMs = registryEntry[2];
      const limitTicks = ((limitMs | 0) * 0.02) | 0;
      caseCache[0] = limitTicks & ~(limitTicks >> 31); // limitTicks > 0 ? limitTicks : 0
      caseCache[1] = defaultRetryTicks[1];
      retryEntry[3] = caseCache[(limitMs === undefined) | (limitMs === null)];

      const intervalMs = registryEntry[3];
      const intervalTicks = ((intervalMs | 0) * 0.02) | 0;
      caseCache[0] = intervalTicks & ~(intervalTicks >> 31); // intervalTicks > 0 ? intervalTicks : 0
      caseCache[1] = defaultRetryTicks[2];
      retryEntry[4] = caseCache[(intervalMs === undefined) | (intervalMs === null)];

      const cooldownMs = registryEntry[4];
      const cooldownTicks = ((cooldownMs | 0) * 0.02) | 0;
      caseCache[0] = (cooldownTicks & ~(cooldownTicks >> 31)) + (-cooldownTicks >> 31) + 1; // cooldownTicks > 0 ? cooldownTicks : 1
      caseCache[1] = defaultRetryTicks[3];
      retryEntry[5] = caseCache[(cooldownMs === undefined) | (cooldownMs === null)];

      cursorIndex = ++this.seedCursor;
    }
    return (cursorIndex >= len);
  },

  setInterruptionState(eventName) {
    const eventIndex = this.eventIndexByName[eventName];
    this.dequeueStateMask[eventIndex >> 5] &= ~(1 << (eventIndex & 31));
    this.iterationStateMask[eventIndex >> 5] &= ~(1 << (eventIndex & 31));
  },

  dispatcher: {
    event_manager: null,
    boot_manager: null,

    eventDataByIndex: null,
    eventRetryTicksByIndex: null,
    dequeueStateMask: null,
    iterationStateMask: null,

    tickCount: 0,
    budget: 0,
    wordIndex: 0,

    lsb: 0,
    eventData: null,
    eventRetry: null,

    get 1() {
      this.lsb = this.iterationStateMask[this.wordIndex] & -this.iterationStateMask[this.wordIndex];
      const eventIndex = (this.wordIndex << 5) | (31 - Math.clz32(this.lsb));
      this.eventData = this.eventDataByIndex[eventIndex];
      const eventRetry = this.eventRetry = this.eventRetryTicksByIndex[eventIndex];

      let continueCase = 1;
      continueCase ^= this[continueCase * (this.tickCount - this.eventData[1] <= eventRetry[2]) * 2];
      continueCase ^= this[continueCase * (eventRetry[1] >= this.tickCount) * 3];
      continueCase ^= this[continueCase * (eventRetry[0] >= eventRetry[3]) * 4];
      continueCase ^= this[continueCase * (!(eventRetry[0] % (eventRetry[4] + 1))) * 5];
      this[continueCase * 6];

      this[(!!this.iterationStateMask[this.wordIndex]) & (this.budget > 0)];
    },

    get 2() {
      this.iterationStateMask[this.wordIndex] &= ~this.lsb;
      return 1;
    },

    get 3() {
      this.dequeueStateMask[this.wordIndex] &= ~this.lsb;
      this.iterationStateMask[this.wordIndex] &= ~this.lsb;
      return 1;
    },

    get 4() {
      const eventRetry = this.eventRetry;
      const interruptedRetryTicks = ((eventRetry[3] + eventRetry[4]) / (eventRetry[4] + 1)) | 0; // Math.ceil(limit / (interval + 1))
      if (interruptedRetryTicks > 1) {
        api.broadcastMessage([{
          str: `Codeloader: InterruptionManager: "${this.eventData[0]}" has been dropped after ${interruptedRetryTicks} consecutive interrupted retry ticks.`,
          style: this.boot_manager.logStyle?.error ?? {}
        }]);
      }
      const args = this.eventData[2];
      args[0] = args[1] = args[2] = args[3] = args[4] = args[5] = args[6] = args[7] = args[8] = undefined;
      eventRetry[0] = 0;
      eventRetry[1] = this.tickCount + eventRetry[5];
      this.dequeueStateMask[this.wordIndex] &= ~this.lsb;
      this.iterationStateMask[this.wordIndex] &= ~this.lsb;
      return 1;
    },

    get 5() {
      this.eventRetry[0]++;
      const args = this.eventData[2];
      this.event_manager.delegator[this.eventData[0]].apply(null, args);
      args[0] = args[1] = args[2] = args[3] = args[4] = args[5] = args[6] = args[7] = args[8] = undefined;
      this.eventRetry[0] = 0;
      this.budget--;
      return 1;
    },

    get 6() {
      this.eventRetry[0]++;
      this.iterationStateMask[this.wordIndex] &= ~this.lsb;
      return 1;
    },
  },

  dequeue() {
    if (this.dequeueStateMask[0] | this.dequeueStateMask[1]) {
      const dispatcher = this.dispatcher;
      dispatcher.tickCount = this.tickCount;
      dispatcher.budget = this.maxDequeuePerTick;
      let wordIndex = dispatcher.wordIndex = 0;
      while (wordIndex < 2) {
        this.iterationStateMask[wordIndex] |= this.dequeueStateMask[wordIndex];
        dispatcher[!!this.iterationStateMask[wordIndex] & (dispatcher.budget > 0)]
        wordIndex = ++dispatcher.wordIndex;
      }
    }
  },
};

const TickMultiplexer = {
  event_manager: null,
  interruption_manager: null,
  boot_manager: null,

  boot: null,
  init: null,
  main: null,

  established: false,
  installed: false,
  finalized: false,

  establish() {
    if (!this.established) {
      const NOOP = this.event_manager.NOOP;

      this.boot = NOOP;
      this.init = NOOP;
      this.main = NOOP;

      this.installed = false;
      this.finalized = false;
      this.established = true;
    }
  },

  dispatch() {
    TickMultiplexer.boot();
    TickMultiplexer.init();
    TickMultiplexer.main();
  },

  interruptionTick() {
    TickMultiplexer.interruption_manager.tickCount++;
    TickMultiplexer.main();
    TickMultiplexer.interruption_manager.dequeue();
  },

  install() {
    if (!this.installed) {
      const NOOP = this.event_manager.NOOP;
      const delegator = this.event_manager.delegator;
      Object.defineProperty(globalThis, "tick", {
        configurable: true,
        set: (fn) => { this.main = [NOOP, fn][+(typeof fn === "function")]; }
      });
      this.boot = delegator.tick;
      delegator.tick = this.dispatch;
      this.installed = true;
    }
  },

  finalize() {
    if (!this.finalized) {
      const NOOP = this.event_manager.NOOP;
      const delegator = this.event_manager.delegator;
      if (!this.interruption_manager.isActive) {
        Object.defineProperty(globalThis, "tick", {
          configurable: true,
          set: (fn) => { delegator.tick = [NOOP, fn][+(typeof fn === "function")]; }
        });
        delegator.tick = this.main;
      } else {
        delegator.tick = this.interruptionTick;
      }
      this.boot = NOOP;
      this.init = NOOP;
      this.finalized = true;
    }
  },
};

const JoinManager = {
  event_manager: null,
  interruption_manager: null,
  boot_manager: null,

  resetOnReboot: true,
  maxDequeuePerTick: 1,

  main: null,
  buffer: null, // [[playerId, fromGameReset], ...]
  joinState: null, // playerId -> 0/1/2
  dequeueCursor: 0,

  established: false,
  installed: false,
  finalized: false,

  JOIN_STATE: {
    NONE: 0,
    ENQUEUED: 1,
    PROCESSED: 2,
  },

  establish() {
    if (!this.established) {
      const thisConfiguration = Configuration.join_manager;
      this.resetOnReboot = !!thisConfiguration.reset_on_reboot;
      const maxDequeuePerTick = thisConfiguration.max_dequeue_per_tick | 0;
      this.maxDequeuePerTick = (maxDequeuePerTick & ~(maxDequeuePerTick >> 31)) + (-maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1

      this.main = this.event_manager.NOOP;
      this.buffer = [];
      this.joinState = [this.joinState, {}][this.resetOnReboot | !this.joinState];
      this.dequeueCursor = 0;

      this.installed = false;
      this.finalized = false;
      this.established = true;
    }
  },

  seedFromOnlinePlayers() {
    if (this.resetOnReboot | this.boot_manager.isPrimaryBoot) {
      const playerIds = api.getPlayerIds();

      const buffer = this.buffer;
      const joinState = this.joinState;

      const STATE_NONE = this.JOIN_STATE.NONE;
      const STATE_ENQUEUED = this.JOIN_STATE.ENQUEUED;

      for (const playerId of playerIds) {
        if ((joinState[playerId] | 0) === STATE_NONE) {
          buffer[buffer.length] = [playerId, false];
          joinState[playerId] = STATE_ENQUEUED;
        }
      }
    }
    return true;
  },

  dispatch(playerId, fromGameReset) {
    JoinManager.buffer[JoinManager.buffer.length] = [playerId, fromGameReset];
    JoinManager.joinState[playerId] = JoinManager.JOIN_STATE.ENQUEUED;
  },

  install() {
    if (!this.installed) {
      this.event_manager.delegator.onPlayerJoin = this.dispatch;
      const interruptionNOOP = this.interruption_manager.NOOP.onPlayerJoin;
      const NOOP = [interruptionNOOP, this.event_manager.NOOP][+(interruptionNOOP === undefined)];
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: (fn) => { this.main = [NOOP, fn][+(typeof fn === "function")]; }
      });
      this.installed = true;
    }
  },

  dequeue() {
    const main = this.main;
    const buffer = this.buffer;
    const joinState = this.joinState;

    const STATE_PROCESSED = this.JOIN_STATE.PROCESSED;

    let budget = this.maxDequeuePerTick;
    let cursorIndex = this.dequeueCursor;
    while ((cursorIndex < buffer.length) & (budget > 0)) {
      const args = buffer[cursorIndex];
      const playerId = args[0];
      if (joinState[playerId] !== STATE_PROCESSED) {
        main(playerId, args[1]);
        joinState[playerId] = STATE_PROCESSED;
        budget--;
      }
      cursorIndex = ++this.dequeueCursor;
    }
    return (cursorIndex >= buffer.length);
  },

  finalize() {
    if (!this.finalized) {
      const interruptionNOOP = this.interruption_manager.NOOP.onPlayerJoin;
      const NOOP = [interruptionNOOP, this.event_manager.NOOP][+(interruptionNOOP === undefined)];
      const delegator = this.event_manager.delegator;
      delegator.onPlayerJoin = this.main;
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: (fn) => { delegator.onPlayerJoin = [NOOP, fn][+(typeof fn === "function")]; }
      });
      this.finalized = true;
    }
  },
};

const BlockManager = {
  boot_manager: null,

  blocks: null, // [[x, y, z, lockedStatus?, evalStatus?], ...]
  defaultLockedStatus: true,
  defaultEvalStatus: true,
  maxRegistrationsPerTick: 1,
  maxRequestsPerTick: 1,
  maxEvalsPerTick: 1,
  maxErrorLogs: 0,

  phase: -1,
  blockLockedStatus: null, // blockId -> false/true
  chunkLoadState: null, // chunkId -> 0/1/2
  chunkRequestQueue: null, // [[chunkId, x, y, z], ...] - every unloaded chunk used by `blocks`; `(x, y, z)` is chunk bottom left coordinates
  errors: null, // [[x, y, z, error.name, error.message], ...]
  hasAnyEvalBlocks: false,
  registerCursor: 0,
  requestCursor: 0,
  evalCursor: 0,

  established: false,

  CHUNK_LOAD_STATE: {
    UNLOADED: 0,
    REQUESTED: 1,
    LOADED: 2
  },

  establish() {
    if (!this.established) {
      this.blocks = Array.isArray(Configuration.blocks) ? Configuration.blocks.slice() : [];
      const thisConfiguration = Configuration.block_manager;
      this.defaultLockedStatus = !!thisConfiguration.default_locked_status;
      this.defaultEvalStatus = !!thisConfiguration.default_eval_status;
      const maxRegistrationsPerTick = thisConfiguration.max_registrations_per_tick | 0;
      this.maxRegistrationsPerTick = (maxRegistrationsPerTick & ~(maxRegistrationsPerTick >> 31)) + (-maxRegistrationsPerTick >> 31) + 1; // maxRegistrationsPerTick > 0 ? maxRegistrationsPerTick : 1
      const maxRequestsPerTick = thisConfiguration.max_requests_per_tick | 0;
      this.maxRequestsPerTick = (maxRequestsPerTick & ~(maxRequestsPerTick >> 31)) + (-maxRequestsPerTick >> 31) + 1; // maxRequestsPerTick > 0 ? maxRequestsPerTick : 1
      const maxEvalsPerTick = thisConfiguration.max_evals_per_tick | 0;
      this.maxEvalsPerTick = (maxEvalsPerTick & ~(maxEvalsPerTick >> 31)) + (-maxEvalsPerTick >> 31) + 1; // maxEvalsPerTick > 0 ? maxEvalsPerTick : 1
      const maxErrorLogs = thisConfiguration.max_error_logs | 0;
      this.maxErrorLogs = maxErrorLogs & ~(maxErrorLogs >> 31); // maxErrorLogs > 0 ? maxErrorLogs : 0

      this.phase = 1;
      this.blockLockedStatus = {};
      this.chunkLoadState = {};
      this.chunkRequestQueue = [];
      this.errors = [];
      this.hasAnyEvalBlocks = false;
      this.registerCursor = 0;
      this.requestCursor = 0;
      this.evalCursor = 0;

      this.established = true;
    }
  },

  main() {
    BlockManager[BlockManager.phase];
  },

  // register
  get 1() {
    const caseCache = [null, null];

    const blocks = this.blocks;
    const defaultLockedStatus = this.defaultLockedStatus;
    const defaultEvalStatus = this.defaultEvalStatus;

    const blockLockedStatus = this.blockLockedStatus;
    const chunkLoadState = this.chunkLoadState;
    const chunkRequestQueue = this.chunkRequestQueue;

    const len = blocks.length;
    let budget = this.maxRegistrationsPerTick;
    let cursorIndex = this.registerCursor;
    while ((cursorIndex < len) & (budget > 0)) {
      const block = blocks[cursorIndex] = blocks[cursorIndex].slice();
      const x = block[0] = (block[0] | 0) - ((block[0] < (block[0] | 0)) & 1); // Math.floor(x)
      const y = block[1] = (block[1] | 0) - ((block[1] < (block[1] | 0)) & 1); // Math.floor(y)
      const z = block[2] = (block[2] | 0) - ((block[2] < (block[2] | 0)) & 1); // Math.floor(z)

      const blockId = (x + "|" + y + "|" + z);

      caseCache[0] = !!block[3];
      caseCache[1] = defaultLockedStatus;
      blockLockedStatus[blockId] = block[3] = caseCache[(block[3] === undefined) | (block[3] === null)];

      caseCache[0] = !!block[4];
      caseCache[1] = defaultEvalStatus;
      const blockEvalStatus = block[4] = caseCache[(block[4] === undefined) | (block[4] === null)];

      if (blockEvalStatus) {
        const isChunkLoaded = api.isBlockInLoadedChunk(x, y, z);
        const chunkId = ((x >> 5) + "|" + (y >> 5) + "|" + (z >> 5));
        if (chunkLoadState[chunkId] === undefined) {
          chunkLoadState[chunkId] = isChunkLoaded << 1; // isChunkLoaded === true ? 2 : 0
          if (!isChunkLoaded) {
            chunkRequestQueue[chunkRequestQueue.length] = [chunkId, ((x >> 5) << 5), ((y >> 5) << 5), ((z >> 5) << 5)];
          }
        }
        this.hasAnyEvalBlocks = true;
      }

      budget--;
      cursorIndex = ++this.registerCursor;
    }

    this.phase = 1 + (cursorIndex >= len) * (!(this.hasAnyEvalBlocks) + 1);  // hasAnyEvalBlocks === true ? 2 : 3
  },

  // initialize
  get 2() {
    const chunkLoadState = this.chunkLoadState;

    const STATE_REQUESTED = this.CHUNK_LOAD_STATE.REQUESTED;
    const STATE_LOADED = this.CHUNK_LOAD_STATE.LOADED;

    {
      const chunkRequestQueue = this.chunkRequestQueue;

      const len = chunkRequestQueue.length;
      let budget = this.maxRequestsPerTick;
      let cursorIndex = this.requestCursor;
      while ((cursorIndex < len) & (budget > 0)) {
        const requestEntry = chunkRequestQueue[cursorIndex];
        const chunkId = requestEntry[0];

        if (api.getBlockId(requestEntry[1], requestEntry[2], requestEntry[3]) === 1) {
          chunkLoadState[chunkId] = STATE_REQUESTED;
        } else {
          chunkLoadState[chunkId] = STATE_LOADED;
          if (cursorIndex === this.requestCursor) {
            this.requestCursor++;
          }
        }

        budget--;
        cursorIndex++;
      }
    }

    {
      const blocks = this.blocks;
      const maxErrorLogs = this.maxErrorLogs;

      const errors = this.errors;

      const len = blocks.length;
      let budget = this.maxEvalsPerTick;
      let cursorIndex = this.evalCursor;
      while ((cursorIndex < len) & (budget > 0)) {
        const block = blocks[cursorIndex];
        if (!block[4]) {
          cursorIndex = ++this.evalCursor;
          continue;
        }

        const x = block[0];
        const y = block[1];
        const z = block[2];
        const chunkId = ((x >> 5) + "|" + (y >> 5) + "|" + (z >> 5));

        if (chunkLoadState[chunkId] !== STATE_LOADED) {
          break;
        }
        try {
          const code = api.getBlockData(x, y, z)?.persisted?.shared?.text;
          (0, eval)(code);
        } catch (e) {
          if (errors.length < maxErrorLogs) {
            errors[errors.length] = [x, y, z, e.name, e.message];
          }
        }

        cursorIndex = ++this.evalCursor;
        budget--;
      }
    }

    this.phase = 2 + (this.evalCursor >= this.blocks.length);
  },

  isBlockLocked(position) {
    const x = (position[0] | 0) - ((position[0] < (position[0] | 0)) & 1); // Math.floor(x)
    const y = (position[1] | 0) - ((position[1] < (position[1] | 0)) & 1); // Math.floor(y)
    const z = (position[2] | 0) - ((position[2] < (position[2] | 0)) & 1); // Math.floor(z)
    const blockId = (x + "|" + y + "|" + z);
    const blockLockedStatus = this.blockLockedStatus[blockId];
    return !!(!this.boot_manager.isRunning & [!!blockLockedStatus, true][+(blockLockedStatus === undefined)]);
  },
};

const BootManager = {
  event_manager: null,
  interruption_manager: null,
  tick_multiplexer: null,
  join_manager: null,
  block_manager: null,

  bootDelayTicks: 0,
  showLoadTime: true,
  showErrors: true,
  logStyle: null,

  phase: -1,
  tickCount: -1,
  loadTimeTicks: -1,

  isPrimaryBoot: true,
  isRunning: false,

  tick() {
    BootManager.tickCount++;
    BootManager[BootManager.phase];
  },

  // ensure primary setup
  get 12() {
    if (this.isPrimaryBoot) {
      if ((!this.event_manager.isPrimarySetupDone) & (this.tickCount >= 10)) {
        const error = this.event_manager.primarySetupError;
        const logs = `Codeloader: EventManager: ${(error === null) ? "Undefined e" : "E"}rror on events primary setup${(error === null) ? "." : ` - ${error[0]}: ${error[1]}.`}`;
        const playerIds = api.getPlayerIds();
        for (const playerId of playerIds) {
          if (api.playerIsInGame(playerId)) {
            api.kickPlayer(playerId, logs);
          }
        }
      }
    }
  },

  // start boot
  get 1() {
    if (!this.isRunning) {
      this.tickCount = 0;

      const thisConfiguration = Configuration.boot_manager;
      const bootDelayTicks = ((thisConfiguration.boot_delay_ms | 0) * 0.02) | 0;
      this.bootDelayTicks = bootDelayTicks & ~(bootDelayTicks >> 31); // bootDelayTicks > 0 ? bootDelayTicks : 0
      this.showLoadTime = !!thisConfiguration.show_load_time;
      this.showErrors = !!thisConfiguration.show_errors;
      this.logStyle = {
        error: Object.assign({}, Configuration.LOG_STYLE.error),
        warning: Object.assign({}, Configuration.LOG_STYLE.warning),
        success: Object.assign({}, Configuration.LOG_STYLE.success),
      };

      this.loadTimeTicks = -1;
      this.event_manager.established = false;
      this.interruption_manager.established = false;
      this.tick_multiplexer.established = false;
      this.join_manager.established = false;
      this.block_manager.established = false;

      this.isRunning = true;
      this.phase = 2;
      this[this.phase];
    }
  },

  // main boot process delay
  get 2() {
    this.phase = 2 + (this.tickCount >= this.bootDelayTicks);
    this[this.phase * (this.tickCount >= this.bootDelayTicks)];
  },

  // establish managers
  get 3() {
    this.event_manager.establish();
    this.interruption_manager.establish();
    this.tick_multiplexer.establish();
    this.join_manager.establish();
    this.block_manager.establish();
    this.phase = 4;
  },

  // setup events
  get 4() {
    let completed = 1;
    if (this.isPrimaryBoot) {
      completed &= this.event_manager.primaryInstall();
    }
    if (completed && this.event_manager.resetHandlers()) {
      this.phase = 5;
      this[this.phase];
    }
  },

  // seed data
  get 5() {
    let completed = 1;
    if (this.interruption_manager.isActive) {
      completed &= this.interruption_manager.seedEventRetryTicks();
    }
    if (this.event_manager.isEventActive.onPlayerJoin) {
      completed &= this.join_manager.seedFromOnlinePlayers();
    }
    this.phase = 5 + completed;
    this[this.phase * completed];
  },

  // install managers
  get 6() {
    if (this.event_manager.isEventActive.onPlayerJoin) {
      this.join_manager.install();
    }
    this.tick_multiplexer.install();
    this.phase = 7;
  },

  // start block initializer
  get 7() {
    this.tick_multiplexer.init = this.block_manager.main;
    this.phase = 8;
  },

  // start join dequeue
  get 8() {
    if (this.block_manager.phase === 3) {
      this.phase = 8 + (1 + !this.event_manager.isEventActive.onPlayerJoin);
      this[this.phase];
    }
  },

  // tick join dequeue
  get 9() {
    if (this.join_manager.dequeue()) {
      this.phase = 10;
      this[this.phase];
    }
  },

  // finish boot
  get 10() {
    if (this.event_manager.isEventActive.onPlayerJoin) {
      this.join_manager.finalize();
    }
    this.tick_multiplexer.finalize();
    this.block_manager.phase = -1;
    this.isPrimaryBoot = false;
    this.isRunning = false;
    this.phase = -1;

    this.loadTimeTicks = this.tickCount - this.bootDelayTicks + 1;
    this.logBootResult(this.showLoadTime, this.showErrors);
  },

  logBootResult(showLoadTime, showErrors) {
    const unregisteredActiveEvents = this.event_manager.unregisteredActiveEvents;
    if (unregisteredActiveEvents.length) {
      api.broadcastMessage([{
        str: `Codeloader: EventManager: Unregistered callbacks: ${unregisteredActiveEvents.join(", ")}.`,
        style: this.logStyle?.warning ?? {}
      }]);
    }
    if (showLoadTime) {
      this.logLoadTime(showErrors);
    }
    if (showErrors) {
      this.logErrors();
    }
  },

  logLoadTime(showErrors) {
    const loadTimeMs = this.loadTimeTicks * 50;
    const errorsCount = this.block_manager.errors.length;
    const logs = `Codeloader: BootManager: Code was loaded in ${loadTimeMs} ms` + [`.`, ` with ${errorsCount} error${errorsCount === 1 ? "" : "s"}.`][+(showErrors)];
    api.broadcastMessage([{
      str: logs,
      style: [this.logStyle?.success, this.logStyle?.warning][+(errorsCount > 0)] ?? {},
    }]);
  },

  logErrors() {
    const errors = this.block_manager.errors;
    if (errors.length > 0) {
      let logs = `Codeloader: BlockManager: Code evaluation error${errors.length === 1 ? "" : "s"}: `;
      for (const e of errors) {
        logs += `\n${e[3]} at (${e[0]}, ${e[1]}, ${e[2]}): ${e[4]} `;
      }
      api.broadcastMessage([{
        str: logs,
        style: this.logStyle?.error ?? {}
      }]);
    }
  },
};

const Codeloader = globalThis.Codeloader = {
  event_manager: null,
  interruption_manager: null,
  tick_multiplexer: null,
  join_manager: null,
  block_manager: null,
  boot_manager: null,

  configuration: null,

  get isRunning() {
    return this.boot_manager.isRunning;
  },

  setInterruptionState(eventName) {
    const eventIndex = this.interruption_manager.eventIndexByName[eventName];
    if (eventIndex === undefined) {
      if (this.event_manager.isEventActive[eventName]) {
        api.broadcastMessage([{
          str: `Codeloader: InterruptionManager: setInterruptionState - "${eventName}" interruption status is false.`,
          style: this.boot_manager.logStyle?.warning ?? {}
        }]);
      } else {
        api.broadcastMessage([{
          str: `Codeloader: InterruptionManager: setInterruptionState - "${eventName}" is invalid active event name.`,
          style: this.boot_manager.logStyle?.error ?? {}
        }]);
      }
      return;
    }
    this.interruption_manager.setInterruptionState(eventName);
  },

  isBlockLocked(position) {
    return (!Array.isArray(position) || position.length !== 3 || this.block_manager.isBlockLocked(position));
  },

  reboot() {
    if (!this.boot_manager.isRunning) {
      this.event_manager.delegator.tick = this.boot_manager.tick;
      this.boot_manager.phase = 1;
    } else {
      api.broadcastMessage([{
        str: `Codeloader: BootManager: Wait until current running boot session is finished.`,
        style: this.boot_manager.logStyle?.warning ?? {}
      }]);
    }
  },

  logBootResult(showLoadTime = true, showErrors = true) {
    this.boot_manager.logBootResult(showLoadTime, showErrors);
  },

  logLoadTime(showErrors = true) {
    this.boot_manager.logLoadTime(showErrors);
  },

  logErrors() {
    this.boot_manager.logErrors();
  },
};

EventManager.interruption_manager = InterruptionManager;
InterruptionManager.dispatcher.event_manager = EventManager;
InterruptionManager.dispatcher.boot_manager = BootManager;
TickMultiplexer.event_manager = EventManager;
TickMultiplexer.interruption_manager = InterruptionManager;
TickMultiplexer.boot_manager = BootManager;
JoinManager.event_manager = EventManager;
JoinManager.interruption_manager = InterruptionManager;
JoinManager.boot_manager = BootManager;
BlockManager.boot_manager = BootManager;
BootManager.event_manager = EventManager;
BootManager.interruption_manager = InterruptionManager;
BootManager.tick_multiplexer = TickMultiplexer;
BootManager.join_manager = JoinManager;
BootManager.block_manager = BlockManager;
Codeloader.configuration = Configuration;
Codeloader.event_manager = EventManager;
Codeloader.interruption_manager = InterruptionManager;
Codeloader.tick_multiplexer = TickMultiplexer;
Codeloader.join_manager = JoinManager;
Codeloader.block_manager = BlockManager;
Codeloader.boot_manager = BootManager;

{
  const delegator = EventManager.delegator = {};
  EventManager.primaryInstallCursor = 0;
  EventManager.isPrimarySetupDone = false;
  EventManager.isPrimaryInstallDone = false;

  BootManager.phase = 12;
  BootManager.isPrimaryBoot = true;
  BootManager.isRunning = false;
  BootManager.tickCount = 0;
  delegator.tick = BootManager.tick;
  globalThis.tick = function () {
    delegator.tick();
  };
}

try {
  EventManager.primarySetup();
  const toSeal = [
    Configuration,
    Configuration.boot_manager,
    Configuration.block_manager,
    Configuration.join_manager,
    Configuration.interruption_manager,
    Configuration.LOG_STYLE,
    EventManager,
    InterruptionManager,
    TickMultiplexer,
    JoinManager,
    BlockManager,
    BootManager,
  ];
  const toFreeze = [
    Configuration.ACTIVE_EVENTS,
    Configuration.EVENT_REGISTRY,
    Codeloader,
  ];
  toSeal.forEach(obj => {
    Object.seal(obj);
  });
  toFreeze.forEach(obj => {
    Object.freeze(obj);
  });
  EventManager.isPrimarySetupDone = true;
  BootManager.phase = 1;
} catch (e) {
  EventManager.primarySetupError = [e.name, e.message];
}

void 0;

