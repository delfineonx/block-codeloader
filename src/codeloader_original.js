// Copyright (c) 2025 delfineonx
// This product includes "Codeloader" created by delfineonx.
// Licensed under the Apache License, Version 2.0 (the "License").

const Configuration = Object.seal({
  // [eventName, ...]
  // [string, ...]
  ACTIVE_EVENTS: Object.freeze([
    // ...
  ]),

  // [[x, y, z, lockedStatus?, evalStatus?], ...]
  // [[number, number, number, boolean|null, boolean|null], ...]
  blocks: [
    // ...
  ],

  boot_manager: Object.seal({
    boot_delay_ms: 200,
    show_load_time: true,
    show_errors: true,
  }),
  block_manager: Object.seal({
    default_locked_status: true,
    default_eval_status: true,
    max_registrations_per_tick: 32,
    max_requests_per_tick: 8,
    max_evals_per_tick: 16,
    max_error_logs: 32,
  }),
  join_manager: Object.seal({
    reset_on_reboot: true,
    max_dequeue_per_tick: 8,
  }),
  interruption_manager: Object.seal({
    is_enabled: false,
    max_dequeue_per_tick: 16,
    default_retry_delay_ms: 0,
    default_retry_limit_ms: 50,
    default_retry_interval_ms: 0,
    default_retry_cooldown_ms: 500,
  }),

  // if event has special return value, then `interruptionStatus = false` setup is recommended
  // eventName -> [interruptionStatus?, delayMs?, limitMs?, intervalMs?, cooldownMs?]
  // string -> [boolean|null, number|null, number|null, number|null, number|null]
  EVENT_REGISTRY: Object.seal({
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
  }),

  LOG_STYLE: Object.seal({
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
  }),
});

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
      const isInterruptionManagerEnabled = !!Configuration.interruption_manager.is_enabled;
      const primaryEventRegistry = Configuration.EVENT_REGISTRY;
      const primaryActiveEvents = Configuration.ACTIVE_EVENTS;

      const NOOP = this.NOOP = function () { };
      const delegator = this.delegator;
      const activeEvents = this.activeEvents = [];
      const isEventActive = this.isEventActive = {};
      const unregisteredActiveEvents = this.unregisteredActiveEvents = [];

      const interruption_manager = this.interruption_manager;
      interruption_manager.NOOP = {};
      const eventIndexByName = interruption_manager.eventIndexByName = {};
      const eventDataByIndex = interruption_manager.eventDataByIndex = [];
      interruption_manager.defaultRetryTicks = new Int32Array(4);
      const eventRetryTicksByIndex = interruption_manager.eventRetryTicksByIndex = [];
      const dequeueStateMask = interruption_manager.dequeueStateMask = new Uint32Array(2);
      const iterationStateMask = interruption_manager.iterationStateMask = new Uint32Array(2);

      let interruptionEventIndex = 0;
      for (const eventName of primaryActiveEvents) {
        if (!Object.hasOwn(primaryEventRegistry, eventName)) {
          unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
          continue;
        }
        activeEvents[activeEvents.length] = eventName;
        isEventActive[eventName] = true;
        if (eventName !== "tick") {
          if (!Array.isArray(primaryEventRegistry[eventName])) {
            primaryEventRegistry[eventName] = [];
          }
          const interruptionStatus = primaryEventRegistry[eventName][0] = !!primaryEventRegistry[eventName][0];
          if (isInterruptionManagerEnabled && interruptionStatus) {
            interruption_manager.isActive = true;
            const eventIndex = interruptionEventIndex;
            eventIndexByName[eventName] = eventIndex;
            eventRetryTicksByIndex[eventIndex] = new Int32Array(6);
            const eventData = eventDataByIndex[eventIndex] = [eventName, -1, new Array(9)];
            const args = eventData[2];
            delegator[eventName] = interruption_manager.NOOP[eventName] = function () { interruption_manager.setInterruptionState(eventIndex); };
            globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              iterationStateMask[eventIndex >> 5] |= dequeueStateMask[eventIndex >> 5] |= (1 << (eventIndex & 31));
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
      this.isPrimarySetupDone = true;
    }
  },

  primaryInstall() {
    if (!this.isPrimaryInstallDone) {
      const interruptionNOOP = this.interruption_manager.NOOP;

      const NOOP = this.NOOP;
      const delegator = this.delegator;
      const activeEvents = this.activeEvents;

      const len = activeEvents.length;
      let cursorIndex = this.primaryInstallCursor;
      while (cursorIndex < len) {
        const eventName = activeEvents[cursorIndex];
        const _NOOP = interruptionNOOP[eventName] ?? NOOP;
        Object.defineProperty(globalThis, eventName, {
          configurable: true,
          set: (fn) => { delegator[eventName] = (typeof fn === "function") ? fn : _NOOP; }
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
    const interruptionNOOP = this.interruption_manager.NOOP;

    const NOOP = this.NOOP;
    const delegator = this.delegator;
    const activeEvents = this.activeEvents;

    const len = activeEvents.length;
    let cursorIndex = this.resetCursor;
    while (cursorIndex < len) {
      const eventName = activeEvents[cursorIndex];
      if (eventName !== "tick") {
        delegator[eventName] = interruptionNOOP[eventName] ?? NOOP;
      }
      cursorIndex = ++this.resetCursor;
    }
    return (cursorIndex >= len);
  },
};

const InterruptionManager = {
  event_manager: null,
  boot_manager: null,
  
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

  RETRY_INDEX: {
    COUNTER: 0,
    COOLDOWN_TIMESTAMP: 1,
    DELAY: 2,
    LIMIT: 3,
    INTERVAL: 4,
    COOLDOWN: 5,
    OFFSET_EVENT_REGISTRY: -1,
    OFFSET_DEFAULT_RETRY_TICKS: -2,
  },
  DATA_INDEX: {
    EVENT_NAME: 0,
    TICK_TIMESTAMP: 1,
    ARGUMENTS: 2,
  },

  establish() {
    if (!this.established) {
      this.eventRegistry = Configuration.EVENT_REGISTRY;
      const thisConfiguration = Configuration.interruption_manager;
      const defaultRetryTicks = this.defaultRetryTicks;
      const RETRY_INDEX = this.RETRY_INDEX;
      const OFFSET = RETRY_INDEX.OFFSET_DEFAULT_RETRY_TICKS;
      const delayTicks = ((thisConfiguration.default_retry_delay_ms | 0) * 0.02) | 0;
      defaultRetryTicks[RETRY_INDEX.DELAY + OFFSET] = delayTicks & ~(delayTicks >> 31); // delayTicks > 0 ? delayTicks : 0
      const limitTicks = ((thisConfiguration.default_retry_limit_ms | 0) * 0.02) | 0;
      defaultRetryTicks[RETRY_INDEX.LIMIT + OFFSET] = limitTicks & ~(limitTicks >> 31); // limitTicks > 0 ? limitTicks : 0
      const intervalTicks = ((thisConfiguration.default_retry_interval_ms | 0) * 0.02) | 0;
      defaultRetryTicks[RETRY_INDEX.INTERVAL + OFFSET] = intervalTicks & ~(intervalTicks >> 31); // intervalTicks > 0 ? intervalTicks : 0
      const cooldownTicks = ((thisConfiguration.default_retry_cooldown_ms | 0) * 0.02) | 0;
      defaultRetryTicks[RETRY_INDEX.COOLDOWN + OFFSET] = (cooldownTicks & ~(cooldownTicks >> 31)) + (-cooldownTicks >> 31) + 1; // cooldownTicks > 0 ? cooldownTicks : 1
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
    const eventDataByIndex = this.eventDataByIndex;

    const eventRegistry = this.eventRegistry;
    const defaultRetryTicks = this.defaultRetryTicks;

    const eventRetryTicksByIndex = this.eventRetryTicksByIndex;

    const RETRY_INDEX = this.RETRY_INDEX;
    const COUNTER = RETRY_INDEX.COUNTER,
      COOLDOWN_TIMESTAMP = RETRY_INDEX.COOLDOWN_TIMESTAMP,
      DELAY = RETRY_INDEX.DELAY,
      LIMIT = RETRY_INDEX.LIMIT,
      INTERVAL = RETRY_INDEX.INTERVAL,
      COOLDOWN = RETRY_INDEX.COOLDOWN,
      OFFSET_EVENT_REGISTRY = RETRY_INDEX.OFFSET_EVENT_REGISTRY,
      OFFSET_DEFAULT_RETRY_TICKS = RETRY_INDEX.OFFSET_DEFAULT_RETRY_TICKS;
    const EVENT_NAME = this.DATA_INDEX.EVENT_NAME;

    const len = eventRetryTicksByIndex.length;
    let cursorIndex = this.seedCursor;
    while (cursorIndex < len) {
      const eventName = eventDataByIndex[cursorIndex][EVENT_NAME];
      const registryEntry = eventRegistry[eventName];
      const retryEntry = eventRetryTicksByIndex[cursorIndex];

      retryEntry[COUNTER] = 0;
      retryEntry[COOLDOWN_TIMESTAMP] = 0;

      const delayMs = registryEntry[DELAY + OFFSET_EVENT_REGISTRY];
      if (delayMs === undefined || delayMs === null) {
        retryEntry[DELAY] = defaultRetryTicks[DELAY + OFFSET_DEFAULT_RETRY_TICKS];
      } else {
        const delayTicks = ((delayMs | 0) * 0.02) | 0;
        retryEntry[DELAY] = delayTicks & ~(delayTicks >> 31); // delayTicks > 0 ? delayTicks : 0
      }

      const limitMs = registryEntry[LIMIT + OFFSET_EVENT_REGISTRY];
      if (limitMs === undefined || limitMs === null) {
        retryEntry[LIMIT] = defaultRetryTicks[LIMIT + OFFSET_DEFAULT_RETRY_TICKS];
      } else {
        const limitTicks = ((limitMs | 0) * 0.02) | 0;
        retryEntry[LIMIT] = limitTicks & ~(limitTicks >> 31); // limitTicks > 0 ? limitTicks : 0
      }

      const intervalMs = registryEntry[INTERVAL + OFFSET_EVENT_REGISTRY];
      if (intervalMs === undefined || intervalMs === null) {
        retryEntry[INTERVAL] = defaultRetryTicks[INTERVAL + OFFSET_DEFAULT_RETRY_TICKS];
      } else {
        const intervalTicks = ((intervalMs | 0) * 0.02) | 0;
        retryEntry[INTERVAL] = intervalTicks & ~(intervalTicks >> 31); // intervalTicks > 0 ? intervalTicks : 0
      }

      const cooldownMs = registryEntry[COOLDOWN + OFFSET_EVENT_REGISTRY];
      if (cooldownMs === undefined || cooldownMs === null) {
        retryEntry[COOLDOWN] = defaultRetryTicks[COOLDOWN + OFFSET_DEFAULT_RETRY_TICKS];
      } else {
        const cooldownTicks = ((cooldownMs | 0) * 0.02) | 0;
        retryEntry[COOLDOWN] = (cooldownTicks & ~(cooldownTicks >> 31)) + (-cooldownTicks >> 31) + 1; // cooldownTicks > 0 ? cooldownTicks : 1
      }

      cursorIndex = ++this.seedCursor;
    }
    return (cursorIndex >= len);
  },

  setInterruptionState(eventIndex) {
    this.dequeueStateMask[eventIndex >> 5] &= ~(1 << (eventIndex & 31));
    this.iterationStateMask[eventIndex >> 5] &= ~(1 << (eventIndex & 31));
  },

  dequeue() {
    const dequeueStateMask = this.dequeueStateMask;
    if (!dequeueStateMask[0] && !dequeueStateMask[1]) {
      return;
    }

    const eventDataByIndex = this.eventDataByIndex;

    const tickCount = this.tickCount;
    const eventRetryTicksByIndex = this.eventRetryTicksByIndex;
    const iterationStateMask = this.iterationStateMask;

    const RETRY_INDEX = this.RETRY_INDEX;
    const COUNTER = RETRY_INDEX.COUNTER,
      COOLDOWN_TIMESTAMP = RETRY_INDEX.COOLDOWN_TIMESTAMP,
      DELAY = RETRY_INDEX.DELAY,
      LIMIT = RETRY_INDEX.LIMIT,
      INTERVAL = RETRY_INDEX.INTERVAL,
      COOLDOWN = RETRY_INDEX.COOLDOWN;
    const DATA_INDEX = this.DATA_INDEX;
    const EVENT_NAME = DATA_INDEX.EVENT_NAME,
      TICK_TIMESTAMP = DATA_INDEX.TICK_TIMESTAMP,
      ARGUMENTS = DATA_INDEX.ARGUMENTS;

    let budget = this.maxDequeuePerTick;
    let wordIndex = 0;
    while (wordIndex < 2) {
      iterationStateMask[wordIndex] |= dequeueStateMask[wordIndex];
      while (iterationStateMask[wordIndex] && budget > 0) {
        const lsb = iterationStateMask[wordIndex] & -iterationStateMask[wordIndex];
        const eventIndex = (wordIndex << 5) | (31 - Math.clz32(lsb));
        const eventData = eventDataByIndex[eventIndex];
        const eventRetry = eventRetryTicksByIndex[eventIndex];

        if (tickCount - eventData[TICK_TIMESTAMP] <= eventRetry[DELAY]) {
          iterationStateMask[wordIndex] &= ~lsb;
          continue;
        }

        if (eventRetry[COOLDOWN_TIMESTAMP] >= tickCount) {
          dequeueStateMask[wordIndex] &= ~lsb;
          iterationStateMask[wordIndex] &= ~lsb;
          continue;
        }

        if (eventRetry[COUNTER] >= eventRetry[LIMIT]) {
          const interruptedRetryTicks = ((eventRetry[LIMIT] + eventRetry[INTERVAL]) / (eventRetry[INTERVAL] + 1)) | 0; // Math.ceil(limit / (interval + 1))
          if (interruptedRetryTicks > 1) {
            api.broadcastMessage([{
              str: `Codeloader: InterruptionManager: "${eventData[EVENT_NAME]}" has been dropped after ${interruptedRetryTicks} consecutive interrupted retry ticks.`,
              style: this.boot_manager.logStyle?.error ?? {}
            }]);
          }
          const args = eventData[ARGUMENTS];
          args[0] = args[1] = args[2] = args[3] = args[4] = args[5] = args[6] = args[7] = args[8] = undefined;
          eventRetry[COUNTER] = 0;
          eventRetry[COOLDOWN_TIMESTAMP] = tickCount + eventRetry[COOLDOWN];
          dequeueStateMask[wordIndex] &= ~lsb;
          iterationStateMask[wordIndex] &= ~lsb;
          continue;
        }

        if (!(eventRetry[COUNTER] % (eventRetry[INTERVAL] + 1))) {
          eventRetry[COUNTER]++;
          const args = eventData[ARGUMENTS];
          if (args) {
            this.event_manager.delegator[eventData[EVENT_NAME]].apply(null, args);
            args[0] = args[1] = args[2] = args[3] = args[4] = args[5] = args[6] = args[7] = args[8] = undefined;
          }
          eventRetry[COUNTER] = 0;
          budget--;
          continue
        }

        eventRetry[COUNTER]++;
        iterationStateMask[wordIndex] &= ~lsb;
      }
      wordIndex++;
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
        set: (fn) => { this.main = (typeof fn === "function") ? fn : NOOP; }
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
          set: (fn) => { delegator.tick = (typeof fn === "function") ? fn : NOOP; }
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
      if (this.resetOnReboot || !this.joinState) {
        this.joinState = {};
      }
      this.dequeueCursor = 0;

      this.installed = false;
      this.finalized = false;
      this.established = true;
    }
  },

  seedFromOnlinePlayers() {
    if (this.resetOnReboot || this.boot_manager.isPrimaryBoot) {
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
      const NOOP = this.interruption_manager.NOOP.onPlayerJoin ?? this.event_manager.NOOP;
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: (fn) => { this.main = (typeof fn === "function") ? fn : NOOP; }
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
    while (cursorIndex < buffer.length && budget > 0) {
      const args = buffer[cursorIndex];
      const playerId = args[0];
      const fromGameReset = args[1];
      if (joinState[playerId] !== STATE_PROCESSED) {
        main(playerId, fromGameReset);
        joinState[playerId] = STATE_PROCESSED;
        budget--;
      }
      cursorIndex = ++this.dequeueCursor;
    }
    return (cursorIndex >= buffer.length);
  },
  
  finalize() {
    if (!this.finalized) {
      const NOOP = this.interruption_manager.NOOP.onPlayerJoin ?? this.event_manager.NOOP;
      const delegator = this.event_manager.delegator;
      delegator.onPlayerJoin = this.main;
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: (fn) => { delegator.onPlayerJoin = (typeof fn === "function") ? fn : NOOP; }
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
  evalFn: (0, eval),

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

      this.phase = 0;
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
    if (BlockManager.phase === 0) {
      return BlockManager._register();
    }
    if (BlockManager.phase === 1) {
      BlockManager._initialize();
    }
  },

  _register() {
    const blocks = this.blocks;
    const defaultLockedStatus = this.defaultLockedStatus;
    const defaultEvalStatus = this.defaultEvalStatus;

    const blockLockedStatus = this.blockLockedStatus;
    const chunkLoadState = this.chunkLoadState;
    const chunkRequestQueue = this.chunkRequestQueue;

    const len = blocks.length;
    let budget = this.maxRegistrationsPerTick;
    let cursorIndex = this.registerCursor;
    while (cursorIndex < len && budget > 0) {
      const block = blocks[cursorIndex] = blocks[cursorIndex].slice();
      const x = block[0] = (block[0] | 0) - ((block[0] < (block[0] | 0)) & 1); // Math.floor(x)
      const y = block[1] = (block[1] | 0) - ((block[1] < (block[1] | 0)) & 1); // Math.floor(y)
      const z = block[2] = (block[2] | 0) - ((block[2] < (block[2] | 0)) & 1); // Math.floor(z)

      const blockId = (x + "|" + y + "|" + z);

      if (block[3] === undefined || block[3] === null) {
        blockLockedStatus[blockId] = block[3] = defaultLockedStatus;
      } else {
        blockLockedStatus[blockId] = block[3] = !!block[3];
      }

      let blockEvalStatus = true;
      if (block[4] === undefined || block[4] === null) {
        blockEvalStatus = block[4] = defaultEvalStatus;
      } else {
        blockEvalStatus = block[4] = !!block[4];
      }

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
    if (cursorIndex >= len) {
      this.phase = !(this.hasAnyEvalBlocks) + 1; // hasAnyEvalBlocks === true ? 1 : 2
    }
  },

  _initialize() {
    const chunkLoadState = this.chunkLoadState;

    const STATE_REQUESTED = this.CHUNK_LOAD_STATE.REQUESTED;
    const STATE_LOADED = this.CHUNK_LOAD_STATE.LOADED;
    
    {
      const chunkRequestQueue = this.chunkRequestQueue;

      const len = chunkRequestQueue.length;
      let budget = this.maxRequestsPerTick;
      let cursorIndex = this.requestCursor;
      while (cursorIndex < len && budget > 0) {
        const requestEntry = chunkRequestQueue[cursorIndex];
        const chunkId = requestEntry[0];

        if (chunkLoadState[chunkId] === STATE_REQUESTED) {
          if (api.isBlockInLoadedChunk(requestEntry[1], requestEntry[2], requestEntry[3])) {
            chunkLoadState[chunkId] = STATE_LOADED;
            if (cursorIndex === this.requestCursor) {
              this.requestCursor++;
            }
          }
        } else if (api.getBlockId(requestEntry[1], requestEntry[2], requestEntry[3]) === 1) {
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

      const evalFn = this.evalFn;

      const len = blocks.length;
      let budget = this.maxEvalsPerTick;
      let cursorIndex = this.evalCursor;
      while (cursorIndex < len && budget > 0) {
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
          evalFn(code);
        } catch (e) {
          if (errors.length < maxErrorLogs) {
            errors[errors.length] = [x, y, z, e.name, e.message];
          }
        }

        cursorIndex = ++this.evalCursor;
        budget--;
      }
    }

    if (this.evalCursor >= this.blocks.length) {
      this.phase = 2;
    }
  },

  isBlockLocked(position) {
    const x = (position[0] | 0) - ((position[0] < (position[0] | 0)) & 1); // Math.floor(x)
    const y = (position[1] | 0) - ((position[1] < (position[1] | 0)) & 1); // Math.floor(y)
    const z = (position[2] | 0) - ((position[2] < (position[2] | 0)) & 1); // Math.floor(z)
    const blockId = (x + "|" + y + "|" + z);
    return (!this.boot_manager.isRunning && !!(this.blockLockedStatus[blockId] ?? true));
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
    const self = BootManager;
    self.tickCount++;
    if (self.phase === -1) {
      return self._ensurePrimarySetup();
    }
    if (self.phase === 0) {
      self._startBoot();
    }
    if (self.phase === 1) {
      self._delay();
    }
    if (self.phase === 2) {
      return self._establish();
    }
    if (self.phase === 3) {
      self._setupEvents();
    }
    if (self.phase === 4) {
      self._seed();
    }
    if (self.phase === 5) {
      return self._install();
    }
    if (self.phase === 6) {
      self._startInitializer();
    }
    if (self.phase === 7) {
      self._startJoinDequeue();
    }
    if (self.phase === 8) {
      self._tickJoinDequeue();
    }
    if (self.phase === 9) {
      self._finishBoot();
    }
  },

  _ensurePrimarySetup() {
    if (this.isPrimaryBoot) {
      if (!this.event_manager.isPrimarySetupDone && this.tickCount >= 10) {
        const error = this.event_manager.primarySetupError;
        const logs = `Codeloader: EventManager: ${(error === null) ? "Uncaught e" : "E"}rror on events primary setup${(error === null) ? "." : ` - ${error[0]}: ${error[1]}.`}`;
        const playerIds = api.getPlayerIds();
        for (const playerId of playerIds) {
          api.kickPlayer(playerId, logs);
        }
      }
    }
  },

  _startBoot() {
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
      this.phase = 1;
    }
  },

  _delay() {
    if (this.tickCount >= this.bootDelayTicks) {
      this.phase = 2;
    }
  },

  _establish() {
    this.event_manager.establish();
    this.interruption_manager.establish();
    this.tick_multiplexer.establish();
    this.join_manager.establish();
    this.block_manager.establish();
    this.phase = 3;
  },
  
  _setupEvents() {
    let completed = 1;
    if (this.isPrimaryBoot) {
      completed &= this.event_manager.primaryInstall();
    }
    if (completed && this.event_manager.resetHandlers()) {
      this.phase = 4
    }
  },

  _seed() {
    let completed = 1;
    if (this.interruption_manager.isActive) {
      completed &= this.interruption_manager.seedEventRetryTicks();
    }
    if (this.event_manager.isEventActive.onPlayerJoin) {
      completed &= this.join_manager.seedFromOnlinePlayers();
    }
    if (completed) {
      this.phase = 5;
    }
  },

  _install() {
    if (this.event_manager.isEventActive.onPlayerJoin) {
      this.join_manager.install();
    }
    this.tick_multiplexer.install();
    this.phase = 6;
  },

  _startInitializer() {
    this.tick_multiplexer.init = this.block_manager.main;
    this.phase = 7;
  },

  _startJoinDequeue() {
    if (this.block_manager.phase === 2) {
      if (this.event_manager.isEventActive.onPlayerJoin && this.join_manager.installed) {
        this.phase = 8;
      } else {
        this.phase = 9;
      }
    }
  },

  _tickJoinDequeue() {
    if (this.join_manager.dequeue()) {
      this.phase = 9;
    }
  },

  _finishBoot() {
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
    let logs = `Codeloader: BootManager: Code was loaded in ${loadTimeMs} ms`;
    if (showErrors) {
      logs += ` with ${errorsCount} error${errorsCount === 1 ? "" : "s"}.`
    } else {
      logs += ".";
    }

    api.broadcastMessage([{
      str: logs,
      style: (errorsCount > 0 ? this.logStyle?.warning : this.logStyle?.success) ?? {},
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

globalThis.Codeloader = Object.freeze({
  get configuration() {
    return Configuration;
  },

  get isRunning() {
    return BootManager.isRunning;
  },

  get errors() {
    return BlockManager.errors.slice();
  },

  setInterruptionState(eventName) {
    const eventIndex = InterruptionManager.eventIndexByName[eventName];
    if (eventIndex === undefined) {
      if (EventManager.isEventActive[eventName]) {
        api.broadcastMessage([{
          str: `Codeloader: InterruptionManager: setInterruptionState - "${eventName}" interruption status is false.`,
          style: BootManager.logStyle?.warning ?? {}
        }]);
      } else {
        api.broadcastMessage([{
          str: `Codeloader: InterruptionManager: setInterruptionState - "${eventName}" is invalid active event name.`,
          style: BootManager.logStyle?.error ?? {}
        }]);
      }
      return;
    }
    InterruptionManager.setInterruptionState(eventIndex);
  },

  isBlockLocked(position) {
    return (!Array.isArray(position) || position.length !== 3 || BlockManager.isBlockLocked(position));
  },

  reboot() {
    if (!BootManager.isRunning) {
      EventManager.delegator.tick = BootManager.tick;
      BootManager.phase = 0;
    } else {
      api.broadcastMessage([{
        str: `Codeloader: BootManager: Wait until current running boot session is finished.`,
        style: BootManager.logStyle?.warning ?? {}
      }]);
    }
  },

  logBootResult(showLoadTime = true, showErrors = true) {
    BootManager.logBootResult(showLoadTime, showErrors);
  },

  logLoadTime(showErrors = true) {
    BootManager.logLoadTime(showErrors);
  },

  logErrors() {
    BootManager.logErrors();
  },
});

EventManager.interruption_manager = InterruptionManager;
InterruptionManager.event_manager = EventManager;
InterruptionManager.boot_manager = BootManager;
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

{
  const delegator = EventManager.delegator = {};
  EventManager.primaryInstallCursor = 0;
  EventManager.isPrimarySetupDone = false;
  EventManager.isPrimaryInstallDone = false;

  BootManager.phase = -1;
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
  BootManager.phase = 0;
} catch (e) {
  EventManager.primarySetupError = [e.name, e.message];
}

void 0;
