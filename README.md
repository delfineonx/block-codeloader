
---

<div align="center">
  <h1>Code Loader</h1>
  <p>
    Automatically boot your world code, ensure target chunks are loaded,<br>
    and execute code stored as <code>block data</code> or <code>chest data</code>.<br>
    Built-in <code>StorageManager</code> provides an easy workflow for moving code into chest storage.<br>
    Built-in <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a> optionally provides interruption-safe event execution.
  </p>
  <p>
    <a href="#installation"><kbd>Installation</kbd></a> &nbsp;•&nbsp;
    <a href="#quick-start"><kbd>Quick Start</kbd></a> &nbsp;•&nbsp;
    <a href="#api-methods"><kbd>API Methods</kbd></a> &nbsp;•&nbsp;
    <a href="#configuration"><kbd>Configuration</kbd></a> &nbsp;•&nbsp;
    <a href="#storage-manager"><kbd>Storage Manager</kbd></a> &nbsp;•&nbsp;
    <a href="#storage-format"><kbd>Storage Format</kbd></a> &nbsp;•&nbsp;
    <a href="#features"><kbd>Features</kbd></a> &nbsp;•&nbsp;
    <a href="#example"><kbd>Example</kbd></a> &nbsp;•&nbsp;
    <a href="#troubleshooting"><kbd>Troubleshooting</kbd></a>
  </p>
</div>

---

<a id="installation"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📥 Installation 📥</b></code> ❯</h2>
    </div>
  </summary>

  <p>
    Copy the loader source code entirely into your real <code>World Code</code>.<br>
  </p>

  <h3>
    <a href="https://github.com/delfineonx/block-code-loader/blob/main/src/code_loader_minified.js">
      <code><b>minified version</b></code>
    </a>
  </h3>

  <blockquote>
    <p>
      <code><b>! NOTE</b></code><br>
      The loader self-boots on world code init / lobby start.<br>
      You may define extra non-event functions and objects right after the loader source code (below it).
    </p>
  </blockquote>

</details>

---

<a id="quick-start"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>⚡ Quick Start ⚡</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Setup</b></code> 〕</h3>
  </div>

  <p>Inside your real <code>World Code</code>:</p>
  <ul>
    <li>add event names to <code>ACTIVE_EVENTS</code></li>
    <li>add code block positions to <code>BLOCKS</code></li>
  </ul>

```js
// ---------- EXAMPLE ----------
const configuration = {
  ACTIVE_EVENTS: [
    "tick",
    "onPlayerJoin",
    "onPlayerChat",
    "onPlayerJump",
    // ...
  ],
  BLOCKS: [
    [2, 2, 2],
    [4, 2, 2],
    [6, 2, 2],
    [8, 2, 2],
    // ...
  ],
  // other fields remain unchanged
};
```

  <p>
    Distribute your world code among the specified blocks as needed (it has almost no difference in comparison to real <code>World Code</code>).<br>
    Remember that each block runs in its own scope (<a href="https://javascript.info/closure"><code>closure</code></a>).
  </p>

  <div align="left">
    <h3>〔 <code><b>Variables</b></code> 〕</h3>
  </div>

  <p>If your "global" variables were declared with <code>const</code> or <code>let</code> in real <code>World Code</code>, then switch to one of these:</p>
  <ul>
    <li><code>globalThis.variableName = ...</code> <sub>(explicit, recommended)</sub></li>
    <li><code>variableName = ...</code> <sub>(implicit)</sub></li>
    <li><code>var variableName = ...</code> <sub>(implicit)</sub></li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Event Handlers</b></code> 〕</h3>
  </div>

  <p>
    Prefer assigning functions to globals (properties on <code>globalThis</code>).<br>
    Avoid <ins>named function declarations</ins> for callbacks, because when the loader rewires handlers manually (not after world code init), such declarations can behave unexpectedly.
  </p>

  <ul>
    <li><code>✔️ eventName = (...args) =&gt; { ... };</code></li>
    <li><code>✔️ eventName = function (...args) { ... };</code></li>
    <li><code>❌ function eventName(...args) { ... }</code> <sub>(not recommended)</sub></li>
  </ul>

