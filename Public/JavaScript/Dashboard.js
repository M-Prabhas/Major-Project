toolbox = document.getElementById("toolbox");

// #region block definitions
Blockly.defineBlocksWithJsonArray([{
  "type": "configure_pin",
  "message0": "configure pin %1 as %2",
  "args0": [
    {
      "type": "input_value",
      "name": "pin_num",
      "check": "Number"
    },
    {
      "type": "field_dropdown",
      "name": "pin_mode",
      "options": [
        [
          "input",
          "machine.Pin.IN"
        ],
        [
          "output",
          "machine.Pin.OUT"
        ]
      ]
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "pin_var",
  "message0": "pin %1 as %2",
  "args0": [
    {
      "type": "input_value",
      "name": "pin_num",
      "check": "Number"
    },
    {
      "type": "field_dropdown",
      "name": "pin_mode",
      "options": [
        [
          "input",
          "machine.Pin.IN"
        ],
        [
          "output",
          "machine.Pin.OUT"
        ]
      ]
    }
  ],
  "inputsInline": true,
  "output": "Pin",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "sleep_ms",
  "message0": "sleep for %1 ms",
  "args0": [
    {
      "type": "input_value",
      "name": "sleep_time_ms",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 90,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "change_pin_state",
  "message0": "turn %1 pin %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "pin_state",
      "options": [
        [
          "on",
          "on"
        ],
        [
          "off",
          "off"
        ]
      ]
    },
    {
      "type": "input_value",
      "name": "pin_to_change",
      "check": "Pin"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}]);
// #endregion block definitions

// #region code generation
python.pythonGenerator.forBlock['configure_pin'] = function (block, generator) {
  var value_pin_num = generator.valueToCode(block, 'pin_num', python.Order.ATOMIC);
  var dropdown_pin_mode = block.getFieldValue('pin_mode');
  // TODO: Assemble python into code variable.
  var code = `machine.Pin(${value_pin_num}, ${dropdown_pin_mode})\n`;
  return code;
};

python.pythonGenerator.forBlock['pin_var'] = function (block, generator) {
  var value_pin_num = generator.valueToCode(block, 'pin_num', python.Order.ATOMIC);
  var dropdown_pin_mode = block.getFieldValue('pin_mode');
  // TODO: Assemble python into code variable.
  var code = `machine.Pin(${value_pin_num}, ${dropdown_pin_mode})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, generator.ORDER_NONE];
};

python.pythonGenerator.forBlock['sleep_ms'] = function (block, generator) {
  var value_sleep_time_ms = generator.valueToCode(block, 'sleep_time_ms', python.Order.ATOMIC);
  // TODO: Assemble python into code variable.
  var code = `from time import sleep_ms\nsleep_ms(${value_sleep_time_ms})\n`;
  return code;
};

python.pythonGenerator.forBlock['change_pin_state'] = function (block, generator) {
  var dropdown_pin_state = block.getFieldValue('pin_state');
  var value_pin_to_change = generator.valueToCode(block, 'pin_to_change', python.Order.ATOMIC);
  // TODO: Assemble python into code variable.
  var code = `${value_pin_to_change}.${dropdown_pin_state}()\n`;
  return code;
};
// #endregion code generation

var wkspc_options = {
  toolbox: toolbox,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  // maxTrashcanContents: 0,
  horizontalLayout: false,
  toolboxPosition: 'start',
  css: true,
  // media: 'https://blockly-demo.appspot.com/static/media/',
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
  grid: {
    spacing: 20,
    length: 1,
    colour: '#888',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  toolbox: toolbox
};


// The toolbox gets passed to the configuration struct during injection.
const workspace = Blockly.inject('blocklyDiv', wkspc_options);

// Initialize backpack plugin
const backpack = new Backpack(workspace);
backpack.init();

// load saved workspace-state if any
if (localStorage.getItem('workspace-state') == null) {
  console.log("state is not der");
}
else {
  console.log("STÆT!");
  // Get your saved state from somewhere, e.g. local storage.
  const state = localStorage.getItem('workspace-state');
  // Deserialize the state.
  Blockly.serialization.workspaces.load(JSON.parse(state), workspace);
}

//configure WebSocket to esp8266
const addressbox = document.getElementById("addressbox");
let esp8266 = new WebSocket(addressbox.value);
esp8266.binaryType = 'arraybuffer';
esp8266.onopen = (event) => {
  console.log("cnxn open\n" + String(event.data));
  //authenticate webREPL
  esp8266.send("sugadik\r");
  document.getElementById("sendbtn").removeAttribute("disabled");
}
esp8266.onmessage = function (event) {
  var ret = String(event.data);
  console.log(ret);
}
esp8266.onclose = function (event) {
  console.log("cl0xed");
  document.getElementById("sendbtn").setAttribute("disabled", "");
}


function saveWorkspace() {
  // Serialize the state.
  const workspace_state = Blockly.serialization.workspaces.save(workspace);
  // Then you save the state, e.g. to local storage.
  localStorage.setItem('workspace-state', JSON.stringify(workspace_state));

}

var codebox = document.querySelector("#codebox");

function generateCode() {
  codebox.textContent = python.pythonGenerator.workspaceToCode(workspace);
}

function reconnect() {
  esp8266.close();
  esp8266 = new WebSocket(addressbox.value);
}

function sendCode() {
  console.log(codebox.textContent);

  //start programming
  progamDevice(esp8266, codebox.textContent + "\r");
  //close port after programming
  // esp8266.close(0, "Programmed!");


  // fetch('/sendcode', {
  //   method: 'POST',
  //   body: JSON.stringify({ code: codebox })
  // }).then(
  //   response => {
  //     if (!response.ok) {
  //       var warner = document.querySelector(".alert");
  //       //  warner.classList.add("alert");
  //       warner.style.display = "block"; // Show the element
  //     }
  //   }
  // )
  //   .catch(error => {
  //     console.error('Error:', error);
  //     // Update the warning message
  //     var warner = document.querySelector(".alert");
  //     //  warner.classList.add("alert");
  //     warner.style.display = "block"; // Show the element
  //   });
}