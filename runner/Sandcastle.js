let defaultAction;
const registered = new Map();

const Sandcastle = {
  reset() {},

  declare(key) {
    try {
      let stack = "";
      try {
        throw new Error();
      } catch (error) {
        if (error instanceof Error && error.stack !== undefined) {
          stack = error.stack.toString();
        }
      }
      const needle = ":";
      const pos = stack.indexOf(needle);
      if (pos >= 0) {
        registered.set(key, parseInt(stack.substring(pos + needle.length), 10));
      }
    } catch {
      // Ignore browsers without usable stack traces.
    }
  },

  highlight() {},

  finishedLoading() {
    try {
      Sandcastle.reset();
      if (defaultAction) {
        Sandcastle.highlight(defaultAction);
        defaultAction();
        defaultAction = undefined;
      }
    } finally {
      document.body.classList.remove("sandcastle-loading");
    }
  },

  addToggleButton(text, checked, onchange, toolbarId) {
    Sandcastle.declare(onchange);

    const input = document.createElement("input");
    input.checked = checked;
    input.type = "checkbox";

    const label = document.createElement("label");
    label.appendChild(document.createTextNode(text));

    const field = document.createElement("div");
    field.className = "sandcastle-toggle";
    field.appendChild(input);
    field.appendChild(label);
    field.onclick = function () {
      Sandcastle.reset();
      input.checked = !input.checked;
      onchange(input.checked);
    };

    document.getElementById(toolbarId || "toolbar").appendChild(field);
  },

  addToolbarButton(text, onclick, toolbarId) {
    Sandcastle.declare(onclick);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.onclick = function () {
      Sandcastle.reset();
      onclick();
    };
    document.getElementById(toolbarId || "toolbar").appendChild(button);
  },

  addDefaultToolbarButton(text, onclick, toolbarId) {
    Sandcastle.addToolbarButton(text, onclick, toolbarId);
    defaultAction = onclick;
  },

  addToolbarMenu(options, toolbarId) {
    const menu = document.createElement("select");
    menu.onchange = function () {
      Sandcastle.reset();
      const item = options[menu.selectedIndex];
      if (item && typeof item.onselect === "function") {
        item.onselect();
      }
    };

    if (!defaultAction && typeof options[0].onselect === "function") {
      defaultAction = options[0].onselect;
    }

    for (let i = 0; i < options.length; ++i) {
      const option = document.createElement("option");
      option.textContent = options[i].text;
      option.value = options[i].value ?? String(i);
      menu.appendChild(option);
    }

    document.getElementById(toolbarId || "toolbar").appendChild(menu);
  },

  addDefaultToolbarMenu(options, toolbarId) {
    Sandcastle.addToolbarMenu(options, toolbarId);
    defaultAction = options[0].onselect;
  },
};

export default Sandcastle;