```js
// ---------- EXAMPLE ----------
tick = () => { }; // (2, 2, 2)
onPlayerJump = (playerId) => { }; // (4, 2, 2)
onPlayerChat = function (playerId, chatMessage, channelName) { }; // (6, 2, 2)
onPlayerJoin = function (playerId, fromGameReset) { }; // (8, 2, 2)
// ...
```

  <div align="left">
    <h3>〔 <code><b>Guard Pattern</b></code> 〕</h3>
  </div>

  <p>
    If you want to prevent manual execution when a player clicks the code block, wrap the content with <code>if (myId === null) { ... }</code>.<br>
    This makes such code to be possible to execute only during loader boot process.<br>
  </p>

</details>

---

<a id="api-methods"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📚 API Methods 📚</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Code Loader</b></code> 〕</h3>
  </div>

  <p><code>globalThis.CL</code> / <code>CL</code> exposes:</p>

```js
/*
 * Accessor of `Storage Manager` object (frozen).
 */
SM

/*
 * Accessor of `configuration` object (sealed).
 * You may mutate existing keys (then call `CL.reboot()`),
 * but you cannot add or delete properties.
 */
config

/*
 * `true` while the current running boot session is "primary".
 * (i.e. performed right after the world code init)
 * `false` after the boot is finished.
 */
isPrimaryBoot

/*
 * `true` while the boot session is currently running.
 * `false` after the boot is finished.
 *
 * It can be useful to resolve conflicts,
 * when actions in callbacks depend on not initizalied states during boot.
 */
isRunning

/**
 * Start a new boot session using the current (last) config.
 * Broadcast warning if a boot session is already running.
 *
 * @returns {void}
 */
reboot()

/**
 * Broadcast load time and errors count of the last boot.
 *
 * @param {boolean} [showErrors = true] - Whether to show errors count.
 * @returns {void}
 */
bootLogs(showErrors)

/**
 * Broadcast collected execution (evaluation) errors from the last boot.
 *
 * @param {boolean} [showSuccess = true] - Whether to show log message in case of 0 errors.
 * @returns {void}
 */
errorLogs(showSuccess)

/**
 * Broadcast which blocks or storage were executed.
 *
 * @returns {void}
 */
executionLogs()

 /**
 * Broadcast summary of the last boot:
 * config issues + boot logs + errors + execution list.
 *
 * @param {boolean} [showBootLogs = true]
 * @param {boolean} [showErrorLogs = true]
 * @param {boolean} [showExecutionLogs = false]
 * @returns {void}
 */
completeLogs(showBootLogs, showErrorLogs, showExecutionLogs)
```

  <div align="left">
    <h3>〔 <code><b>Storage Manager</b></code> 〕</h3>
  </div>

  <p><code>globalThis.CL.SM</code> / <code>CL.SM</code> exposes:</p>

```js
/**
 * Create a registry unit (chest-like container) and store region bounds in slot 0.
 *
 * @param {[number, number, number]} lowPosition - bottom left corner [x,y,z]
 * @param {[number, number, number]} highPosition - top right corner [x,y,z]
 * @returns {void}
 */
create(lowPosition, highPosition)

/**
 * Broadcast info from an existing registry unit.
 *
 * @param {[number, number, number]} registryPosition
 * @returns {void}
 */
check(registryPosition)

/**
 * Convert code in blocks into chest storage inside the registered region.
 * Task is queued to tick.
 *
 * @param {[number, number, number]} registryPosition
 * @param {Array<[number, number, number]>} blocks
 * @param {number} [maxStorageUnitsPerTick = 16]
 * @returns {void}
 */
build(registryPosition, blocks, maxStorageUnitsPerTick)

/**
 * Remove all storage units and registry entries, but keep registry unit with slot 0.
 * Task is queued to tick.
 *
 * @param {[number, number, number]} registryPosition
 * @param {number} [maxStorageUnitsPerTick = 32]
 * @returns {void}
 */
dispose(registryPosition, maxStorageUnitsPerTick = 32)

/**
 * Internal task processor.
 * Called automatically by the loader each tick.
 *
 * @returns {void}
 */
tick()
```

</details>

---

