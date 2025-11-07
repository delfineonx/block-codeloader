---

<div align="center">

<h1>Codeloader</h1>

<p>
Automatically boot your world code in deterministic phases, ensure target chunks are loaded, </br>
while evaluating the code stored in your blocks data (<code>persisted.shared.text</code>).<br/>
Built-in <code>Join Manager</code> buffers <code>onPlayerJoin</code> during the boot session and correctly applies it.<br/>
<code>Interruption Manager</code> provides utility to execute selected events that were interrupted.
</p>

<p>
  <a href="#installation"><kbd>Installation</kbd></a>
  &nbsp;•&nbsp; <a href="#quick-start"><kbd>Quick Start</kbd></a>
  &nbsp;•&nbsp; <a href="#configuration"><kbd>Configuration</kbd></a>
  &nbsp;•&nbsp; <a href="#codeloader-api"><kbd>Codeloader API</kbd></a>
  &nbsp;•&nbsp; <a href="#example"><kbd>Example</kbd></a>
  &nbsp;•&nbsp; <a href="#features"><kbd>Features</kbd></a>
  &nbsp;•&nbsp; <a href="#troubleshooting"><kbd>Troubleshooting</kbd></a>
</p>

</div>

---

<a id="installation"></a>

## 📦 Installation

Copy the loader source code entirely into your actual <code>World Code</code>.<br/>

