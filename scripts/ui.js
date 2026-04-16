import { world } from "./world.js";

const Score = document.getElementById("score");
const Time = document.getElementById("time");
const Stats = document.getElementById("stats");

function updateUI() {
  Score.textContent = `Score: ${world.score}`;
  Time.textContent = `Tempo: ${world.time.toFixed(1)}s`;

  if (world.lost) {
    Stats.textContent = "GAME OVER";
    Stats.classList.add("lost");
  } else {
    Stats.textContent = "RUNNING";
    Stats.classList.remove("lost");
  }
}

// loop separado só pra UI
function uiLoop() {
  updateUI();
  requestAnimationFrame(uiLoop);
}

uiLoop();