<a id="configuration"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🛠️ Configuration 🛠️</b></code> ❯</h2>
    </div>
  </summary>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>Most config objects are <ins>sealed</ins> on world code init.</li>
        <li><code>EVENT_REGISTRY</code> and <code>STYLES</code> are <ins>frozen</ins>.</li>
        <li>You can change existing values by key and then call <code>CL.reboot()</code>.</li>
        <li>You cannot add or remove properties (prevents accidental shape changes).</li>
      </ul>
    </p>
  </blockquote>

```js
const configuration = {
  ACTIVE_EVENTS: [ ... ],
  BLOCKS: [ ... ],
  boot_manager: { ... },
  block_manager: { ... },
  join_manager: { ... },
  event_manager: { ... },
  EVENT_REGISTRY: { ... },
  STYLES: [ ... ],
};
```

  <blockquote>
    <p>
      <h4><code><b>! IMPORTANT</b></code></h4>
      Do not remove config properties (or their values in particular cases) from real <code>World Code</code> unless it is allowed in this documentation.
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>ACTIVE_EVENTS</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>Defines which in-game callbacks the loader wires and manages.</li>
        <li><ins>Recommendation:</ins> include only events you actually use.</li>
        <li><code>tick</code> callback is special (handled separately).</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h4>⊂ <code><b>Supported entries</b></code> ⊃</h4>
  </div>

  <ul>
    <li>
      <code>"eventName"</code>
      <ul>
        <li>uses default fallback from <code>EVENT_REGISTRY[eventName][0]</code></li>
      </ul>
    </li>
    <li>
      <code>["eventName", fallbackValue?]</code>
      <ul>
        <li><code>"undefined"</code> sets fallback value to actual <code>undefined</code></li>
        <li>omitted / <code>undefined</code> uses registry fallback</li>
        <li>any other value -- sets fallback directly as provided</li>
      </ul>
    </li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Event Wiring</b></code> ⊃</h4>
  </div>

  <ul>
    <li>the loader creates <code>globalThis.eventName(...args)</code> wrappers</li>
    <li>your handler is stored as a delegator: <code>EventManager.delegator[eventName]</code></li>
    <li>the wrapper returns whatever your delegator returns</li>
  </ul>

  <blockquote>
    <p>
      <h4><code><b>! NOTE</b></code></h4>
      <ul>
        <li>Changing <code>ACTIVE_EVENTS</code> at runtime only affects fallback values setup on reboot.</li>
        <li>Event wrapper installation is created on world init based on the initial list (i.e. can be changed only in real <code>World Code</code>).</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>BLOCKS</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>List of block positions that contain your stored code.</li>
        <li>Each entry is <code>[x, y, z]</code> (use integers; numbers are not floored by the loader).</li>
        <li>Invalid entries are ignored.</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h4>⊂ <code><b>Storage type</b></code> ⊃</h4>
  </div>

  <ul>
    <li>
      <code><b>block data</b></code>
      <ul>
        <li><code>block_manager.is_chest_data = false</code></li>
        <li>execution order = order of entries in <code>BLOCKS</code></li>
      </ul>
    </li>
    <li>
      <code><b>chest data</b></code>
      <ul>
        <li><code>block_manager.is_chest_data = true</code></li>
        <li><code>BLOCKS</code> should contain only one entry: <code>[registryX, registryY, registryZ]</code></li>
        <li>execution order = storage order inside the registry (see <a href="#storage-format">Storage Format</a>)</li>
      </ul>
    </li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>boot_manager</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>boot_delay_ms</code></td>
        <td align="right">Number</td>
        <td align="right"><code>100</code></td>
        <td>Delay (in milliseconds) before continuing with main processes of boot session. Min 0. Converted to ticks and floored.</td>
      </tr>
      <tr>
        <td><code>show_boot_logs</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to broadcast load time and errors count after boot.</td>
      </tr>
      <tr>
        <td><code>show_error_logs</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to broadcast collected execution (evaluation) errors after boot.</td>
      </tr>
      <tr>
        <td><code>show_execution_logs</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>false</code></td>
        <td>Whether to broadcast executed (evaluated) blocks/storage positions after boot.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>join_manager</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>reset_on_reboot</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to re-process join for all online players on reboot (even if already processed).</td>
      </tr>
      <tr>
        <td><code>max_dequeue_per_tick</code></td>
        <td align="right">Number</td>
        <td align="right"><code>16</code></td>
        <td>Max players dequeued per tick during boot by <code>Join Manager</code>. Min 1. Integer-floored.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>block_manager</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>is_chest_data</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>false</code></td>
        <td>Whether to read and execute from chest storage (registry) instead of block data.</td>
      </tr>
      <tr>
        <td><code>max_executions_per_tick</code></td>
        <td align="right">Number</td>
        <td align="right"><code>16</code></td>
        <td>Max blocks (or storage partitions) executions per tick during boot. Min 1. Integer-floored.</td>
      </tr>
      <tr>
        <td><code>max_errors_count</code></td>
        <td align="right">Number</td>
        <td align="right"><code>32</code></td>
        <td>Max errors count to retain. Min 0. Integer-floored.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>event_manager</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>is_framework_enabled</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>false</code></td>
        <td>Master switch for using <code>Interruption Framework</code> for events setup (set only in real <code>World Code</code>).</td>
      </tr>
      <tr>
        <td><code>default_retry_limit</code></td>
        <td align="right">Number</td>
        <td align="right"><code>2</code></td>
        <td>Default retry budget when a registry entry omits <code>retryLimit</code>. Min 1. Integer-floored.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>EVENT_REGISTRY</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>Map (object): <code>eventName -> [fallbackValue?, interruptionStatus?, retryLimit?]</code> or <code>null</code></li>
        <li><code>fallbackValue</code> is applied via <code>api.setCallbackValueFallback(eventName, value)</code></li>
        <li><code>interruptionStatus</code> is converted to boolean</li>
        <li><code>retryLimit</code> is integer-floored and used only when framework is enabled</li>
      </ul>
    </p>
  </blockquote>

  <blockquote>
    <p>
      <h4><code><b>! NOTE</b></code></h4>
      <ul>
        <li>Do not rename keys inside <code>EVENT_REGISTRY</code> (keep valid callback names).</li>
        <li>You may remove registry entries only for events you will never put into <code>ACTIVE_EVENTS</code>.</li>
        <li>Registry values should be changed only in real <code>World Code</code>.</li>
        <li><code>tick</code> is special and can be <code>null</code>.</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>STYLES</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>Flat array of <code>StyledText</code> values used for loader logs.</li>
        <li>Format: <code>[color, fontWeight, fontSize, ...]</code> for 4 message types.</li>
      </ul>
    </p>
  </blockquote>

