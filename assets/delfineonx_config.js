
// Copyright (c) 2025-2026 delfineonx
// This product includes "Code Loader" created by delfineonx.
// This product includes "Interruption Framework" created by delfineonx.
// Licensed under the Apache License, Version 2.0.

const configuration={
ACTIVE_EVENTS:[
"tick",
"onPlayerJoin",
"onPlayerLeave",
"playerCommand",
"onPlayerChat",
"onPlayerJump",
"onPlayerClick",
],
BLOCKS:[

// [6, 25, 6],

// [27, 4, 25],

[27, 4, 23],
[27, 4, 21],
[27, 4, 19],
[27, 4, 17],
[27, 4, 14],
[27, 4, 12],
[27, 4, 10],
[27, 4, 8],
[27, 4, 6],

],
boot_manager:{
boot_delay_ms: 100,
show_boot_logs: true,
show_error_logs: true,
show_execution_logs: false,
},
block_manager:{
is_chest_mode: false, //
max_executions_per_tick: 8, //
max_errors_count: 32,
},
join_manager:{
reset_on_reboot: true,
max_dequeue_per_tick: 16,
},
event_manager:{
is_framework_enabled: false, //
default_retry_limit: 2,
},
EVENT_REGISTRY:{
tick: null,
onClose: [],
onPlayerJoin: [/* null, true */], //
onPlayerLeave: [/* null, true */], //
onPlayerJump: [/* undefined, true, 5 */], //
onRespawnRequest: [[0,-10000,0]],
playerCommand: [undefined],
onPlayerChat: [null /*, true */], //
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

