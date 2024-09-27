const instructions = [
    {
        text: "Move forward",
    },
    {
        text: "Turn 90deg clockwise",
    },
    {
        text: "Turn 90deg anti-clockwise",
    }
]

const inventoryPanel = document.getElementById("inventory")
const algorithmPanel = document.getElementById("algorithm")
const spacePanel = document.getElementById("space")

for (const ins of instructions) {
    const div = document.createElement("div");
    div.classList.add("instruction")
    div.innerText = ins.text;
    inventoryPanel.appendChild(div);
}