```js
STYLES: [
  "#FF775E", "500", "0.95rem", // error (type 0)
  "#FFC23D", "500", "0.95rem", // warning (type 1)
  "#20DD69", "500", "0.95rem", // success (type 2)
  "#52B2FF", "500", "0.95rem", // info (type 3)
]
```

</details>

---

<a id="storage-manager"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🛡️ Storage Manager 🛡️</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Purpose</b></code> 〕</h3>
  </div>

  <ul>
    <li>Moves your code from block data into chest item attributes (impossible to steal).</li>
    <li>Provides a deterministic "storage registry" so the loader can find and execute code later.</li>
    <li>Can spread work across ticks to avoid interruption issues.</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Workflow</b></code> 〕</h3>
  </div>

```js
// 1) Create a registry (defines region where storage units can be placed)
CL.SM.create([lowX, lowY, lowZ], [highX, highY, highZ]);

// 2) Build storage from your block list
CL.SM.build([registryX, registryY, registryZ], [
  [2, 2, 2],
  [4, 2, 2],
  [6, 2, 2],
  [8, 2, 2],
]);
```

```js
// 3) Switch loader to chest mode

// Either in real `World Code` (recommended)
const configuration = {
  // ...
  BLOCKS: [
    [registryX, registryY, registryZ]
  ],
  // ...
  block_manager: {
    is_chest_data: true,
    // ...
  },
  // ...
};

// Or at runtime
CL.config.block_manager.is_chest_data = true;
CL.config.BLOCKS = [[registryX, registryY, registryZ]];
CL.reboot();
```

  <div align="left">
    <h3>〔 <code><b>Capacity</b></code> 〕</h3>
  </div>

  <p>
    One storage unit stores up to 4 blocks (4 partitions).<br>
    Therefore, required storage units: <code>Math.floor((blocks.length + 7) / 4)</code>.
  </p>

  <p>
    Region capacity is the number of blocks inside the axis-aligned box: <code>(dx + 1) * (dy + 1) * (dz + 1)</code>.<br>
    If capacity is smaller than required units, build will refuse.
  </p>

  <div align="left">
    <h3>〔 <code><b>Performance</b></code> 〕</h3>
  </div>

  <ul>
    <li>Use smaller <code>maxStorageUnitsPerTick</code> if you get many interruptions:<code>CL.SM.build(regPos, blocks, 4)</code></li>
    <li>Use larger values if you want faster conversion and your world runtime can handle it.</li>
    <li>Storage tasks require the relevant chunks to be loaded. If a chunk is unloaded, the task pauses and resumes later.</li>
  </ul>

  <blockquote>
    <p>
      <h4><code><b>! IMPORTANT</b></code></h4>
      <ul>
        <li>Use smaller <code>maxStorageUnitsPerTick</code> if you get many interruptions:<code>CL.SM.build(regPos, blocks, 4)</code>.</li>
        <li>Use larger values if you want faster conversion and your world runtime can handle it.</li>
        <li>Storage tasks require the relevant chunks to be loaded. If a chunk is unloaded, the task will throw an error.</li>
      </ul>
    </p>
  </blockquote>

  <blockquote>
    <p>
      <h4><code><b>! SAFETY NOTE</b></code></h4>
      <ul>
        <li><code>build()</code> places solid blocks (default: <code>"Bedrock"</code>) for each storage unit.</li>
        <li>Plan the region far away from gameplay, or in a sealed protected area.</li>
      </ul>
    </p>
  </blockquote>

