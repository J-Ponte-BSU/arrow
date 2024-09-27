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

// ELEMENTS //
const inventoryPanel = document.getElementById("inventory")
const algorithmPanel = document.getElementById("algorithm")
const spacePanel = document.getElementById("space")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");
const arrowElement = document.getElementById("arrow")

// UI SETUP //
for (const ins of instructions) {
    const div = document.createElement("div");
    div.classList.add("instruction")
    div.innerText = ins.text;
    inventoryPanel.appendChild(div);
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

// MAIN //
reset();