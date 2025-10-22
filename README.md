---

<div align="center">

<h1>Codeloader</h1>

<p>
Automatically boot your world code in deterministic phases, ensure target chunks are loaded, </br>
while evaluating the code stored in your blocks data (<code>persisted.shared.text</code>).<br/>
Built-in <code>Join Manager</code> buffers <code>onPlayerJoin</code> during the boot session and correctly applies it.<br/>
<code>Interruption Manager</code> provides utility to execute interrupted events under rate limit rules.
</p>

<p>
  <a href="#installation"><kbd>Installation</kbd></a>
  &nbsp;•&nbsp; <a href="#quick-start"><kbd>Quick Start</kbd></a>
  &nbsp;•&nbsp; <a href="#configuration"><kbd>Configuration</kbd></a>
  &nbsp;•&nbsp; <a href="#codeloader-api"><kbd>Codeloader API</kbd></a>
  &nbsp;•&nbsp; <a href="#example"><kbd>Example</kbd></a>
  &nbsp;•&nbsp; <a href="#troubleshooting"><kbd>Troubleshooting</kbd></a>
</p>

</div>

---

<a id="installation"></a>

## 📦 Installation

Copy the loader source code entirely into your <code>World Code</code>.<br/>

* [`Minified version`](https://github.com/delfineonx/block-codeloader/blob/main/src/codeloader_minified.js)

<h6>- It self‑boots on the lobby creation/start.<br/>
- If you want, you may put some non-event functions or other objects right after the loader source code, if there is some free space in your <code>World Code</code>.</h6>

---

<a id="quick-start"></a>

## ⚡ Quick Start

Inside <code>World Code</code>: List the events you actually use (their order doesn't matter) and list your blocks positions (their order does matter).</br>

```js
const CF=Object.seal({
  ACTIVE_EVENTS:Object.freeze([
    "tick",
    "onPlayerJump",
    "onPlayerChat",
    "onPlayerJoin",
    "onPlayerLeave",
    "onRespawnRequest",
    // ...
  ]),
  blocks:[
    [2,2,2],
    [4,2,2],
    [6,2,2],
    [8,2,2],
    // ...
  ],
  // other things remain unchanged ...
});
```

Inside your specified blocks: distribute the world code as you need (it has no difference in comparison to real <code>World Code</code>).</br>

```js
tick = () => { }; // (2,2,2)
function onPlayerJump(playerId) { }; // (4,2,2)
function onPlayerChat(playerId, chatMessage, channelName) { }; // (6,2,2)
onPlayerJoin = function (playerId, fromGameReset) { }; // (8,2,2)
onPlayerLeave = function (playerId, serverIsShuttingDown) { }; // (8,2,2)
onRespawnRequest = (playerId) => { }; // (8,2,2)
```

<h6>Both function declarations and (anonymous or arrow) function expressions assigned to global variables with event (callback) names are allowed.<h6>

---

<a id="configuration"></a>

## 🛠️ Configuration

All configuration objects are <ins>sealed</ins>. You can change existing values by keys at runtime, then call <code>Codeloader.reboot()</code>.</br>
You cannot add or delete properties (prevents accidental shape changes).</br>

```js
const Configuration = Object.seal({
  ACTIVE_EVENTS: Object.freeze([ ... ]),
  blocks: [ ... ],
  boot_manager: Object.seal({ ... }),
  join_manager: Object.seal({ ... }),
  block_manager: Object.seal({ ... }),
  interruption_manager: Object.seal({ ... }),
  EVENT_REGISTRY: Object.seal({ ... }),
  LOG_STYLE: Object.seal({ error: { ... }, warning: { ... }, success: { ... } })
});
```

<h3>〔 <code><b>ACTIVE_EVENTS</b></code> 〕</h3> 
Array of event (callback) names the loader should wire up (recommendation: include only what you are using).</br>
For each <code>callbackName</code> the loader ensures:</br></br>

- The delegator with <code>callbackName</code> exists (your evaled/assigned handler function; default to no‑op function if missing)</br>
- Real <code>globalThis.callbackName(...args)</code> returns delegator call of <code>callbackName(...args)</code></br>

Not listed events are ignored (no wrapper is created).</br>
You can add or delete active events in the loader configuration only in <code>World Code</code>.</br>

<h3>〔 <code><b>blocks</b></code> 〕</h3> 

Array of such entries: <code>[x, y, z, lockedStatus?, evalStatus?]</code>.</br>
Coordinates are integer‑floored internally. <code>lockedStatus</code> and <code>evalStatus</code> are converted to booleans (if provided).</br>

- <code><ins>lockedStatus</ins></code>:</br>
  - <code>true</code> -- the block is considered "locked" by the loader.</br>
  - <code>false</code> -- the block is considered "unlocked" by the loader.</br>
  - omitted or <code>null</code> -- <code>block_manager.default_locked_status</code> is used.</br>
- <code><ins>evalStatus</ins></code>:</br>
  - <code>true</code> -- evaluate the block, once its chunk is loaded.</br>
  - <code>false</code> -- block evaluation is skipped, once its chunk is loaded.</br>
  - omitted or <code>null</code> -- <code>block_manager.default_eval_status</code> is used.</br>

Coordinates are not limited by any number internally.</br>
<code>lockedStatus = true</code> allows you to reinitialize everything under <code>isBlockLocked()</code> guard anytime when you eval data in the block (or click the code block).

<h3>〔 <code><b>boot_manager</b></code> 〕</h3> 

| Property | Type | Default | Notes |
|---|---:|---:|---|
| `boot_delay_ms` | number | `200` | Time to wait in milliseconds before the current boot session (main process) starts. Min number is 0 (i.e. immediately). Converted to ticks and floored. |
| `show_load_time` | boolean | `true` | Whether to broadcast the total load time after the boot session is finished. |
| `show_errors` | boolean | `true` | Whether to broadcast collected evaluation errors after the boot session is finished. |

<h3>〔 <code><b>join_manager</b></code> 〕</h3> 

| Property | Type | Default | Notes |
|---|---:|---:|---|
| `reset_on_reboot` | boolean | `true` | Whether to apply <code>onPlayerJoin</code> delegator <ins>again</ins> (usually on reboot) for all currently online players, i.e. it will be called for each player even if it has been already called for them (processed) before. |
| `max_dequeue_per_tick` | number | `8` | Max `onPlayerJoin` delegator entries (players) processed per tick during the boot session. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |

<h3>〔 <code><b>block_manager</b></code> 〕</h3> 

| Property | Type | Default | Notes |
|---|---:|---:|---|
| `default_locked_status` | boolean | `true` | Default when block's entry `lockedStatus` is `null`/`undefined`. |
| `default_eval_status` | boolean | `true` | Default when block's entry `evalStatus` is `null`/`undefined`. |
| `max_registrations_per_tick` | number | `32` | Max blocks internally registered per tick during seeding process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_requests_per_tick` | number | `8` | Max chunks processed (requested or checked) per tick during initializing process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_evals_per_tick` | number | `16` | Max blocks evaluated per tick during initializing process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_error_logs` | number | `32` | Max errors to retain and optionally broadcast. Min number is 0 (i.e. no errors are saved and logged). Converted to integer and floored. |

<h3>〔 <code><b>interruption_manager</b></code> 〕</h3> 

| Property | Type | Default | Notes |
|---|---:|---:|---|
| `is_enabled` | boolean | `false` | Master switch whether the manager is used. You can change it in the loader configuration only in <code>World Code</code>. |
| `max_dequeue_per_tick` | number | `16` | Max different events retry calls processed per tick globally. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `default_retry_delay_ms` | number | `0` | Default when event's registry entry `delayMs` is `null`/`undefined`. Min number is 0 (i.e. immediately -- in the same tick or the next one). Converted to ticks and floored. |
| `default_retry_limit_ms` | number | `50` | Default when event's registry entry `limitMs` is `null`/`undefined`. Min number is 0 (i.e. no retries). Converted to ticks and floored. |
| `default_retry_interval_ms` | number | `0` | Default when event's registry entry `intervalMs` is `null`/`undefined`. Min number is 0 (i.e. no interval between retries). Converted to ticks and floored. |
| `default_retry_cooldown_ms` | number | `1000` | Default when event's registry entry `cooldownMs` is `null`/`undefined`. Min number is 1 (i.e. at least 1 tick of cooldown for the current event if its limit is reached). Converted to ticks and floored. |

<h3>〔 <code><b>EVENT_REGISTRY</b></code> 〕</h3> 

Map of <code>eventName -> [interruptionStatus?, delayMs?, limitMs?, intervalMs?, cooldownMs?]</code>.</br>
<code>interruptionStatus</code> is converted to boolean (if provided). <code>delayMs</code>, <code>limitMs</code>, <code>intervalMs</code>, <code>cooldownMs</code> are converted to ticks and integer-floored internally (if provided).</br>

- <code><ins>interruptionStatus</ins></code>:</br>
  - <code>true</code> -- the event is internally enqueued on each call.</br>
  - <code>false</code> -- the event is called normally, it does not take part in <code>Interruption Manager</code> processes.</br>
  - omitted or <code>null</code> -- default <code>false</code> is used.</br>
- <code><ins>delayMs</ins></code>:</br>
  Initial delay before the first retry attempt for this event after the last failed dequeue by <code>setInterruptionState</code>.</br>
- <code><ins>limitMs</ins></code>:</br>
  Retry attempts budget. When the budget is exhausted, the consecutive retries for this event end, (last arguments are dropped) and cooldown starts.</br>
- <code><ins>intervalMs</ins></code>:</br>
  Interval between failed consecutive retries for this event.</br>
- <code><ins>cooldownMs</ins></code>:</br>
  Cooldown, after the consecutive retries for this event end, before the new last failed dequeue by <code>setInterruptionState</code> is retried.</br>

Do not change the event names in <code>EVENT_REGISTRY</code>.</br>
You can remove only in the <code>World Code</code> those events from <code>EVENT_REGISTRY</code> which you do not use in <code>ACTIVE_EVENTS</code>.</br>
You can change <code>interruptionStatus</code> in the loader configuration only in <code>World Code</code>.</br>
<code>tick</code> callback is special and does not have interruption retry setup for itself.

<h3>〔 <code><b>LOG_STYLE</b></code> 〕</h3> 

StyledText objects used by the loader to broadcast logs during and after the last boot session. You can change styles before the new boot.

---

<a id="codeloader-api"></a>

## 📚 Codeloader API

Global object <code>Codeloader</code> has the following:

```js
/*
 * Read-only accessor that returns the sealed configuration object.
 * You may mutate existing values (then call `reboot()`),
 * but you cannot add or delete properties.
 */
configuration

/*
 * Whether the boot session is currently running.
 * `true` only during the boot; `false` before the boot or after it finishes.
 */
isRunning

/*
 * Shallow copy of collected evaluation errors from the last boot session.
 * Each entry: [x, y, z, errorName, errorMessage].
 * It resets at the start of each boot session.
 */
errors

/**
 * Clear (dequeue) any interruption state for the given event (callback).
 * If interruption state after the given event (callback) call is not cleared (dequeued),
 * the call is redirected to internal `Interruption Manager` tick with the last arguments for next retries.
 * This does NOT invoke or re-run the event or handler; it only cancels (clears) queued ones.
 *
 * @param {string} eventName - callback name (must be in `ACTIVE_EVENTS` and has `interruptionStatus = true` in `EVENT_REGISTRY`)
 * @returns {void}
 */
setInterruptionState(eventName)

/**
 * Floor coordinates and return the lock state of a block at `position`.
 * Behavior:
 *  - During boot session, ALWAYS returns `false` ("unlocked").
 *  - If the block was not registered (in `configuration.blocks`) before boot, it is considered as "locked".
 *
 * @param {[number, number, number]} position - [x, y, z]; non-arrays or invalid length are treated as "locked"
 * @returns {boolean}
 *   - `true` if "locked"
 *   - `false` if "unlocked"
 */
isBlockLocked(position)

/**
 * Start the new boot using the current (last) configuration.
 * Broadcast warning if the boot session is already running.
 * Replaces `tick` with the boot tick dispatcher until the boot completes.
 *
 * @returns {void}
 */
reboot()

/**
 * Broadcast summary of the last boot session.
 *
 * @param {boolean} [showLoadTime = true]
 * @param {boolean} [showErrors = true]
 * @returns {void}
 */
logBootResult(showLoadTime, showErrors)

/**
 * Broadcast the total load time in milliseconds of the last boot session.
 *
 * @param {boolean} [showErrors = true] - Whether to show the errors count.
 * @returns {void}
 */
logLoadTime(showErrors = true)

/**
 * Broadcast the collected evaluation errors from the last boot session.
 * (Same data as `errors`.)
 *
 * @returns {void}
 */
logErrors()
```

> **Tip**: Use <code>isBlockLocked()</code> in your blocks as a guard (codition block) to avoid unwanted (re-)initialization of the code.

---

<a id="example"></a>

## 🧪 Example

Download the file and paste it using <code>World Builder</code> at <code>(0, 0, 0)</code>:</br>
* [`Codeloader example .bloxdshem`](https://github.com/delfineonx/block-codeloader/blob/main/assets/)

<div align="center">
<h3> ✨ Unlimited World Code ✨</br> </h3>
</div>

Use second setup configuration method: Change `configuration.blocks` at runtime, then reboot to evaluate a new batch of blocks.</br>
Code block at <code>(0, 2, 5)</code>:
```js
if(!Codeloader.isBlockLocked(thisPos)) {

Codeloader.configuration.blocks = [
[2,2,2],
[4,2,2],
[6,2,2],
[8,2,2],
];
Codeloader.configuration.boot_manager.show_load_time = true;
Codeloader.configuration.boot_manager.show_errors = true;

tick = () => {
  if(!Codeloader.isRunning) {
    Codeloader.reboot();
  }
}

}
```

<div align="center">
<h3> ⚙️ First Test Setup Configuration ⚙️</br> </h3>
</div>

```js
const CF=Object.seal({
ACTIVE_EVENTS:Object.freeze([
"tick",
"onPlayerJump",
"onPlayerChat",
"onPlayerJoin",
"onPlayerLeave",
"onRespawnRequest",
]),
blocks:[
[2,2,2],
[4,2,2],
[6,2,2],
[8,2,2],
],
boot_manager:Object.seal({
boot_delay_ms:200,
show_load_time:true,
show_errors:true,
}),
block_manager:Object.seal({
default_locked_status:true,
default_eval_status:true,
max_registrations_per_tick:32,
max_requests_per_tick:8,
max_evals_per_tick:16,
max_error_logs:32,
}),
join_manager:Object.seal({
reset_on_reboot:true,
max_dequeue_per_tick:8,
}),
interruption_manager:Object.seal({
is_enabled:true,
max_dequeue_per_tick:16,
default_retry_delay_ms:0,
default_retry_limit_ms:50,
default_retry_interval_ms:0,
default_retry_cooldown_ms:500,
}),
EVENT_REGISTRY:Object.seal({
tick:null,
onClose:[!0],
onPlayerJoin:[!0],
onPlayerLeave:[!0],
onPlayerJump:[!0],
onRespawnRequest:[!1],
playerCommand:[!1],
onPlayerChat:[!1],
onPlayerChangeBlock:[!1],
onPlayerDropItem:[!1],
onPlayerPickedUpItem:[!0],
onPlayerSelectInventorySlot:[!0],
onBlockStand:[!0],
onPlayerAttemptCraft:[!1],
onPlayerCraft:[!0],
onPlayerAttemptOpenChest:[!1],
onPlayerOpenedChest:[!0],
onPlayerMoveItemOutOfInventory:[!1],
onPlayerMoveInvenItem:[!1],
onPlayerMoveItemIntoIdxs:[!1],
onPlayerSwapInvenSlots:[!1],
onPlayerMoveInvenItemWithAmt:[!1],
onPlayerAttemptAltAction:[!1],
onPlayerAltAction:[!0],
onPlayerClick:[!0],
onClientOptionUpdated:[!0],
onMobSettingUpdated:[!0],
onInventoryUpdated:[!0],
onChestUpdated:[!0],
onWorldChangeBlock:[!1],
onCreateBloxdMeshEntity:[!0],
onEntityCollision:[!0],
onPlayerAttemptSpawnMob:[!1],
onWorldAttemptSpawnMob:[!1],
onPlayerSpawnMob:[!0],
onWorldSpawnMob:[!0],
onWorldAttemptDespawnMob:[!1],
onMobDespawned:[!0],
onPlayerAttack:[!0],
onPlayerDamagingOtherPlayer:[!1],
onPlayerDamagingMob:[!1],
onMobDamagingPlayer:[!1],
onMobDamagingOtherMob:[!1],
onAttemptKillPlayer:[!1],
onPlayerKilledOtherPlayer:[!1],
onMobKilledPlayer:[!1],
onPlayerKilledMob:[!1],
onMobKilledOtherMob:[!1],
onPlayerPotionEffect:[!0],
onPlayerDamagingMeshEntity:[!0],
onPlayerBreakMeshEntity:[!0],
onPlayerUsedThrowable:[!0],
onPlayerThrowableHitTerrain:[!0],
onTouchscreenActionButton:[!0],
onTaskClaimed:[!0],
onChunkLoaded:[!0],
onPlayerRequestChunk:[!0],
onItemDropCreated:[!0],
onPlayerStartChargingItem:[!0],
onPlayerFinishChargingItem:[!0],
doPeriodicSave:[!0],
}),
LOG_STYLE:Object.seal({
error:{color:"#ff9d87",fontWeight:"600",fontSize:"1rem"},
warning:{color:"#fcd373",fontWeight:"600",fontSize:"1rem"},
success:{color:"#2eeb82",fontWeight:"600",fontSize:"1rem"},
})
});
```

<div align="center">
<h3> ⚙️ Second Test Setup Configuration ⚙️</br> </h3>
</div>

```js
const CF=Object.seal({
ACTIVE_EVENTS:Object.freeze([
"tick",
"onPlayerJump",
"onPlayerChat",
"onPlayerJoin",
"onPlayerLeave",
"onRespawnRequest",
]),
blocks:[
[0,2,5],
],
boot_manager:Object.seal({
boot_delay_ms:200,
show_load_time:false,
show_errors:false,
}),
block_manager:Object.seal({
default_locked_status:true,
default_eval_status:true,
max_registrations_per_tick:32,
max_requests_per_tick:8,
max_evals_per_tick:16,
max_error_logs:32,
}),
join_manager:Object.seal({
reset_on_reboot:true,
max_dequeue_per_tick:8,
}),
interruption_manager:Object.seal({
is_enabled:true,
max_dequeue_per_tick:16,
default_retry_delay_ms:0,
default_retry_limit_ms:50,
default_retry_interval_ms:0,
default_retry_cooldown_ms:500,
}),
EVENT_REGISTRY:Object.seal({
tick:null,
onClose:[!0],
onPlayerJoin:[!0],
onPlayerLeave:[!0],
onPlayerJump:[!0],
onRespawnRequest:[!1],
playerCommand:[!1],
onPlayerChat:[!1],
onPlayerChangeBlock:[!1],
onPlayerDropItem:[!1],
onPlayerPickedUpItem:[!0],
onPlayerSelectInventorySlot:[!0],
onBlockStand:[!0],
onPlayerAttemptCraft:[!1],
onPlayerCraft:[!0],
onPlayerAttemptOpenChest:[!1],
onPlayerOpenedChest:[!0],
onPlayerMoveItemOutOfInventory:[!1],
onPlayerMoveInvenItem:[!1],
onPlayerMoveItemIntoIdxs:[!1],
onPlayerSwapInvenSlots:[!1],
onPlayerMoveInvenItemWithAmt:[!1],
onPlayerAttemptAltAction:[!1],
onPlayerAltAction:[!0],
onPlayerClick:[!0],
onClientOptionUpdated:[!0],
onMobSettingUpdated:[!0],
onInventoryUpdated:[!0],
onChestUpdated:[!0],
onWorldChangeBlock:[!1],
onCreateBloxdMeshEntity:[!0],
onEntityCollision:[!0],
onPlayerAttemptSpawnMob:[!1],
onWorldAttemptSpawnMob:[!1],
onPlayerSpawnMob:[!0],
onWorldSpawnMob:[!0],
onWorldAttemptDespawnMob:[!1],
onMobDespawned:[!0],
onPlayerAttack:[!0],
onPlayerDamagingOtherPlayer:[!1],
onPlayerDamagingMob:[!1],
onMobDamagingPlayer:[!1],
onMobDamagingOtherMob:[!1],
onAttemptKillPlayer:[!1],
onPlayerKilledOtherPlayer:[!1],
onMobKilledPlayer:[!1],
onPlayerKilledMob:[!1],
onMobKilledOtherMob:[!1],
onPlayerPotionEffect:[!0],
onPlayerDamagingMeshEntity:[!0],
onPlayerBreakMeshEntity:[!0],
onPlayerUsedThrowable:[!0],
onPlayerThrowableHitTerrain:[!0],
onTouchscreenActionButton:[!0],
onTaskClaimed:[!0],
onChunkLoaded:[!0],
onPlayerRequestChunk:[!0],
onItemDropCreated:[!0],
onPlayerStartChargingItem:[!0],
onPlayerFinishChargingItem:[!0],
doPeriodicSave:[!0],
}),
LOG_STYLE:Object.seal({
error:{color:"#ff9d87",fontWeight:"600",fontSize:"1rem"},
warning:{color:"#fcd373",fontWeight:"600",fontSize:"1rem"},
success:{color:"#2eeb82",fontWeight:"600",fontSize:"1rem"},
})
});
```

---

<a id="troubleshooting"></a>

## 🧯 Troubleshooting

- <code>"Unregistered callbacks: ..."</code></br>
: The event in `ACTIVE_EVENTS` has no entry in `EVENT_REGISTRY`. Either rename the event in `ACTIVE_EVENTS` or add an entry.

- <code>"setInterruptionState - "..." interruption status is false."</code></br>
: Ensure `interruption_manager.is_enabled = true` and that event's `interruptionStatus` flag is `true` in `EVENT_REGISTRY`.

- <code>"setInterruptionState - "..." is invalid active event name."</code></br>
: Ensure the event is in `ACTIVE_EVENTS`.

- <code>"Wait until current running boot session is finished."</code></br>
: You called `Codeloader.reboot()` while the another boot session is already in progress. Try again after it finishes.

- <code>"Uncaught error on events primary setup."</code> or <code>"Error on events primary setup - ..."</code></br>
: Critical error inside the loader. Ensure the configuration is correct and reinstall the loader source code (paste minified version again).

- <code>No code executes from my blocks.</code></br>
: Ensure block's `evalStatus` flag (or `default_eval_status`) is `true`.

- <code>Changed config but behavior didn't update.</code></br>
: Modify `configuration`, then call `Codeloader.reboot()` so the loader re‑reads settings.

- <code>Interrupted events are never retried.</code></br>
: Ensure the configuration is correct, the interruption manager is enabled (`interruption_manager.is_enabled = true`).</br>
  Set the event `interruptionStatus` flag to `true` and include `Codeloader.setInterruptionState(eventName)` inside your (event delegator) handler (preferably on top).

---