</details>

---

<a id="storage-format"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🗂️ Storage Format 🗂️</b></code> ❯</h2>
    </div>
  </summary>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>This section documents how the built-in format works (useful for debugging or for custom tooling).</li>
        <li>Storage consists of a <b>registry unit</b> and many <b>storage units</b>.</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>Registry Unit</b></code> 〕</h3>
  </div>

  <ul>
    <li>Position: <code>BLOCKS[0]</code> when <code>is_chest_data = true</code></li>
    <li>Slot 0 must contain <code>item.attributes.customAttributes.region = [lowX,lowY,lowZ,highX,highY,highZ]</code></li>
    <li>Slots 1..35 store coordinate lists of storage units in <code>item.attributes.customAttributes._</code></li>
    <li>Each coordinate list is a flat array: <code>[x0,y0,z0, x1,y1,z1, ...]</code></li>
  </ul>

  <blockquote>
    <p>
      Each registry slot can store up to <code>243</code> numbers (= <code>81</code> positions).<br>
      If you have more storage units, the manager writes multiple slots.
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>Storage Unit</b></code> 〕</h3>
  </div>

  <ul>
    <li>Physically: a block placed at some <code>(x,y,z)</code> inside the registry region.</li>
    <li>Logically: a chest container at that position holding code chunks.</li>
    <li>Contains <ins>4 partitions</ins> (so one storage unit stores up to 4 code blocks data)</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Partitions & Slots</b></code> 〕</h3>
  </div>

  <p>
    Each partition uses <ins>9 slots</ins> (total 36 slots in a chest):
  </p>

  <ul>
    <li>Partition <code>0</code>: slots <code>0..8</code></li>
    <li>Partition <code>1</code>: slots <code>9..17</code></li>
    <li>Partition <code>2</code>: slots <code>18..26</code></li>
    <li>Partition <code>3</code>: slots <code>27..35</code></li>
  </ul>

  <p>
    Each slot stores a <ins>raw string</ins> chunk in <code>item.attributes.customAttributes._</code>.<br>
    To execute a partition, the loader concatenates up to 9 chunks and calls <code>(0, eval)(code)</code>.
  </p>

</details>

---

