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
    boot_delay_ms: 200, // basic
    show_load_time: true, // basic
    show_errors: true, // basic
  }),
  join_queue: Object.seal({
    reset_on_reboot: true, // basic
    max_dequeue_per_tick: 8,
  }),
  block_initializer: Object.seal({
    default_locked_status: true, // basic
    default_eval_status: true,
    max_registrations_per_tick: 32,
    max_evals_per_tick: 16,
    max_error_logs: 32,
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
    "onChunkLoaded": [false],
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

const TickMultiplexer = {
  boot_manager: null,
  interruption_manager: null,
  boot: null,
  init: null,
  main: null,
  started: false,
  installed: false,
  finalized: false,

  start() {
    if (!this.started) {
      this.boot = this.boot_manager.NOOP;
      this.init = this.boot_manager.NOOP;
      this.main = this.boot_manager.NOOP;
      this.installed = false;
      this.finalized = false;
      this.started = true;
    }
  },

  dispatch() {
    const self = TickMultiplexer;
    self.boot();
    self.init();
    self.main();
  },

  interruptionTick() {
    const self = TickMultiplexer;
    self.interruption_manager.tickCount++;
    self.main();
    self.interruption_manager.dequeue();
  },

  install() {
    if (!this.installed) {
      this.main = globalThis._tick;
      const self = this;
      Object.defineProperty(globalThis, "_tick", {
        configurable: true,
        get() { return self.dispatch; },
        set(fn) { self.main = (typeof fn === "function") ? fn : self.boot_manager.NOOP; }
      });
      this.boot = this.main;
      this.main = this.boot_manager.NOOP;
      this.installed = true;
    }
  },

  finalize() {
    if (!this.finalized) {
      if (this.interruption_manager.isActive) {
        Object.defineProperty(globalThis, "_tick", {
          value: this.interruptionTick,
          writable: true,
          configurable: true
        });
      } else {
        Object.defineProperty(globalThis, "_tick", {
          value: this.main,
          writable: true,
          configurable: true
        });
      }
      this.boot = this.boot_manager.NOOP;
      this.init = this.boot_manager.NOOP;
      this.finalized = true;
    }
  },
};

const ChunkMultiplexer = {
  boot_manager: null,
  interruption_manager: null,
  init: null,
  main: null,
  started: false,
  installed: false,
  finalized: false,

  start() {
    if (!this.started) {
      this.init = this.boot_manager.NOOP;
      this.main = this.boot_manager.NOOP;
      this.installed = false;
      this.finalized = false;
      this.started = true;
    }
  },

  dispatch(chunkId, chunk, wasPersistedChunk) {
    const self = ChunkMultiplexer;
    self.init(chunkId);
    return self.main(chunkId, chunk, wasPersistedChunk);
  },

  install() {
    if (!this.installed) {
      const self = this;
      const NOOP = this.interruption_manager.NOOP.onChunkLoaded ?? this.boot_manager.NOOP;
      Object.defineProperty(globalThis, "_onChunkLoaded", {
        configurable: true,
        get() { return self.dispatch; },
        set(fn) { self.main = (typeof fn === "function") ? fn : NOOP; }
      });
      this.installed = true;
    }
  },

  finalize() {
    if (!this.finalized) {
      Object.defineProperty(globalThis, "_onChunkLoaded", {
        value: this.main,
        writable: true,
        configurable: true
      });
      this.init = this.boot_manager.NOOP;
      this.finalized = true;
    }
  }
};

const JoinQueue = {
  boot_manager: null,
  interruption_manager: null,
  main: null,
  started: false,
  installed: false,
  finalized: false,

  resetOnReboot: true,
  maxDequeuePerTick: 1,

  buffer: null, // [[playerId, fromGameReset], ...]
  joinState: null, // playerId -> 0/1/2
  dequeueCursor: 0,

  JOIN_STATE: {
    NONE: 0,
    ENQUEUED: 1,
    PROCESSED: 2,
  },

  start() {
    if (!this.started) {
      this.main = this.boot_manager.NOOP;

      const thisConfiguration = Configuration.join_queue;
      this.resetOnReboot = !!thisConfiguration.reset_on_reboot;
      const maxDequeuePerTick = thisConfiguration.max_dequeue_per_tick | 0;
      this.maxDequeuePerTick = (maxDequeuePerTick & ~(maxDequeuePerTick >> 31)) + (-maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1

      this.buffer = [];
      if (this.resetOnReboot) {
        this.joinState = {};
      } else if (!this.joinState) {
        this.joinState = {};
      }
      this.dequeueCursor = 0;
      this.installed = false;
      this.finalized = false;
      this.started = true;
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
    const self = JoinQueue;
    self.buffer[self.buffer.length] = [playerId, fromGameReset];
    self.joinState[playerId] = self.JOIN_STATE.ENQUEUED;
  },

  install() {
    if (!this.installed) {
      const self = this;
      const NOOP = this.interruption_manager.NOOP.onPlayerJoin ?? this.boot_manager.NOOP;
      Object.defineProperty(globalThis, "_onPlayerJoin", {
        configurable: true,
        get() { return self.dispatch; },
        set(fn) { self.main = (typeof fn === "function") ? fn : NOOP; }
      });
      this.installed = true;
    }
  },

  dequeueStep() {
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
      Object.defineProperty(globalThis, "_onPlayerJoin", {
        value: this.main,
        writable: true,
        configurable: true
      });
      this.finalized = true;
    }
  },
};

const BlockInitializer = {
  boot_manager: null,
  started: false,

  blocks: null, // [[x, y, z, lockedStatus?, evalStatus?], ...]
  defaultLockedStatus: true,
  defaultEvalStatus: true,
  maxRegistrationsPerTick: 1,
  maxEvalsPerTick: 1,
  maxErrorLogs: 0,

  phase: -1,
  blockLockedStatus: null, // cellIndex -> blockIndex -> false/true
  blockToChunkId: null, // [chunkId, ...]
  chunkLoadState: null, // chunkId -> 0/1/2/3
  errors: null, // [[x, y, z, error.name, error.message], ...]
  seedCursor: 0,
  mainCursor: 0,
  lastIndex: -1,
  statistics: {
    requested: 0,
    evented: 0,
    evaled: 0
  },

  COORDINATES_RANGE_BITS: 19, // -2^19 .. 2^19-1
  CELL_AXIS_BITS: 5, // cells (or "chunks") of (2^5)^3 blocks
  CHUNK_LOAD_STATE: {
    UNLOADED: 0,
    REQUESTED: 1,
    EVENTED: 2,
    LOADED: 3
  },
  evalFn: (0, eval),

  start() {
    if (!this.started) {
      this.blocks = Array.isArray(Configuration.blocks) ? Configuration.blocks.slice() : [];
      const thisConfiguration = Configuration.block_initializer;
      this.defaultLockedStatus = !!thisConfiguration.default_locked_status;
      this.defaultEvalStatus = !!thisConfiguration.default_eval_status;
      const maxRegistrationsPerTick = thisConfiguration.max_registrations_per_tick | 0;
      this.maxRegistrationsPerTick = (maxRegistrationsPerTick & ~(maxRegistrationsPerTick >> 31)) + (-maxRegistrationsPerTick >> 31) + 1; // maxRegistrationsPerTick > 0 ? maxRegistrationsPerTick : 1
      const maxEvalsPerTick = thisConfiguration.max_evals_per_tick | 0;
      this.maxEvalsPerTick = (maxEvalsPerTick & ~(maxEvalsPerTick >> 31)) + (-maxEvalsPerTick >> 31) + 1; // maxEvalsPerTick > 0 ? maxEvalsPerTick : 1
      const maxErrorLogs = thisConfiguration.max_error_logs | 0;
      this.maxErrorLogs = maxErrorLogs & ~(maxErrorLogs >> 31); // maxErrorLogs > 0 ? maxErrorLogs : 0

      this.phase = 0;
      this.blockLockedStatus = {};
      this.blockToChunkId = new Array(this.blocks.length);
      this.chunkLoadState = {};
      this.errors = [];
      this.seedCursor = 0;
      this.mainCursor = 0;
      this.lastIndex = this.blocks.length - 1;
      this.statistics.requested = 0;
      this.statistics.evented = 0;
      this.statistics.evaled = 0;
      this.started = true;
    }
  },

  step() {
    if (this.phase === 0) {
      return this._seed();
    }
    if (this.phase === 1) {
      this._main();
    }
  },

  _seed() {
    const blocks = this.blocks;
    const defaultLockedStatus = this.defaultLockedStatus;
    const defaultEvalStatus = this.defaultEvalStatus;

    const blockLockedStatus = this.blockLockedStatus;
    const blockToChunkId = this.blockToChunkId;
    const chunkLoadState = this.chunkLoadState;
    const lastIndex = this.lastIndex;

    const COORDINATES_RANGE_BITS = this.COORDINATES_RANGE_BITS;
    const CELL_AXIS_BITS = this.CELL_AXIS_BITS;
    const CELL_INDEX_BITS = COORDINATES_RANGE_BITS - CELL_AXIS_BITS;

    /*
    const COORDINATES_RANGE_BITS = this.COORDINATES_RANGE_BITS;
    const CELL_AXIS_BITS = this.CELL_AXIS_BITS;
    const CELL_MASK = (1 << CELL_AXIS_BITS) - 1; // 0b11111
    const CELL_INDEX_BITS = COORDINATES_RANGE_BITS - CELL_AXIS_BITS; // 14 (±2^14 cell indexes)
    const PACK_BASE = 1 << (CELL_INDEX_BITS + 1); // 32768 (2^15)
    const PACK_OFFSET = 1 << CELL_INDEX_BITS; // 16384 (2^14)
    const INDEX_SHIFT_Y = CELL_AXIS_BITS; // 5
    const INDEX_SHIFT_X = CELL_AXIS_BITS * 2; // 10

    const cellX = x >> CELL_AXIS_BITS;
    const cellY = y >> CELL_AXIS_BITS;
    const cellZ = z >> CELL_AXIS_BITS;
    const cellIndex = ((cellX + PACK_OFFSET) * PACK_BASE + (cellY + PACK_OFFSET)) * PACK_BASE + (cellZ + PACK_OFFSET);
    const blockIndex = ((x & CELL_MASK) << INDEX_SHIFT_X) | ((y & CELL_MASK) << INDEX_SHIFT_Y) | (z & CELL_MASK);
    */

    let budget = this.maxRegistrationsPerTick;
    let cursorIndex = this.seedCursor;
    while (cursorIndex <= lastIndex && budget > 0) {
      const block = blocks[cursorIndex] = blocks[cursorIndex].slice();
      const x = block[0] = (block[0] | 0) - ((block[0] < (block[0] | 0)) & 1); // Math.floor(x)
      const y = block[1] = (block[1] | 0) - ((block[1] < (block[1] | 0)) & 1); // Math.floor(y)
      const z = block[2] = (block[2] | 0) - ((block[2] < (block[2] | 0)) & 1); // Math.floor(z)

      const cellIndex = (((x >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS)) * (1 << (CELL_INDEX_BITS + 1)) + ((y >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS))) * (1 << (CELL_INDEX_BITS + 1)) + ((z >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS));
      let cell = blockLockedStatus[cellIndex];
      if (!cell) {
        cell = blockLockedStatus[cellIndex] = {};
      }
      const blockIndex = ((x & ((1 << CELL_AXIS_BITS) - 1)) << (CELL_AXIS_BITS * 2)) | ((y & ((1 << CELL_AXIS_BITS) - 1)) << CELL_AXIS_BITS) | (z & ((1 << CELL_AXIS_BITS) - 1));
      if (block[3] === undefined || block[3] === null) {
        cell[blockIndex] = block[3] = defaultLockedStatus;
      } else {
        cell[blockIndex] = block[3] = !!block[3];
      }

      let blockEvalStatus = true;
      if (block[4] === undefined || block[4] === null) {
        blockEvalStatus = block[4] = defaultEvalStatus;
      } else {
        blockEvalStatus = block[4] = !!block[4];
      }

      const chunkId = ((x >> 5) + "|" + (y >> 5) + "|" + (z >> 5));
      blockToChunkId[cursorIndex] = chunkId;
      if (blockEvalStatus) {
        const isChunkLoaded = api.isBlockInLoadedChunk(x, y, z);
        chunkLoadState[chunkId] = ((isChunkLoaded << 1) | isChunkLoaded); // isChunkLoaded === true ? 3 : 0
      }

      budget--;
      cursorIndex = ++this.seedCursor;
    }
    if (cursorIndex > lastIndex) {
      this.phase = !(lastIndex + 1) + 1; // lastIndex > -1 ? 1 : 2
    }
  },

  _main() {
    const blocks = this.blocks;
    const maxErrorLogs = this.maxErrorLogs;

    const blockToChunkId = this.blockToChunkId;
    const chunkLoadState = this.chunkLoadState;
    const errors = this.errors;
    const lastIndex = this.lastIndex;
    const statistics = this.statistics;

    const STATE_REQUESTED = this.CHUNK_LOAD_STATE.REQUESTED;
    const STATE_EVENTED = this.CHUNK_LOAD_STATE.EVENTED;
    const STATE_LOADED = this.CHUNK_LOAD_STATE.LOADED;
    const evalFn = this.evalFn;

    let budget = this.maxEvalsPerTick;
    let cursorIndex = this.mainCursor;
    while (cursorIndex <= lastIndex && budget > 0) {
      const block = blocks[cursorIndex];
      if (!block[4]) {
        cursorIndex = ++this.mainCursor;
        continue;
      }
      const x = block[0];
      const y = block[1];
      const z = block[2];
      const chunkId = blockToChunkId[cursorIndex];
      const loadState = chunkLoadState[chunkId];
      if (loadState === STATE_LOADED) {
        try {
          const code = api.getBlockData(x, y, z)?.persisted?.shared?.text;
          evalFn(code);
        } catch (e) {
          if (errors.length < maxErrorLogs) {
            errors[errors.length] = [x, y, z, e.name, e.message];
          }
        }
        statistics.evaled++;
        budget--;
        cursorIndex = ++this.mainCursor;
        continue;
      }
      if (loadState === STATE_EVENTED) {
        chunkLoadState[chunkId] = STATE_LOADED;
        continue;
      }
      if (loadState === STATE_REQUESTED) {
        if (api.isBlockInLoadedChunk(x, y, z)) {
          chunkLoadState[chunkId] = STATE_EVENTED;
          statistics.evented++;
          continue;
        }
        break;
      }
      api.getBlock(x, y, z);
      chunkLoadState[chunkId] = STATE_REQUESTED;
      statistics.requested++;
      break;
    }
    if (cursorIndex > lastIndex) {
      this.phase = 2;
    }
  },

  onChunkLoaded(chunkId) {
    const loadState = this.chunkLoadState[chunkId];
    if (loadState === this.CHUNK_LOAD_STATE.REQUESTED || loadState === this.CHUNK_LOAD_STATE.UNLOADED) {
      this.chunkLoadState[chunkId] = this.CHUNK_LOAD_STATE.EVENTED;
      this.statistics.evented++;
    }
  },

  isBlockLocked(position) {
    const x = (position[0] | 0) - ((position[0] < (position[0] | 0)) & 1); // Math.floor(x)
    const y = (position[1] | 0) - ((position[1] < (position[1] | 0)) & 1); // Math.floor(y)
    const z = (position[2] | 0) - ((position[2] < (position[2] | 0)) & 1); // Math.floor(z)

    const COORDINATES_RANGE_BITS = this.COORDINATES_RANGE_BITS;
    const CELL_AXIS_BITS = this.CELL_AXIS_BITS;
    const CELL_INDEX_BITS = COORDINATES_RANGE_BITS - CELL_AXIS_BITS;

    const cellIndex = (((x >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS)) * (1 << (CELL_INDEX_BITS + 1)) + ((y >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS))) * (1 << (CELL_INDEX_BITS + 1)) + ((z >> CELL_AXIS_BITS) + (1 << CELL_INDEX_BITS));
    const blockIndex = ((x & ((1 << CELL_AXIS_BITS) - 1)) << (CELL_AXIS_BITS * 2)) | ((y & ((1 << CELL_AXIS_BITS) - 1)) << CELL_AXIS_BITS) | (z & ((1 << CELL_AXIS_BITS) - 1));
    return (!this.boot_manager.isRunning && !!(this.blockLockedStatus[cellIndex]?.[blockIndex] ?? true));
  },
};

const InterruptionManager = {
  isActive: false,
  boot_manager: null,
  NOOP: null, // eventName -> interruptionNOOPfunction
  started: false,

  eventIndexByName: null, // eventName -> eventIndex
  eventDataByIndex: null, // [[eventName, tickTimestamp, [arg0, ..., arg8]], ...]
  eventRegistry: null, // eventName -> [interruptionStatus?, delayMs?, limitMs?, gapMs?, cooldownMs?]
  defaultRetryTicks: null, // Int32Array([delay, limit, interval, cooldown])
  eventRetryTicksByIndex: null, // [Int32Array([counter, cooldownTimestamp, delay, limit, interval, cooldown]), ...]

  tickCount: -1,
  iterationStateMask: null, // Uint32Array(2)
  dequeueStateMask: null, // Uint32Array(2)
  maxDequeuePerTick: 1,
  seedCursor: 0,

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

  start() {
    if (!this.started) {
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

      this.tickCount = 0;
      this.iterationStateMask[0] = 0;
      this.iterationStateMask[1] = 0;
      this.dequeueStateMask[0] = 0;
      this.dequeueStateMask[1] = 0;
      const maxDequeuePerTick = thisConfiguration.max_dequeue_per_tick | 0;
      this.maxDequeuePerTick = (maxDequeuePerTick & ~(maxDequeuePerTick >> 31)) + (-maxDequeuePerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1
      this.seedCursor = 0;
      this.started = true;
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
    const eventRetryTicksByIndex = this.eventRetryTicksByIndex;
    const tickCount = this.tickCount;
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
            const delegatorName = "_" + eventData[EVENT_NAME];
            globalThis[delegatorName].apply(null, args);
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

const BootManager = {
  isPrimaryBoot: true,
  NOOP: null,
  activeEvents: null, // eventName -> true
  unregisteredActiveEvents: null, // [eventName, ...]
  primarySetupError: null, // [error.name, error.message]
  isPrimarySetupDone: false,
  
  bootDelayTicks: 0,
  showLoadTime: true,
  showErrors: true,
  logStyle: null,
  
  isRunning: false,
  phase: -1,
  tickCount: -1,
  loadTimeTicks: -1,

  tick() {
    this.tickCount++;
    if (this.phase === 0) {
      this._startBoot();
    }
    if (this.phase === 1) {
      this._waitTime();
    }
    if (this.phase === 2) {
      this._startSetup();
    }
    if (this.phase === 3) {
      return this._seedSetup();
    }
    if (this.phase === 4) {
      return this._install();
    }
    if (this.phase === 5) {
      return this._startInit();
    }
    if (this.phase === 6) {
      this._startJoinDequeue();
    }
    if (this.phase === 7) {
      this._tickJoinDequeue();
    }
    if (this.phase === 8) {
      this._finishBoot();
    }
  },

  _startBoot() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.tickCount = 0;
      if (!this.isPrimarySetupDone) {
        const error = this.primarySetupError;
        const logs = `Codeloader: BootManager: ${(error == null) ? "Uncaught e" : "E"}rror on events primary setup${(error == null) ? "." : ` - ${error[0]}: ${error[1]}.`}`;
        const playerIds = api.getPlayerIds();
        for (const playerId of playerIds) {
          api.kickPlayer(playerId, logs);
        }
        return;
      }
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
      TickMultiplexer.started = false;
      ChunkMultiplexer.started = false;
      JoinQueue.started = false;
      BlockInitializer.started = false;
      InterruptionManager.started = false;
      this.phase = 1;
    }
  },

  _waitTime() {
    if (this.tickCount >= this.bootDelayTicks) {
      this.phase = 2;
    }
  },

  _startSetup() {
    TickMultiplexer.start();
    ChunkMultiplexer.start();
    JoinQueue.start();
    BlockInitializer.start();
    InterruptionManager.start();
    this.phase = 3;
  },

  _seedSetup() {
    let completed = true;
    if (this.activeEvents.onPlayerJoin) {
      completed &&= JoinQueue.seedFromOnlinePlayers();
    }
    if (InterruptionManager.isActive) {
      completed &&= InterruptionManager.seedEventRetryTicks();
    }
    if (completed) {
      this.phase = 4;
    }
  },

  _install() {
    if (this.activeEvents.onPlayerJoin) {
      JoinQueue.install();
    }
    ChunkMultiplexer.install();
    TickMultiplexer.install();
    this.phase = 5;
  },

  _startInit() {
    TickMultiplexer.init = function () {
      BlockInitializer.step();
    };
    ChunkMultiplexer.init = function (chunkId) {
      BlockInitializer.onChunkLoaded(chunkId);
    };
    this.phase = 6;
  },

  _startJoinDequeue() {
    if (BlockInitializer.phase === 2) {
      ChunkMultiplexer.finalize();
      if (this.activeEvents.onPlayerJoin && JoinQueue.installed) {
        this.phase = 7;
      } else {
        this.phase = 8;
      }
    }
  },

  _tickJoinDequeue() {
    if (JoinQueue.dequeueStep()) {
      this.phase = 8;
    }
  },

  _finishBoot() {
    if (this.activeEvents.onPlayerJoin) {
      JoinQueue.finalize();
    }
    TickMultiplexer.finalize();
    this.loadTimeTicks = this.tickCount - this.bootDelayTicks + 1;
    BlockInitializer.phase = -1;
    this.phase = -1;
    this.isRunning = false;
    this.logBootResult(this.showLoadTime, this.showErrors);
  },

  logBootResult(showLoadTime, showErrors) {
    if (this.unregisteredActiveEvents.length) {
      api.broadcastMessage([{
        str: `Codeloader: BootManager: Unregistered callbacks: ${this.unregisteredActiveEvents.join(", ")}.`,
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
    const errorsCount = BlockInitializer.errors.length;
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
    const errors = BlockInitializer.errors;
    if (errors.length > 0) {
      let logs = `Codeloader: BlockInitializer: Code evaluation error${errors.length === 1 ? "" : "s"}: `;
      for (const e of errors) {
        logs += `\n${e[3]} at (${e[0]}, ${e[1]}, ${e[2]}): ${e[4]} `;
      }
      api.broadcastMessage([{
        str: logs,
        style: this.logStyle?.error ?? {}
      }]);
    }
  },

  eventsPrimarySetup() {
    if (this.isPrimarySetupDone) {
      return;
    }

    this.isPrimaryBoot = true;
    this.isRunning = false;
    const isInterruptionManagerEnabled = !!Configuration.interruption_manager.is_enabled;
    const primaryEventRegistry = Configuration.EVENT_REGISTRY;
    const primaryActiveEvents = Configuration.ACTIVE_EVENTS;

    const NOOP = this.NOOP = function () { };
    const activeEvents = this.activeEvents = {};
    const unregisteredActiveEvents = this.unregisteredActiveEvents = [];

    const interruption_manager = InterruptionManager;
    interruption_manager.NOOP = {};
    interruption_manager.defaultRetryTicks = new Int32Array(4);
    const iterationStateMask = interruption_manager.iterationStateMask = new Uint32Array(2);
    const dequeueStateMask = interruption_manager.dequeueStateMask = new Uint32Array(2);
    const eventIndexByName = interruption_manager.eventIndexByName = {};
    const eventDataByIndex = interruption_manager.eventDataByIndex = [];
    const eventRetryTicksByIndex = interruption_manager.eventRetryTicksByIndex = [];

    let index = 0;
    for (const eventName of primaryActiveEvents) {
      if (!Object.hasOwn(primaryEventRegistry, eventName)) {
        unregisteredActiveEvents[unregisteredActiveEvents.length] = eventName;
        continue;
      }
      activeEvents[eventName] = true;
      if (eventName !== "tick") {
        const delegatorName = "_" + eventName;
        const interruptionStatus = !!primaryEventRegistry[eventName][0];
        if (isInterruptionManagerEnabled && interruptionStatus) {
          interruption_manager.isActive = true;
          const eventIndex = index;
          eventIndexByName[eventName] = eventIndex;
          eventRetryTicksByIndex[eventIndex] = new Int32Array(6);
          const eventData = eventDataByIndex[eventIndex] = [eventName, -1, new Array(9)];
          const args = eventData[2];
          globalThis[delegatorName] = interruption_manager.NOOP[eventName] = function () { interruption_manager.setInterruptionState(eventIndex); };
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            dequeueStateMask[eventIndex >> 5] = iterationStateMask[eventIndex >> 5] |= (1 << (eventIndex & 31));
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
            return globalThis[delegatorName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          };
          index++;
        } else {
          globalThis[delegatorName] = NOOP;
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            return globalThis[delegatorName](arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          };
        }
      }
    }
    if (!activeEvents.onChunkLoaded) {
      globalThis._onChunkLoaded = NOOP;
      globalThis.onChunkLoaded = function (arg0, arg1, arg2) {
        return globalThis._onChunkLoaded(arg0, arg1, arg2);
      };
    }
    this.phase = -1;
    globalThis._tick = function () {
      BootManager.tick();
    };
    globalThis.tick = function () {
      globalThis._tick();
    };
    this.isPrimarySetupDone = true;
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
    return BlockInitializer.errors.slice();
  },

  setInterruptionState(eventName) {
    const eventIndex = InterruptionManager.eventIndexByName[eventName];
    if (eventIndex === undefined) {
      if (BootManager.activeEvents[eventName]) {
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
    if (!Array.isArray(position) || position.length !== 3) {
      return true;
    }
    return BlockInitializer.isBlockLocked(position);
  },

  reboot() {
    const boot_manager = BootManager;
    if (!boot_manager.isRunning) {
      boot_manager.isPrimaryBoot = false;
      boot_manager.phase = 0;
      globalThis._tick = function () {
        boot_manager.tick();
      };
    } else {
      api.broadcastMessage([{
        str: `Codeloader: BootManager: Wait until current running boot session is finished.`,
        style: boot_manager.logStyle?.warning ?? {}
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

TickMultiplexer.boot_manager = BootManager;
TickMultiplexer.interruption_manager = InterruptionManager;
ChunkMultiplexer.boot_manager = BootManager;
ChunkMultiplexer.interruption_manager = InterruptionManager;
JoinQueue.boot_manager = BootManager;
JoinQueue.interruption_manager = InterruptionManager;
BlockInitializer.boot_manager = BootManager;
InterruptionManager.boot_manager = BootManager;

try {
  BootManager.eventsPrimarySetup();
} catch (e) {
  BootManager.primarySetupError = [e.name, e.message];
}
BootManager.phase = 0;

void 0;
