// INSTRUCTIONS //
const instructions = [
    {
        text: "Move forward",
        act: ()=>{
            arrow.x += 50 * Math.sin(arrow.angle);
            arrow.y += 50 * Math.cos(arrow.angle)
        }
    },
    {
        text: "Turn 90deg clockwise",
    },
    {
        text: "Turn 90deg anti-clockwise",
    }
]

const lookup = {}
for (const ins of instructions) {
    lookup[ins.text] = ins;
}

// ELEMENTS //
const inventoryPanel = document.getElementById("inventory")
const algorithmPanel = document.getElementById("algorithm")
const spacePanel = document.getElementById("space")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");
const arrowElement = document.getElementById("arrow")

let dragging = null;

// UI SETUP //
let nextId = 0;
for (const ins of instructions) {
    const div = document.createElement("div");
    div.classList.add("instruction")
    div.innerText = ins.text;
    inventoryPanel.appendChild(div);

    div.addEventListener("mousedown",event=>{
        dragging = document.createElement("div");
        dragging.classList.add("instruction");
        dragging.classList.add("dragging");
        dragging.innerText = ins.text;

        dragging.id = "i" + (nextId++)
        dragging.dataset.ins = ins.text;
        dragging.style.left = event.clientX + "px";
        dragging.style.top = event.clientY + "px";
        
        document.body.appendChild(dragging);
    })
}

// CANVAS SETUP //

const arrow = {
    oldX: 0,
    oldY: 0,
    x: 0,
    y: 0,
    angle: 0,
}

function reset() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width;
    canvas.height = height;

    const uiLeftWidth = inventoryPanel.getBoundingClientRect().width + algorithmPanel.getBoundingClientRect().width;
    arrow.x = uiLeftWidth + (width-uiLeftWidth)/2
    arrow.y = height/2;

    arrow.oldX = arrow.x;
    arrow.oldY = arrow.y;
    
    arrow.angle = 0;

    render();
}

function render() {
    arrowElement.style.left = arrow.x + "px";
    arrowElement.style.top = arrow.y + "px";
    arrowElement.style.transform = `rotate(${arrow.angle}deg)`

    ctx.strokeStyle = "black"
    ctx.beginPath();
    ctx.moveTo(arrow.oldX, arrow.oldY);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.stroke();
}

document.body.addEventListener("mousemove", event=>{
    if (dragging) {
        dragging.style.left = event.clientX + "px";
        dragging.style.top = event.clientY + "px";
    }
})

document.body.addEventListener("mouseup", event=> {
    if (dragging ) {
        const slot = document.elementFromPoint(event.clientX,event.clientY)
        if (!slot.classList.contains("slot")) {
            dragging.remove()
            return
        }

        if (slot.dataset.ins) {
            document.getElementById(slot.dataset.ins).remove();
        }

        slot.dataset.ins = dragging.id;

        slot.appendChild(dragging)

        dragging.classList.remove("dragging")
        dragging.style.top = "0px";
        dragging.style.left = "0px";

        dragging = null;
    }
})

// MAIN //
reset();