<a id="features"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>✨ Features ✨</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Hide World Code</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>✦ <em>Description</em> ✦</h4>
  </div>

  <p>
    Moving your logic into block data (code blocks) prevents casual copying of your world code
    (normally accessible via <kbd>F8</kbd> or directly from the code editor, including in custom games).
    However, block data can still be easily read by attackers (exploiters) where the chunk is loaded.
  </p>

  <p>
    For maximum protection, move your code from blocks into chest storage using the
    <code>Storage Manager</code>. Chest data is effectively impossible to steal in practice.
  </p>

  <div align="left">
    <h4>✦ <em>Recommendations</em> ✦</h4>
  </div>

  <ul>
    <li>Place code blocks or storage far away from gameplay areas.</li>
    <li>Seal them inside a protected multi-layer structure (optionally bedrock).</li>
    <li>Optionally use the guard pattern to prevent manual execution by clicking blocks.</li>
  </ul>

```js
if (myId === null) {
  // runs only during loader boot (not on manual click)
}
```

  <div align="left">
    <h3>〔 <code><b>Unlimited World Code</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>✦ <em>Description</em> ✦</h4>
  </div>

  <p>
    Real <code>World Code</code> is limited to <code>16000</code> characters.
    The loader bypasses this restriction by distributing your logic across any number of blocks or chest storage units.
  </p>

  <ul>
    <li>Execution order follows <code>BLOCKS</code> (or storage order in chest mode).</li>
    <li>The practical limit becomes Bloxd memory, not the editor.</li>
    <li>In practice, <code>BLOCKS</code> array in configuration can have roughly <code>~8000</code> code block positions.</li>
  </ul>

  <div align="left">
    <h4>✦ <em>Capacity</em> ✦</h4>
  </div>

  <p>
    <code>16000</code> chars — real <code>World Code</code> capacity.<br>
    <code>13610</code> chars — default loader minified source.<br>
    <code>15890</code> chars — configuration fully populated
    (<code>ACTIVE_EVENTS</code> maxed out, all entries in <code>EVENT_REGISTRY</code> fully defined).
  </p>

  <p>
    With typical block coordinate sizes:
  </p>

  <ul>
    <li><code>[-100000,-100000,-100000]</code> → ~27 chars</li>
    <li><code>[10,10,10]</code> → ~12 chars</li>
  </ul>

  <p>
    This leaves ~<code>110</code> free characters, enough for approximately
    <code>4–9+</code> block positions directly inside real <code>World Code</code>.
  </p>

  <div align="left">
    <h4>✦ <em>Extend Config Method</em> ✦</h4>
  </div>

  <p>
    You can dynamically replace <code>CL.config.BLOCKS</code> at runtime and then call
    <code>CL.reboot()</code>. This allows staged loading of large codebases while keeping
    only a single block position in real <code>World Code</code>.
  </p>

```js
if (myId === null) {
  CL.config.BLOCKS = [
    [2, 2, 2],
    [4, 2, 2],
    [6, 2, 2],
    [8, 2, 2],
  ];

  tick = () => {
    if (!CL.isRunning) {
      CL.reboot();
    }
  };
}
```

  <div align="left">
    <h3>〔 <code><b>Dynamic Initialization</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>✦ <em>Description</em> ✦</h4>
  </div>

  <p>
    During development or testing, you may want to refresh only part of your logic
    instead of rebooting everything. The loader supports both partial and complete re-initialization.
  </p>

  <ul>
    <li><code>Partial:</code> click a specific code block to re-execute only that block.</li>
    <li><code>Complete:</code> call <code>CL.reboot()</code> to run a full boot session.</li>
  </ul>

  <p>
    If executed code defines callback handlers, they are replaced immediately, making hot-swapping logic possible.
  </p>

  <div align="left">
    <h3>〔 <code><b>Interruption Handling</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>✦ <em>Description</em> ✦</h4>
  </div>

  <p>
    Bloxd execution can be interrupted mid-flow.
    The built-in <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a>
    allows interrupted calls to be queued and retried safely and efficiently for selected selected events.
  </p>

  <ul>
    <li>Enable via <code>event_manager.is_framework_enabled = true</code> (in real <code>World Code</code> only).</li>
    <li>Mark events with <code>interruptionStatus = true</code> in <code>EVENT_REGISTRY</code>.</li>
    <li>Retry budget is <code>retryLimit</code> (or <code>default_retry_limit</code>).</li>
  </ul>

  <div align="left">
    <h4>✦ <em>Installation</em> ✦</h4>
  </div>

  <p>
    The framework runner must be called every tick (preferably at the very top).
  </p>