* [`Minified version`](https://github.com/delfineonx/block-codeloader/blob/main/src/codeloader_minified.js)

<h6>- It self‑boots on the lobby start/creation.<br/>
- If you want, you may put some non-event (not in-game callback) functions or other objects right after the loader source code, if there is some free space in your actual <code>World Code</code>.</h6>

---

<a id="quick-start"></a>

## ⚡ Quick Start

Inside actual <code>World Code</code>: List the events you will use (their order doesn't matter) and list your blocks positions (their order does matter).</br>

```js
const Configuration={
  ACTIVE_EVENTS:[
    "tick",
    "onPlayerJump",
    "onPlayerChat",
    "onPlayerJoin",
    "onPlayerLeave",
    "onRespawnRequest",
    // ...
  ],
  blocks:[
    [2,2,2],
    [4,2,2],
    [6,2,2],
    [8,2,2],
    // ...
  ],
  // other things remain unchanged ...
};
```

Inside your specified blocks: distribute the world code as you need (it has no difference in comparison to actual <code>World Code</code>), but remember that each block makes it's own scope. So you might need to change declarations of world code "global" variables or objects, if they were declared with <code>const</code> or <code>let</code> in actual <code>World Code</code> previously.</br>

```js
tick = () => { }; // (2,2,2)
onPlayerJump = (playerId) => { }; // (4,2,2)
onPlayerChat = function (playerId, chatMessage, channelName) { }; // (6,2,2)
onPlayerJoin = function (playerId, fromGameReset) { }; // (8,2,2)
onPlayerLeave = function (playerId, serverIsShuttingDown) { }; // (8,2,2)
onRespawnRequest = (playerId) => { }; // (8,2,2)
```

Recommended to use anonymous or arrow function expressions assigned to your event handlers (callbacks), as global variables. Function declarations for your event handlers (callbacks) names may lead sometimes to unexpected behaviour.</br>
✔️  <code>callbackName = function (...) {...};</code></br>
✔️  <code>callbackName = (...) => {...};</code></br>
⚠️ <code>function callbackName(...) {...}</code></br>

---

<a id="configuration"></a>

## 🛠️ Configuration

Configuration properties are <ins>sealed</ins>. You can change existing values by keys at runtime, then call <code>Codeloader.reboot()</code>.</br>
You cannot add or delete properties (prevents accidental shape changes).</br>

```js
const Configuration = {
  ACTIVE_EVENTS: [ ... ],
  blocks: [ ... ],
  boot_manager: { ... },
  join_manager: { ... },
  block_manager: { ... },
  interruption_manager: { ... },
  EVENT_REGISTRY: { ... },
  LOG_STYLE: { error: { ... }, warning: { ... }, success: { ... } }
};
```

<h3>〔 <code><b>ACTIVE_EVENTS</b></code> 〕</h3> 
Array of event (callback) names the loader should wire up (recommendation: include only what you are using).</br>
For each <code>callbackName</code> the loader ensures:</br></br>

- The delegator with <code>callbackName</code> exists (your handler function; default to no‑op function if missing)</br>
- Actual <code>globalThis.callbackName(...args)</code> returns delegator call of your handler function</br>

Not listed events are ignored (no wrapper is created).</br>
You can add or delete active events in the loader configuration only in actual <code>World Code</code>.</br>

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
<code>lockedStatus = false</code> allows you to reinitialize everything under <code>!isBlockLocked(position)</code> guard anytime when you eval data in the block (or click the code block).

<h3>〔 <code><b>boot_manager</b></code> 〕</h3> 

| Property | Type | Default | Description |
|---|---:|---:|---|
| `boot_delay_ms` | Number | `200` | Time to wait in milliseconds before the current boot session (main process) starts. Min number is 0 (i.e. immediately). Converted to ticks and floored. |
| `show_load_time` | Boolean | `true` | Whether to broadcast the total load time after the boot session is finished. |
| `show_errors` | Boolean | `true` | Whether to broadcast collected evaluation errors after the boot session is finished. |

<h3>〔 <code><b>join_manager</b></code> 〕</h3> 

| Property | Type | Default | Description |
|---|---:|---:|---|
| `reset_on_reboot` | Boolean | `true` | Whether to apply <code>onPlayerJoin</code> handler <ins>again</ins> (on reboot) for all currently online players, i.e. it will be called for each player even if it has been already called for them (processed) before. |
| `max_dequeue_per_tick` | Number | `8` | Max `onPlayerJoin` handler entries (players) processed per tick during the boot session. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |

<h3>〔 <code><b>block_manager</b></code> 〕</h3> 

| Property | Type | Default | Description |
|---|---:|---:|---|
| `default_locked_status` | Boolean | `true` | Default when block's entry `lockedStatus` is `null`/`undefined`. |
| `default_eval_status` | Boolean | `true` | Default when block's entry `evalStatus` is `null`/`undefined`. |
| `max_registrations_per_tick` | Number | `32` | Max blocks internally registered per tick during seeding process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_requests_per_tick` | Number | `8` | Max chunks processed (requested or checked) per tick during initializing process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_evals_per_tick` | Number | `16` | Max blocks evaluated per tick during initializing process. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `max_error_logs` | Number | `32` | Max errors to retain and optionally broadcast. Min number is 0 (i.e. no errors are saved and logged). Converted to integer and floored. |

<h3>〔 <code><b>interruption_manager</b></code> 〕</h3> 

| Property | Type | Default | Description |
|---|---:|---:|---|
| `is_enabled` | Boolean | `false` | Master switch whether the manager is used. You can change it in the loader configuration only in actual <code>World Code</code>. |
| `max_dequeue_per_tick` | Number | `16` | Max different events retry calls processed per tick globally. Min number is 1 (i.e. at least 1 per tick). Converted to integer and floored. |
| `default_retry_delay_ms` | Number | `0` | Default when event's registry entry `delayMs` is `null`/`undefined`. Min number is 0 (i.e. immediately -- in the same tick or the next one). Converted to ticks and floored. |
| `default_retry_limit_ms` | Number | `50` | Default when event's registry entry `limitMs` is `null`/`undefined`. Min number is 0 (i.e. no retries). Converted to ticks and floored. |
| `default_retry_interval_ms` | Number | `0` | Default when event's registry entry `intervalMs` is `null`/`undefined`. Min number is 0 (i.e. no interval between retries). Converted to ticks and floored. |
| `default_retry_cooldown_ms` | Number | `500` | Default when event's registry entry `cooldownMs` is `null`/`undefined`. Min number is 1 (i.e. at least 1 tick of cooldown for the current event if its limit is reached). Converted to ticks and floored. |

<h3>〔 <code><b>EVENT_REGISTRY</b></code> 〕</h3> 

Map of <code>eventName -> [interruptionStatus?, delayMs?, limitMs?, intervalMs?, cooldownMs?]</code>.</br>
<code>interruptionStatus</code> is converted to boolean (if provided). <code>delayMs</code>, <code>limitMs</code>, <code>intervalMs</code>, <code>cooldownMs</code> are converted to ticks and integer-floored internally (if provided).</br>

- <code><ins>interruptionStatus</ins></code>:</br>
  - <code>true</code> -- the event is internally enqueued on each call.</br>
  - <code>false</code> -- the event is called normally, it does not take part in <code>Interruption Manager</code> processeses.</br>
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
You can remove only in the actual <code>World Code</code> those events from <code>EVENT_REGISTRY</code> which you do not use in <code>ACTIVE_EVENTS</code>.</br>
You can change <code>interruptionStatus</code> in the loader configuration only in actual <code>World Code</code>.</br>
<code>tick</code> callback is special and does not have interruption retry setup for itself.

<h3>〔 <code><b>LOG_STYLE</b></code> 〕</h3> 

<code>StyledText</code> objects used by the loader to broadcast logs during and after the last boot session. You can change styles before the new boot starts.

---

<a id="codeloader-api"></a>

## 📚 Codeloader API

Global object <code>Codeloader</code> has following:

```js
/*
 * Read-only accessor of `Configuration` object (sealed).
 * You may mutate existing values by keys (then call `reboot()`),
 * but you cannot add or delete properties.
 */
configuration

/*
 * Whether the boot session is currently running.
 * `true` only during the boot; `false` before the boot stats or after it finishes.
 */
isRunning

/**
 * Clear (dequeue) any interruption state for the given event (callback).
 * If interruption state after the given event (callback) call is not cleared (dequeued),
 * the call is redirected to internal `Interruption Manager` tick with the LAST (only) arguments for next retries.
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
 *  - If the block was not registered (in `Configuration.blocks`) before the boot, it is considered as "locked".
 *
 * @param {[number, number, number]} position - [x, y, z]; non-arrays or invalid length are treated as "locked"
 * @returns {boolean}
 *   - `true` if "locked"
 *   - `false` if "unlocked"
 */
isBlockLocked(position)

/**
 * Start the new boot session using the current (last) configuration.
 * Broadcast warning if the boot session is already running.
 * Replaces `tick` with the boot manager tick dispatcher until the boot completes.
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

/*
 * Other read-only accessors of the loader internal objects (sealed).
 * Recommended not to mutate values in them, as it may lead to unexpected behaviour.
 */
event_manager
interruption_manager
tick_multiplexer
join_manager
block_manager
boot_manager

```

> **Tip**: Use <code>!isBlockLocked(position)</code> in your blocks as a guard (codition block) to avoid unwanted (re-)initialization of the code.

---

<a id="example"></a>

## 🧪 Example

Download the file and paste it using <code>World Builder</code> at position <code>(0, 0, 0)</code>.</br>
Copy the configuration and replace the old with a new one in your actual <code>World Code</code>.</br>

<div align="center">
<h3> ⚙️ Basic setup ⚙️</br> </h3>
</div>

* [`Basic example .bloxdshem`](https://github.com/delfineonx/block-codeloader/blob/main/assets/basic_example.bloxdschem)
* [`Basic configuration`](https://github.com/delfineonx/block-codeloader/blob/main/assets/basic_configuration.js)

<div align="center">
<h3> ⚙️ Advanced setup ⚙️</br> </h3>
</div>
<h6>Includes usage cases of <code>Interruption Manager</code> and <code>!isBlockLocked(position)</code> guard.</h6>

* [`Advanced example .bloxdshem`](https://github.com/delfineonx/block-codeloader/blob/main/assets/advanced_example.bloxdschem)
* [`Advanced configuration`](https://github.com/delfineonx/block-codeloader/blob/main/assets/advanced_configuration.js)

---

<a id="features"></a>

## ✨ Features

<div align="center">
<h3>❮ <code><b>Hide World Code</b></code> ❯</h3> 
</div>

<h3>✦ <em>description</em> ✦</br></h3>
With thise loader you can prevent anyone from stealing (coping) your world code (originally is accessible by pressing `F8` or directly from the code block editor pop-up window, which is also possible in a custom game). Though some (not all) hackers/exploiters can still access data of any block in the world where the chunk is loaded (i.e. your hidden code), and there is no good solution to be safe in a such case. Most you can do is to use <code>obfuscated code</code> in blocks data.

<h3>✦ <em>recommendation</em> ✦</br></h3>
Place all the code blocks that you use for your world code far away enough and/or close them inside some multi-layer (optionally bedrock) box.

<h3>✦ <em>block <code>lockedStatus</code></em> ✦</br></h3>
If you are worried that hacker can somehow evaluate/execute your code in blocks data OR you just don't want anyone to accidentally or intentionally (re-)initialize your world code — then use <code>!isBlockLocked(position)</code> guard. Its usage you may see clearly in <code>Advanced setup</code> of <code>Example</code> section.

<div align="center">
<h3>❮ <code><b>Unlimited World Code</b></code> ❯</h3> 
</div>

<h3>✦ <em>description</em> ✦</br></h3>
<code>16000</code> chars — actual <code>World Code</code> capacity.</br>
<code>13450</code> chars — default loader minified source code.</br>
<code>14850</code> chars — if you include all possible callback names into <code>ACTIVE_EVENTS</code>.</br></br>

Considering the following assumptions:</br>
• <code>[-100000,-100000,-100000,!0,!0],</code> — average max block entry by chars (33),</br>
• <code>[10,10,10,!0,!0],</code> — average min block entry by chars (18);</br>
-- we can get <code>16000 - 14850 = 1150</code> chars of free space which should be enough for <code>30–60+</code> blocks inside actual <code>World Code</code>.</br>

<h3>✦ <em>special method</em> ✦</br></h3>
You can achieve truly UNLIMITED world code by changing <code>Configuration.blocks</code> at runtime, </br>
and then rebooting with the new configuration options.</br></br>

```js
// code block [0,2,5]

if(!Codeloader.isBlockLocked(thisPos)) {

  Codeloader.configuration.blocks = [
    [2,2,2],
    [4,2,2],
    [6,2,2],
    [8,2,2],
  ];

  Codeloader.configuration.boot_delay_ms = 0;
  Codeloader.configuration.boot_manager.show_load_time = true;
  Codeloader.configuration.boot_manager.show_errors = true;
  
  tick = () => {
    if(!Codeloader.isRunning) {
      Codeloader.reboot();
    }
  }

}
```

Here are the corresponding configurations to test for <code>Basic</code> and <code>Advanced</code> setup of <code>Example</code> section:</br>
* [`Basic configuration special`](https://github.com/delfineonx/block-codeloader/blob/main/assets/basic_configuration_special_method.js)
* [`Advanced configuration special`](https://github.com/delfineonx/block-codeloader/blob/main/assets/advanced_configuration_special_method.js)

<div align="center">
<h3>❮ <code><b>Dynamic Initialization</b></code> ❯</h3> 
</div>

<h3>✦ <em>description</em> ✦</br></h3>
This can be really useful when you don't need to reboot your whole world code and just want to partially change some behavior (usually while testing). When you have <ins>code</ins> that is:</br>
• either under <code>!isBlockLocked(position)</code> guard in the code blocks with <code>lockedStatus = false</code>,</br>
• or not guarded with such any type of this thing;</br>
-- it can be evaluated/(re-)initialized (i.e. simply by clicking the code block) <ins>anytime</ins> without using <code>reboot()</code>. And if the <ins>code</ins> has your handler functions (callbacks) inside — they will be updated right away.

<div align="center">
<h3>❮ <code><b>Interruption Handling</b></code> ❯</h3> 
</div>

<h3>✦ <em>description</em> ✦</br></h3>
In the <code>Advanced example</code> bloxd schematic of <code>Example</code> section you may see such usage cases of <code>setInterruptionState(eventName)</code>:</br></br>

```js
eventName = (...args) => {
  Codeloader.setInterruptionState("eventName");
  // other code ...
}
```

Here <code>setInterruptionState</code> is a special functionality supported by built-in <code>Interruption Manager</code>.</br>
It is intended to be used inside and preferably on top of your handler function (callback).</br>
Its main purpose is to ensure the internal machinery (call and return operation of your handler function (callback) in the first place) is not interrupted.</br>
As long as your code inside your handler function (callback) does not include irreparable "player or world state" changes (such as block break, lifeform kill, etc.), you may freely move that <code>setInterruptionState</code> point anywhere inside (before the return statement(-s) obviously).</br>

Consider also the following information (citation from [`codeloader_original.js`](https://github.com/delfineonx/block-codeloader/blob/main/src/codeloader_original.js)):</br>

```js
// if event has special return value, then `interruptionStatus = false` setup is recommended
```

<h3>✦ <em>recommendation</em> ✦</br></h3>

For the basic simple usage of the loader and no dealing with these specifications ensure the next configuration option in actual <code>World Code</code>:</br>

```js
// ...
  interruption_manager: {
    is_enabled: false,
    // ...
  },
// ...
```
and that you do not have any of the following pieces somewhere in your codes:

```js
Codeloader.serInterruptionState("eventName");
```

---

<a id="troubleshooting"></a>

## 🧯 Troubleshooting

- <code>"Unregistered callbacks: ..."</code></br>
: The event in `ACTIVE_EVENTS` has no entry in `EVENT_REGISTRY`. Either rename the event in `ACTIVE_EVENTS` or add an entry to `EVENT_REGISTRY`.

- <code>"setInterruptionState - "..." interruption status is false."</code></br>
: Ensure `interruption_manager.is_enabled = true` and event's `interruptionStatus` flag is `true` in `EVENT_REGISTRY`.

- <code>"setInterruptionState - "..." is invalid active event name."</code></br>
: Ensure the event is in `ACTIVE_EVENTS`.

- <code>"Wait until current running boot session is finished."</code></br>
: You called `Codeloader.reboot()` while the another boot session is already in progress. Try again after it finishes.

- <code>"Undefined error on events primary setup."</code> or <code>"Error on events primary setup - ..."</code></br>
: Loader internal critical error. Ensure the configuration is correct or reinstall the loader source code (paste its minified version again).

- <code>No code executes from my blocks.</code></br>
: 1) Ensure block's `evalStatus` flag (or `default_eval_status`) is `true`.</br>
: 2) Use only anonymous or arrow function expressions assigned to your event handlers (callbacks), as global variables. Do not use function declarations for your event handlers (callbacks) names.

- <code>Changed config (not in actual `World Code`) but behavior didn't update.</code></br>
: Modify `configuration`, then call `Codeloader.reboot()` so the loader re‑reads settings.

- <code>Interrupted events are never retried.</code></br>
: 1) Ensure the configuration is correct, the interruption manager is enabled (`interruption_manager.is_enabled = true`).</br>
: 2) Set the corresponding event `interruptionStatus` flag to `true` and include `Codeloader.setInterruptionState(eventName)` inside your handler (callback) function (preferably on top).

---
