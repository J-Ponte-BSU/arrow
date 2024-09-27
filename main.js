// INSTRUCTIONS //
const instructions = [
    {
        text: "Move forward",
        act: () => {
            arrow.x += 50 * Math.sin(arrow.angle);
            arrow.y += 50 * Math.cos(arrow.angle);
        }
    },
    {
        text: "Turn 90deg clockwise",
    },
    {
        text: "Turn 90deg anti-clockwise",
    }
];

const lookup = {}

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
            return
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

    arrow.angle = 0;

    render();
}

function render() {
    arrowElement.style.left = arrow.x + "px";
    arrowElement.style.top = arrow.y + "px";
    arrowElement.style.transform = `rotate(${arrow.angle}deg)`;

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(arrow.oldX, arrow.oldY);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.stroke();
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

// MAIN //
reset();