```js
tick = () => {
  IF.tick(); // required
  // your logic
};
```

  <p>
    The loader provides automatic interruption tracking and cleanup even after handlers return for selected events.
    Outer-level framework setup is used internally for safety and convenience.
    You may still use custom interruption handling with the help of framework inside your callback handler function.
  </p>

```js
eventName = (...args) => {
  IF.state = 0; // clear interruption tracking
  // other code ...
};
```

  <blockquote>
    <p>
      <h4><code><b>! TIP</b></code></h4>
      Resetting with <code>IF.state = 0</code> inside can be useful when splitting handler logic into independent parts that should not share the same retry setup.
    </p>
  </blockquote>

</details>

---

<a id="installation"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧪 Example 🧪</b></code> ❯</h2>
    </div>
  </summary>

  <blockquote>
    <p>
      <h3><code><b>in progress...</b></code></h3>
    </p>
  </blockquote>

</details>

---

<a id="troubleshooting"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧯 Troubleshooting 🧯</b></code> ❯</h2>
    </div>
  </summary>

  <ul>
    <li>
      <code>"Unregistered active events: ..."</code><br>
      The event exists in <code>ACTIVE_EVENTS</code> but is missing from <code>EVENT_REGISTRY</code>.
      Fix the name or add an entry to the registry.
    </li>
    <li>
      <code>"Invalid active events: ..."</code><br>
      The loader couldn't wire the event (usually due to runtime changes to <code>ACTIVE_EVENTS</code>).
      Keep the event in the initial real <code>World Code</code> list, or do correct runtime changes before reboot.
    </li>
    <li>
      <code>"Reboot request was denied."</code><br>
      You called <code>CL.reboot()</code> while a boot session is already running.
      Wait until <code>CL.isRunning</code> becomes <code>false</code> (i.e. boot session is finished).
    </li>
    <li>
      <code>"Error on primary setup - ..."</code><br>
      A critical loader error happened right after world code init.
      Reinstall the loader and make sure your configuration is correct.
    </li>
    <li>
      <b>No code executes from blocks</b><br>
      <ol>
        <li>Ensure positions in <code>BLOCKS</code> are correct (use <code>CL.executionLogs()</code>).</li>
        <li>Avoid named function declarations for events; assign handler functions to globals.</li>
      </ol>
    </li>
    <li>
      <b>Chest mode says "No storage data found"</b><br>
      <ol>
        <li>Check that <code>BLOCKS = [[registryX, registryY, registryZ]]</code>.</li>
        <li>Ensure the registry unit slot 0 has <code>customAttributes.region</code> (run <code>CL.SM.check()</code>).</li>
      </ol>
    </li>
    <li>
      <b>Storage tasks never finish</b><br>
      <ol>
        <li>Make sure the region is loaded (teleport near it while building/disposing).</li>
        <li>Lower per-tick budgets if you get many interruptions due to world execution runtime limit; raise them if you want faster progress.</li>
      </ol>
    </li>
    <li>
      <b>Interrupted events are never retried</b><br>
      <ol>
        <li><code>event_manager.is_framework_enabled</code> must be <code>true</code> in real World Code.</li>
        <li>Set <code>EVENT_REGISTRY[eventName][1] = true</code> for that event.</li>
        <li>Ensure the event is included in <code>ACTIVE_EVENTS</code>.</li>
      </ol>
    </li>
  </ul>

</details>

---

<div align="center">
  <h2>❮ <code><b>📜 License & Credits</b></code> ❯</h2>
</div>

<ul>
  <li>Copyright (c) 2025-2026 delfineonx</li>
  <li>Licensed under the Apache License, Version 2.0</li>
  <li>Includes <code>Interruption Framework</code> by delfineonx</li>
</ul>

---
