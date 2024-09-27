// INSTRUCTIONS //
const instructions = [
    {
        text: "Move forward",
        act: () => {
            arrow.x += 60 * Math.cos(arrow.angle);
            arrow.y += 60 * Math.sin(arrow.angle);
        }
    },
    {
        text: "Move forward a small amount",
        act: () => {
            arrow.x += 25 * Math.cos(arrow.angle);
            arrow.y += 25 * Math.sin(arrow.angle);
        }
    },
    {
        text: "Turn 90deg clockwise",
        act: () => {
            arrow.angle += Math.PI / 2;
        }
    },
    {
        text: "Turn 90deg anti-clockwise",
        act: () => {
            arrow.angle -= Math.PI / 2;
        }
    },
    {
        text: "Turn 10deg clockwise",
        act: () => {
            arrow.angle += (Math.PI / 2) / 9;
        }
    },
    {
        text: "Turn 10deg anti-clockwise",
        act: () => {
            arrow.angle -= (Math.PI / 2) / 9;
        }
    },
    {
        text: "Draw a circle",
        act: () => {
            ctx.beginPath();
            ctx.arc(arrow.x, arrow.y, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    {
        text: "Flip a coin. If heads, skip the next step",
        act: () => {
            if (Math.random() < 0.5) {
                step++;
            }
        }
    }
];

const lookup = {};

for (const ins of instructions) {
    lookup[ins.text] = ins;
}

// ELEMENTS //
const inventoryPanel = document.getElementById("inventory");
const algorithmPanel = document.getElementById("algorithm");
const spacePanel = document.getElementById("space");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const arrowElement = document.getElementById("arrow");

const playButton = document.getElementById("play");
const loopButton = document.getElementById("loop");
const resetButton = document.getElementById("reset");

let insDraggingElem = null;
let insDraggingX = 0;
let insDraggingY = 0;
let insDragging = null;

// UI SETUP //
for (let i = 0; i < instructions.length; i++) {
    const ins = instructions[i];

    const insCreator = document.createElement("div");
    insCreator.classList.add("ins-creator");
    insCreator.innerText = ins.text;
    inventoryPanel.appendChild(insCreator);

    insCreator.addEventListener("mousedown", event => {
        insDraggingElem = document.createElement("div");
        insDraggingElem.classList.add("ins-dragging");
        insDraggingElem.innerText = ins.text;
        insDragging = ins;

        const rect = insCreator.getBoundingClientRect();
        insDraggingX = event.clientX - rect.x;
        insDraggingY = event.clientY - rect.y;

        insDraggingElem.style.left = (event.clientX - insDraggingX) + "px";
        insDraggingElem.style.top = (event.clientY - insDraggingY) + "px";

        document.body.appendChild(insDraggingElem);
    });
}

for (const slot of document.querySelectorAll(".ins-slot")) {
    slot.addEventListener("mousedown", event => {
        if (!slot.dataset.ins) {
            return;
        }

        const ins = lookup[slot.dataset.ins];

        insDraggingElem = document.createElement("div");
        insDraggingElem.classList.add("ins-dragging");
        insDraggingElem.innerText = ins.text;
        insDragging = ins;

        const rect = slot.getBoundingClientRect();
        insDraggingX = event.clientX - rect.x;
        insDraggingY = event.clientY - rect.y;

        insDraggingElem.style.left = (event.clientX - insDraggingX) + "px";
        insDraggingElem.style.top = (event.clientY - insDraggingY) + "px";

        document.body.appendChild(insDraggingElem);

        delete slot.dataset.ins;
        slot.innerText = null;

    });
}

// CANVAS SETUP //

const arrow = {
    oldX: 0,
    oldY: 0,
    x: 0,
    y: 0,
    angle: 0,
};

function reset() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width;
    canvas.height = height;

    const uiLeftWidth = inventoryPanel.getBoundingClientRect().width + algorithmPanel.getBoundingClientRect().width;
    arrow.x = uiLeftWidth + (width - uiLeftWidth) / 2;
    arrow.y = height / 2;

    arrow.oldX = arrow.x;
    arrow.oldY = arrow.y;

    arrow.angle = Math.PI / 2;

    render();
}

function render() {
    arrowElement.style.left = arrow.x + "px";
    arrowElement.style.top = arrow.y + "px";
    arrowElement.style.transform = `rotate(${arrow.angle}rad)`;

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(arrow.oldX, arrow.oldY);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.stroke();

    arrow.oldX = arrow.x;
    arrow.oldY = arrow.y;
}

document.body.addEventListener("mousemove", event => {
    if (insDraggingElem) {
        insDraggingElem.style.left = (event.clientX - insDraggingX) + "px";
        insDraggingElem.style.top = (event.clientY - insDraggingY) + "px";
    }
});

document.body.addEventListener("mouseup", event => {
    if (insDraggingElem) {
        insDraggingElem.remove();
        insDraggingElem = null;

        const slot = document.elementFromPoint(event.clientX, event.clientY);
        if (!slot.classList.contains("ins-slot")) {
            return;
        }

        slot.innerText = insDragging.text;
        slot.dataset.ins = insDragging.text;
    }
});

// CONTROLS //
let mode = "idle";
onModeChange();
let step = 0;
let active;
let time = 400;

function onModeChange() {

    playButton.classList.remove("active");
    loopButton.classList.remove("active");
    if (mode == "play") {
        playButton.classList.add("active")
        time = 1000;
    }
    if (mode == "loop") {
        loopButton.classList.add("active");
        time = 100;
    }
}

playButton.addEventListener("click", event => {
    if (mode == "idle") {
        step = 0;
        mode = "play";
        onModeChange();
        doStep();
    } else {
        mode = "idle";
        onModeChange();
        if (active) clearTimeout(active);
    }
});

loopButton.addEventListener("click", event => {
    if (mode == "idle") {
        step = 0;
        mode = "loop";
        onModeChange();
        doStep();
    } else if (mode == "play") {
        mode = "loop";
        onModeChange();
    } else if (mode == "loop") {
        mode = "idle";
        onModeChange();
        if (active) clearTimeout(active);
    }
});

resetButton.addEventListener("click", event => {
    mode = "idle";
    onModeChange();
    if (active) clearTimeout(active);
    reset();
});

function doStep() {
    const slots = document.querySelectorAll(".ins-slot[data-ins]");

    // stop loop if no ins
    if (slots.length == 0) {
        mode = "idle";
        onModeChange();
        return;
    }

    // stop or loop at end of sequence
    if (step >= slots.length) {
        if (mode == "play") {
            mode = "idle";
            onModeChange();
            return;
        } else {
            step = 0;
        }
    }

    // execute step
    const slot = slots[step];
    slot.classList.add("active");
    const ins = lookup[slot.dataset.ins];
    if (ins.act) { ins.act(); render(); }

    // clear active 
    setTimeout(() => {
        slot.classList.remove("active");
    }, time);

    // next step
    step++;

    // line up next event
    if (mode != "idle") {
        active = setTimeout(doStep, time);
    }


}


// MAIN //
reset();