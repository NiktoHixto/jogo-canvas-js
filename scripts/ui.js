import { world } from "./world.js";

const Score = document.getElementById("score");
const Time = document.getElementById("time");
const Stats = document.getElementById("stats");

function updateUI() {
  Score.textContent = `Score: ${world.score}`;
  Time.textContent = `Tempo: ${world.time.toFixed(1)}s`;

  if (world.lost) {
    Stats.textContent = "GAME OVER";
  }
}

// loop separado só pra UI
function uiLoop() {
  updateUI();
  requestAnimationFrame(uiLoop);
}

uiLoop();