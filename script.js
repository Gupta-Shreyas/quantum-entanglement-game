const measureBtn = document.getElementById('measureBtn');
const resultText = document.getElementById('resultText');
const statsArea = document.getElementById('statsArea');
const leaderboardEl = document.getElementById('leaderboard');
const noise = document.getElementById('noise');
const noiseVal = document.getElementById('noiseVal');

noise.addEventListener('input', () => noiseVal.textContent = Number(noise.value).toFixed(2));

async function refreshStats(){
  try{
    const res = await fetch('/api/stats');
    const json = await res.json();
    statsArea.innerHTML = `Total: ${json.total} <br> Correlated: ${json.correlated} <br> Correlation %: ${json.percent}%`;

    leaderboardEl.innerHTML = '';
    (json.leaderboard || []).slice(0,10).forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name || 'Anon'} — ${item.score}`;
      leaderboardEl.appendChild(li);
    });
  }catch(e){
    statsArea.textContent = 'Could not load stats.';
  }
}

measureBtn.addEventListener('click', async ()=>{
  const payload = {
    bell: document.getElementById('bellState').value,
    basis: document.getElementById('basis').value,
    noise: Number(noise.value)
  };

  try{
    const r = await fetch('/api/measure',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await r.json();
    resultText.textContent = `Measured: ${data.result} — ${data.explanation}`;
    await refreshStats();
  }catch(err){
    resultText.textContent = 'Server error — could not measure.';
  }
});

refreshStats();
