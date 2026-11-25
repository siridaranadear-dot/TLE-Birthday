/* ===== ตั้งค่า ===== */
const PASSWORD = "28112551";           // 28/11/2551 (เปลี่ยนได้)
const BIRTHDAY = new Date(2026, 10, 28); // วันเกิดครบ 18 ปี (ค.ศ. 2026)

/* ===== พื้นหลัง: ดาว/อนุภาคแดง ===== */
const cv = document.getElementById('bg'), cx = cv.getContext('2d');
let W, H, mode = 'idle';
function rs(){ W = cv.width = fx.width = innerWidth; H = cv.height = fx.height = innerHeight }
const fx = document.getElementById('fx'), fc = fx.getContext('2d');
addEventListener('resize', rs); rs();
const S = Array.from({length:160}, () => ({x:Math.random()*2-1, y:Math.random()*2-1, z:Math.random()}));
let grid = 0;
function loop(){
  cx.fillStyle = mode === 'warp' ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.35)';
  cx.fillRect(0,0,W,H);
  if(mode !== 'warp'){ // เส้นกริดไหลช้าๆ
    grid = (grid + .4) % 60;
    cx.strokeStyle = 'rgba(255,31,45,.07)'; cx.lineWidth = 1; cx.beginPath();
    for(let x = 0; x < W; x += 60){ cx.moveTo(x,0); cx.lineTo(x,H) }
    for(let y = grid; y < H; y += 60){ cx.moveTo(0,y); cx.lineTo(W,y) }
    cx.stroke();
  }
  const sp = mode === 'warp' ? .03 : .0025, k = Math.min(W,H) * .15;
  for(const s of S){
    const pz = s.z; s.z -= sp;
    if(s.z <= .02){ s.x = Math.random()*2-1; s.y = Math.random()*2-1; s.z = 1; continue }
    const x1 = W/2 + s.x/pz*k, y1 = H/2 + s.y/pz*k, x2 = W/2 + s.x/s.z*k, y2 = H/2 + s.y/s.z*k;
    cx.strokeStyle = `rgba(255,${mode==='warp'?90:31},${mode==='warp'?100:45},${1-s.z})`;
    cx.lineWidth = mode === 'warp' ? 2 : 1.2;
    cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke();
  }
  requestAnimationFrame(loop);
}
loop();

/* ===== ล็อกอิน ===== */
const pw = document.getElementById('pw'), err = document.getElementById('err');
function tryLogin(){
  const v = pw.value.replace(/\D/g, '');
  if(v === PASSWORD){ err.textContent = ''; startBoot() }
  else {
    err.textContent = 'รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง';
    const b = document.getElementById('box'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
    pw.select();
  }
}
document.getElementById('go').onclick = tryLogin;
pw.addEventListener('keydown', e => { if(e.key === 'Enter') tryLogin() });

/* ===== ฉากเปิดระบบ + วาร์ปเข้าเนื้อหา ===== */
function startBoot(){
  const login = document.getElementById('login'), boot = document.getElementById('boot');
  const bt = document.getElementById('bt'), bi = document.getElementById('bi');
  login.style.opacity = 0;
  setTimeout(() => { login.style.display = 'none'; boot.style.display = 'flex' }, 600);
  const lines = ['VERIFYING IDENTITY...', 'IDENTITY CONFIRMED: เติ้ล', 'LOADING WAR UNITS...', 'ENGAGING WARP DRIVE...'];
  lines.forEach((t, i) => setTimeout(() => { bt.textContent = t; bi.style.width = ((i+1)/lines.length*100) + '%' }, 900 + i*900));
  setTimeout(() => { mode = 'warp' }, 900 + 2*900);          // เริ่มวาร์ป
  setTimeout(() => { boot.style.display = 'none'; showMain() }, 900 + 4*900 + 700);
}
function showMain(){
  mode = 'idle';
  const m = document.getElementById('main');
  m.style.display = 'block'; requestAnimationFrame(() => m.classList.add('on'));
  scrollTo(0,0); tick(); setInterval(tick, 1000);
}

/* ===== นับถอยหลังวันเกิด ===== */
function tick(){
  const el = document.getElementById('count'), d = BIRTHDAY - new Date();
  if(d <= 0){ el.innerHTML = '<div><b>18</b><span>ปีแล้ว สุขสันต์วันเกิด!</span></div>'; document.getElementById('reveal').hidden = false; document.getElementById('wait').hidden = true; return }
  const n = [Math.floor(d/864e5), Math.floor(d/36e5)%24, Math.floor(d/6e4)%60, Math.floor(d/1e3)%60];
  const l = ['วัน','ชั่วโมง','นาที','วินาที'];
  el.innerHTML = n.map((v,i) => `<div><b>${String(v).padStart(2,'0')}</b><span>${l[i]}</span></div>`).join('');
}

/* ===== ฉลอง ===== */
const P = [];
document.getElementById('boom').onclick = () => {
  for(let i = 0; i < 220; i++){
    const a = Math.random()*6.283, v = 3 + Math.random()*9;
    P.push({x:W/2, y:H*.6, vx:Math.cos(a)*v, vy:Math.sin(a)*v - 4, l:90 + Math.random()*50, c:Math.random() < .25 ? '#fff' : '#ff1f2d', s:2 + Math.random()*4});
  }
};
(function fxLoop(){
  fc.clearRect(0,0,W,H);
  for(let i = P.length-1; i >= 0; i--){
    const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += .18; p.l--;
    fc.globalAlpha = Math.max(p.l/60, 0); fc.fillStyle = p.c; fc.fillRect(p.x, p.y, p.s, p.s);
    if(p.l <= 0) P.splice(i,1);
  }
  fc.globalAlpha = 1; requestAnimationFrame(fxLoop);
})();
