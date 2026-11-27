const SUPABASE_URL = 'https://harildrnnioyozvtvpqd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QDs8M6_gDqByFyPBZWT1_g_f9t4Oosa';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GAME_MIN_PER_REAL_SEC = 2.5;
const CLOSE_CYCLE_SEC = 210;
const CLOSE_WARN_SEC = 40;
const CLOSE_PER_STEP = 2;
const TARGET_HEADCOUNT = 32;
const MAX_ALLIES = 2;

let _itemUidSeq = 1;
function makeItemUid() {
  return `itm_${Date.now()}_${_itemUidSeq++}_${Math.floor(Math.random() * 1000)}`;
}
function ensureItemUid(it) {
  if (it && !it.uid) it.uid = makeItemUid();
  return it;
}

const sfx = {
  ctx: null,
  click() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [0, 0.036].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const baseFreq = idx === 0 ? 520 : 660;
        osc.frequency.setValueAtTime(baseFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.52, now + offset + 0.032);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.14, now + offset + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.036);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.04);
      });
    } catch (e) {}
  },
  loot() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [660, 880, 1174.66].forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    } catch (e) {}
  },
  attack() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  },
  hurt() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [0, 0.05].forEach((off, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(i === 0 ? 190 : 125, now + off);
        osc.frequency.exponentialRampToValueAtTime(65, now + off + 0.08);
        gain.gain.setValueAtTime(0.001, now + off);
        gain.gain.linearRampToValueAtTime(0.16, now + off + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + off + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.1);
      });
    } catch (e) {}
  },
  flee() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [300, 420, 580].forEach((freq, i) => {
        const t = now + i * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.06);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.13, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      });
    } catch (e) {}
  },
  battleStart() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [220, 330, 440, 587.33].forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      });
    } catch (e) {}
  },
  death() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [240, 185, 135, 85].forEach((freq, idx) => {
        const t = now + idx * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.65, t + 0.14);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.17);
      });
    } catch (e) {}
  },
  deathAlert() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [0, 0.11, 0.22].forEach((off) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(980, now + off);
        gain.gain.setValueAtTime(0.001, now + off);
        gain.gain.linearRampToValueAtTime(0.11, now + off + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + off + 0.075);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.08);
      });
    } catch (e) {}
  },
  beep() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [0, 0.22, 0.44].forEach((off) => {
        const t = now + off;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(680, t);
        osc.frequency.linearRampToValueAtTime(1180, t + 0.09);
        osc.frequency.linearRampToValueAtTime(760, t + 0.19);
        osc2.frequency.setValueAtTime(340, t);
        osc2.frequency.linearRampToValueAtTime(590, t + 0.09);
        osc2.frequency.linearRampToValueAtTime(380, t + 0.19);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.26, t + 0.012);
        gain.gain.setValueAtTime(0.24, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.20);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.21);
        osc2.stop(t + 0.21);
      });
    } catch (e) {}
  }
};

document.addEventListener('pointerdown', (e) => {
  if (e.target && e.target.closest('button')) {
    sfx.click();
  }
}, true);

const bgm = {
  ctx: null, enabled: true, playing: false, timer: null, step: 0, mode: 'lobby', volumeScale: 0.75,
  tracks: {
    lobby: {
      tempo: 460, wave: 'triangle', vol: 0.032, dur: 0.42,
      notes: [220.00, 261.63, 329.63, 392.00, 329.63, 261.63, 196.00, 246.94]
    },
    day: {
      tempo: 540, wave: 'sine', vol: 0.036, dur: 0.50,
      notes: [
        261.63, 0, 329.63, 293.66, 246.94, 0, 261.63, 0,
        220.00, 0, 261.63, 246.94, 196.00, 0, 220.00, 0,
        261.63, 0, 329.63, 392.00, 329.63, 293.66, 261.63, 0
      ],
      bass: [130.81, 130.81, 123.47, 123.47, 110.00, 110.00, 98.00, 98.00]
    },
    night: {
      tempo: 480, wave: 'triangle', vol: 0.034, dur: 0.44,
      notes: [
        220.00, 0, 261.63, 246.94, 196.00, 0, 174.61, 196.00,
        220.00, 0, 246.94, 261.63, 293.66, 261.63, 246.94, 196.00,
        164.81, 0, 196.00, 174.61, 146.83, 0, 164.81, 130.81
      ],
      bass: [110.00, 110.00, 98.00, 87.31, 110.00, 110.00, 82.41, 73.42]
    }
  },
  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  playStep() {
    if (!this.enabled || !this.playing || !this.ctx) return;
    const tr = this.tracks[this.mode] || this.tracks.lobby;
    const now = this.ctx.currentTime;
    const idx = this.step;
    this.step++;
    const freq = tr.notes[idx % tr.notes.length];
    if (freq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = tr.wave;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(tr.vol * (this.volumeScale ?? 0.75), now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tr.dur);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + tr.dur + 0.02);
    }
    if (tr.bass && idx % 2 === 0) {
      const bFreq = tr.bass[Math.floor(idx / 2) % tr.bass.length];
      if (bFreq > 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, now);
        bGain.gain.setValueAtTime(0.0001, now);
        bGain.gain.linearRampToValueAtTime(tr.vol * 0.85, now + 0.03);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + tr.dur * 1.4);
        bOsc.connect(bGain); bGain.connect(this.ctx.destination);
        bOsc.start(now); bOsc.stop(now + tr.dur * 1.45);
      }
    }
  },
  setMode(nextMode) {
    if (this.mode === nextMode && this.playing) return;
    this.mode = nextMode;
    this.step = 0;
    if (this.playing) {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      this.playing = false;
      this.start(nextMode);
    }
  },
  start(forceMode = null) {
    if (forceMode) this.mode = forceMode;
    if (!this.enabled) return;
    this.ensureCtx();
    if (this.playing) return;
    const tr = this.tracks[this.mode] || this.tracks.lobby;
    this.playing = true;
    this.playStep();
    this.timer = setInterval(() => this.playStep(), tr.tempo);
  },
  stop() {
    this.playing = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
};

document.addEventListener('pointerdown', () => {
  const cur = document.querySelector('.view.active');
  if (!cur) return;
  if (cur.id === 'viewGame') {
    const h = Math.floor((play.minutes % 1440) / 60);
    bgm.start((h >= 6 && h < 18) ? 'day' : 'night');
  } else {
    bgm.start('lobby');
  }
}, { once: false });

function setBgmVolume(val) {
  const num = Math.max(0, Math.min(100, Number(val) || 0));
  bgm.volumeScale = num / 100;
  const lSl = document.getElementById('lobbyBgmVol');
  const gSl = document.getElementById('gameBgmVol');
  const lTx = document.getElementById('lobbyBgmVolTxt');
  if (lSl) lSl.value = String(num);
  if (gSl) gSl.value = String(num);
  if (lTx) lTx.textContent = `${num}%`;
}

function toggleBgm() {
  bgm.enabled = !bgm.enabled;
  const btn = document.getElementById('btnBgmToggle');
  const gBtn = document.getElementById('refBgmBtn');
  if (btn) btn.textContent = `BGM: ${bgm.enabled ? 'ON' : 'OFF'}`;
  if (gBtn) gBtn.style.opacity = bgm.enabled ? '1' : '0.45';
  if (bgm.enabled) bgm.start();
  else bgm.stop();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

const CLUB_DATA = [
  { name: '검도부', story: '죽도 소리가 끊이지 않던 도장 출신이다. 같은 검도부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 근접 피격 시 25% 확률 즉시 반격 · 같은 동아리 초기 호감도 ♥1' },
  { name: '육상부', story: '트랙 위에서 바람을 가르던 주자다. 같은 육상부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 도주 성공률 +20%, 이동 피로 감소 · 같은 동아리 초기 호감도 ♥1' },
  { name: '보건부', story: '구급함과 소독약 냄새에 익숙하다. 같은 보건부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 치료 아이템 회복량 2배 · 같은 동아리 초기 호감도 ♥1' },
  { name: '연극부', story: '무대 위 표정과 목소리를 다루는 데 능숙하다. 같은 연극부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 대화·달래기 +15%, 성격 간파 · 같은 동아리 초기 호감도 ♥1' },
  { name: '천문부', story: '밤하늘을 세던 아이들. 이상하게 운이 좋은 학생이 많다. 같은 천문부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 탐색 행운 보정 및 천문부 친밀도 상승 · 같은 동아리 초기 호감도 ♥1' },
  { name: '만화부', story: '노트 구석마다 액션 컷을 그려 넣던 창작자다. 같은 만화부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 무기 공격 효율 및 필살기 발동 보정 · 같은 동아리 초기 호감도 ♥1' },
  { name: '음악부', story: '합주실의 울림 속에서 리듬을 익혔다. 같은 음악부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 연속 명중 시 명중률 및 전투 효율 증가 · 같은 동아리 초기 호감도 ♥1' },
  { name: '궁도부', story: '과녁을 향해 숨을 고르던 사수다. 같은 궁도부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 원거리 무기 지급 및 사격 강화 · 같은 동아리 초기 호감도 ♥1' },
  { name: '요리부', story: '불 앞에서 재료의 상태를 꿰뚫어 본다. 같은 요리부 학생들은 처음부터 당신에게 호감도 ♥1을 갖고 시작한다.', perk: '동아리 특기: 음식 허기 회복량 증가 · 같은 동아리 초기 호감도 ♥1' }
];

const STARTER_WEAPONS = [
  { name: '커터칼', atk: 4, kind: '날붙이', dura: 6, maxDura: 6, desc: '공격력 4 (날붙이) · 내구 6/6' },
  { name: '목검', atk: 4, kind: '근접', dura: 7, maxDura: 7, desc: '공격력 4 (근접) · 내구 7/7' },
  { name: '쇠파이프', atk: 5, kind: '근접', dura: 5, maxDura: 5, desc: '공격력 5 (근접) · 내구 5/5' },
  { name: '우산', atk: 3, kind: '근접', dura: 6, maxDura: 6, desc: '공격력 3 (근접) · 내구 6/6' },
  { name: '프라이팬', atk: 4, kind: '근접', dura: 8, maxDura: 8, desc: '공격력 4 (근접) · 내구 8/8' },
  { name: '가위', atk: 4, kind: '날붙이', dura: 6, maxDura: 6, desc: '공격력 4 (날붙이) · 내구 6/6' },
  { name: '단검', atk: 5, kind: '날붙이', dura: 8, maxDura: 8, desc: '공격력 5 (날붙이) · 내구 8/8' },
  { name: '새총', atk: 4, kind: '원거리', dura: 8, maxDura: 8, desc: '공격력 4 (원거리) · 내구 8/8' },
  { name: '사냥 활', atk: 6, kind: '원거리', dura: 7, maxDura: 7, desc: '공격력 6 (원거리) · 내구 7/7' },
  { name: '돌멩이', atk: 2, kind: '원거리', dura: 3, maxDura: 3, desc: '공격력 2 (원거리) · 3회 사용' },
  { name: '야구배트', atk: 5, kind: '근접', dura: 6, maxDura: 6, desc: '공격력 5 (근접) · 내구 6/6' },
  { name: '국어사전', atk: 3, kind: '근접', dura: 7, maxDura: 7, desc: '공격력 3 (근접) · 내구 7/7' }
];

const STARTER_FOODS = [
  { name: '사과', type: 'food', val: 16, desc: '허기 +16' },
  { name: '야생 열매', type: 'food', val: 15, desc: '허기 +15' },
  { name: '초콜릿', type: 'food', val: 18, desc: '허기 +18' },
  { name: '멜론빵', type: 'food', val: 26, desc: '허기 +26' },
  { name: '빵', type: 'food', val: 28, desc: '허기 +28 · 굶주림 완화' },
  { name: '주먹밥', type: 'food', val: 32, desc: '허기 +32' }
];

const STARTER_UTILITIES = [
  { name: '반창고', type: 'heal', val: 2, cures: [], desc: 'HP +2 · 가벼운 상처 회복' },
  { name: '소독약', type: 'heal', val: 2, cures: ['출혈'], desc: 'HP +2 · 출혈 치료' },
  { name: '붕대', type: 'heal', val: 3, cures: ['출혈'], desc: 'HP +3 · 출혈 치료' },
  { name: '해독제', type: 'heal', val: 2, cures: ['중독'], desc: 'HP +2 · 중독 치료' },
  { name: '진통제', type: 'heal', val: 3, cures: ['부상'], desc: 'HP +3 · 부상 치료' },
  { name: '에너지 드링크', type: 'heal', val: 1, cures: ['피로'], desc: 'HP +1 · 피로 즉시 해제' },
  { name: '숫돌', type: 'repair', val: 3, desc: '장착 무기 내구 +3 수리' },
  { name: '손전등', type: 'gear', desc: '밤 시간대 탐색 가능 · 야간 시야 확보' }
];

const TITLES = ['없음', '생존자', '밤의 목격자', '동맹의 맹세', '최후의 이름'];

const ISLAND_ZONES = [
  { id: 'lighthouse', name: '등대', x: 112, y: 66, edges: ['cliff', 'forest', 'west_coast'], pool: ["붕대", "지혈 거즈", "빵", "우산", "손전등", "손전등", "★ 조명탄", "★ 쌍안경", "★ 연막탄"], hint: '등대 주변에선 손전등과 붕대, 식량이 종종 발견된다.' },
  { id: 'cliff', name: '절벽', x: 215, y: 48, edges: ['lighthouse', 'sea_cave', 'old_school'], pool: ["사냥 활", "단검", "돌멩이", "곡괭이", "부목", "★ 화살 묶음", "★ 쌍안경"], hint: '절벽 바람이 세지만 무기류와 부목이 눈에 띈다.' },
  { id: 'sea_cave', name: '해안동굴', x: 318, y: 52, edges: ['cliff', 'pier'], pool: ["해독제", "복합 해독 캡슐", "단검", "독단검", "붕대", "손전등", "손전등", "돌멩이", "★ 바람총"], hint: '습한 동굴엔 해독제와 손전등, 독 무기가 떨어진다.' },
  { id: 'pier', name: '선착장', x: 382, y: 82, edges: ['sea_cave', 'dorm', 'power'], pool: ["빵", "우산", "단검", "멜론빵", "손전등", "방탄 헬멧", "★ 낚싯대", "★ 조명탄"], hint: '선착장 화물 더미엔 식량과 손전등, 잡동사니가 많다.' },
  { id: 'west_coast', name: '서쪽 해변', x: 78, y: 112, edges: ['lighthouse', 'marsh'], pool: ["붕대", "빵", "우산", "손전등", "사과", "생수", "★ 낚싯대"], hint: '서쪽 해변은 조용하지만 물자가 흩어져 있다.' },
  { id: 'forest', name: '숲', x: 138, y: 102, edges: ['lighthouse', 'old_school', 'greenhouse'], pool: ["사냥 활", "붕대", "해독제", "허브 연고", "새총", "야생 열매", "손전등", "★ 화살 묶음"], hint: '숲 속엔 약초·해독제와 활감이 있다.' },
  { id: 'old_school', name: '폐교', x: 216, y: 104, edges: ['cliff', 'forest', 'dorm', 'downtown'], pool: ["★ 목검", "★ 바람총", "국어사전", "대걸레", "리코더", "제도용 컴퍼스", "커터칼", "펜싱 마스크", "반창고", "붕대", "지혈 거즈", "소독약", "멜론빵", "빵", "손전등", "★ 배낭"], hint: '폐교 복도와 교실엔 기본 보급품과 손전등이 골고루 있다.' },
  { id: 'dorm', name: '기숙사', x: 292, y: 106, edges: ['old_school', 'pier', 'downtown'], pool: ["빵", "멜론빵", "초콜릿", "컵라면", "우산", "진통제", "핫팩", "손전등", "★ 구급 상자", "★ 배낭"], hint: '기숙사 방마다 식량과 구급용품이 남아 있다.' },
  { id: 'marsh', name: '습지', x: 105, y: 152, edges: ['west_coast', 'tomb', 'greenhouse'], pool: ["해독제", "복합 해독 캡슐", "붕대", "단검", "독단검", "야생 열매", "지뢰", "★ 바람총"], hint: '습지는 발이 빠지고 중독 위험이 있으니 해독제를 챙기자.' },
  { id: 'greenhouse', name: '온실', x: 174, y: 146, edges: ['forest', 'marsh', 'downtown', 'ruins'], pool: ["사과", "야생 열매", "허브 연고", "해독제", "가위", "원예용 가위", "★ 구급 상자"], hint: '온실엔 식량과 천연 치료제가 잘 나온다.' },
  { id: 'downtown', name: '상점가', x: 246, y: 144, edges: ['old_school', 'dorm', 'greenhouse', 'clinic', 'reservoir', 'shrine'], pool: ["빵", "멜론빵", "초콜릿", "주먹밥", "도시락 세트", "캔커피", "단검", "에너지 드링크", "손전등", "★ 배낭"], hint: '상점가는 식량과 보급품이 풍부하지만 사람이 많다.' },
  { id: 'clinic', name: '진료소', x: 306, y: 152, edges: ['downtown', 'power'], pool: ["반창고", "소독약", "붕대", "지혈 거즈", "해독제", "복합 해독 캡슐", "진통제", "부목", "가위", "★ 구급 상자", "★ 응급 수혈팩", "★ 만능 구급 키트"], hint: '진료소는 각종 전문 의약품과 치료 도구의 핵심 거점이다.' },
  { id: 'power', name: '발전소', x: 374, y: 132, edges: ['pier', 'clinic', 'lab'], pool: ["단검", "쇠파이프", "녹슨 쇠파이프", "곡괭이", "장도리 망치", "숫돌", "손전등", "손전등", "지뢰", "★ 소방도끼", "★ 고압 테이저건"], hint: '발전소 주변엔 공구와 손전등, 전기 장비가 있다.' },
  { id: 'tomb', name: '묘지', x: 76, y: 186, edges: ['marsh', 'pine_forest'], pool: ["해독제", "붕대", "단검", "곡괭이", "숫돌", "손전등", "★ 일본도 모형"], hint: '묘지엔 기묘한 약품과 낡은 날붙이가 남는다.' },
  { id: 'ruins', name: '폐공장', x: 162, y: 184, edges: ['greenhouse', 'pine_forest', 'reservoir'], pool: ["단검", "쇠파이프", "녹슨 쇠파이프", "장도리 망치", "곡괭이", "부목", "지뢰", "숫돌", "방탄 헬멧", "★ 방탄 조끼"], hint: '폐공장엔 무기와 방어구, 거친 물자가 많다.' },
  { id: 'reservoir', name: '저수지', x: 222, y: 174, edges: ['downtown', 'ruins', 'shrine', 'south_coast'], pool: ["빵", "주먹밥", "생수", "붕대", "해독제", "★ 낚싯대", "★ 화살 묶음"], hint: '저수지 근처에선 식량과 치료 물자를 줍기 쉽다.' },
  { id: 'shrine', name: '신사', x: 282, y: 182, edges: ['downtown', 'reservoir', 'warehouse'], pool: ["반창고", "붕대", "허브 연고", "우산", "죽창", "★ 목검", "★ 일본도 모형", "★ 구급 상자"], hint: '신사 경내엔 구급 물자와 정갈한 물건이 있다.' },
  { id: 'lab', name: '연구소', x: 356, y: 180, edges: ['power', 'warehouse'], pool: ["해독제", "복합 해독 캡슐", "진통제", "에너지 드링크", "★ 연막탄", "★ 구급 상자", "★ 만능 구급 키트", "★ 고압 테이저건", "★ 석궁", "★ 방탄 조끼"], hint: '연구실엔 특수 약품과 첨단 장비가 섞여 있다.' },
  { id: 'pine_forest', name: '잣나무숲', x: 118, y: 214, edges: ['tomb', 'ruins', 'fishing_village'], pool: ["사냥 활", "새총", "죽창", "야생 열매", "사과", "★ 화살 묶음", "★ 석궁"], hint: '잣나무숲은 활과 창, 식량을 찾기 좋다.' },
  { id: 'fishing_village', name: '어촌', x: 164, y: 216, edges: ['pine_forest', 'south_coast'], pool: ["주먹밥", "도시락 세트", "식칼", "낫", "붕대", "★ 낚싯대"], hint: '어촌엔 건어물·주먹밥과 칼류가 종종 나온다.' },
  { id: 'south_coast', name: '남쪽 해변', x: 224, y: 216, edges: ['reservoir', 'fishing_village', 'warehouse'], pool: ["빵", "사과", "생수", "우산", "붕대", "손전등", "★ 낚싯대", "★ 쌍안경"], hint: '남쪽 해변은 시야가 트여 있어 움직이기 편하다.' },
  { id: 'warehouse', name: '창고', x: 318, y: 210, edges: ['shrine', 'lab', 'south_coast'], pool: ["빵", "주먹밥", "도시락 세트", "단검", "낫", "지뢰", "★ 연막탄", "방탄 헬멧", "★ 배낭", "★ 비상 전투식량", "★ 소방도끼"], hint: '창고엔 각종 보급품과 전투 물자가 가득 쌓여 있다.' }
];

const LOOT_ITEMS = [
  { name: "우산", type: "weapon", atk: 3, kind: "근접", dura: 6, maxDura: 6, rare: false, desc: "공격력 3 (근접) · 내구 6/6" },
  { name: "대걸레", type: "weapon", atk: 3, kind: "근접", dura: 5, maxDura: 5, rare: false, desc: "공격력 3 (근접) · 내구 5/5" },
  { name: "리코더", type: "weapon", atk: 2, kind: "근접", dura: 4, maxDura: 4, rare: false, desc: "공격력 2 (근접) · 내구 4/4" },
  { name: "국어사전", type: "weapon", atk: 3, kind: "근접", dura: 7, maxDura: 7, rare: false, desc: "공격력 3 (근접) · 둔탁한 타격(부상) · 내구 7/7" },
  { name: "프라이팬", type: "weapon", atk: 4, kind: "근접", statusEffect: "부상", statusChance: 0.30, dura: 8, maxDura: 8, rare: false, desc: "공격력 4 (근접) · 30% 부상 유발 · 내구 8/8" },
  { name: "쇠파이프", type: "weapon", atk: 5, kind: "근접", statusEffect: "부상", statusChance: 0.35, dura: 5, maxDura: 5, rare: false, desc: "공격력 5 (근접) · 35% 부상 유발 · 내구 5/5" },
  { name: "녹슨 쇠파이프", type: "weapon", atk: 5, kind: "근접", statusEffect: "중독", statusChance: 0.42, dura: 4, maxDura: 4, rare: false, desc: "공격력 5 (근접) · 파상풍 중독 42% · 내구 4/4" },
  { name: "장도리 망치", type: "weapon", atk: 6, kind: "근접", statusEffect: "부상", statusChance: 0.45, dura: 6, maxDura: 6, rare: false, desc: "공격력 6 (근접) · 45% 골절 부상 · 내구 6/6" },
  { name: "야구배트", type: "weapon", atk: 5, kind: "근접", statusEffect: "부상", statusChance: 0.35, dura: 6, maxDura: 6, rare: false, desc: "공격력 5 (근접) · 35% 부상 유발 · 내구 6/6" },
  { name: "곡괭이", type: "weapon", atk: 5, kind: "근접", statusEffect: "출혈", statusChance: 0.35, dura: 10, maxDura: 10, rare: false, desc: "공격력 5 (근접) · 35% 출혈 유발 · 내구 10/10" },
  { name: "죽창", type: "weapon", atk: 5, kind: "근접", statusEffect: "출혈", statusChance: 0.40, dura: 4, maxDura: 4, rare: false, desc: "공격력 5 (근접) · 40% 관통 출혈 · 내구 4/4" },
  { name: "★ 목검", type: "weapon", atk: 6, kind: "근접", statusEffect: "부상", statusChance: 0.40, dura: 8, maxDura: 8, rare: true, desc: "★ 희귀 · 공격력 6 (근접) · 40% 부상 · 내구 8/8" },
  { name: "★ 소방도끼", type: "weapon", atk: 7, kind: "근접", statusEffect: "출혈", statusChance: 0.50, dura: 6, maxDura: 6, rare: true, desc: "★ 희귀 · 공격력 7 (근접) · 50% 출혈 · 내구 6/6" },
  { name: "★ 고압 테이저건", type: "weapon", atk: 6, kind: "근접", statusEffect: "피로", statusChance: 0.65, dura: 5, maxDura: 5, rare: true, desc: "★ 희귀 · 공격력 6 (전기) · 65% 감전 피로 · 내구 5/5" },
  { name: "커터칼", type: "weapon", atk: 4, kind: "날붙이", statusEffect: "출혈", statusChance: 0.38, dura: 6, maxDura: 6, rare: false, desc: "공격력 4 (날붙이) · 38% 출혈 · 내구 6/6" },
  { name: "가위", type: "weapon", atk: 4, kind: "날붙이", statusEffect: "출혈", statusChance: 0.38, dura: 6, maxDura: 6, rare: false, desc: "공격력 4 (날붙이) · 38% 출혈 · 내구 6/6" },
  { name: "원예용 가위", type: "weapon", atk: 5, kind: "날붙이", statusEffect: "출혈", statusChance: 0.45, dura: 6, maxDura: 6, rare: false, desc: "공격력 5 (날붙이) · 45% 출혈 · 내구 6/6" },
  { name: "제도용 컴퍼스", type: "weapon", atk: 3, kind: "날붙이", statusEffect: "출혈", statusChance: 0.32, dura: 5, maxDura: 5, rare: false, desc: "공격력 3 (날붙이) · 32% 출혈 · 내구 5/5" },
  { name: "단검", type: "weapon", atk: 5, kind: "날붙이", statusEffect: "출혈", statusChance: 0.45, dura: 8, maxDura: 8, rare: false, desc: "공격력 5 (날붙이) · 45% 출혈 · 내구 8/8" },
  { name: "독단검", type: "weapon", atk: 5, kind: "날붙이", statusEffect: "중독", statusChance: 0.55, dura: 6, maxDura: 6, rare: false, desc: "공격력 5 (날붙이) · 55% 맹독 중독 · 내구 6/6" },
  { name: "식칼", type: "weapon", atk: 6, kind: "날붙이", statusEffect: "출혈", statusChance: 0.48, dura: 6, maxDura: 6, rare: false, desc: "공격력 6 (날붙이) · 48% 출혈 · 내구 6/6" },
  { name: "낫", type: "weapon", atk: 6, kind: "날붙이", statusEffect: "출혈", statusChance: 0.50, dura: 7, maxDura: 7, rare: false, desc: "공격력 6 (날붙이) · 50% 출혈 · 내구 7/7" },
  { name: "★ 일본도 모형", type: "weapon", atk: 8, kind: "날붙이", statusEffect: "출혈", statusChance: 0.60, dura: 6, maxDura: 6, rare: true, desc: "★ 희귀 · 공격력 8 (날붙이) · 60% 출혈 · 내구 6/6" },
  { name: "돌멩이", type: "weapon", atk: 2, kind: "원거리", dura: 3, maxDura: 3, rare: false, desc: "공격력 2 (원거리) · 3회 사용" },
  { name: "새총", type: "weapon", atk: 4, kind: "원거리", dura: 8, maxDura: 8, rare: false, desc: "공격력 4 (원거리) · 내구 8/8" },
  { name: "사냥 활", type: "weapon", atk: 6, kind: "원거리", statusEffect: "출혈", statusChance: 0.35, dura: 7, maxDura: 7, rare: false, desc: "공격력 6 (원거리) · 35% 출혈 · 내구 7/7" },
  { name: "★ 바람총", type: "weapon", atk: 6, kind: "원거리", statusEffect: "중독", statusChance: 0.65, dura: 5, maxDura: 5, rare: true, desc: "★ 희귀 · 공격력 6 (원거리) · 65% 독침 중독 · 내구 5/5" },
  { name: "★ 조명탄", type: "weapon", atk: 7, kind: "원거리", statusEffect: "부상", statusChance: 0.55, dura: 2, maxDura: 2, rare: true, desc: "★ 희귀 · 공격력 7 (원거리) · 55% 화상 부상 · 2회" },
  { name: "★ 석궁", type: "weapon", atk: 8, kind: "원거리", statusEffect: "출혈", statusChance: 0.55, dura: 5, maxDura: 5, rare: true, desc: "★ 희귀 · 공격력 8 (원거리) · 55% 출혈 · 내구 5/5" },
  { name: "★ 화살 묶음", type: "repair", val: 5, rare: true, desc: "★ 희귀 · 장착 무기 내구 +5 보충" },
  { name: "숫돌", type: "repair", val: 3, rare: false, desc: "장착 무기 내구 +3 수리" },
  { name: "펜싱 마스크", type: "armor", shield: 2, rare: false, desc: "착용 시 피격 피해 1 경감 (보호 2)" },
  { name: "방탄 헬멧", type: "armor", shield: 3, rare: false, desc: "착용 시 피격 피해 경감 (보호 3)" },
  { name: "★ 방탄 조끼", type: "armor", shield: 4, rare: true, desc: "★ 희귀 · 착용 시 피격 피해 경감 (보호 4)" },
  { name: "반창고", type: "heal", val: 2, cures: [], rare: false, desc: "HP +2 · 가벼운 상처 회복" },
  { name: "소독약", type: "heal", val: 2, cures: ["출혈"], rare: false, desc: "HP +2 · 출혈 치료" },
  { name: "붕대", type: "heal", val: 3, cures: ["출혈"], rare: false, desc: "HP +3 · 출혈 치료" },
  { name: "지혈 거즈", type: "heal", val: 4, cures: ["출혈"], rare: false, desc: "HP +4 · 출혈 즉시 지혈" },
  { name: "해독제", type: "heal", val: 2, cures: ["중독"], rare: false, desc: "HP +2 · 중독 치료" },
  { name: "복합 해독 캡슐", type: "heal", val: 4, cures: ["중독", "피로"], rare: false, desc: "HP +4 · 중독 및 피로 해독" },
  { name: "진통제", type: "heal", val: 3, cures: ["부상"], rare: false, desc: "HP +3 · 부상 치료" },
  { name: "부목", type: "heal", val: 4, cures: ["부상"], rare: false, desc: "HP +4 · 골절/부상 고정 치료" },
  { name: "허브 연고", type: "heal", val: 3, cures: ["출혈", "중독"], rare: false, desc: "HP +3 · 출혈 및 가벼운 중독 완화" },
  { name: "에너지 드링크", type: "heal", val: 1, cures: ["피로"], rare: false, desc: "HP +1 · 피로 즉시 해제" },
  { name: "캔커피", type: "heal", val: 1, cures: ["피로"], rare: false, desc: "HP +1 · 각성 효과로 피로 해제" },
  { name: "핫팩", type: "heal", val: 2, cures: ["피로", "부상"], rare: false, desc: "HP +2 · 체온 유지로 피로·부상 완화" },
  { name: "★ 구급 상자", type: "heal", val: 6, cures: ["출혈", "중독", "부상"], rare: true, desc: "★ 희귀 · HP +6 · 출혈/중독/부상 치료" },
  { name: "★ 응급 수혈팩", type: "heal", val: 7, cures: ["출혈", "피로"], rare: true, desc: "★ 희귀 · HP +7 · 심각한 출혈 및 피로 회복" },
  { name: "★ 만능 구급 키트", type: "heal", val: 8, cures: ["출혈", "중독", "부상", "피로"], rare: true, desc: "★ 희귀 · HP +8 · 모든 상태이상 완벽 치료" },
  { name: "사과", type: "food", val: 16, rare: false, desc: "허기 +16" },
  { name: "야생 열매", type: "food", val: 15, rare: false, desc: "허기 +15" },
  { name: "생수", type: "food", val: 14, rare: false, desc: "허기 +14 · 갈증 해소" },
  { name: "초콜릿", type: "food", val: 18, rare: false, desc: "허기 +18" },
  { name: "컵라면", type: "food", val: 24, rare: false, desc: "허기 +24" },
  { name: "멜론빵", type: "food", val: 26, rare: false, desc: "허기 +26" },
  { name: "빵", type: "food", val: 28, rare: false, desc: "허기 +28 · 굶주림 완화" },
  { name: "주먹밥", type: "food", val: 32, rare: false, desc: "허기 +32" },
  { name: "도시락 세트", type: "food", val: 38, rare: false, desc: "허기 +38 · 든든한 한 끼" },
  { name: "★ 비상 전투식량", type: "food", val: 45, rare: true, desc: "★ 희귀 · 허기 +45 · 굶주림/피로 완화" },
  { name: "손전등", type: "gear", rare: false, desc: "밤 시간대 탐색 가능 · 야간 시야 확보" },
  { name: "★ 연막탄", type: "smoke", rare: true, desc: "★ 희귀 · 전투 중 사용 시 100% 확률로 즉시 도주" },
  { name: "★ 배낭", type: "bag_expand", addSlots: 2, rare: true, desc: "★ 희귀 · 가방 최대 칸 +2 확장" },
  { name: "지뢰", type: "mine", dmg: 3, rare: false, desc: "설치 시 구역 매설 (본인·동료 제외 밟으면 HP -3)" },
  { name: "★ 낚싯대", type: "fishing", uses: 5, rare: true, desc: "★ 희귀 · 해변/저수지/어촌에서 물고기 획득 (5회)" },
  { name: "★ 쌍안경", type: "binocular", rare: true, desc: "★ 희귀 · 인접 구역 생존자 위치 정찰" }
];

const NPC_ROSTER = [
  { name: '아마미야 리코', club: '보건부', trait: '기회주의', zone: 'clinic', weapon: '낫', line: '상처는 금방 낫지 않아. 대신 조건만 맞으면 도와줄 수 있어.', scripts: ["여긴 소독약 냄새 대신 쇠비린내가 진동하네. 쓸 만한 약품이라도 있으면 먼저 챙기는 게 맞아.", "붕대 하나에 목숨이 갈리는데, 헛수고할 시간은 없어.", "날카로운 눈빛이네. 다친 데라도 숨기고 있는 거야?", "…말이 없네. 계산기 두드리는 소리만 머릿속에서 울린다.", "소독약 병 라벨을 닦으며 붕대 매듭을 꼼꼼히 묶고 있다.", "남을 살려둔 놈이 나중에 칼을 쥐는 꼴도 꽤 봤거든. 그래서 선을 긋는 거야.", "솔직히 말하면, 피 묻은 손으로 사람을 대하는 게 가끔 지겨워.", "네가 다쳤을 때 가장 먼저 붕대를 꺼내게 되는 게 왜인지 모르겠네.", "이 지옥 같은 섬에서 끝까지 믿을 수 있는 사람이 생길 줄은 몰랐어.", "…치사하게 굴지 마. 너한테 칼 들이대는 건, 이상하게 내키지가 않으니까."]},
  { name: '미나모토 시즈카', club: '검도부', trait: '호전적', zone: 'old_school', weapon: '목검', line: '섣불리 다가오지 마. 물러설 생각은 없으니까.', scripts: ["섣불리 다가오지 마. 망설이는 순간 간격이 무너져.", "시선은 좋군. 주저할 거면 처음부터 칼집에서 손을 떼.", "도장 밖에서도 기세는 죽이지 않았나 보네.", "입을 다문 채 목검 끝을 바닥에 살짝 찍고 숨을 고른다.", "주변 기척을 살피며 무게중심을 낮게 잡은 채 서 있다.", "승부에서 밀릴 때의 그 서늘한 감각… 아직도 몸이 기억해.", "항상 이겨야 한다는 압박감 속에서 살아남는 법만 배웠어.", "네가 뒤를 맡겨도 될 만큼 버텨 주니까, 나도 조금은 숨이 쉬어진다.", "싸움의 끝이 아니라, 같이 살아남는 쪽을 택하게 될 줄이야.", "빌어먹을… 너한테는 도저히 칼을 깊게 찌를 수가 없잖아. 너는 못 죽이겠다."]},
  { name: '키지마 유키', club: '육상부', trait: '기회주의', zone: 'forest', weapon: '단도', line: '다치는 건 조심해. 결승에서 내가 넘어진 거… 그 녀석이 밀었다는 소문이 있어.', scripts: ["다치는 건 조심해. 결승에서 내가 넘어진 거… 그 녀석이 밀었다는 소문이 있어.", "발이 빠르면 살 길도 넓어지지. 멈춰 서는 놈부터 밀려나.", "너도 누군가에게 떠밀려 본 적 있어? 그 기분, 꽤 더럽지.", "아무 말 없이 발목 테이핑을 다시 감으며 시선을 돌린다.", "주변 출입구를 곁눈질하며 발걸음 재료를 정리하고 있다.", "트랙 위에서 넘어진 날 이후로, 남을 믿느니 먼저 앞지르겠다고 다짐했어.", "사실 그날 바람이 세기도 했고… 내 욕심이 앞선 탓도 있었을지 몰라.", "이상하게 너랑 있으면 남 탓할 기운이 빠져. 그냥 같이 뛰고 싶어진다.", "도망치는 게 아니라, 끝까지 같이 살아남고 싶어졌어.", "젠장, 왜 하필 너냐… 너를 쓰러뜨리는 건 도저히 못 하겠어. 너는 못 죽이겠다."]},
  { name: '호시노 아카리', club: '천문부', trait: '겁쟁이', zone: 'lighthouse', weapon: '망원경봉', line: '밤이 오면 별빛 말고는 아무것도 안 보여서 무서워…', scripts: ["밤이 오면 별빛 말고는 아무것도 안 보여서 무서워… 여긴 하늘도 너무 낮아.", "그… 혹시 무서운 무기 같은 건 안 들고 있는 거지?", "작은 소리에도 심장이 철렁 내려앉아…", "작게 숨을 들이쉰 채 아무 말도 하지 못하고 손끝만 만지작거린다.", "손전등이나 작은 소품을 가슴에 품고 주변 그림자를 살피고 있다.", "어릴 때 망원경으로 별을 보던 밤이 제일 평화로웠는데…", "혼자 남겨지는 게 세상에서 제일 무서워. 그래서 늘 작아졌나 봐.", "네가 옆에 서 있으면… 어둠 속에서도 한 걸음쯤은 걸을 수 있을 것 같아.", "무서워서 떨기만 하던 내가, 이제는 너를 지키고 싶다고 생각해.", "싫어, 이런 싸움은 싫어… 너는 못 죽이겠어. 정말로 못 하겠단 말이야."]},
  { name: '사이온지 루카', club: '천문부', trait: '기회주의', zone: 'downtown', weapon: '금속자', line: '날 이용하려는 거지? 다 보여.', scripts: ["날 이용하려는 거지? 다 보여. 다정하게 굴수록 더 의심스럽거든.", "공짜 호의는 없어. 결국엔 다 대가를 치르게 돼 있어.", "너는 어떤 패를 쥐고 있는지 궁금하네.", "표정 변화 없이 턱을 괴고 가만히 침묵을 지킨다.", "주머니 속 물건들의 위치를 손끝으로 세어 보며 상황을 재고 있다.", "누구에게도 약점 잡히지 않으려고 늘 계산기를 두드리며 살았어.", "믿었다가 배신당하는 것보다, 처음부터 혼자 서는 게 편하다고 믿었지.", "이상하지. 너랑 있으면 손익 계산이 자꾸 엉망이 돼.", "네가 내 편이라면… 이번엔 한 번쯤 판을 걸어 봐도 좋겠어.", "제길… 계산이 안 서. 너한테는 칼을 겨눌 수가 없어. 너는 못 죽이겠다."]},
  { name: '유키무라 코토네', club: '천문부', trait: '겁쟁이', zone: 'greenhouse', weapon: '무채', line: '싸움 같은 건 정말 싫어… 조용히 지나갔으면 좋겠어.', scripts: ["싸움 같은 건 정말 싫어… 조용히 지나갔으면 좋겠어.", "부딪히지 않고 조용히 지나갈 수 있다면 그게 제일 좋잖아…", "목소리가 너무 크면 다른 곳에서도 들릴까 봐 걱정돼.", "조용히 고개를 숙인 채 한마디도 하지 않는다.", "마른 잎사귀나 작은 물건을 만지작거리며 가만히 숨을 고르고 있다.", "온실 안에서 식물을 돌볼 때가 제일 마음이 편했어. 다들 조용하니까.", "상처 주는 말도, 상처 받는 일도 가능하면 피하고 싶었어.", "네가 다정하게 말을 걸어 줄 때마다, 마음이 조금씩 녹는 기분이 들어.", "끝까지 살아남아서, 같이 조용한 아침을 맞이할 수 있으면 좋겠어.", "안 돼… 난 너를 해칠 수 없어. 너는 못 죽이겠다."]},
  { name: '쿠로사와 렌', club: '궁도부', trait: '냉정형', zone: 'cliff', weapon: '대나무활', line: '거리를 유지해. 시야 밖에서 무슨 일이 벌어질지 모르니.', scripts: ["거리를 유지해. 시야 밖에서 무슨 일이 벌어질지 모르니.", "불필요한 소음은 적을 부른다. 침착하게 움직여.", "시야 확보가 끝났다면 다음 동선을 생각해 둬.", "말없이 활대와 주변 지형을 차분하게 응시한다.", "활시위 장력과 바람 세기를 가늠하며 조용히 호흡을 고르고 있다.", "과녁을 맞히는 건 감정이 아니라 거리와 호흡의 문제야.", "감정을 드러내지 않는 습관이 사람들과의 거리를 멀게 만들었지.", "이상하게 네가 곁에 있으면 시야가 흐트러지지 않아.", "믿을 수 있는 단 한 명을 꼽으라면, 망설임 없이 너를 고르겠어.", "…화살을 당길 수 없다. 너는 못 죽이겠다."]},
  { name: '타치바나 히나타', club: '요리부', trait: '이타적', zone: 'warehouse', weapon: '식칼', line: '배고프면 다들 날카로워져. 먹을 거 있으면 챙겨뒀어.', scripts: ["배고프면 다들 날카로워져. 먹을 거 있으면 챙겨뒀어.", "빈속으로 버티는 건 생각보다 훨씬 고돼. 조금이라도 먹어 둬.", "잘 먹는 사람 얼굴 보면 괜히 기운이 나지 않아?", "조용히 입을 다문 채 배낭끈을 고쳐 쥔다.", "남은 식량 상태를 확인하며 상하지 않았는지 살피고 있다.", "사람들에게 따뜻한 밥을 챙겨 주는 게 내 유일한 자랑이었어.", "배고픈 시절을 겪어 봐서 그런지, 굶주린 사람을 보면 그냥 못 지나쳐.", "네가 내 음식을 받아 줄 때, 내가 살아 있는 실감이 난다.", "무슨 일이 있어도 너만큼은 굶기지 않고 끝까지 데려갈 거야.", "…손이 떨려. 너한테는 칼을 쓸 수 없어. 너는 못 죽이겠다."]},
  { name: '카미야 소마', club: '연극부', trait: '감정형', zone: 'dorm', weapon: '연출용단검', line: '이 무대의 막이 언제 내려올지, 아무도 모른다는 게 흥미롭지 않아?', scripts: ["이 무대의 막이 언제 내려올지, 아무도 모른다는 게 흥미롭지 않아?", "연극은 대본대로 흘러가지 않을 때가 제일 짜릿하지.", "지금 네 표정, 꽤 좋은 장면인데?", "아무 말 없이 한쪽 눈썹을 올린 채 너를 바라본다.", "소품 무기를 손가락으로 돌리며 무대 동선을 머릿속으로 그려 보고 있다.", "무대 위 조명이 꺼진 뒤에도 연기하는 습관이 지워지지 않아서 힘들어.", "진짜 내 감정이 뭔지조차 가끔은 연극 대사처럼 느껴질 때가 있어.", "네 앞에서는 억지로 꾸미지 않아도 말이 자연스럽게 나와.", "이 비극적인 무대 속에서, 너는 내가 만난 가장 진짜 같은 사람이야.", "막이 내려와도 좋아… 너한테는 칼을 내릴 수가 없어. 너는 못 죽이겠다."]},
  { name: '사쿠라바 미오', club: '음악부', trait: '자유형', zone: 'pier', weapon: '메탈스틱', line: '박자가 어긋나면 금방 꼬이잖아. 지금 섬 분위기가 딱 그래.', scripts: ["박자가 어긋나면 금방 꼬이잖아. 지금 섬 분위기가 딱 그래.", "리듬만 놓치지 않으면 의외로 길이 보일 때도 있어.", "오늘 공기 흐름, 묘하게 엇박자 타지 않아?", "말없이 스틱 끝으로 허공에 짧은 박자를 짚어 본다.", "주변 소음의 울림을 귀 기울여 들으며 발끝으로 박자를 맞추고 있다.", "음악이 끊기면 세상이 텅 빈 것처럼 느껴질 때가 많았어.", "제멋대로인 것처럼 보여도, 사실은 흔들리지 않으려고 발버둥 친 거야.", "너랑 같이 있으면 이상하게 템포가 딱 맞아떨어진다.", "끝까지 같이 연주하듯 살아남아 보자, 너랑 함께라면.", "이건 내 연주가 아니야… 너는 못 죽이겠다."]},
  { name: '모치즈키 카에데', club: '만화부', trait: '관찰형', zone: 'ruins', weapon: '커터칼', line: '사람들 표정만 봐도 다음 수를 대충 읽을 수 있어.', scripts: ["사람들 표정만 봐도 다음 수를 대충 읽을 수 있어.", "말보다 시선과 걸음걸이에 진짜 속내가 드러나지.", "지금 네 움직임, 꽤 흥미로운 구도인데?", "조용히 침묵한 채 주변 인물의 동선을 눈으로 쫓는다.", "수첩이나 손바닥에 짧은 메모를 남기듯 상황을 정리하고 있다.", "만화 속 인물들은 언제든 다시 그릴 수 있지만, 여긴 한 번뿐이잖아.", "관찰하는 척 뒤로 물러나기만 했던 게 후회될 때도 있어.", "네 선택을 지켜보는 게 어느새 내 가장 큰 관심사가 됐어.", "이 이야기의 마지막 페이지를 너와 함께 쓰고 싶어.", "…펜을 멈출게. 너는 못 죽이겠다."]},
  { name: '아오야마 츠바사', club: '육상부', trait: '돌격형', zone: 'west_coast', weapon: '릴레이봉', line: '망설이다간 늦어. 움직일 땐 한 번에 치고 빠져야지.', scripts: ["망설이다간 늦어. 움직일 땐 한 번에 치고 빠져야지.", "주저할 틈이 있으면 한 발짝이라도 더 뛰어.", "멈칫하는 순간 판은 기울어. 판단은 빠르게!", "말없이 숨을 고르며 언제든 튀어나갈 자세를 취한다.", "발목과 어깨를 가볍게 풀며 다음 이동 경로를 노리고 있다.", "트랙에서 뒤처질 때의 그 조급함… 여기서도 똑같아.", "앞만 보고 달리느라 주변을 돌아볼 여유가 없었어.", "네가 옆에서 보조를 맞춰 주니까 달리는 게 훨씬 가벼워.", "끝까지 같이 내달려서 둘 다 살아남자!", "…멈춰 서 버렸어. 너는 못 죽이겠다."]},
  { name: '시라카와 레이', club: '보건부', trait: '이타적', zone: 'clinic', weapon: '핀셋', line: '출혈이나 중독은 방치하면 위험해. 상태부터 확인해.', scripts: ["출혈이나 중독은 방치하면 위험해. 상태부터 확인해.", "작은 상처라도 제때 손보지 않으면 크게 번져.", "안색이 안 좋아 보이는데, 어디 다친 거 아니야?", "조용히 입을 다문 채 구급 가방 잠금쇠를 만진다.", "손끝을 소독하며 상처 부위를 살필 준비를 하고 있다.", "구급함을 쥐고 있어도 살리지 못할 때가 있다는 게 제일 괴로워.", "냉정해 보이려 애썼지만, 사실은 피만 봐도 가슴이 뛰어.", "네가 무사한지 확인하게 되는 순간, 마음이 한결 놓여.", "끝까지 네 컨디션을 지켜 주고 싶어. 다치지 마.", "…내 손이 떨려. 너는 못 죽이겠다."]},
  { name: '니시노 하루카', club: '요리부', trait: '겁쟁이', zone: 'shrine', weapon: '프라이팬', line: '여긴 너무 조용해서 오히려 심장이 뛰어…', scripts: ["여긴 너무 조용해서 오히려 심장이 뛰어…", "조용한 곳일수록 갑자기 무슨 일이 생길 것 같아서 불안해…", "혹시… 나랑 같이 있으면 덜 무서울까?", "말없이 두 손을 꼭 모은 채 조심스럽게 서 있다.", "주변 그림자를 살피며 조용히 숨을 죽이고 있다.", "겁이 많아서 늘 뒤처지기만 했어. 그게 너무 창피했지.", "조용한 방에서 혼자 울던 밤이 아직도 생생해.", "네가 옆에 있어 주니까, 처음으로 숨을 편하게 쉴 수 있어.", "끝까지 포기하지 않고 너랑 같이 살아남고 싶어.", "무서워… 하지만 너는 못 죽이겠다."]},
  { name: '후지모토 카이', club: '검도부', trait: '이타적', zone: 'old_school', weapon: '죽도', line: '같이 움직인다면 뒤는 내가 맡을게. 믿어도 돼.', scripts: ["같이 움직인다면 뒤는 내가 맡을게. 믿어도 돼.", "등 뒤가 비면 신경이 쓰이잖아. 그쪽은 내가 볼게.", "무리하지 마. 네가 쓰러지면 의미가 없으니까.", "묵묵히 침묵을 지키며 주변 경계를 늦추지 않는다.", "죽도를 고쳐 쥐며 주변 길목을 차분히 살피고 있다.", "누군가를 지키겠다고 다짐했지만, 지키지 못했던 기억도 있어.", "강한 척해도 나 역시 두려울 때가 많아. 다만 물러서지 않을 뿐이야.", "네가 내 옆에 있어 줘서, 검을 쥐는 이유가 더 분명해졌어.", "끝까지 네 방패가 되어 줄게. 약속할게.", "…검을 내릴게. 너는 못 죽이겠다."]},
  { name: '오오토리 시온', club: '연극부', trait: '기회주의', zone: 'downtown', weapon: '가위', line: '유리한 쪽에 서는 게 나쁜 건 아니잖아?', scripts: ["유리한 쪽에 서는 게 나쁜 건 아니잖아?", "판세가 어떻게 돌아가는지부터 보는 게 현명하지.", "이득이 되는 쪽으로 움직이는 건 본능이야.", "아무 말 없이 가볍게 미소 지으며 상황을 관망한다.", "주변 인물들의 거리와 소지품을 조용히 훑어보고 있다.", "늘 손해 보지 않으려고 계산했지만, 정작 진심은 숨겨 왔어.", "사람들을 재고 따지는 게 익숙해져서 외로웠던 적도 있지.", "이상하게 너한테는 이득 계산보다 마음이 먼저 가.", "이제는 네 편에 서는 게 내 가장 큰 진심이야.", "…계산 포기. 너는 못 죽이겠다."]},
  { name: '카와구치 아유무', club: '궁도부', trait: '신중형', zone: 'reservoir', weapon: '화살대', line: '폐쇄 시간과 남은 구역을 계산해 두는 게 편해.', scripts: ["폐쇄 시간과 남은 구역을 계산해 두는 게 편해.", "남은 시간과 구역 수를 맞춰 보면 다음 위험 지역이 보여.", "감정보다 계획이 흔들리지 않는 법이지.", "조용히 침묵하며 남은 시간과 구역 배치를 머릿속으로 정리한다.", "지형과 동선을 따져 보며 다음 이동 타이밍을 재고 있다.", "실수하지 않으려 늘 앞일을 계산했지만, 뜻대로 안 될 때도 많았어.", "완벽한 계획보다 중요한 건 함께 버텨 내는 끈기라는 걸 배웠어.", "네가 내 곁에 있으면 계획 밖의 일도 침착하게 마주할 수 있어.", "끝까지 계산을 놓지 않고 같이 살아남자.", "…조준할 수 없어. 너는 못 죽이겠다."]},
  { name: '나카무라 스즈', club: '만화부', trait: '겁쟁이', zone: 'pine_forest', weapon: '스케치북', line: '큰 소리 나면 바로 숨을 거야… 진짜로.', scripts: ["큰 소리 나면 바로 숨을 거야… 진짜로.", "갑작스런 소음만 들려도 몸이 먼저 굳어…", "여긴 너무 넓고 위험한 곳 같아…", "조용히 웅크린 채 아무 말도 하지 않는다.", "스케치북이나 작은 물건을 끌어안고 주위를 살피고 있다.", "사람들 사이에 끼면 금방 지쳐서 혼자만의 공간에 숨곤 했어.", "작은 실수 하나에도 크게 혼날까 봐 늘 눈치를 봤지.", "네가 다정하게 불러 줄 때면, 숨어 있던 마음이 밖으로 나와.", "조금만 더 용기 내서, 너랑 끝까지 같이 가고 싶어.", "싫어, 다치게 하고 싶지 않아… 너는 못 죽이겠다."]},
  { name: '야마자키 토라', club: '음악부', trait: '호전적', zone: 'power', weapon: '기타넥', line: '시끄럽게 굴지 말고 덤빌 거면 제대로 덤벼!', scripts: ["시끄럽게 굴지 말고 덤빌 거면 제대로 덤벼!", "어정쩡하게 잴 거면 아예 덤비지 마!", "피할 생각이면 확실히 피하고, 맞설 거면 끝까지 가!", "말없이 씩 웃으며 넥을 꽉 쥔 채 주변을 노려본다.", "주변 기척을 살피며 거친 숨을 고르고 있다.", "성질 급하고 거칠게 굴어서 주변에 상처 준 적도 많았어.", "사실은 약한 모습 보이기 싫어서 더 크게 소리쳤던 거야.", "너랑 같이 있으면 이상하게 화가 가라앉고 마음이 편해져.", "끝까지 같이 버텨 내면, 그때는 제대로 웃어 보자.", "칫… 너한테는 주먹도 칼도 못 쓰겠어. 너는 못 죽이겠다."]},
  { name: '사사키 메이', club: '보건부', trait: '냉정형', zone: 'lab', weapon: '구급함', line: '감정보다 수치가 정확해. 지금 HP 상태를 기준으로 판단해.', scripts: ["감정보다 수치가 정확해. 지금 HP 상태를 기준으로 판단해.", "체력과 허기 수치를 냉정하게 관리해야 생존율이 올라가.", "흥분하면 판단력이 흐려져. 수치부터 확인해.", "표정 없이 침묵하며 현재 상태와 주변 변수를 점검한다.", "손안의 물자와 상태 수치를 차분히 대조하고 있다.", "모든 걸 수치와 확률로만 나누려 했던 시절이 있었어.", "데이터로 설명되지 않는 감정이 생길 때, 사람이 흔들리더라.", "네 상태가 신경 쓰이는 건… 이미 단순한 계산을 넘어섰다는 뜻이겠지.", "최악의 상황에서도 너를 살릴 방법을 끝까지 찾을 거야.", "…확률 계산 불능. 너는 못 죽이겠다."]},
  { name: '타카하시 료', club: '요리부', trait: '호전적', zone: 'fishing_village', weapon: '중식도', line: '식량 앞에서는 양보 못 해. 살아남으려면 독해야지.', scripts: ["식량 앞에서는 양보 못 해. 살아남으려면 독해야지.", "배고픔을 참는 건 어리석은 짓이야. 먹을 건 확실히 챙겨.", "이 바닥에서 독한 놈이 살아남는 법이야.", "말없이 턱을 당긴 채 주변을 경계한다.", "식량과 무기의 상태를 확인하며 조용히 숨을 고르고 있다.", "뺏기지 않으려고 날을 세우다 보니 주변에 사람이 남지 않았어.", "사실은 따뜻한 밥을 함께 나눌 사람이 그리웠는지도 몰라.", "네가 내 곁에 있어 주니까, 날을 세우지 않아도 마음이 놓여.", "끝까지 살아남아서, 같이 배불리 먹을 날을 보자.", "…칼이 안 움직여. 너는 못 죽이겠다."]},
  { name: '이노우에 나나미', club: '연극부', trait: '이타적', zone: 'south_coast', weapon: '소품지팡이', line: '서로 적으로만 보지 않으면 조금은 나아지지 않을까?', scripts: ["서로 적으로만 보지 않으면 조금은 나아지지 않을까?", "한마디라도 따뜻하게 건네면 마음이 풀릴 때가 있잖아.", "서로 조금만 배려해도 분위기가 달라질 수 있어.", "조용히 미소 지으며 상대의 말을 차분히 기다린다.", "주변 상황을 살피며 차분하게 호흡을 고르고 있다.", "남을 다독이려 애쓰면서 정작 내 마음은 돌보지 못할 때가 많았어.", "상처 입은 사람들을 보며 나까지 무너질 뻔한 적도 있었지.", "네가 내 진심을 알아 줄 때, 비로소 숨통이 트이는 기분이 들어.", "끝까지 서로를 잃지 않고 살아남을 수 있으면 좋겠어.", "…너를 상처 입힐 수 없어. 너는 못 죽이겠다."]},
  { name: '요시다 켄토', club: '궁도부', trait: '기회주의', zone: 'marsh', weapon: '사냥칼', line: '둘이 싸우다 지치면 남는 건 내 몫이지.', scripts: ["둘이 싸우다 지치면 남는 건 내 몫이지.", "남들이 소모될 때 타이밍을 재는 게 가장 깔끔해.", "지금 상황, 꽤 재미있게 흘러가고 있네.", "말없이 눈을 가늘게 뜨고 주변 분위기를 살핀다.", "주변의 움직임과 거리를 계산하며 조용히 때를 기다리고 있다.", "혼자서만 유리한 위치를 선점하려 애쓰다 보니 늘 외로웠어.", "남의 불행을 발판 삼는 게 익숙해질수록 마음이 삭막해지더라.", "너와 함께 움직이면서 처음으로 '같이 살아남는 것'의 가치를 느꼈어.", "이제는 내 몫을 나누더라도 너와 끝까지 가고 싶어.", "…이건 내 몫이 아니야. 너는 못 죽이겠다."]},
  { name: '와타나베 에미', club: '만화부', trait: '이타적', zone: 'tomb', weapon: '잉크펜', line: '방금 본 동선이나 특이한 점 있으면 알려줄게.', scripts: ["방금 본 동선이나 특이한 점 있으면 알려줄게.", "작은 단서 하나가 생존을 가를 때도 있어.", "주변에서 본 것들을 정리해 두면 도움이 될 거야.", "조용히 침묵하며 주변의 흔적과 동선을 살핀다.", "관찰한 내용을 머릿속으로 정리하며 신중하게 움직이고 있다.", "남의 이야기를 기록하는 데 익숙했지만, 정작 내 이야기는 감춰 왔어.", "펜 끝으로 세상을 바라보던 시선이, 이제는 너를 향하고 있어.", "네가 내 기록을 믿어 줄 때, 가장 큰 힘이 생겨.", "이 기록의 마지막 장을 너와 함께 웃으며 덮고 싶어.", "…손이 멈췄어. 너는 못 죽이겠다."]},
  { name: '마츠모토 하야토', club: '음악부', trait: '신중형', zone: 'sea_cave', weapon: '드럼채', line: '발소리 하나에도 주위가 울리니까 조심해야 해.', scripts: ["발소리 하나에도 주위가 울리니까 조심해야 해.", "작은 발소리도 크게 울리는 곳이니 움직임을 줄여.", "소리를 죽이고 움직이면 기척을 감추기 쉬워.", "말없이 주변의 작은 소리까지 귀 기울여 듣는다.", "숨소리와 발걸음을 조율하며 주위 경계를 늦추지 않고 있다.", "소음 속에서 리듬을 잡는 게 익숙했지만, 고요 속의 긴장은 다르네.", "혼자서 조용히 버티는 시간이 길어질수록 생각이 많아졌어.", "네가 곁에 있으면 고요 속에서도 두렵지 않아.", "끝까지 침묵을 이겨 내고 너와 함께 살아남자.", "…소리를 낼 수 없어. 너는 못 죽이겠다."]},
  { name: '코바야시 유즈', club: '육상부', trait: '호전적', zone: 'forest', weapon: '스파이크슈즈', line: '도망쳐 봤자 금방 따라잡을 수 있어!', scripts: ["도망쳐 봤자 금방 따라잡을 수 있어!", "물러설 생각이면 처음부터 덤비지 마!", "기세에서 밀리면 끝까지 밀리게 돼 있어!", "말없이 눈빛을 번뜩이며 다음 움직임을 노린다.", "몸을 가볍게 움직이며 주변 상황을 예의주시하고 있다.", "항상 선두에서 내달리느라 멈추는 법을 잊고 살았어.", "남들보다 앞서야 한다는 집착이 때론 나를 몰아붙이기도 했지.", "너와 나란히 달릴 때, 비로소 숨이 트이는 것 같아.", "끝까지 밀어붙여서 둘 다 살아남자!", "…발이 안 떨어져. 너는 못 죽이겠다."]},
  { name: '스즈키 코하루', club: '보건부', trait: '겁쟁이', zone: 'greenhouse', weapon: '알코올솜', line: '피 냄새가 나면 너무 무서워… 다치지 않았으면 좋겠어.', scripts: ["피 냄새가 나면 너무 무서워… 다치지 않았으면 좋겠어.", "다치지 않고 조용히 버틸 수 있으면 얼마나 좋을까…", "상처 나는 일은 정말 겪고 싶지 않아…", "조용히 입술을 깨문 채 작은 손수건을 만진다.", "주변을 조심스럽게 살피며 상비품을 챙기고 있다.", "피를 보면 머릿속이 하얘져서 아무것도 못 할 때가 많았어.", "약한 모습만 보이는 것 같아서 스스로도 답답할 때가 있었지.", "네가 따뜻하게 챙겨 주니까, 나도 조금씩 단단해지는 기분이 들어.", "다치지 말고 끝까지 같이 살아남아 줘.", "무서워도… 너는 못 죽이겠다."]},
  { name: '하세가와 진', club: '검도부', trait: '신중형', zone: 'dorm', weapon: '목검', line: '불필요한 싸움은 피하는 게 상책이야.', scripts: ["불필요한 싸움은 피하는 게 상책이야.", "굳이 칼을 뽑지 않아도 해결할 수 있는 일은 피해야 해.", "냉정하게 거리를 재면서 움직이는 게 안전해.", "말없이 차분한 자세로 주변을 주시한다.", "검의 자세와 주변 지형을 조용히 살피고 있다.", "검을 쥐는 법보다 참는 법을 배우는 데 더 많은 시간이 걸렸어.", "불필요한 충돌을 피하려다 오해를 산 적도 적지 않지.", "네가 내 뜻을 이해해 줄 때, 검을 쥔 손에 힘이 빠져.", "끝까지 침착함을 잃지 않고 너와 함께 살아남고 싶어.", "…칼을 들 수 없어. 너는 못 죽이겠다."]},
  { name: '사토 아오이', club: '요리부', trait: '기회주의', zone: 'warehouse', weapon: '조리집게', line: '쓸 만한 물건만 챙겨 두면 언제든 버틸 수 있어.', scripts: ["쓸 만한 물건만 챙겨 두면 언제든 버틸 수 있어.", "당장 쓸 수 있는 물건부터 확보해 두는 게 현명해.", "준비가 되어 있으면 갑작스런 상황도 버틸 수 있지.", "말없이 눈썹을 살짝 찌푸린 채 주변 물자를 살핀다.", "주머니와 가방 속 물품 구성을 조용히 점검하고 있다.", "어릴 때부터 부족함을 겪어서 물건 하나도 쉽게 버리지 못했어.", "스스로 챙기지 않으면 아무도 챙겨 주지 않는다고 믿었거든.", "네가 내 곁에 있어 주면서부터, 혼자가 아니라는 걸 느끼게 됐어.", "필요한 건 다 챙겼으니, 이제 너와 끝까지 살아남아 볼게.", "…손이 멈췄어. 너는 못 죽이겠다."]},
  { name: '모리타 카나데', club: '연극부', trait: '겁쟁이', zone: 'shrine', weapon: '가면소품', line: '진짜 내 목소리가 나오질 않아… 여긴 어째서 이런 곳이지?', scripts: ["진짜 내 목소리가 나오질 않아… 여긴 어째서 이런 곳이지?", "목이 메인 것처럼 말이 잘 안 나올 때가 많아…", "여기가 현실인지 꿈인지 분간이 안 돼…", "조용히 시선을 내린 채 작은 숨소리만 낸다.", "주변 풍경을 멍하니 바라보며 마음을 진정시키려 하고 있다.", "무대 위에서도 내 진짜 목소리를 내는 게 늘 두려웠어.", "남들이 원하는 모습만 맞추려다 내 이름을 잊어버릴 뻔했지.", "네가 내 이름을 불러 줄 때, 내 목소리가 조금씩 돌아오는 것 같아.", "떨리는 목소리라도 좋으니, 끝까지 너와 함께 있고 싶어.", "…말이 안 나와. 너는 못 죽이겠다."]},
  { name: '키타가와 리쿠', club: '궁도부', trait: '이타적', zone: 'reservoir', weapon: '사냥활', line: '위험한 상황에 빠지면 불러. 할 수 있는 만큼은 도울게.', scripts: ["위험한 상황에 빠지면 불러. 할 수 있는 만큼은 도울게.", "혼자 버티기 힘들 땐 언제든 신호를 줘.", "주변에 위험한 기척이 없는지 먼저 살펴볼게.", "묵묵히 앞을 주시하며 주변 경계를 선다.", "주변 지형과 시야를 살피며 동료를 엄호할 준비를 하고 있다.", "남을 돕는 게 당연하다고 여겼지만, 가끔은 나도 기댈 곳이 필요했어.", "힘든 내색을 하지 않으려 애썼던 날들이 꽤 길었지.", "네가 내 도움을 고마워할 때, 가장 큰 보람을 느껴.", "끝까지 네 곁을 지키며 함께 살아남을게.", "…활시위를 풀게. 너는 못 죽이겠다."]},
  { name: '시노자키 린', club: '방송부', trait: '신중형', zone: 'old_school', weapon: '지휘봉', line: '방송이 울릴 때마다 규칙이 하나씩 조여 오는 느낌이야.', scripts: ["방송이 울릴 때마다 규칙이 하나씩 조여 오는 느낌이야.", "규칙과 안내 방송의 의도를 놓치지 않고 파악해야 해.", "상황이 바뀔 때마다 규칙의 틈을 잘 살펴야지.", "말없이 정면을 응시하며 방송 여파와 주변을 살핀다.", "규칙과 현재 상황을 대조하며 다음 행동을 가늠하고 있다.", "방송실 마이크 앞에서 규칙을 전하던 날들이 겹쳐 보여.", "규칙 뒤에 숨은 사람들의 진짜 마음을 읽으려 늘 애썼지.", "네가 곁에 있으면 차가운 규칙 속에서도 온기가 느껴져.", "이 규칙의 끝에서 너와 함께 살아남고 싶어.", "…지휘봉을 내릴게. 너는 못 죽이겠다."]}
];

function buildNpcRosterForRoom(playerCount = 1) {
  const safePlayers = Math.max(1, Math.min(TARGET_HEADCOUNT - 1, Number(playerCount) || 1));
  const needed = TARGET_HEADCOUNT - safePlayers;
  const shuffled = [...NPC_ROSTER].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, needed).map((n, idx) => ({
    ...n,
    exp_number: 100 + idx + 1
  }));
}

function getZoneHopDistance(fromId, toId) {
  if (fromId === toId) return 0;
  const visited = new Set([fromId]);
  const queue = [[fromId, 0]];
  while (queue.length) {
    const [cur, dist] = queue.shift();
    const z = ISLAND_ZONES.find(x => x.id === cur);
    if (!z) continue;
    for (const nxt of (z.edges || [])) {
      if (nxt === toId) return dist + 1;
      if (!visited.has(nxt)) {
        visited.add(nxt);
        queue.push([nxt, dist + 1]);
      }
    }
  }
  return 4;
}

function calcMoveSeconds(fromId, toId) {
  const hops = getZoneHopDistance(fromId, toId);
  const c = getPickedChar();
  const agiBonus = Math.min(2, Math.floor(((c?.agi || 1) - 1) / 3));
  const clubBonus = c?.club === '육상부' ? 1 : 0;
  const condPen = hasAnyCondition(['부상', '굶주림', '피로']) ? 2 : 0;
  const baseByHops = hops <= 1 ? 3 : (hops === 2 ? 7 : (hops === 3 ? 11 : 14));
  return Math.max(3, Math.min(16, baseByHops - agiBonus - clubBonus + condPen));
}

let authMode = 'login';
let acct = null;
let charList = [];
let pickedCharId = null;
let editingCharId = null;
let friendList = [];
let chatTabMode = 'zone';
let lastDayPhase = 'day';

let draft = {
  expNo: 30, club: '천문부',
  stats: { str: 1, agi: 1, luk: 1, dex: 1 }, avatar: null
};

let affinityMap = {};
let watchOvernight = false;
let npcAlliances = [];
let plantedMines = [];
let zoneDroppedItems = {};

function getNpcAllyPairName(npcName) {
  const pair = (npcAlliances || []).find(([a, b]) => a === npcName || b === npcName);
  if (!pair) return null;
  return pair[0] === npcName ? pair[1] : pair[0];
}

function getActiveConditions(condList) {
  if (Array.isArray(condList)) return condList.filter(x => x && x !== '양호');
  if (typeof condList === 'string' && condList && condList !== '양호') {
    return condList.split('·').map(s => s.trim()).filter(x => x && x !== '양호');
  }
  return [];
}

function formatConditionsText(condList) {
  const arr = getActiveConditions(condList);
  return arr.length ? arr.join(' · ') : '양호';
}

function hasCondition(cond) {
  return getActiveConditions(play.me.conditions).includes(cond);
}

function hasAnyCondition(list) {
  const cur = getActiveConditions(play.me.conditions);
  return list.some(c => cur.includes(c));
}

function addMyCondition(cond) {
  if (!cond || cond === '양호') return false;
  if (!Array.isArray(play.me.conditions)) play.me.conditions = getActiveConditions(play.me.conditions);
  if (!play.me.conditions.includes(cond)) {
    play.me.conditions.push(cond);
    play.me.condition = formatConditionsText(play.me.conditions);
    return true;
  }
  return false;
}

function removeMyCondition(cond) {
  if (!Array.isArray(play.me.conditions)) play.me.conditions = getActiveConditions(play.me.conditions);
  const idx = play.me.conditions.indexOf(cond);
  if (idx >= 0) {
    play.me.conditions.splice(idx, 1);
    play.me.condition = formatConditionsText(play.me.conditions);
    return true;
  }
  return false;
}

let waitRoom = {
  code: null,
  host: false,
  hostName: '',
  title: '',
  maxPlayers: 4,
  isPrivate: false,
  spawnMode: 'school',
  ghostChat: 'ghost_only',
  ready: false,
  chan: null,
  members: []
};

let humanStateMap = {};
let pendingGroupMove = null;
let pendingAllyJoinVote = null;
let activeZoneClashes = {};

let modalState = {
  mode: null,
  battleId: null,
  targetId: null,
  enemyName: '',
  enemyClub: '',
  enemyTrait: '',
  enemyHp: 15,
  enemyMaxHp: 15,
  enemyWeapon: '단검 (내구 6/6)',
  allyFighters: [],
  enemyAllyFighter: null,
  turnQueue: [],
  turnIdx: 0,
  defending: false,
  ambush: false,
  joinedLateMe: false,
  watchSaved: false,
  isPvp: false,
  isMultiBattle: false,
  mySide: 'A',
  sideA: [],
  sideB: [],
  myTurn: true,
  busy: false,
  lootItems: []
};

let play = {
  code: null,
  host: false,
  isSolo: false,
  speed: 1,
  pid: null,
  status: 'playing',
  finished: false,
  paused: false,
  day: 1,
  minutes: 8 * 60,
  hourTickCarry: 0,
  closeSec: CLOSE_CYCLE_SEC,
  banned: [],
  nextBanned: [],
  spawnMode: 'school',
  showNpcChat: true,
  ghostChat: 'ghost_only',
  actionKind: null,
  actionTargetZone: null,
  actionSec: 0,
  actionTimer: null,
  tickTimer: null,
  chan: null,
  players: [],
  recordedFinish: false,
  deathReason: null,
  deathRank: null,
  nightSleepMinutes: 0,
  sessionStartMs: Date.now(),
  combatCount: 0,
  killCount: 0,
  searchCount: 0,
  itemGainCount: 0,
  itemUseCount: 0,
  moveCount: 0,
  socialCount: 0,
  allyCount: 0,
  me: {
    hp: 15, maxHp: 15,
    hunger: 100,
    zone: 'old_school',
    alive: true,
    condition: '양호',
    conditions: [],
    weapon: { name: '맨손', baseAtk: 1, atk: 1, kind: '근접', dura: null, maxDura: null, uid: null },
    bag: [],
    maxBag: 8,
    allies: [],
    selectedAlly: null,
    avatar: null
  }
};

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'viewGame') {
    const h = Math.floor((play.minutes % 1440) / 60);
    bgm.setMode((h >= 6 && h < 18) ? 'day' : 'night');
    bgm.start();
    drawIslandMap();
  } else if (bgm.enabled && bgm.ctx) {
    bgm.setMode('lobby');
    bgm.start();
  }
}

const SAVED_ID_KEY = 'yeoninsiki_saved_id';

function openAuthView(m) {
  authMode = m;
  const savedId = (m === 'login') ? (localStorage.getItem(SAVED_ID_KEY) || '') : '';
  document.getElementById('authIdInput').value = savedId;
  document.getElementById('authPwInput').value = '';
  document.getElementById('authActionBtn').textContent = m === 'login' ? '로그인' : '회원가입';
  document.getElementById('authStatusMsg').textContent = '';
  showView('viewAuth');
}

async function submitAuthView() {
  const id = document.getElementById('authIdInput').value.trim();
  const pw = document.getElementById('authPwInput').value.trim();
  const msg = document.getElementById('authStatusMsg');
  if (!/^[A-Za-z0-9]+$/.test(id)) { msg.textContent = '아이디는 영문·숫자만 입력하세요.'; return; }
  if (!/^[0-9]{4}$/.test(pw)) { msg.textContent = '비밀번호는 숫자 4자리여야 합니다.'; return; }

  if (authMode === 'signup') {
    const { data: dup } = await sb.from('game_users').select('id').eq('username', id).maybeSingle();
    if (dup) { msg.textContent = '이미 존재하는 아이디입니다.'; return; }
    const { data: created, error } = await sb.from('game_users').insert([{ username: id, password: pw }]).select().single();
    if (error) { msg.textContent = error.message; return; }
    acct = created;
    try { localStorage.setItem(SAVED_ID_KEY, id); } catch (e) {}
    await reloadAcct();
    openNewCreator();
  } else {
    const { data: found, error } = await sb.from('game_users').select('*').eq('username', id).eq('password', pw).maybeSingle();
    if (error || !found) { msg.textContent = '아이디 또는 비밀번호가 맞지 않습니다.'; return; }
    acct = found;
    try { localStorage.setItem(SAVED_ID_KEY, id); } catch (e) {}
    await reloadAcct();
    if (charList.length === 0) openNewCreator();
    else openPickerView();
  }
}

async function reloadAcct() {
  if (!acct) return;
  const { data: cs } = await sb.from('user_characters').select('*').eq('user_id', acct.id).order('created_at', { ascending: true });
  charList = cs || [];
  const { data: fs } = await sb.from('user_friends').select('*').eq('user_id', acct.id).order('created_at', { ascending: true });
  friendList = fs || [];
}

function openNewCreator() {
  editingCharId = null;
  draft.expNo = Math.floor(Math.random() * 89) + 11;
  draft.club = '천문부';
  draft.stats = { str: 1, agi: 1, luk: 1, dex: 1 };
  draft.avatar = null;
  const nameIn = document.getElementById('creatorNameInput');
  const msgEl = document.getElementById('creatorMsg');
  if (nameIn) nameIn.value = '';
  if (msgEl) msgEl.textContent = '';
  drawCreatorClubs();
  renderCreator();
  showView('viewCreator');
}

let affinityPointsMap = {};
let bondStreakMap = {};

function getAffinityPoints(name) {
  if (affinityPointsMap[name] === undefined) {
    const c = getPickedChar();
    const npc = NPC_ROSTER.find(n => n.name === name);
    let pts = 8;
    if (c && npc && c.club === npc.club) pts = 24;
    if (c && c.club === '천문부' && (!npc || c.club !== npc.club)) pts += 4;
    affinityPointsMap[name] = Math.min(100, Math.max(0, pts));
  }
  return affinityPointsMap[name];
}

function getAffinity(name) {
  const pts = getAffinityPoints(name);
  const hearts = Math.min(5, Math.max(0, Math.floor(pts / 20)));
  affinityMap[name] = hearts;
  return hearts;
}

function gainAffinityPoints(name, delta) {
  const cur = getAffinityPoints(name);
  const next = Math.min(100, Math.max(0, cur + delta));
  affinityPointsMap[name] = next;
  const h = getAffinity(name);
  return { prevPts: cur, nextPts: next, hearts: h };
}

const TRAIT_LINES_5X3 = {
  "호전적": {
    "food": ["오, 먹을 거냐? 전투 전에 배 채워 두는 건 나쁘지 않지.", "생각보다 센스 있네. 힘내서 싸우라는 뜻인가?", "식량 챙겨 주는 놈 치고 약한 놈은 드물지. 고맙게 먹는다.", "배고픈 상태로 칼 휘두르는 건 성미에 안 맞았거든. 잘 먹겠어.", "이거 먹고 기세 올리면 웬만한 놈은 한 방이지!"],
    "weapon": ["호오, 나한테 이걸 넘긴다고? 쓸 줄 아는 녀석이네.", "손에 착 감기는군. 이 무기라면 앞길 막는 놈들쯤이야.", "무기 하나 더 챙기니까 배짱이 더 두둑해지는데?", "고맙다. 대신 네 뒤를 노리는 놈이 있으면 먼저 베어 주지.", "자신감 하나는 인정해 줄게. 제대로 써먹어 주마."],
    "rescue": ["크윽… 타이밍 딱 맞춰 들어왔네! 빚졌다고는 안 하지만, 나쁘지 않았어.", "네가 끼어들 줄은 몰랐는데… 꽤 배짱이 있잖아?", "덕분에 목숨 건졌네. 다음엔 내가 네 앞을 막아 서 주지!", "비겁하게 몰아붙이던 놈들, 제대로 혼쭐났군. 고맙다.", "…방금 구해 준 건 인정한다. 같이 살아남을 자격이 있네."],
    "chat": ["뭐야, 할 말 있으면 빙빙 돌리지 말고 바로 꺼내.", "이 섬에선 멍때리는 놈부터 당해. 넌 눈빛이 살아 있어서 마음에 들어.", "다음에 누구랑 부딪히든 물러설 생각은 추호도 없어.", "네가 곁에 있으면 등 뒤 신경 쓸 일이 줄어들어서 편하긴 해.", "싸움만 잘하는 줄 알았냐? 상황 돌아가는 건 나도 다 보고 있다고."]
  },
  "겁쟁이": {
    "food": ["으, 응… 먹을 걸 주다니, 나쁜 사람은 아닌 거지? 고마워…", "배가 너무 고파서 손이 떨렸는데… 정말 고마워…", "조금만 나눠 먹어도 마음이 한결 놓이는 것 같아…", "독 같은 건… 아니지? 네 눈빛을 믿어 볼게…", "숨어서 떨기만 하던 나한테 이렇게 챙겨 주다니… 고마워…"],
    "weapon": ["우와… 이거 나한테 줘도 돼? 무섭지만… 들고 있으면 덜 떨릴 것 같아…", "무기 같은 건 잘 못 쓰는데… 그래도 지켜야 할 때가 오면 써 볼게…", "네가 챙겨 준 거니까, 소중히 꼭 쥐고 있을게…", "갑자기 무서운 사람이 나타나도 이거면 조금은 버틸 수 있겠지…?", "고마워… 혹시 위험해지면 나도 힘껏 휘둘러 볼게…"],
    "rescue": ["흑…! 정말 끝났다고 생각했는데… 구해 줘서 고마워, 진짜 고마워…!", "무서워서 움직일 수도 없었는데… 네가 나타나 줘서 살았어…", "심장이 아직도 쿵쾅거려… 네가 아니었으면 난 벌써…", "나 같은 겁쟁이를 위해 위험을 무릅써 주다니… 절대 안 잊을게…", "이제 혼자 남겨져도… 네가 구해 줬다는 기억 덕분에 조금은 용기가 나…"],
    "chat": ["히익…! 아, 너구나… 갑자기 말 걸어서 깜짝 놀랐잖아…", "발소리만 들려도 심장이 쪼그라들어… 너도 무섭지 않아?", "혼자 있는 것보단 이렇게 잠깐이라도 얘기하는 게 훨씬 덜 무서워.", "부탁이야, 갑자기 큰 소리 내거나 무기 휘두르지 말아 줘…", "네 목소리 들으니까 조금 진정된다… 고마워, 말 걸어 줘서."]
  },
  "기회주의": {
    "food": ["어라, 공짜 식량인가? 일단 감사히 받아 두지.", "당장 허기를 때울 수 있다면 마다할 이유가 없지.", "뭔가 노림수가 있는 건가 싶다가도… 배고픈 건 못 참겠네.", "거래 조건이라도 걸 줄 알았는데 순순히 내놓네. 나쁘지 않아.", "이런 식으로 호의를 쌓아 두는 거군. 꽤 영리한데?"],
    "weapon": ["오, 꽤 쓸 만한 장비잖아? 내 손에 들어온 이상 잘 써 주지.", "무기를 쥐어 준다는 건 그만큼 판을 키우겠다는 뜻이겠지.", "이거면 유리한 고지를 점하기 훨씬 수월해지겠네. 고마워.", "네가 이걸 넘긴 이유, 나름대로 계산해 둘게.", "좋아, 좋은 패를 쥐었으니 이제 판세를 한번 읽어 볼까."],
    "rescue": ["하마터면 큰 손해 볼 뻔했네. 타이밍 좋게 끼어들었어.", "네가 움직여 준 덕분에 빚을 졌군. 계산에 넣어 두지.", "판이 뒤집히는 순간을 제대로 잡았네. 인정해 줄게.", "위험을 감수하고 구해 줄 줄은 몰랐는데… 의외의 변수야.", "이번엔 네 덕을 봤어. 조건만 맞으면 같이 움직여도 나쁘지 않겠네."],
    "chat": ["지금 이 구역에 누가 남아 있는지 대충 파악은 끝났어?", "서로 손해 볼 일 없으면 잠깐 정보 교환 정도는 괜찮지.", "너도 눈치 빠르게 움직이는 편이네. 오래 살아남겠어.", "무작정 덤비는 놈들보다 너처럼 말 통하는 쪽이 훨씬 다루기 편해.", "다음 폐쇄 구역이 어디가 될지, 미리 머리 굴려 두는 게 좋을걸."]
  },
  "이타적": {
    "food": ["나까지 이렇게 챙겨 주다니… 고마워, 네 몫도 꼭 잘 챙겨야 해.", "따뜻한 마음까지 같이 전해지는 것 같아. 정말 고마워.", "서로 조금씩 나누면서 버티면 분명 길이 보일 거야.", "네가 이렇게 마음을 써 주니까 나도 더 힘을 내야겠다는 생각이 들어.", "고마워. 이 고마움은 꼭 다른 방식으로 갚을게."],
    "weapon": ["소중한 무기를 나한테 선뜻 내어 주다니… 고마워, 꼭 지킬게.", "네가 믿고 맡겨 준 무기니까, 부끄럽지 않게 다루겠어.", "이걸로 나뿐만 아니라 주변 사람들도 지킬 수 있다면 좋겠어.", "네 마음까지 함께 건네받은 기분이야. 고마워.", "든든한 장비를 쥐여 줘서 고마워. 무리하지 않고 잘 쓸게."],
    "rescue": ["위험한데 나 때문에 나서 주다니… 정말 고마워, 네가 아니었으면…", "네가 구해 줘서 무사할 수 있었어. 다친 데는 없어?", "누군가를 구한다는 게 말처럼 쉽지 않은데… 넌 정말 대단해.", "네 덕분에 다시 숨을 쉴 수 있게 됐어. 진심으로 고마워.", "이 은혜는 절대 잊지 않을게. 네가 위급할 땐 내가 꼭 지킬게."],
    "chat": ["어디 다친 데는 없어? 무리해서 돌아다니지 말고 쉴 땐 쉬어.", "이런 상황일수록 서로 말을 나누면서 마음을 붙잡아야 해.", "네가 무사한 얼굴로 여기 서 있는 것만으로도 다행이야.", "혹시 배고프거나 피곤하면 숨기지 말고 꼭 말해 줘.", "혼자 짊어지려 하지 마. 내가 도울 수 있는 일이면 언제든 도울게."]
  },
  "냉정형": {
    "food": ["식량 보급인가. 효율적인 판단이다. 고맙다.", "허기 관리는 생존의 기본이지. 잘 챙겨 두겠다.", "불필요한 감정 없이 필요한 걸 건네는군. 마음에 든다.", "체력 유지에 도움이 되겠군. 고맙게 받는다.", "상황 파악이 빠르군. 식량은 아껴서 쓰겠다."],
    "weapon": ["실전용 장비로군. 무장 상태가 한층 안정되겠다.", "무기의 특성을 파악해 두면 교전에서 유리해진다. 고맙다.", "공격 옵션을 늘려 준 건 확실한 이득이다. 잘 쓰겠다.", "네 판단은 냉정하고 정확하군. 이 무기로 간격을 지키겠다.", "제때 무장을 보충해 줘서 고맙다. 방심하지 않겠다."],
    "rescue": ["개입 타이밍이 정확했다. 덕분에 불리한 교전을 끊었군.", "냉정하게 상황을 읽고 움직였구나. 고맙다.", "위기 상황에서 흔들리지 않고 구해 줘서 고맙게 생각한다.", "네 판단력 덕분에 생존 확률이 유지됐다. 기억해 두겠다.", "예상 밖의 지원이었지만 결과는 확실하군. 고맙다."],
    "chat": ["현재 남은 인원과 폐쇄 주기를 계산해 두면 동선 낭비가 줄어든다.", "불필요한 소음을 내지 않는 선에서 대화하는 건 문제없다.", "네 움직임은 군더더기가 적군. 생존 확률이 높은 유형이다.", "체력과 허기 수치를 일정선 이상으로 유지하는 게 최우선이다.", "감정에 휘둘리지 않고 판단할 수 있다면 끝까지 버틸 수 있다."]
  },
  "신중형": {
    "food": ["음식을 건네주다니… 고마워. 상하지 않았는지 확인하고 잘 먹을게.", "배고픔을 줄여 두면 판단도 차분해지지. 고마워.", "조심스럽지만 네 호의는 고맙게 받을게.", "지금 같은 상황에선 식량 하나가 큰 힘이 돼. 고마워.", "천천히 아껴 먹으면서 버텨 볼게. 고마워."],
    "weapon": ["신중하게 고른 무기 같네. 다루기 익혀서 조심스레 쓸게.", "내구도나 간격을 잘 재면서 쓰면 꽤 믿음직하겠어. 고마워.", "갑작스런 습격에 대비할 수단이 생겼네. 고마워.", "무기를 넘겨준 네 신중함에 고마움을 표할게.", "무리하지 않고 꼭 필요한 순간에만 쓰도록 할게."],
    "rescue": ["위험한 순간에 침착하게 구해 줘서 정말 고마워…", "설마 제때 나타나 줄 줄은 몰랐어. 덕분에 살았어.", "방심했던 내 실수를 네가 메워 줬네. 고마워.", "안전하게 빠져나올 수 있게 해 줘서 정말 고마워.", "네가 옆에 있어 줘서 한시름 놨어. 앞으로 더 조심할게."],
    "chat": ["주변에 다른 기척이 없는지 먼저 살피고 얘기하자.", "서두르다 발을 헛디디면 끝이야. 한 걸음씩 확인하면서 가야 해.", "너처럼 차분하게 대화할 수 있는 사람을 만나서 다행이야.", "다음 구역으로 옮기기 전에 가방 속 물자부터 점검해 두는 게 좋아.", "밤에는 시야가 좁아지니까 무리한 이동은 피하는 게 안전해."]
  },
  "감정형": {
    "food": ["으응… 먹을 거 챙겨 주는 거, 괜히 가슴이 뭉클하잖아. 고마워!", "배고팠던 마음이 한순간에 사르르 풀리는 기분이야!", "이런 사소한 다정함이 이 섬에선 제일 크게 와닿아.", "고마워! 너랑 있으면 감정선이 자꾸 요동치네.", "잘 먹을게! 덕분에 기운이 확 살아났어!"],
    "weapon": ["와, 멋지다! 이 무기 들고 있으면 극적인 장면이라도 찍을 것 같아!", "네가 이걸 건네주니까 마음이 확 뜨거워지네. 고마워!", "진짜 승부는 지금부터라는 느낌이야! 잘 쓸게!", "이런 무기를 내 손에 쥐여 주다니, 기대를 저버릴 수 없지!", "고마워! 감정 실어서 제대로 한 방 날려 줄게!"],
    "rescue": ["하아… 심장이 터질 것 같았는데 네가 나타나서 구해 줬어…!", "극적인 구출이잖아…! 정말 고마워, 눈물이 다 나려고 해…", "네가 내 편이 되어 준 순간이 너무 강렬하게 남았어. 고마워!", "살았다는 실감이 확 들어… 정말 고마워!", "이 장면은 절대 잊지 못할 거야. 구해 줘서 진심으로 고마워!"],
    "chat": ["하아… 혼자 속으로 끙끙 앓고 있었는데 네가 말 걸어 줘서 살았어!", "이 섬 분위기 너무 숨 막히지 않아? 너랑 얘기하니까 이제야 숨통이 트여.", "네 표정 보니까 나도 왠지 용기가 막 솟아나는 기분이야!", "사소한 한마디라도 이렇게 주고받으니까 우리가 아직 사람 같아.", "우리 꼭 끝까지 버텨서 이 지긋지긋한 무대에서 살아남자!"]
  },
  "자유형": {
    "food": ["오, 땡큐! 배고팠는데 딱 타이밍 좋게 들어왔네.", "형식 차릴 거 있나, 맛있게 먹으면 그만이지! 고마워.", "이런 소소한 챙김, 은근히 기분 좋은데?", "먹을 거 나눠 주는 사람과는 금방 친해질 수 있을 것 같아.", "잘 먹었어! 이제 다시 가볍게 움직여 볼까?"],
    "weapon": ["오호, 이거 꽤 쿨한데? 내 스타일대로 자유롭게 써 볼게!", "무기 하나 생기니까 분위기가 확 바뀌네. 고마워!", "틀에 박히지 않고 내 방식대로 휘둘러 볼게!", "고마워, 좋은 장난감 하나 생긴 기분이야!", "이거면 어디서든 내 리듬을 지킬 수 있겠어."],
    "rescue": ["어이쿠, 꽤 아슬아슬했네! 구해 줘서 고마워, 넌 진짜 멋지다.", "위기 속에서 툭 튀어나와 구해 주다니, 영화 같은데?", "덕분에 한숨 돌렸어. 고마워, 다음엔 내가 한 턱 쏠게!", "흐름이 꼬일 뻔했는데 네가 깔끔하게 끊어 줬네. 고마워!", "살아남는 재미는 이런 데서 오는 건지도 모르겠네. 고마워!"],
    "chat": ["여어, 잘 버티고 있네? 바람 쐬는 셈 치고 잠깐 수다나 떨까.", "규칙이 빡빡할수록 자기 리듬을 잃지 않는 게 중요하거든.", "너랑 얘기하면 긴장이 좀 풀려서 좋아. 너무 뻣뻣하게 굴지 말자고.", "어디로 튈지 모르는 판이니까 오히려 재밌는 구석도 있지 않아?", "피곤하면 잠깐 쉬었다 가. 억지로 몰아붙인다고 능사는 아니니까."]
  },
  "관찰형": {
    "food": ["식량을 건네는 행동에서 네 성향이 조금 보이네. 고마워.", "허기를 채워 두면 주변을 관찰하는 집중력도 유지되지. 고마워.", "말없이 챙겨 주는 모습이 인상적이야. 잘 먹을게.", "상황을 보고 필요한 걸 건넬 줄 아는 사람이구나. 고마워.", "이 식량, 요긴하게 쓰면서 주변 동선도 잘 살펴볼게."],
    "weapon": ["이 무기의 무게중심과 사거리… 꽤 흥미로운 선택이야. 고마워.", "상대 움직임을 읽으면서 쓰기에 나쁘지 않은 장비네.", "무장을 보충해 준 의도, 잘 새겨둘게. 고마워.", "관찰만 하던 나에게 확실한 수단을 쥐여 줬네.", "네가 건네준 무기, 빈틈없이 잘 다뤄 볼게."],
    "rescue": ["공격 타이밍과 시야 사각을 정확히 노렸네. 구해 줘서 고마워.", "주변을 면밀히 보고 있었기에 가능했던 구출이야. 고마워.", "위기 순간에도 침착하게 움직이는 걸 보니 예사롭지 않네.", "네 덕분에 상황을 다시 볼 수 있게 됐어. 고마워.", "기록해 두고 싶을 만큼 든든한 지원이었어. 고마워."],
    "chat": ["방금 전까지 네가 움직인 동선, 꽤 흥미롭게 지켜보고 있었어.", "말투나 시선 처리를 보면 그 사람이 지금 여유가 있는지 바로 보이지.", "넌 위기 상황에서도 주변을 살피는 눈이 살아 있네.", "이 구역에 남은 흔적들을 보면 최근에 누가 지나갔는지 대충 짐작이 가.", "너와 대화를 나누다 보면 새로운 단서가 하나씩 정리되는 기분이야."]
  },
  "돌격형": {
    "food": ["좋아, 밥심으로 밀어붙이는 거지! 고맙다!", "허기 채웠으니 이제 몸이 훨씬 가벼운데? 잘 먹었어!", "망설임 없이 챙겨 주는 기세, 마음에 들어!", "배고픔 따위로는 안 멈춰! 고맙게 잘 먹을게!", "든든하게 먹었으니 앞장서서 달려 볼까!"],
    "weapon": ["오, 바로 이거지! 무장 갖췄으니 망설일 게 없군!", "이 무기 쥐고 정면으로 돌파해 주마! 고맙다!", "공격력 보충 완료! 부딪힐 놈 있으면 바로 맞선다!", "고맙다! 주저하지 않고 끝까지 밀어붙여 볼게!", "네가 찔러 준 이 무기, 헛되게 안 휘두른다!"],
    "rescue": ["크하, 뒤치기 당할 뻔했는데 네가 치고 들어왔네! 고맙다!", "망설임 없이 달려들어 구해 준 그 배짱, 끝내주는데!", "네가 옆에서 받쳐 주니까 한 번 더 돌격할 힘이 난다!", "위기를 뚫고 구해 줘서 고맙다! 이 기세 그대로 간다!", "같이 부딪혀서 살아남자는 뜻이지? 고맙다, 동료!"],
    "chat": ["우물쭈물할 시간 없어! 지금 기세 좋으니까 바로 밀고 나가자고!", "너도 뒤로 빼는 타입은 아니구나? 마음에 쏙 드는데!", "부딪혀야 할 땐 정면으로 뚫어 버리는 게 제일 깔끔해.", "체력만 받쳐 주면 어디든 먼저 치고 들어갈 준비 돼 있어!", "말 주고받으니까 몸이 근질거리네. 다음 구역도 한 번에 돌파하자!"]
  }
};

function getTraitSituationalLine(npcName, kind) {
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const tr = npc && TRAIT_LINES_5X3[npc.trait] ? npc.trait : '신중형';
  const pool = (TRAIT_LINES_5X3[tr] && TRAIT_LINES_5X3[tr][kind]) ? TRAIT_LINES_5X3[tr][kind] : TRAIT_LINES_5X3['신중형'][kind];
  return pool[Math.floor(Math.random() * pool.length)];
}

let npcStateMap = {};
let allyBondEventCooldown = {};

function findHumanPlayerRow(name) {
  if (!name) return null;
  const target = String(name).trim();
  const isHumanFlag = (val) => val === false || val === 'false' || val === 0 || val === '0' || val == null;
  return play.players.find(p => isHumanFlag(p.is_npc) && String(p.name || '').trim() === target) || null;
}

function isHumanPlayerName(name) {
  if (!name) return false;
  if (findHumanPlayerRow(name)) return true;
  if (humanStateMap[name]) return true;
  if (!NPC_ROSTER.some(n => n.name === name) && waitRoom.members.some(m => m.name === name)) return true;
  return false;
}

function getParticipantAvatar(name) {
  const myName = getPickedChar()?.name;
  if (name === myName) return play.me.avatar || null;
  if (humanStateMap[name]?.avatar) return humanStateMap[name].avatar;
  const pRow = play.players.find(p => String(p.name || '').trim() === String(name || '').trim());
  if (pRow?.avatar_data) return pRow.avatar_data;
  if (pRow?.stats?.avatar) return pRow.stats.avatar;
  const wMem = waitRoom.members.find(m => m.name === name);
  if (wMem?.avatar_data) return wMem.avatar_data;
  if (wMem?.stats?.avatar) return wMem.stats.avatar;
  return null;
}

function getParticipantState(name) {
  const pRow = findHumanPlayerRow(name);
  if (pRow || isHumanPlayerName(name)) {
    const h = humanStateMap[name] || {};
    return {
      isHuman: true,
      hp: pRow?.hp ?? h.hp ?? 15,
      maxHp: 15,
      hunger: h.hunger ?? 100,
      sleepMinutes: h.sleepMinutes ?? 0,
      condition: formatConditionsText(h.conditions || h.condition || '양호'),
      sleeping: Boolean(h.sleeping),
      bag: Array.isArray(h.bag) ? h.bag : [],
      avatar: getParticipantAvatar(name)
    };
  }
  return getNpcState(name);
}

function getNpcState(npcName) {
  if (!npcStateMap[npcName]) {
    const meta = NPC_ROSTER.find(n => n.name === npcName);
    const pRow = play.players.find(p => p.name === npcName);
    const wepName = meta?.weapon || '단검';
    const wepBase = LOOT_ITEMS.find(x => x.name === wepName) || STARTER_WEAPONS.find(x => x.name === wepName);
    const wepAtk = wepBase?.atk || 4;
    const wepKind = wepBase?.kind || '근접';
    const wepDura = wepBase?.dura || 6;
    npcStateMap[npcName] = {
      isHuman: false,
      hp: pRow ? (pRow.hp ?? 15) : 15,
      maxHp: 15,
      hunger: 78 + Math.floor(Math.random() * 18),
      sleepMinutes: 180,
      condition: '양호',
      sleeping: false,
      bag: [
        ensureItemUid({ name: wepName, type: 'weapon', atk: wepAtk, kind: wepKind, dura: wepDura, maxDura: wepDura, desc: `공격력 ${wepAtk} (${wepKind}) · 내구 ${wepDura}/${wepDura}` }),
        ensureItemUid({ name: '빵', type: 'food', val: 28, desc: '허기 +28 · 굶주림 완화' }),
        ensureItemUid({ name: '붕대', type: 'heal', val: 3, cures: ['출혈'], desc: 'HP +3 · 출혈 치료' })
      ]
    };
  }
  const pRow = play.players.find(p => p.name === npcName);
  if (pRow && typeof pRow.hp === 'number') {
    npcStateMap[npcName].hp = pRow.hp;
  }
  return npcStateMap[npcName];
}

function getItemDesc(it) {
  if (!it) return '';
  if (it.desc) return it.desc;
  const ref = LOOT_ITEMS.find(x => x.name === it.name)
    || STARTER_WEAPONS.find(x => x.name === it.name)
    || STARTER_FOODS.find(x => x.name === it.name)
    || STARTER_UTILITIES.find(x => x.name === it.name);
  if (ref && ref.desc) return ref.desc;
  if (it.type === 'weapon') {
    const dStr = it.dura != null ? ` · 내구 ${it.dura}/${it.maxDura || it.dura}` : '';
    return `공격력 ${it.atk || 3} (${it.kind || '근접'})${dStr}`;
  }
  if (it.type === 'food') return `허기 +${it.val || 20}`;
  if (it.type === 'heal') {
    const cStr = Array.isArray(it.cures) && it.cures.length ? ` · ${it.cures.join('/')} 치료` : '';
    return `HP +${it.val || 2}${cStr}`;
  }
  return '';
}

function consumeEquippedWeaponDurability(c) {
  const w = play.me.weapon;
  if (!w || w.name === '맨손' || w.dura == null) return { broke: false };

  w.dura = Math.max(0, w.dura - 1);
  let eqIdx = w.uid ? play.me.bag.findIndex(b => b.uid === w.uid) : -1;
  if (eqIdx < 0) eqIdx = play.me.bag.findIndex(b => b.type === 'weapon' && b.name === w.name);

  if (eqIdx >= 0 && play.me.bag[eqIdx]) {
    play.me.bag[eqIdx].dura = w.dura;
    play.me.bag[eqIdx].desc = `공격력 ${play.me.bag[eqIdx].atk || w.baseAtk} (${play.me.bag[eqIdx].kind || w.kind || '근접'}) · 내구 ${w.dura}/${w.maxDura}`;
  }

  const prevDura = w.dura;
  const prevMax = w.maxDura;
  const prevName = w.name;

  if (w.dura <= 0) {
    if (eqIdx >= 0) {
      play.me.bag.splice(eqIdx, 1);
    } else {
      const fallbackIdx = play.me.bag.findIndex(b => b.type === 'weapon' && b.name === prevName);
      if (fallbackIdx >= 0) play.me.bag.splice(fallbackIdx, 1);
    }
    const sBon = Math.floor(((c?.str || 1) - 1) * 0.5);
    play.me.weapon = { name: '맨손', baseAtk: 1, atk: 1 + sBon, kind: '근접', dura: null, maxDura: null, uid: null };
    return { broke: true, brokenName: prevName, dura: 0, maxDura: prevMax };
  }
  return { broke: false, name: prevName, dura: prevDura, maxDura: prevMax };
}

function unequipWeaponIfRemoved(removedItem) {
  if (!removedItem || removedItem.type !== 'weapon') return;
  const w = play.me.weapon;
  if (!w || w.name === '맨손') return;
  const stillHas = (w.uid && play.me.bag.some(b => b.uid === w.uid))
    || (!w.uid && play.me.bag.some(b => b.type === 'weapon' && b.name === w.name));
  if (!stillHas) {
    const c = getPickedChar();
    const sBon = Math.floor(((c?.str || 1) - 1) * 0.5);
    play.me.weapon = { name: '맨손', baseAtk: 1, atk: 1 + sBon, kind: '근접', dura: null, maxDura: null, uid: null };
  }
}

async function broadcastMyStateSync() {
  if (!play.code || !play.pid || play.isSolo) return;
  const c = getPickedChar();
  if (!c) return;
  play.me.condition = formatConditionsText(play.me.conditions);
  await sb.from('room_messages').insert([{
    room_code: play.code,
    sender: c.name,
    zone: play.me.zone,
    msg_type: 'state_sync',
    content: JSON.stringify({
      hp: play.me.hp,
      hunger: play.me.hunger,
      sleepMinutes: play.nightSleepMinutes || 0,
      condition: play.me.condition,
      conditions: getActiveConditions(play.me.conditions),
      sleeping: isSleepingNow,
      bag: play.me.bag,
      allies: play.me.allies || [],
      avatar: play.me.avatar || null
    })
  }]);
}

async function triggerAllyAffinityEvent(allyName) {
  if (!play.me.alive || play.finished || !play.me.allies.includes(allyName) || isHumanPlayerName(allyName)) return;
  const hearts = getAffinity(allyName);
  if (hearts < 1) return;

  const nowMs = Date.now();
  if ((allyBondEventCooldown[allyName] || 0) > nowMs) return;
  allyBondEventCooldown[allyName] = nowMs + 28000;

  if (play.me.hp <= 10) {
    play.me.hp = Math.min(play.me.maxHp, play.me.hp + 2);
    if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
    pushDialogueToChat(`${allyName} (${renderHearts(hearts)})`, '상처가 깊어 보여. 잠깐 가만히 있어 봐, 내가 응급처치해 줄게.', { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] 【동료 이벤트】 ${allyName}이(가) 상처를 치료해 주었다! (HP +2)`, true);
  } else if (play.me.bag.length < play.me.maxBag && Math.random() < 0.65) {
    const giftList = [
      { name: '주먹밥', type: 'food', val: 32, desc: '허기 +32' },
      { name: '붕대', type: 'heal', val: 3, cures: ['출혈'], desc: 'HP +3 · 출혈 치료' },
      { name: '진통제', type: 'heal', val: 3, cures: ['부상'], desc: 'HP +3 · 부상 치료' }
    ];
    const gift = ensureItemUid({ ...giftList[Math.floor(Math.random() * giftList.length)] });
    play.me.bag.push(gift);
    play.itemGainCount = (play.itemGainCount || 0) + 1;
    sfx.loot();
    pushDialogueToChat(`${allyName} (${renderHearts(hearts)})`, `아까 챙겨 둔 '${gift.name}'이야. 네가 가지고 있는 게 든든할 것 같아서.`, { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] 【동료 이벤트】 호감도가 오른 ${allyName}이(가) '${gift.name}'을(를) 건네주었다!`, true);
  } else {
    play.me.hunger = Math.min(100, play.me.hunger + 10);
    removeMyCondition('피로');
    pushDialogueToChat(`${allyName} (${renderHearts(hearts)})`, '네가 곁에 있어서 정말 다행이야. 조금만 더 힘내자!', { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] 【동료 이벤트】 ${allyName}의 격려로 기운을 차렸다. (허기 +10 · 컨디션 회복)`, true);
  }
}

function getTraitAffinityMult(npcName) {
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const tr = npc ? npc.trait : '신중형';
  if (tr === '이타적' || tr === '겁쟁이' || tr === '감정형') return 1.35;
  if (tr === '자유형' || tr === '신중형' || tr === '관찰형') return 1.1;
  if (tr === '기회주의') return 0.9;
  return 0.78;
}

function getNpcScriptLine(npcName, idx, fallback = '') {
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  if (npc && Array.isArray(npc.scripts) && npc.scripts[idx]) return npc.scripts[idx];
  return fallback || (npc ? npc.line : '…');
}

function renderHearts(n) {
  const full = Math.max(0, Math.min(5, n));
  return '♥'.repeat(full) + '♡'.repeat(5 - full);
}

function toggleNpcChatVisibility() {
  play.showNpcChat = !play.showNpcChat;
  const btn = document.getElementById('btnNpcLineToggle');
  if (btn) {
    btn.textContent = `NPC 대사: ${play.showNpcChat ? 'ON' : 'OFF'}`;
    btn.classList.toggle('on', play.showNpcChat);
  }
  applyChatVisibilityFilter();
}

function applyChatVisibilityFilter() {
  const box = document.getElementById('refChatLog');
  if (!box) return;
  const curZone = String(play.me.zone || '').trim();
  Array.from(box.children).forEach(el => {
    const z = String(el.dataset.zone || 'all').trim();
    const isNpc = el.dataset.npc === '1';
    const zoneMatch = (z === 'all' || z === curZone);
    const npcMatch = (!isNpc || play.showNpcChat);
    el.style.display = (zoneMatch && npcMatch) ? '' : 'none';
  });
}

function setChatTab(mode) {
  chatTabMode = mode;
  applyChatVisibilityFilter();
}

function openAllyInteractionMenu(name) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  play.me.selectedAlly = name;
  const isHuman = isHumanPlayerName(name);
  const pRow = play.players.find(p => p.name === name);
  const npc = NPC_ROSTER.find(n => n.name === name);
  const subInfo = isHuman ? `${pRow?.club || '실험체'} · 유저 동료` : `${npc ? npc.trait : '신중형'} · ${renderHearts(getAffinity(name))}`;
  const st = getParticipantState(name);
  const bagNames = st.bag.length ? st.bag.map(b => b.name).join(', ') : '없음';
  const sleepTxt = st.sleeping ? '💤 수면 중' : `수면 ${Math.floor((st.sleepMinutes || 0) / 60)}/3h`;
  const condTxt = st.sleeping ? `수면 중 · ${st.condition}` : st.condition;
  const menu = document.getElementById('refAllyMenu');
  if (!menu) return;
  menu.style.display = 'block';
  menu.innerHTML = `
    <div style="font-size:11px;font-weight:bold;color:#eae2ce;">${esc(name)} (${esc(subInfo)})</div>
    <div style="font-size:10px;color:#c7d6f5;margin:3px 0;line-height:1.4;background:#101729;padding:4px 5px;border:1px solid #465d8a;">
      <div>HP ${st.hp}/${st.maxHp} · 허기 ${st.hunger}/100 · ${esc(sleepTxt)}</div>
      <div>상태: <strong style="color:${st.sleeping ? '#8eb8ff' : '#eae2ce'};">${esc(condTxt)}</strong></div>
      <div>소지품 (${st.bag.length}개): ${esc(bagNames)}</div>
    </div>
    <div class="ref-ally-grid">
      <button type="button" class="ref-ally-act-btn" onclick="doAllyAction('advise_eat')">음식 먹기 권유</button>
      <button type="button" class="ref-ally-act-btn" onclick="doAllyAction('advise_sleep')">잠자기 권유</button>
      <button type="button" class="ref-ally-act-btn" onclick="doAllyAction('eat')">함께 먹기</button>
      <button type="button" class="ref-ally-act-btn" onclick="doAllyAction('watch')">불침번 부탁</button>
      ${!isHuman ? `<button type="button" class="ref-ally-act-btn" onclick="doAllyAction('story')">이야기 듣기</button>` : `<button type="button" class="ref-ally-act-btn" onclick="doAllyAction('guard_for_ally')">불침번 서주기</button>`}
      ${!isHuman ? `<button type="button" class="ref-ally-act-btn" onclick="doAllyAction('info')">정보 묻기</button>` : `<button type="button" class="ref-ally-act-btn" onclick="requestPartnerStateSync('${esc(name)}')">상태 새로고침</button>`}
      <button type="button" class="ref-ally-act-btn" onclick="openAllyGiveModal('${esc(name)}')">건네주기</button>
      <button type="button" class="ref-ally-act-btn" onclick="doAllyAction('break')">동맹 해제</button>
    </div>`;
  refreshGameUI();
}

function closeAllyMenu() {
  const menu = document.getElementById('refAllyMenu');
  if (menu) menu.style.display = 'none';
}

function openAllyGiveModal(allyName) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  const isHuman = isHumanPlayerName(allyName);
  const st = getParticipantState(allyName);
  const bagBtns = play.me.bag.length
    ? play.me.bag.map((it, i) => `
        <button type="button" class="modal-act-btn" style="text-align:left;display:flex;justify-content:space-between;" onclick="giveSelectedItemToAlly('${esc(allyName)}', ${i})">
          <span>${esc(it.name)} (${esc(getItemDesc(it) || it.type)})</span>
          <span>건네주기 ▶</span>
        </button>`).join('')
    : `<div style="font-size:12px;color:#4a4335;padding:8px 0;">가방에 건네줄 아이템이 없다.</div>`;

  openCenterModal(`
    <div class="modal-top-bar">동료에게 건네주기</div>
    <div class="enc-card" style="text-align:left;">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">${esc(allyName)} ${isHuman ? '[유저 동료]' : renderHearts(getAffinity(allyName))}</div>
      <div style="font-size:11px;color:#3d382d;">현재 소지품(${st.bag.length}개): ${esc(st.bag.map(x => x.name).join(', ') || '없음')}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;margin-bottom:8px;">
      ${bagBtns}
    </div>
    <button type="button" class="modal-act-btn" style="width:100%;" onclick="closeCenterModal()">닫기</button>
  `);
}

async function giveSelectedItemToAlly(allyName, bagIdx) {
  const it = play.me.bag[bagIdx];
  if (!it) return closeCenterModal();
  play.me.bag.splice(bagIdx, 1);
  unequipWeaponIfRemoved(it);
  closeCenterModal();

  const c = getPickedChar();
  if (isHumanPlayerName(allyName)) {
    const h = humanStateMap[allyName] || { bag: [] };
    h.bag = [...(h.bag || []), { ...it }];
    humanStateMap[allyName] = h;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'give_item', to: allyName, item: it })
    }]);
    await broadcastMyStateSync();
    await appendGameLog(`[${fmtClock()}] 동료 ${allyName}에게 '${it.name}'을(를) 건네주었다.`, true);
    openAllyInteractionMenu(allyName);
    return;
  }

  const st = getNpcState(allyName);
  st.bag.push({ ...it });

  const mult = getTraitAffinityMult(allyName);
  const basePt = it.type === 'weapon' ? 11 : (it.type === 'heal' ? 9 : 8);
  const gainPt = Math.max(4, Math.round(basePt * mult));
  const res = gainAffinityPoints(allyName, gainPt);
  play.socialCount = (play.socialCount || 0) + 1;
  const kindKey = it.type === 'weapon' ? 'weapon' : 'food';
  const reply = getTraitSituationalLine(allyName, kindKey);

  await appendGameLog(`[${fmtClock()}] 동료 ${allyName}에게 '${it.name}'을(를) 건네주었다. (${allyName} 소지품 ${st.bag.length}개)`, true);
  pushDialogueToChat(`${allyName} (${renderHearts(res.hearts)})`, reply, { zone: play.me.zone, broadcast: true });
  openAllyInteractionMenu(allyName);
}

async function requestPartnerStateSync(targetName) {
  await broadcastMyStateSync();
  if (!play.code || play.isSolo) return;
  const c = getPickedChar();
  await sb.from('room_messages').insert([{
    room_code: play.code,
    sender: c?.name || '유저',
    zone: play.me.zone,
    msg_type: 'p2p_evt',
    content: JSON.stringify({ kind: 'req_state', to: targetName })
  }]);
  openAllyInteractionMenu(targetName);
}

const TRAIT_BREAK_LINES = {
  "호전적": [
    "흥, 여기까지인가 보군. 다음엔 적으로 마주치더라도 봐주지 마.",
    "서로 발목 잡느니 각자 싸우는 편이 낫지. 칼끝 무뎌지지 않게 조심해.",
    "좋아, 오늘부로 손 떼자고. 다음에 만날 땐 제대로 승부를 겨뤄 보자.",
    "네 등 뒤를 봐주는 건 여기까지야. 살아남아서 결승선에서 보자고."
  ],
  "겁쟁이": [
    "어, 어째서…? 혼자 남으면 너무 무서운데… 그래도 네 선택이라면 어쩔 수 없지…",
    "미안해, 내가 짐만 됐던 거지…? 방해 안 되게 조용히 물러날게…",
    "갑자기 혼자 떨어지려니까 손이 떨려… 부디 다치지 말고 조심해…",
    "알겠어… 원망하진 않을게. 멀리서라도 네가 무사하길 빌게…"
  ],
  "기회주의": [
    "그래, 서로 이득이 다했으니 깔끔하게 갈라서는 게 맞지.",
    "예상보다 빠른 결별이네. 뭐, 다음 판에서 다시 거래할 일이 생길지도 모르지.",
    "굳이 질척거릴 필요 없잖아? 각자 살길 찾는 게 이 섬의 규칙이니까.",
    "좋아, 계약 종료야. 다음엔 서로 칼 겨누는 사이가 안 되길 빌어 보자고."
  ],
  "이타적": [
    "네가 내린 결정이라면 존중할게. 혼자서도 절대 무리하지 말고 밥 꼭 챙겨 먹어.",
    "같이 있어서 정말 든든했어… 떨어져 있어도 네가 무사하기만을 바랄게.",
    "내가 더 도움이 됐어야 했는데 미안해. 부디 끝까지 살아남아 줘.",
    "동맹은 여기서 끝나지만, 네가 위험해지면 난 여전히 모른 척 못 할 것 같아."
  ],
  "냉정형": [
    "합리적인 판단이다. 인원이 줄어들수록 단독 행동이 유리해지는 법이지.",
    "알겠다. 지금까지의 협력에 감사한다. 이후는 각자의 생존율에 맡기자.",
    "불필요한 감정 소모 없이 깔끔하게 정리하지. 건투를 빈다.",
    "동맹 해제를 확인했다. 다음 구역에서 마주칠 땐 경계를 늦추지 않겠다."
  ],
  "신중형": [
    "그래… 서로 움직이는 템포가 달라졌으니 이쯤에서 각자 가는 게 안전하겠어.",
    "갑작스럽긴 하지만 네 뜻대로 하자. 폐쇄 구역 시간 항상 확인하는 거 잊지 마.",
    "함께 걸었던 시간 덕분에 여기까지 버텼어. 혼자서도 돌다리 두드리듯 조심해.",
    "서로에게 부담이 되기 전에 멈추는 것도 현명한 선택이겠지. 부디 무사해."
  ],
  "감정형": [
    "잠깐만… 진짜로 여기서 끝내는 거야? 하아… 알겠어, 붙잡진 않을게.",
    "같이 버티자고 해놓고 이렇게 갈라서다니… 역시 이 섬은 잔인하네.",
    "서운하지 않다면 거짓말이겠지만… 네가 살아남기 위한 선택이라면 받아들일게.",
    "고마웠어. 짧은 시간이었지만 너랑 함께여서 조금은 덜 외로웠어."
  ],
  "자유형": [
    "오케이, 해산! 원래 나도 한곳에 오래 묶여 있는 건 체질에 안 맞았거든.",
    "각자 바람 부는 대로 흩어져 보자고! 살아남으면 나중에 또 웃으면서 보겠지.",
    "쿨하게 갈라서자! 그동안 꽤 재밌었어, 몸조심하라고.",
    "억지로 같이 다니는 것보단 이게 훨씬 편하지. 그럼 각자 파이팅이야!"
  ],
  "관찰형": [
    "네 표정과 동선을 보니 이미 결정을 내린 뒤였구나. 이해했어.",
    "흥미로운 동행이었어. 이제부터는 각자의 선택이 어떤 결과를 부를지 지켜보자.",
    "서로의 패를 너무 많이 보여준 상태니, 거리를 두는 게 자연스러운 수순이겠지.",
    "알겠어. 떨어져 있어도 네 행적은 계속 눈에 밟힐 것 같네. 조심해."
  ],
  "돌격형": [
    "좋아! 이제 눈치 보지 않고 내 페이스대로 정면 돌파할 수 있겠군!",
    "각자 흩어져서 판을 흔들어 보자고! 뒤처지지 말고 끝까지 살아남아!",
    "그래, 사나이답게 깔끔히 갈라서자! 다음에 만나면 누가 더 강해졌는지 보자고!",
    "망설임 없이 끝내는 게 너답네. 나도 내 길 뚫으러 바로 출발한다!"
  ]
};

function getTraitBreakLine(npcName) {
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const tr = npc && TRAIT_BREAK_LINES[npc.trait] ? npc.trait : '신중형';
  const pool = TRAIT_BREAK_LINES[tr];
  return pool[Math.floor(Math.random() * pool.length)];
}

async function doAllyAction(kind) {
  const ally = play.me.selectedAlly || play.me.allies[0];
  if (!ally) return closeAllyMenu();
  const isHuman = isHumanPlayerName(ally);
  const c = getPickedChar();

  if (isHuman) {
    if (kind === 'advise_eat' || kind === 'advise_sleep' || kind === 'watch' || kind === 'guard_for_ally') {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: c?.name || '유저',
        zone: play.me.zone,
        msg_type: 'p2p_evt',
        content: JSON.stringify({ kind, to: ally })
      }]);
      const labelMap = {
        advise_eat: '음식을 먹으라고 권유했다.',
        advise_sleep: '잠을 자라고 권유했다.',
        watch: '불침번을 부탁했다.',
        guard_for_ally: '불침번을 서주겠다고 알렸다.'
      };
      await appendGameLog(`[${fmtClock()}] 동료 ${ally}에게 ${labelMap[kind]}`, true);
    } else if (kind === 'eat') {
      const foodEntries = play.me.bag
        .map((item, idx) => ({ item, idx }))
        .filter(x => x.item.type === 'food');
      if (!foodEntries.length) {
        await appendGameLog(`[${fmtClock()}] 나눠 먹을 음식이 없다.`, true);
        refreshGameUI();
        return;
      }
      const foodBtns = foodEntries.map(({ item, idx }) => {
        const halfVal = Math.max(1, Math.floor((item.val || 25) / 2));
        return `
          <button type="button" class="modal-act-btn" style="text-align:left;display:flex;justify-content:space-between;" onclick="confirmShareFoodWithAlly('${esc(ally)}', ${idx})">
            <span>${esc(item.name)} (전체 허기 +${item.val || 25})</span>
            <span>각자 +${halfVal} 나누기 ▶</span>
          </button>`;
      }).join('');
      openCenterModal(`
        <div class="modal-top-bar">함께 먹기 · 음식 선택</div>
        <div class="enc-card" style="text-align:left;">
          <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">${esc(ally)}님과 함께 나눠 먹을 음식을 선택하세요</div>
          <div style="font-size:11px;color:#3d382d;">선택한 음식의 허기 회복량을 절반씩 나누어 먹습니다.</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;margin-bottom:8px;">
          ${foodBtns}
        </div>
        <button type="button" class="modal-act-btn" style="width:100%;" onclick="closeCenterModal()">취소</button>
      `);
      return;
    } else if (kind === 'break') {
      play.me.allies = play.me.allies.filter(n => n !== ally);
      play.me.selectedAlly = play.me.allies[0] || null;
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: c?.name || '유저',
        zone: play.me.zone,
        msg_type: 'p2p_evt',
        content: JSON.stringify({ kind: 'break_ally', to: ally })
      }]);
      await broadcastMyStateSync();
      closeAllyMenu();
      await appendGameLog(`[${fmtClock()}] ${ally}과(와) 동맹을 해제했다.`, true);
    }
    refreshGameUI();
    return;
  }

  const st = getNpcState(ally);

  if (kind === 'advise_eat') {
    const npcFoodIdx = st.bag.findIndex(i => i.type === 'food');
    if (npcFoodIdx >= 0) {
      const f = st.bag.splice(npcFoodIdx, 1)[0];
      st.hunger = Math.min(100, st.hunger + (f.val || 25));
      if (st.hunger >= 30 && st.condition === '굶주림') st.condition = '양호';
      gainAffinityPoints(ally, 5);
      play.socialCount = (play.socialCount || 0) + 1;
      await appendGameLog(`[${fmtClock()}] ${ally}에게 음식을 먹으라고 권유해 소지하던 '${f.name}'을(를) 먹었다. (${ally} 허기 ${st.hunger}/100)`, true);
      pushDialogueToChat(ally, `고마워, 챙겨 줘서. '${f.name}' 먹고 나니까 한결 낫네.`, { zone: play.me.zone, broadcast: true });
    } else {
      const myFoodIdx = play.me.bag.findIndex(i => i.type === 'food');
      if (myFoodIdx >= 0) {
        const mf = play.me.bag.splice(myFoodIdx, 1)[0];
        st.hunger = Math.min(100, st.hunger + (mf.val || 25));
        if (st.hunger >= 30 && st.condition === '굶주림') st.condition = '양호';
        gainAffinityPoints(ally, 8);
        play.socialCount = (play.socialCount || 0) + 1;
        await appendGameLog(`[${fmtClock()}] 소지 음식이 없는 ${ally}에게 내 '${mf.name}'을(를) 건네 먹였다. (${ally} 허기 ${st.hunger}/100)`, true);
        pushDialogueToChat(ally, `네 몫까지 내어 주다니… 정말 고마워. 꼭 보답할게!`, { zone: play.me.zone, broadcast: true });
      } else {
        await appendGameLog(`[${fmtClock()}] ${ally}도 당신도 먹일 음식이 없다.`, true);
      }
    }
    openAllyInteractionMenu(ally);
  } else if (kind === 'advise_sleep') {
    st.sleeping = !st.sleeping;
    if (st.sleeping) {
      gainAffinityPoints(ally, 5);
      play.socialCount = (play.socialCount || 0) + 1;
      await appendGameLog(`[${fmtClock()}] ${ally}에게 잠을 자라고 권유했다. (${ally} 수면 시작 · HP/수면 회복)`, true);
      pushDialogueToChat(ally, '알겠어, 네가 곁에 있으니까 마음 놓고 잠깐 눈 붙일게.', { zone: play.me.zone, broadcast: true });
    } else {
      await appendGameLog(`[${fmtClock()}] ${ally}을(를) 깨웠다.`, true);
      pushDialogueToChat(ally, '응, 잘 잤어. 이제 다시 움직이자.', { zone: play.me.zone, broadcast: true });
    }
    openAllyInteractionMenu(ally);
  } else if (kind === 'eat') {
    const foodEntries = play.me.bag
      .map((item, idx) => ({ item, idx }))
      .filter(x => x.item.type === 'food');
    if (!foodEntries.length) {
      await appendGameLog(`[${fmtClock()}] 나눠 먹을 음식이 없다.`, true);
      refreshGameUI();
      return;
    }
    const foodBtns = foodEntries.map(({ item, idx }) => {
      const halfVal = Math.max(1, Math.floor((item.val || 25) / 2));
      return `
        <button type="button" class="modal-act-btn" style="text-align:left;display:flex;justify-content:space-between;" onclick="confirmShareFoodWithAlly('${esc(ally)}', ${idx})">
          <span>${esc(item.name)} (전체 허기 +${item.val || 25})</span>
          <span>각자 +${halfVal} 나누기 ▶</span>
        </button>`;
    }).join('');
    openCenterModal(`
      <div class="modal-top-bar">함께 먹기 · 음식 선택</div>
      <div class="enc-card" style="text-align:left;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">${esc(ally)}님과 함께 나눠 먹을 음식을 선택하세요</div>
        <div style="font-size:11px;color:#3d382d;">선택한 음식의 허기 회복량을 절반씩 나누어 먹습니다.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;margin-bottom:8px;">
        ${foodBtns}
      </div>
      <button type="button" class="modal-act-btn" style="width:100%;" onclick="closeCenterModal()">취소</button>
    `);
    return;
  } else if (kind === 'watch') {
    watchOvernight = true;
    gainAffinityPoints(ally, 3);
    play.socialCount = (play.socialCount || 0) + 1;
    await appendGameLog(`[${fmtClock()}] ${ally}에게 불침번을 부탁했다. (수면 중 기습 방지 및 회피 보정)`, true);
    pushDialogueToChat(ally, '내가 주변 지켜볼게. 편하게 쉬어.', { zone: play.me.zone, broadcast: true });
  } else if (kind === 'story') {
    const npc = NPC_ROSTER.find(n => n.name === ally);
    gainAffinityPoints(ally, 5);
    play.socialCount = (play.socialCount || 0) + 1;
    pushDialogueToChat(ally, getNpcScriptLine(ally, 6, npc ? npc.line : '이 섬의 규칙은 늘 조심해야 해.'), { zone: play.me.zone, broadcast: true });
  } else if (kind === 'info') {
    const safeZones = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
    const sample = safeZones[Math.floor(Math.random() * safeZones.length)] || ISLAND_ZONES[6];
    play.socialCount = (play.socialCount || 0) + 1;
    pushDialogueToChat(ally, `${sample.name} 쪽 얘기인데, ${sample.hint}`, { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] ${ally}에게 ${sample.name} 구역 정보를 들었다.`, true);
  } else if (kind === 'break') {
    play.me.allies = play.me.allies.filter(n => n !== ally);
    play.me.selectedAlly = play.me.allies[0] || null;
    await broadcastMyStateSync();
    closeAllyMenu();
    const res = gainAffinityPoints(ally, -18);
    const breakLine = getTraitBreakLine(ally);
    pushDialogueToChat(`${ally} (${renderHearts(res.hearts)})`, breakLine, { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] ${ally}과(와) 동맹을 해제했다. (호감도 하락 · ${renderHearts(res.hearts)})`, true);
  }
  refreshGameUI();
}

async function confirmShareFoodWithAlly(allyName, bagIdx) {
  const f = play.me.bag[bagIdx];
  if (!f || f.type !== 'food') return closeCenterModal();
  play.me.bag.splice(bagIdx, 1);
  closeCenterModal();

  const halfVal = Math.max(1, Math.floor((f.val || 25) / 2));
  play.me.hunger = Math.min(100, play.me.hunger + halfVal);
  if (play.me.hunger >= 30) removeMyCondition('굶주림');
  play.itemUseCount = (play.itemUseCount || 0) + 1;

  if (isHumanPlayerName(allyName)) {
    const c = getPickedChar();
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'share_food', to: allyName, foodName: f.name, val: halfVal })
    }]);
    await broadcastMyStateSync();
    await appendGameLog(`[${fmtClock()}] 동료 ${allyName}과(와) '${f.name}'을(를) 절반씩 나눠 먹었다. (각자 허기 +${halfVal})`, true);
  } else {
    const st = getNpcState(allyName);
    st.hunger = Math.min(100, st.hunger + halfVal);
    if (st.hunger >= 30 && st.condition === '굶주림') st.condition = '양호';
    gainAffinityPoints(allyName, 5);
    play.socialCount = (play.socialCount || 0) + 1;
    await appendGameLog(`[${fmtClock()}] ${allyName}과(와) '${f.name}'을(를) 절반씩 나눠 먹었다. (각자 허기 +${halfVal})`);
    pushDialogueToChat(allyName, '고마워. 절반씩 나눠 먹으니까 조금 안심이 되네.', { zone: play.me.zone, broadcast: true });
  }
  refreshGameUI();
}

function openNearGiftExchange(npcName) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  const isHuman = isHumanPlayerName(npcName);
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const pRow = play.players.find(p => p.name === npcName);
  const c = getPickedChar();
  const isDrama = (c && c.club === '연극부');
  const traitLbl = (!isHuman && isDrama && npc?.trait) ? ` · ${npc.trait}` : (isHuman ? ' · 유저' : '');
  const aff = getAffinity(npcName);

  const bagBtns = play.me.bag.length
    ? play.me.bag.map((it, i) => `
        <button type="button" class="modal-act-btn" style="text-align:left;display:flex;justify-content:space-between;" onclick="giveItemToNearNpc('${esc(npcName)}', ${i})">
          <span>${esc(it.name)} (${it.type === 'food' ? '음식' : (it.type === 'heal' ? '약품' : '물건')})</span>
          <span>건네주기 ▶</span>
        </button>`).join('')
    : `<div style="font-size:12px;color:#4a4335;padding:8px 0;">건네줄 물건이나 먹을 것이 가방에 없다.</div>`;

  openCenterModal(`
    <div class="modal-top-bar">교류 · 물건/음식 건네주기</div>
    <div class="enc-card" style="text-align:left;">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">${esc(npcName)} (${esc(pRow?.club || npc?.club || '참가자')}${esc(traitLbl)}) ${!isHuman ? '· ' + renderHearts(aff) : ''}</div>
      <div style="font-size:11px;color:#3d382d;">음식이나 회복 아이템을 건네주면 호감도가 크게 오르고 상대 소지품에 들어간다.</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;margin-bottom:8px;">
      ${bagBtns}
    </div>
    <button type="button" class="modal-act-btn" style="width:100%;" onclick="closeCenterModal()">닫기</button>
  `);
}

async function giveItemToNearNpc(npcName, bagIdx) {
  const it = play.me.bag[bagIdx];
  if (!it) return closeCenterModal();
  play.me.bag.splice(bagIdx, 1);
  unequipWeaponIfRemoved(it);
  closeCenterModal();

  const c = getPickedChar();
  if (isHumanPlayerName(npcName)) {
    const h = humanStateMap[npcName] || { bag: [] };
    h.bag = [...(h.bag || []), { ...it }];
    humanStateMap[npcName] = h;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'give_item', to: npcName, item: it })
    }]);
    await broadcastMyStateSync();
    await appendGameLog(`[${fmtClock()}] ${npcName}에게 '${it.name}'을(를) 건네주었다.`, true);
    refreshGameUI();
    return;
  }

  const st = getNpcState(npcName);
  st.bag.push({ ...it });

  const isDrama = (c && c.club === '연극부');
  const mult = getTraitAffinityMult(npcName);
  let basePt = 7;
  let kindKey = 'food';

  if (it.type === 'food') { basePt = 7; kindKey = 'food'; }
  else if (it.type === 'weapon') { basePt = 11; kindKey = 'weapon'; }
  else if (it.type === 'heal') { basePt = 9; kindKey = 'food'; }
  else if (it.name && it.name.startsWith('★')) { basePt = 12; kindKey = it.type === 'weapon' ? 'weapon' : 'food'; }
  else { basePt = 6; kindKey = 'food'; }

  let gainPt = Math.max(3, Math.round(basePt * mult + (isDrama ? 3 : 0)));
  if (Math.random() < 0.22) gainPt += 7;

  const reply = getTraitSituationalLine(npcName, kindKey);
  const res = gainAffinityPoints(npcName, gainPt);
  play.socialCount = (play.socialCount || 0) + 1;
  pushDialogueToChat(`${npcName} (${renderHearts(res.hearts)})`, reply, { zone: play.me.zone, broadcast: true });
  await appendGameLog(`[${fmtClock()}] ${npcName}에게 '${it.name}'을(를) 건네며 교류했다. (${renderHearts(res.hearts)})`, true);
  refreshGameUI();
}

async function interactNearNpc(npcName, askJoin = false) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  if (play.me.allies.includes(npcName)) {
    openAllyInteractionMenu(npcName);
    return;
  }

  if (!askJoin) {
    openNearGiftExchange(npcName);
    return;
  }

  if (play.me.allies.length >= MAX_ALLIES) {
    await appendGameLog(`[${fmtClock()}] 동료는 최대 ${MAX_ALLIES}명까지만 함께할 수 있다.`, true);
    return;
  }

  if (isHumanPlayerName(npcName)) {
    const c = getPickedChar();
    await broadcastMyStateSync();
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({
        kind: 'ally_req',
        to: npcName,
        club: c?.club || '실험체',
        state: {
          hp: play.me.hp,
          hunger: play.me.hunger,
          sleepMinutes: play.nightSleepMinutes || 0,
          condition: formatConditionsText(play.me.conditions),
          conditions: getActiveConditions(play.me.conditions),
          sleeping: isSleepingNow,
          bag: play.me.bag,
          allies: play.me.allies || [],
          avatar: play.me.avatar || null
        }
      })
    }]);
    await appendGameLog(`[${fmtClock()}] ${npcName}에게 동맹 제안을 보냈다. 응답을 기다리는 중...`, true);
    return;
  }

  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const trait = npc ? npc.trait : '신중형';
  const aff = getAffinity(npcName);
  const c = getPickedChar();
  const isDrama = (c && c.club === '연극부');
  const dex = c?.dex || 1;

  let reqAff = 2;
  if (trait === '호전적' || trait === '냉정형' || trait === '기회주의') reqAff = 3;
  if (trait === '이타적' || trait === '겁쟁이') reqAff = 1;
  if (c && npc && c.club === npc.club) reqAff = Math.max(1, reqAff - 1);

  const lowAffBonus = aff < reqAff ? (0.08 + (isDrama ? 0.08 : 0) + (dex - 1) * 0.025) : 0.34;
  const prob = Math.min(0.88, Math.max(0.05, lowAffBonus + (aff - reqAff) * 0.22 + (dex - 1) * 0.05));

  if (Math.random() < prob) {
    const humanAllies = (play.me.allies || []).filter(aName => isHumanPlayerName(aName));
    if (!play.isSolo && humanAllies.length > 0) {
      pendingAllyJoinVote = {
        candidateName: npcName,
        candidateClub: npc?.club || '참가자',
        candidateIsHuman: false,
        pendingFrom: [...humanAllies]
      };
      for (const hAlly of humanAllies) {
        await sb.from('room_messages').insert([{
          room_code: play.code,
          sender: c?.name || '유저',
          zone: play.me.zone,
          msg_type: 'p2p_evt',
          content: JSON.stringify({
            kind: 'party_join_vote',
            to: hAlly,
            candidateName: npcName,
            candidateClub: npc?.club || '참가자',
            candidateIsHuman: false
          })
        }]);
      }
      await appendGameLog(`[${fmtClock()}] ${npcName}이(가) 제안을 수락했습니다! 기존 동료(${humanAllies.join(', ')})의 동의를 기다리는 중...`, true);
      refreshGameUI();
      return;
    }

    play.me.allies.push(npcName);
    play.me.selectedAlly = npcName;
    play.allyCount++;
    play.socialCount = (play.socialCount || 0) + 1;
    await broadcastMyStateSync();
    const joinLine = getNpcScriptLine(npcName, 8, '좋아, 같이 가자. 서로 등 뒤를 지켜 주자고.');
    pushDialogueToChat(`${npcName} (${renderHearts(aff)})`, joinLine, { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] ${npcName}과(와) 동맹을 맺었다! (동료 ${play.me.allies.length}/${MAX_ALLIES})`, true);
    openAllyInteractionMenu(npcName);
  } else {
    play.socialCount = (play.socialCount || 0) + 1;
    const reason = aff < reqAff
      ? `호감도가 아직 부족하다 (${renderHearts(aff)}). 교류로 물건이나 음식을 건네주면 빠르게 친해진다.`
      : '상대가 아직 완전히 마음을 열지 않았다.';
    const refuseLine = getNpcScriptLine(npcName, 2, '아직은 조금 더 지켜보고 싶어.');
    pushDialogueToChat(`${npcName} (${renderHearts(aff)})`, refuseLine, { zone: play.me.zone, broadcast: true });
    await appendGameLog(`[${fmtClock()}] ${npcName}에게 동료 제안을 했지만 거절당했다. ${reason}`, true);
  }
  refreshGameUI();
}

function openHumanAllyRequestModal(fromName, fromClub) {
  if (!play.me.alive || play.finished || modalState.mode) return;
  modalState.mode = 'ally_req';
  modalState.enemyName = fromName;
  openCenterModal(`
    <div class="modal-top-bar">동맹 제안 도착</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${esc(fromName)} (${esc(fromClub)})님이 동맹을 제안했습니다!</div>
      <div style="font-size:12px;color:#333;">동료가 되면 체력·허기·소지품을 실시간으로 공유하고, 구역 이동 시 반드시 함께 움직이게 됩니다. (최대 ${MAX_ALLIES}명)</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="respondHumanAllyRequest(true)">수락한다</button>
      <button type="button" class="modal-act-btn" onclick="respondHumanAllyRequest(false)">거절한다</button>
    </div>`);
}

async function respondHumanAllyRequest(accept) {
  const fromName = modalState.enemyName;
  closeCenterModal();
  const c = getPickedChar();
  const myStatePayload = {
    hp: play.me.hp,
    hunger: play.me.hunger,
    sleepMinutes: play.nightSleepMinutes || 0,
    condition: formatConditionsText(play.me.conditions),
    conditions: getActiveConditions(play.me.conditions),
    sleeping: isSleepingNow,
    bag: play.me.bag,
    allies: play.me.allies || [],
    avatar: play.me.avatar || null
  };
  if (accept && play.me.allies.length < MAX_ALLIES && !play.me.allies.includes(fromName)) {
    const existingHumanAllies = (play.me.allies || []).filter(aName => isHumanPlayerName(aName));
    if (!play.isSolo && existingHumanAllies.length > 0) {
      const fromRow = play.players.find(p => p.name === fromName);
      pendingAllyJoinVote = {
        candidateName: fromName,
        candidateClub: fromRow?.club || '실험체',
        candidateIsHuman: true,
        pendingFrom: [...existingHumanAllies]
      };
      for (const hAlly of existingHumanAllies) {
        await sb.from('room_messages').insert([{
          room_code: play.code,
          sender: c?.name || '유저',
          zone: play.me.zone,
          msg_type: 'p2p_evt',
          content: JSON.stringify({
            kind: 'party_join_vote',
            to: hAlly,
            candidateName: fromName,
            candidateClub: fromRow?.club || '실험체',
            candidateIsHuman: true
          })
        }]);
      }
      await appendGameLog(`[${fmtClock()}] ${fromName}님의 동맹 제안을 받아들이기 위해 기존 동료(${existingHumanAllies.join(', ')})에게 동의를 요청했습니다.`, true);
      refreshGameUI();
      return;
    }

    play.me.allies.push(fromName);
    play.me.selectedAlly = fromName;
    play.allyCount++;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({
        kind: 'ally_res',
        to: fromName,
        accept: true,
        state: myStatePayload,
        partyMembers: [c?.name, ...play.me.allies].filter(Boolean)
      })
    }]);
    await broadcastMyStateSync();
    await appendGameLog(`[${fmtClock()}] ${fromName}님과 동맹을 맺었습니다! (동료 ${play.me.allies.length}/${MAX_ALLIES})`, true);
  } else {
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'ally_res', to: fromName, accept: false })
    }]);
    await appendGameLog(`[${fmtClock()}] ${fromName}님의 동맹 제안을 거절했습니다.`, true);
  }
  refreshGameUI();
}

function openPartyJoinVoteModal(proposerName, candidateName, candidateClub, candidateIsHuman) {
  if (!play.me.alive || play.finished || modalState.mode) return;
  modalState.mode = 'party_join_vote';
  modalState.enemyName = proposerName;
  modalState.victimName = candidateName;
  const tag = candidateIsHuman ? '유저' : 'NPC';
  openCenterModal(`
    <div class="modal-top-bar">새 동료 영입 동의 요청</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">동료 ${esc(proposerName)}님이 ${esc(candidateName)} (${esc(candidateClub)} · ${tag})님을 새 동료로 맞이하려 합니다!</div>
      <div style="font-size:12px;color:#333;">동맹 전원(파티)이 허락하면 모두의 동료 목록에 새 동료가 함께 추가됩니다.</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="respondPartyJoinVote(true)">허락한다</button>
      <button type="button" class="modal-act-btn" onclick="respondPartyJoinVote(false)">거절한다</button>
    </div>`);
}

async function respondPartyJoinVote(accept) {
  const proposerName = modalState.enemyName;
  const candidateName = modalState.victimName;
  closeCenterModal();
  const c = getPickedChar();
  await sb.from('room_messages').insert([{
    room_code: play.code,
    sender: c?.name || '유저',
    zone: play.me.zone,
    msg_type: 'p2p_evt',
    content: JSON.stringify({
      kind: 'party_join_vote_res',
      to: proposerName,
      candidateName,
      accept
    })
  }]);
  await appendGameLog(`[${fmtClock()}] ${proposerName}님의 새 동료(${candidateName}) 영입 요청을 ${accept ? '허락' : '거절'}했습니다.`, true);
}

async function finalizePartyAllianceAddition(candidateName, candidateIsHuman) {
  const c = getPickedChar();
  const myName = c?.name;
  const allPartyNames = Array.from(new Set([myName, ...(play.me.allies || []), candidateName].filter(Boolean))).slice(0, MAX_ALLIES + 1);

  allPartyNames.forEach(memberName => {
    if (memberName !== myName && !play.me.allies.includes(memberName) && play.me.allies.length < MAX_ALLIES) {
      play.me.allies.push(memberName);
    }
  });
  play.me.selectedAlly = candidateName;
  play.allyCount++;

  if (!candidateIsHuman) {
    const aff = getAffinity(candidateName);
    const joinLine = getNpcScriptLine(candidateName, 8, '좋아, 다 같이 움직이자. 서로 등 뒤를 지켜 주자고.');
    pushDialogueToChat(`${candidateName} (${renderHearts(aff)})`, joinLine, { zone: play.me.zone, broadcast: true });
  }

  await appendGameLog(`[${fmtClock()}] 동맹 전원 동의로 ${candidateName}님이 새 동료로 합류했습니다! (파티: ${allPartyNames.join(', ')})`, true);

  if (!play.isSolo && play.code) {
    for (const targetMember of allPartyNames) {
      if (targetMember === myName || !isHumanPlayerName(targetMember)) continue;
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: myName || '유저',
        zone: play.me.zone,
        msg_type: 'p2p_evt',
        content: JSON.stringify({
          kind: 'party_sync_members',
          to: targetMember,
          partyMembers: allPartyNames,
          newMember: candidateName
        })
      }]);
    }
  }
  await broadcastMyStateSync();
  refreshGameUI();
}

let pausedByModal = false;

function openCenterModal(html) {
  if (play.actionTimer && play.actionKind === 'move') {
    clearInterval(play.actionTimer);
    play.actionTimer = null;
    play.actionKind = null;
    play.actionTargetZone = null;
    play.actionSec = 0;
  }
  const box = document.getElementById('centerModalBox');
  box.innerHTML = html;
  document.getElementById('centerModal').classList.add('open');
}

function closeCenterModal() {
  document.getElementById('centerModal').classList.remove('open');
  const b = document.getElementById('centerModalBox');
  if (b) { b.style.transform = ''; b.classList.remove('bat-shake'); }
  window.onmousemove = null;
  window.onmouseup = null;
  modalState.mode = null;
  modalState.isPvp = false;
  modalState.isMultiBattle = false;
  modalState.joinedLateMe = false;
  modalState.busy = false;
  if (pausedByModal) {
    pausedByModal = false;
    play.paused = false;
  }
  refreshGameUI();
}

function openRescueModal(attackerId, victimName) {
  if (!play.me.alive || play.finished || modalState.mode || isSleepingNow) return;
  const attacker = play.players.find(p => p.id === attackerId && p.alive);
  if (!attacker) return;
  const c = getPickedChar();
  const vNpc = NPC_ROSTER.find(n => n.name === victimName);
  const vTrait = (c && c.club === '연극부' && vNpc?.trait) ? ` · ${vNpc.trait}` : '';

  modalState.mode = 'rescue';
  modalState.targetId = attacker.id;
  modalState.enemyName = attacker.name;
  modalState.victimName = victimName;

  openCenterModal(`
    <div class="modal-top-bar">위기 목격 · 구출 선택</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${esc(victimName)} (${esc(vNpc ? vNpc.club : '참가자')}${esc(vTrait)})이(가) ${esc(attacker.name)}에게 공격당하고 있다!</div>
      <div style="font-size:12px;color:#333;">지금 끼어들어 구해 줄까?</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="rescueChoice('save')">뛰어들어 구해 준다</button>
      <button type="button" class="modal-act-btn" onclick="rescueChoice('pass')">지켜보며 지나간다</button>
    </div>`);
}

async function rescueChoice(choice) {
  const atkId = modalState.targetId;
  const vName = modalState.victimName;
  closeCenterModal();
  if (choice === 'pass') {
    await appendGameLog(`[${fmtClock()}] ${vName}이(가) 공격받는 상황을 조용히 지켜보며 지나쳤다.`);
    return;
  }
  const c = getPickedChar();
  const isDrama = (c && c.club === '연극부');
  const gainPt = isDrama ? 22 : 17;
  const res = gainAffinityPoints(vName, gainPt);
  play.socialCount = (play.socialCount || 0) + 1;
  const rescueLine = getTraitSituationalLine(vName, 'rescue');
  await appendGameLog(`[${fmtClock()}] ${vName}을(를) 구해주기 위해 ${modalState.enemyName}과(와) 맞섰다!`, true);
  pushDialogueToChat(`${vName} (${renderHearts(res.hearts)})`, rescueLine, { zone: play.me.zone, broadcast: true });
  startBattleModal(atkId, { joinedLate: true });
}

function calcDayNegotiateProb(c, npc) {
  const isDrama = !!(c && c.club === '연극부');
  const dex = c?.dex || 1;
  const trait = npc ? npc.trait : '';
  const traitMod = (trait === '겁쟁이' || trait === '이타적') ? 8 : ((trait === '호전적' || trait === '냉정형') ? -8 : 0);
  const dayDecay = Math.max(0, (play.day - 2) * 7);
  const raw = (isDrama ? 74 : 46) + (dex - 1) * 5 + traitMod - dayDecay;
  return Math.max(12, Math.min(92, raw));
}

function calcDayFleeProb(c) {
  const agi = c?.agi || 1;
  const clubBonus = c?.club === '육상부' ? 16 : 0;
  const tiredPen = hasCondition('피로') ? 12 : 0;
  const dayDecay = Math.max(0, (play.day - 2) * 6);
  const raw = 44 + (agi - 1) * 5 + clubBonus - tiredPen - dayDecay;
  return Math.max(10, Math.min(88, raw));
}

function openProvokeModal(targetId) {
  if (!play.me.alive || play.finished || modalState.mode || isSleepingNow) return;
  const target = play.players.find(p => p.id === targetId && p.alive);
  if (!target) return;
  const npc = NPC_ROSTER.find(n => n.name === target.name);
  const c = getPickedChar();
  const negPct = calcDayNegotiateProb(c, npc);
  const fleePct = calcDayFleeProb(c);

  const demandModes = [
    ['시비 걸기', '야, 길 막지 말고 눈치껏 비켜. 꼴 보기 싫으니까.'],
    ['물건 요구', '가방에 쓸 만한 거 있지? 하나만 내놓고 지나가.'],
    ['가진 거 다 내놔', '지금 가진 거 싹 다 바닥에 내려놔. 안 그러면 피 좀 봐야겠어.']
  ];
  const [kindTitle, demandLine] = demandModes[Math.floor(Math.random() * demandModes.length)];

  modalState.mode = 'provoke';
  modalState.targetId = target.id;
  modalState.enemyName = target.name;
  modalState.enemyClub = target.club || '참가자';
  modalState.enemyTrait = npc ? npc.trait : '도발형';

  openCenterModal(`
    <div class="modal-top-bar">${esc(kindTitle)}</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${esc(target.name)} (${esc(modalState.enemyClub)})이(가) 다가왔다!</div>
      <div style="font-size:13px;color:#141c30;margin-bottom:6px;">"${esc(demandLine)}"</div>
      <div style="font-size:11px;color:#4a4335;">호감도 ${renderHearts(getAffinity(target.name))}</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="provokeChoice('negotiate')">대화로 해결 (${negPct}%)</button>
      <button type="button" class="modal-act-btn" onclick="provokeChoice('handover')">요구 들어주기</button>
      <button type="button" class="modal-act-btn" onclick="provokeChoice('flee')">도주하기 (${fleePct}%)</button>
      <button type="button" class="modal-act-btn" onclick="provokeChoice('fight')">싸우기</button>
    </div>`);
}

async function provokeChoice(choice) {
  const name = modalState.enemyName;
  const tid = modalState.targetId;
  closeCenterModal();
  const c = getPickedChar();
  const npc = NPC_ROSTER.find(n => n.name === name);
  const isDrama = (c && c.club === '연극부');

  if (choice === 'negotiate') {
    const negProb = calcDayNegotiateProb(c, npc) / 100;
    if (Math.random() < negProb) {
      gainAffinityPoints(name, isDrama ? 6 : 4);
      play.socialCount = (play.socialCount || 0) + 1;
      const dramaTag = isDrama ? ' [연극부 특기 발동: 무대 화술 협상]' : '';
      await appendGameLog(`[${fmtClock()}] ${name}과(와) 대화로 해결에 성공해 갈등을 풀었다.${dramaTag}`, true);
      pushDialogueToChat(name, '…말은 꽤 통하네. 오늘은 그냥 넘어가 주지.', { zone: play.me.zone, broadcast: true });
    } else {
      await appendGameLog(`[${fmtClock()}] ${name}과의 대화 해결에 실패해 즉시 교전에 돌입했다!`, true);
      startBattleModal(tid);
    }
  } else if (choice === 'handover') {
    if (play.me.bag.length > 0) {
      const taken = play.me.bag.pop();
      unequipWeaponIfRemoved(taken);
      getNpcState(name).bag.push(taken);
      await appendGameLog(`[${fmtClock()}] ${name}의 요구대로 '${taken.name}'을(를) 내어주고 자리를 피했다.`, true);
    } else {
      play.me.hunger = Math.max(0, play.me.hunger - 10);
      await appendGameLog(`[${fmtClock()}] 내줄 물건이 없어 진땀을 빼며 물러났다. (허기 -10)`, true);
    }
  } else if (choice === 'flee') {
    const fleeP = calcDayFleeProb(c) / 100;
    if (Math.random() < fleeP) {
      sfx.flee();
      await appendGameLog(`[${fmtClock()}] ${name}에게서 재빠르게 도주했다.`);
    } else {
      await appendGameLog(`[${fmtClock()}] 도주하려다 길이 막혀 교전에 휘말렸다!`, true);
      startBattleModal(tid);
    }
  } else {
    startBattleModal(tid);
  }
  refreshGameUI();
}

function openEncounterModal(targetId, factionLabel = '') {
  if (!play.me.alive || play.finished || modalState.mode || isSleepingNow) return;
  const target = play.players.find(p => p.id === targetId && p.alive);
  if (!target) return;
  const npc = NPC_ROSTER.find(n => n.name === target.name);
  const c = getPickedChar();
  const negPct = calcDayNegotiateProb(c, npc);
  const avoidPct = calcDayFleeProb(c);

  modalState.mode = 'encounter';
  modalState.targetId = target.id;
  modalState.enemyName = target.name;
  modalState.enemyClub = target.club || '참가자';
  modalState.enemyTrait = npc ? npc.trait : (target.is_npc ? '생존자' : '유저');
  modalState.enemyHp = target.hp || 15;
  modalState.enemyMaxHp = 15;
  modalState.enemyWeapon = npc ? `${npc.weapon} (내구 6/6)` : '단검 (내구 6/6)';

  const subTag = factionLabel ? ` · ${factionLabel}` : '';
  openCenterModal(`
    <div class="modal-top-bar">돌발</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${esc(target.name)} (${esc(modalState.enemyClub)} · ${esc(modalState.enemyTrait)}${esc(subTag)})과(와) 마주쳤다!</div>
      <div style="font-size:12px;color:#333;">HP ${modalState.enemyHp}/${modalState.enemyMaxHp} ${target.is_npc ? '· 호감도 ' + renderHearts(getAffinity(target.name)) : ''}</div>
    </div>
    <div class="enc-btns">
      <button type="button" class="modal-act-btn" onclick="encounterChoice('avoid')">싸움을 피한다 (${avoidPct}%)</button>
      <button type="button" class="modal-act-btn" onclick="encounterChoice('talk')">대화로 해결 (${negPct}%)</button>
      <button type="button" class="modal-act-btn" onclick="encounterChoice('fight')">공격한다 (교전)</button>
    </div>`);
}

async function encounterChoice(choice) {
  const name = modalState.enemyName;
  const tid = modalState.targetId;
  closeCenterModal();
  const c = getPickedChar();
  const npc = NPC_ROSTER.find(n => n.name === name);

  if (choice === 'avoid') {
    const avoidP = calcDayFleeProb(c) / 100;
    if (Math.random() < avoidP) {
      await appendGameLog(`[${fmtClock()}] ${name}과(와) 마주쳤지만 조용히 자리를 피했다.`);
    } else {
      await appendGameLog(`[${fmtClock()}] 피하려다 들켜 ${name}과(와) 교전에 돌입했다!`, true);
      startBattleModal(tid);
    }
  } else if (choice === 'talk') {
    const negProb = calcDayNegotiateProb(c, npc) / 100;
    if (Math.random() < negProb) {
      if (!isHumanPlayerName(name)) talkNearNpc(name);
      await appendGameLog(`[${fmtClock()}] ${name}과(와) 대화로 해결에 성공했다.`);
    } else {
      await appendGameLog(`[${fmtClock()}] ${name}과의 대화 해결에 실패해 즉시 교전에 돌입했다!`, true);
      startBattleModal(tid);
    }
  } else {
    startBattleModal(tid);
  }
}

function getEffectiveWeaponDamage(c) {
  const strVal = c?.str || 1;
  const w = play.me.weapon;
  const hasWeapon = w && w.name && w.name !== '맨손';
  const strBonus = Math.floor((strVal - 1) * 0.5);
  if (!hasWeapon) {
    return {
      baseAtk: 1,
      strBonus,
      clubBonus: 0,
      dmg: Math.max(1, 1 + strBonus),
      clubAtkMsg: ''
    };
  }
  const baseAtk = w.baseAtk ?? w.atk ?? 4;
  let clubAtkBonus = 0;
  let clubAtkMsg = '';
  if (c?.club === '궁도부' && w.kind === '원거리') {
    clubAtkBonus += 2;
    clubAtkMsg = ' [궁도부 특기 발동: 사격 위력 +2]';
  } else if (c?.club === '만화부' && Math.random() < 0.35) {
    clubAtkBonus += 2;
    clubAtkMsg = ' [만화부 특기 발동: 극적인 일격 +2]';
  } else if (c?.club === '음악부' && Math.random() < 0.32) {
    clubAtkBonus += 1;
    clubAtkMsg = ' [음악부 특기 발동: 리듬 템포 추가타 +1]';
  }
  return {
    baseAtk,
    strBonus,
    clubBonus: clubAtkBonus,
    dmg: Math.max(2, baseAtk + strBonus + clubAtkBonus + Math.floor(Math.random() * 2)),
    clubAtkMsg
  };
}

function getBattleFleeProb(c) {
  const agi = c?.agi || 1;
  const clubBonus = c?.club === '육상부' ? 0.16 : 0;
  const tiredPen = hasCondition('피로') ? 0.12 : 0;
  const dayDecay = Math.max(0, (play.day - 2) * 0.06);
  const supportFleeBonus = modalState.joinedLateMe ? 0.22 : 0;
  return Math.max(0.10, Math.min(0.95, 0.40 + (agi - 1) * 0.05 + clubBonus + supportFleeBonus - tiredPen - dayDecay));
}

function getBattleHitProb(c) {
  const hAtk = Math.floor((play.minutes % 1440) / 60);
  const nightAtk = !(hAtk >= 6 && hAtk < 18);
  const tiredAtkPen = (hasCondition('피로') || (nightAtk && (play.nightSleepMinutes || 0) < 120)) ? 0.14 : 0;
  return Math.max(0.30, Math.min(0.95, 0.78 + ((c?.dex || 1) - 1) * 0.03 - tiredAtkPen));
}

function getBattlePersuadeProb(c, enemyName, isPvp = false) {
  const curH = isPvp ? 0 : getAffinity(enemyName);
  const base = curH >= 3 ? 0.62 : 0.36;
  const dexBonus = ((c?.dex || 1) - 1) * 0.04;
  const dramaBonus = (c?.club === '연극부') ? 0.12 : 0;
  const dayDecay = Math.max(0, (play.day - 2) * 0.06);
  return Math.max(0.10, Math.min(0.88, base + dexBonus + dramaBonus - dayDecay));
}

function openAllyBattleAssistModal(allyName, enemyId, enemyName) {
  if (!play.me.alive || play.finished || modalState.mode || isSleepingNow) return;
  modalState.mode = 'ally_assist';
  modalState.targetId = enemyId;
  modalState.enemyName = enemyName;
  modalState.victimName = allyName;
  const sameZoneCount = Math.min(MAX_ALLIES + 1, 1 + (play.me.allies || []).filter(aName =>
    play.players.some(p => p.name === aName && p.alive && p.zone === play.me.zone)
  ).length);
  openCenterModal(`
    <div class="modal-top-bar">동료 교전 발생 · 합류 선택</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">동료 ${esc(allyName)}님이 ${esc(enemyName)}와(과) 교전 중입니다!</div>
      <div style="font-size:12px;color:#333;">함께 참전하면 기존 참전자 행동 이후 후순위로 행동하며, 도주 확률이 +22% 높아집니다. (아군 최대 ${sameZoneCount}인)</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="respondAllyBattleAssist(true)">함께 참전한다</button>
      <button type="button" class="modal-act-btn" onclick="respondAllyBattleAssist(false)">지켜본다</button>
    </div>`);
}

async function respondAllyBattleAssist(join) {
  const allyName = modalState.victimName;
  const enemyId = modalState.targetId;
  closeCenterModal();
  if (!join) {
    await appendGameLog(`[${fmtClock()}] 동료 ${allyName}의 교전에 개입하지 않고 상황을 지켜보았다.`);
    return;
  }
  await appendGameLog(`[${fmtClock()}] 동료 ${allyName}을(를) 돕기 위해 전투에 합류했다! (후순위 행동 · 도주 보정)`, true);
  await startBattleModal(enemyId, { allyPartnerName: allyName, joinedLate: true });
}

function buildSpeedTurnQueue(c, allyFighters, enemyObj, enemyAllyFighter, meJoinedLate = false) {
  const list = [];
  list.push({ role: 'me', name: c?.name || '실험체', agi: c?.agi || 1, joinedLate: Boolean(meJoinedLate) });
  (allyFighters || []).forEach((af, idx) => {
    list.push({ role: 'ally', allyIdx: idx, name: af.name, agi: af.agi || 2, joinedLate: Boolean(af.joinedLate) });
  });
  list.push({ role: 'enemy', name: enemyObj.name, agi: enemyObj.agi || 2, joinedLate: false });
  if (enemyAllyFighter) {
    list.push({ role: 'enemy_ally', name: enemyAllyFighter.name, agi: enemyAllyFighter.agi || 2, joinedLate: false });
  }
  list.sort((a, b) => {
    const aJoin = a.joinedLate ? 1 : 0;
    const bJoin = b.joinedLate ? 1 : 0;
    if (aJoin !== bJoin) return aJoin - bJoin;
    return (b.agi + Math.random() * 0.35) - (a.agi + Math.random() * 0.35);
  });
  return list;
}

function getNpcWeaponPower(npcName) {
  const meta = NPC_ROSTER.find(n => n.name === npcName);
  const wName = meta?.weapon || '단검';
  const wBase = LOOT_ITEMS.find(x => x.name === wName) || STARTER_WEAPONS.find(x => x.name === wName);
  const clubBonus = (meta?.club === '검도부' || meta?.club === '궁도부' || meta?.club === '만화부') ? 1 : 0;
  return {
    weaponName: wName,
    atk: Math.max(3, (wBase?.atk || 4) + clubBonus)
  };
}

function makeCombatantFromPlayerRow(pRow, side) {
  const nMeta = pRow.is_npc ? NPC_ROSTER.find(n => n.name === pRow.name) : null;
  const defaultAgi = nMeta?.club === '육상부' ? 5 : (nMeta?.club === '검도부' ? 4 : 3);
  const wPow = pRow.is_npc ? getNpcWeaponPower(pRow.name) : { weaponName: '무장', atk: 4 + Math.floor(((pRow.stats?.str || 2) - 1) * 0.5) };
  return {
    id: String(pRow.id),
    name: pRow.name,
    club: pRow.club || nMeta?.club || '참가자',
    trait: nMeta ? nMeta.trait : (pRow.is_npc ? '생존자' : '유저'),
    hp: pRow.hp ?? 15,
    maxHp: 15,
    agi: pRow.stats?.agi || defaultAgi,
    str: pRow.stats?.str || 3,
    isNpc: Boolean(pRow.is_npc),
    side,
    weaponAtk: wPow.atk,
    weapon: nMeta ? `${wPow.weaponName} (공격 ${wPow.atk})` : '무장'
  };
}

function rebuildMultiTurnQueue(sideA, sideB) {
  const all = [...sideA, ...sideB].filter(f => f && f.hp > 0);
  all.sort((a, b) => {
    const aJoin = a.joinedLate ? 1 : 0;
    const bJoin = b.joinedLate ? 1 : 0;
    if (aJoin !== bJoin) return aJoin - bJoin;
    if (b.agi !== a.agi) return b.agi - a.agi;
    return String(a.name).localeCompare(String(b.name));
  });
  return all;
}

function advanceMultiTurnCursor(clash, justActedName) {
  if (!clash) return;
  const fullOrder = [...clash.sideA, ...clash.sideB];
  fullOrder.sort((a, b) => {
    const aJoin = a.joinedLate ? 1 : 0;
    const bJoin = b.joinedLate ? 1 : 0;
    if (aJoin !== bJoin) return aJoin - bJoin;
    if (b.agi !== a.agi) return b.agi - a.agi;
    return String(a.name).localeCompare(String(b.name));
  });
  const aliveQ = fullOrder.filter(f => f.hp > 0);
  clash.turnQueue = aliveQ;
  if (!aliveQ.length) {
    clash.turnIdx = 0;
    clash.activeActorName = null;
    return;
  }
  const fullPos = justActedName ? fullOrder.findIndex(f => f.name === justActedName) : -1;
  if (fullPos >= 0) {
    for (let step = 1; step <= fullOrder.length; step++) {
      const cand = fullOrder[(fullPos + step) % fullOrder.length];
      if (cand && cand.hp > 0) {
        const nextIdx = aliveQ.findIndex(f => f.name === cand.name);
        clash.turnIdx = nextIdx >= 0 ? nextIdx : 0;
        clash.activeActorName = aliveQ[clash.turnIdx].name;
        return;
      }
    }
  }
  clash.turnIdx = (clash.turnIdx + 1) % aliveQ.length;
  clash.activeActorName = aliveQ[clash.turnIdx].name;
}

function renderMiniCombatantsHtml(fighters, primaryName, isEnemySide = false) {
  const subList = (fighters || []).filter(f => f && f.name !== primaryName);
  if (!subList.length) return '';
  return `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;">` + subList.map(f => {
    const hpVal = Math.max(0, f.hp ?? 0);
    const maxVal = f.maxHp || 15;
    const pct = Math.round((hpVal / maxVal) * 100);
    const av = getParticipantAvatar(f.name);
    const avInner = av ? `<img src="${av}" alt="" style="width:100%;height:100%;object-fit:cover;">` : esc(f.name.slice(0, 1));
    const deadTag = hpVal <= 0 ? ' (전투불능)' : '';
    const pickAttr = (isEnemySide && hpVal > 0 && modalState.isMultiBattle)
      ? ` onclick="selectMultiTarget('${esc(f.id)}')" title="클릭하여 공격 대상으로 전환"` : '';
    const cursorStyle = (isEnemySide && hpVal > 0 && modalState.isMultiBattle) ? 'cursor:pointer;' : '';
    return `
      <div${pickAttr} style="flex:1 1 115px;background:#eae2ce;border:1px solid #141c30;padding:3px 5px;display:flex;align-items:center;gap:5px;${cursorStyle}${hpVal <= 0 ? 'opacity:0.5;' : ''}">
        <div style="width:22px;height:22px;background:#141c30;color:#eae2ce;font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">${avInner}</div>
        <div style="min-width:0;flex:1;">
          <div style="font-size:10px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}${deadTag}</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
            <div style="flex:1;height:5px;background:#cfc6b2;border:1px solid #141c30;"><div style="width:${pct}%;height:100%;background:#141c30;"></div></div>
            <span style="font-size:9px;">${hpVal}/${maxVal}</span>
          </div>
        </div>
      </div>`;
  }).join('') + `</div>`;
}

async function reportZoneClashToLog(clashInfo) {
  if (!clashInfo || !clashInfo.battleId) return;
  activeZoneClashes[clashInfo.battleId] = clashInfo;
  if (!play.me.alive || play.finished || clashInfo.zone !== play.me.zone) return;
  const myName = getPickedChar()?.name;
  const alreadyIn = [...(clashInfo.sideA || []), ...(clashInfo.sideB || [])].some(x => x.name === myName);
  if (alreadyIn) return;

  const box = document.getElementById('refGameLog');
  if (!box) return;
  const d = document.createElement('div');
  d.style.color = '#8eb8ff';
  d.style.marginBottom = '4px';
  const aNames = (clashInfo.sideA || []).map(x => x.name).join('·');
  const bNames = (clashInfo.sideB || []).map(x => x.name).join('·');
  const isAllyInvolved = [...(clashInfo.sideA || []), ...(clashInfo.sideB || [])].some(x => (play.me.allies || []).includes(x.name));
  const tag = isAllyInvolved ? '【동료 교전 시작】' : '【교전 시작】';
  d.innerHTML = `[${fmtClock()}] ${tag} <strong>${esc(aNames)}</strong>와(과) <strong>${esc(bNames)}</strong>가 전투를 시작했다! <button type="button" class="ref-mini-btn" style="margin-left:4px;background:#eae2ce;color:#141c30;" onclick="onClickSupportClash('${esc(clashInfo.battleId)}')">도와주기</button>`;
  box.appendChild(d);
  while (box.children.length > 140) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

async function onClickSupportClash(battleId) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  if (modalState.mode) {
    await appendGameLog(`[${fmtClock()}] 이미 다른 행동이나 전투를 진행 중이다.`, true);
    return;
  }
  const clash = activeZoneClashes[battleId];
  if (!clash || clash.ended) {
    await appendGameLog(`[${fmtClock()}] 이미 교전이 종료되어 개입할 수 없다.`, true);
    return;
  }
  if (clash.zone !== play.me.zone) {
    await appendGameLog(`[${fmtClock()}] 다른 구역에서 벌어지는 교전이라 도울 수 없다.`, true);
    return;
  }

  const aAlly = (clash.sideA || []).find(x => (play.me.allies || []).includes(x.name));
  const bAlly = (clash.sideB || []).find(x => (play.me.allies || []).includes(x.name));

  if (aAlly && !bAlly) {
    await joinMultiBattleAsSupport(battleId, 'A');
    return;
  }
  if (bAlly && !aAlly) {
    await joinMultiBattleAsSupport(battleId, 'B');
    return;
  }

  const aLead = clash.sideA[0];
  const bLead = clash.sideB[0];
  if (!aLead || !bLead) return;

  modalState.mode = 'support_pick';
  modalState.battleId = battleId;
  openCenterModal(`
    <div class="modal-top-bar">교전 서포트 · 진영 선택</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${esc(aLead.name)} vs ${esc(bLead.name)} 교전 중!</div>
      <div style="font-size:12px;color:#333;">어느 쪽 편에 서서 실시간 전투에 난입할까요? (기존 참전자 행동 후 마지막 순서로 행동하며 도주 성공률 +22%)</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="chooseSupportSide('${esc(battleId)}', 'A')">${esc(aLead.name)} 쪽을 돕는다</button>
      <button type="button" class="modal-act-btn" onclick="chooseSupportSide('${esc(battleId)}', 'B')">${esc(bLead.name)} 쪽을 돕는다</button>
    </div>
    <button type="button" class="modal-act-btn" style="width:100%;margin-top:6px;" onclick="closeCenterModal()">개입하지 않는다</button>
  `);
}

async function chooseSupportSide(battleId, side) {
  closeCenterModal();
  await joinMultiBattleAsSupport(battleId, side);
}

async function joinMultiBattleAsSupport(battleId, side) {
  const clash = activeZoneClashes[battleId];
  if (!clash || clash.ended) {
    await appendGameLog(`[${fmtClock()}] 이미 교전이 종료되었다.`, true);
    return;
  }
  const targetSideArr = side === 'A' ? clash.sideA : clash.sideB;
  if (targetSideArr.filter(x => x.hp > 0).length >= 4) {
    await appendGameLog(`[${fmtClock()}] 해당 진영의 참전 인원(최대 4명)이 이미 가득 찼다.`, true);
    return;
  }
  const c = getPickedChar();
  if (!c) return;

  const helpedSide = side === 'A' ? clash.sideA : clash.sideB;
  helpedSide.forEach(f => {
    if (f.isNpc) gainAffinityPoints(f.name, 12);
  });
  play.socialCount = (play.socialCount || 0) + 1;
  modalState.joinedLateMe = true;

  const myFighter = {
    id: String(play.pid || c.name),
    name: c.name,
    club: c.club,
    trait: '유저',
    hp: play.me.hp,
    maxHp: play.me.maxHp,
    agi: c.agi || 1,
    str: c.str || 1,
    isNpc: false,
    joinedLate: true,
    side,
    weapon: play.me.weapon?.name || '맨손'
  };

  if (side === 'A' && !clash.sideA.some(x => x.name === c.name)) clash.sideA.push(myFighter);
  if (side === 'B' && !clash.sideB.some(x => x.name === c.name)) clash.sideB.push(myFighter);

  const prevAliveQ = (clash.turnQueue || []).filter(f => f.hp > 0);
  const prevActorName = clash.activeActorName || (prevAliveQ.length ? prevAliveQ[clash.turnIdx % prevAliveQ.length]?.name : null);

  clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
  const newAliveQ = clash.turnQueue.filter(f => f.hp > 0);
  if (prevActorName) {
    const keptPos = newAliveQ.findIndex(f => f.name === prevActorName);
    clash.turnIdx = keptPos >= 0 ? keptPos : 0;
  } else {
    clash.turnIdx = 0;
  }
  clash.activeActorName = newAliveQ[clash.turnIdx]?.name || null;

  await appendGameLog(`[${fmtClock()}] 【난입】 ${helpedSide.map(x => x.name).join('·')} 측을 돕기 위해 실시간 전투에 합류했다! (후순위 행동 · 도주 확률 +22%)`, true);

  if (!play.isSolo && play.code) {
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c.name,
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({
        kind: 'clash_join',
        battleId,
        side,
        fighter: myFighter,
        turnIdx: clash.turnIdx,
        activeActorName: clash.activeActorName
      })
    }]);
  }

  await openLiveMultiBattleModal(clash, side, { isInitiator: true, joinedLate: true });
}

function selectMultiTarget(targetId) {
  if (!modalState.isMultiBattle || !modalState.battleId) return;
  const clash = activeZoneClashes[modalState.battleId];
  if (!clash) return;
  const enTeam = modalState.mySide === 'A' ? clash.sideB : clash.sideA;
  const picked = enTeam.find(x => String(x.id) === String(targetId) && x.hp > 0);
  if (!picked) return;
  modalState.targetId = picked.id;
  modalState.enemyName = picked.name;
  modalState.enemyHp = picked.hp;
  renderMultiBattleUI();
}

function cycleMultiTarget() {
  if (!modalState.isMultiBattle || !modalState.battleId) return;
  const clash = activeZoneClashes[modalState.battleId];
  if (!clash) return;
  const enTeam = (modalState.mySide === 'A' ? clash.sideB : clash.sideA).filter(x => x.hp > 0);
  if (enTeam.length <= 1) return;
  const curIdx = enTeam.findIndex(x => String(x.id) === String(modalState.targetId));
  const next = enTeam[(curIdx + 1) % enTeam.length];
  if (next) selectMultiTarget(next.id);
}

async function openLiveMultiBattleModal(clash, mySide, opts = {}) {
  if (!play.me.alive || play.finished) return;
  const c = getPickedChar();
  const myName = c?.name || '실험체';

  const sameZoneNpcAllies = (play.me.allies || []).filter(aName =>
    play.players.some(p => p.name === aName && p.alive && p.zone === play.me.zone && p.is_npc)
  );
  sameZoneNpcAllies.forEach(aName => {
    const pRow = play.players.find(p => p.name === aName && p.alive);
    if (!pRow) return;
    const exists = [...clash.sideA, ...clash.sideB].some(x => x.name === aName);
    if (!exists) {
      const fObj = makeCombatantFromPlayerRow(pRow, mySide);
      if (mySide === 'A' && clash.sideA.length < 4) clash.sideA.push(fObj);
      else if (mySide === 'B' && clash.sideB.length < 4) clash.sideB.push(fObj);
    }
  });

  clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
  if (typeof clash.turnIdx !== 'number') clash.turnIdx = 0;
  if (typeof clash.seq !== 'number') clash.seq = 0;
  const initAliveQ = clash.turnQueue.filter(f => f.hp > 0);
  if (clash.activeActorName && initAliveQ.length) {
    const foundIdx = initAliveQ.findIndex(f => f.name === clash.activeActorName);
    if (foundIdx >= 0) clash.turnIdx = foundIdx;
    else clash.activeActorName = initAliveQ[0].name;
  } else if (initAliveQ.length) {
    clash.activeActorName = initAliveQ[clash.turnIdx % initAliveQ.length].name;
  }

  const myTeam = mySide === 'A' ? clash.sideA : clash.sideB;
  const enTeam = mySide === 'A' ? clash.sideB : clash.sideA;
  const leadEnemy = enTeam.find(x => x.hp > 0) || enTeam[0];

  modalState.mode = 'battle';
  modalState.battleId = clash.battleId;
  modalState.isMultiBattle = true;
  modalState.isPvp = true;
  modalState.mySide = mySide;
  modalState.sideA = clash.sideA;
  modalState.sideB = clash.sideB;
  modalState.turnQueue = clash.turnQueue;
  modalState.turnIdx = clash.turnIdx;
  modalState.targetId = leadEnemy?.id || null;
  modalState.enemyName = leadEnemy?.name || '상대';
  modalState.enemyClub = leadEnemy?.club || '참가자';
  modalState.enemyTrait = leadEnemy?.trait || '생존자';
  modalState.enemyHp = leadEnemy?.hp ?? 15;
  modalState.enemyMaxHp = 15;
  modalState.defending = false;
  modalState.ambush = Boolean(opts.ambush);
  if (opts.joinedLate) modalState.joinedLateMe = true;

  const curActor = initAliveQ[clash.turnIdx % Math.max(1, initAliveQ.length)];
  modalState.busy = !(curActor && curActor.name === myName);

  const scaleTag = `${myTeam.filter(x => x.hp > 0).length} VS ${enTeam.filter(x => x.hp > 0).length}`;
  const speedOrderTxt = clash.turnQueue.map(t => `${t.name}(${t.joinedLate ? '후순위' : '민첩 ' + t.agi})`).join(' → ');
  const myAvHtml = play.me.avatar ? `<img src="${play.me.avatar}" alt="">` : esc(myName.slice(0, 1));
  const enAvUrl = leadEnemy ? getParticipantAvatar(leadEnemy.name) : null;
  const enAvHtml = enAvUrl ? `<img src="${enAvUrl}" alt="">` : esc((leadEnemy?.name || '?').slice(0, 1));
  const myMiniHtml = renderMiniCombatantsHtml(myTeam, myName, false);
  const enMiniHtml = renderMiniCombatantsHtml(enTeam, leadEnemy?.name, true);
  const aliveEnemiesCnt = enTeam.filter(x => x.hp > 0).length;

  openCenterModal(`
    <div class="modal-top-bar" id="batDragBar" style="cursor:move;">실시간 다인 전투 (${scaleTag})</div>
    <div class="bat-pop-vs">
      <div>
        <div class="bat-pop-side">
          <div class="ref-portrait-sq" style="width:52px;height:52px;font-size:18px;">${myAvHtml}</div>
          <div>
            <div style="font-size:13px;font-weight:bold;">${esc(myName)}</div>
            <div style="font-size:10px;color:#3d382d;">${esc(c?.club || '실험체')} · ${esc(formatConditionsText(play.me.conditions))}</div>
            <div class="bat-pop-segs" id="mSegMy"></div>
            <div style="font-size:10px;margin-top:2px;" id="mHpMy">HP ${play.me.hp}/${play.me.maxHp}</div>
          </div>
        </div>
        <div id="mMiniMyTeam">${myMiniHtml}</div>
      </div>
      <div style="text-align:center;font-size:15px;font-weight:bold;" id="mScaleTag">${scaleTag}</div>
      <div>
        <div class="bat-pop-side">
          <div class="ref-portrait-sq" id="mEnAvBox" style="width:52px;height:52px;font-size:18px;">${enAvHtml}</div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
              <span style="font-size:13px;font-weight:bold;" id="mEnNameTitle">${esc(leadEnemy?.name || '상대')}</span>
              <button type="button" class="ref-mini-btn" id="mBtnSwitchTarget" style="${aliveEnemiesCnt > 1 ? '' : 'display:none;'}" onclick="cycleMultiTarget()">타겟 전환</button>
            </div>
            <div style="font-size:10px;color:#3d382d;" id="mEnSubTitle">${esc(leadEnemy?.club || '참가자')} · ${esc(leadEnemy?.trait || '생존자')}</div>
            <div class="bat-pop-segs" id="mSegEn"></div>
            <div style="font-size:10px;margin-top:2px;" id="mHpEn">HP ${leadEnemy?.hp ?? 0}/15</div>
          </div>
        </div>
        <div id="mMiniEnTeam">${enMiniHtml}</div>
      </div>
    </div>
    <div class="bat-pop-log" id="mBatLog">
      <div>— 실시간 다인 전투 개시 (${scaleTag}) —</div>
      <div>행동 순서: ${esc(speedOrderTxt)}</div>
    </div>
    <div class="bat-pop-grid">
      <button type="button" class="modal-act-btn" id="mBtnAtk" onclick="mBattleCmd('atk')">공격</button>
      <button type="button" class="modal-act-btn" id="mBtnDef" onclick="mBattleCmd('def')">방어</button>
      <button type="button" class="modal-act-btn" id="mBtnItem" onclick="mBattleCmd('item')">아이템</button>
      <button type="button" class="modal-act-btn" id="mBtnPersuade" onclick="mBattleCmd('persuade')">설득</button>
      <button type="button" class="modal-act-btn" id="mBtnGiveUp" onclick="mBattleCmd('giveup')">포기 (무기를 내려놓는다)</button>
      <button type="button" class="modal-act-btn" id="mBtnFlee" onclick="mBattleCmd('flee')">도주</button>
    </div>
    <div id="mBatItemPicker" style="display:none;background:#e2dac8;border:2px solid #141c30;padding:6px;margin-bottom:6px;"></div>
    <div style="display:flex;gap:4px;margin-bottom:6px;">
      <input type="text" id="mBatChatIn" placeholder="전투 중 한마디 / 채팅 전송..." style="flex:1;background:#f5f0e3;color:#141c30;border:1px solid #141c30;padding:4px 7px;font-size:11px;outline:none;" onkeydown="if(event.key==='Enter') sendBattleChat()">
      <button type="button" class="ref-mini-btn" onclick="sendBattleChat()">채팅</button>
    </div>
    <div class="bat-pop-foot">
      <span id="mTurnTxt">${curActor ? (curActor.name === myName ? '당신의 턴!' : `${curActor.name}의 행동 대기 중...`) : '전투 진행 중'}</span>
      <button type="button" class="ref-mini-btn" onclick="forceAdvanceStalledMultiTurn()">▶ 진행 재개</button>
    </div>`);
  initBattleModalDrag();
  renderMultiBattleUI();

  await runNpcTurnsIfHostInMultiBattle(clash, Boolean(opts.isInitiator));
}

async function forceAdvanceStalledMultiTurn() {
  if (!modalState.isMultiBattle || !modalState.battleId) return;
  const clash = activeZoneClashes[modalState.battleId];
  if (!clash || clash.ended) return;
  const aliveQ = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
  if (!aliveQ.length) return;
  const cur = aliveQ.find(f => f.name === clash.activeActorName) || aliveQ[clash.turnIdx % aliveQ.length];
  if (cur && cur.isNpc) {
    await runNpcTurnsIfHostInMultiBattle(clash, true);
  } else if (cur) {
    advanceMultiTurnCursor(clash, cur.name);
    renderMultiBattleUI();
    await broadcastMultiBattleStep(clash, `【진행 재개】 ${cur.name}의 순서를 건너뛰고 다음 턴으로 넘어갔다.`);
    await runNpcTurnsIfHostInMultiBattle(clash, true);
  }
}

function triggerBattleShake() {
  const mBoxEl = document.getElementById('centerModalBox');
  if (!mBoxEl) return;
  mBoxEl.classList.remove('bat-shake');
  void mBoxEl.offsetWidth;
  mBoxEl.classList.add('bat-shake');
}

function renderMultiBattleUI() {
  if (!modalState.isMultiBattle) return renderModalBattleHp();
  const c = getPickedChar();
  const myName = c?.name || '실험체';
  const myTeam = modalState.mySide === 'A' ? modalState.sideA : modalState.sideB;
  const enTeam = modalState.mySide === 'A' ? modalState.sideB : modalState.sideA;
  const pickedEnemy = enTeam.find(x => String(x.id) === String(modalState.targetId) && x.hp > 0);
  const leadEnemy = pickedEnemy || enTeam.find(x => x.hp > 0) || enTeam[0];

  if (leadEnemy) {
    modalState.targetId = leadEnemy.id;
    modalState.enemyName = leadEnemy.name;
    modalState.enemyHp = leadEnemy.hp;
  }

  const hitP = Math.round(getBattleHitProb(c) * 100);
  const perP = Math.round(getBattlePersuadeProb(c, modalState.enemyName, true) * 100);
  const fleeP = Math.round(getBattleFleeProb(c) * 100);

  const drawSeg = (id, cur, max) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 1; i <= max; i++) {
      const s = document.createElement('span');
      s.className = 'bat-pop-seg' + (i <= cur ? ' on' : '');
      el.appendChild(s);
    }
  };
  drawSeg('mSegMy', play.me.hp, play.me.maxHp);
  drawSeg('mSegEn', leadEnemy ? leadEnemy.hp : 0, 15);

  const scEl = document.getElementById('mScaleTag');
  if (scEl) scEl.textContent = `${myTeam.filter(x => x.hp > 0).length} VS ${enTeam.filter(x => x.hp > 0).length}`;
  const myTxt = document.getElementById('mHpMy');
  if (myTxt) myTxt.textContent = `HP ${play.me.hp}/${play.me.maxHp}`;

  const enTitleEl = document.getElementById('mEnNameTitle');
  if (enTitleEl && leadEnemy) enTitleEl.textContent = leadEnemy.name;
  const enSubEl = document.getElementById('mEnSubTitle');
  if (enSubEl && leadEnemy) enSubEl.textContent = `${leadEnemy.club || '참가자'} · ${leadEnemy.trait || '생존자'}`;
  const enAvEl = document.getElementById('mEnAvBox');
  if (enAvEl && leadEnemy) {
    const avUrl = getParticipantAvatar(leadEnemy.name);
    enAvEl.innerHTML = avUrl ? `<img src="${avUrl}" alt="">` : esc(leadEnemy.name.slice(0, 1));
  }
  const enTxt = document.getElementById('mHpEn');
  if (enTxt && leadEnemy) enTxt.textContent = `HP ${leadEnemy.hp}/15`;

  const swBtn = document.getElementById('mBtnSwitchTarget');
  if (swBtn) swBtn.style.display = enTeam.filter(x => x.hp > 0).length > 1 ? '' : 'none';

  const miniMyEl = document.getElementById('mMiniMyTeam');
  if (miniMyEl) miniMyEl.innerHTML = renderMiniCombatantsHtml(myTeam, myName, false);
  const miniEnEl = document.getElementById('mMiniEnTeam');
  if (miniEnEl) miniEnEl.innerHTML = renderMiniCombatantsHtml(enTeam, leadEnemy?.name, true);

  const clashRef = modalState.battleId ? activeZoneClashes[modalState.battleId] : null;
  const aliveQ = rebuildMultiTurnQueue(modalState.sideA, modalState.sideB);
  modalState.turnQueue = aliveQ;
  if (clashRef) clashRef.turnQueue = aliveQ;

  let curActor = aliveQ.length ? aliveQ[modalState.turnIdx % aliveQ.length] : null;
  if (clashRef?.activeActorName) {
    const found = aliveQ.find(f => f.name === clashRef.activeActorName);
    if (found) {
      curActor = found;
    } else if (aliveQ.length) {
      curActor = aliveQ[0];
      clashRef.activeActorName = curActor.name;
      clashRef.turnIdx = 0;
    }
  }
  modalState.busy = !(curActor && curActor.name === myName);

  const turnEl = document.getElementById('mTurnTxt');
  if (turnEl && curActor) {
    turnEl.textContent = curActor.name === myName ? '당신의 턴!' : `${curActor.name}의 행동 대기 중...`;
  }

  const setBtn = (id, txt, dis) => {
    const b = document.getElementById(id);
    if (b) { b.textContent = txt; b.disabled = dis; }
  };
  const hasUsableBatItem = play.me.bag.some(i => ['heal', 'food', 'smoke', 'repair', 'armor'].includes(i.type));
  setBtn('mBtnAtk', `공격 (${hitP}%)`, modalState.busy);
  setBtn('mBtnDef', '방어', modalState.busy);
  setBtn('mBtnItem', '아이템', modalState.busy || !hasUsableBatItem);
  setBtn('mBtnPersuade', `설득 (${perP}%)`, modalState.busy);
  setBtn('mBtnGiveUp', '포기 (무기를 내려놓는다)', modalState.busy);
  setBtn('mBtnFlee', `도주 (${fleeP}%)`, modalState.busy);
}

async function runNpcTurnsIfHostInMultiBattle(clash, forceTakeControl = false) {
  if (!clash || clash.ended || clash._npcLoopRunning) return;
  const myName = getPickedChar()?.name;
  const allHumans = [...clash.sideA, ...clash.sideB].filter(f => !f.isNpc && f.hp > 0);
  const isDesignatedCtrl = clash.controllerName
    ? (clash.controllerName === myName || (play.host && !allHumans.some(h => h.name === clash.controllerName)))
    : (play.host || (allHumans.length > 0 && allHumans[0].name === myName));
  if (!forceTakeControl && !isDesignatedCtrl) return;
  if (forceTakeControl) clash.controllerName = myName;

  clash._npcLoopRunning = true;
  if (!clash._seenStepIds) clash._seenStepIds = new Set();

  try {
    let guard = 0;
    while (!clash.ended && guard < 12) {
      guard++;
      const aliveQ = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
      clash.turnQueue = aliveQ;
      if (!aliveQ.length) break;
      let actor = aliveQ[clash.turnIdx % aliveQ.length];
      if (clash.activeActorName) {
        const matched = aliveQ.find(f => f.name === clash.activeActorName);
        if (matched) actor = matched;
        else {
          actor = aliveQ[0];
          clash.turnIdx = 0;
          clash.activeActorName = actor.name;
        }
      }
      if (!actor || !actor.isNpc) break;

      await new Promise(r => setTimeout(r, 420));
      if (clash.ended) return;

      const enemies = (actor.side === 'A' ? clash.sideB : clash.sideA).filter(f => f.hp > 0);
      if (!enemies.length) break;
      const victim = enemies[Math.floor(Math.random() * enemies.length)];
      const npcWepAtk = actor.weaponAtk || 4;
      const npcClubBonus = (actor.club === '검도부' || actor.club === '궁도부' || actor.club === '만화부') ? 1 : 0;
      const dmg = Math.max(2, npcWepAtk + npcClubBonus + Math.floor(Math.random() * 2) - 1);
      victim.hp = Math.max(0, victim.hp - dmg);
      if (victim.isNpc) {
        const vRow = play.players.find(p => String(p.id) === String(victim.id) || p.name === victim.name);
        if (vRow) {
          vRow.hp = victim.hp;
          vRow.alive = victim.hp > 0;
        }
        await sb.from('room_players').update({ hp: victim.hp, alive: victim.hp > 0 }).eq('id', victim.id);
      }
      advanceMultiTurnCursor(clash, actor.name);
      clash.seq = (clash.seq || 0) + 1;
      const stepId = `npc_${clash.battleId}_${clash.seq}`;
      clash._seenStepIds.add(stepId);

      const logText = `[NPC ${actor.name}] ${victim.name}에게 ${dmg} 피해! (남은 HP ${victim.hp})`;
      if (modalState.mode === 'battle' && modalState.battleId === clash.battleId) {
        appendModalBattleLog(logText);
        triggerBattleShake();
        if (victim.name === myName) {
          play.me.hp = victim.hp;
          sfx.hurt();
          if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
          if (play.me.hp === 0) {
            clash.ended = true;
            closeCenterModal();
            await handleMeDead(`${actor.name}과의 전투`);
            return;
          }
        }
        renderMultiBattleUI();
      }

      if (!play.isSolo && play.code) {
        await sb.from('room_messages').insert([{
          room_code: play.code,
          sender: myName || 'SYS',
          zone: clash.zone,
          msg_type: 'p2p_evt',
          content: JSON.stringify({
            kind: 'clash_state',
            battleId: clash.battleId,
            seq: clash.seq,
            stepId,
            sideA: clash.sideA,
            sideB: clash.sideB,
            turnIdx: clash.turnIdx,
            activeActorName: clash.activeActorName,
            logText
          })
        }]);
      }

      const aAlive = clash.sideA.some(x => x.hp > 0);
      const bAlive = clash.sideB.some(x => x.hp > 0);
      if (!aAlive || !bAlive) {
        clash.ended = true;
        const winTeam = aAlive ? clash.sideA : clash.sideB;
        const loseTeam = aAlive ? clash.sideB : clash.sideA;
        const killerNames = winTeam.filter(x => x.hp > 0).map(x => x.name).join('·') || winTeam.map(x => x.name).join('·');
        const deadNames = loseTeam.map(x => x.name).join('·');
        loseTeam.forEach(lt => {
          const dRow = play.players.find(p => String(p.id) === String(lt.id) || p.name === lt.name);
          if (dRow) { dRow.alive = false; dRow.hp = 0; }
        });
        const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
        const killNews = `[속보] ${deadNames}이(가) ${killerNames}에게 살해당했습니다. (생존 ${remCnt}명)`;
        const endSummary = `【교전 종료】 ${killerNames} 측이 ${deadNames} 측을 제압하고 싸움이 종료되었다.`;
        sfx.deathAlert();
        setMarqueeAlert(`${deadNames} 사망!! (생존 ${remCnt}명)`);
        if (clash.zone === play.me.zone) {
          await appendGameLog(`[${fmtClock()}] ${endSummary}`, true);
        }
        if (!play.isSolo && play.code) {
          await sb.from('room_messages').insert([{
            room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: killNews
          }]);
          await sb.from('room_messages').insert([{
            room_code: play.code,
            sender: myName || 'SYS',
            zone: clash.zone,
            msg_type: 'p2p_evt',
            content: JSON.stringify({
              kind: 'clash_state',
              battleId: clash.battleId,
              seq: (clash.seq || 0) + 1,
              sideA: clash.sideA,
              sideB: clash.sideB,
              turnIdx: clash.turnIdx,
              activeActorName: clash.activeActorName,
              ended: true,
              endSummary
            })
          }]);
        }
        if (modalState.mode === 'battle' && modalState.battleId === clash.battleId) {
          appendModalBattleLog(endSummary);
          await new Promise(r => setTimeout(r, 450));
          closeCenterModal();
        }
        break;
      }
    }
  } finally {
    clash._npcLoopRunning = false;
  }
}

async function startBattleModal(targetId, opts = {}) {
  if (!play.me.alive || play.finished) return;
  const target = play.players.find(p => String(p.id) === String(targetId) && p.alive);
  if (!target) return;

  sfx.battleStart();

  const isPvp = !target.is_npc;
  const isDefender = Boolean(opts.isDefender);
  const npc = NPC_ROSTER.find(n => n.name === target.name);
  const c = getPickedChar();
  if (opts.joinedLate) modalState.joinedLateMe = true;

  if (!play.isSolo && play.code && !opts.skipMultiInit) {
    const meRow = play.players.find(p => p.id === play.pid) || {
      id: play.pid || c.name, name: c.name, club: c.club, hp: play.me.hp, is_npc: false,
      stats: { agi: c.agi, str: c.str }
    };
    const meFighter = makeCombatantFromPlayerRow(meRow, 'A');
    if (opts.joinedLate) meFighter.joinedLate = true;
    const sideA = [meFighter];
    const sideB = [makeCombatantFromPlayerRow(target, 'B')];

    (play.me.allies || []).forEach(aName => {
      const aRow = play.players.find(p => p.name === aName && p.alive && p.zone === play.me.zone && p.is_npc);
      if (aRow && sideA.length < 4) sideA.push(makeCombatantFromPlayerRow(aRow, 'A'));
    });

    if (target.is_npc) {
      const enPairName = getNpcAllyPairName(target.name);
      const enPairRow = enPairName ? play.players.find(p => p.name === enPairName && p.alive && p.zone === play.me.zone) : null;
      if (enPairRow) {
        sideB.push(makeCombatantFromPlayerRow(enPairRow, 'B'));
        pushDialogueToChat(enPairRow.name, `${target.name} 혼자 두지 않아! 나도 같이 싸운다!`, { zone: play.me.zone, broadcast: true });
      }
    }

    const battleId = opts.battleId || `bat_${Date.now()}_${Math.floor(Math.random() * 999)}`;
    const initQueue = rebuildMultiTurnQueue(sideA, sideB);
    const clashObj = {
      battleId,
      zone: play.me.zone,
      controllerName: c?.name || '유저',
      sideA,
      sideB,
      turnQueue: initQueue,
      turnIdx: 0,
      activeActorName: initQueue[0]?.name || null,
      seq: 0,
      ended: false
    };
    activeZoneClashes[battleId] = clashObj;

    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({
        kind: 'clash_start',
        battleId,
        zone: play.me.zone,
        controllerName: clashObj.controllerName,
        sideA,
        sideB,
        turnIdx: 0,
        activeActorName: clashObj.activeActorName
      })
    }]);

    await openLiveMultiBattleModal(clashObj, 'A', { isInitiator: true, ambush: opts.ambush, joinedLate: opts.joinedLate });
    return;
  }

  const sameZoneAllyNames = (play.me.allies || []).filter(aName =>
    play.players.some(p => p.name === aName && p.alive && p.zone === play.me.zone)
  );
  if (opts.allyPartnerName && sameZoneAllyNames.includes(opts.allyPartnerName)) {
    sameZoneAllyNames.splice(sameZoneAllyNames.indexOf(opts.allyPartnerName), 1);
    sameZoneAllyNames.unshift(opts.allyPartnerName);
  }
  const allyFighters = sameZoneAllyNames.slice(0, MAX_ALLIES).map(aName => {
    const pRow = play.players.find(p => p.name === aName && p.alive);
    const nMeta = NPC_ROSTER.find(n => n.name === aName);
    const defaultAgi = nMeta?.club === '육상부' ? 5 : (nMeta?.club === '검도부' ? 4 : 3);
    const wPow = pRow.is_npc ? getNpcWeaponPower(pRow.name) : { weaponName: '무장', atk: 4 };
    return {
      id: pRow.id,
      name: pRow.name,
      hp: pRow.hp || 15,
      maxHp: 15,
      agi: pRow.stats?.agi || defaultAgi,
      str: pRow.stats?.str || 4,
      weaponAtk: wPow.atk,
      weaponName: wPow.weaponName,
      isNpc: pRow.is_npc,
      joinedLate: false
    };
  });

  let enemyAllyFighter = null;
  if (target.is_npc) {
    const enPairName = getNpcAllyPairName(target.name);
    const enPairRow = enPairName ? play.players.find(p => p.name === enPairName && p.alive && p.zone === play.me.zone) : null;
    if (enPairRow) {
      const eMeta = NPC_ROSTER.find(n => n.name === enPairRow.name);
      const ewPow = getNpcWeaponPower(enPairRow.name);
      enemyAllyFighter = {
        id: enPairRow.id,
        name: enPairRow.name,
        hp: enPairRow.hp || 15,
        maxHp: 15,
        agi: eMeta?.club === '육상부' ? 5 : 3,
        weaponAtk: ewPow.atk,
        weaponName: ewPow.weaponName
      };
      pushDialogueToChat(enPairRow.name, `${target.name} 혼자 두지 않아! 나도 같이 싸운다!`, { zone: play.me.zone });
    }
  } else {
    const enHumanAlly = play.players.find(p => p.alive && p.zone === play.me.zone && p.id !== target.id && p.id !== play.pid && !play.me.allies.includes(p.name) && p.is_npc);
    if (enHumanAlly && Math.random() < 0.4) {
      const ewPow = getNpcWeaponPower(enHumanAlly.name);
      enemyAllyFighter = { id: enHumanAlly.id, name: enHumanAlly.name, hp: enHumanAlly.hp || 15, maxHp: 15, agi: 3, weaponAtk: ewPow.atk, weaponName: ewPow.weaponName };
    }
  }

  const enemyAgi = target.stats?.agi || (npc?.club === '육상부' ? 5 : 3);
  const turnQueue = buildSpeedTurnQueue(c, allyFighters, { name: target.name, agi: enemyAgi }, enemyAllyFighter, opts.joinedLate);
  const myTeamCnt = 1 + allyFighters.length;
  const enTeamCnt = 1 + (enemyAllyFighter ? 1 : 0);
  const scaleTag = `${myTeamCnt} VS ${enTeamCnt}`;

  modalState.mode = 'battle';
  modalState.targetId = target.id;
  modalState.enemyName = target.name;
  modalState.enemyClub = target.club || '참가자';
  modalState.enemyTrait = npc ? npc.trait : (isPvp ? '유저' : '생존자');
  modalState.enemyHp = target.hp || 15;
  modalState.enemyMaxHp = 15;
  modalState.enemyWeapon = npc ? `${npc.weapon} (공격 ${getNpcWeaponPower(target.name).atk})` : '무장 (유저)';
  modalState.allyFighters = allyFighters;
  modalState.enemyAllyFighter = enemyAllyFighter;
  modalState.turnQueue = turnQueue;
  modalState.turnIdx = 0;
  modalState.defending = false;
  modalState.ambush = Boolean(opts.ambush);
  modalState.isPvp = isPvp;
  modalState.myTurn = !isDefender;
  modalState.busy = isPvp ? isDefender : false;
  play.combatCount++;

  const speedOrderTxt = turnQueue.map(t => `${t.name}(${t.joinedLate ? '후순위' : '민첩 ' + t.agi})`).join(' → ');
  const effInfo = getEffectiveWeaponDamage(c);
  const wInfo = play.me.weapon?.name && play.me.weapon.name !== '맨손'
    ? `장착 무기: ${play.me.weapon.name} (기본 ${effInfo.baseAtk} + 근력보정 ${effInfo.strBonus} = 총 ${effInfo.baseAtk + effInfo.strBonus}, ${play.me.weapon.kind})`
    : `장착 무기: 맨손 (기본 1 + 근력보정 ${effInfo.strBonus} = 총 ${1 + effInfo.strBonus} · 무기 장착 권장)`;

  const myAvHtml = play.me.avatar ? `<img src="${play.me.avatar}" alt="">` : esc((c?.name || '실').slice(0, 1));
  const enAvUrl = getParticipantAvatar(modalState.enemyName);
  const enAvHtml = enAvUrl ? `<img src="${enAvUrl}" alt="">` : esc(modalState.enemyName.slice(0, 1));
  const soloMyMini = renderMiniCombatantsHtml(allyFighters, '', false);
  const soloEnMini = enemyAllyFighter ? renderMiniCombatantsHtml([enemyAllyFighter], '', false) : '';

  openCenterModal(`
    <div class="modal-top-bar" id="batDragBar" style="cursor:move;">${isPvp ? `실시간 유저 교전 (${scaleTag})` : `전투 (${scaleTag})`}</div>
    <div class="bat-pop-vs">
      <div>
        <div class="bat-pop-side">
          <div class="ref-portrait-sq" style="width:52px;height:52px;font-size:18px;">${myAvHtml}</div>
          <div>
            <div style="font-size:13px;font-weight:bold;">${esc(c?.name || '실험체')}</div>
            <div style="font-size:10px;color:#3d382d;">${esc(c?.club || '천문부')} · ${esc(formatConditionsText(play.me.conditions))}</div>
            <div class="bat-pop-segs" id="mSegMy"></div>
            <div style="font-size:10px;margin-top:2px;" id="mHpMy">${play.me.hp}/${play.me.maxHp}</div>
          </div>
        </div>
        <div id="mSoloMiniMy">${soloMyMini}</div>
      </div>
      <div style="text-align:center;font-size:16px;font-weight:bold;">${scaleTag}</div>
      <div>
        <div class="bat-pop-side">
          <div class="ref-portrait-sq" style="width:52px;height:52px;font-size:18px;">${enAvHtml}</div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
              <span style="font-size:13px;font-weight:bold;">${esc(modalState.enemyName)}</span>
              ${enemyAllyFighter ? `<button type="button" class="ref-mini-btn" id="mBtnSoloSwap" onclick="swapSoloEnemyTarget()">타겟 전환</button>` : ''}
            </div>
            <div style="font-size:10px;color:#3d382d;">${esc(modalState.enemyClub)} · ${esc(modalState.enemyTrait)}</div>
            <div class="bat-pop-segs" id="mSegEn"></div>
            <div style="font-size:10px;margin-top:2px;" id="mHpEn">${modalState.enemyHp}/${modalState.enemyMaxHp}</div>
          </div>
        </div>
        <div id="mSoloMiniEn">${soloEnMini}</div>
      </div>
    </div>
    <div class="bat-pop-log" id="mBatLog">
      <div>— ${esc(c?.name || '실험체')} VS ${esc(modalState.enemyName)}${enemyAllyFighter ? `·${esc(enemyAllyFighter.name)}` : ''} —</div>
      <div>행동 순서: ${esc(speedOrderTxt)}</div>
      <div>${esc(wInfo)}</div>
    </div>
    <div class="bat-pop-grid">
      <button type="button" class="modal-act-btn" id="mBtnAtk" onclick="mBattleCmd('atk')">공격</button>
      <button type="button" class="modal-act-btn" id="mBtnDef" onclick="mBattleCmd('def')">방어</button>
      <button type="button" class="modal-act-btn" id="mBtnItem" onclick="mBattleCmd('item')">아이템</button>
      <button type="button" class="modal-act-btn" id="mBtnPersuade" onclick="mBattleCmd('persuade')">설득</button>
      <button type="button" class="modal-act-btn" id="mBtnGiveUp" onclick="mBattleCmd('giveup')">포기 (무기를 내려놓는다)</button>
      <button type="button" class="modal-act-btn" id="mBtnFlee" onclick="mBattleCmd('flee')">도주</button>
    </div>
    <div id="mBatItemPicker" style="display:none;background:#e2dac8;border:2px solid #141c30;padding:6px;margin-bottom:6px;"></div>
    <div style="display:flex;gap:4px;margin-bottom:6px;">
      <input type="text" id="mBatChatIn" placeholder="전투 중 한마디 / 채팅 전송..." style="flex:1;background:#f5f0e3;color:#141c30;border:1px solid #141c30;padding:4px 7px;font-size:11px;outline:none;" onkeydown="if(event.key==='Enter') sendBattleChat()">
      <button type="button" class="ref-mini-btn" onclick="sendBattleChat()">채팅</button>
    </div>
    <div class="bat-pop-foot">
      <span id="mTurnTxt">${isPvp ? (isDefender ? `${modalState.enemyName}의 턴 대기 중...` : '당신의 턴!') : '민첩 속도 순 턴 진행'}</span>
      ${!isPvp ? `<button type="button" class="ref-mini-btn" onclick="mBattleCmd('next')">▶ 다음 턴</button>` : ''}
    </div>`);
  initBattleModalDrag();
  renderModalBattleHp();

  if (isPvp && !isDefender && play.code) {
    isSleepingNow = false;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'pvp_start', to: modalState.enemyName, attackerId: play.pid })
    }]);
  }

  if (!isPvp) {
    if (modalState.ambush) {
      modalState.busy = true;
      renderModalBattleHp();
      await mEnemyTurn(false);
      if (modalState.mode === 'battle') {
        await advanceSpeedTurnsUntilMyTurn();
      }
    } else {
      await advanceSpeedTurnsUntilMyTurn();
    }
  }
}

function swapSoloEnemyTarget() {
  if (!modalState.enemyAllyFighter || modalState.enemyAllyFighter.hp <= 0 || modalState.enemyHp <= 0) return;
  const oldMain = {
    id: modalState.targetId,
    name: modalState.enemyName,
    hp: modalState.enemyHp,
    maxHp: modalState.enemyMaxHp,
    weaponAtk: getNpcWeaponPower(modalState.enemyName).atk,
    weaponName: getNpcWeaponPower(modalState.enemyName).weaponName
  };
  const newMain = modalState.enemyAllyFighter;
  const nMeta = NPC_ROSTER.find(n => n.name === newMain.name);

  modalState.targetId = newMain.id;
  modalState.enemyName = newMain.name;
  modalState.enemyClub = nMeta?.club || '참가자';
  modalState.enemyTrait = nMeta?.trait || '생존자';
  modalState.enemyHp = newMain.hp;
  modalState.enemyMaxHp = newMain.maxHp || 15;
  modalState.enemyWeapon = `${newMain.weaponName || '무장'} (공격 ${newMain.weaponAtk || 4})`;
  modalState.enemyAllyFighter = oldMain;

  appendModalBattleLog(`공격 대상을 ${modalState.enemyName}(으)로 전환했다!`);
  renderModalBattleHp();
}

async function advanceSpeedTurnsUntilMyTurn() {
  if (modalState.mode !== 'battle' || modalState.isPvp) return;
  const c = getPickedChar();
  while (modalState.mode === 'battle') {
    const curActor = modalState.turnQueue[modalState.turnIdx % modalState.turnQueue.length];
    if (!curActor) break;
    if (curActor.role === 'me') {
      modalState.busy = false;
      renderModalBattleHp();
      return;
    }
    modalState.busy = true;
    renderModalBattleHp();
    if (curActor.role === 'ally') {
      const af = (modalState.allyFighters || [])[curActor.allyIdx];
      if (af && af.hp > 0) {
        await new Promise(r => setTimeout(r, 320));
        if (modalState.mode !== 'battle') return;
        const allyDmg = Math.max(2, (af.weaponAtk || 4) + Math.floor(Math.random() * 2) - 1);
        if (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0 && Math.random() < 0.45) {
          modalState.enemyAllyFighter.hp = Math.max(0, modalState.enemyAllyFighter.hp - allyDmg);
          sfx.attack();
          triggerBattleShake();
          appendModalBattleLog(`[동료 ${af.name}] 적 동료 ${modalState.enemyAllyFighter.name}에게 ${allyDmg} 피해!`);
          if (modalState.enemyAllyFighter.hp === 0) {
            const deadEAllyRow = play.players.find(p => String(p.id) === String(modalState.enemyAllyFighter.id));
            if (deadEAllyRow) { deadEAllyRow.alive = false; deadEAllyRow.hp = 0; }
            await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', modalState.enemyAllyFighter.id);
            appendModalBattleLog(`${modalState.enemyAllyFighter.name}이(가) 쓰러졌다!`);
          }
        } else {
          modalState.enemyHp = Math.max(0, modalState.enemyHp - allyDmg);
          sfx.attack();
          triggerBattleShake();
          appendModalBattleLog(`[동료 ${af.name}] ${modalState.enemyName}에게 ${allyDmg} 협동 피해!`);
          if (modalState.enemyHp === 0) {
            const deadEnRow = play.players.find(p => String(p.id) === String(modalState.targetId));
            if (deadEnRow) { deadEnRow.alive = false; deadEnRow.hp = 0; }
            await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', modalState.targetId);
            play.killCount = (play.killCount || 0) + 1;
            const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
            const killNews = `[속보] ${modalState.enemyName}이(가) ${af.name}(${c?.name || '실험체'} 동료)에게 살해당했습니다. (생존 ${remCnt}명)`;
            sfx.deathAlert();
            setMarqueeAlert(`${modalState.enemyName} 사망!! (생존 ${remCnt}명)`);
            await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
            await sb.from('room_messages').insert([{
              room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: killNews
            }]);
            appendModalBattleLog(`${modalState.enemyName}이(가) 쓰러졌다!`);
            if (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0) {
              swapSoloEnemyTarget();
              modalState.enemyAllyFighter = null;
            } else {
              await new Promise(r => setTimeout(r, 420));
              openLootModal(modalState.enemyName);
              return;
            }
          }
        }
        renderModalBattleHp();
      }
    } else if (curActor.role === 'enemy' && modalState.enemyHp > 0) {
      await mEnemyTurn(false);
      if (modalState.mode !== 'battle') return;
    } else if (curActor.role === 'enemy_ally' && modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0) {
      await new Promise(r => setTimeout(r, 320));
      if (modalState.mode !== 'battle') return;
      const eAllyDmg = Math.max(2, (modalState.enemyAllyFighter.weaponAtk || 4) + Math.floor(Math.random() * 2) - 1);
      const aliveAllies = (modalState.allyFighters || []).filter(a => a.hp > 0);
      if (aliveAllies.length > 0 && Math.random() < 0.55) {
        const hitAlly = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
        hitAlly.hp = Math.max(0, hitAlly.hp - eAllyDmg);
        sfx.hurt();
        triggerBattleShake();
        appendModalBattleLog(`[적 동료 ${modalState.enemyAllyFighter.name}] 동료 ${hitAlly.name}에게 ${eAllyDmg} 피해!`);
        const hAllyRow = play.players.find(p => String(p.id) === String(hitAlly.id));
        if (hAllyRow) { hAllyRow.hp = hitAlly.hp; hAllyRow.alive = hitAlly.hp > 0; }
        await sb.from('room_players').update({ hp: hitAlly.hp, alive: hitAlly.hp > 0 }).eq('id', hitAlly.id);
        if (hitAlly.hp === 0) {
          appendModalBattleLog(`동료 ${hitAlly.name}이(가) 쓰러졌다!`);
        }
      } else {
        play.me.hp = Math.max(0, play.me.hp - eAllyDmg);
        sfx.hurt();
        triggerBattleShake();
        if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
        appendModalBattleLog(`[적 동료 ${modalState.enemyAllyFighter.name}] 기습 타격! HP -${eAllyDmg}`);
        renderModalBattleHp();
        if (play.me.hp === 0) {
          const eAllyKillCause = `${modalState.enemyAllyFighter.name}의 협공`;
          play.deathReason = eAllyKillCause;
          await new Promise(r => setTimeout(r, 420));
          closeCenterModal();
          await handleMeDead(eAllyKillCause);
          return;
        }
      }
      renderModalBattleHp();
    }
    modalState.turnIdx++;
  }
}

function renderModalBattleHp() {
  const c = getPickedChar();
  const hitP = Math.round(getBattleHitProb(c) * 100);
  const perP = Math.round(getBattlePersuadeProb(c, modalState.enemyName, modalState.isPvp) * 100);
  const fleeP = Math.round(getBattleFleeProb(c) * 100);

  const drawSeg = (id, cur, max) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 1; i <= max; i++) {
      const s = document.createElement('span');
      s.className = 'bat-pop-seg' + (i <= cur ? ' on' : '');
      el.appendChild(s);
    }
  };
  drawSeg('mSegMy', play.me.hp, play.me.maxHp);
  drawSeg('mSegEn', modalState.enemyHp, modalState.enemyMaxHp);
  const myTxt = document.getElementById('mHpMy');
  const enTxt = document.getElementById('mHpEn');
  if (myTxt) myTxt.textContent = `${play.me.hp}/${play.me.maxHp}`;
  if (enTxt) enTxt.textContent = `${modalState.enemyHp}/${modalState.enemyMaxHp}`;

  const soloMyMiniEl = document.getElementById('mSoloMiniMy');
  if (soloMyMiniEl) soloMyMiniEl.innerHTML = renderMiniCombatantsHtml(modalState.allyFighters || [], '', false);
  const soloEnMiniEl = document.getElementById('mSoloMiniEn');
  if (soloEnMiniEl) {
    soloEnMiniEl.innerHTML = modalState.enemyAllyFighter
      ? renderMiniCombatantsHtml([modalState.enemyAllyFighter], '', false)
      : '';
  }

  const turnEl = document.getElementById('mTurnTxt');
  if (turnEl && modalState.isPvp) {
    turnEl.textContent = modalState.busy ? `${modalState.enemyName}의 행동을 기다리는 중...` : '당신의 턴!';
  }

  const setBtn = (id, txt, dis) => {
    const b = document.getElementById(id);
    if (b) { b.textContent = txt; b.disabled = dis; }
  };
  const hasUsableBatItem = play.me.bag.some(i => ['heal', 'food', 'smoke', 'repair', 'armor'].includes(i.type));
  setBtn('mBtnAtk', `공격 (${hitP}%)`, modalState.busy);
  setBtn('mBtnDef', '방어', modalState.busy);
  setBtn('mBtnItem', '아이템', modalState.busy || !hasUsableBatItem);
  setBtn('mBtnPersuade', `설득 (${perP}%)`, modalState.busy);
  setBtn('mBtnGiveUp', '포기 (무기를 내려놓는다)', modalState.busy);
  setBtn('mBtnFlee', `도주 (${fleeP}%)`, modalState.busy);
}

function initBattleModalDrag() {
  const bar = document.getElementById('batDragBar');
  const box = document.getElementById('centerModalBox');
  if (!bar || !box) return;
  box.style.transform = 'translate(0px, 0px)';
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  bar.onmousedown = (e) => {
    dragging = true;
    sx = e.clientX - ox;
    sy = e.clientY - oy;
  };
  window.onmousemove = (e) => {
    if (!dragging) return;
    ox = e.clientX - sx;
    oy = e.clientY - sy;
    box.style.transform = `translate(${ox}px, ${oy}px)`;
  };
  window.onmouseup = () => { dragging = false; };
}

async function sendBattleChat() {
  const inp = document.getElementById('mBatChatIn');
  const c = getPickedChar();
  if (!inp || !c) return;
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  appendModalBattleLog(`[채팅] ${c.name}: ${txt}`);
  const z = play.me.zone || 'all';
  addChatMessage(c.name, txt, play.me.avatar, false, z);
  if (play.code) {
    await sb.from('room_messages').insert([{
      room_code: play.code, sender: c.name, zone: z, msg_type: 'normal', content: txt
    }]);
    if (modalState.isPvp && modalState.enemyName) {
      await sendPvpTurnAction({ action: 'bat_chat', text: txt });
    }
  }
}

function appendModalBattleLog(msg) {
  const box = document.getElementById('mBatLog');
  if (!box) return;
  const d = document.createElement('div');
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

async function mEnemyTurn(singleStep = true) {
  if (modalState.mode !== 'battle' || modalState.isPvp) return;
  const trDelay = (modalState.enemyTrait === '겁쟁이' || modalState.enemyTrait === '신중형') ? 620 : ((modalState.enemyTrait === '호전적' || modalState.enemyTrait === '돌격형') ? 280 : 420);
  await new Promise(r => setTimeout(r, trDelay));
  if (modalState.mode !== 'battle') return;
  if (!modalState.ambush && (modalState.enemyTrait === '겁쟁이') && modalState.enemyHp <= 6 && Math.random() < 0.28) {
    sfx.flee();
    appendModalBattleLog(`${modalState.enemyName}이(가) 겁에 질려 뒤로 도망쳤다!`);
    await new Promise(r => setTimeout(r, 420));
    closeCenterModal();
    await appendGameLog(`[${fmtClock()}] ${modalState.enemyName}이(가) 전투 도중 도주했다.`);
    refreshGameUI();
    return;
  }
  if (modalState.mode !== 'battle') return;

  const c = getPickedChar();
  const hNow = Math.floor((play.minutes % 1440) / 60);
  const isNightNow = !(hNow >= 6 && hNow < 18);
  const sleepLackPen = (hasCondition('피로') || (isNightNow && (play.nightSleepMinutes || 0) < 120)) ? 0.14 : 0;
  const watchBonus = (modalState.watchSaved) ? 0.15 : 0;
  const dodgeP = modalState.ambush ? 0 : Math.max(0.03, Math.min(0.45, ((c?.agi || 1) - 1) * 0.05 - sleepLackPen + watchBonus));
  if (Math.random() < dodgeP) {
    sfx.flee();
    appendModalBattleLog(`${modalState.enemyName}의 공격을 재빨리 피했다!`);
    modalState.defending = false;
    modalState.watchSaved = false;
    modalState.busy = false;
    renderModalBattleHp();
    return;
  }

  const enHearts = getAffinity(modalState.enemyName);
  const hesitating = !modalState.ambush && enHearts >= 3 && Math.random() < (0.25 + (enHearts - 3) * 0.2);
  if (hesitating) {
    const spareLine = getNpcScriptLine(modalState.enemyName, 9, '…너는 못 죽이겠다.');
    appendModalBattleLog(`${modalState.enemyName}: "${spareLine}"`);
    appendModalBattleLog(`${modalState.enemyName}이(가) 망설이며 칼끝을 거뒀다!`);
    modalState.defending = false;
    modalState.busy = false;
    renderModalBattleHp();
    return;
  }
  const enWepPow = getNpcWeaponPower(modalState.enemyName).atk;
  const enDayBonus = Math.min(2, Math.floor((play.day - 1) * 0.5));
  const enTraitDmg = (modalState.enemyTrait === '호전적' || modalState.enemyTrait === '돌격형') ? 1 : 0;
  const ambushBonus = modalState.ambush ? 2 : 0;
  let dmg = Math.max(2, enWepPow + enDayBonus + enTraitDmg + ambushBonus + Math.floor(Math.random() * 2) - 1);
  if ((play.me.shield || 0) > 0) {
    play.me.shield--;
    dmg = Math.max(0, dmg - 1);
    appendModalBattleLog(`방어구가 충격을 흡수했다! (남은 보호 ${play.me.shield})`);
  }
  if (modalState.defending) {
    dmg = Math.max(0, dmg - 2);
    appendModalBattleLog(`방어 자세로 피해를 줄였다! (피해 ${dmg})`);
  }
  modalState.defending = false;
  modalState.ambush = false;
  modalState.watchSaved = false;
  play.me.hp = Math.max(0, play.me.hp - dmg);
  sfx.hurt();
  triggerBattleShake();

  const enWepStr = modalState.enemyWeapon || '';
  const isPoisonEnemy = ['독', '바람총', '핀셋', '구급함'].some(k => enWepStr.includes(k));
  const isBladeEnemy = ['낫', '단도', '식칼', '커터칼', '가위', '중식도', '사냥칼', '연출용단검'].some(k => enWepStr.includes(k));
  const isStunEnemy = ['넥', '지휘봉', '스파이크'].some(k => enWepStr.includes(k));
  if (isPoisonEnemy && Math.random() < 0.34) {
    if (addMyCondition('중독')) appendModalBattleLog(`독기가 스며들어 '중독' 상태가 되었다!`);
  } else if (isBladeEnemy && Math.random() < 0.32) {
    if (addMyCondition('출혈')) appendModalBattleLog(`날붙이에 깊게 베여 '출혈' 상태가 되었다!`);
  } else if (isStunEnemy && Math.random() < 0.28) {
    if (addMyCondition('피로')) appendModalBattleLog(`충격으로 기력이 빠져 '피로' 상태가 되었다!`);
  } else if (Math.random() < 0.24) {
    if (addMyCondition('부상')) appendModalBattleLog(`강한 충격으로 '부상' 상태가 되었다!`);
  }
  if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
  appendModalBattleLog(`${modalState.enemyName}의 공격! HP -${dmg}`);
  renderModalBattleHp();

  if (play.me.hp === 0) {
    const saviors = (play.me.allies || []).filter(aName => {
      if (isHumanPlayerName(aName)) return false;
      const pRow = play.players.find(p => p.name === aName && p.alive && p.zone === play.me.zone);
      return pRow && getAffinity(aName) >= 5;
    });
    if (saviors.length > 0 && Math.random() < 0.85) {
      const heroName = saviors[Math.floor(Math.random() * saviors.length)];
      const heroRow = play.players.find(p => p.name === heroName && p.alive);
      if (heroRow) {
        play.me.hp = 3;
        play.me.allies = play.me.allies.filter(n => n !== heroName);
        if (play.me.selectedAlly === heroName) play.me.selectedAlly = play.me.allies[0] || null;
        heroRow.alive = false;
        heroRow.hp = 0;
        await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', heroRow.id);
        if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: true }).eq('id', play.pid);
        const spareLine = getNpcScriptLine(heroName, 8, '뒤는 내가 막는다고 약속했잖아… 꼭 살아남아.');
        appendModalBattleLog(`${heroName}이(가) 몸을 던져 치명상을 대신 맞았다!`);
        appendModalBattleLog(`${heroName}: "${spareLine}"`);
        pushDialogueToChat(`${heroName} (${renderHearts(getAffinity(heroName))})`, spareLine, { zone: play.me.zone, broadcast: true });
        const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
        sfx.deathAlert();
        setMarqueeAlert(`${heroName} 사망! (생존 ${remCnt}명)`);
        await sb.from('room_messages').insert([{
          room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys',
          content: `[속보] ${heroName}이(가) 동료를 감싸다 사망했습니다. (생존 ${remCnt}명)`
        }]);
        await appendGameLog(`[${fmtClock()}] 【희생】 호감도가 최고조에 달한 동료 ${heroName}이(가) 대신 공격을 맞고 쓰러졌다! (HP 3 생존)`, true);
        renderModalBattleHp();
        modalState.busy = false;
        return;
      }
    }
    const batKillCause = `${modalState.enemyName}과의 전투`;
    play.deathReason = batKillCause;
    await new Promise(r => setTimeout(r, 420));
    closeCenterModal();
    await handleMeDead(batKillCause);
    return;
  }
  if (c && c.club === '검도부' && modalState.enemyHp > 0 && Math.random() < 0.25) {
    const counterDmg = 2 + Math.floor(((c.str || 1) - 1) * 0.5);
    modalState.enemyHp = Math.max(0, modalState.enemyHp - counterDmg);
    sfx.attack();
    triggerBattleShake();
    appendModalBattleLog(` [검도부 특기 발동: 즉시 반격!] ${modalState.enemyName}에게 ${counterDmg} 반격 피해.`);
    if (modalState.enemyHp === 0) {
      const deadEnRow = play.players.find(p => String(p.id) === String(modalState.targetId));
      if (deadEnRow) { deadEnRow.alive = false; deadEnRow.hp = 0; }
      await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', modalState.targetId);
      play.killCount = (play.killCount || 0) + 1;
      const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
      const killNews = `[속보] ${modalState.enemyName}이(가) ${c?.name || '실험체'}의 반격에 살해당했습니다. (생존 ${remCnt}명)`;
      sfx.deathAlert();
      setMarqueeAlert(`${modalState.enemyName} 사망!! (생존 ${remCnt}명)`);
      await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
      await sb.from('room_messages').insert([{
        room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: killNews
      }]);
      appendModalBattleLog(`${modalState.enemyName}이(가) 반격에 쓰러졌다!`);
      if (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0) {
        swapSoloEnemyTarget();
        modalState.enemyAllyFighter = null;
      } else {
        await new Promise(r => setTimeout(r, 420));
        openLootModal(modalState.enemyName);
        return;
      }
    }
  }
  if (singleStep) {
    modalState.busy = false;
    renderModalBattleHp();
  }
}

async function sendPvpTurnAction(payload) {
  if (!play.code) return;
  const c = getPickedChar();
  await sb.from('room_messages').insert([{
    room_code: play.code,
    sender: c?.name || '유저',
    zone: play.me.zone,
    msg_type: 'p2p_evt',
    content: JSON.stringify({
      kind: 'pvp_turn',
      battleId: modalState.battleId,
      to: modalState.enemyName,
      ...payload
    })
  }]);
}

async function broadcastMultiBattleStep(clash, logText, endSummary = '') {
  if (!play.code || play.isSolo || !clash) return;
  clash.seq = (clash.seq || 0) + 1;
  await sb.from('room_messages').insert([{
    room_code: play.code,
    sender: getPickedChar()?.name || '유저',
    zone: clash.zone,
    msg_type: 'p2p_evt',
    content: JSON.stringify({
      kind: 'clash_state',
      battleId: clash.battleId,
      seq: clash.seq,
      sideA: clash.sideA,
      sideB: clash.sideB,
      turnIdx: clash.turnIdx,
      activeActorName: clash.activeActorName,
      ended: Boolean(clash.ended),
      logText,
      endSummary
    })
  }]);
}

async function mBattleCmd(cmd) {
  if (modalState.mode !== 'battle' || modalState.busy) return;
  if (cmd === 'next') {
    if (!modalState.isPvp && !modalState.busy) {
      modalState.busy = true;
      renderModalBattleHp();
      await mEnemyTurn();
    }
    return;
  }

  if (cmd === 'item') {
    openBattleItemPicker();
    return;
  }

  if (modalState.isMultiBattle && modalState.battleId) {
    const clash = activeZoneClashes[modalState.battleId];
    if (!clash || clash.ended) {
      closeCenterModal();
      return;
    }
    modalState.busy = true;
    renderMultiBattleUI();
    const c = getPickedChar();
    const myName = c?.name || '실험체';
    const myTeam = modalState.mySide === 'A' ? clash.sideA : clash.sideB;
    const enTeam = modalState.mySide === 'A' ? clash.sideB : clash.sideA;
    const targetEnemy = enTeam.find(x => String(x.id) === String(modalState.targetId) && x.hp > 0) || enTeam.find(x => x.hp > 0);
    const meFighter = myTeam.find(x => x.name === myName);

    if (cmd === 'atk' && targetEnemy) {
      const hitP = getBattleHitProb(c);
      if (Math.random() > hitP) {
        const logText = `${myName}의 공격이 빗나갔다!`;
        appendModalBattleLog(logText);
        advanceMultiTurnCursor(clash, myName);
        renderMultiBattleUI();
        await broadcastMultiBattleStep(clash, logText);
        await runNpcTurnsIfHostInMultiBattle(clash);
        return;
      }

      const eff = getEffectiveWeaponDamage(c);
      const dmg = eff.dmg;
      const wName = play.me.weapon?.name || '맨손';
      sfx.attack();
      triggerBattleShake();

      const duraRes = consumeEquippedWeaponDurability(c);
      if (duraRes.broke) {
        appendModalBattleLog(`'${duraRes.brokenName}'의 내구도가 다해 부서졌다! 맨손이 되었다.`);
        appendGameLog(`[${fmtClock()}] '${duraRes.brokenName}'의 내구도가 소진되어 파괴되었다.`, true);
      } else if (duraRes.dura != null) {
        appendModalBattleLog(`(${duraRes.name} 내구도 ${duraRes.dura}/${duraRes.maxDura})`);
      }
      refreshGameUI();

      targetEnemy.hp = Math.max(0, targetEnemy.hp - dmg);
      if (targetEnemy.isNpc) {
        const tRow = play.players.find(p => String(p.id) === String(targetEnemy.id) || p.name === targetEnemy.name);
        if (tRow) {
          tRow.hp = targetEnemy.hp;
          tRow.alive = targetEnemy.hp > 0;
        }
        await sb.from('room_players').update({ hp: targetEnemy.hp, alive: targetEnemy.hp > 0 }).eq('id', targetEnemy.id);
      }

      const logText = `${myName}의 ${wName} 공격! ${targetEnemy.name}에게 ${dmg} 피해! (남은 HP ${targetEnemy.hp})${eff.clubAtkMsg || ''}`;
      appendModalBattleLog(logText);
      advanceMultiTurnCursor(clash, myName);

      const anyEnemyAlive = enTeam.some(x => x.hp > 0);
      if (!anyEnemyAlive) {
        clash.ended = true;
        play.killCount = (play.killCount || 0) + 1;
        enTeam.forEach(et => {
          const eRow = play.players.find(p => String(p.id) === String(et.id) || p.name === et.name);
          if (eRow) { eRow.alive = false; eRow.hp = 0; }
        });
        const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
        const killNews = `[속보] ${targetEnemy.name}이(가) ${myName}에게 살해당했습니다. (생존 ${remCnt}명)`;
        const endSummary = `【교전 종료】 ${myTeam.map(x => x.name).join('·')} 측이 ${enTeam.map(x => x.name).join('·')} 측을 제압하고 싸움이 종료되었다.`;
        sfx.deathAlert();
        setMarqueeAlert(`${targetEnemy.name} 사망!! (생존 ${remCnt}명)`);
        await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
        await sb.from('room_messages').insert([{
          room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys',
          content: killNews
        }]);
        await broadcastMultiBattleStep(clash, `${logText} → ${targetEnemy.name} 쓰러짐!`, endSummary);
        await new Promise(r => setTimeout(r, 420));
        modalState.isMultiBattle = false;
        openLootModal(targetEnemy.name);
        return;
      }

      renderMultiBattleUI();
      await broadcastMultiBattleStep(clash, logText);
      await runNpcTurnsIfHostInMultiBattle(clash);
      return;
    } else if (cmd === 'def') {
      modalState.defending = true;
      const logText = `${myName}이(가) 방어 자세를 취했다.`;
      appendModalBattleLog(logText);
      advanceMultiTurnCursor(clash, myName);
      renderMultiBattleUI();
      await broadcastMultiBattleStep(clash, logText);
      await runNpcTurnsIfHostInMultiBattle(clash);
      return;
    } else if (cmd === 'persuade' && targetEnemy) {
      const perP = getBattlePersuadeProb(c, targetEnemy.name, !targetEnemy.isNpc);
      if (Math.random() < perP) {
        clash.ended = true;
        const endSummary = `【교전 종료】 ${myName}의 설득으로 ${targetEnemy.name} 측과의 싸움이 종료되었다.`;
        appendModalBattleLog(endSummary);
        await broadcastMultiBattleStep(clash, endSummary, endSummary);
        await new Promise(r => setTimeout(r, 420));
        closeCenterModal();
        await appendGameLog(`[${fmtClock()}] ${endSummary}`, true);
        return;
      }
      const logText = `${myName}의 설득이 통하지 않았다.`;
      appendModalBattleLog(logText);
      advanceMultiTurnCursor(clash, myName);
      renderMultiBattleUI();
      await broadcastMultiBattleStep(clash, logText);
      await runNpcTurnsIfHostInMultiBattle(clash);
      return;
    } else if (cmd === 'giveup') {
      if (meFighter) meFighter.hp = 0;
      const leftMyTeam = myTeam.some(x => x.hp > 0);
      if (!leftMyTeam) clash.ended = true;
      advanceMultiTurnCursor(clash, myName);
      const killerName = enTeam.find(x => x.hp > 0)?.name || modalState.enemyName;
      const giveUpCause = `${killerName} 앞에서 저항 포기`;
      play.deathReason = giveUpCause;
      const endSummary = clash.ended
        ? `【교전 종료】 ${myName}이(가) 저항을 포기해 ${killerName}에게 쓰러지면서 싸움이 종료되었다.`
        : `【교전 이탈】 ${myName}이(가) 저항을 포기하고 쓰러졌다.`;
      appendModalBattleLog(endSummary);
      await broadcastMultiBattleStep(clash, endSummary, endSummary);
      await new Promise(r => setTimeout(r, 450));
      closeCenterModal();
      await handleMeDead(giveUpCause);
      return;
    } else if (cmd === 'flee') {
      const fleeP = getBattleFleeProb(c);
      if (Math.random() < fleeP) {
        sfx.flee();
        advanceMultiTurnCursor(clash, myName);
        if (mySide === 'A') clash.sideA = clash.sideA.filter(x => x.name !== myName);
        else clash.sideB = clash.sideB.filter(x => x.name !== myName);
        clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
        const remainNames = [...clash.sideA, ...clash.sideB].map(x => x.name).join('·');
        if (!clash.sideA.some(x => x.hp > 0) || !clash.sideB.some(x => x.hp > 0)) {
          clash.ended = true;
        }
        const logText = `${myName}이(가) 전투에서 이탈해 도주했다!`;
        const endSummary = clash.ended
          ? `【교전 종료】 ${myName}이(가) 도주하면서 ${remainNames || modalState.enemyName}와의 싸움이 종료되었다.`
          : `【교전 이탈】 ${myName}이(가) 싸움에서 도주했다.`;
        appendModalBattleLog(logText);
        await broadcastMultiBattleStep(clash, logText, endSummary);
        await new Promise(r => setTimeout(r, 380));
        closeCenterModal();
        await appendGameLog(`[${fmtClock()}] 교전에서 도주에 성공했다.`);
        return;
      }
      const logText = `${myName}이(가) 도주에 실패했다!`;
      appendModalBattleLog(logText);
      advanceMultiTurnCursor(clash, myName);
      renderMultiBattleUI();
      await broadcastMultiBattleStep(clash, logText);
      await runNpcTurnsIfHostInMultiBattle(clash);
      return;
    }
  }

  modalState.busy = true;
  renderModalBattleHp();
  const c = getPickedChar();

  if (cmd === 'atk') {
    const hitP = getBattleHitProb(c);
    if (Math.random() > hitP) {
      appendModalBattleLog(`${c?.name || '실험체'}의 공격이 빗나갔다!`);
      if (modalState.isPvp) {
        await sendPvpTurnAction({ action: 'miss' });
        return;
      }
      modalState.turnIdx++;
      await advanceSpeedTurnsUntilMyTurn();
      return;
    }
    const eff = getEffectiveWeaponDamage(c);
    const dmg = eff.dmg;
    const clubAtkMsg = eff.clubAtkMsg || '';
    const wName = play.me.weapon?.name || '맨손';
    const wKind = play.me.weapon?.kind || '근접';

    const duraRes = consumeEquippedWeaponDurability(c);
    if (duraRes.broke) {
      appendModalBattleLog(`'${duraRes.brokenName}'의 내구도가 다해 부서졌다! 맨손이 되었다.`);
      appendGameLog(`[${fmtClock()}] '${duraRes.brokenName}'의 내구도가 소진되어 파괴되었다.`, true);
    } else if (duraRes.dura != null) {
      appendModalBattleLog(`(${duraRes.name} 내구도 ${duraRes.dura}/${duraRes.maxDura})`);
    }
    refreshGameUI();

    if (modalState.isPvp) {
      sfx.attack();
      triggerBattleShake();
      appendModalBattleLog(`${c?.name || '실험체'}의 ${wName} 공격 시도! (기본 위력 ${dmg})${clubAtkMsg}`);
      const activeAllies = (play.me.allies || []).filter(aName =>
        play.players.some(p => p.name === aName && p.alive && p.zone === play.me.zone)
      );
      let allyBonus = 0;
      let allyHelper = null;
      if (activeAllies.length > 0 && Math.random() < 0.7) {
        allyHelper = activeAllies[Math.floor(Math.random() * activeAllies.length)];
        allyBonus = 2 + Math.floor(Math.random() * 2);
        appendModalBattleLog(`동료 ${allyHelper}의 협공 지원! (+${allyBonus} 추가 위력)`);
      }
      await sendPvpTurnAction({ action: 'atk', dmg: dmg + allyBonus, weapon: wName, clubAtkMsg, allyHelper, allyBonus });
      return;
    }

    modalState.enemyHp = Math.max(0, modalState.enemyHp - dmg);
    sfx.attack();
    triggerBattleShake();
    const wObj = play.me.weapon || {};
    const effStatus = wObj.statusEffect || (wName.includes('바람총') || wName.includes('독') ? '중독' : (wKind === '날붙이' ? '출혈' : (wName !== '맨손' && wKind === '근접' ? '부상' : null)));
    const effChance = wObj.statusChance || (effStatus === '중독' ? 0.45 : (effStatus === '출혈' ? 0.35 : 0.25));
    if (wName !== '맨손' && effStatus && Math.random() < effChance) {
      if (effStatus === '중독') {
        modalState.enemyHp = Math.max(0, modalState.enemyHp - 1);
        appendModalBattleLog(`'${wName}'의 독기가 스며들어 ${modalState.enemyName}이(가) 중독되었다! (추가 피해 -1)`);
      } else if (effStatus === '출혈') {
        modalState.enemyHp = Math.max(0, modalState.enemyHp - 1);
        appendModalBattleLog(`'${wName}'의 공격으로 ${modalState.enemyName}에게 출혈이 발생했다! (추가 피해 -1)`);
      } else if (effStatus === '부상') {
        appendModalBattleLog(`'${wName}'의 묵직한 타격으로 ${modalState.enemyName}에게 부상 충격을 주었다!`);
      } else if (effStatus === '피로') {
        appendModalBattleLog(`'${wName}'의 충격으로 ${modalState.enemyName}이(가) 피로(경직) 상태에 빠졌다!`);
      }
    }
    appendModalBattleLog(`${c?.name || '실험체'}의 ${wName} 공격! ${modalState.enemyName}에게 ${dmg} 피해.${clubAtkMsg}`);
    renderModalBattleHp();

    if (modalState.enemyHp === 0) {
      const finHearts = getAffinity(modalState.enemyName);
      if (finHearts >= 4) {
        modalState.enemyHp = 1;
        const spareLine = getNpcScriptLine(modalState.enemyName, 9, '…너는 못 죽이겠다.');
        appendModalBattleLog(`${modalState.enemyName}이(가) 숨을 고르며 말한다: "${spareLine}"`);
        appendModalBattleLog(`차마 끝장을 낼 수 없어 공격을 멈췄다.`);
        renderModalBattleHp();
        await new Promise(r => setTimeout(r, 520));
        closeCenterModal();
        await appendGameLog(`[${fmtClock()}] ${modalState.enemyName}과의 교전 끝에서 서로를 죽이지 못하고 물러났다.`, true);
        refreshGameUI();
        return;
      }
      const deadEnRow = play.players.find(p => String(p.id) === String(modalState.targetId));
      if (deadEnRow) { deadEnRow.alive = false; deadEnRow.hp = 0; }
      await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', modalState.targetId);
      play.killCount = (play.killCount || 0) + 1;
      const killerName = c?.name || '실험체';
      const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
      const killNews = `[속보] ${modalState.enemyName}이(가) ${killerName}에게 살해당했습니다. (생존 ${remCnt}명)`;
      sfx.deathAlert();
      setMarqueeAlert(`${modalState.enemyName} 사망!! (생존 ${remCnt}명)`);
      await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
      await sb.from('room_messages').insert([{
        room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys',
        content: killNews
      }]);
      appendModalBattleLog(`${modalState.enemyName}이(가) 쓰러졌다!`);
      if (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0) {
        swapSoloEnemyTarget();
        modalState.enemyAllyFighter = null;
        modalState.turnIdx++;
        await advanceSpeedTurnsUntilMyTurn();
        return;
      }
      await new Promise(r => setTimeout(r, 420));
      openLootModal(modalState.enemyName);
      return;
    }
    modalState.turnIdx++;
    await advanceSpeedTurnsUntilMyTurn();
  } else if (cmd === 'def') {
    modalState.defending = true;
    appendModalBattleLog(`${c?.name || '실험체'}이(가) 방어 자세를 취했다.`);
    if (modalState.isPvp) {
      await sendPvpTurnAction({ action: 'def' });
      return;
    }
    modalState.turnIdx++;
    await advanceSpeedTurnsUntilMyTurn();
  } else if (cmd === 'persuade') {
    const perP = getBattlePersuadeProb(c, modalState.enemyName, modalState.isPvp);
    if (Math.random() < perP) {
      if (!modalState.isPvp) gainAffinityPoints(modalState.enemyName, 6);
      play.socialCount = (play.socialCount || 0) + 1;
      const line9 = modalState.isPvp ? '…알겠어, 더 이상 싸우지 말자.' : getNpcScriptLine(modalState.enemyName, 9, '…너는 못 죽이겠다.');
      appendModalBattleLog(`${modalState.enemyName}: "${line9}"`);
      appendModalBattleLog(`설득 성공! 교전을 멈췄다.`);
      if (modalState.isPvp) {
        await sendPvpTurnAction({ action: 'end_peace', reason: '설득으로 교전 종료' });
      }
      await new Promise(r => setTimeout(r, 420));
      closeCenterModal();
      await appendGameLog(`[${fmtClock()}] ${modalState.enemyName}을(를) 설득해 교전을 멈췄다.`);
      refreshGameUI();
      return;
    }
    appendModalBattleLog(`설득이 통하지 않았다.`);
    if (modalState.isPvp) {
      await sendPvpTurnAction({ action: 'persuade_fail' });
      return;
    }
    modalState.turnIdx++;
    await advanceSpeedTurnsUntilMyTurn();
  } else if (cmd === 'giveup') {
    const hadWeapon = play.me.weapon && play.me.weapon.name !== '맨손';
    const droppedName = hadWeapon ? play.me.weapon.name : null;
    if (hadWeapon) {
      const wIdx = play.me.weapon.uid
        ? play.me.bag.findIndex(it => it.uid === play.me.weapon.uid)
        : play.me.bag.findIndex(it => it.type === 'weapon' && it.name === droppedName);
      if (wIdx >= 0) play.me.bag.splice(wIdx, 1);
      const sBon = Math.floor(((c?.str || 1) - 1) * 0.5);
      play.me.weapon = { name: '맨손', baseAtk: 1, atk: 1 + sBon, kind: '근접', dura: null, maxDura: null, uid: null };
      appendModalBattleLog(`${c?.name || '실험체'}이(가) '${droppedName}'을(를) 내려놓고 저항을 포기했다...`);
    } else {
      appendModalBattleLog(`${c?.name || '실험체'}이(가) 두 손을 들고 저항을 포기했다...`);
    }
    const giveUpCause = `${modalState.enemyName} 앞에서 저항 포기`;
    play.deathReason = giveUpCause;
    appendModalBattleLog(`${modalState.enemyName}이(가) 망설임 없이 치명타를 가했다!`);
    if (modalState.isPvp) {
      await sendPvpTurnAction({ action: 'gave_up_dead', victimName: c?.name || '상대' });
    }
    await new Promise(r => setTimeout(r, 520));
    closeCenterModal();
    await handleMeDead(giveUpCause);
    return;
  } else if (cmd === 'flee') {
    const fleeP = getBattleFleeProb(c);
    if (Math.random() < fleeP) {
      sfx.flee();
      appendModalBattleLog(`도주에 성공했다!`);
      if (modalState.isPvp) {
        await sendPvpTurnAction({ action: 'end_peace', reason: `${c?.name || '상대'}이(가) 도주함` });
      }
      await new Promise(r => setTimeout(r, 380));
      closeCenterModal();
      await appendGameLog(`[${fmtClock()}] ${modalState.enemyName}에게서 도주했다.`);
      refreshGameUI();
      return;
    }
    appendModalBattleLog(`도주에 실패했다!`);
    if (modalState.isPvp) {
      await sendPvpTurnAction({ action: 'flee_fail' });
      return;
    }
    modalState.turnIdx++;
    await advanceSpeedTurnsUntilMyTurn();
  }
}

function openBattleItemPicker() {
  const picker = document.getElementById('mBatItemPicker');
  if (!picker) return;
  const usable = play.me.bag
    .map((it, idx) => ({ it, idx }))
    .filter(x => ['heal', 'food', 'smoke', 'repair', 'armor'].includes(x.it.type));

  if (!usable.length) {
    picker.style.display = 'block';
    picker.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;"><span>전투 중 사용할 수 있는 아이템이 없다.</span><button type="button" class="ref-mini-btn" onclick="closeBattleItemPicker()">닫기</button></div>`;
    return;
  }

  const btns = usable.map(({ it, idx }) => `
    <button type="button" class="modal-act-btn" style="text-align:left;padding:4px 7px;font-size:11px;display:flex;justify-content:space-between;" onclick="confirmUseBattleItem(${idx})">
      <span>${esc(it.name)} (${esc(getItemDesc(it) || it.type)})</span>
      <span>사용 ▶</span>
    </button>`).join('');

  picker.style.display = 'block';
  picker.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:bold;margin-bottom:4px;">
      <span>전투 중 사용할 아이템 선택</span>
      <button type="button" class="ref-mini-btn" onclick="closeBattleItemPicker()">취소</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;max-height:110px;overflow-y:auto;">
      ${btns}
    </div>`;
}

function closeBattleItemPicker() {
  const picker = document.getElementById('mBatItemPicker');
  if (picker) {
    picker.style.display = 'none';
    picker.innerHTML = '';
  }
}

async function confirmUseBattleItem(bagIdx) {
  closeBattleItemPicker();
  if (modalState.mode !== 'battle' || modalState.busy) return;
  const it = play.me.bag[bagIdx];
  if (!it) return;

  modalState.busy = true;
  const c = getPickedChar();
  const myName = c?.name || '실험체';

  if (modalState.isMultiBattle && modalState.battleId) {
    const clash = activeZoneClashes[modalState.battleId];
    if (!clash || clash.ended) {
      closeCenterModal();
      return;
    }
    renderMultiBattleUI();
    const mySide = modalState.mySide;
    const myTeam = mySide === 'A' ? clash.sideA : clash.sideB;
    const meFighter = myTeam.find(x => x.name === myName);

    if (it.type === 'smoke') {
      const sm = play.me.bag.splice(bagIdx, 1)[0];
      sfx.flee();
      advanceMultiTurnCursor(clash, myName);
      if (mySide === 'A') clash.sideA = clash.sideA.filter(x => x.name !== myName);
      else clash.sideB = clash.sideB.filter(x => x.name !== myName);
      clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
      const remainNames = [...clash.sideA, ...clash.sideB].map(x => x.name).join('·');
      if (!clash.sideA.some(x => x.hp > 0) || !clash.sideB.some(x => x.hp > 0)) clash.ended = true;
      const logText = `${myName}이(가) '${sm.name}'을(를) 터뜨려 연막 속으로 즉시 도주했다!`;
      const endSummary = clash.ended
        ? `【교전 종료】 ${myName}이(가) 연막탄으로 도주하면서 ${remainNames || modalState.enemyName}와의 싸움이 종료되었다.`
        : `【교전 이탈】 ${myName}이(가) 연막탄을 쓰고 싸움에서 도주했다.`;
      appendModalBattleLog(logText);
      await broadcastMultiBattleStep(clash, logText, endSummary);
      await new Promise(r => setTimeout(r, 380));
      closeCenterModal();
      await appendGameLog(`[${fmtClock()}] '${sm.name}'을(를) 사용해 교전에서 즉시 도주했다.`, true);
      return;
    }

    const usedName = it.name;
    await useBagItem(bagIdx);
    if (meFighter) meFighter.hp = play.me.hp;
    const logText = `${myName}이(가) '${usedName}'을(를) 사용했다. (HP ${play.me.hp}/${play.me.maxHp})`;
    appendModalBattleLog(logText);
    advanceMultiTurnCursor(clash, myName);
    renderMultiBattleUI();
    await broadcastMultiBattleStep(clash, logText);
    await runNpcTurnsIfHostInMultiBattle(clash);
    return;
  }

  renderModalBattleHp();
  if (it.type === 'smoke') {
    const sm = play.me.bag.splice(bagIdx, 1)[0];
    sfx.flee();
    appendModalBattleLog(`'${sm.name}'을(를) 터뜨려 자욱한 연기 속으로 즉시 도주했다!`);
    if (modalState.isPvp) {
      await sendPvpTurnAction({ action: 'end_peace', reason: `${myName}이(가) 연막탄으로 도주함` });
    }
    await new Promise(r => setTimeout(r, 380));
    closeCenterModal();
    await appendGameLog(`[${fmtClock()}] '${sm.name}'을(를) 사용해 ${modalState.enemyName}에게서 즉시 도주했다.`, true);
    refreshGameUI();
    return;
  }

  const usedName = it.name;
  await useBagItem(bagIdx);
  appendModalBattleLog(`'${usedName}'을(를) 사용해 컨디션을 회복했다.`);
  renderModalBattleHp();
  if (modalState.isPvp) {
    await sendPvpTurnAction({ action: 'item', myHp: play.me.hp });
    return;
  }
  modalState.turnIdx++;
  await advanceSpeedTurnsUntilMyTurn();
}

function openLootModal(enemyName) {
  modalState.mode = 'loot';
  modalState.busy = false;
  const st = getParticipantState(enemyName);
  modalState.lootItems = st.bag.length > 0
    ? st.bag.map(x => ensureItemUid({ ...x }))
    : [
        ensureItemUid({ ...LOOT_ITEMS[Math.floor(Math.random() * LOOT_ITEMS.length)] }),
        ensureItemUid({ ...LOOT_ITEMS[Math.floor(Math.random() * LOOT_ITEMS.length)] })
      ];
  if (!st.isHuman) st.bag = [];
  renderLootModal(enemyName);
}

function renderLootModal(enemyName) {
  const fmtLootTag = (it) => {
    const duraStr = (it.type === 'weapon' && it.dura != null) ? ` · 내구 ${it.dura}/${it.maxDura}` : '';
    const sub = it.desc ? ` (${it.desc}${duraStr && !it.desc.includes('내구') ? duraStr : ''})` : duraStr;
    return `${it.name}${sub}`;
  };
  const myHtml = play.me.bag.length
    ? play.me.bag.map((it, i) => `<div class="loot-slot" onclick="moveItemBagToLoot(${i})"><span>${esc(fmtLootTag(it))}</span><span>→</span></div>`).join('')
    : `<div style="font-size:11px;color:#555;">비어 있음</div>`;
  const enHtml = modalState.lootItems.length
    ? modalState.lootItems.map((it, i) => `<div class="loot-slot" onclick="takeLootItem(${i}, '${esc(enemyName)}')"><span>←</span><span>${esc(fmtLootTag(it))}</span></div>`).join('')
    : `<div style="font-size:11px;color:#555;">남은 물건 없음</div>`;

  openCenterModal(`
    <div class="modal-top-bar">전리품</div>
    <div class="loot-2col">
      <div class="loot-pane">
        <div style="font-size:12px;font-weight:bold;margin-bottom:6px;">내 가방 (${play.me.bag.length}/${play.me.maxBag})</div>
        ${myHtml}
      </div>
      <div class="loot-pane">
        <div style="font-size:12px;font-weight:bold;margin-bottom:6px;">${esc(enemyName)}의 소지품</div>
        ${enHtml}
      </div>
    </div>
    <button type="button" class="modal-act-btn" style="width:100%;" onclick="finishLootAndCheckWin('${esc(enemyName)}')">다 챙겼다 · 남을 배웅해 주며 떠난다</button>`);
}

function takeLootItem(idx, enemyName) {
  if (play.me.bag.length >= play.me.maxBag) return;
  const it = modalState.lootItems.splice(idx, 1)[0];
  if (it) {
    play.me.bag.push(ensureItemUid(it));
    play.itemGainCount = (play.itemGainCount || 0) + 1;
  }
  renderLootModal(enemyName);
}

function moveItemBagToLoot(idx) {
  const it = play.me.bag.splice(idx, 1)[0];
  if (it) {
    unequipWeaponIfRemoved(it);
    modalState.lootItems.push(it);
  }
  renderLootModal(modalState.enemyName);
}

async function finishLootAndCheckWin(enemyName) {
  if (modalState.lootItems.length > 0) {
    if (!zoneDroppedItems[play.me.zone]) zoneDroppedItems[play.me.zone] = [];
    zoneDroppedItems[play.me.zone].push(...modalState.lootItems);
    if (!play.isSolo && play.code) {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: 'SYS',
        zone: play.me.zone,
        msg_type: 'drop_sync',
        content: JSON.stringify({ actor: getPickedChar()?.name || '', zone: play.me.zone, items: modalState.lootItems })
      }]);
    }
    modalState.lootItems = [];
  }
  closeCenterModal();
  await appendGameLog(`[${fmtClock()}] ${enemyName}과의 교전을 마치고 전리품을 정리했다.`, true);
  const remainingAlive = play.players.filter(p => p.alive && String(p.id) !== String(modalState.targetId));
  if (remainingAlive.length === 1 && remainingAlive[0].id === play.pid) {
    await appendGameLog(`[${fmtClock()}] 【우승】 최후의 생존자 1위!`, true);
    await recordCharResult(1, true);
    await finishAndCleanupRoom('우승 종료');
    return;
  }
  refreshGameUI();
}

function editCurrentChar() {
  const c = getPickedChar();
  if (!c) return;
  editingCharId = c.id;
  draft.expNo = c.exp_number;
  draft.stats = {
    str: Math.min(6, Math.max(1, c.str || 1)),
    agi: Math.min(6, Math.max(1, c.agi || 1)),
    luk: Math.min(6, Math.max(1, c.luk || 1)),
    dex: Math.min(6, Math.max(1, c.dex || 1))
  };
  draft.avatar = c.avatar_data || null;
  const known = CLUB_DATA.some(x => x.name === c.club);
  draft.club = known ? c.club : '천문부';
  const nameIn = document.getElementById('creatorNameInput');
  const msgEl = document.getElementById('creatorMsg');
  if (nameIn) nameIn.value = c.name;
  if (msgEl) msgEl.textContent = '';
  drawCreatorClubs();
  renderCreator();
  showView('viewCreator');
}

function drawCreatorClubs() {
  const grid = document.getElementById('creatorClubGrid');
  if (!grid) return;
  grid.innerHTML = '';
  CLUB_DATA.forEach(cl => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'club-btn' + (draft.club === cl.name ? ' on' : '');
    b.textContent = cl.name;
    b.onclick = () => {
      draft.club = cl.name;
      drawCreatorClubs();
      renderCreator();
    };
    grid.appendChild(b);
  });
}

function usedExtraPts() {
  return (draft.stats.str - 1) + (draft.stats.agi - 1) + (draft.stats.luk - 1) + (draft.stats.dex - 1);
}

function adjStat(k, d) {
  const v = draft.stats[k] + d;
  if (v < 1 || v > 6) return;
  if (d > 0 && usedExtraPts() >= 8) return;
  draft.stats[k] = v;
  renderCreator();
}

function randomizeCreator() {
  draft.expNo = Math.floor(Math.random() * 89) + 11;
  draft.club = CLUB_DATA[Math.floor(Math.random() * CLUB_DATA.length)].name;
  draft.stats = { str: 1, agi: 1, luk: 1, dex: 1 };
  const keys = ['str', 'agi', 'luk', 'dex'];
  let rem = 8, guard = 0;
  while (rem > 0 && guard < 200) {
    guard++;
    const rk = keys[Math.floor(Math.random() * keys.length)];
    if (draft.stats[rk] < 6) { draft.stats[rk]++; rem--; }
  }
  drawCreatorClubs();
  renderCreator();
}

function onCreatorAvatar(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => { draft.avatar = fr.result; renderCreator(); };
  fr.readAsDataURL(f);
}

function renderCreator() {
  const name = document.getElementById('creatorNameInput').value.trim();
  const rem = 8 - usedExtraPts();
  document.getElementById('creatorExpNo').textContent = draft.expNo;
  document.getElementById('creatorRemPts').textContent = rem;

  const avBox = document.getElementById('creatorAvatarBox');
  avBox.innerHTML = draft.avatar ? `<img src="${draft.avatar}" alt="">` : '+';

  ['str', 'agi', 'luk', 'dex'].forEach(k => {
    const val = draft.stats[k];
    document.getElementById('cval-' + k).textContent = val;
    document.getElementById('btn-dec-' + k).disabled = val <= 1;
    document.getElementById('btn-inc-' + k).disabled = val >= 6 || rem <= 0;
    const pEl = document.getElementById('cpips-' + k);
    pEl.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
      const sp = document.createElement('span');
      sp.className = 'sq-pip' + (i <= val ? ' fill' : '');
      pEl.appendChild(sp);
    }
  });

  const found = CLUB_DATA.find(c => c.name === draft.club) || CLUB_DATA[4];
  document.getElementById('clogName').textContent = name || '???';
  document.getElementById('clogSub').textContent = `실험체-${draft.expNo} · ${found.name}`;
  document.getElementById('clogClubStory').textContent = found.story;
  document.getElementById('clogClubPerk').textContent = found.perk;

  const s = draft.stats;
  document.getElementById('clogStatLines').innerHTML = `
    <div>근력 ${s.str} — 무기 공격력 보정 +${Math.floor((s.str - 1) * 0.5)}</div>
    <div>민첩 ${s.agi} — 회피율 ${Math.min(45, (s.agi - 1) * 6)}%, 도주 및 선제 행동 보정</div>
    <div>운 ${s.luk} — 탐색 성공률 ${Math.min(95, 65 + (s.luk - 1) * 6)}%</div>
    <div>재주 ${s.dex} — 설득 및 교류 효율 보정</div>
  `;
}

async function saveCreator() {
  const msg = document.getElementById('creatorMsg');
  const name = document.getElementById('creatorNameInput').value.trim();
  if (!name) { msg.textContent = '이름을 입력하세요.'; return; }
  if (!editingCharId && charList.length >= 5) { msg.textContent = '최대 5명까지만 생성 가능합니다.'; return; }

  const payload = {
    user_id: acct.id, exp_number: draft.expNo, name, club: draft.club, custom_club_desc: null,
    str: draft.stats.str, agi: draft.stats.agi, luk: draft.stats.luk, dex: draft.stats.dex, avatar_data: draft.avatar
  };

  if (editingCharId) {
    const { error } = await sb.from('user_characters').update(payload).eq('id', editingCharId);
    if (error) { msg.textContent = error.message; return; }
    pickedCharId = editingCharId;
  } else {
    const { data, error } = await sb.from('user_characters').insert([payload]).select().single();
    if (error) { msg.textContent = error.message; return; }
    pickedCharId = data.id;
  }
  await reloadAcct();
  openDetailView(pickedCharId);
}

function openPickerView() {
  document.getElementById('pickerMsg').textContent = '';
  document.getElementById('pickerAcctInfo').textContent = acct ? `${acct.username} · ${charList.length}/5` : '';
  const list = document.getElementById('pickerCardList');
  list.innerHTML = '';

  charList.forEach(c => {
    const bestTxt = c.best_rank ? `${c.best_rank}위` : '-';
    const card = document.createElement('div');
    card.className = 'char-pick-card';
    card.onclick = () => openDetailView(c.id);
    const thumb = c.avatar_data ? `<img src="${c.avatar_data}" alt="">` : esc(c.name.slice(0, 1));
    card.innerHTML = `
      <div class="mini-portrait">${thumb}</div>
      <div>
        <div style="font-size:18px; font-weight:bold; color:#fff; margin-bottom:3px;">${esc(c.name)}</div>
        <div style="font-size:13px; color:#c7d6f5; margin-bottom:3px;">실험체-${c.exp_number} · ${esc(c.club)}</div>
        <div style="font-size:13px; color:#9ab4e6;">${c.plays || 0}회 · 1위 ${c.wins || 0} · 최고 ${bestTxt}</div>
      </div>`;
    list.appendChild(card);
  });

  if (charList.length < 5) {
    const addSlot = document.createElement('div');
    addSlot.className = 'dashed-add-slot';
    addSlot.textContent = '+ 새 캐릭터 만들기';
    addSlot.onclick = () => openNewCreator();
    list.appendChild(addSlot);
  }
  showView('viewPicker');
}

function getPickedChar() { return charList.find(c => c.id === pickedCharId) || null; }

function openDetailView(id) {
  pickedCharId = id;
  const c = getPickedChar();
  if (!c) return openPickerView();
  const idx = charList.findIndex(x => x.id === id) + 1;
  const pBox = document.getElementById('detailPortrait');
  pBox.innerHTML = c.avatar_data ? `<img src="${c.avatar_data}" alt="">` : esc(c.name.slice(0, 1));
  document.getElementById('detailName').textContent = c.name;
  document.getElementById('detailLine1').textContent = `실험체-${c.exp_number} · ${c.club} · 슬롯 ${idx}`;
  document.getElementById('detailStats').textContent = `근력 ${c.str} · 민첩 ${c.agi} · 운 ${c.luk} · 재주 ${c.dex}`;
  const bestTxt = c.best_rank ? `${c.best_rank}위` : '-';
  document.getElementById('detailRecordLine').textContent =
    (c.plays || 0) === 0 ? '첫 시뮬레이션을 앞두고 있다' : `${c.plays}회 · 1위 ${c.wins || 0} · 최고 ${bestTxt}`;
  document.getElementById('detailTitleVal').textContent = c.title || '없음';
  document.getElementById('detailAcctLine').textContent = `${acct.username} 계정으로 로그인됨`;
  document.getElementById('detailMsg').textContent = '';
  showView('viewDetail');
}

async function cycleTitle() {
  const c = getPickedChar();
  if (!c) return;
  const nextTitle = TITLES[(TITLES.indexOf(c.title || '없음') + 1) % TITLES.length];
  await sb.from('user_characters').update({ title: nextTitle }).eq('id', c.id);
  c.title = nextTitle;
  document.getElementById('detailTitleVal').textContent = nextTitle;
}

async function deleteCurrentChar() {
  const c = getPickedChar();
  if (!c) return;
  await sb.from('user_characters').delete().eq('id', c.id);
  await reloadAcct();
  charList.length > 0 ? openPickerView() : openNewCreator();
}

async function changePasswordPrompt() {
  const nextPw = prompt('새 비밀번호 (숫자 4자리)');
  if (!nextPw) return;
  if (!/^[0-9]{4}$/.test(nextPw)) { document.getElementById('detailMsg').textContent = '숫자 4자리만 가능합니다.'; return; }
  await sb.from('game_users').update({ password: nextPw }).eq('id', acct.id);
  acct.password = nextPw;
  document.getElementById('detailMsg').textContent = '비밀번호가 변경되었습니다.';
}

async function startWithCurrentChar() {
  document.getElementById('reportModal').classList.remove('open');
  play.finished = true;
  play.recordedFinish = false;
  if (play.tickTimer) { clearInterval(play.tickTimer); play.tickTimer = null; }
  if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
  const c = getPickedChar();
  if (!c) return;
  document.getElementById('lobbyCharBanner').textContent =
    `실험체-${c.exp_number} · ${c.name} (${c.club}) [${c.plays || 0}회 · 1위 ${c.wins || 0}]`;
  document.getElementById('lobbyMsg').textContent = '';
  document.getElementById('friendMsg').textContent = '';
  drawLobbyFriends();
  await refreshRooms();
  showView('viewLobby');
}

async function refreshRooms() {
  const box = document.getElementById('lobbyRoomList');
  const { data } = await sb.from('rooms')
    .select('*').eq('is_private', false).eq('status', 'waiting')
    .order('created_at', { ascending: false }).limit(20);
  if (!data || !data.length) {
    box.innerHTML = '<div style="text-align:center; color:#8eb8ff; padding-top:46px;">열린 방이 없습니다. 방을 만들어 보세요.</div>';
    return;
  }
  box.innerHTML = '';
  data.forEach(r => {
    const el = document.createElement('div');
    el.className = 'room-item';
    el.innerHTML = `<span><strong>${esc(r.title)}</strong> <span style="color:#8eb8ff;">${esc(r.code)}</span> · ${esc(r.host_name)} (최대 ${r.max_players || 4}인)</span><button class="btn-ivory" style="padding:4px 9px; font-size:12px;" onclick="enterCode('${esc(r.code)}')">입장</button>`;
    box.appendChild(el);
  });
}

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '#';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function insertMatchedNpcs(code, playerCount = 1) {
  const roster = buildNpcRosterForRoom(playerCount);
  await sb.from('room_players').insert(roster.map(n => ({
    room_code: code, name: n.name, exp_number: n.exp_number,
    club: n.club, is_npc: true, zone: n.zone, hp: 15, alive: true
  })));
  return roster.length;
}

async function createGameRoom() {
  const c = getPickedChar();
  const lMsg = document.getElementById('lobbyMsg');
  if (!c) { if (lMsg) lMsg.textContent = '캐릭터를 먼저 선택해 주세요.'; return; }
  const title = document.getElementById('roomTitleIn').value.trim() || `${c.name}의 방`;
  const isPriv = document.getElementById('roomPrivChk').checked;
  const maxCap = Math.max(2, Math.min(8, Number(document.getElementById('roomMaxCapIn').value) || 4));
  const code = genCode();
  if (lMsg) lMsg.textContent = '대기실을 생성하는 중...';

  const { error } = await sb.from('rooms').insert([{
    code, host_name: c.name, title, is_private: isPriv, max_players: maxCap, status: 'waiting', banned_zones: []
  }]);
  if (error) { if (lMsg) lMsg.textContent = `방 생성 오류: ${error.message}`; return; }

  await enterWaitRoom(code, true, c.name, title, maxCap, isPriv);
}

async function joinRoomCode() {
  let code = document.getElementById('roomCodeIn').value.trim().toUpperCase();
  if (!code) return;
  if (!code.startsWith('#')) code = '#' + code;
  await enterCode(code);
}

async function enterCode(code) {
  const c = getPickedChar();
  if (!c) return;
  const { data: r } = await sb.from('rooms').select('*').eq('code', code).maybeSingle();
  if (!r || r.status === 'finished') {
    document.getElementById('lobbyMsg').textContent = '종료되었거나 없는 방입니다.';
    return;
  }
  if (r.status !== 'waiting') {
    document.getElementById('lobbyMsg').textContent = '이미 게임 중인 방에는 입장할 수 없습니다.';
    return;
  }
  const { data: curMembers } = await sb.from('room_players').select('*').eq('room_code', r.code).eq('is_npc', false);
  if ((curMembers || []).length >= (r.max_players || 8)) {
    document.getElementById('lobbyMsg').textContent = '대기실 인원이 가득 찼습니다.';
    return;
  }
  const amIHost = (r.host_name === c.name && (curMembers || []).length === 0);
  await enterWaitRoom(r.code, amIHost, r.host_name, r.title, r.max_players || 4, r.is_private);
}

async function enterWaitRoom(code, isHost, hostName, title, maxPlayers, isPrivate) {
  const c = getPickedChar();
  if (!c) return;

  waitRoom.code = code;
  waitRoom.host = Boolean(isHost);
  waitRoom.hostName = hostName || (isHost ? c.name : '');
  waitRoom.title = title;
  waitRoom.maxPlayers = maxPlayers;
  waitRoom.isPrivate = isPrivate;
  waitRoom.spawnMode = 'school';
  waitRoom.ghostChat = 'ghost_only';
  waitRoom.ready = Boolean(isHost);
  waitRoom.members = [];

  if (c.avatar_data) {
    humanStateMap[c.name] = { ...(humanStateMap[c.name] || {}), avatar: c.avatar_data };
  }

  const { data: ins } = await sb.from('room_players').insert([{
    room_code: code,
    name: c.name,
    exp_number: c.exp_number,
    club: c.club,
    stats: {
      str: c.str, agi: c.agi, luk: c.luk, dex: c.dex,
      plays: c.plays || 0, wins: c.wins || 0, best_rank: c.best_rank || null,
      ready: Boolean(isHost),
      is_host: Boolean(isHost),
      avatar: c.avatar_data || null
    },
    is_npc: false,
    zone: 'old_school',
    hp: 15,
    alive: true
  }]).select().single();
  play.pid = ins ? ins.id : null;

  document.getElementById('waitChatLog').innerHTML = '';
  appendWaitChat('SYS', `대기실에 입장했습니다. 방 코드 ${code}를 공유해 실험체를 모집하세요.`);

  bindWaitRoomRealtime();
  await reloadWaitRoomMembers();
  renderWaitRoomUI();
  if (c.avatar_data) {
    await sb.from('room_messages').insert([{
      room_code: code, sender: c.name, zone: 'wait', msg_type: 'wait_avatar', content: c.avatar_data
    }]);
  }
  showView('viewWaitRoom');
}

function appendWaitChat(sender, text) {
  const box = document.getElementById('waitChatLog');
  if (!box) return;
  const d = document.createElement('div');
  d.style.marginBottom = '4px';
  d.style.color = sender === 'SYS' ? '#8eb8ff' : '#eae2ce';
  d.textContent = sender === 'SYS' ? `※ ${text}` : `${sender}: ${text}`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

async function postWaitChat() {
  const inp = document.getElementById('waitChatInput');
  const c = getPickedChar();
  if (!inp || !c || !waitRoom.code) return;
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  appendWaitChat(c.name, txt);
  await sb.from('room_messages').insert([{
    room_code: waitRoom.code, sender: c.name, zone: 'wait', msg_type: 'wait_chat', content: txt
  }]);
}

async function copyWaitRoomCode() {
  if (!waitRoom.code) return;
  try {
    await navigator.clipboard.writeText(waitRoom.code);
  } catch (e) {
    const tmp = document.createElement('input');
    tmp.value = waitRoom.code;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
  }
  appendWaitChat('SYS', `방 코드(${waitRoom.code})가 복사되었습니다.`);
}

async function setWaitOption(key, val) {
  if (!waitRoom.host || !waitRoom.code) return;
  waitRoom[key] = val;
  renderWaitRoomUI();
  await sb.from('room_messages').insert([{
    room_code: waitRoom.code,
    sender: 'SYS',
    zone: 'wait',
    msg_type: 'wait_opt',
    content: JSON.stringify({
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat
    })
  }]);
}

async function toggleWaitReady() {
  if (waitRoom.host || !play.pid) return;
  const c = getPickedChar();
  waitRoom.ready = !waitRoom.ready;
  await sb.from('room_players').update({
    stats: {
      str: c.str, agi: c.agi, luk: c.luk, dex: c.dex,
      plays: c.plays || 0, wins: c.wins || 0, best_rank: c.best_rank || null,
      ready: waitRoom.ready,
      is_host: false,
      avatar: c.avatar_data || null
    }
  }).eq('id', play.pid);
  await reloadWaitRoomMembers();
}

async function leaveWaitRoom() {
  if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
  if (play.pid) {
    await sb.from('room_players').delete().eq('id', play.pid);
    play.pid = null;
  }
  if (waitRoom.host && waitRoom.code) {
    await sb.from('room_messages').delete().eq('room_code', waitRoom.code);
    await sb.from('room_players').delete().eq('room_code', waitRoom.code);
    await sb.from('rooms').delete().eq('code', waitRoom.code);
  }
  waitRoom.code = null;
  await startWithCurrentChar();
}

async function reloadWaitRoomMembers() {
  if (!waitRoom.code) return;
  const { data } = await sb.from('room_players').select('*').eq('room_code', waitRoom.code).eq('is_npc', false).order('id', { ascending: true });
  waitRoom.members = data || [];
  const hostEntry = waitRoom.members.find(m => Boolean(m.stats?.is_host));
  if (hostEntry && !waitRoom.hostName) waitRoom.hostName = hostEntry.name;
  waitRoom.members.forEach(m => {
    const av = m.avatar_data || m.stats?.avatar;
    if (av) {
      humanStateMap[m.name] = { ...(humanStateMap[m.name] || {}), avatar: av };
    }
  });
  renderWaitRoomUI();
}

function isMemberHost(m) {
  if (!m) return false;
  if (Boolean(m.stats?.is_host)) return true;
  return Boolean(waitRoom.hostName && m.name === waitRoom.hostName);
}

function renderWaitRoomUI() {
  const banner = document.getElementById('waitRoomBanner');
  if (banner) {
    banner.textContent = `[${waitRoom.title}] · 방 코드 ${waitRoom.code} (${waitRoom.isPrivate ? '비공개' : '공개'} · 최대 ${waitRoom.maxPlayers}명)`;
  }

  const setOptBtn = (id, on) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('on', on);
    el.disabled = !waitRoom.host;
  };
  setOptBtn('optSpawnSchool', waitRoom.spawnMode === 'school');
  setOptBtn('optSpawnRandom', waitRoom.spawnMode === 'random');
  setOptBtn('optGhostOnly', waitRoom.ghostChat === 'ghost_only');
  setOptBtn('optGhostPublic', waitRoom.ghostChat === 'public_ghost');

  const grid = document.getElementById('waitSlotGrid');
  if (grid) {
    grid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const m = waitRoom.members[i];
      if (i >= waitRoom.maxPlayers) {
        grid.innerHTML += `<div class="wait-slot-closed">닫힌 자리</div>`;
        continue;
      }
      if (!m) {
        grid.innerHTML += `<div class="wait-slot-empty">+ 빈 자리<br><span style="font-size:10px;">참가자 대기 중</span></div>`;
        continue;
      }
      const st = m.stats || {};
      const avUrl = getParticipantAvatar(m.name);
      const avHtml = avUrl ? `<img src="${avUrl}" alt="" style="width:100%;height:100%;object-fit:cover;">` : esc(m.name.slice(0, 1));
      const isHostMember = isMemberHost(m);
      const isReady = isHostMember || Boolean(st.ready);
      const bestTxt = st.best_rank ? `${st.best_rank}위` : '-';
      const badgeHtml = isHostMember
        ? `<span class="wait-badge host">★ 방장</span>`
        : (isReady ? `<span class="wait-badge ready">준비완료</span>` : `<span class="wait-badge">대기중</span>`);
      grid.innerHTML += `
        <div class="wait-slot-card">
          <div class="wait-slot-av">${avHtml}</div>
          <div>
            <div style="font-size:12px;font-weight:bold;color:#fff;">${esc(m.name)}</div>
            <div style="font-size:10px;color:#c7d6f5;">실험체-${m.exp_number} · ${esc(m.club)}</div>
            <div style="font-size:10px;color:#9ab4e6;">근${st.str || 1} 민${st.agi || 1} 운${st.luk || 1} 재${st.dex || 1}</div>
            <div style="font-size:10px;color:#8eb8ff;">${st.plays || 0}회 · 1위 ${st.wins || 0} · 최고 ${bestTxt}</div>
            <div style="margin-top:3px;">${badgeHtml}</div>
          </div>
        </div>`;
    }
  }

  const subTxt = document.getElementById('waitStatusSub');
  const mainBtn = document.getElementById('waitMainActionBtn');
  const cnt = waitRoom.members.length;
  const guests = waitRoom.members.filter(m => !isMemberHost(m));
  const allGuestsReady = guests.length > 0 && guests.every(m => Boolean(m.stats?.ready));

  if (waitRoom.host) {
    if (subTxt) subTxt.textContent = `다른 실험체를 기다리는 중... (현재 ${cnt}명 / 최소 2명, 최대 ${waitRoom.maxPlayers}명)`;
    if (mainBtn) {
      mainBtn.textContent = allGuestsReady ? `시작하기 (${cnt}명)` : `시작하기 (전원 준비완료 필요)`;
      mainBtn.disabled = cnt < 2 || !allGuestsReady;
      mainBtn.onclick = () => hostStartWaitRoomMatch();
    }
  } else {
    if (subTxt) subTxt.textContent = `방장이 게임을 시작하기를 기다리는 중... (${cnt}/${waitRoom.maxPlayers}명)`;
    if (mainBtn) {
      mainBtn.textContent = waitRoom.ready ? '준비 취소' : '준비완료';
      mainBtn.disabled = false;
      mainBtn.onclick = () => toggleWaitReady();
    }
  }
}

function bindWaitRoomRealtime() {
  if (waitRoom.chan) sb.removeChannel(waitRoom.chan);
  waitRoom.chan = sb.channel('wait-' + waitRoom.code)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_code=eq.${waitRoom.code}` }, async () => {
      await reloadWaitRoomMembers();
      const myAv = getPickedChar()?.avatar_data;
      if (myAv && waitRoom.code) {
        await sb.from('room_messages').insert([{
          room_code: waitRoom.code, sender: getPickedChar().name, zone: 'wait', msg_type: 'wait_avatar', content: myAv
        }]);
      }
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${waitRoom.code}` }, p => {
      const msg = p.new;
      if (msg.msg_type === 'wait_chat' && msg.sender !== getPickedChar()?.name) {
        appendWaitChat(msg.sender, msg.content);
      } else if (msg.msg_type === 'wait_avatar' && msg.sender !== getPickedChar()?.name) {
        humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), avatar: msg.content };
        renderWaitRoomUI();
      } else if (msg.msg_type === 'wait_opt') {
        try {
          const parsed = JSON.parse(msg.content);
          waitRoom.spawnMode = parsed.spawnMode || 'school';
          waitRoom.ghostChat = parsed.ghostChat || 'ghost_only';
          renderWaitRoomUI();
        } catch (e) {}
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${waitRoom.code}` }, async p => {
      if (p.new.status === 'playing') {
        const c = getPickedChar();
        if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
        await launchPlay(waitRoom.code, waitRoom.host, c, null, false, {
          existingPid: play.pid,
          spawnMode: waitRoom.spawnMode,
          ghostChat: waitRoom.ghostChat
        });
      }
    })
    .subscribe();
}

async function hostStartWaitRoomMatch() {
  if (!waitRoom.host || !waitRoom.code) return;
  const mainBtn = document.getElementById('waitMainActionBtn');
  if (mainBtn) {
    mainBtn.disabled = true;
    mainBtn.textContent = '시뮬레이션 시작 중...';
  }
  try {
    const c = getPickedChar();
    const humanCnt = Math.max(1, waitRoom.members.length);
    const npcCnt = await insertMatchedNpcs(waitRoom.code, humanCnt);
    await sb.from('rooms').update({ status: 'playing' }).eq('code', waitRoom.code);
    if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
    await launchPlay(waitRoom.code, true, c, npcCnt, false, {
      existingPid: play.pid,
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat
    });
  } catch (err) {
    appendWaitChat('SYS', `시작 중 오류가 발생했습니다: ${err?.message || err}`);
    renderWaitRoomUI();
  }
}

async function startSoloMatch() {
  const c = getPickedChar();
  if (!c) return;
  const code = genCode();
  await sb.from('rooms').insert([{
    code, host_name: c.name, title: `${c.name} 솔로`, is_private: true, max_players: 1, status: 'playing', banned_zones: []
  }]);
  const npcCnt = await insertMatchedNpcs(code, 1);
  await launchPlay(code, true, c, npcCnt, true);
}

async function addFriendItem() {
  const fid = document.getElementById('friendIn').value.trim();
  const fMsg = document.getElementById('friendMsg');
  if (!fid || fid === acct.username) return;
  const { data: u } = await sb.from('game_users').select('username').eq('username', fid).maybeSingle();
  if (!u) { fMsg.textContent = '없는 아이디입니다.'; return; }
  const { error } = await sb.from('user_friends').insert([{ user_id: acct.id, friend_username: fid }]);
  if (error) { fMsg.textContent = '추가할 수 없습니다.'; return; }
  document.getElementById('friendIn').value = '';
  await reloadAcct();
  drawLobbyFriends();
}

async function delFriendItem(fid) {
  await sb.from('user_friends').delete().eq('user_id', acct.id).eq('friend_username', fid);
  await reloadAcct();
  drawLobbyFriends();
}

function drawLobbyFriends() {
  const box = document.getElementById('friendListEl');
  if (!box) return;
  if (!friendList.length) {
    box.innerHTML = '<div style="font-size:12px; color:#8eb8ff; text-align:center; padding:24px 0;">친구 없음</div>';
    return;
  }
  box.innerHTML = '';
  friendList.forEach(f => {
    const d = document.createElement('div');
    d.className = 'room-item';
    d.innerHTML = `<span>${esc(f.friend_username)}</span><button class="btn-navy" style="padding:3px 7px; font-size:11px;" onclick="delFriendItem('${esc(f.friend_username)}')">삭제</button>`;
    box.appendChild(d);
  });
}

function initNpcAlliances(players) {
  const npcs = players.filter(p => p.is_npc && p.alive).map(p => p.name);
  npcAlliances = [];
  plantedMines = [];
  zoneDroppedItems = {};
  npcStateMap = {};
  const preservedAvatars = {};
  Object.keys(humanStateMap).forEach(k => {
    if (humanStateMap[k]?.avatar) preservedAvatars[k] = { avatar: humanStateMap[k].avatar };
  });
  humanStateMap = preservedAvatars;
  pendingGroupMove = null;
  for (let i = 0; i + 1 < npcs.length; i += 6) {
    npcAlliances.push([npcs[i], npcs[i + 1]]);
  }
}

let lastStarterNames = { wep: '', food: '', util: '' };

function pickDistinctRandom(pool, prevName) {
  const filtered = pool.length > 1 ? pool.filter(x => x.name !== prevName) : pool;
  return ensureItemUid({ ...filtered[Math.floor(Math.random() * filtered.length)] });
}

function pickRandomStarterGear(c) {
  const rangedPool = STARTER_WEAPONS.filter(w => w.kind === '원거리');
  const wepPool = (c.club === '궁도부' && rangedPool.length) ? rangedPool : STARTER_WEAPONS;
  const starterWep = pickDistinctRandom(wepPool, lastStarterNames.wep);
  const starterFood = pickDistinctRandom(STARTER_FOODS, lastStarterNames.food);
  const starterUtil = pickDistinctRandom(STARTER_UTILITIES, lastStarterNames.util);
  lastStarterNames = { wep: starterWep.name, food: starterFood.name, util: starterUtil.name };
  return { starterWep, starterFood, starterUtil };
}

async function launchPlay(code, isHost, c, spawnNpcCount = null, isSolo = false, opts = {}) {
  closeCenterModal();
  document.getElementById('reportModal').classList.remove('open');
  closeAllyMenu();
  resetChatInputForNewMatch();
  isSpectatingNow = false;

  const spawnMode = opts.spawnMode || 'school';
  const startZone = spawnMode === 'random'
    ? ISLAND_ZONES[Math.floor(Math.random() * ISLAND_ZONES.length)].id
    : 'old_school';

  play.code = code;
  play.host = isHost;
  play.isSolo = Boolean(isSolo);
  play.speed = 1;
  play.status = 'playing';
  play.finished = false;
  play.paused = false;
  play.day = 1;
  play.minutes = 8 * 60;
  play.hourTickCarry = 0;
  play.closeSec = CLOSE_CYCLE_SEC;
  play.banned = [];
  play.nextBanned = [];
  play.spawnMode = spawnMode;
  play.showNpcChat = true;
  play.ghostChat = opts.ghostChat || 'ghost_only';
  play.actionKind = null;
  play.actionTargetZone = null;
  play.actionSec = 0;
  play.recordedFinish = false;
  play.deathReason = null;
  play.deathRank = null;
  play.nightSleepMinutes = 0;
  play.awakeHoursWithoutSleep = 0;
  play.sessionStartMs = Date.now();
  play.combatCount = 0;
  play.killCount = 0;
  play.searchCount = 0;
  play.itemGainCount = 0;
  play.itemUseCount = 0;
  play.moveCount = 0;
  play.socialCount = 0;
  play.allyCount = 0;
  watchOvernight = false;
  isSleepingNow = false;
  sleepHealCarry = 0;
  lastDayPhase = 'day';
  chatTabMode = 'zone';

  const npcTogBtn = document.getElementById('btnNpcLineToggle');
  if (npcTogBtn) {
    npcTogBtn.textContent = 'NPC 대사: ON';
    npcTogBtn.classList.add('on');
  }

  const { starterWep, starterFood, starterUtil } = pickRandomStarterGear(c);
  const startBag = [
    ensureItemUid({ ...starterWep, type: 'weapon' }),
    starterFood,
    starterUtil
  ];

  const strBonus = Math.floor(Math.max(0, (c.str || 1) - 1) * 0.5);
  play.me = {
    hp: 15, maxHp: 15,
    hunger: 100,
    zone: startZone,
    alive: true,
    condition: '양호',
    conditions: [],
    weapon: {
      name: starterWep.name,
      baseAtk: starterWep.atk,
      atk: starterWep.atk + strBonus,
      kind: starterWep.kind,
      dura: starterWep.dura,
      maxDura: starterWep.maxDura,
      uid: startBag[0].uid
    },
    bag: startBag,
    maxBag: 8,
    allies: [],
    selectedAlly: null,
    avatar: c.avatar_data || null
  };

  setGameSpeed(1);
  document.getElementById('refChatLog').innerHTML = '';
  document.getElementById('refGameLog').innerHTML = '';
  document.getElementById('refResultActionWrap').innerHTML = '';
  document.getElementById('refCodeInfo').innerHTML = `방 코드: <strong>${esc(code)}</strong> <button type="button" class="ref-mini-btn" onclick="copyRoomCode()" style="margin-left:3px;">복사</button> · ${play.isSolo ? '솔로 모드' : '멀티 모드 (같은 구역 채팅)'}`;

  if (opts.existingPid) {
    play.pid = opts.existingPid;
    await sb.from('room_players').update({
      zone: startZone,
      hp: 15,
      alive: true,
      stats: { str: c.str, agi: c.agi, luk: c.luk, dex: c.dex, avatar: c.avatar_data || null }
    }).eq('id', play.pid);
  } else {
    const { data: ins } = await sb.from('room_players').insert([{
      room_code: code, name: c.name, exp_number: c.exp_number, club: c.club,
      stats: { str: c.str, agi: c.agi, luk: c.luk, dex: c.dex, avatar: c.avatar_data || null },
      is_npc: false, zone: startZone, hp: 15, alive: true
    }]).select().single();
    play.pid = ins ? ins.id : null;
  }

  const { data: ps } = await sb.from('room_players').select('*').eq('room_code', code);
  play.players = ps || [];
  initNpcAlliances(play.players);

  const npcTotal = spawnNpcCount ?? play.players.filter(p => p.is_npc).length;
  const totalParticipants = play.players.length || (npcTotal + 1);
  const startZoneName = ISLAND_ZONES.find(z => z.id === startZone)?.name || '폐교';

  await appendGameLog(`[${fmtClock()}] 【방송】 시뮬레이션을 시작합니다. (3분 30초마다 2구역 폐쇄)`, true);
  await appendGameLog(`[${fmtClock()}] 섬에는 당신을 포함해 ${totalParticipants}명의 학생이 있다. (${startZoneName} 출발)`);
  await appendGameLog(`[${fmtClock()}] 무작위 지급품: '${starterWep.name}', '${starterFood.name}', '${starterUtil.name}'을(를) 챙겼다.`);
  await sb.from('room_messages').insert([{
    room_code: code, sender: 'SYS', zone: 'all', msg_type: 'sys',
    content: `${c.name} (${c.club}) 시뮬레이션 참가`
  }]);

  bindGameRealtime();
  await broadcastMyStateSync();
  setTimeout(() => { if (!play.finished) broadcastMyStateSync(); }, 1800);
  startGameLoops();
  refreshGameUI();
  showView('viewGame');
}

async function copyRoomCode() {
  if (!play.code) return;
  try {
    await navigator.clipboard.writeText(play.code);
    await appendGameLog(`[${fmtClock()}] 방 코드(${play.code})가 클립보드에 복사되었습니다.`, true);
  } catch (e) {
    const tmp = document.createElement('input');
    tmp.value = play.code;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    await appendGameLog(`[${fmtClock()}] 방 코드(${play.code})가 복사되었습니다.`, true);
  }
}

function setGameSpeed(rate) {
  if (!play.isSolo && rate !== 1) return;
  play.speed = rate;
}

function fmtClock() {
  const h = Math.floor((play.minutes % 1440) / 60);
  const m = Math.floor(play.minutes % 60);
  const period = (h >= 6 && h < 18) ? '낮' : '밤';
  return `${play.day}일차 ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} (${period})`;
}

function fmtCloseRemain() {
  const sec = Math.max(0, Math.ceil(play.closeSec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const leftZones = ISLAND_ZONES.length - play.banned.length;
  return `다음 폐쇄 ${String(m).padStart(2,'0')}분 ${String(s).padStart(2,'0')}초 (남은 구역 ${leftZones})`;
}

let marqueeAlertTimer = null;
function setMarqueeAlert(msg) {
  const box = document.getElementById('refMarqueeBox');
  const trk = document.getElementById('refMarqueeTrack');
  if (!box || !trk) return;
  box.classList.add('alert-mode');
  const unit = `★ ${msg} ★     `;
  const half = unit.repeat(4);
  trk.textContent = half + half;
  if (marqueeAlertTimer) clearTimeout(marqueeAlertTimer);
  marqueeAlertTimer = setTimeout(() => {
    box.classList.remove('alert-mode');
    const idleHalf = '■ 연인식 프로젝트 ■ 戀人式 ■ 연인식 프로젝트 ■ 戀人式 ';
    trk.textContent = idleHalf + idleHalf;
  }, 14000);
}

function triggerPhaseFlash(phase) {
  const el = document.getElementById('phaseFlash');
  if (!el) return;
  el.textContent = phase === 'night' ? '밤이 찾아왔다' : '아침이 밝았다';
  el.className = 'phase-flash ' + phase;
  setTimeout(() => { el.className = 'phase-flash'; }, 1100);
}

async function appendGameLog(text, isSys = false) {
  const box = document.getElementById('refGameLog');
  const d = document.createElement('div');
  d.style.color = isSys ? '#8eb8ff' : '#eae2ce';
  d.style.marginBottom = '3px';
  d.textContent = text;
  box.appendChild(d);
  while (box.children.length > 140) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

const PAIR_CHATTER_DATA = {"paired": [["후지모토 카이", "니시노 하루카", [["하루카, 손 떨리면 무리해서 앞장서지 마. 뒤는 내가 볼게.", "고마워 카이… 네가 옆에 있으니까 그나마 숨이 쉬어져."], ["주변 길목은 내가 먼저 살필게. 넌 내 바로 뒤만 따라와.", "응, 절대 떨어지지 않을게. 약속해."], ["오늘 밤엔 네가 먼저 눈 좀 붙여. 불침번은 내가 설 테니까.", "혼자 서면 피곤할 텐데… 중간에 꼭 교대해 줘."], ["검은 휘두르기보다 지키는 쪽이 훨씬 어렵다는 걸 여기서 새삼 느낀다.", "카이 넌 이미 충분히 잘 지켜 주고 있어."], ["폐쇄 경고 뜨면 망설이지 말고 바로 움직이자.", "알겠어, 카이가 신호 주면 바로 따라갈게."]]], ["아마미야 리코", "시라카와 레이", [["레이, 붕대 개수 또 줄었어. 남들 다 챙겨 주다간 우리 몫이 바닥나.", "피 흘리는 걸 뻔히 보면서 모른 척할 순 없잖아. 조금만 더 나눠 주자."], ["이 섬에서 착한 척하다간 제일 먼저 표적이 된다고.", "그래도 사람을 살리는 게 우리가 할 수 있는 최선이야."], ["하아… 진짜 너랑 있으면 내 계산이 자꾸 흔들린다니까.", "그만큼 리코도 마음이 쓰인다는 뜻이겠지."], ["해독제랑 소독약은 내 가방 안쪽에 따로 챙겨 뒀어.", "고마워. 위급할 때 바로 꺼낼 수 있게 정리해 두자."], ["다른 애들 교전 소식이 들릴 때마다 심장이 내려앉아.", "우리는 우리 페이스대로 버티자. 무리하지 말고."]]], ["미나모토 시즈카", "야마자키 토라", [["야, 시즈카. 넌 칼만 잡으면 눈빛이 왜 그렇게 무섭냐?", "쓸데없는 소리 말고 간격이나 맞춰. 덤빌 놈은 금방 와."], ["크하하, 좋지! 한 놈이라도 걸리면 제대로 붙어 보자고!", "흥분해서 빈틈 보이지 마. 한 번 엇나가면 끝이야."], ["밤이 되니까 시야가 확 좁아지는데, 교대하면서 쉬자고.", "그래. 잠을 세 시간은 채워야 내일 몸이 둔해지지 않아."], ["방금 저쪽 구석에서 그림자 움직인 거 봤냐?", "봤다. 섣불리 쫓지 말고 이쪽 유리한 자리부터 잡아."], ["둘이 붙어 다니면 웬만한 놈들은 쉽게 못 건드리겠지.", "방심할 때가 제일 위험해. 늘 칼끝을 세워 둬."]]], ["호시노 아카리", "유키무라 코토네", [["코토네… 오늘 밤은 유난히 어둡지 않아? 발소리 들리는 것 같아…", "아카리, 나도 무서워… 그래도 같이 있으니까 조금은 참을 만해."], ["잠은 3시간이라도 꼭 자야 해. 눈 감고 버텨 보자.", "응… 내가 옆에서 작은 소리라도 나면 바로 깨울게."], ["천문부 부실에서 별 보던 때로 돌아가고 싶다…", "끝까지 살아남으면 그때 꼭 다시 같이 밤하늘 보자."], ["누군가 다가오면 싸우기보단 먼저 조용히 피하자.", "그래, 무리해서 부딪힐 필요는 전혀 없어."], ["바람 소리만 들려도 가슴이 철렁 내려앉아…", "내 손 잡아. 혼자 있는 게 아니니까 괜찮아."]]], ["사이온지 루카", "오오토리 시온", [["루카, 지금 누구 편에 서는 게 제일 유리할까?", "아직은 아무도 믿지 마. 판이 좁혀질 때까지 패를 숨기는 게 나아."], ["역시 네 계산은 빠르네. 당분간은 같이 눈치나 보자.", "이용당하지만 않으면 절반은 성공이지."], ["남들이 서로 소모전을 벌일 때 우리는 물자만 챙기면 돼.", "동의해. 괜히 정면 승부에 힘 뺄 이유 없잖아?"], ["밤엔 괜히 돌아다니지 말고 체력이나 아껴 두자.", "그래, 피로 쌓이면 판단력만 흐려지니까."], ["저쪽 동맹들도 슬슬 움직이기 시작한 모양이야.", "동선 겹치기 전에 한 발 먼저 빠지자."]]], ["타치바나 히나타", "타카하시 료", [["히나타, 빵은 내 몫부터 챙겨 둬. 배고프면 눈이 돌아가니까.", "료, 혼자 독식하려다간 금방 고립돼. 조금씩 나눠야 오래 버텨."], ["…칫, 잔소리 듣는 건 질색인데 네 말이면 한 번쯤 들어주지.", "잘 생각했어. 빈속으로 싸우면 금방 지치잖아."], ["창고나 상점가 쪽에 먹을 게 더 남아 있을지도 몰라.", "그럼 다음 이동은 그쪽으로 잡자. 식량이 최우선이야."], ["요리부 부실에서 칼질하던 때가 그립네…", "지금은 살아남는 데 집중해. 감상 젖을 틈 없어."], ["혹시 허기 떨어졌으면 내 몫 조금 떼어 줄까?", "됐어, 내 건 내가 챙겨. 넌 네 컨디션이나 관리해."]]], ["카와구치 아유무", "시노자키 린", [["아유무, 다음 폐쇄 구역 예상 동선 나왔어?", "남은 구역 수를 기준으로 보면 이쪽은 곧 위험해져. 서둘러 옮기자."], ["규칙이 조여 오는 속도가 빨라졌어. 실수하지 말자.", "시간과 거리 계산만 정확하면 늦지 않아."], ["방송이 울릴 때마다 남은 인원수가 줄어드는 게 체감돼.", "동요하지 마. 우리가 통제할 수 있는 변수에만 집중하자."], ["밤 수면 시간도 계산에 넣어 둬야 해. 피로 패널티는 치명적이니까.", "맞아, 3시간 확보를 기준으로 교대 일정을 잡자."], ["다른 생존자들도 중앙 쪽으로 몰리고 있어.", "불필요한 교전은 피하고 외곽 안전지대부터 확보해."]]]], "zoneGeneric": [["오늘부터 같은 편이지. 내 뒤는 내가 볼게, 넌 네 앞만 봐.", "그래, 서로 발목 잡지 말고 끝까지 버텨 보자."], ["여긴 물자가 별로 없어 보이는데, 다른 쪽으로 넘어가 볼까?", "잠깐만 구석 더 훑어보고 움직이자. 붕대 하나라도 아쉬워."], ["발소리 죽여. 이 근처에 다른 사람 기척이 느껴져.", "알겠어, 숨 죽이고 상황부터 살피자."], ["이 구역은 폐쇄 타이머가 가까워지면 위험해져. 오래 끌지 말자.", "맞아, 시간 체크하면서 바로 빠져나갈 길 봐 둬."], ["밤이 오면 잠을 3시간은 채워야 내일 아침에 피로가 안 쌓여.", "그럼 한 명이 불침번 서면서 번갈아 눈 붙이자."], ["주변에 핏자국 같은 게 남아 있어… 방금 누가 싸웠나 봐.", "경계 늦추지 마. 아직 근처에 숨어 있을 수도 있어."], ["땅이 점점 좁아지니까 이제 숨을 곳도 얼마 안 남았어.", "남은 구역 줄어들수록 한 번의 선택이 판을 가르겠지."], ["표정이 안 좋은데… 허기 많이 떨어졌어? 먹을 거 챙겨 둬.", "고마워, 배고프면 판단력부터 흐려지니까 조심할게."], ["저쪽에 다른 사람들도 와 있는 것 같아. 섣불리 자극하지 말자.", "그래, 먼저 시비 걸지 않는 이상 굳이 부딪힐 필요 없어."], ["동아리 활동할 때랑은 완전히 다른 세계가 펼쳐졌네.", "그래도 여기서 무너질 순 없잖아. 끝까지 살아남자."]]};

async function pushDialogueToChat(speaker, text, opts = {}) {
  const zone = opts.zone || play.me.zone || 'zone';
  addChatMessage(speaker, text, opts.avatar || null, false, zone, true);
  if (opts.broadcast && !play.isSolo && play.code) {
    const myName = getPickedChar()?.name || '';
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: speaker,
      zone,
      msg_type: 'npc_say',
      content: JSON.stringify({ actor: myName, text })
    }]);
  }
}

function addChatMessage(sender, text, avatarData, isSys = false, zone = 'zone', isNpcLine = false) {
  const box = document.getElementById('refChatLog');
  if (!box) return;
  if (isSys) {
    const d = document.createElement('div');
    d.className = 'ref-chat-sys';
    d.dataset.zone = 'all';
    d.dataset.npc = '0';
    d.textContent = `※ ${text}`;
    d.style.display = '';
    box.appendChild(d);
    while (box.children.length > 120) box.removeChild(box.firstChild);
    box.scrollTop = box.scrollHeight;
    return;
  }

  const curZone = String(play.me.zone || '').trim();
  const rawZone = String(zone || '').trim();
  const effectiveZone = (!rawZone || rawZone === 'all' || rawZone === 'zone') ? curZone : rawZone;
  if (effectiveZone !== curZone) return;

  const nowStr = fmtClock().split(' ')[1] || '08:00';
  const zObj = ISLAND_ZONES.find(x => x.id === effectiveZone);
  const zoneBadge = zObj ? ` [${zObj.name}]` : '';
  const row = document.createElement('div');
  row.className = 'ref-chat-row';
  row.dataset.zone = effectiveZone;
  row.dataset.npc = isNpcLine ? '1' : '0';
  if (isNpcLine && !play.showNpcChat) row.style.display = 'none';

  const cleanName = sender.replace(/^\[사망\]\s*/, '').trim();
  const resolvedAvatar = avatarData || (!isNpcLine ? getParticipantAvatar(cleanName) : null);
  const avHtml = resolvedAvatar ? `<img src="${resolvedAvatar}" alt="">` : esc(cleanName.slice(0, 1));
  row.innerHTML = `
    <div class="ref-chat-av">${avHtml}</div>
    <div>
      <div class="ref-chat-meta">${esc(sender)}${esc(zoneBadge)} · ${nowStr}</div>
      <div class="ref-chat-bubble">${esc(text)}</div>
    </div>`;
  box.appendChild(row);
  while (box.children.length > 120) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

async function postRefChat() {
  const c = getPickedChar();
  if (play.finished || !c) return;
  if (!play.me.alive && !isSpectatingNow) return;
  const inp = document.getElementById('refChatInput');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  const z = String(play.me.zone || '').trim();
  const msgType = play.me.alive ? 'normal' : 'ghost';
  addChatMessage(play.me.alive ? c.name : `[사망] ${c.name}`, txt, play.me.avatar, false, z, false);
  await sb.from('room_messages').insert([{
    room_code: play.code, sender: c.name, zone: z, msg_type: msgType, content: txt
  }]);
}

async function applyHourlyConditions() {
  if (!play.me.alive || play.finished) return;
  const m = play.me;
  m.hunger = Math.max(0, Math.round(m.hunger - 1));
  if (m.hunger < 30) {
    if (addMyCondition('굶주림')) {
      await appendGameLog(`[${fmtClock()}] 허기가 30 미만으로 떨어져 '굶주림' 상태가 되었다.`, true);
    }
  } else {
    removeMyCondition('굶주림');
  }

  if (hasCondition('출혈') || hasCondition('중독')) {
    const activeDot = ['출혈', '중독'].filter(x => hasCondition(x)).join('·');
    m.hp = Math.max(0, m.hp - 1);
    await appendGameLog(`[${fmtClock()}] ${activeDot} 영향으로 HP -1`, true);
    if (play.pid) await sb.from('room_players').update({ hp: m.hp, alive: m.hp > 0 }).eq('id', play.pid);
    if (m.hp === 0) {
      play.deathReason = activeDot;
      await handleMeDead(activeDot);
    }
  } else if (m.hunger === 0) {
    m.hp = Math.max(0, m.hp - 2);
    await appendGameLog(`[${fmtClock()}] 극심한 허기로 HP -2`, true);
    if (play.pid) await sb.from('room_players').update({ hp: m.hp, alive: m.hp > 0 }).eq('id', play.pid);
    if (m.hp === 0) {
      play.deathReason = '아사';
      await handleMeDead('아사');
    }
  }

  await broadcastMyStateSync();

  for (const p of play.players.filter(x => x.is_npc && x.alive)) {
    const st = getNpcState(p.name);
    st.hunger = Math.max(0, st.hunger - 1);
    if (st.hunger < 35) {
      const fIdx = st.bag.findIndex(i => i.type === 'food');
      if (fIdx >= 0) {
        const eaten = st.bag.splice(fIdx, 1)[0];
        st.hunger = Math.min(100, st.hunger + (eaten.val || 25));
        if (play.me.allies.includes(p.name)) {
          await appendGameLog(`[${fmtClock()}] 동료 ${p.name}이(가) 소지하던 '${eaten.name}'을(를) 먹어 허기를 채웠다. (${st.hunger}/100)`, true);
        }
      }
    }
    if ((p.hp || 15) <= 9) {
      const hIdx = st.bag.findIndex(i => i.type === 'heal');
      if (hIdx >= 0) {
        const med = st.bag.splice(hIdx, 1)[0];
        p.hp = Math.min(15, (p.hp || 15) + (med.val || 3));
        st.hp = p.hp;
        await sb.from('room_players').update({ hp: p.hp }).eq('id', p.id);
        if (play.me.allies.includes(p.name)) {
          await appendGameLog(`[${fmtClock()}] 동료 ${p.name}이(가) '${med.name}'을(를) 사용해 상처를 치료했다. (HP ${p.hp}/15)`, true);
        }
      }
    }
  }
}

function startGameLoops() {
  if (play.tickTimer) clearInterval(play.tickTimer);
  let tickBusy = false;
  play.tickTimer = setInterval(async () => {
    if (play.paused || play.finished || tickBusy) return;
    tickBusy = true;
    try {
      const mult = play.isSolo ? play.speed : 1;
      const minDelta = GAME_MIN_PER_REAL_SEC * mult;
      play.minutes += minDelta;
      play.hourTickCarry += minDelta;
      while (play.minutes >= 1440) {
        play.minutes -= 1440;
        play.day++;
      }
      while (play.hourTickCarry >= 60) {
        play.hourTickCarry -= 60;
        await applyHourlyConditions();
        if (play.finished) return;
      }

      const h = Math.floor((play.minutes % 1440) / 60);
      const curPhase = (h >= 6 && h < 18) ? 'day' : 'night';

      if (isSleepingNow && play.me.alive) {
        if (curPhase === 'night') {
          play.nightSleepMinutes = Math.min(180, (play.nightSleepMinutes || 0) + minDelta);
        }
        sleepHealCarry += minDelta;
        if (sleepHealCarry >= 60) {
          sleepHealCarry -= 60;
          if (play.me.hp < play.me.maxHp) {
            play.me.hp = Math.min(play.me.maxHp, play.me.hp + 1);
            if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
          }
          if (play.nightSleepMinutes >= 180) {
            removeMyCondition('피로');
          }
          await broadcastMyStateSync();
        }
        const hasGuard = watchOvernight && play.me.allies.length > 0;
        const ambushProb = hasGuard ? 0.008 : 0.045;
        if (!modalState.mode && Math.random() < ambushProb) {
          const raiders = play.players.filter(p => p.is_npc && p.alive && !play.me.allies.includes(p.name));
          if (raiders.length > 0) {
            const raider = raiders[Math.floor(Math.random() * raiders.length)];
            isSleepingNow = false;
            if (hasGuard) {
              const guardName = play.me.allies[0];
              await appendGameLog(`[${fmtClock()}] 【기습 경보】 불침번 ${guardName}이(가) 접근하는 ${raider.name}을(를) 발견해 깨웠다! (회피 가능)`, true);
              modalState.watchSaved = true;
              startBattleModal(raider.id, { ambush: false });
            } else {
              await appendGameLog(`[${fmtClock()}] 【기습】 잠든 틈을 타 ${raider.name}이(가) 덮쳤다! (불침번 없음 · 회피 불가)`, true);
              startBattleModal(raider.id, { ambush: true });
            }
            return;
          }
        }
      }

      if (curPhase !== lastDayPhase) {
        const prevPhase = lastDayPhase;
        lastDayPhase = curPhase;
        triggerPhaseFlash(curPhase);
        bgm.setMode(curPhase);

        if (curPhase === 'night') {
          play.nightSleepMinutes = 0;
          await appendGameLog(`[${fmtClock()}] 밤이 찾아왔다. 아침이 오기 전까지 3시간 수면이 필요하다.`, true);
        } else if (curPhase === 'day' && prevPhase === 'night') {
          if (play.me.alive) {
            if (play.nightSleepMinutes < 180) {
              addMyCondition('피로');
              await appendGameLog(`[${fmtClock()}] 밤 수면 3시간을 채우지 못해 '피로' 상태가 되었다!`, true);
            } else {
              removeMyCondition('피로');
              await appendGameLog(`[${fmtClock()}] 밤 3시간 수면을 채워 '피로'가 풀렸다.`, true);
            }
            await broadcastMyStateSync();
          }
          watchOvernight = false;
          isSleepingNow = false;
          sleepHealCarry = 0;
          await appendGameLog(`[${fmtClock()}] 날이 밝았다.`, true);
        }
      }

      play.closeSec -= (play.isSolo ? play.speed : 1);

      if (play.host && !play.isSolo && Math.floor(play.closeSec) % 3 === 0) {
        sb.from('room_messages').insert([{
          room_code: play.code,
          sender: 'SYS',
          zone: 'all',
          msg_type: 'time_sync',
          content: JSON.stringify({
            day: play.day,
            minutes: play.minutes,
            closeSec: play.closeSec,
            nextBanned: play.nextBanned,
            banned: play.banned
          })
        }]);
      }

      if (play.host && play.closeSec <= CLOSE_WARN_SEC && play.nextBanned.length === 0) {
        const openAll = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
        if (openAll.length > CLOSE_PER_STEP) {
          const alivePlayerZones = new Set();
          if (play.me.alive && play.me.zone) alivePlayerZones.add(play.me.zone);
          if (!play.isSolo) {
            play.players.filter(p => !p.is_npc && p.alive && p.zone).forEach(p => alivePlayerZones.add(p.zone));
          }
          const isLatePressure = (play.day >= 3) || (openAll.length <= 10);
          const pickedIds = [];

          if (isLatePressure && alivePlayerZones.size > 0) {
            const pzArr = [...alivePlayerZones].filter(zid => !play.banned.includes(zid));
            if (pzArr.length > 0) {
              const targetPlayerZone = pzArr[Math.floor(Math.random() * pzArr.length)];
              if (openAll.filter(z => z.id !== targetPlayerZone).length >= CLOSE_PER_STEP) {
                pickedIds.push(targetPlayerZone);
              }
            }
          }

          const avoidPlayerPool = openAll.filter(z => !alivePlayerZones.has(z.id) && !pickedIds.includes(z.id)).sort(() => Math.random() - 0.5);
          const fallbackPool = openAll.filter(z => !pickedIds.includes(z.id) && !avoidPlayerPool.some(ap => ap.id === z.id)).sort(() => Math.random() - 0.5);
          const poolOrdered = [...avoidPlayerPool, ...fallbackPool];

          for (const z of poolOrdered) {
            if (pickedIds.length >= CLOSE_PER_STEP) break;
            pickedIds.push(z.id);
          }
          play.nextBanned = pickedIds;
          const warnNames = play.nextBanned.map(id => ISLAND_ZONES.find(z => z.id === id)?.name).filter(Boolean);
          if (warnNames.length) {
            const minLeft = Math.max(1, Math.ceil(play.closeSec / 60));
            const alertMsg = `${minLeft}분 뒤에 ${warnNames.join(', ')} 구역 폐쇄 예정!`;
            sfx.beep();
            setMarqueeAlert(alertMsg);
            await appendGameLog(`[${fmtClock()}] 【경고】 ${alertMsg}`, true);
            if (!play.isSolo) {
              await sb.from('room_messages').insert([{
                room_code: play.code,
                sender: 'SYS',
                zone: 'all',
                msg_type: 'close_warn',
                content: JSON.stringify({ nextBanned: play.nextBanned, alertMsg })
              }]);
            }
          }
        }
      }

      if (play.host && play.closeSec <= 0) {
        await triggerZoneClosure();
        play.closeSec = CLOSE_CYCLE_SEC;
      }

      if (play.me.alive && Math.floor(play.closeSec) % 30 === 0) {
        const sameZoneNpcs = play.players.filter(p => p.is_npc && p.alive && p.zone === play.me.zone);
        sameZoneNpcs.forEach(sn => gainAffinityPoints(sn.name, 1));
      }

      if (play.host) {
        const safe = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
        const allHumanAllies = new Set(play.me.allies || []);
        Object.values(humanStateMap || {}).forEach(hs => {
          if (hs && Array.isArray(hs.allies)) {
            hs.allies.forEach(an => allHumanAllies.add(an));
          }
        });
        const aliveNpcs = play.players.filter(p => p.is_npc && p.alive);
        const movableNpcs = aliveNpcs.filter(p => !allHumanAllies.has(p.name));
        const lateGame = safe.length <= 10;

        const npcMoveProb = play.day === 1 ? 0.14 : (lateGame ? 0.28 : 0.20);
        if (movableNpcs.length && safe.length > 0 && Math.random() < npcMoveProb) {
          const npc = movableNpcs[Math.floor(Math.random() * movableNpcs.length)];
          const occupiedSafe = safe.filter(z => aliveNpcs.some(o => o.id !== npc.id && o.zone === z.id));
          const joinRatio = play.day === 1 ? 0.25 : 0.48;
          const dest = (occupiedSafe.length > 0 && Math.random() < joinRatio)
            ? occupiedSafe[Math.floor(Math.random() * occupiedSafe.length)].id
            : (lateGame
                ? safe[Math.min(safe.length - 1, Math.floor(Math.random() * Math.max(1, Math.ceil(safe.length * 0.5))))].id
                : safe[Math.floor(Math.random() * safe.length)].id);

          const partnerName = getNpcAllyPairName(npc.name);
          const partner = (partnerName && !allHumanAllies.has(partnerName))
            ? play.players.find(p => p.name === partnerName && p.alive)
            : null;

          npc.zone = dest;
          await sb.from('room_players').update({ zone: dest }).eq('id', npc.id);
          if (partner) {
            partner.zone = dest;
            await sb.from('room_players').update({ zone: dest }).eq('id', partner.id);
          }

          const st = getNpcState(npc.name);
          if (st.bag.length < 6 && Math.random() < 0.45) {
            const foundItem = pickZoneLootItem(dest);
            st.bag.push(foundItem);
            if (play.me.allies.includes(npc.name)) {
              await appendGameLog(`[${fmtClock()}] 동료 ${npc.name}이(가) 주변을 살펴 '${foundItem.name}'을(를) 챙겼다.`, true);
            }
          }

          if (dest === play.me.zone && play.me.alive) {
            gainAffinityPoints(npc.name, 2);
            if (partner) gainAffinityPoints(partner.name, 2);
          }
        }

        const randomClashProb = play.day === 1
          ? 0.011
          : (lateGame ? 0.095 : Math.min(0.062, 0.020 + (play.day - 2) * 0.012));
        if (aliveNpcs.length >= 2 && Math.random() < randomClashProb) {
          const clashCandidates = aliveNpcs.filter(atk => {
            const pName = getNpcAllyPairName(atk.name);
            return play.players.some(v => v.alive && v.zone === atk.zone && v.id !== atk.id && v.name !== pName);
          });
          const attacker = clashCandidates.length > 0
            ? clashCandidates[Math.floor(Math.random() * clashCandidates.length)]
            : aliveNpcs[Math.floor(Math.random() * aliveNpcs.length)];
          const partnerName = getNpcAllyPairName(attacker.name);
          const coPresent = play.players.filter(p => p.alive && p.zone === attacker.zone && p.id !== attacker.id && p.name !== partnerName);

          if (coPresent.length > 0) {
            const victim = coPresent[Math.floor(Math.random() * coPresent.length)];
            const partner = partnerName ? play.players.find(p => p.name === partnerName && p.alive) : null;
            const factionTag = partner ? `[${attacker.name}·${partner.name} 동맹]` : attacker.name;

            if (victim.is_npc) {
              const lethalProb = play.day === 1 ? 0.06 : (lateGame ? 0.34 : Math.min(0.24, 0.14 + (play.day - 2) * 0.03));
              const lethalStrike = Math.random() < lethalProb;
              const dmg = lethalStrike ? (victim.hp || 15) : (4 + Math.floor(Math.random() * 4));
              const nextHp = Math.max(0, (victim.hp || 15) - dmg);
              victim.hp = nextHp;

              if (nextHp === 0) {
                victim.alive = false;
                await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', victim.id);
                const vBag = getNpcState(victim.name).bag || [];
                if (vBag.length > 0) {
                  if (!zoneDroppedItems[victim.zone]) zoneDroppedItems[victim.zone] = [];
                  zoneDroppedItems[victim.zone].push(...vBag);
                  getNpcState(victim.name).bag = [];
                }
                const remCnt = Math.max(1, play.players.filter(p => p.alive).length + (play.me.alive ? 0 : 1));
                const news = `[속보] ${victim.name}이(가) ${factionTag}에게 살해당했습니다. (생존 ${remCnt}명)`;
                sfx.deathAlert();
                setMarqueeAlert(`${victim.name} 사망!! (생존 ${remCnt}명)`);
                await appendGameLog(`[${fmtClock()}] ${news}`, true);
                await sb.from('room_messages').insert([{
                  room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: news
                }]);
              } else {
                await sb.from('room_players').update({ hp: nextHp }).eq('id', victim.id);
                if (play.me.alive && !isSleepingNow && !modalState.mode && victim.zone === play.me.zone) {
                  const clashId = `npc_clash_${Date.now()}_${Math.floor(Math.random() * 999)}`;
                  const sideA = [makeCombatantFromPlayerRow(victim, 'A')];
                  const vPairName = getNpcAllyPairName(victim.name);
                  const vPairRow = vPairName ? play.players.find(p => p.name === vPairName && p.alive && p.zone === play.me.zone) : null;
                  if (vPairRow) sideA.push(makeCombatantFromPlayerRow(vPairRow, 'A'));

                  const sideB = [makeCombatantFromPlayerRow(attacker, 'B')];
                  if (partner && partner.zone === play.me.zone) sideB.push(makeCombatantFromPlayerRow(partner, 'B'));

                  const initQ = rebuildMultiTurnQueue(sideA, sideB);
                  const clashObj = {
                    battleId: clashId,
                    zone: play.me.zone,
                    controllerName: getPickedChar()?.name || 'SYS',
                    sideA,
                    sideB,
                    turnQueue: initQ,
                    turnIdx: 0,
                    activeActorName: initQ[0]?.name || null,
                    seq: 0,
                    ended: false
                  };
                  await reportZoneClashToLog(clashObj);
                  if (!play.isSolo && play.code) {
                    await sb.from('room_messages').insert([{
                      room_code: play.code,
                      sender: 'SYS',
                      zone: play.me.zone,
                      msg_type: 'p2p_evt',
                      content: JSON.stringify({
                        kind: 'clash_start',
                        battleId: clashId,
                        zone: play.me.zone,
                        controllerName: clashObj.controllerName,
                        sideA: clashObj.sideA,
                        sideB: clashObj.sideB,
                        turnIdx: 0,
                        activeActorName: clashObj.activeActorName
                      })
                    }]);
                  }
                }
              }
            } else if (victim.id === play.pid && play.me.alive && !isSleepingNow && !modalState.mode && Math.random() < (play.day === 1 ? 0.14 : 0.35)) {
              openEncounterModal(attacker.id, partner ? `${attacker.name}·${partner.name} 동맹` : '');
            }
          }
        }
      }

      const npcAllianceProb = play.day >= 3 ? (play.day >= 5 ? 0.08 : 0.03) : 0.004;
      if (play.host && Math.random() < npcAllianceProb) {
        const soloNpcs = play.players.filter(p => p.is_npc && p.alive && !getNpcAllyPairName(p.name) && !play.me.allies.includes(p.name));
        if (soloNpcs.length >= 2) {
          const a = soloNpcs[Math.floor(Math.random() * soloNpcs.length)];
          const sameZoneB = soloNpcs.find(b => b.id !== a.id && b.zone === a.zone);
          if (sameZoneB) {
            npcAlliances.push([a.name, sameZoneB.name]);
            if (a.zone === play.me.zone) {
              const zName = ISLAND_ZONES.find(z => z.id === a.zone)?.name || '';
              addChatMessage('SYS', `${zName}에서 ${a.name}과(와) ${sameZoneB.name}이(가) 동맹을 맺었습니다.`, null, true, a.zone);
            }
          }
        }
      }

      if (play.me.alive && !isSleepingNow && !modalState.mode && Math.random() < (1 / 240)) {
        const hereNpcs = play.players.filter(p => p.is_npc && p.alive && p.zone === play.me.zone);
        if (hereNpcs.length >= 2 && Math.random() < 0.55) {
          const n1 = hereNpcs[Math.floor(Math.random() * hereNpcs.length)];
          const others = hereNpcs.filter(x => x.id !== n1.id);
          const n2 = others[Math.floor(Math.random() * others.length)];
          const pairEntry = PAIR_CHATTER_DATA.paired.find(([a, b]) =>
            (a === n1.name && b === n2.name) || (a === n2.name && b === n1.name)
          );
          if (pairEntry) {
            const [pa, pb, convs] = pairEntry;
            const pairLines = convs[Math.floor(Math.random() * convs.length)];
            await pushDialogueToChat(pa, pairLines[0], { zone: play.me.zone, broadcast: true });
            setTimeout(async () => {
              if (!play.finished && play.me.alive && play.me.zone === n1.zone) {
                await pushDialogueToChat(pb, pairLines[1], { zone: play.me.zone, broadcast: true });
              }
            }, 950);
          } else {
            const gLines = PAIR_CHATTER_DATA.zoneGeneric[Math.floor(Math.random() * PAIR_CHATTER_DATA.zoneGeneric.length)];
            await pushDialogueToChat(n1.name, gLines[0], { zone: play.me.zone, broadcast: true });
            setTimeout(async () => {
              if (!play.finished && play.me.alive && play.me.zone === n1.zone) {
                await pushDialogueToChat(n2.name, gLines[1], { zone: play.me.zone, broadcast: true });
              }
            }, 950);
          }
        } else if (hereNpcs.length > 0) {
          const speaker = hereNpcs[Math.floor(Math.random() * hereNpcs.length)];
          const pts = getAffinityPoints(speaker.name);
          const hearts = getAffinity(speaker.name);
          let idx = 0;
          if (curPhase === 'night') idx = 3;
          else if (pts >= 65) idx = 7;
          else if (pts >= 35) idx = 5;
          else idx = Math.floor(Math.random() * 3);
          const say = getNpcScriptLine(speaker.name, idx, speaker.line || '…');
          await pushDialogueToChat(`${speaker.name} (${renderHearts(hearts)})`, say, { zone: play.me.zone, broadcast: true });
        }
      }

      const aliveNowForProvoke = Math.max(1, play.players.filter(p => p.alive).length + (play.me.alive ? 0 : 1));
      const lateSparseBoost = aliveNowForProvoke <= 14 ? 0.025 : 0;
      const dayScale = play.day >= 2 ? Math.min(0.065, 0.008 + (play.day - 2) * 0.015 + lateSparseBoost) : 0;
      if (play.day >= 2 && play.me.alive && !isSleepingNow && !modalState.mode && Math.random() < dayScale) {
        const bullies = play.players.filter(p => p.is_npc && p.alive && p.zone === play.me.zone && !play.me.allies.includes(p.name));
        if (bullies.length > 0) {
          const bNpc = bullies[Math.floor(Math.random() * bullies.length)];
          openProvokeModal(bNpc.id);
        }
      }

      refreshGameUI();
      drawIslandMap();
    } finally {
      tickBusy = false;
    }
  }, 1000);
}

async function triggerZoneClosure() {
  const open = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
  if (open.length <= 2) return;

  const toClose = play.nextBanned.length
    ? play.nextBanned.filter(id => !play.banned.includes(id))
    : [...open].sort(() => Math.random() - 0.5).slice(0, CLOSE_PER_STEP).map(z => z.id);

  const maxClosable = Math.max(0, open.length - 2);
  const added = toClose.slice(0, Math.min(CLOSE_PER_STEP, maxClosable));
  play.banned = [...play.banned, ...added];
  play.nextBanned = [];

  const names = added.map(id => (ISLAND_ZONES.find(z => z.id === id) || {}).name).filter(Boolean);
  if (names.length) {
    sfx.beep();
    await appendGameLog(`[${fmtClock()}] 【폐쇄】 ${names.join(', ')} 구역이 폐쇄되었습니다!`, true);

    if (play.host) {
      await sb.from('rooms').update({ banned_zones: play.banned }).eq('code', play.code);
      await sb.from('room_messages').insert([{
        room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys',
        content: `[폐쇄] ${names.join(', ')} 구역 폐쇄`
      }]);
    }

    const movingIntoClosed = play.actionKind === 'move' && play.actionTargetZone && added.includes(play.actionTargetZone);
    if (play.me.alive && (added.includes(play.me.zone) || movingIntoClosed)) {
      if (play.actionTimer) { clearInterval(play.actionTimer); play.actionTimer = null; }
      play.actionKind = null;
      play.actionTargetZone = null;
      play.actionSec = 0;
      const closeCause = movingIntoClosed ? '폐쇄 구역 진입 폭발' : '폐쇄 구역 폭발';
      play.deathReason = closeCause;
      sfx.hurt();
      sfx.death();
      await appendGameLog(`[${fmtClock()}] 【폭발】 폐쇄된 구역에 남아 폭발에 휘말렸습니다!`, true);
      await handleMeDead(closeCause);
      return;
    }
  }
}

function drawIslandMap() {
  const cv = document.getElementById('islandCanvas');
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  const cssW = cv.clientWidth || 460;
  const cssH = cv.clientHeight || 254;
  if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) {
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
  }

  const cx = cv.getContext('2d');
  cx.save();
  cx.scale(dpr, dpr);
  cx.imageSmoothingEnabled = false;

  const sx = cssW / 460;
  const sy = cssH / 244;
  const sMin = Math.min(sx, sy);

  const curH = Math.floor((play.minutes % 1440) / 60);
  const isNight = !(curH >= 6 && curH < 18);

  cx.fillStyle = isNight ? '#eae2ce' : '#121a2e';
  cx.fillRect(0, 0, cssW, cssH);

  cx.fillStyle = '#5c78ad';
  cx.font = '11px DungGeunMo, monospace';
  cx.textAlign = 'left';
  cx.fillText('~~~', 24 * sx, 226 * sy);
  cx.fillText('~~', 416 * sx, 34 * sy);
  cx.fillText('▲N', 426 * sx, 20 * sy);

  cx.fillStyle = isNight ? '#182036' : '#eae2ce';
  cx.beginPath();
  cx.ellipse(230 * sx, 132 * sy, 182 * sx, 88 * sy, -0.03, 0, Math.PI * 2);
  cx.fill();
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    cx.beginPath();
    cx.arc((230 + Math.cos(a) * 170) * sx, (132 + Math.sin(a) * 78) * sy, 23 * sMin, 0, Math.PI * 2);
    cx.fill();
  }

  cx.strokeStyle = '#9c937f';
  cx.lineWidth = 1.2;
  [[152, 82], [166, 86], [88, 134]].forEach(([mx, my]) => {
    cx.beginPath();
    cx.moveTo((mx - 7) * sx, (my + 6) * sy);
    cx.lineTo(mx * sx, (my - 4) * sy);
    cx.lineTo((mx + 7) * sx, (my + 6) * sy);
    cx.stroke();
  });

  cx.fillStyle = '#c8c0ad';
  cx.beginPath();
  cx.ellipse(222 * sx, 174 * sy, 22 * sx, 8 * sy, 0, 0, Math.PI * 2);
  cx.fill();

  cx.strokeStyle = '#6f695c';
  cx.lineWidth = 1.1;
  cx.setLineDash([2.5, 3]);
  const drawn = new Set();
  ISLAND_ZONES.forEach(z => {
    (z.edges || []).forEach(tid => {
      const target = ISLAND_ZONES.find(x => x.id === tid);
      if (!target) return;
      const key = [z.id, target.id].sort().join('--');
      if (drawn.has(key)) return;
      drawn.add(key);
      cx.beginPath();
      cx.moveTo(z.x * sx, z.y * sy);
      cx.lineTo(target.x * sx, target.y * sy);
      cx.stroke();
    });
  });
  cx.setLineDash([]);

  ISLAND_ZONES.forEach(z => {
    const zx = z.x * sx, zy = z.y * sy, rad = 15 * sMin;
    if (play.nextBanned.includes(z.id) && !play.banned.includes(z.id)) {
      cx.save();
      cx.strokeStyle = '#141c30';
      cx.lineWidth = 1.6;
      cx.setLineDash([3, 3]);
      cx.beginPath();
      cx.arc(zx, zy, rad, 0, Math.PI * 2);
      cx.stroke();
      cx.restore();
    }
    if (play.banned.includes(z.id)) {
      cx.save();
      cx.beginPath();
      cx.arc(zx, zy, rad, 0, Math.PI * 2);
      cx.fillStyle = '#2d3861';
      cx.fill();
      cx.clip();
      cx.strokeStyle = '#eae2ce';
      cx.lineWidth = 1.5;
      for (let d = -24; d <= 24; d += 5) {
        cx.beginPath();
        cx.moveTo(zx - rad + d, zy - rad);
        cx.lineTo(zx - rad + d + rad * 1.4, zy + rad);
        cx.stroke();
      }
      cx.restore();
    }
  });

  ISLAND_ZONES.forEach(z => {
    const zx = z.x * sx, zy = z.y * sy;
    const isMe = play.me.zone === z.id;
    const isBan = play.banned.includes(z.id);

    cx.fillStyle = isMe ? (isNight ? '#8eb8ff' : '#1d4ed8') : (isBan ? '#526a9c' : (isNight ? '#eae2ce' : '#141c30'));
    cx.fillRect(zx - 3.5, zy - 3.5, 7, 7);

    cx.font = '11px DungGeunMo, monospace';
    cx.textAlign = 'center';
    const labelY = zy + 13 * sy;
    cx.strokeStyle = isNight ? '#141c30' : '#eae2ce';
    cx.lineWidth = 2.5;
    cx.strokeText(z.name, zx, labelY);
    cx.fillStyle = isBan ? '#7d95c7' : (isNight ? '#eae2ce' : '#141c30');
    cx.fillText(z.name, zx, labelY);

    if (isMe) {
      cx.fillStyle = isNight ? '#8eb8ff' : '#141c30';
      cx.fillText('▼ 나', zx, zy - 7 * sy);
    }
  });

  cx.restore();
}

function cancelCurrentAction() {
  if (play.actionTimer) {
    clearInterval(play.actionTimer);
    play.actionTimer = null;
  }
  play.actionKind = null;
  play.actionTargetZone = null;
  play.actionSec = 0;
  appendGameLog(`[${fmtClock()}] 현재 행동을 취소했다.`, true);
  refreshGameUI();
}

async function startMoveToZone(nearest, skipGroupCheck = false) {
  if (!nearest || nearest.id === play.me.zone) return;
  if (!play.me.alive || play.finished || play.actionSec > 0 || play.paused || isSleepingNow) return;
  if (play.banned.includes(nearest.id)) return;

  const humanAllies = (play.me.allies || []).filter(aName => isHumanPlayerName(aName));
  if (!skipGroupCheck && humanAllies.length > 0) {
    const c = getPickedChar();
    const sleepingAlly = humanAllies.find(aName => humanStateMap[aName]?.sleeping);
    if (sleepingAlly) {
      await appendGameLog(`[${fmtClock()}] 동료 ${sleepingAlly}님이 수면 중이라 함께 이동할 수 없습니다. (먼저 깨우거나 동맹 해제 필요)`, true);
      return;
    }
    const diffZoneAlly = humanAllies.find(aName => {
      const pRow = play.players.find(p => p.name === aName && p.alive);
      return pRow && pRow.zone !== play.me.zone;
    });
    if (diffZoneAlly) {
      await appendGameLog(`[${fmtClock()}] 동료 ${diffZoneAlly}님이 다른 구역에 있어 동행할 수 없습니다.`, true);
      return;
    }

    pendingGroupMove = {
      destId: nearest.id,
      destName: nearest.name,
      pendingFrom: [...humanAllies]
    };

    for (const aName of humanAllies) {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: c?.name || '유저',
        zone: play.me.zone,
        msg_type: 'p2p_evt',
        content: JSON.stringify({ kind: 'move_req', to: aName, destId: nearest.id, destName: nearest.name })
      }]);
    }
    await appendGameLog(`[${fmtClock()}] 동료(${humanAllies.join(', ')})에게 '${nearest.name}' 구역 동행 이동을 요청했습니다. 응답 대기 중...`, true);
    return;
  }

  const secs = calcMoveSeconds(play.me.zone, nearest.id);
  play.actionKind = 'move';
  play.actionTargetZone = nearest.id;
  play.actionSec = secs;
  await appendGameLog(`[${fmtClock()}] ${nearest.name}(으)로 이동을 시작했다. (${secs}초 소요)`);
  refreshGameUI();

  if (play.actionTimer) clearInterval(play.actionTimer);
  play.actionTimer = setInterval(async () => {
    if (play.paused || play.finished) return;
    play.actionSec--;
    refreshGameUI();

    if (play.actionSec <= 0) {
      clearInterval(play.actionTimer);
      play.actionTimer = null;
      const destId = play.actionTargetZone;
      play.actionKind = null;
      play.actionTargetZone = null;
      play.actionSec = 0;

      if (play.banned.includes(destId)) {
        const entryCloseCause = '폐쇄 구역 진입 폭발';
        play.deathReason = entryCloseCause;
        sfx.hurt();
        sfx.death();
        await appendGameLog(`[${fmtClock()}] 【폭발】 이동 중 폐쇄된 구역에 진입해 폭발에 휘말렸습니다!`, true);
        await handleMeDead(entryCloseCause);
        return;
      }

      const c = getPickedChar();
      const agi = c ? (c.agi || 1) : 1;
      const hungerLoss = Math.max(1, 2 - Math.floor(agi / 3));
      const prevZoneId = play.me.zone;
      play.me.zone = destId;
      play.moveCount = (play.moveCount || 0) + 1;
      play.me.hunger = Math.max(0, play.me.hunger - hungerLoss);
      if (play.me.hunger < 30) addMyCondition('굶주림');
      else removeMyCondition('굶주림');

      for (const aName of (play.me.allies || [])) {
        const npcAllyRow = play.players.find(p => p.name === aName && p.alive && p.is_npc);
        if (npcAllyRow) {
          npcAllyRow.zone = destId;
          await sb.from('room_players').update({ zone: destId }).eq('id', npcAllyRow.id);
        }
      }

      if ((destId === 'marsh' || destId === 'sea_cave') && !hasCondition('중독') && Math.random() < 0.16) {
        addMyCondition('중독');
        await appendGameLog(`[${fmtClock()}] 습지/동굴 기운에 노출되어 '중독' 상태가 되었다.`, true);
      }

      const zObj = ISLAND_ZONES.find(z => z.id === destId);
      const myNameNow = c ? c.name : '실험체';
      const triggeredIdx = plantedMines.findIndex(mItem =>
        mItem.zoneId === destId &&
        mItem.ownerName !== myNameNow &&
        mItem.allyName !== myNameNow &&
        !play.me.allies.includes(mItem.ownerName)
      );
      if (triggeredIdx >= 0) {
        const mineObj = plantedMines.splice(triggeredIdx, 1)[0];
        const mDmg = mineObj.dmg || 3;
        play.me.hp = Math.max(0, play.me.hp - mDmg);
        await appendGameLog(`[${fmtClock()}] 【지뢰 폭발】 ${zObj ? zObj.name : destId} 구역에서 지뢰를 밟았다! HP -${mDmg}`, true);
        if (play.me.hp === 0) {
          play.deathReason = '지뢰 폭발';
          if (play.pid) await sb.from('room_players').update({ zone: destId, hp: 0, alive: false }).eq('id', play.pid);
          await handleMeDead('지뢰 폭발');
          return;
        }
      }
      if (play.pid) {
        await sb.from('room_players').update({ zone: destId, hp: play.me.hp, alive: play.me.alive }).eq('id', play.pid);
      }
      await broadcastMyStateSync();
      const allyMoveMsg = play.me.allies.length > 0 ? ` · 동료 ${play.me.allies.join(', ')} 동행` : '';
      await appendGameLog(`[${fmtClock()}] ${zObj ? zObj.name : destId} 구역에 도착했다.${allyMoveMsg}`);

      applyChatVisibilityFilter();

      const npcsAtDest = play.players.filter(p => p.is_npc && p.alive && p.zone === destId);
      npcsAtDest.forEach(p => gainAffinityPoints(p.name, 2));

      refreshGameUI();
      drawIslandMap();

      const someoneHere = play.players.find(p => p.alive && p.zone === destId && p.id !== play.pid && !play.me.allies.includes(p.name));
      const moveEncProb = play.day === 1 ? 0.18 : Math.min(0.55, 0.28 + (play.day - 2) * 0.07);
      if (someoneHere && Math.random() < moveEncProb) {
        const pairName = getNpcAllyPairName(someoneHere.name);
        const pairAlive = pairName ? play.players.find(p => p.name === pairName && p.alive && p.zone === destId) : null;
        openEncounterModal(someoneHere.id, pairAlive ? `${someoneHere.name}·${pairAlive.name} 동맹` : '');
      }
    }
  }, 1000);
}

function openGroupMoveRequestModal(fromName, destId, destName) {
  if (!play.me.alive || play.finished || modalState.mode) return;
  modalState.mode = 'move_req';
  modalState.enemyName = fromName;
  modalState.targetId = destId;
  openCenterModal(`
    <div class="modal-top-bar">동료 동행 이동 요청</div>
    <div class="enc-card">
      <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">동료 ${esc(fromName)}님이 '${esc(destName)}' 구역으로 함께 이동하자고 합니다!</div>
      <div style="font-size:12px;color:#333;">동맹은 반드시 함께 움직여야 합니다. 거절하면 동맹이 해제됩니다.</div>
    </div>
    <div class="enc-btns" style="grid-template-columns:1fr 1fr;">
      <button type="button" class="modal-act-btn" onclick="respondGroupMoveRequest(true, '${esc(destName)}')">함께 이동한다</button>
      <button type="button" class="modal-act-btn" onclick="respondGroupMoveRequest(false, '${esc(destName)}')">거절 (동맹 해제)</button>
    </div>`);
}

async function respondGroupMoveRequest(accept, destName) {
  const fromName = modalState.enemyName;
  const destId = modalState.targetId;
  closeCenterModal();
  const c = getPickedChar();

  if (accept) {
    isSleepingNow = false;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'move_res', to: fromName, accept: true, destId })
    }]);
    const zObj = ISLAND_ZONES.find(z => z.id === destId);
    if (zObj) await startMoveToZone(zObj, true);
  } else {
    play.me.allies = play.me.allies.filter(n => n !== fromName);
    if (play.me.selectedAlly === fromName) play.me.selectedAlly = play.me.allies[0] || null;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'move_res', to: fromName, accept: false, destId })
    }]);
    await appendGameLog(`[${fmtClock()}] '${destName}' 동행 이동을 거절해 ${fromName}님과 동맹이 해제되었습니다.`, true);
    refreshGameUI();
  }
}

async function onIslandClick(ev) {
  if (!play.me.alive || play.finished || play.actionSec > 0 || play.paused || isSleepingNow) return;
  const cv = document.getElementById('islandCanvas');
  const rect = cv.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) * (460 / (rect.width || 460));
  const my = (ev.clientY - rect.top) * (244 / (rect.height || 244));

  let nearest = null, bestDist = 34;
  ISLAND_ZONES.forEach(z => {
    const dist = Math.hypot(z.x - mx, z.y - my);
    if (dist < bestDist) { bestDist = dist; nearest = z; }
  });

  if (!nearest || nearest.id === play.me.zone) return;
  if (play.banned.includes(nearest.id)) return;
  await startMoveToZone(nearest);
}

function pickZoneLootItem(zoneId) {
  const z = ISLAND_ZONES.find(x => x.id === zoneId);
  const nameList = (z && z.pool && z.pool.length) ? z.pool : LOOT_ITEMS.map(i => i.name);
  const weighted = [];
  nameList.forEach(nm => {
    const isRare = nm.startsWith('★');
    const weight = nm === '손전등' ? 9 : (isRare ? 1 : 8);
    for (let k = 0; k < weight; k++) weighted.push(nm);
  });
  const chosenName = weighted[Math.floor(Math.random() * weighted.length)] || nameList[0];
  const found = LOOT_ITEMS.find(i => i.name === chosenName) || LOOT_ITEMS[0];
  return ensureItemUid({ ...found });
}

async function actRefSearch() {
  if (!play.me.alive || play.finished || play.actionSec > 0 || isSleepingNow) return;
  const hNow = Math.floor((play.minutes % 1440) / 60);
  const isNightNow = !(hNow >= 6 && hNow < 18);
  const hasFlashlight = play.me.bag.some(it => it.name === '손전등');

  if (isNightNow && !hasFlashlight) {
    await appendGameLog(`[${fmtClock()}] 너무 어둡다. 손전등 없이는 밤에 탐색할 수 없다.`, true);
    pushDialogueToChat('기록', '사방이 너무 어둡다… 손전등 없이는 주변을 살필 수가 없다.', { zone: play.me.zone });
    return;
  }

  const c = getPickedChar();
  const baseSec = hasAnyCondition(['부상', '피로']) ? 12 : 10;
  play.actionKind = 'search';
  play.actionSec = Math.max(5, baseSec - Math.floor(((c?.agi || 1) - 1) / 2));
  refreshGameUI();

  if (play.actionTimer) clearInterval(play.actionTimer);
  play.actionTimer = setInterval(async () => {
    if (play.paused || play.finished) return;
    play.actionSec--;
    refreshGameUI();

    if (play.actionSec <= 0) {
      clearInterval(play.actionTimer);
      play.actionTimer = null;
      play.actionKind = null;
      play.actionSec = 0;
      play.searchCount = (play.searchCount || 0) + 1;

      const luk = c ? (c.luk || 1) : 1;
      play.me.hunger = Math.max(0, play.me.hunger - 2);
      if (play.me.hunger < 30) addMyCondition('굶주림');
      const astroBonus = (c && c.club === '천문부') ? 0.12 : 0;
      const successProb = Math.min(0.92, 0.60 + (luk - 1) * 0.05 + astroBonus);

      if (Math.random() < successProb) {
        const floorArr = zoneDroppedItems[play.me.zone];
        const fromFloor = Boolean(floorArr && floorArr.length > 0 && Math.random() < 0.30);
        const picked = fromFloor ? ensureItemUid(floorArr.shift()) : pickZoneLootItem(play.me.zone);
        if (play.me.bag.length < play.me.maxBag) {
          play.me.bag.push(picked);
          play.itemGainCount = (play.itemGainCount || 0) + 1;
          sfx.loot();
          const srcTag = fromFloor ? '바닥에 떨어진 ' : '';
          const astroTag = (c && c.club === '천문부') ? ' [천문부 특기 발동: 탐색 행운 보정]' : '';
          await appendGameLog(`[${fmtClock()}] 탐색 완료: ${srcTag}'${picked.name}'을(를) 획득했다.${astroTag}`);
          await broadcastMyStateSync();
        } else {
          if (fromFloor) {
            floorArr.unshift(picked);
          } else {
            if (!zoneDroppedItems[play.me.zone]) zoneDroppedItems[play.me.zone] = [];
            zoneDroppedItems[play.me.zone].push(picked);
          }
          await appendGameLog(`[${fmtClock()}] 가방이 가득 차 '${picked.name}'을(를) 바닥에 두고 왔다.`, true);
        }
      } else {
        await appendGameLog(`[${fmtClock()}] 주변을 뒤졌지만 유용한 물건을 찾지 못했다.`);
      }

      const npcAllies = play.me.allies.filter(n => !isHumanPlayerName(n));
      if (npcAllies.length > 0 && play.me.bag.length < play.me.maxBag && Math.random() < 0.24) {
        const helper = npcAllies[Math.floor(Math.random() * npcAllies.length)];
        const giftPool = LOOT_ITEMS.filter(x => !x.rare && (x.type === 'food' || x.type === 'heal' || x.name === '지뢰'));
        const giftItem = ensureItemUid({ ...(giftPool[Math.floor(Math.random() * giftPool.length)] || LOOT_ITEMS[0]) });
        play.me.bag.push(giftItem);
        play.itemGainCount = (play.itemGainCount || 0) + 1;
        sfx.loot();
        await appendGameLog(`[${fmtClock()}] 동료 ${helper}이(가) 탐색 중 '${giftItem.name}'을(를) 찾아 건네주었다.`, true);
        await pushDialogueToChat(helper, `이거 내가 찾았어. 네가 챙겨 둬 — '${giftItem.name}'.`, { zone: play.me.zone, broadcast: true });
      }

      refreshGameUI();
    }
  }, 1000);
}

let isSleepingNow = false;
let sleepHealCarry = 0;

async function actRefSleep() {
  if (!play.me.alive || play.finished || play.actionSec > 0) return;
  isSleepingNow = !isSleepingNow;
  if (isSleepingNow) {
    closeAllyMenu();
    const guardMsg = play.me.allies.length > 0 ? ` · 동료 ${play.me.allies[0]} 불침번 대기` : ' · 불침번 없음 (기습 주의)';
    await appendGameLog(`[${fmtClock()}] 잠자리에 들었다. 수면 중에는 대화·교류할 수 없다.${guardMsg}`, true);
  } else {
    await appendGameLog(`[${fmtClock()}] 잠에서 깨어났다.`, true);
  }
  await broadcastMyStateSync();
  refreshGameUI();
}

async function actRefSuicide() {
  if (!play.me.alive || play.finished) return;
  if (!play.me.weapon || play.me.weapon.name === '맨손') {
    await appendGameLog(`[${fmtClock()}] 무기를 장착해야 자결할 수 있다.`, true);
    return;
  }
  if (!confirm(`${play.me.weapon.name}을(를) 사용해 자결하시겠습니까?`)) return;
  const suicideCause = `${play.me.weapon.name}(으)로 자결`;
  play.deathReason = suicideCause;
  await handleMeDead(suicideCause);
}

let isSpectatingNow = false;

function resetChatInputForNewMatch() {
  const chatInp = document.getElementById('refChatInput');
  const sendBtn = document.querySelector('.ref-send-btn');
  if (chatInp) {
    chatInp.placeholder = '같은 구역 채팅 입력';
    chatInp.value = '';
    chatInp.disabled = false;
    chatInp.onkeydown = (e) => { if (e.key === 'Enter') postRefChat(); };
  }
  if (sendBtn) {
    sendBtn.textContent = '전송';
    sendBtn.disabled = false;
    sendBtn.onclick = () => postRefChat();
  }
}

async function handleMeDead(reason) {
  if (!play.me.alive && !play.finished) return;
  play.me.alive = false;
  play.me.hp = 0;
  const finalCause = reason || play.deathReason || '사망';
  play.deathReason = finalCause;
  if (play.actionTimer) { clearInterval(play.actionTimer); play.actionTimer = null; play.actionSec = 0; play.actionKind = null; }
  isSleepingNow = false;

  if (play.me.bag.length > 0) {
    if (!zoneDroppedItems[play.me.zone]) zoneDroppedItems[play.me.zone] = [];
    zoneDroppedItems[play.me.zone].push(...play.me.bag);
    if (!play.isSolo && play.code) {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: 'SYS',
        zone: play.me.zone,
        msg_type: 'drop_sync',
        content: JSON.stringify({ actor: getPickedChar()?.name || '', zone: play.me.zone, items: play.me.bag, corpseOf: getPickedChar()?.name || '참가자' })
      }]);
    }
    play.me.bag = [];
  }

  if (play.pid) {
    await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', play.pid);
  }
  sfx.death();
  sfx.deathAlert();
  const myCharName = getPickedChar()?.name || '참가자';
  const remCnt = Math.max(0, play.players.filter(p => p.alive && p.id !== play.pid).length);
  setMarqueeAlert(`${myCharName} 사망!! (${finalCause} · 생존 ${remCnt}명)`);
  await appendGameLog(`[${fmtClock()}] 【사망】 ${finalCause}(으)로 사망했습니다.`, true);
  await sb.from('room_messages').insert([{
    room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys',
    content: `[속보] ${myCharName} 사망 (${finalCause}) · 남은 생존 ${remCnt}명`
  }]);

  if (play.host && !play.isSolo && play.code) {
    const nextHost = play.players.find(p => !p.is_npc && p.alive && p.id !== play.pid);
    if (nextHost) {
      play.host = false;
      await sb.from('rooms').update({ host_name: nextHost.name }).eq('code', play.code);
      await sb.from('room_messages').insert([{
        room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'host_transfer', content: nextHost.name
      }]);
    }
  }

  const aliveCount = play.players.filter(p => p.alive && p.id !== play.pid).length + 1;
  play.deathRank = aliveCount;
  await recordCharResult(aliveCount, false);

  if (play.isSolo) {
    await finishAndCleanupRoom('사망 종료', finalCause, aliveCount);
  } else {
    isSpectatingNow = true;
    const chatInp = document.getElementById('refChatInput');
    if (chatInp) {
      chatInp.placeholder = play.ghostChat === 'public_ghost' ? '관전 채팅 (생존자에게도 보임)' : '유령 채팅 (사망자끼리만 보임)';
      chatInp.disabled = false;
    }
    document.getElementById('refResultActionWrap').innerHTML =
      `<button type="button" class="btn-navy" style="padding:3px 8px; font-size:11px;" onclick="openResultReport('${esc(finalCause)}', ${aliveCount})">내 결과 보기</button>`;
    await appendGameLog(`[${fmtClock()}] 【관전 모드】 사망하여 남은 참가자들의 움직임과 속보를 관전합니다.`, true);
    refreshGameUI();
    await checkMultiSpectatorEnd(finalCause);
  }
}

async function checkMultiSpectatorEnd(lastCause = '생존 종료') {
  if (play.isSolo || play.finished) return;
  const stillAliveHumans = play.players.filter(p => !p.is_npc && p.alive && p.id !== play.pid);
  const stillAliveAny = play.players.filter(p => p.alive && p.id !== play.pid);
  const actualCause = play.deathReason || lastCause;
  const actualRank = play.deathRank || Math.max(1, stillAliveAny.length + 1);
  if (stillAliveHumans.length === 0 || stillAliveAny.length <= 1) {
    await finishAndCleanupRoom('관전 종료', actualCause, actualRank, true);
  } else {
    document.getElementById('refResultActionWrap').innerHTML =
      `<button type="button" class="btn-ivory" style="padding:4px 10px; font-size:11px;" onclick="openResultReport('${esc(actualCause)}', ${actualRank})">내 결과 보고서</button>`;
  }
}

async function recordCharResult(rankNum, isWin) {
  if (play.recordedFinish) return;
  play.recordedFinish = true;
  const c = getPickedChar();
  if (!c) return;
  const nextPlays = (c.plays || 0) + 1;
  const nextWins = (c.wins || 0) + (isWin ? 1 : 0);
  const nextBest = c.best_rank ? Math.min(c.best_rank, rankNum) : rankNum;
  await sb.from('user_characters').update({ plays: nextPlays, wins: nextWins, best_rank: nextBest }).eq('id', c.id);
  c.plays = nextPlays; c.wins = nextWins; c.best_rank = nextBest;
}

async function finishAndCleanupRoom(label, cause = '생존 종료', rankNum = 1, openReportNow = true) {
  if (play.finished) return;
  play.finished = true;
  if (play.tickTimer) { clearInterval(play.tickTimer); play.tickTimer = null; }
  if (play.chan) { sb.removeChannel(play.chan); play.chan = null; }

  if (play.code && (play.isSolo || play.host)) {
    await sb.from('room_messages').delete().eq('room_code', play.code);
    await sb.from('room_players').delete().eq('room_code', play.code);
    await sb.from('rooms').delete().eq('code', play.code);
  }

  const finalCause = play.deathReason || cause;
  const finalRank = play.deathRank || rankNum;

  document.getElementById('refCodeInfo').textContent = `방 코드: ${play.code || '-'} · ${label}`;
  document.getElementById('refResultActionWrap').innerHTML =
    `<button type="button" class="btn-ivory" style="padding:4px 10px; font-size:11px;" onclick="openResultReport('${esc(finalCause)}', ${finalRank})">실험 결과 보고서</button>`;

  resetChatInputForNewMatch();
  if (openReportNow && document.getElementById('viewGame')?.classList.contains('active')) {
    openResultReport(finalCause, finalRank);
  }
  refreshGameUI();
  drawIslandMap();
}

function openResultReport(cause, rankNum) {
  const c = getPickedChar();
  if (!c) return;
  const finalCause = play.deathReason || cause;
  const finalRank = play.deathRank || rankNum;
  const elapsedSec = Math.max(1, Math.floor((Date.now() - play.sessionStartMs) / 1000));
  const mm = Math.floor(elapsedSec / 60);
  const ss = elapsedSec % 60;

  const kills = play.killCount || 0;
  const combats = play.combatCount || 0;
  const searches = play.searchCount || 0;
  const itemGains = play.itemGainCount || 0;
  const itemUses = play.itemUseCount || 0;
  const moves = play.moveCount || 0;
  const socials = play.socialCount || 0;
  const allies = play.allyCount || 0;
  const affSum = Object.values(affinityPointsMap || {}).reduce((acc, v) => acc + Math.max(0, v - 8), 0);

  const combatScore = Math.min(100, kills * 18 + combats * 6);
  const surviveScore = Math.min(100, Math.round(((TARGET_HEADCOUNT - finalRank) / (TARGET_HEADCOUNT - 1)) * 50 + Math.min(50, (elapsedSec / 720) * 50)));
  const allyScore = Math.min(100, allies * 20 + Math.round(affSum * 0.14));
  const socialScore = Math.min(100, socials * 6 + Math.round(affSum * 0.12));
  const judgeScore = Math.min(100, searches * 6 + moves * 4);
  const agilityScore = Math.min(100, moves * 5 + Math.max(0, combats - kills) * 5 + (finalRank <= 5 ? 12 : 0));
  const witScore = Math.min(100, itemGains * 7 + itemUses * 8);
  const actionScore = Math.min(100, (searches + moves + combats + socials + itemUses) * 3);
  const copeScore = Math.min(100, itemUses * 9 + kills * 10 + (play.me.hp > 0 ? play.me.hp * 1.5 : 0));

  const totalScore = Math.round(
    combatScore * 0.16 +
    surviveScore * 0.24 +
    allyScore * 0.12 +
    socialScore * 0.10 +
    judgeScore * 0.10 +
    agilityScore * 0.08 +
    witScore * 0.10 +
    actionScore * 0.05 +
    copeScore * 0.05
  );

  let grade = 'D';
  if (finalRank === 1 && totalScore >= 86) grade = 'S';
  else if (totalScore >= 78 || (finalRank <= 2 && totalScore >= 72)) grade = 'A';
  else if (totalScore >= 58 || (finalRank <= 6 && totalScore >= 52)) grade = 'B';
  else if (totalScore >= 36 || finalRank <= 15) grade = 'C';
  else grade = 'D';

  const summaryParts = [];
  if (elapsedSec < 45 && actionScore < 15) {
    summaryParts.push('시뮬레이션에 적응하기도 전에 극초반 탈락을 맞이했다. 뚜렷한 탐색이나 대비 흔적이 거의 남지 않았다.');
  } else {
    if (kills >= 2) summaryParts.push(`직접 ${kills}명을 제압하며 섬의 주도권을 거머쥔 공격적 행보가 돋보였다.`);
    else if (combats === 0) summaryParts.push('교전을 철저히 회피하며 그림자처럼 몸을 숨기는 생존 전략을 택했다.');
    else summaryParts.push(`총 ${combats}회의 교전을 겪으며 위기 속에서 버텨냈다.`);

    if (allies >= 2) summaryParts.push(`${allies}명의 동료와 유대를 쌓아 다수의 협력 구도를 이끌어냈다.`);
    else if (allies === 1) summaryParts.push('단독 행동 대신 한 명의 동료와 호흡을 맞추며 생존을 도모했다.');
    else if (socials === 0) summaryParts.push('타인과의 교류를 일절 끊은 채 철저한 고독 속에 머물렀다.');

    if (searches >= 4 || itemUses >= 3) summaryParts.push(`탐색 ${searches}회·물자 활용 ${itemUses}회로 현장 자원을 알뜰히 운용했다.`);
    else if (searches === 0) summaryParts.push('주변 탐색조차 시도하지 않아 물자 부족에 시달렸다.');
  }
  const finalComment = summaryParts.join(' ');

  const metrics = [
    ['전투력', combatScore, `처치 ${kills}명 · 교전 ${combats}회`],
    ['생존력', surviveScore, `${play.day}일차 · ${mm}분 ${ss}초 생존`],
    ['교류력', allyScore, `동료 영입 ${allies}명`],
    ['사교성', socialScore, `대화·교류 ${socials}회`],
    ['판단력', judgeScore, `탐색 ${searches}회 · 이동 ${moves}회`],
    ['순발력', agilityScore, `위기 회피·기동 대응`],
    ['기지력', witScore, `획득 ${itemGains}개 · 사용 ${itemUses}회`],
    ['행동력', actionScore, `총 유효 행동 ${searches + moves + combats + socials + itemUses}회`],
    ['대처력', copeScore, `종료 시 HP ${play.me.hp}/${play.me.maxHp} · 허기 ${play.me.hunger}`]
  ];

  const card = document.getElementById('reportCard');
  card.innerHTML = `
    <div class="report-title">실험 결과 보고서 - 제 ${c.plays || 1}회</div>
    <div class="report-top">
      <div class="report-portrait">${play.me.avatar ? `<img src="${play.me.avatar}" alt="">` : esc(c.name.slice(0, 1))}</div>
      <div>
        <div style="font-size:15px;font-weight:bold;">${esc(c.name)}</div>
        <div style="font-size:12px;">실험체-${c.exp_number} · ${esc(c.club)}</div>
        <div style="font-size:12px;">${finalRank}위 / ${TARGET_HEADCOUNT}명 · ${mm}분 ${ss}초 생존 (종합 ${totalScore}점)</div>
        <div style="font-size:11px;color:#3d382d;margin-top:3px;">사유: ${esc(finalCause)}</div>
      </div>
    </div>
    <div class="report-grade-stamp">
      <span style="font-size:9px;">등급</span>
      <span style="font-size:24px;line-height:1;">${grade}</span>
    </div>
    <div class="report-bars">
      ${metrics.map(([k, v, desc]) => `
        <div class="report-bar-row">
          <span>${esc(k)}</span>
          <div class="report-bar-track"><div class="report-bar-fill" data-w="${v}%"></div></div>
          <span style="color:#3d382d;font-size:10px;">${esc(desc)}</span>
        </div>`).join('')}
    </div>
    <div style="background:#f5f0e3;border:2px solid #141c30;padding:8px;font-size:11px;line-height:1.5;margin-bottom:8px;color:#141c30;">
      <strong>[사후 분석 총평]</strong> ${esc(finalComment)}
    </div>
    <input type="text" class="txt-input" id="reportMemoIn" placeholder="한줄 소감을 남기세요 (선택)" maxlength="60" style="background:#f5f0e3;color:#141c30;border-color:#141c30;margin-bottom:8px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <button type="button" class="btn-navy" style="width:100%;font-weight:bold;" onclick="exportTistoryHtmlLog('${esc(finalCause)}', ${finalRank}, '${grade}', ${totalScore}, '${esc(finalComment)}')">로그 출력하기 (HTML)</button>
      <button type="button" class="btn-ivory" style="width:100%;" onclick="closeReportToLobby()">다음 시뮬레이션으로 ▶</button>
    </div>`;

  document.getElementById('reportModal').classList.add('open');
  requestAnimationFrame(() => {
    card.querySelectorAll('.report-bar-fill').forEach(el => { el.style.width = el.dataset.w; });
  });
}

function exportTistoryHtmlLog(cause, rankNum, grade, totalScore, finalComment) {
  const c = getPickedChar();
  if (!c) return;
  const memo = (document.getElementById('reportMemoIn')?.value || '').trim();
  const chatHtml = document.getElementById('refChatLog')?.innerHTML || '<p>채팅 기록 없음</p>';
  const logHtml = document.getElementById('refGameLog')?.innerHTML || '<p>행동 기록 없음</p>';
  const nowDate = new Date().toLocaleString('ko-KR');

  const doc = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>戀人式 기록 - ${esc(c.name)} (제 ${c.plays || 1}회)</title>
<style>
  @font-face {
    font-family: 'DungGeunMo';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/DungGeunMo.woff') format('woff');
  }
  body { background:#182036; color:#eae2ce; font-family:'DungGeunMo', monospace; padding:20px; line-height:1.6; }
  .wrap { max-width:780px; margin:0 auto; background:#141c30; border:3px solid #eae2ce; padding:20px; }
  h1, h2 { background:#eae2ce; color:#141c30; padding:6px 12px; font-size:16px; margin:18px 0 10px; }
  .meta { background:#101729; border:2px solid #8ea3cc; padding:12px; font-size:13px; }
  .box { background:#0e1424; border:2px solid #6f89bd; padding:12px; font-size:12px; max-height:none; }
  .ref-chat-row { display:flex; gap:8px; margin-bottom:8px; }
  .ref-chat-av { width:28px; height:28px; border:1px solid #8ea3cc; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ref-chat-av img { width:100%; height:100%; object-fit:cover; }
  .ref-chat-meta { font-size:11px; color:#8eb8ff; }
  .ref-chat-bubble { background:#192642; border:1px solid #7d95c7; padding:5px 8px; margin-top:2px; }
  .ref-chat-sys { color:#9ec2ff; margin:4px 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>戀人式 (연인식 프로젝트) — 실험 기록 백업</h1>
  <div class="meta">
    <div><strong>실험체:</strong> ${esc(c.name)} (실험체-${c.exp_number} · ${esc(c.club)})</div>
    <div><strong>결과:</strong> ${rankNum}위 / ${TARGET_HEADCOUNT}명 · 종합등급 <strong>${esc(grade)}</strong> (${totalScore}점)</div>
    <div><strong>종료 사유:</strong> ${esc(cause)} · 기록 일시: ${esc(nowDate)}</div>
    <div style="margin-top:6px;color:#a9c4f7;"><strong>[사후 분석 총평]</strong> ${esc(finalComment)}</div>
    ${memo ? `<div style="margin-top:6px;color:#f5efe2;"><strong>[실험체 한줄 소감]</strong> "${esc(memo)}"</div>` : ''}
  </div>
  <h2>1. 행동 및 사건 기록</h2>
  <div class="box">${logHtml}</div>
  <h2>2. 전체 채팅 및 속보 로그</h2>
  <div class="box">${chatHtml}</div>
</div>
</body>
</html>`;

  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `연인식_${c.name}_${c.plays || 1}회차_로그.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function closeReportToLobby() {
  document.getElementById('reportModal').classList.remove('open');
  play.code = null;
  play.pid = null;
  await startWithCurrentChar();
}

async function useBagItem(idx) {
  if (!play.me.alive || play.finished) return;
  const it = play.me.bag[idx];
  if (!it) return;
  play.itemUseCount = (play.itemUseCount || 0) + 1;
  const c = getPickedChar();
  const str = c ? (c.str || 1) : 1;

  if (it.type === 'heal') {
    const mult = (c && c.club === '보건부') ? 2 : 1;
    play.me.hp = Math.min(play.me.maxHp, play.me.hp + it.val * mult);
    if (Array.isArray(it.cures)) {
      it.cures.forEach(cName => removeMyCondition(cName));
    }
    if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
    const healTag = (c && c.club === '보건부') ? ' [보건부 특기 발동: 치료량 2배]' : '';
    await appendGameLog(`[${fmtClock()}] '${it.name}' 사용 (HP ${play.me.hp}/${play.me.maxHp}, 상태: ${formatConditionsText(play.me.conditions)})${healTag}`);
    play.me.bag.splice(idx, 1);
  } else if (it.type === 'food') {
    const bonus = (c && c.club === '요리부') ? 15 : 0;
    play.me.hunger = Math.min(100, play.me.hunger + it.val + bonus);
    if (play.me.hunger >= 30) removeMyCondition('굶주림');
    if (it.name && it.name.includes('전투식량')) removeMyCondition('피로');
    const foodTag = (c && c.club === '요리부') ? ' [요리부 특기 발동: 허기 회복 +15]' : '';
    await appendGameLog(`[${fmtClock()}] '${it.name}' 섭취 (허기 ${play.me.hunger}/100)${foodTag}`);
    play.me.bag.splice(idx, 1);
  } else if (it.type === 'weapon') {
    ensureItemUid(it);
    const strBonus = Math.floor((str - 1) * 0.5);
    const baseAtk = it.atk || 4;
    play.me.weapon = {
      name: it.name,
      baseAtk,
      atk: baseAtk + strBonus,
      kind: it.kind || '근접',
      statusEffect: it.statusEffect || null,
      statusChance: it.statusChance || 0,
      dura: it.dura ?? 6,
      maxDura: it.maxDura ?? 6,
      uid: it.uid
    };
    await appendGameLog(`[${fmtClock()}] '${it.name}' 장착 (기본 ${baseAtk} + 근력보정 ${strBonus} = 총 ${play.me.weapon.atk}, 내구 ${play.me.weapon.dura}/${play.me.weapon.maxDura})`);
  } else if (it.type === 'smoke') {
    await appendGameLog(`[${fmtClock()}] '${it.name}'은(는) 전투 중 [아이템] 버튼을 눌러 즉시 도주할 때 사용할 수 있다.`, true);
  } else if (it.type === 'repair') {
    if (play.me.weapon && play.me.weapon.dura != null) {
      const addD = it.val || 3;
      play.me.weapon.dura = Math.min(play.me.weapon.maxDura, play.me.weapon.dura + addD);
      const eqIdx = play.me.weapon.uid
        ? play.me.bag.findIndex(b => b.uid === play.me.weapon.uid)
        : play.me.bag.findIndex(b => b.type === 'weapon' && b.name === play.me.weapon.name);
      if (eqIdx >= 0 && play.me.bag[eqIdx]) {
        play.me.bag[eqIdx].dura = play.me.weapon.dura;
        play.me.bag[eqIdx].desc = `공격력 ${play.me.bag[eqIdx].atk || play.me.weapon.baseAtk} (${play.me.bag[eqIdx].kind || '근접'}) · 내구 ${play.me.weapon.dura}/${play.me.weapon.maxDura}`;
      }
      play.me.bag.splice(idx, 1);
      await appendGameLog(`[${fmtClock()}] '${it.name}' 사용: '${play.me.weapon.name}' 내구도 ${play.me.weapon.dura}/${play.me.weapon.maxDura} 회복.`, true);
    } else {
      await appendGameLog(`[${fmtClock()}] 수리할 무기를 먼저 장착해야 한다.`, true);
    }
  } else if (it.type === 'armor') {
    play.me.shield = (play.me.shield || 0) + (it.shield || 2);
    play.me.bag.splice(idx, 1);
    await appendGameLog(`[${fmtClock()}] '${it.name}' 착용! 피해 경감 보호막 +${it.shield || 2} (현재 보호 ${play.me.shield})`, true);
  } else if (it.type === 'fishing') {
    const waterZones = ['west_coast', 'south_coast', 'pier', 'reservoir', 'fishing_village'];
    if (!waterZones.includes(play.me.zone)) {
      await appendGameLog(`[${fmtClock()}] 물가(해변·선착장·저수지·어촌)에서만 낚싯대를 쓸 수 있다.`, true);
    } else {
      it.uses = (it.uses ?? 5) - 1;
      it.desc = `★ 희귀 · 물가에서 물고기 획득 (${it.uses}회 남음)`;
      if (it.uses <= 0) play.me.bag.splice(idx, 1);
      if (play.me.bag.length < play.me.maxBag) {
        play.me.bag.push(ensureItemUid({ name: '구운 생선', type: 'food', val: 34, desc: '허기 +34 · 낚시로 잡은 생선' }));
        play.itemGainCount = (play.itemGainCount || 0) + 1;
        await appendGameLog(`[${fmtClock()}] 낚시 성공! '구운 생선'을 획득했다.`, true);
      } else {
        await appendGameLog(`[${fmtClock()}] 물고기를 낚았지만 가방이 가득 찼다.`, true);
      }
    }
  } else if (it.type === 'binocular') {
    const curZ = ISLAND_ZONES.find(z => z.id === play.me.zone);
    const adjIds = (curZ && curZ.edges) ? curZ.edges : [];
    const spotted = [];
    adjIds.forEach(aid => {
      const zName = ISLAND_ZONES.find(z => z.id === aid)?.name || aid;
      const cnt = play.players.filter(p => p.alive && p.zone === aid && p.id !== play.pid).length;
      spotted.push(`${zName}(${cnt}명)`);
    });
    await appendGameLog(`[${fmtClock()}] 【쌍안경 정찰】 인접 구역 인원: ${spotted.join(', ') || '없음'}`, true);
  } else if (it.type === 'bag_expand') {
    const inc = it.addSlots || 2;
    play.me.maxBag = (play.me.maxBag || 8) + inc;
    play.me.bag.splice(idx, 1);
    await appendGameLog(`[${fmtClock()}] '${it.name}' 사용! 가방 최대 용량이 ${play.me.maxBag}칸으로 늘었다.`, true);
  } else if (it.type === 'mine') {
    const mineData = {
      zoneId: play.me.zone,
      ownerName: c ? c.name : '실험체',
      allyName: play.me.allies[0] || null,
      dmg: it.dmg || 3
    };
    plantedMines.push(mineData);
    if (!play.isSolo && play.code) {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: c?.name || '유저',
        zone: play.me.zone,
        msg_type: 'mine_sync',
        content: JSON.stringify(mineData)
      }]);
    }
    play.me.bag.splice(idx, 1);
    const zName = ISLAND_ZONES.find(z => z.id === play.me.zone)?.name || play.me.zone;
    await appendGameLog(`[${fmtClock()}] ${zName} 구역에 '${it.name}'을(를) 설치했다. (본인·동료는 안전)`, true);
  } else if (it.type === 'gear') {
    await appendGameLog(`[${fmtClock()}] '${it.name}'은(는) 가방에 소지하고 있으면 밤 탐색에 쓰인다.`, true);
  }
  await broadcastMyStateSync();
  refreshGameUI();
}

async function dropBagItem(idx) {
  if (!play.me.alive || play.finished) return;
  const it = play.me.bag[idx];
  if (!it) return;
  play.me.bag.splice(idx, 1);
  unequipWeaponIfRemoved(it);
  if (!zoneDroppedItems[play.me.zone]) zoneDroppedItems[play.me.zone] = [];
  zoneDroppedItems[play.me.zone].push({ ...it });
  if (!play.isSolo && play.code) {
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: 'SYS',
      zone: play.me.zone,
      msg_type: 'drop_sync',
      content: JSON.stringify({ actor: getPickedChar()?.name || '', zone: play.me.zone, items: [{ ...it }] })
    }]);
  }
  await broadcastMyStateSync();
  await appendGameLog(`[${fmtClock()}] '${it.name}'을(를) 바닥에 내려놓았다.`);
  refreshGameUI();
}

const TRAIT_REFUSE_LINES = {
  "호전적": [
    "지금 너랑 노닥거릴 기분 아니야. 다음 구역으로 넘어가야 하니까 비켜.",
    "말 걸 시간 있으면 무기 상태나 점검해. 난 먼저 움직인다.",
    "쓸데없는 잡담은 사양이야. 방해하지 말고 갈 길 가.",
    "지금은 혼자 움직이는 게 편해. 괜히 신경 건드리지 마."
  ],
  "겁쟁이": [
    "미, 미안해… 지금은 너무 무서워서 말할 여유가 없어… 다른 데로 가 볼게…",
    "혹시 갑자기 공격하려는 건 아니지…? 나, 나 먼저 자리 피할게…!",
    "발소리가 자꾸 들리는 것 같아서… 미안, 먼저 숨어야 할 것 같아…",
    "지금은 심장이 너무 뛰어서 아무 말도 안 나와… 나중에 얘기하자…"
  ],
  "기회주의": [
    "지금은 너랑 얘기해 봐야 딱히 남는 게 없네. 난 다른 구역부터 둘러볼게.",
    "판세가 급하게 돌아가는데 한가하게 수다 떨 틈이 어딨어?",
    "미안하지만 지금은 내 볼일이 먼저야. 이득 될 때 다시 보자고.",
    "잠깐 다른 쪽 상황 좀 확인하고 올게. 여기서 시간 낭비하긴 아깝거든."
  ],
  "이타적": [
    "미안해, 지금 급히 확인해야 할 곳이 생겼어… 조심해서 움직여!",
    "나중에 꼭 제대로 얘기하자. 지금은 다른 쪽이 신경 쓰여서 먼저 가 볼게.",
    "말 걸어 줘서 고마운데, 지금은 잠깐 자리를 옮겨야 할 것 같아. 다치지 마!",
    "급한 볼일만 마치고 다시 만날 수 있으면 좋겠어. 몸 잘 챙겨!"
  ],
  "냉정형": [
    "현재 동선상 이곳에 오래 머무를 수 없다. 대화는 다음으로 미루지.",
    "불필요한 대화는 생략하겠다. 예정된 구역으로 이동한다.",
    "지금은 정보 수집보다 위치 선점이 우선이다. 방해하지 마라.",
    "감정 교류에 할애할 시간이 부족하다. 먼저 이동하겠다."
  ],
  "신중형": [
    "미안해, 여긴 시야가 트여 있어서 오래 서 있기엔 불안해. 자리를 옮길게.",
    "지금은 주변 경계에 집중해야 해서 길게 얘기하기 어려워… 나중에 보자.",
    "조금 더 안전한 구역으로 옮긴 뒤에 얘기하는 게 좋겠어. 조심해.",
    "말은 고맙지만 지금은 먼저 움직여야 할 타이밍 같아. 신중히 행동해."
  ],
  "감정형": [
    "미안… 지금은 머릿속이 너무 복잡해서 도저히 말할 기분이 아니야…",
    "하아, 괜히 예민해져서 너한테까지 날 세울까 봐 먼저 자리 피할게!",
    "지금은 혼자 바람 좀 쐬면서 진정해야겠어… 나중에 다시 말 걸어 줘.",
    "가슴이 답답해서 가만히 서 있을 수가 없어. 다른 쪽으로 좀 걸을게!"
  ],
  "자유형": [
    "아, 미안! 지금 갑자기 삘 꽂힌 데가 있어서 먼저 가 봐야겠어!",
    "수다는 나중에 떨자고, 지금은 바람 따라 좀 돌아다녀야겠거든.",
    "타이밍이 좀 어긋났네~ 다음 구역에서 마주치면 그때 얘기하자!",
    "지금은 내 페이스대로 움직이고 싶어서 말이야. 그럼 이만!"
  ],
  "관찰형": [
    "지금 저쪽 동선에 신경 쓰이는 움직임이 포착됐어. 먼저 확인하러 갈게.",
    "미안, 지금은 주변 흔적을 놓치기 전에 이동해야 해. 관찰이 우선이라서.",
    "너랑 얘기하는 것도 흥미롭지만, 지금은 다른 구역 변수를 먼저 봐야겠어.",
    "잠깐 시야를 넓히러 다른 쪽으로 이동할게. 나중에 다시 보자."
  ],
  "돌격형": [
    "가만히 서서 노닥거릴 틈 없어! 난 바로 다음 구역으로 치고 나간다!",
    "말보다 행동이 먼저지! 지금은 앞질러 가야 하니까 나중에 얘기해!",
    "멈춰 있으면 뒤처진다고! 난 먼저 뚫고 지나갈 테니까 조심해!",
    "지금 기세 올릴 타이밍이라 자리 비켜야겠어. 다음에 붙어 보자고!"
  ]
};

async function talkNearNpc(npcName) {
  if (isSleepingNow || isHumanPlayerName(npcName)) return;
  const npc = NPC_ROSTER.find(n => n.name === npcName);
  const c = getPickedChar();
  const isDrama = (c && c.club === '연극부');
  const pts = getAffinityPoints(npcName);
  const cnt = (bondStreakMap[npcName] || 0);
  bondStreakMap[npcName] = cnt + 1;

  const ignoreRoll = Math.random();
  if (!isDrama && pts < 25 && !play.me.allies.includes(npcName) && ignoreRoll < 0.12) {
    const row = play.players.find(p => p.is_npc && p.alive && p.name === npcName);
    const openZones = ISLAND_ZONES.filter(z => z.id !== play.me.zone && !play.banned.includes(z.id));
    if (row && openZones.length > 0) {
      const nextZ = openZones[Math.floor(Math.random() * openZones.length)];
      const tr = npc && TRAIT_REFUSE_LINES[npc.trait] ? npc.trait : '신중형';
      const rPool = TRAIT_REFUSE_LINES[tr];
      const refuseSay = rPool[Math.floor(Math.random() * rPool.length)];
      row.zone = nextZ.id;
      sb.from('room_players').update({ zone: nextZ.id }).eq('id', row.id);
      await pushDialogueToChat(`${npcName} (${renderHearts(getAffinity(npcName))})`, `${refuseSay} (${nextZ.name} 쪽으로 이동)`, { zone: play.me.zone, broadcast: true });
      refreshGameUI();
      return;
    }
  }

  let chosen = '';
  if (cnt % 2 === 1) {
    chosen = getTraitSituationalLine(npcName, 'chat');
  } else {
    let idx = cnt % 3;
    if (pts >= 70) idx = 6 + (cnt % 3);
    else if (pts >= 40) idx = 5 + (cnt % 2);
    chosen = getNpcScriptLine(npcName, idx, npc ? npc.line : '조심해.');
  }

  const gainAmt = isDrama ? 4 : 3;
  const res = gainAffinityPoints(npcName, gainAmt);
  play.socialCount = (play.socialCount || 0) + 1;
  await pushDialogueToChat(`${npcName} (${renderHearts(res.hearts)})`, chosen, { zone: play.me.zone, broadcast: true });
  if (play.me.allies.includes(npcName)) {
    triggerAllyAffinityEvent(npcName);
  }
  refreshGameUI();
}

function bindGameRealtime() {
  if (play.chan) sb.removeChannel(play.chan);
  play.chan = sb.channel('ref-' + play.code)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_code=eq.${play.code}` }, async () => {
      const { data } = await sb.from('room_players').select('*').eq('room_code', play.code);
      if (data) {
        play.players = data;
        play.players.forEach(p => {
          if (!p.is_npc && p.stats?.avatar) {
            humanStateMap[p.name] = { ...(humanStateMap[p.name] || {}), avatar: p.stats.avatar };
          }
        });
        const meRow = play.players.find(p => p.id === play.pid);
        if (meRow && play.me.alive && !meRow.alive && !play.finished) {
          play.me.hp = 0;
          await handleMeDead(play.deathReason || '교전/탈락');
        }
        if (!play.me.alive && !play.finished) {
          await checkMultiSpectatorEnd(play.deathReason || '관전 종료');
        }
        refreshGameUI();
      }
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${play.code}` }, async p => {
      const msg = p.new;
      const myName = getPickedChar()?.name;

      if (msg.msg_type === 'sys') {
        addChatMessage('SYS', msg.content, null, true, 'all');
        if (typeof msg.content === 'string' && msg.content.includes('[속보]') && msg.content.includes('사망')) {
          const cleanBanner = msg.content.replace(/^\[속보\]\s*/, '').trim();
          const deadMatch = cleanBanner.match(/^([^\s(]+)(?:이\(가\)| 사망)/);
          if (deadMatch && deadMatch[1]) {
            const deadName = deadMatch[1].trim();
            const dRow = play.players.find(pl => String(pl.name || '').trim() === deadName);
            if (dRow) {
              dRow.alive = false;
              dRow.hp = 0;
            }
          }
          sfx.deathAlert();
          setMarqueeAlert(cleanBanner);
          await appendGameLog(`[${fmtClock()}] ${msg.content}`, true);
          refreshGameUI();
        }
        return;
      }

      if (msg.msg_type === 'host_transfer' && msg.content === myName && !play.host) {
        play.host = true;
        await appendGameLog(`[${fmtClock()}] 이전 방장이 이탈하여 시뮬레이션 마스터 권한을 이어받았습니다.`, true);
        return;
      }

      if (msg.msg_type === 'time_sync' && !play.host) {
        try {
          const t = JSON.parse(msg.content);
          play.day = t.day ?? play.day;
          play.minutes = t.minutes ?? play.minutes;
          play.closeSec = t.closeSec ?? play.closeSec;
          play.nextBanned = t.nextBanned ?? play.nextBanned;
          play.banned = t.banned ?? play.banned;
          refreshGameUI();
          drawIslandMap();
        } catch (e) {}
        return;
      }

      if (msg.msg_type === 'close_warn' && !play.host) {
        try {
          const w = JSON.parse(msg.content);
          play.nextBanned = w.nextBanned || [];
          sfx.beep();
          setMarqueeAlert(w.alertMsg);
          await appendGameLog(`[${fmtClock()}] 【경고】 ${w.alertMsg}`, true);
        } catch (e) {}
        return;
      }

      if (msg.msg_type === 'mine_sync' && msg.sender !== myName) {
        try {
          const mData = JSON.parse(msg.content);
          plantedMines.push(mData);
        } catch (e) {}
        return;
      }

      if (msg.msg_type === 'drop_sync') {
        try {
          const d = JSON.parse(msg.content);
          if (d.actor && d.actor === myName) return;
          if (d.zone && Array.isArray(d.items)) {
            if (!zoneDroppedItems[d.zone]) zoneDroppedItems[d.zone] = [];
            zoneDroppedItems[d.zone].push(...d.items.map(x => ensureItemUid(x)));
          }
        } catch (e) {}
        return;
      }

      if (msg.msg_type === 'state_sync' && msg.sender !== myName) {
        try {
          const parsedSt = JSON.parse(msg.content);
          humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), ...parsedSt };
          if (play.me.selectedAlly === msg.sender && document.getElementById('refAllyMenu')?.style.display === 'block') {
            openAllyInteractionMenu(msg.sender);
          } else {
            refreshGameUI();
          }
        } catch (e) {}
        return;
      }

      if (msg.msg_type === 'npc_say') {
        try {
          const parsed = JSON.parse(msg.content);
          if (parsed.actor === myName) return;
          if (String(msg.zone || '').trim() === String(play.me.zone || '').trim()) {
            addChatMessage(msg.sender, parsed.text, null, false, msg.zone, true);
          }
        } catch (e) {
          if (String(msg.zone || '').trim() === String(play.me.zone || '').trim()) {
            addChatMessage(msg.sender, msg.content, null, false, msg.zone, true);
          }
        }
        return;
      }

      if (msg.msg_type === 'p2p_evt' && msg.sender !== myName) {
        try {
          const ev = JSON.parse(msg.content);

          if (ev.kind === 'clash_start' && ev.battleId) {
            const initQ = rebuildMultiTurnQueue(ev.sideA || [], ev.sideB || []);
            const clashObj = {
              battleId: ev.battleId,
              zone: ev.zone,
              controllerName: ev.controllerName || msg.sender,
              sideA: ev.sideA || [],
              sideB: ev.sideB || [],
              turnQueue: initQ,
              turnIdx: ev.turnIdx || 0,
              activeActorName: ev.activeActorName || initQ[0]?.name || null,
              seq: 0,
              ended: false
            };
            activeZoneClashes[ev.battleId] = clashObj;
            const amIA = clashObj.sideA.some(x => x.name === myName);
            const amIB = clashObj.sideB.some(x => x.name === myName);
            if ((amIA || amIB) && !modalState.mode && play.me.alive) {
              isSleepingNow = false;
              await openLiveMultiBattleModal(clashObj, amIA ? 'A' : 'B');
            } else {
              await reportZoneClashToLog(clashObj);
            }
            return;
          }

          if (ev.kind === 'clash_join' && ev.battleId && ev.fighter) {
            const clash = activeZoneClashes[ev.battleId];
            if (clash && !clash.ended) {
              ev.fighter.joinedLate = true;
              const prevAliveQ = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
              const prevActorName = clash.activeActorName || (prevAliveQ.length ? prevAliveQ[clash.turnIdx % prevAliveQ.length]?.name : null);

              if (ev.side === 'A' && !clash.sideA.some(x => x.name === ev.fighter.name)) clash.sideA.push(ev.fighter);
              if (ev.side === 'B' && !clash.sideB.some(x => x.name === ev.fighter.name)) clash.sideB.push(ev.fighter);
              clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);

              const newAliveQ = clash.turnQueue;
              if (prevActorName) {
                const keptPos = newAliveQ.findIndex(f => f.name === prevActorName);
                clash.turnIdx = keptPos >= 0 ? keptPos : 0;
              }
              clash.activeActorName = newAliveQ[clash.turnIdx]?.name || null;

              if (modalState.mode === 'battle' && modalState.battleId === ev.battleId) {
                modalState.sideA = clash.sideA;
                modalState.sideB = clash.sideB;
                modalState.turnQueue = clash.turnQueue;
                modalState.turnIdx = clash.turnIdx;
                appendModalBattleLog(`【난입】 ${ev.fighter.name}님이 ${ev.side === 'A' ? 'A' : 'B'} 진영으로 전투에 합류했습니다! (후순위 배치)`);
                renderMultiBattleUI();
                await runNpcTurnsIfHostInMultiBattle(clash);
              }
            }
            return;
          }

          if (ev.kind === 'clash_state' && ev.battleId) {
            const clash = activeZoneClashes[ev.battleId];
            if (clash) {
              if (typeof ev.seq === 'number' && typeof clash.seq === 'number' && ev.seq <= clash.seq) return;
              if (typeof ev.seq === 'number') clash.seq = ev.seq;
              if (ev.stepId) {
                if (!clash._seenStepIds) clash._seenStepIds = new Set();
                if (clash._seenStepIds.has(ev.stepId)) return;
                clash._seenStepIds.add(ev.stepId);
              }
              clash.sideA = ev.sideA || clash.sideA;
              clash.sideB = ev.sideB || clash.sideB;
              clash.turnQueue = rebuildMultiTurnQueue(clash.sideA, clash.sideB);
              clash.turnIdx = ev.turnIdx ?? clash.turnIdx;
              if (ev.activeActorName) clash.activeActorName = ev.activeActorName;
              if (ev.ended) clash.ended = true;

              [...clash.sideA, ...clash.sideB].forEach(f => {
                if (f.hp <= 0) {
                  const dRow = play.players.find(pl => String(pl.id) === String(f.id) || pl.name === f.name);
                  if (dRow) { dRow.alive = false; dRow.hp = 0; }
                }
              });

              if (modalState.mode === 'battle' && modalState.battleId === ev.battleId) {
                modalState.sideA = clash.sideA;
                modalState.sideB = clash.sideB;
                modalState.turnQueue = clash.turnQueue;
                modalState.turnIdx = clash.turnIdx;
                if (ev.logText) {
                  appendModalBattleLog(ev.logText);
                  if (ev.logText.includes('피해')) triggerBattleShake();
                }

                const meInA = clash.sideA.find(x => x.name === myName);
                const meInB = clash.sideB.find(x => x.name === myName);
                const meF = meInA || meInB;
                if (meF && meF.hp !== play.me.hp) {
                  play.me.hp = Math.max(0, meF.hp);
                  sfx.hurt();
                  triggerBattleShake();
                  if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
                  await broadcastMyStateSync();
                  if (play.me.hp === 0) {
                    const multiCause = `${msg.sender}과의 다인 교전`;
                    play.deathReason = multiCause;
                    closeCenterModal();
                    await handleMeDead(multiCause);
                    return;
                  }
                }
                renderMultiBattleUI();

                if (ev.ended) {
                  const summaryMsg = ev.endSummary || ev.logText || `【교전 종료】 ${msg.sender}과의 싸움이 종료되었다.`;
                  appendModalBattleLog(summaryMsg);
                  await new Promise(r => setTimeout(r, 450));
                  closeCenterModal();
                  await appendGameLog(`[${fmtClock()}] ${summaryMsg}`, true);
                  refreshGameUI();
                } else {
                  await runNpcTurnsIfHostInMultiBattle(clash);
                }
              } else if (clash.zone === play.me.zone && (ev.ended || (ev.endSummary && ev.endSummary.includes('이탈')))) {
                const summaryMsg = ev.endSummary || ev.logText || `【교전 종료】 ${msg.sender} 측의 싸움이 종료되었다.`;
                await appendGameLog(`[${fmtClock()}] ${summaryMsg}`, true);
              }
            }
            return;
          }

          if (ev.to !== myName) return;
          if (ev.kind === 'req_state') {
            await broadcastMyStateSync();
          } else if (ev.kind === 'party_join_vote') {
            openPartyJoinVoteModal(msg.sender, ev.candidateName, ev.candidateClub || '실험체', Boolean(ev.candidateIsHuman));
          } else if (ev.kind === 'party_join_vote_res') {
            if (ev.accept) {
              if (pendingAllyJoinVote && pendingAllyJoinVote.candidateName === ev.candidateName) {
                pendingAllyJoinVote.pendingFrom = pendingAllyJoinVote.pendingFrom.filter(n => n !== msg.sender);
                if (pendingAllyJoinVote.pendingFrom.length === 0) {
                  const { candidateName, candidateIsHuman } = pendingAllyJoinVote;
                  pendingAllyJoinVote = null;
                  await finalizePartyAllianceAddition(candidateName, candidateIsHuman);
                }
              }
            } else {
              pendingAllyJoinVote = null;
              await appendGameLog(`[${fmtClock()}] 동료 ${msg.sender}님이 새 동료(${ev.candidateName}) 영입에 반대하여 무산되었습니다.`, true);
            }
          } else if (ev.kind === 'party_sync_members' && Array.isArray(ev.partyMembers)) {
            ev.partyMembers.forEach(mName => {
              if (mName !== myName && !play.me.allies.includes(mName) && play.me.allies.length < MAX_ALLIES) {
                play.me.allies.push(mName);
              }
            });
            play.me.selectedAlly = ev.newMember || play.me.allies[0] || null;
            await broadcastMyStateSync();
            await appendGameLog(`[${fmtClock()}] 동맹 전원 동의로 ${ev.newMember}님이 우리 파티의 새 동료로 합류했습니다!`, true);
            refreshGameUI();
          } else if (ev.kind === 'ally_req') {
            if (ev.state) {
              humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), ...ev.state };
            }
            openHumanAllyRequestModal(msg.sender, ev.club || '실험체');
          } else if (ev.kind === 'ally_res') {
            if (ev.state) {
              humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), ...ev.state };
            }
            if (ev.accept) {
              const incomingParty = Array.isArray(ev.partyMembers) && ev.partyMembers.length
                ? ev.partyMembers
                : [msg.sender];
              incomingParty.forEach(mName => {
                if (mName !== myName && !play.me.allies.includes(mName) && play.me.allies.length < MAX_ALLIES) {
                  play.me.allies.push(mName);
                }
              });
              play.me.selectedAlly = msg.sender;
              play.allyCount++;
              await broadcastMyStateSync();
              await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 동맹 제안을 수락했습니다! (동료 ${play.me.allies.length}/${MAX_ALLIES})`, true);
            } else {
              await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 동맹 제안을 거절했습니다.`, true);
            }
            refreshGameUI();
          } else if (ev.kind === 'move_req') {
            openGroupMoveRequestModal(msg.sender, ev.destId, ev.destName);
          } else if (ev.kind === 'move_res') {
            if (ev.accept) {
              if (pendingGroupMove && pendingGroupMove.destId === ev.destId) {
                pendingGroupMove.pendingFrom = pendingGroupMove.pendingFrom.filter(n => n !== msg.sender);
                if (pendingGroupMove.pendingFrom.length === 0) {
                  const zObj = ISLAND_ZONES.find(z => z.id === pendingGroupMove.destId);
                  pendingGroupMove = null;
                  if (zObj) await startMoveToZone(zObj, true);
                }
              }
            } else {
              pendingGroupMove = null;
              play.me.allies = play.me.allies.filter(n => n !== msg.sender);
              if (play.me.selectedAlly === msg.sender) play.me.selectedAlly = play.me.allies[0] || null;
              await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 동행 이동을 거절해 동맹이 해제되고 이동이 취소되었습니다.`, true);
              refreshGameUI();
            }
          } else if (ev.kind === 'give_item' && ev.item) {
            if (play.me.bag.length < play.me.maxBag) {
              play.me.bag.push(ensureItemUid(ev.item));
              sfx.loot();
              await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 '${ev.item.name}'을(를) 건네주었습니다.`, true);
            } else {
              if (!zoneDroppedItems[play.me.zone]) zoneDroppedItems[play.me.zone] = [];
              zoneDroppedItems[play.me.zone].push(ensureItemUid(ev.item));
              await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 건넨 '${ev.item.name}'이(가) 가방이 가득 차 바닥에 놓였습니다.`, true);
            }
            await broadcastMyStateSync();
            refreshGameUI();
          } else if (ev.kind === 'share_food') {
            play.me.hunger = Math.min(100, play.me.hunger + (ev.val || 15));
            if (play.me.hunger >= 30) removeMyCondition('굶주림');
            await appendGameLog(`[${fmtClock()}] 동료 ${msg.sender}님이 '${ev.foodName}'을(를) 절반 나누어 주어 허기가 회복되었습니다. (${play.me.hunger}/100)`, true);
            await broadcastMyStateSync();
            refreshGameUI();
          } else if (ev.kind === 'advise_eat') {
            await appendGameLog(`[${fmtClock()}] 동료 ${msg.sender}님이 음식을 먹으라고 권유했습니다.`, true);
          } else if (ev.kind === 'advise_sleep') {
            await appendGameLog(`[${fmtClock()}] 동료 ${msg.sender}님이 잠을 자라고 권유했습니다.`, true);
          } else if (ev.kind === 'watch' || ev.kind === 'guard_for_ally') {
            watchOvernight = true;
            await appendGameLog(`[${fmtClock()}] 동료 ${msg.sender}님이 불침번을 서주기로 했습니다!`, true);
          } else if (ev.kind === 'break_ally') {
            play.me.allies = play.me.allies.filter(n => n !== msg.sender);
            if (play.me.selectedAlly === msg.sender) play.me.selectedAlly = play.me.allies[0] || null;
            await broadcastMyStateSync();
            await appendGameLog(`[${fmtClock()}] ${msg.sender}님이 동맹을 해제했습니다.`, true);
            refreshGameUI();
          } else if (ev.kind === 'pvp_start') {
            isSleepingNow = false;
            await startBattleModal(ev.attackerId, { isDefender: true });
          } else if (ev.kind === 'pvp_turn') {
            if (modalState.mode === 'battle' && modalState.isPvp && modalState.enemyName === msg.sender) {
              if (ev.action === 'atk') {
                const c = getPickedChar();
                const dodgeP = Math.max(0.03, Math.min(0.45, ((c?.agi || 1) - 1) * 0.06 - (hasCondition('피로') ? 0.14 : 0)));
                if (Math.random() < dodgeP) {
                  sfx.flee();
                  appendModalBattleLog(`${msg.sender}의 공격을 재빨리 피했다!`);
                  modalState.defending = false;
                  modalState.busy = false;
                  renderModalBattleHp();
                  await sendPvpTurnAction({ action: 'ack_hit', dodged: true, myHp: play.me.hp });
                } else {
                  let dmg = ev.dmg || 3;
                  if ((play.me.shield || 0) > 0) {
                    play.me.shield--;
                    dmg = Math.max(0, dmg - 1);
                    appendModalBattleLog(`방어구가 충격을 흡수했다! (남은 보호 ${play.me.shield})`);
                  }
                  if (modalState.defending) {
                    dmg = Math.max(0, dmg - 2);
                    appendModalBattleLog(`방어 자세로 피해를 줄였다! (피해 ${dmg})`);
                  }
                  modalState.defending = false;
                  play.me.hp = Math.max(0, play.me.hp - dmg);
                  sfx.hurt();
                  triggerBattleShake();
                  if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
                  if (ev.allyHelper && ev.allyBonus > 0) {
                    appendModalBattleLog(`${msg.sender}과(와) 동료 ${ev.allyHelper}의 협공! HP -${dmg}`);
                  } else {
                    appendModalBattleLog(`${msg.sender}의 ${ev.weapon} 공격! HP -${dmg}`);
                  }
                  await broadcastMyStateSync();
                  await sendPvpTurnAction({ action: 'ack_hit', dodged: false, dmg, myHp: play.me.hp });
                  if (play.me.hp === 0) {
                    const pvpCause = `${msg.sender}과의 교전`;
                    play.deathReason = pvpCause;
                    closeCenterModal();
                    await handleMeDead(pvpCause);
                    return;
                  }
                  modalState.busy = false;
                  renderModalBattleHp();
                }
              } else if (ev.action === 'gave_up_dead') {
                play.killCount = (play.killCount || 0) + 1;
                const killerName = getPickedChar()?.name || '실험체';
                const dRow = play.players.find(pl => String(pl.name || '').trim() === String(msg.sender || '').trim());
                if (dRow) { dRow.alive = false; dRow.hp = 0; }
                const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
                const killNews = `[속보] ${msg.sender}이(가) ${killerName}에게 살해당했습니다. (생존 ${remCnt}명)`;
                sfx.deathAlert();
                setMarqueeAlert(`${msg.sender} 사망!! (생존 ${remCnt}명)`);
                await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
                await sb.from('room_messages').insert([{
                  room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: killNews
                }]);
                appendModalBattleLog(`${msg.sender}이(가) 무기를 내려놓고 저항을 포기해 쓰러졌다!`);
                await new Promise(r => setTimeout(r, 420));
                openLootModal(msg.sender);
                return;
              } else if (ev.action === 'ack_hit') {
                if (ev.dodged) {
                  appendModalBattleLog(`${msg.sender}이(가) 공격을 회피했다!`);
                } else {
                  modalState.enemyHp = Math.max(0, ev.myHp);
                  triggerBattleShake();
                  appendModalBattleLog(`${msg.sender}에게 ${ev.dmg} 피해를 입혔다! (상대 HP ${modalState.enemyHp})`);
                  renderModalBattleHp();
                  if (modalState.enemyHp === 0) {
                    play.killCount = (play.killCount || 0) + 1;
                    const killerName = getPickedChar()?.name || '실험체';
                    const dRow = play.players.find(pl => String(pl.name || '').trim() === String(msg.sender || '').trim());
                    if (dRow) { dRow.alive = false; dRow.hp = 0; }
                    const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
                    const killNews = `[속보] ${msg.sender}이(가) ${killerName}에게 살해당했습니다. (생존 ${remCnt}명)`;
                    sfx.deathAlert();
                    setMarqueeAlert(`${msg.sender} 사망!! (생존 ${remCnt}명)`);
                    await appendGameLog(`[${fmtClock()}] ${killNews}`, true);
                    await sb.from('room_messages').insert([{
                      room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: killNews
                    }]);
                    appendModalBattleLog(`${msg.sender}이(가) 쓰러졌다!`);
                    await new Promise(r => setTimeout(r, 420));
                    openLootModal(msg.sender);
                    return;
                  }
                }
              } else if (ev.action === 'miss') {
                appendModalBattleLog(`${msg.sender}의 공격이 빗나갔다!`);
                modalState.busy = false;
                renderModalBattleHp();
              } else if (ev.action === 'def') {
                appendModalBattleLog(`${msg.sender}이(가) 방어 자세를 취했다.`);
                modalState.busy = false;
                renderModalBattleHp();
              } else if (ev.action === 'item') {
                modalState.enemyHp = ev.myHp ?? modalState.enemyHp;
                appendModalBattleLog(`${msg.sender}이(가) 아이템을 사용했다.`);
                modalState.busy = false;
                renderModalBattleHp();
              } else if (ev.action === 'persuade_fail' || ev.action === 'flee_fail') {
                appendModalBattleLog(`${msg.sender}의 시도가 실패했다.`);
                modalState.busy = false;
                renderModalBattleHp();
              } else if (ev.action === 'bat_chat') {
                appendModalBattleLog(`[채팅] ${msg.sender}: ${ev.text}`);
              } else if (ev.action === 'end_peace') {
                appendModalBattleLog(`${ev.reason}`);
                await new Promise(r => setTimeout(r, 420));
                closeCenterModal();
                await appendGameLog(`[${fmtClock()}] ${ev.reason}`, true);
                refreshGameUI();
              }
            }
          }
        } catch (e) {}
        return;
      }

      if (String(msg.sender || '').trim() !== String(myName || '').trim()) {
        const myCurZone = String(play.me.zone || '').trim();
        const msgZone = String(msg.zone || '').trim();
        if (msg.msg_type === 'ghost') {
          if (!play.me.alive || play.ghostChat === 'public_ghost') {
            addChatMessage(`[사망] ${msg.sender}`, msg.content, null, false, myCurZone, false);
          }
        } else if (!msg.msg_type || msg.msg_type === 'normal') {
          if (!msgZone || msgZone === 'all' || msgZone === myCurZone) {
            addChatMessage(msg.sender, msg.content, null, false, myCurZone, false);
          }
        }
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${play.code}` }, async p => {
      play.banned = p.new.banned_zones || [];
      if (play.me.alive && play.banned.includes(play.me.zone)) {
        const roomCloseCause = '폐쇄 구역 폭발';
        play.deathReason = roomCloseCause;
        sfx.hurt();
        sfx.death();
        await appendGameLog(`[${fmtClock()}] 【폭발】 폐쇄된 구역에 남아 폭발에 휘말렸습니다!`, true);
        await handleMeDead(roomCloseCause);
        return;
      }
      if (p.new.status === 'finished') finishAndCleanupRoom('게임 종료');
      refreshGameUI();
      drawIslandMap();
    })
    .subscribe();
}

function refreshGameUI() {
  const c = getPickedChar();
  const m = play.me;
  const aliveCount = Math.max(1, play.players.filter(p => p.alive).length + (m.alive ? 0 : 1));
  const zoneObj = ISLAND_ZONES.find(z => z.id === m.zone) || ISLAND_ZONES[6];
  const targetObj = play.actionTargetZone ? ISLAND_ZONES.find(z => z.id === play.actionTargetZone) : null;

  document.getElementById('refAliveBanner').textContent = `남은 인원수 : ${aliveCount}명`;
  const hNow = Math.floor((play.minutes % 1440) / 60);
  const nightNow = !(hNow >= 6 && hNow < 18);
  const sleepTag = nightNow ? ` [수면 ${Math.floor((play.nightSleepMinutes || 0) / 60)}/3h]` : '';
  document.getElementById('refClockText').textContent = fmtClock() + sleepTag;
  document.getElementById('refCloseBanner').textContent = fmtCloseRemain();

  if (play.actionKind === 'move' && targetObj) {
    document.getElementById('refLocTag').innerHTML = `이동 중 → ${esc(targetObj.name)} (${play.actionSec}초) <button type="button" class="ref-mini-btn" onclick="event.stopPropagation();cancelCurrentAction()">취소</button>`;
  } else if (play.actionKind === 'search') {
    document.getElementById('refLocTag').innerHTML = `위치: ${esc(zoneObj.name)} (탐색 ${play.actionSec}초) <button type="button" class="ref-mini-btn" onclick="event.stopPropagation();cancelCurrentAction()">취소</button>`;
  } else {
    document.getElementById('refLocTag').textContent = `위치: ${zoneObj.name}`;
  }

  const pBox = document.getElementById('refMyPortrait');
  pBox.innerHTML = m.avatar ? `<img src="${m.avatar}" alt="">` : esc((c?.name || '실').slice(0, 1));
  document.getElementById('refMyName').textContent = c ? c.name : '실험체';
  document.getElementById('refMyClub').textContent = c ? c.club : '천문부';

  const hpPct = Math.max(0, Math.min(100, (m.hp / m.maxHp) * 100));
  const hgPct = Math.max(0, Math.min(100, (m.hunger / 100) * 100));
  document.getElementById('refHpTxt').textContent = `${m.hp} / ${m.maxHp}`;
  document.getElementById('refHgTxt').textContent = `${m.hunger} / 100`;
  document.getElementById('refHpBar').style.width = `${hpPct}%`;
  document.getElementById('refHgBar').style.width = `${hgPct}%`;

  document.getElementById('refMyStats').textContent =
    c ? `근력 ${c.str} · 민첩 ${c.agi} · 운 ${c.luk} · 재주 ${c.dex}` : '근력 1 · 민첩 1 · 운 1 · 재주 1';

  m.condition = formatConditionsText(m.conditions);
  const myCondDisplay = isSleepingNow ? `수면 중 · ${m.condition}` : m.condition;
  const duraTxt = m.weapon.dura != null ? `, 내구 ${m.weapon.dura}/${m.weapon.maxDura}` : '';
  const baseAtkVal = m.weapon.baseAtk ?? m.weapon.atk ?? 1;
  const strBonVal = Math.max(0, (m.weapon.atk || baseAtkVal) - baseAtkVal);
  const atkLabel = strBonVal > 0 ? `총 ${m.weapon.atk} (무기 ${baseAtkVal}+${strBonVal})` : `공격력 ${m.weapon.atk}`;
  document.getElementById('refMyGearState').innerHTML = `
    <div>무기: ${esc(m.weapon.name)} (${atkLabel}, ${esc(m.weapon.kind)}${duraTxt})</div>
    <div>상태: ${esc(myCondDisplay)}</div>`;

  document.getElementById('refBagTitle').textContent = `가방 (${m.bag.length}/${m.maxBag})`;
  const bagEl = document.getElementById('refBagList');
  bagEl.innerHTML = '';
  m.bag.forEach((it, idx) => {
    const actLabel = it.type === 'food' ? '먹기' : (it.type === 'weapon' ? '장착' : (it.type === 'bag_expand' ? '확장' : (it.type === 'mine' ? '설치' : (it.type === 'gear' || it.type === 'smoke' ? '휴대중' : '사용'))));
    const descTxt = getItemDesc(it);
    const row = document.createElement('div');
    row.className = 'ref-bag-item';
    row.innerHTML = `
      <div class="ref-bag-top">
        <span>${esc(it.name)}</span>
        <span class="ref-bag-btns">
          <button type="button" class="ref-mini-btn" ${!m.alive || play.finished ? 'disabled' : ''} onclick="useBagItem(${idx})">${actLabel}</button>
          <button type="button" class="ref-mini-btn" ${!m.alive || play.finished ? 'disabled' : ''} onclick="dropBagItem(${idx})">버림</button>
        </span>
      </div>
      <div style="color:#4a4335;">${esc(descTxt)}</div>`;
    bagEl.appendChild(row);
  });

  m.allies = (m.allies || []).filter(aName => play.players.some(p => p.name === aName && p.alive)).slice(0, MAX_ALLIES);
  if (m.selectedAlly && !m.allies.includes(m.selectedAlly)) {
    m.selectedAlly = m.allies[0] || null;
  }

  const allyEl = document.getElementById('refAllyList');
  if (!m.allies.length) {
    allyEl.innerHTML = `<div class="ref-ally-empty">아직 동료가 없다 (최대 ${MAX_ALLIES}명)</div>`;
    closeAllyMenu();
  } else {
    allyEl.innerHTML = m.allies.map(aName => {
      const isHuman = isHumanPlayerName(aName);
      const pRow = play.players.find(p => p.name === aName);
      const npcInfo = NPC_ROSTER.find(n => n.name === aName);
      const st = getParticipantState(aName);
      const selCls = m.selectedAlly === aName ? ' selected' : '';
      const avUrl = getParticipantAvatar(aName);
      const avHtml = avUrl ? `<img src="${avUrl}" alt="">` : esc(aName.slice(0, 1));
      const sleepTagAlly = st.sleeping ? ` <span style="background:#234936;color:#eae2ce;padding:0 3px;font-size:9px;">수면중</span>` : '';
      const condBadge = st.condition && st.condition !== '양호'
        ? ` <span style="color:#ffb4a2;font-size:9px;">[${esc(st.condition)}]</span>`
        : '';
      const subRow = isHuman
        ? `<div style="color:#8eb8ff;font-size:10px;">[유저 동료] ${esc(pRow?.club || '실험체')} · ${esc(st.sleeping ? '수면중' : st.condition)}</div>`
        : `<div style="color:#c7d6f5;font-size:10px;">호감도 ${renderHearts(getAffinity(aName))} · ${esc(st.sleeping ? '수면중' : st.condition)}</div>`;
      return `
        <div class="ref-ally-card${selCls}" onclick="openAllyInteractionMenu('${esc(aName)}')">
          <div class="ref-chat-av" style="width:34px;height:34px;">${avHtml}</div>
          <div>
            <div style="font-weight:bold;color:#fff;">${esc(aName)}${sleepTagAlly}${condBadge} <span style="font-size:10px;color:#8eb8ff;">HP ${st.hp}/${st.maxHp}</span></div>
            <div style="color:#9ab4e6;font-size:10px;">${esc(pRow?.club || npcInfo?.club || '동료')} · 허기 ${st.hunger} · 물품 ${st.bag.length}개</div>
            ${subRow}
          </div>
        </div>`;
    }).join('');
  }

  const locked = !m.alive || play.finished || isSleepingNow;
  const btnSearch = document.getElementById('refBtnSearch');
  btnSearch.disabled = locked || play.actionSec > 0;
  btnSearch.textContent = play.actionKind === 'search' ? `탐색 중 (${play.actionSec}초)` : '탐색 (10초)';
  const btnSleep = document.getElementById('refBtnSleep');
  btnSleep.disabled = (!m.alive || play.finished || play.actionSec > 0) && !isSleepingNow;
  btnSleep.textContent = isSleepingNow ? '잠에서 깨기' : '잠자기';
  document.getElementById('refBtnSuicide').disabled = !m.alive || play.finished || !m.weapon || m.weapon.name === '맨손';

  const nearEl = document.getElementById('refNearList');
  nearEl.innerHTML = '';
  const hereList = play.players
    .filter(p => p.alive && p.zone === m.zone && p.id !== play.pid)
    .sort((a, b) => Number(Boolean(a.is_npc)) - Number(Boolean(b.is_npc)));
  if (!hereList.length) {
    nearEl.innerHTML = '<div style="color:#7d95c7;font-size:11px;">아무도 없다</div>';
  } else {
    hereList.forEach(p => {
      const isHuman = !p.is_npc;
      const npcMeta = NPC_ROSTER.find(n => n.name === p.name);
      const isAlly = m.allies.includes(p.name);
      const isDramaClub = (c && c.club === '연극부');
      const traitPart = (!isHuman && isDramaClub && npcMeta?.trait) ? ` · 성격 ${npcMeta.trait}` : '';
      const userTag = isHuman ? ` <span style="color:#f5efe2;background:#293b66;padding:0 3px;font-size:9px;">유저</span>` : '';
      const heartHtml = !isHuman ? `<span class="ref-hearts-dark">${renderHearts(getAffinity(p.name))}</span>` : '';
      const avUrl = getParticipantAvatar(p.name);
      const avMini = avUrl ? `<img src="${avUrl}" alt="" style="width:18px;height:18px;object-fit:cover;vertical-align:middle;margin-right:4px;border:1px solid #6f89bd;">` : '';
      const div = document.createElement('div');
      div.className = 'ref-near-entry';
      div.innerHTML = `
        <div class="ref-near-name">${avMini}${esc(p.name)}${userTag} <span style="font-size:10px;color:#8eb8ff;">HP ${p.hp}</span></div>
        <div class="ref-near-sub">${esc(p.club || '참가자')}${esc(traitPart)} ${heartHtml}</div>
        <div class="ref-near-btns">
          ${!isHuman ? `<button type="button" class="ref-mini-btn" ${locked ? 'disabled' : ''} onclick="talkNearNpc('${esc(p.name)}')">대화</button>` : ''}
          <button type="button" class="ref-mini-btn" ${locked ? 'disabled' : ''} onclick="interactNearNpc('${esc(p.name)}', false)">${isAlly ? '메뉴' : '교류'}</button>
          ${!isAlly && m.allies.length < MAX_ALLIES ? `<button type="button" class="ref-mini-btn" ${locked ? 'disabled' : ''} onclick="interactNearNpc('${esc(p.name)}', true)">동료 제안</button>` : ''}
          <button type="button" class="ref-mini-btn" ${locked ? 'disabled' : ''} onclick="startBattleModal('${esc(p.id)}')">공격</button>
        </div>`;
      nearEl.appendChild(div);
    });
  }
}

drawCreatorClubs();
renderCreator();
// =========================================================================
// [1단계 패치] 방 삭제 + 대기방 중복 방지 + 호스트 승계 + 불침번 역할 분리
// =========================================================================

// 1. 로비 방 목록 (입장 옆 [삭제] 버튼 포함)
refreshRooms = async function() {
  const box = document.getElementById('lobbyRoomList');
  const { data } = await sb.from('rooms')
    .select('*').eq('is_private', false).eq('status', 'waiting')
    .order('created_at', { ascending: false }).limit(20);
  if (!data || !data.length) {
    box.innerHTML = '<div style="text-align:center; color:#8eb8ff; padding-top:46px;">열린 방이 없습니다. 방을 만들어 보세요.</div>';
    return;
  }
  box.innerHTML = '';
  data.forEach(r => {
    const el = document.createElement('div');
    el.className = 'room-item';
    el.innerHTML = `<span><strong>${esc(r.title)}</strong> <span style="color:#8eb8ff;">${esc(r.code)}</span> · ${esc(r.host_name)} (최대 ${r.max_players || 4}인)</span><span style="display:flex;gap:4px;"><button class="btn-ivory" style="padding:4px 9px; font-size:12px;" onclick="enterCode('${esc(r.code)}')">입장</button><button class="btn-navy" style="padding:4px 8px; font-size:12px; border-color:#ff7b7b; color:#ffb3b3;" onclick="deleteLobbyRoom('${esc(r.code)}')">삭제</button></span>`;
    box.appendChild(el);
  });
};

// 2. 로비 & 대기실 방 삭제 함수
async function deleteLobbyRoom(code) {
  if (!code) return;
  if (!confirm(`방(${code})을 삭제하시겠습니까?`)) return;
  await sb.from('room_messages').insert([{
    room_code: code, sender: 'SYS', zone: 'wait', msg_type: 'room_deleted', content: 'deleted'
  }]);
  await sb.from('room_messages').delete().eq('room_code', code);
  await sb.from('room_players').delete().eq('room_code', code);
  await sb.from('rooms').delete().eq('code', code);
  await refreshRooms();
}

async function deleteCurrentWaitRoom() {
  if (!waitRoom.code) return;
  if (!confirm('현재 대기실을 삭제하고 로비로 돌아가시겠습니까?')) return;
  const code = waitRoom.code;
  await sb.from('room_messages').insert([{
    room_code: code, sender: 'SYS', zone: 'wait', msg_type: 'room_deleted', content: 'deleted'
  }]);
  await sb.from('room_messages').delete().eq('room_code', code);
  await sb.from('room_players').delete().eq('room_code', code);
  await sb.from('rooms').delete().eq('code', code);
  if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
  waitRoom.code = null;
  play.pid = null;
  await startWithCurrentChar();
}

// 3. 대기방 입장 중복 방지 + 동일 이름 사전 삭제 + 중복 슬롯 제거
let _enteringWaitRoom = false;
const _baseEnterWaitRoom = enterWaitRoom;
enterWaitRoom = async function(code, isHost, hostName, title, maxPlayers, isPrivate) {
  if (_enteringWaitRoom) return;
  const c = getPickedChar();
  if (!c) return;
  _enteringWaitRoom = true;
  try {
    await sb.from('room_players').delete().eq('room_code', code).eq('name', c.name);
    await _baseEnterWaitRoom(code, isHost, hostName, title, maxPlayers, isPrivate);
  } finally {
    _enteringWaitRoom = false;
  }
};

reloadWaitRoomMembers = async function() {
  if (!waitRoom.code) return;
  const { data } = await sb.from('room_players').select('*').eq('room_code', waitRoom.code).eq('is_npc', false).order('id', { ascending: true });
  const seen = new Set();
  waitRoom.members = (data || []).filter(m => {
    if (seen.has(m.name)) return false;
    seen.add(m.name);
    return true;
  });
  const hostEntry = waitRoom.members.find(m => Boolean(m.stats?.is_host));
  if (hostEntry && !waitRoom.hostName) waitRoom.hostName = hostEntry.name;
  waitRoom.members.forEach(m => {
    const av = m.avatar_data || m.stats?.avatar;
    if (av) humanStateMap[m.name] = { ...(humanStateMap[m.name] || {}), avatar: av };
  });
  renderWaitRoomUI();
};

// 4. 대기실 실시간 채널 (방 삭제 수신 + 호스트 판정 보정)
bindWaitRoomRealtime = function() {
  if (waitRoom.chan) sb.removeChannel(waitRoom.chan);
  waitRoom.chan = sb.channel('wait-' + waitRoom.code)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_code=eq.${waitRoom.code}` }, async () => {
      await reloadWaitRoomMembers();
      const myAv = getPickedChar()?.avatar_data;
      if (myAv && waitRoom.code) {
        await sb.from('room_messages').insert([{
          room_code: waitRoom.code, sender: getPickedChar().name, zone: 'wait', msg_type: 'wait_avatar', content: myAv
        }]);
      }
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${waitRoom.code}` }, async p => {
      const msg = p.new;
      if (msg.msg_type === 'wait_chat' && msg.sender !== getPickedChar()?.name) {
        appendWaitChat(msg.sender, msg.content);
      } else if (msg.msg_type === 'wait_avatar' && msg.sender !== getPickedChar()?.name) {
        humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), avatar: msg.content };
        renderWaitRoomUI();
      } else if (msg.msg_type === 'wait_opt') {
        try {
          const parsed = JSON.parse(msg.content);
          waitRoom.gameMode = parsed.gameMode || 'adult';
          waitRoom.spawnMode = parsed.spawnMode || 'school';
          waitRoom.ghostChat = parsed.ghostChat || 'ghost_only';
          renderWaitRoomUI();
        } catch (e) {}
      } else if (msg.msg_type === 'room_deleted') {
        if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
        waitRoom.code = null; play.pid = null;
        alert('방이 삭제되어 로비로 이동합니다.');
        await startWithCurrentChar();
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${waitRoom.code}` }, async p => {
      if (p.new.status === 'playing') {
        const c = getPickedChar();
        const amIHostNow = waitRoom.host || (p.new.host_name === c?.name);
        if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
        await launchPlay(waitRoom.code, amIHostNow, c, null, false, {
          existingPid: play.pid,
          spawnMode: waitRoom.spawnMode,
          ghostChat: waitRoom.ghostChat,
          gameMode: waitRoom.gameMode || 'adult'
        });
      }
    })
    .subscribe();
};

// 5. 불침번 역할 분리 (myGuard / guardingFor) & 멀티 호스트 자동 유지
let guardState = { myGuard: null, guardingFor: null };
setInterval(() => {
  if (play.finished || !play.code) return;
  // 불침번 동기화 보정
  if (guardState.myGuard) watchOvernight = true;
  // 멀티플레이 호스트 유실 방지 (생존 유저 중 첫 번째 유저 자동 마스터 승계)
  if (!play.isSolo && play.me.alive) {
    const myName = getPickedChar()?.name;
    const aliveHumans = play.players.filter(p => !p.is_npc && p.alive);
    if (myName && aliveHumans.length > 0 && aliveHumans[0].name === myName && !play.host) {
      play.host = true;
    }
  }
}, 1500);
// =========================================================================
// [2단계 패치] 전투 종료 패킷 차단 + 15초 턴 타이머 + 전투 채팅 동기화
// =========================================================================

const closedBattleIds = new Set();
let battleTurnRemainSec = 15;
let battleTurnTimer = null;

function stopBattleTurnTimer() {
  if (battleTurnTimer) {
    clearInterval(battleTurnTimer);
    battleTurnTimer = null;
  }
  battleTurnRemainSec = 15;
}

function startBattleTurnTimer() {
  stopBattleTurnTimer();
  battleTurnRemainSec = 15;
  battleTurnTimer = setInterval(async () => {
    if (modalState.mode !== 'battle' || play.finished || play.paused) {
      stopBattleTurnTimer();
      return;
    }
    battleTurnRemainSec--;
    const turnEl = document.getElementById('mTurnTxt');
    if (turnEl) {
      const baseTxt = modalState.busy ? '상대 행동 대기 중' : '당신의 턴!';
      turnEl.textContent = `${baseTxt} (${Math.max(0, battleTurnRemainSec)}초)`;
    }

    if (battleTurnRemainSec <= 0) {
      battleTurnRemainSec = 15;
      if (!modalState.busy) {
        appendModalBattleLog('⏱ 15초 시간 초과! 자동으로 [방어] 자세를 취하고 턴을 넘깁니다.');
        await mBattleCmd('def');
      } else if (modalState.isMultiBattle) {
        appendModalBattleLog('⏱ 상대 응답 시간 초과! 전투 진행 권한을 승계하여 다음 턴으로 진행합니다.');
        await forceAdvanceStalledMultiTurn();
      } else if (modalState.isPvp) {
        appendModalBattleLog('⏱ 상대 응답 시간 초과! 턴을 강제 회수합니다.');
        modalState.busy = false;
        renderModalBattleHp();
      }
    }
  }, 1000);
}

// 모달 닫힐 때 전투 ID를 closedBattleIds에 기록해 지연 패킷 차단 & 타이머 정리
const _baseCloseCenterModal = closeCenterModal;
closeCenterModal = function() {
  if (modalState.battleId) {
    closedBattleIds.add(modalState.battleId);
  }
  stopBattleTurnTimer();
  _baseCloseCenterModal();
};

// 전투 시작 시 타이머 자동 작동
const _baseStartBattleModal = startBattleModal;
startBattleModal = async function(targetId, opts = {}) {
  await _baseStartBattleModal(targetId, opts);
  if (modalState.mode === 'battle') startBattleTurnTimer();
};

const _baseOpenLiveMultiBattleModal = openLiveMultiBattleModal;
openLiveMultiBattleModal = async function(clash, mySide, opts = {}) {
  if (clash && closedBattleIds.has(clash.battleId)) return;
  await _baseOpenLiveMultiBattleModal(clash, mySide, opts);
  if (modalState.mode === 'battle') startBattleTurnTimer();
};

// 내 행동 입력 시 15초 타이머 초기화
const _baseMBattleCmd = mBattleCmd;
mBattleCmd = async function(cmd) {
  battleTurnRemainSec = 15;
  await _baseMBattleCmd(cmd);
};

// 전투창 실시간 채팅 (다인 전투 & 1:1 PvP 모두 지원)
sendBattleChat = async function() {
  const inp = document.getElementById('mBatChatIn');
  const c = getPickedChar();
  if (!inp || !c) return;
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';

  appendModalBattleLog(`[채팅] ${c.name}: ${txt}`);
  const z = play.me.zone || 'all';
  addChatMessage(c.name, txt, play.me.avatar, false, z);

  if (play.code) {
    await sb.from('room_messages').insert([{
      room_code: play.code, sender: c.name, zone: z, msg_type: 'normal', content: txt
    }]);
    if (modalState.isMultiBattle && modalState.battleId) {
      await sb.from('room_messages').insert([{
        room_code: play.code,
        sender: c.name,
        zone: z,
        msg_type: 'p2p_evt',
        content: JSON.stringify({
          kind: 'bat_chat',
          battleId: modalState.battleId,
          text: txt
        })
      }]);
    } else if (modalState.isPvp && modalState.enemyName) {
      await sendPvpTurnAction({ action: 'bat_chat', text: txt });
    }
  }
};
// =========================================================================
// [3단계 패치] 동아리 9종 특기 평준화 + 보건부 타인 치료(+2) + 회복템 + 대화 쿨타임
// =========================================================================

// 1. 동아리 9종 설명 문구 갱신
const UPDATED_CLUB_PERKS = {
  '검도부': '동아리 특기: 근접 피격 시 25% 확률 즉시 반격 (피해 1 + 근력보정) · 같은 동아리 초기 호감도 ♥1',
  '육상부': '동아리 특기: 도주 성공률 +16%, 이동 시간 단축, 이동 시 허기 소모 -1 경감 · 같은 동아리 초기 호감도 ♥1',
  '보건부': '동아리 특기: 자신 및 타인(동료·주변 인물) 치료 아이템 회복량 +2 추가 · 같은 동아리 초기 호감도 ♥1',
  '연극부': '동아리 특기: 대화·협상 성공률 +15%, 주변 NPC 성격(trait) 간파 · 같은 동아리 초기 호감도 ♥1',
  '천문부': '동아리 특기: 탐색 성공률 +10%, 타 동아리 초기 호감도 소폭 보너스 · 같은 동아리 초기 호감도 ♥1',
  '만화부': '동아리 특기: 무기 장착 시 22% 확률로 [급소 포착] 발동 (+1 추가 피해) · 같은 동아리 초기 호감도 ♥1',
  '음악부': '동아리 특기: 연속 공격 명중 시 리듬 콤보(+1 추가 피해, 25% 확률) · 같은 동아리 초기 호감도 ♥1',
  '궁도부': '동아리 특기: 시작 시 원거리 무기 우선 지급 · 원거리 무기 공격력 +1 · 같은 동아리 초기 호감도 ♥1',
  '요리부': '동아리 특기: 음식 섭취 시 허기 회복량 +12 추가 보너스 · 같은 동아리 초기 호감도 ♥1'
};
CLUB_DATA.forEach(cl => {
  if (UPDATED_CLUB_PERKS[cl.name]) cl.perk = UPDATED_CLUB_PERKS[cl.name];
});

// 2. 기존 회복 아이템 상향 & 신규 대용량 회복 아이템 3종 추가
const HEAL_UPGRADES = {
  '반창고': { val: 3, desc: 'HP +3 · 가벼운 상처 회복' },
  '소독약': { val: 4, desc: 'HP +4 · 출혈 치료' },
  '해독제': { val: 4, desc: 'HP +4 · 중독 치료' },
  '붕대': { val: 5, desc: 'HP +5 · 출혈 치료' },
  '진통제': { val: 5, desc: 'HP +5 · 부상 치료' },
  '허브 연고': { val: 5, desc: 'HP +5 · 출혈 및 가벼운 중독 완화' },
  '지혈 거즈': { val: 6, desc: 'HP +6 · 출혈 즉시 지혈' },
  '부목': { val: 6, desc: 'HP +6 · 골절/부상 고정 치료' },
  '복합 해독 캡슐': { val: 6, desc: 'HP +6 · 중독 및 피로 해독' },
  '★ 구급 상자': { val: 9, desc: '★ 희귀 · HP +9 · 출혈/중독/부상 치료' },
  '★ 응급 수혈팩': { val: 11, desc: '★ 희귀 · HP +11 · 심각한 출혈 및 피로 회복' },
  '★ 만능 구급 키트': { val: 15, desc: '★ 희귀 · HP +15 (전량 회복) · 모든 상태이상 완벽 치료' }
};
LOOT_ITEMS.forEach(it => {
  if (HEAL_UPGRADES[it.name]) Object.assign(it, HEAL_UPGRADES[it.name]);
});
STARTER_UTILITIES.forEach(it => {
  if (HEAL_UPGRADES[it.name]) Object.assign(it, HEAL_UPGRADES[it.name]);
});

const NEW_HEAL_ITEMS = [
  { name: '고농축 영양 링거', type: 'heal', val: 8, cures: ['피로', '굶주림'], rare: false, desc: 'HP +8 · 피로 및 굶주림 완화' },
  { name: '★ 군용 외상 응급팩', type: 'heal', val: 12, cures: ['출혈', '부상'], rare: true, desc: '★ 희귀 · HP +12 · 출혈/부상 전문 치료' },
  { name: '★ 생체 재생 앰플', type: 'heal', val: 15, cures: ['출혈', '중독', '부상', '피로', '굶주림'], rare: true, desc: '★ 희귀 · HP +15 (전량 회복) · 모든 상태이상 해제' }
];
NEW_HEAL_ITEMS.forEach(ni => {
  if (!LOOT_ITEMS.some(x => x.name === ni.name)) LOOT_ITEMS.push(ni);
});

const ZONE_EXTRA_HEALS = {
  clinic: ['고농축 영양 링거', '★ 군용 외상 응급팩', '★ 생체 재생 앰플'],
  lab: ['고농축 영양 링거', '★ 생체 재생 앰플'],
  dorm: ['고농축 영양 링거'],
  warehouse: ['★ 군용 외상 응급팩'],
  ruins: ['★ 군용 외상 응급팩']
};
Object.entries(ZONE_EXTRA_HEALS).forEach(([zid, extras]) => {
  const z = ISLAND_ZONES.find(x => x.id === zid);
  if (z && Array.isArray(z.pool)) {
    extras.forEach(nm => { if (!z.pool.includes(nm)) z.pool.push(nm); });
  }
});

// 3. 무기 공격력 동아리 특기 평준화 (궁도부 +1, 만화부 22% +1, 음악부 25% +1)
getEffectiveWeaponDamage = function(c) {
  const strVal = c?.str || 1;
  const w = play.me.weapon;
  const hasWeapon = w && w.name && w.name !== '맨손';
  const strBonus = Math.floor((strVal - 1) * 0.5);
  if (!hasWeapon) {
    return { baseAtk: 1, strBonus, clubBonus: 0, dmg: Math.max(1, 1 + strBonus), clubAtkMsg: '' };
  }
  const baseAtk = w.baseAtk ?? w.atk ?? 4;
  let clubAtkBonus = 0;
  let clubAtkMsg = '';
  if (c?.club === '궁도부' && w.kind === '원거리') {
    clubAtkBonus += 1;
    clubAtkMsg = ' [궁도부 특기 발동: 정밀 사격 +1]';
  } else if (c?.club === '만화부' && Math.random() < 0.22) {
    clubAtkBonus += 1;
    clubAtkMsg = ' [만화부 특기 발동: 급소 포착 +1]';
  } else if (c?.club === '음악부' && Math.random() < 0.25) {
    clubAtkBonus += 1;
    clubAtkMsg = ' [음악부 특기 발동: 리듬 콤보 +1]';
  }
  return {
    baseAtk,
    strBonus,
    clubBonus: clubAtkBonus,
    dmg: Math.max(2, baseAtk + strBonus + clubAtkBonus + Math.floor(Math.random() * 2)),
    clubAtkMsg
  };
};

// 4. 아이템 사용 시 보건부 회복량 +2 / 요리부 허기 +12 반영
const _baseUseBagItem = useBagItem;
useBagItem = async function(idx) {
  if (!play.me.alive || play.finished) return;
  const it = play.me.bag[idx];
  if (!it) return;
  const c = getPickedChar();
  if (it.type === 'heal') {
    play.itemUseCount = (play.itemUseCount || 0) + 1;
    const bonus = (c && c.club === '보건부') ? 2 : 0;
    play.me.hp = Math.min(play.me.maxHp, play.me.hp + (it.val || 3) + bonus);
    if (Array.isArray(it.cures)) it.cures.forEach(cName => removeMyCondition(cName));
    if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
    const healTag = bonus > 0 ? ' [보건부 특기 발동: 회복량 +2]' : '';
    await appendGameLog(`[${fmtClock()}] '${it.name}' 사용 (HP ${play.me.hp}/${play.me.maxHp}, 상태: ${formatConditionsText(play.me.conditions)})${healTag}`);
    play.me.bag.splice(idx, 1);
    await broadcastMyStateSync();
    refreshGameUI();
    return;
  }
  if (it.type === 'food') {
    play.itemUseCount = (play.itemUseCount || 0) + 1;
    const bonus = (c && c.club === '요리부') ? 12 : 0;
    play.me.hunger = Math.min(100, play.me.hunger + (it.val || 20) + bonus);
    if (play.me.hunger >= 30) removeMyCondition('굶주림');
    if (it.name && it.name.includes('전투식량')) removeMyCondition('피로');
    const foodTag = bonus > 0 ? ' [요리부 특기 발동: 허기 회복 +12]' : '';
    await appendGameLog(`[${fmtClock()}] '${it.name}' 섭취 (허기 ${play.me.hunger}/100)${foodTag}`);
    play.me.bag.splice(idx, 1);
    await broadcastMyStateSync();
    refreshGameUI();
    return;
  }
  await _baseUseBagItem(idx);
};

// 5. 보건부 전용 타인(동료·주변 인물) 치료 기능 (+2 보너스)
function openMedicHealModal(targetName) {
  if (!play.me.alive || play.finished || isSleepingNow) return;
  const c = getPickedChar();
  if (!c || c.club !== '보건부') return;
  const st = getParticipantState(targetName);
  const healItems = play.me.bag
    .map((it, idx) => ({ it, idx }))
    .filter(x => x.it.type === 'heal');

  const itemBtns = healItems.length
    ? healItems.map(({ it, idx }) => `
        <button type="button" class="modal-act-btn" style="text-align:left;display:flex;justify-content:space-between;" onclick="executeMedicHeal('${esc(targetName)}', ${idx})">
          <span>${esc(it.name)} (기본 +${it.val || 3} → 보건부 +${(it.val || 3) + 2})</span>
          <span>치료하기 ▶</span>
        </button>`).join('')
    : `<div style="font-size:12px;color:#4a4335;padding:8px 0;">가방에 사용할 치료 아이템이 없다.</div>`;

  openCenterModal(`
    <div class="modal-top-bar">보건부 응급 치료 (+2 보너스)</div>
    <div class="enc-card" style="text-align:left;">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">대상: ${esc(targetName)} (현재 HP ${st.hp}/${st.maxHp} · 상태: ${esc(st.condition || '양호')})</div>
      <div style="font-size:11px;color:#3d382d;">보건부 특기로 회복량이 +2 증가하며 출혈/중독/부상/피로 상태이상을 치료합니다.</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;margin-bottom:8px;">
      ${itemBtns}
    </div>
    <button type="button" class="modal-act-btn" style="width:100%;" onclick="closeCenterModal()">닫기</button>
  `);
}

async function executeMedicHeal(targetName, bagIdx) {
  const it = play.me.bag[bagIdx];
  if (!it || it.type !== 'heal') return closeCenterModal();
  play.me.bag.splice(bagIdx, 1);
  play.itemUseCount = (play.itemUseCount || 0) + 1;
  closeCenterModal();

  const healAmt = (it.val || 3) + 2;
  const cures = Array.isArray(it.cures) ? it.cures : [];
  const c = getPickedChar();

  if (isHumanPlayerName(targetName)) {
    const h = humanStateMap[targetName] || {};
    const nextHp = Math.min(15, (h.hp ?? 15) + healAmt);
    h.hp = nextHp;
    humanStateMap[targetName] = h;
    const targetRow = play.players.find(p => p.name === targetName);
    if (targetRow) targetRow.hp = nextHp;
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '보건부',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'medic_heal', to: targetName, healAmt, cures, itemName: it.name })
    }]);
    await appendGameLog(`[${fmtClock()}] 【보건부 치료】 ${targetName}에게 '${it.name}'을(를) 사용해 치료해주었다! (HP +${healAmt})`, true);
  } else {
    const st = getNpcState(targetName);
    const pRow = play.players.find(p => p.name === targetName);
    const curHp = pRow ? (pRow.hp ?? st.hp ?? 15) : (st.hp ?? 15);
    const nextHp = Math.min(15, curHp + healAmt);
    st.hp = nextHp;
    if (cures.includes(st.condition)) st.condition = '양호';
    if (pRow) {
      pRow.hp = nextHp;
      await sb.from('room_players').update({ hp: nextHp }).eq('id', pRow.id);
    }
    const affGain = 14 + Math.floor(Math.random() * 7);
    const res = gainAffinityPoints(targetName, affGain);
    play.socialCount = (play.socialCount || 0) + 1;
    await appendGameLog(`[${fmtClock()}] 【보건부 치료】 ${targetName}에게 '${it.name}'을(를) 사용해 상처를 치료했다! (HP ${nextHp}/15 · 호감도 대폭 상승 ${renderHearts(res.hearts)})`, true);
    pushDialogueToChat(`${targetName} (${renderHearts(res.hearts)})`, '고마워… 손길이 정말 능숙하네. 덕분에 살 것 같아!', { zone: play.me.zone, broadcast: true });
  }
  await broadcastMyStateSync();
  refreshGameUI();
}

// 6. 동료 메뉴 & 주변 인물 목록에 보건부 [치료] 버튼 자동 노출
const _baseOpenAllyInteractionMenu = openAllyInteractionMenu;
openAllyInteractionMenu = function(name) {
  _baseOpenAllyInteractionMenu(name);
  const c = getPickedChar();
  const menu = document.getElementById('refAllyMenu');
  if (c && c.club === '보건부' && menu && menu.style.display === 'block') {
    const grid = menu.querySelector('.ref-ally-grid');
    if (grid && !grid.querySelector('.medic-heal-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ref-ally-act-btn medic-heal-btn';
      btn.style.background = '#eae2ce';
      btn.style.fontWeight = 'bold';
      btn.textContent = '치료해주기 (+2)';
      btn.onclick = () => openMedicHealModal(name);
      grid.prepend(btn);
    }
  }
};

const _baseRefreshGameUIForMedic = refreshGameUI;
refreshGameUI = function() {
  _baseRefreshGameUIForMedic();
  const c = getPickedChar();
  if (!c || c.club !== '보건부') return;
  const locked = !play.me.alive || play.finished || isSleepingNow;
  document.querySelectorAll('#refNearList .ref-near-entry').forEach(entry => {
    const nameEl = entry.querySelector('.ref-near-name');
    const btnsEl = entry.querySelector('.ref-near-btns');
    if (!nameEl || !btnsEl || btnsEl.querySelector('.medic-near-btn')) return;
    const rawName = nameEl.textContent.replace(/유저.*$/, '').replace(/HP\s*\d+.*$/, '').trim();
    if (!rawName) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ref-mini-btn medic-near-btn';
    btn.disabled = locked;
    btn.textContent = '치료';
    btn.onclick = () => openMedicHealModal(rawName);
    btnsEl.appendChild(btn);
  });
};

// 7. NPC 대화 연타 방지 4초 쿨타임
const npcTalkCooldownMap = {};
const _baseTalkNearNpc = talkNearNpc;
talkNearNpc = async function(npcName) {
  if (isSleepingNow || isHumanPlayerName(npcName)) return;
  const now = Date.now();
  const until = npcTalkCooldownMap[npcName] || 0;
  if (now < until) {
    const leftSec = Math.ceil((until - now) / 1000);
    await appendGameLog(`[${fmtClock()}] ${npcName}과(와)는 잠시 숨을 고른 뒤 대화할 수 있다. (${leftSec}초 대기)`, true);
    return;
  }
  npcTalkCooldownMap[npcName] = now + 4000;
  await _baseTalkNearNpc(npcName);
};
// =========================================================================
// [4단계 패치] 성인식/연인식 게임 모드 + 허기/NPC 교전 현실화 + 동반 자결
// =========================================================================

waitRoom.gameMode = 'adult';
play.gameMode = 'adult';
play.hadInitialPartner = false;
play.brokeInitialPartner = false;

// 1. 대기실 옵션 UI에 게임 모드(성인식/연인식) 버튼 상태 반영
const _baseRenderWaitRoomUI = renderWaitRoomUI;
renderWaitRoomUI = function() {
  _baseRenderWaitRoomUI();
  const mode = waitRoom.gameMode || 'adult';
  const btnA = document.getElementById('optModeAdult');
  const btnL = document.getElementById('optModeLover');
  if (btnA) {
    btnA.classList.toggle('on', mode === 'adult');
    btnA.disabled = !waitRoom.host;
  }
  if (btnL) {
    btnL.classList.toggle('on', mode === 'lover');
    btnL.disabled = !waitRoom.host;
  }
};

// 옵션 변경 브로드캐스트에 gameMode 포함
setWaitOption = async function(key, val) {
  if (!waitRoom.host || !waitRoom.code) return;
  waitRoom[key] = val;
  renderWaitRoomUI();
  await sb.from('room_messages').insert([{
    room_code: waitRoom.code,
    sender: 'SYS',
    zone: 'wait',
    msg_type: 'wait_opt',
    content: JSON.stringify({
      gameMode: waitRoom.gameMode || 'adult',
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat
    })
  }]);
};

// 방장 멀티 시작 시 gameMode 전달
hostStartWaitRoomMatch = async function() {
  if (!waitRoom.host || !waitRoom.code) return;
  const mainBtn = document.getElementById('waitMainActionBtn');
  if (mainBtn) {
    mainBtn.disabled = true;
    mainBtn.textContent = '시뮬레이션 시작 중...';
  }
  try {
    const c = getPickedChar();
    const humanCnt = Math.max(1, waitRoom.members.length);
    const npcCnt = await insertMatchedNpcs(waitRoom.code, humanCnt);
    await sb.from('rooms').update({ status: 'playing' }).eq('code', waitRoom.code);
    if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
    await launchPlay(waitRoom.code, true, c, npcCnt, false, {
      existingPid: play.pid,
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat,
      gameMode: waitRoom.gameMode || 'adult'
    });
  } catch (err) {
    appendWaitChat('SYS', `시작 중 오류가 발생했습니다: ${err?.message || err}`);
    renderWaitRoomUI();
  }
};

// 솔로 시작 시 드롭다운 모드 반영
startSoloMatch = async function() {
  const c = getPickedChar();
  if (!c) return;
  const selMode = document.getElementById('soloGameModeIn')?.value || 'adult';
  const code = genCode();
  await sb.from('rooms').insert([{
    code, host_name: c.name, title: `${c.name} 솔로`, is_private: true, max_players: 1, status: 'playing', banned_zones: []
  }]);
  const npcCnt = await insertMatchedNpcs(code, 1);
  await launchPlay(code, true, c, npcCnt, true, { gameMode: selMode });
};

// 2. 게임 시작 시 모드 세팅 & 연인식 초기 짝 자동 배정
const _baseLaunchPlayForMode = launchPlay;
launchPlay = async function(code, isHost, c, spawnNpcCount = null, isSolo = false, opts = {}) {
  const chosenMode = opts.gameMode || waitRoom.gameMode || 'adult';
  await _baseLaunchPlayForMode(code, isHost, c, spawnNpcCount, isSolo, opts);
  play.gameMode = chosenMode;
  play.hadInitialPartner = false;
  play.brokeInitialPartner = false;
  play.initialPartnerName = null;

  const modeLabel = chosenMode === 'lover' ? '戀人式 (연인식 · 최후의 한 쌍)' : '成人式 (성인식 · 최후의 1인)';
  await appendGameLog(`[${fmtClock()}] 【규칙 안내】 이번 회차는 「${modeLabel}」 규칙으로 진행됩니다.`, true);

  if (chosenMode === 'lover') {
    const candidates = play.players.filter(p => p.alive && p.id !== play.pid);
    if (candidates.length > 0) {
      const partner = candidates[Math.floor(Math.random() * candidates.length)];
      play.me.allies = [partner.name];
      play.me.selectedAlly = partner.name;
      play.hadInitialPartner = true;
      play.initialPartnerName = partner.name;
      play.allyCount = 1;
      if (partner.is_npc) {
        affinityPointsMap[partner.name] = Math.max(getAffinityPoints(partner.name), 45);
        getAffinity(partner.name);
        partner.zone = play.me.zone;
        await sb.from('room_players').update({ zone: play.me.zone }).eq('id', partner.id);
      }
      await broadcastMyStateSync();
      await appendGameLog(`[${fmtClock()}] 【반려 서약】 목걸이가 공명하며 '${partner.name}'(${partner.club})와(과) 초기 짝으로 묶였습니다!`, true);
    }
  }
  refreshGameUI();
};

// 3. 연인식 동료 영입 난이도 상향 (기본 하트 2개, 짝 교체 시 하트 3개)
const _baseInteractNearNpc = interactNearNpc;
interactNearNpc = async function(npcName, askJoin = false) {
  if (!askJoin || play.gameMode !== 'lover') {
    return await _baseInteractNearNpc(npcName, askJoin);
  }
  if (!isHumanPlayerName(npcName)) {
    const curAff = getAffinity(npcName);
    const reqHearts = play.brokeInitialPartner ? 3 : 2;
    if (curAff < reqHearts) {
      const warnTxt = play.brokeInitialPartner
        ? `기존 짝을 해제한 이력 때문에 ${npcName}이(가) 강하게 경계하고 있다! (호감도 ♥♥♥♡♡ 이상 필요 · 현재 ${renderHearts(curAff)})`
        : `연인식 규칙에서는 깊은 신뢰가 필요하다. (호감도 ♥♥♡♡♡ 이상 필요 · 현재 ${renderHearts(curAff)})`;
      await appendGameLog(`[${fmtClock()}] ${warnTxt}`, true);
      pushDialogueToChat(`${npcName} (${renderHearts(curAff)})`, '아직 서로를 믿고 목숨을 맡길 사이는 아닌 것 같아.', { zone: play.me.zone, broadcast: true });
      return;
    }
  }
  await _baseInteractNearNpc(npcName, askJoin);
};

// 짝 해제 감지 (연인식에서 기존 짝을 풀면 brokeInitialPartner = true)
const _baseDoAllyAction = doAllyAction;
doAllyAction = async function(kind) {
  const targetAlly = play.me.selectedAlly || play.me.allies[0];
  await _baseDoAllyAction(kind);
  if (kind === 'break' && play.gameMode === 'lover' && targetAlly) {
    play.brokeInitialPartner = true;
    await appendGameLog(`[${fmtClock()}] 【서약 파기】 기존 짝과의 유대가 끊어져 다른 참가자들의 경계심이 높아졌습니다. (새 영입 요구 호감도 ♥3)`, true);
  }
};

// 4. 허기 감소 속도 현실화 (시간당 플레이어 -5, NPC -4)
applyHourlyConditions = async function() {
  if (!play.me.alive || play.finished) return;
  const m = play.me;
  m.hunger = Math.max(0, Math.round(m.hunger - 5));
  if (m.hunger < 30) {
    if (addMyCondition('굶주림')) {
      await appendGameLog(`[${fmtClock()}] 허기가 30 미만으로 떨어져 '굶주림' 상태가 되었다. (현재 허기 ${m.hunger})`, true);
    }
  } else {
    removeMyCondition('굶주림');
  }

  if (hasCondition('출혈') || hasCondition('중독')) {
    const activeDot = ['출혈', '중독'].filter(x => hasCondition(x)).join('·');
    m.hp = Math.max(0, m.hp - 1);
    await appendGameLog(`[${fmtClock()}] ${activeDot} 영향으로 HP -1`, true);
    if (play.pid) await sb.from('room_players').update({ hp: m.hp, alive: m.hp > 0 }).eq('id', play.pid);
    if (m.hp === 0) {
      play.deathReason = activeDot;
      await handleMeDead(activeDot);
    }
  } else if (m.hunger === 0) {
    m.hp = Math.max(0, m.hp - 2);
    await appendGameLog(`[${fmtClock()}] 극심한 허기로 HP -2`, true);
    if (play.pid) await sb.from('room_players').update({ hp: m.hp, alive: m.hp > 0 }).eq('id', play.pid);
    if (m.hp === 0) {
      play.deathReason = '아사';
      await handleMeDead('아사');
    }
  }

  await broadcastMyStateSync();

  for (const p of play.players.filter(x => x.is_npc && x.alive)) {
    const st = getNpcState(p.name);
    st.hunger = Math.max(0, st.hunger - 4);
    if (st.hunger < 35) {
      const fIdx = st.bag.findIndex(i => i.type === 'food');
      if (fIdx >= 0) {
        const eaten = st.bag.splice(fIdx, 1)[0];
        st.hunger = Math.min(100, st.hunger + (eaten.val || 25));
        if (play.me.allies.includes(p.name)) {
          await appendGameLog(`[${fmtClock()}] 동료 ${p.name}이(가) 소지하던 '${eaten.name}'을(를) 먹어 허기를 채웠다. (${st.hunger}/100)`, true);
        }
      }
    }
    if ((p.hp || 15) <= 9) {
      const hIdx = st.bag.findIndex(i => i.type === 'heal');
      if (hIdx >= 0) {
        const med = st.bag.splice(hIdx, 1)[0];
        p.hp = Math.min(15, (p.hp || 15) + (med.val || 5));
        st.hp = p.hp;
        await sb.from('room_players').update({ hp: p.hp }).eq('id', p.id);
        if (play.me.allies.includes(p.name)) {
          await appendGameLog(`[${fmtClock()}] 동료 ${p.name}이(가) '${med.name}'을(를) 사용해 상처를 치료했다. (HP ${p.hp}/15)`, true);
        }
      }
    }
  }
};

// 5. 연인식 전용 특수 선택지 [목걸이를 맞대고 함께 끝낸다] UI 노출
const _baseRefreshGameUIForLover = refreshGameUI;
refreshGameUI = function() {
  _baseRefreshGameUIForLover();
  const actCol = document.getElementById('refActionCol');
  if (!actCol) return;
  let pactBtn = document.getElementById('refBtnLoverPact');

  const leftZones = ISLAND_ZONES.length - (play.banned || []).length;
  const partnerName = (play.me.allies || [])[0];
  const partnerAlive = partnerName && play.players.some(p => p.name === partnerName && p.alive);
  const maxBond = partnerName && !isHumanPlayerName(partnerName) && getAffinity(partnerName) >= 5;
  const showPact = play.me.alive && !play.finished && play.gameMode === 'lover' && partnerAlive && (leftZones <= 4 || maxBond);

  if (showPact) {
    if (!pactBtn) {
      pactBtn = document.createElement('button');
      pactBtn.type = 'button';
      pactBtn.id = 'refBtnLoverPact';
      pactBtn.className = 'ref-act-btn';
      pactBtn.style.background = '#141c30';
      pactBtn.style.color = '#eae2ce';
      pactBtn.style.borderColor = '#eae2ce';
      pactBtn.textContent = '목걸이를 맞대고 함께 끝낸다';
      pactBtn.onclick = () => triggerLoverDoubleSuicide(partnerName);
      const nearTitle = actCol.querySelector('.ref-panel-bar');
      if (nearTitle) actCol.insertBefore(pactBtn, nearTitle);
      else actCol.appendChild(pactBtn);
    }
    pactBtn.disabled = isSleepingNow || play.actionSec > 0;
  } else if (pactBtn) {
    pactBtn.remove();
  }
};
// =========================================================================
// [5단계 패치] 오프닝 6컷 + 32명 지급품 공지 + 10종 희생 컷신 + 엔딩 분기
// =========================================================================

let cutsceneQueue = [];
let cutsceneIdx = 0;
let cutsceneDoneCallback = null;
let cutsceneWaitingPeers = false;
let storyDonePeers = new Set();
let endgameTriggered = false;

// 1. 컷신 제어 함수 (index.html의 #cutsceneModal 연동)
function startCutscene(slides, onComplete, headerTag = '第 57 回') {
  cutsceneQueue = Array.isArray(slides) ? slides : [];
  cutsceneIdx = 0;
  cutsceneDoneCallback = onComplete || null;
  cutsceneWaitingPeers = false;

  const modal = document.getElementById('cutsceneModal');
  const hTag = document.getElementById('cutsceneHeaderTag');
  const skipBtn = document.getElementById('cutsceneSkipBtn');
  if (!modal || !cutsceneQueue.length) {
    if (cutsceneDoneCallback) cutsceneDoneCallback();
    return;
  }
  if (hTag) hTag.textContent = headerTag;
  if (skipBtn) skipBtn.style.display = '';
  play.paused = true;
  modal.classList.add('open');
  renderCutsceneSlide();
}

function renderCutsceneSlide() {
  const slide = cutsceneQueue[cutsceneIdx];
  if (!slide) return finishCutscene();
  const visBox = document.getElementById('cutsceneVisualBox');
  const dlgBox = document.getElementById('cutsceneDialogue');
  const curEl = document.getElementById('cutsceneCursor');
  if (visBox) visBox.innerHTML = slide.visual || '';
  if (dlgBox) dlgBox.innerHTML = slide.text || '';
  if (curEl) curEl.textContent = (cutsceneIdx >= cutsceneQueue.length - 1) ? '■' : '▼';
}

function advanceCutscene() {
  if (cutsceneWaitingPeers) return;
  sfx.click();
  cutsceneIdx++;
  if (cutsceneIdx >= cutsceneQueue.length) {
    finishCutscene();
  } else {
    renderCutsceneSlide();
  }
}

function skipCutscene() {
  if (cutsceneWaitingPeers) return;
  sfx.click();
  finishCutscene();
}

async function finishCutscene() {
  const modal = document.getElementById('cutsceneModal');
  if (modal) modal.classList.remove('open');
  play.paused = false;
  const cb = cutsceneDoneCallback;
  cutsceneDoneCallback = null;
  if (cb) await cb();
}

// 2. 오프닝 6컷 생성 (위 타이틀 화면 고정, 아래 대사창만 변경)
function buildOpeningCutscenes(c) {
  const wepName = play.me.bag[0]?.name || '무기';
  const foodName = play.me.bag[1]?.name || '식량';
  const utilName = play.me.bag[2]?.name || '도구';

  const fixedVisual = play.gameMode === 'lover'
    ? `<div style="font-size:28px;letter-spacing:6px;color:#eae2ce;">第 57 回 · 戀人式</div><div style="font-size:12px;color:#8eb8ff;margin-top:8px;">— 연인식 프로젝트 —</div>`
    : `<div style="font-size:28px;letter-spacing:6px;color:#eae2ce;">第 57 回 · 成人式</div><div style="font-size:12px;color:#8eb8ff;margin-top:8px;">— 성인식 프로젝트 —</div>`;

  const bagSlide = {
    visual: fixedVisual,
    text: `가방을 열어보니 <strong>[${esc(wepName)}]</strong>, <strong>[${esc(foodName)}]</strong>, <strong>[${esc(utilName)}]</strong>이(가) 들어 있었다.`
  };

  if (play.gameMode === 'lover') {
    const pName = play.initialPartnerName || play.me.allies[0] || '반려';
    return [
      { visual: fixedVisual, text: `차가운 철문이 닫히고, 목에 채워진 쇠목걸이에서 낮은 전자음이 울린다.` },
      { visual: fixedVisual, text: `어른들은 말했다. 혼자서는 결코 어른이 될 수 없으니, 반드시 서로를 지킬 짝을 찾으라고.` },
      { visual: fixedVisual, text: `목걸이가 붉게 점멸하며 당신의 반려로 <strong>[${esc(pName)}]</strong>을(를) 지정했다.` },
      { visual: fixedVisual, text: `이 섬을 나갈 수 있는 것은 오직 <strong>살아남은 한 연인</strong>뿐. 짝을 잃은 채 홀로 남으면 목걸이가 작동한다.` },
      { visual: fixedVisual, text: `반드시 둘이서 끝까지 살아남아라. 제 57회 연인식이 지금 시작된다.` },
      bagSlide
    ];
  }

  return [
    { visual: fixedVisual, text: `눈을 뜨자 낯선 섬의 서늘한 바닷바람과 함께 목걸이의 잠금장치가 맞물렸다.` },
    { visual: fixedVisual, text: `통제실의 스피커가 울린다. "오늘부로 너희는 보호받는 아이가 아니다. 스스로의 생존을 증명해라."` },
    { visual: fixedVisual, text: `동급생도, 같은 동아리 부원도 모두 이 섬에서는 경쟁자일 뿐이다.` },
    { visual: fixedVisual, text: `<strong>"오직 1명만이 어른이 되어 섬을 나간다."</strong> 동맹을 맺더라도 마지막 순간엔 단 한 명만 남는다.` },
    { visual: fixedVisual, text: `시간마다 금지 구역이 늘어난다. 살아남아 섬의 문을 열어라.` },
    bagSlide
  ];
}
// 3. 전 참가자 지급 무기 공지 비활성화
async function announceAllStarterWeapons() {
  return;
}
// 4. launchPlay 확장: 오프닝 컷신 재생 + 멀티 전원 열람 동기화 + 지급품 공지
const _baseLaunchPlayWithCutscene = launchPlay;
launchPlay = async function(code, isHost, c, spawnNpcCount = null, isSolo = false, opts = {}) {
  endgameTriggered = false;
  storyDonePeers = new Set();
  await _baseLaunchPlayWithCutscene(code, isHost, c, spawnNpcCount, isSolo, opts);

  const slides = buildOpeningCutscenes(c);
  const headerTag = play.gameMode === 'lover' ? '第 57 回 · 戀人式' : '第 57 回 · 成人式';

  startCutscene(slides, async () => {
    if (play.isSolo) {
      await announceAllStarterWeapons();
      return;
    }

    const myName = c?.name || '실험체';
    storyDonePeers.add(myName);
    const humanPlayers = play.players.filter(p => !p.is_npc);
    const totalHumans = Math.max(1, humanPlayers.length);

    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: myName,
      zone: 'all',
      msg_type: 'story_done',
      content: myName
    }]);

    if (storyDonePeers.size < totalHumans) {
      cutsceneWaitingPeers = true;
      play.paused = true;
      const modal = document.getElementById('cutsceneModal');
      const visBox = document.getElementById('cutsceneVisualBox');
      const dlgBox = document.getElementById('cutsceneDialogue');
      const skipBtn = document.getElementById('cutsceneSkipBtn');
      const curEl = document.getElementById('cutsceneCursor');
      if (skipBtn) skipBtn.style.display = 'none';
      if (curEl) curEl.textContent = '…';
      if (visBox) visBox.innerHTML = `<div style="font-size:16px;color:#8eb8ff;">【 대기 중 】</div>`;
      if (dlgBox) dlgBox.innerHTML = `다른 실험체들이 이야기를 마칠 때까지 대기하는 중입니다... (${storyDonePeers.size} / ${totalHumans}명 완료)`;
      if (modal) modal.classList.add('open');

      // 18초 안전 타임아웃 (네트워크 지연 시 무한 대기 방지)
      setTimeout(async () => {
        if (cutsceneWaitingPeers) {
          cutsceneWaitingPeers = false;
          play.paused = false;
          if (modal) modal.classList.remove('open');
          await announceAllStarterWeapons();
        }
      }, 18000);
    } else {
      await announceAllStarterWeapons();
    }
  }, headerTag);
};

// 5. 실시간 메시지에서 story_done 및 특수 엔딩/치료 패킷 수신 처리
const _baseBindGameRealtime = bindGameRealtime;
bindGameRealtime = function() {
  _baseBindGameRealtime();
  if (!play.code) return;
  const syncChan = sb.channel('ext-sync-' + play.code)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${play.code}` }, async p => {
      const msg = p.new;
      const myName = getPickedChar()?.name;

      if (msg.msg_type === 'story_done') {
        storyDonePeers.add(msg.sender);
        const totalHumans = Math.max(1, play.players.filter(x => !x.is_npc).length);
        if (cutsceneWaitingPeers) {
          const dlgBox = document.getElementById('cutsceneDialogue');
          if (dlgBox) dlgBox.innerHTML = `다른 실험체들이 이야기를 마칠 때까지 대기하는 중입니다... (${storyDonePeers.size} / ${totalHumans}명 완료)`;
          if (storyDonePeers.size >= totalHumans) {
            cutsceneWaitingPeers = false;
            play.paused = false;
            const modal = document.getElementById('cutsceneModal');
            if (modal) modal.classList.remove('open');
            await announceAllStarterWeapons();
          }
        }
      } else if (msg.msg_type === 'p2p_evt' && msg.sender !== myName) {
        try {
          const ev = JSON.parse(msg.content);
          if (ev.kind === 'medic_heal' && ev.to === myName) {
            play.me.hp = Math.min(play.me.maxHp, play.me.hp + (ev.healAmt || 5));
            if (Array.isArray(ev.cures)) ev.cures.forEach(cn => removeMyCondition(cn));
            if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
            await appendGameLog(`[${fmtClock()}] 【보건부 치료】 ${msg.sender}님이 '${ev.itemName}'(으)로 치료해 주었습니다! (HP ${play.me.hp}/${play.me.maxHp})`, true);
            await broadcastMyStateSync();
            refreshGameUI();
          } else if (ev.kind === 'bat_chat' && modalState.mode === 'battle' && modalState.battleId === ev.battleId) {
            appendModalBattleLog(`[채팅] ${msg.sender}: ${ev.text}`);
          } else if (ev.kind === 'lover_pact_end' && ev.to === myName && !endgameTriggered) {
            await playDoubleSuicideEnding(msg.sender);
          }
        } catch (e) {}
      }
    })
    .subscribe();
};

// 6. 10종 성격별 동료 희생 대사 스크립트
const TRAIT_SACRIFICE_SCRIPTS = {
  '호전적': '하, 마지막까지 살아남는 놈이 제일 강한 거랬지. 내 몫까지 짓밟고 걸어 나가라고. …야, 절대 뒤돌아보지 마. 네가 이기는 게 곧 내가 이기는 거니까.',
  '겁쟁이': '무서워… 사실 지금도 손이 너무 떨려서 죽을 것 같아. 그치만 네가 죽는 건 더 무서워…! 그러니까 내 몫까지 꼭 살아남아 줘, 응…?',
  '기회주의': '계산이 완전히 틀려먹었네. 내 목숨을 걸고 너를 살리는 게, 내 인생에서 제일 밑지는 장사일 줄 알았는데… 이상하게 후회가 안 돼. 잘 살아남아.',
  '이타적': '괜찮아, 울지 마. 처음부터 너를 지킬 수 있다면 그것만으로 충분하다고 생각했으니까. 부디 섬 밖에서 내 몫까지 따뜻하게 살아 줘.',
  '냉정형': '생존 확률을 계산해 봤다. 둘 중 하나만 나갈 수 있다면, 네가 살아남는 쪽이 가장 합리적인 결론이야. …감상적인 말은 생략하지. 반드시 살아나가라.',
  '신중형': '수십 번을 고민하고 내린 결정이야. 네가 내 곁에서 보여준 믿음에 보답할 방법은 이것뿐이니까. 마지막 문이 열릴 때까지 절대 방심하지 마.',
  '감정형': '이 비극의 마지막 장면은 내가 장식할게! 네가 살아남아서 나를 기억해 준다면, 나는 영원히 죽지 않는 거잖아…! 사랑했어, 정말로!',
  '자유형': '어른들이 짜놓은 각본대로 서로 죽이는 건 재미없잖아? 내 마지막 선택은 내가 정해. 넌 자유롭게 밖으로 걸어 나가, 그게 내 소원이야.',
  '관찰형': '네가 걸어온 모든 발자국을 지켜봐 왔어. 너라면 이 지옥을 끝내고도 무너지지 않을 거야. 내 마지막 기록은 네 생존으로 완성할게.',
  '돌격형': '마지막 길을 뚫는 건 내 역할이지! 어정쩡하게 망설이지 말고 당당하게 걸어 나가라고! 네 앞길은 내가 전부 열어 뒀으니까!'
};

// 7. 엔딩 컷신 연출 함수 (칭호 지급 없이 엔딩 컷신 분기 후 결과 보고서 연결)
async function playAdultWinEnding() {
  if (endgameTriggered) return;
  endgameTriggered = true;
  closeCenterModal();
  const c = getPickedChar();
  const slides = [
    {
      visual: `<div style="font-size:22px;color:#eae2ce;">【 成人式 · 최후의 1인 】</div>`,
      text: `섬의 모든 소음이 멎었다. 살아남은 숨결은 오직 <strong>${esc(c?.name || '당신')}</strong> 하나뿐이다.`
    },
    {
      visual: `<div style="font-size:16px;color:#8eb8ff;">목걸이 잠금 해제</div>`,
      text: `철컥— 목을 조이던 쇠목걸이가 바닥으로 떨어지고, 선착장의 굳게 닫힌 철문이 열린다.`
    },
    {
      visual: `<div style="font-size:20px;font-weight:bold;color:#eae2ce;">생존자 : ${esc(c?.name || '실험체')} (1위)</div>`,
      text: `제 57회 성인식 종료. 당신은 피로 물든 섬을 뒤로하고 홀로 바깥세상으로 걸어 나갔다.`
    }
  ];
  startCutscene(slides, async () => {
    play.deathReason = '제 57회 성인식 최후의 1인 우승';
    play.deathRank = 1;
    await recordCharResult(1, true);
    await finishAndCleanupRoom('성인식 우승', play.deathReason, 1, true);
  }, '第 57 回 · 成人式 終幕');
}

async function playAdultSacrificeEnding(allyName) {
  if (endgameTriggered) return;
  endgameTriggered = true;
  closeCenterModal();
  const c = getPickedChar();
  const npc = NPC_ROSTER.find(n => n.name === allyName);
  const trait = npc?.trait || '이타적';
  const script = TRAIT_SACRIFICE_SCRIPTS[trait] || TRAIT_SACRIFICE_SCRIPTS['이타적'];

  const allyRow = play.players.find(p => p.name === allyName);
  if (allyRow) {
    allyRow.alive = false;
    allyRow.hp = 0;
    await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', allyRow.id);
  }

  const slides = [
    {
      visual: `<div style="font-size:18px;color:#eae2ce;">【 최종 국면 · 2인 생존 】</div>`,
      text: `섬에 남은 사람은 당신과 <strong>${esc(allyName)}</strong>, 단 두 명뿐. 성인식의 규칙은 오직 1명의 생존만을 허락한다.`
    },
    {
      visual: `<div style="font-size:16px;color:#8eb8ff;">${esc(allyName)} (${esc(trait)} · ♥♥♥♥♥)</div>`,
      text: `${esc(allyName)}이(가) 무기를 내려놓고 당신을 향해 희미하게 웃어 보였다.`
    },
    {
      visual: `<div style="font-size:15px;color:#eae2ce;">"${esc(allyName)}"</div>`,
      text: `"${esc(script)}"`
    },
    {
      visual: `<div style="font-size:20px;font-weight:bold;color:#eae2ce;">엔딩 · 남겨진 자의 걸음</div>`,
      text: `총성과 함께 ${esc(allyName)}의 목걸이가 멈췄다. 당신은 그 희생을 가슴에 품은 채 열린 문 밖으로 걸어 나갔다.`
    }
  ];
  startCutscene(slides, async () => {
    play.deathReason = `${allyName}의 희생으로 성인식 최종 생존`;
    play.deathRank = 1;
    await recordCharResult(1, true);
    await finishAndCleanupRoom('동료 희생 엔딩', play.deathReason, 1, true);
  }, '第 57 回 · 犧牲 終幕');
}

async function playLoverPairWinEnding(partnerName) {
  if (endgameTriggered) return;
  endgameTriggered = true;
  closeCenterModal();
  const c = getPickedChar();
  const slides = [
    {
      visual: `<div style="font-size:22px;color:#eae2ce;">【 戀人式 · 최후의 한 쌍 】</div>`,
      text: `모든 경쟁자가 쓰러지고, 섬에는 <strong>${esc(c?.name || '당신')}</strong>과(와) <strong>${esc(partnerName)}</strong> 단 두 사람만이 남았다.`
    },
    {
      visual: `<div style="font-size:16px;color:#8eb8ff;">반려 서약 성립</div>`,
      text: `두 사람의 목걸이가 동시에 푸른 빛을 내며 잠금이 풀린다. 규칙이 요구한 '한 쌍'이 완성된 것이다.`
    },
    {
      visual: `<div style="font-size:20px;font-weight:bold;color:#eae2ce;">공동 우승 : ${esc(c?.name || '당신')} & ${esc(partnerName)}</div>`,
      text: `제 57회 연인식 종료. 두 사람은 서로의 손을 맞잡은 채 안개 낀 해안선 너머로 함께 걸어 나갔다.`
    }
  ];
  startCutscene(slides, async () => {
    play.deathReason = `${partnerName}과(와) 함께 제 57회 연인식 공동 우승`;
    play.deathRank = 1;
    await recordCharResult(1, true);
    await finishAndCleanupRoom('연인식 공동 우승', play.deathReason, 1, true);
  }, '第 57 回 · 戀人式 終幕');
}

async function playLoverSolitudeDeathEnding() {
  if (endgameTriggered) return;
  endgameTriggered = true;
  closeCenterModal();
  const c = getPickedChar();
  const slides = [
    {
      visual: `<div style="font-size:20px;color:#ffb4a2;">【 경고 · 반려 부재 】</div>`,
      text: `모든 적을 쓰러뜨리고 최후의 1인이 되었지만, 당신의 곁에는 함께할 짝이 남아 있지 않다.`
    },
    {
      visual: `<div style="font-size:16px;color:#8eb8ff;">통제실 안내 방송</div>`,
      text: `"연인식 규칙 위반. 홀로 남은 자에게는 구원이 허락되지 않는다."`
    },
    {
      visual: `<div style="font-size:20px;font-weight:bold;color:#ffb4a2;">엔딩 · 고독한 신부</div>`,
      text: `붉은 경고음과 함께 목걸이가 폭발했다. 끝까지 살아남고도 짝을 잃은 당신은 차가운 바닥 위로 쓰러졌다.`
    }
  ];
  startCutscene(slides, async () => {
    play.me.alive = false;
    play.me.hp = 0;
    play.deathReason = '연인식 규칙 위반 처형 (고독한 신부)';
    play.deathRank = 1;
    if (play.pid) await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', play.pid);
    await recordCharResult(1, false);
    await finishAndCleanupRoom('고독사 처형', play.deathReason, 1, true);
  }, '第 57 回 · 規則 違反');
}

async function triggerLoverDoubleSuicide(partnerName) {
  if (endgameTriggered || !play.me.alive) return;
  if (!confirm(`${partnerName}과(와) 목걸이를 맞대고 함께 생을 마감하시겠습니까?`)) return;
  if (!play.isSolo && play.code && isHumanPlayerName(partnerName)) {
    const c = getPickedChar();
    await sb.from('room_messages').insert([{
      room_code: play.code,
      sender: c?.name || '유저',
      zone: play.me.zone,
      msg_type: 'p2p_evt',
      content: JSON.stringify({ kind: 'lover_pact_end', to: partnerName })
    }]);
  }
  await playDoubleSuicideEnding(partnerName);
}

async function playDoubleSuicideEnding(partnerName) {
  if (endgameTriggered) return;
  endgameTriggered = true;
  closeCenterModal();
  const c = getPickedChar();
  const aliveCnt = Math.max(2, play.players.filter(p => p.alive).length);
  const slides = [
    {
      visual: `<div style="font-size:20px;color:#eae2ce;">【 맹세의 끝 】</div>`,
      text: `어른들이 강요한 살육의 무대 위에서, 당신과 <strong>${esc(partnerName)}</strong>은(는) 서로를 해치는 대신 같은 선택을 내렸다.`
    },
    {
      visual: `<div style="font-size:16px;color:#8eb8ff;">두 개의 목걸이가 맞닿는 소리</div>`,
      text: `"적어도 마지막 순간만큼은, 우리가 스스로 고른 결말로 끝내자."`
    },
    {
      visual: `<div style="font-size:20px;font-weight:bold;color:#eae2ce;">엔딩 · 비익련리 (比翼連理)</div>`,
      text: `눈부신 섬광과 함께 두 사람의 시간이 동시에 멈췄다. 지옥 같은 섬 위에서, 둘은 영원히 헤어지지 않는 한 쌍이 되었다.`
    }
  ];
  startCutscene(slides, async () => {
    play.me.alive = false;
    play.me.hp = 0;
    play.deathReason = `${partnerName}과(와) 동반 자결 (비익련리)`;
    play.deathRank = aliveCnt;
    if (play.pid) await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', play.pid);
    await recordCharResult(aliveCnt, false);
    await finishAndCleanupRoom('비익련리 엔딩', play.deathReason, aliveCnt, true);
  }, '第 57 回 · 比翼連理');
}

// 8. 1초마다 실시간 생존자 수 감시 → 성인식/연인식 최종 국면 자동 분기
setInterval(async () => {
  if (play.finished || endgameTriggered || !play.me.alive || !play.code) return;
  const aliveList = play.players.filter(p => p.alive);
  const totalAlive = aliveList.length;

  // 성인식 모드 최종 국면 체크
  if (play.gameMode !== 'lover') {
    if (totalAlive === 1 && aliveList[0]?.id === play.pid) {
      await playAdultWinEnding();
    } else if (totalAlive === 2 && play.me.allies.length === 1) {
      const allyName = play.me.allies[0];
      const allyAlive = aliveList.some(p => p.name === allyName);
      if (allyAlive && !isHumanPlayerName(allyName)) {
        const pts = getAffinityPoints(allyName);
        if (pts >= 100 || getAffinity(allyName) >= 5) {
          await playAdultSacrificeEnding(allyName);
        } else {
          // 호감도 100pt 미만이면 강제 동맹 파기 및 배신 교전
          play.me.allies = [];
          play.me.selectedAlly = null;
          const allyRow = aliveList.find(p => p.name === allyName);
          await appendGameLog(`[${fmtClock()}] 【배신】 최후의 2인이 되자 ${allyName}이(가) 동맹을 파기하고 칼을 겨눴다!`, true);
          pushDialogueToChat(allyName, '미안하지만… 여기서 나갈 수 있는 건 단 한 명뿐이야!', { zone: play.me.zone, broadcast: true });
          if (allyRow && !modalState.mode) {
            await startBattleModal(allyRow.id, { ambush: true });
          }
        }
      }
    }
  } else {
    // 연인식 모드 최종 국면 체크
    const partnerName = play.me.allies[0];
    const partnerAlive = partnerName && aliveList.some(p => p.name === partnerName);

    if (totalAlive === 2 && partnerAlive) {
      await playLoverPairWinEnding(partnerName);
    } else if (totalAlive === 1 && aliveList[0]?.id === play.pid && !partnerAlive) {
      await playLoverSolitudeDeathEnding();
    }
  }
}, 1000);
// =========================================================================
// [추가 패치] 캐릭터별 상세 전적 & 역대 순위 히스토리 기록
// =========================================================================

function parseCharRankHistory(c) {
  if (!c || !c.title) return [];
  try {
    const parsed = JSON.parse(c.title);
    return Array.isArray(parsed) ? parsed.map(Number).filter(n => n >= 1 && n <= 32) : [];
  } catch (e) {
    return [];
  }
}

// 1. 게임 종료 시 캐릭터별 순위 기록 누적 저장
recordCharResult = async function(rankNum, isWin) {
  if (play.recordedFinish) return;
  play.recordedFinish = true;
  const c = getPickedChar();
  if (!c) return;

  const nextPlays = (c.plays || 0) + 1;
  const nextWins = (c.wins || 0) + (isWin ? 1 : 0);
  const nextBest = c.best_rank ? Math.min(c.best_rank, rankNum) : rankNum;

  const hist = parseCharRankHistory(c);
  hist.unshift(rankNum); // 최신 순위를 맨 앞에 추가
  const trimmedHist = hist.slice(0, 15); // 최근 15판까지 보관
  const serializedHist = JSON.stringify(trimmedHist);

  await sb.from('user_characters').update({
    plays: nextPlays,
    wins: nextWins,
    best_rank: nextBest,
    title: serializedHist
  }).eq('id', c.id);

  c.plays = nextPlays;
  c.wins = nextWins;
  c.best_rank = nextBest;
  c.title = serializedHist;
};

// 2. 캐릭터 상세 창에 총 게임 횟수 / 1위 횟수 / 최고·평균 순위 / 최근 순위 목록 표시
openDetailView = function(id) {
  pickedCharId = id;
  const c = getPickedChar();
  if (!c) return openPickerView();
  const idx = charList.findIndex(x => x.id === id) + 1;
  const pBox = document.getElementById('detailPortrait');
  pBox.innerHTML = c.avatar_data ? `<img src="${c.avatar_data}" alt="">` : esc(c.name.slice(0, 1));
  document.getElementById('detailName').textContent = c.name;
  document.getElementById('detailLine1').textContent = `실험체-${c.exp_number} · ${c.club} · 슬롯 ${idx}`;
  document.getElementById('detailStats').textContent = `근력 ${c.str} · 민첩 ${c.agi} · 운 ${c.luk} · 재주 ${c.dex}`;

  const hist = parseCharRankHistory(c);
  const bestTxt = c.best_rank ? `${c.best_rank}위` : '-';
  const avgTxt = hist.length
    ? `${(hist.reduce((a, b) => a + b, 0) / hist.length).toFixed(1)}위`
    : (c.best_rank ? `${c.best_rank}위` : '-');

  document.getElementById('detailRecordLine').textContent =
    (c.plays || 0) === 0
      ? '첫 시뮬레이션을 앞두고 있다'
      : `총 ${c.plays}회 · 1위 ${c.wins || 0}회 · 최고 ${bestTxt} · 평균 ${avgTxt}`;

  const histEl = document.getElementById('detailRankHistoryVal');
  if (histEl) {
    if (hist.length > 0) {
      histEl.innerHTML = hist.map((r, i) => {
        const badgeStyle = r === 1
          ? 'background:#eae2ce;color:#141c30;padding:1px 5px;font-weight:bold;'
          : 'background:#1b2642;color:#dce8ff;border:1px solid #526a9c;padding:1px 5px;';
        return `<span style="display:inline-block;margin:2px 3px 2px 0;${badgeStyle}">${i === 0 ? '최근 ' : ''}${r}위</span>`;
      }).join('');
    } else if ((c.plays || 0) > 0 && c.best_rank) {
      histEl.textContent = `최고 기록 ${c.best_rank}위 (이전 버전 플레이 ${c.plays}회)`;
    } else {
      histEl.textContent = '아직 기록된 순위가 없습니다.';
    }
  }

  document.getElementById('detailAcctLine').textContent = `${acct.username} 계정으로 로그인됨`;
  document.getElementById('detailMsg').textContent = '';
  showView('viewDetail');
};
// =========================================================================
// [밸런스 최종 조정] 음식 가중치 8 + 다대일 단독 항전 공격 피해 +1 보정
// =========================================================================

// 1. 탐색 드랍 가중치 (일반 8, 음식 8, 힐템 4, 희귀 1)
pickZoneLootItem = function(zoneId) {
  const z = ISLAND_ZONES.find(x => x.id === zoneId);
  const nameList = (z && z.pool && z.pool.length) ? z.pool : LOOT_ITEMS.map(i => i.name);
  const weighted = [];
  nameList.forEach(nm => {
    const meta = LOOT_ITEMS.find(i => i.name === nm);
    const isRare = nm.startsWith('★');
    let weight = 8;
    if (nm === '손전등') weight = 8;
    else if (isRare) weight = 1;
    else if (meta && meta.type === 'food') weight = 8; // 음식 가중치 8
    else if (meta && meta.type === 'heal') weight = 4; // 힐템 드랍 축소
    for (let k = 0; k < weight; k++) weighted.push(nm);
  });
  const chosenName = weighted[Math.floor(Math.random() * weighted.length)] || nameList[0];
  const found = LOOT_ITEMS.find(i => i.name === chosenName) || LOOT_ITEMS[0];
  return ensureItemUid({ ...found });
};

// 2. 플레이어 공격 시: 내가 혼자(1)이고 적 진영이 2명 이상일 때 공격력 +1 보정
const _baseGetEffectiveWeaponDamageForOutnumbered = getEffectiveWeaponDamage;
getEffectiveWeaponDamage = function(c) {
  const res = _baseGetEffectiveWeaponDamageForOutnumbered(c);
  if (modalState.mode !== 'battle') return res;

  let myCount = 1;
  let enCount = 1;
  if (modalState.isMultiBattle && modalState.battleId) {
    const clash = activeZoneClashes[modalState.battleId];
    if (clash) {
      const myTeam = modalState.mySide === 'A' ? clash.sideA : clash.sideB;
      const enTeam = modalState.mySide === 'A' ? clash.sideB : clash.sideA;
      myCount = myTeam.filter(x => x.hp > 0).length;
      enCount = enTeam.filter(x => x.hp > 0).length;
    }
  } else {
    myCount = 1 + (modalState.allyFighters || []).filter(a => a.hp > 0).length;
    enCount = (modalState.enemyHp > 0 ? 1 : 0) + (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0 ? 1 : 0);
  }

  if (myCount === 1 && enCount >= 2) {
    res.dmg += 1;
    res.clubAtkMsg = (res.clubAtkMsg || '') + ' [단독 항전 버프: 다수 상대 위력 +1]';
  }
  return res;
};

// 3. 솔로/1:1 전투에서 적(혼자) vs 아군(다수)일 때 적 단독 항전 버프 (피해 +1 & 회피 +15%)
const _baseMEnemyTurnForOutnumbered = mEnemyTurn;
mEnemyTurn = async function(singleStep = true) {
  const myAliveCnt = 1 + (modalState.allyFighters || []).filter(a => a.hp > 0).length;
  const enAliveCnt = (modalState.enemyHp > 0 ? 1 : 0) + (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0 ? 1 : 0);

  if (myAliveCnt >= 2 && enAliveCnt === 1 && modalState.enemyHp > 0) {
    const hpBefore = play.me.hp;
    await _baseMEnemyTurnForOutnumbered(singleStep);
    if (play.me.alive && play.me.hp < hpBefore && modalState.mode === 'battle') {
      const extra = 1;
      play.me.hp = Math.max(0, play.me.hp - extra);
      if (play.pid) await sb.from('room_players').update({ hp: play.me.hp, alive: play.me.hp > 0 }).eq('id', play.pid);
      appendModalBattleLog(`[단독 항전] 수적 열세에 몰린 ${modalState.enemyName}의 필사적인 일격! 추가 피해 -${extra}`);
      renderModalBattleHp();
      if (play.me.hp === 0) {
        const cause = `${modalState.enemyName}의 필사적인 반격`;
        play.deathReason = cause;
        await new Promise(r => setTimeout(r, 420));
        closeCenterModal();
        await handleMeDead(cause);
      }
    }
    return;
  }
  await _baseMEnemyTurnForOutnumbered(singleStep);
};

// 4. 적 혼자(1) vs 아군 다수(2+)일 때 적의 회피율 +15% 보정
const _baseGetBattleHitProbForOutnumbered = getBattleHitProb;
getBattleHitProb = function(c) {
  let prob = _baseGetBattleHitProbForOutnumbered(c);
  if (modalState.mode !== 'battle') return prob;

  let myCount = 1;
  let enCount = 1;
  if (modalState.isMultiBattle && modalState.battleId) {
    const clash = activeZoneClashes[modalState.battleId];
    if (clash) {
      const myTeam = modalState.mySide === 'A' ? clash.sideA : clash.sideB;
      const enTeam = modalState.mySide === 'A' ? clash.sideB : clash.sideA;
      myCount = myTeam.filter(x => x.hp > 0).length;
      enCount = enTeam.filter(x => x.hp > 0).length;
    }
  } else {
    myCount = 1 + (modalState.allyFighters || []).filter(a => a.hp > 0).length;
    enCount = (modalState.enemyHp > 0 ? 1 : 0) + (modalState.enemyAllyFighter && modalState.enemyAllyFighter.hp > 0 ? 1 : 0);
  }

  if (myCount >= 2 && enCount === 1) {
    prob = Math.max(0.25, prob - 0.15);
  }
  return prob;
};
// =========================================================================
// [멀티플레이 보완] 다인 전투에서 혼자 싸우는 상대방 공격력 +1 보정
// =========================================================================
const _baseRunNpcTurnsForOutnumbered = runNpcTurnsIfHostInMultiBattle;
runNpcTurnsIfHostInMultiBattle = async function(clash, forceTakeControl = false) {
  if (clash && !clash.ended) {
    const aAlive = (clash.sideA || []).filter(x => x.hp > 0);
    const bAlive = (clash.sideB || []).filter(x => x.hp > 0);
    // 혼자 싸우는 진영의 NPC가 있다면 일시적으로 무기 공격력 +1 보정
    aAlive.forEach(f => { if (f.isNpc) f.weaponAtk = (f._origAtk ?? f.weaponAtk) + (aAlive.length === 1 && bAlive.length >= 2 ? 1 : 0); });
    bAlive.forEach(f => { if (f.isNpc) f.weaponAtk = (f._origAtk ?? f.weaponAtk) + (bAlive.length === 1 && aAlive.length >= 2 ? 1 : 0); });
  }
  await _baseRunNpcTurnsForOutnumbered(clash, forceTakeControl);
};
// =========================================================================
// [테마 전환 & 보고서 등급/막대바 현실화 패치]
// =========================================================================

let currentUiTheme = localStorage.getItem('yeoninsiki_theme') || 'navy';

function setGlobalTheme(theme) {
  currentUiTheme = theme === 'mono' ? 'mono' : 'navy';
  try { localStorage.setItem('yeoninsiki_theme', currentUiTheme); } catch (e) {}
  document.body.classList.toggle('theme-mono', currentUiTheme === 'mono');

  const btnN = document.getElementById('btnThemeNavy');
  const btnM = document.getElementById('btnThemeMono');
  if (btnN) btnN.classList.toggle('on', currentUiTheme === 'navy');
  if (btnM) btnM.classList.toggle('on', currentUiTheme === 'mono');

  // 컷신 모달 배경도 현재 테마에 맞춰 동기화
  const csModal = document.getElementById('cutsceneModal');
  if (csModal) {
    csModal.style.background = currentUiTheme === 'mono' ? '#E0E0DE' : '#182036';
  }
  if (typeof drawIslandMap === 'function') drawIslandMap();
}

// 초기 로드 시 저장된 테마 즉시 적용
setGlobalTheme(currentUiTheme);

// 모노 테마일 때 섬 지도 캔버스도 #E0E0DE / #2D2D2D 톤으로 렌더링
const _baseDrawIslandMap = drawIslandMap;
drawIslandMap = function() {
  if (currentUiTheme !== 'mono') return _baseDrawIslandMap();

  const cv = document.getElementById('islandCanvas');
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  const cssW = cv.clientWidth || 460;
  const cssH = cv.clientHeight || 254;
  if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) {
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
  }

  const cx = cv.getContext('2d');
  cx.save();
  cx.scale(dpr, dpr);
  cx.imageSmoothingEnabled = false;

  const sx = cssW / 460;
  const sy = cssH / 244;
  const sMin = Math.min(sx, sy);

  // 배경 #E0E0DE
  cx.fillStyle = '#E0E0DE';
  cx.fillRect(0, 0, cssW, cssH);

  cx.fillStyle = '#2D2D2D';
  cx.font = '11px DungGeunMo, monospace';
  cx.textAlign = 'left';
  cx.fillText('~~~', 24 * sx, 226 * sy);
  cx.fillText('~~', 416 * sx, 34 * sy);
  cx.fillText('▲N', 426 * sx, 20 * sy);

  // 섬 본체 #2D2D2D
  cx.fillStyle = '#2D2D2D';
  cx.beginPath();
  cx.ellipse(230 * sx, 132 * sy, 182 * sx, 88 * sy, -0.03, 0, Math.PI * 2);
  cx.fill();
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    cx.beginPath();
    cx.arc((230 + Math.cos(a) * 170) * sx, (132 + Math.sin(a) * 78) * sy, 23 * sMin, 0, Math.PI * 2);
    cx.fill();
  }

  cx.strokeStyle = '#6E6E6C';
  cx.lineWidth = 1.2;
  [[152, 82], [166, 86], [88, 134]].forEach(([mx, my]) => {
    cx.beginPath();
    cx.moveTo((mx - 7) * sx, (my + 6) * sy);
    cx.lineTo(mx * sx, (my - 4) * sy);
    cx.lineTo((mx + 7) * sx, (my + 6) * sy);
    cx.stroke();
  });

  cx.fillStyle = '#4A4A48';
  cx.beginPath();
  cx.ellipse(222 * sx, 174 * sy, 22 * sx, 8 * sy, 0, 0, Math.PI * 2);
  cx.fill();

  cx.strokeStyle = '#9E9E9B';
  cx.lineWidth = 1.1;
  cx.setLineDash([2.5, 3]);
  const drawn = new Set();
  ISLAND_ZONES.forEach(z => {
    (z.edges || []).forEach(tid => {
      const target = ISLAND_ZONES.find(x => x.id === tid);
      if (!target) return;
      const key = [z.id, target.id].sort().join('--');
      if (drawn.has(key)) return;
      drawn.add(key);
      cx.beginPath();
      cx.moveTo(z.x * sx, z.y * sy);
      cx.lineTo(target.x * sx, target.y * sy);
      cx.stroke();
    });
  });
  cx.setLineDash([]);

  ISLAND_ZONES.forEach(z => {
    const zx = z.x * sx, zy = z.y * sy, rad = 15 * sMin;
    if (play.nextBanned.includes(z.id) && !play.banned.includes(z.id)) {
      cx.save();
      cx.strokeStyle = '#E0E0DE';
      cx.lineWidth = 1.6;
      cx.setLineDash([3, 3]);
      cx.beginPath();
      cx.arc(zx, zy, rad, 0, Math.PI * 2);
      cx.stroke();
      cx.restore();
    }
    if (play.banned.includes(z.id)) {
      cx.save();
      cx.beginPath();
      cx.arc(zx, zy, rad, 0, Math.PI * 2);
      cx.fillStyle = '#555553';
      cx.fill();
      cx.clip();
      cx.strokeStyle = '#E0E0DE';
      cx.lineWidth = 1.5;
      for (let d = -24; d <= 24; d += 5) {
        cx.beginPath();
        cx.moveTo(zx - rad + d, zy - rad);
        cx.lineTo(zx - rad + d + rad * 1.4, zy + rad);
        cx.stroke();
      }
      cx.restore();
    }
  });

  ISLAND_ZONES.forEach(z => {
    const zx = z.x * sx, zy = z.y * sy;
    const isMe = play.me.zone === z.id;
    const isBan = play.banned.includes(z.id);

    cx.fillStyle = isMe ? '#FFFFFF' : (isBan ? '#7A7A78' : '#E0E0DE');
    cx.fillRect(zx - 3.5, zy - 3.5, 7, 7);

    cx.font = '11px DungGeunMo, monospace';
    cx.textAlign = 'center';
    const labelY = zy + 13 * sy;
    cx.strokeStyle = '#2D2D2D';
    cx.lineWidth = 2.5;
    cx.strokeText(z.name, zx, labelY);
    cx.fillStyle = isBan ? '#9A9A98' : '#E0E0DE';
    cx.fillText(z.name, zx, labelY);

    if (isMe) {
      cx.fillStyle = '#FFFFFF';
      cx.fillText('▼ 나', zx, zy - 7 * sy);
    }
  });

  cx.restore();
};

// 실험 결과 보고서: 막대바 수치 빡빡하게 조정 + 생존 순위(Rank) 반영 등급 상한선 적용
openResultReport = function(cause, rankNum) {
  const c = getPickedChar();
  if (!c) return;
  const finalCause = play.deathReason || cause;
  const finalRank = Math.max(1, Math.min(TARGET_HEADCOUNT, Number(play.deathRank || rankNum || 32)));
  const elapsedSec = Math.max(1, Math.floor((Date.now() - play.sessionStartMs) / 1000));
  const mm = Math.floor(elapsedSec / 60);
  const ss = elapsedSec % 60;

  const kills = play.killCount || 0;
  const combats = play.combatCount || 0;
  const searches = play.searchCount || 0;
  const itemGains = play.itemGainCount || 0;
  const itemUses = play.itemUseCount || 0;
  const moves = play.moveCount || 0;
  const socials = play.socialCount || 0;
  const allies = play.allyCount || 0;
  const affSum = Object.values(affinityPointsMap || {}).reduce((acc, v) => acc + Math.max(0, v - 8), 0);

  // 순위 기반 생존 비율 (32위=0.0 ~ 1위=1.0)
  const rankRatio = (TARGET_HEADCOUNT - finalRank) / (TARGET_HEADCOUNT - 1);

  // 막대바 수치 빡빡하게 산출 (초반 탈락 시 막대바가 거의 안 차고, 오래 버텨야 높게 상승)
  const combatScore = Math.min(100, Math.round(kills * 15 + combats * 4 + rankRatio * 10));
  const surviveScore = Math.min(100, Math.round(Math.pow(rankRatio, 1.35) * 75 + Math.min(25, (elapsedSec / 900) * 25)));
  const allyScore = Math.min(100, Math.round(allies * 18 + Math.min(35, affSum * 0.12) + rankRatio * 10));
  const socialScore = Math.min(100, Math.round(socials * 4 + Math.min(30, affSum * 0.10) + rankRatio * 8));
  const judgeScore = Math.min(100, Math.round(searches * 4 + moves * 3 + rankRatio * 15));
  const agilityScore = Math.min(100, Math.round(moves * 3.5 + Math.max(0, combats - kills) * 4 + rankRatio * 20));
  const witScore = Math.min(100, Math.round(itemGains * 4.5 + itemUses * 5.5 + rankRatio * 12));
  const actionScore = Math.min(100, Math.round((searches + moves + combats + socials + itemUses) * 2.2 + rankRatio * 12));
  const copeScore = Math.min(100, Math.round(itemUses * 6 + kills * 8 + (play.me.hp > 0 ? play.me.hp * 1.2 : 0) + rankRatio * 15));

  // 순위 비중(40%) + 9개 항목 평균(60%)으로 종합 점수 산출
  const avgMetric = (combatScore + surviveScore + allyScore + socialScore + judgeScore + agilityScore + witScore + actionScore + copeScore) / 9;
  const totalScore = Math.round(rankRatio * 40 + avgMetric * 0.60);

  // 최종 등급 산출 (생존 순위 엄격 제한 적용)
  let grade = 'D';
  if (finalRank === 1 && totalScore >= 85) {
    grade = 'S';
  } else if (finalRank <= 3 && totalScore >= 72) {
    grade = 'A';
  } else if (finalRank <= 10 && totalScore >= 52) {
    grade = 'B';
  } else if (finalRank <= 20 && totalScore >= 34) {
    grade = 'C';
  } else {
    grade = 'D';
  }

  const summaryParts = [];
  if (finalRank >= 22 || (elapsedSec < 60 && actionScore < 15)) {
    summaryParts.push('시뮬레이션 초반에 허무하게 탈락하며 뚜렷한 생존 흔적을 남기지 못했다.');
  } else {
    if (kills >= 2) summaryParts.push(`직접 ${kills}명을 제압하며 섬의 주도권을 거머쥔 공격적 행보가 돋보였다.`);
    else if (combats === 0) summaryParts.push('교전을 철저히 회피하며 그림자처럼 몸을 숨기는 생존 전략을 택했다.');
    else summaryParts.push(`총 ${combats}회의 교전을 겪으며 위기 속에서 버텨냈다.`);

    if (allies >= 2) summaryParts.push(`${allies}명의 동료와 유대를 쌓아 다수의 협력 구도를 이끌어냈다.`);
    else if (allies === 1) summaryParts.push('단독 행동 대신 한 명의 동료와 호흡을 맞추며 생존을 도모했다.');
    else if (socials === 0) summaryParts.push('타인과의 교류를 일절 끊은 채 철저한 고독 속에 머물렀다.');

    if (searches >= 4 || itemUses >= 3) summaryParts.push(`탐색 ${searches}회·물자 활용 ${itemUses}회로 현장 자원을 알뜰히 운용했다.`);
    else if (searches === 0) summaryParts.push('주변 탐색조차 시도하지 않아 물자 부족에 시달렸다.');
  }
  const finalComment = summaryParts.join(' ');

  const metrics = [
    ['전투력', combatScore, `처치 ${kills}명 · 교전 ${combats}회`],
    ['생존력', surviveScore, `${finalRank}위 · ${play.day}일차 (${mm}분 ${ss}초)`],
    ['교류력', allyScore, `동료 영입 ${allies}명`],
    ['사교성', socialScore, `대화·교류 ${socials}회`],
    ['판단력', judgeScore, `탐색 ${searches}회 · 이동 ${moves}회`],
    ['순발력', agilityScore, `위기 회피·기동 대응`],
    ['기지력', witScore, `획득 ${itemGains}개 · 사용 ${itemUses}회`],
    ['행동력', actionScore, `총 유효 행동 ${searches + moves + combats + socials + itemUses}회`],
    ['대처력', copeScore, `종료 시 HP ${play.me.hp}/${play.me.maxHp} · 허기 ${play.me.hunger}`]
  ];

  const card = document.getElementById('reportCard');
  card.innerHTML = `
    <div class="report-title">실험 결과 보고서 - 제 ${c.plays || 1}회</div>
    <div class="report-top">
      <div class="report-portrait">${play.me.avatar ? `<img src="${play.me.avatar}" alt="">` : esc(c.name.slice(0, 1))}</div>
      <div>
        <div style="font-size:15px;font-weight:bold;">${esc(c.name)}</div>
        <div style="font-size:12px;">실험체-${c.exp_number} · ${esc(c.club)}</div>
        <div style="font-size:12px;">${finalRank}위 / ${TARGET_HEADCOUNT}명 · ${mm}분 ${ss}초 생존 (종합 ${totalScore}점)</div>
        <div style="font-size:11px;opacity:0.8;margin-top:3px;">사유: ${esc(finalCause)}</div>
      </div>
    </div>
    <div class="report-grade-stamp">
      <span style="font-size:9px;">등급</span>
      <span style="font-size:24px;line-height:1;">${grade}</span>
    </div>
    <div class="report-bars">
      ${metrics.map(([k, v, desc]) => `
        <div class="report-bar-row">
          <span>${esc(k)}</span>
          <div class="report-bar-track"><div class="report-bar-fill" data-w="${v}%"></div></div>
          <span style="opacity:0.85;font-size:10px;">${esc(desc)}</span>
        </div>`).join('')}
    </div>
    <div style="border:2px solid currentColor;padding:8px;font-size:11px;line-height:1.5;margin-bottom:8px;">
      <strong>[사후 분석 총평]</strong> ${esc(finalComment)}
    </div>
    <input type="text" class="txt-input" id="reportMemoIn" placeholder="한줄 소감을 남기세요 (선택)" maxlength="60" style="margin-bottom:8px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <button type="button" class="btn-navy" style="width:100%;font-weight:bold;" onclick="exportTistoryHtmlLog('${esc(finalCause)}', ${finalRank}, '${grade}', ${totalScore}, '${esc(finalComment)}')">로그 출력하기 (HTML)</button>
      <button type="button" class="btn-ivory" style="width:100%;" onclick="closeReportToLobby()">다음 시뮬레이션으로 ▶</button>
    </div>`;

  document.getElementById('reportModal').classList.add('open');
  requestAnimationFrame(() => {
    card.querySelectorAll('.report-bar-fill').forEach(el => { el.style.width = el.dataset.w; });
  });
};
// =========================================================================
// [로그 출력 패치] 모든 구역 유저/NPC/유령 채팅 시간순 전체 기록 및 HTML 출력
// =========================================================================

let fullSessionChatLog = [];

// 1. 새 매치 시작 시 전체 채팅 기록 배열 초기화
const _baseLaunchPlayForFullChat = launchPlay;
launchPlay = async function(code, isHost, c, spawnNpcCount = null, isSolo = false, opts = {}) {
  fullSessionChatLog = [];
  await _baseLaunchPlayForFullChat(code, isHost, c, spawnNpcCount, isSolo, opts);
};

// 2. 내가 보낸 채팅(일반/유령/전투채팅)을 시간·구역과 함께 전체 기록에 저장
const _basePostRefChatForArchive = postRefChat;
postRefChat = async function() {
  const c = getPickedChar();
  const inp = document.getElementById('refChatInput');
  const txt = inp ? inp.value.trim() : '';
  if (!play.finished && c && txt && (play.me.alive || isSpectatingNow)) {
    const zObj = ISLAND_ZONES.find(x => x.id === play.me.zone);
    fullSessionChatLog.push({
      time: fmtClock(),
      zoneName: zObj ? zObj.name : '섬 전체',
      sender: play.me.alive ? c.name : `[사망] ${c.name}`,
      text: txt,
      isSys: false,
      avatar: play.me.avatar || null
    });
  }
  await _basePostRefChatForArchive();
};

const _baseSendBattleChatForArchive = sendBattleChat;
sendBattleChat = async function() {
  const c = getPickedChar();
  const inp = document.getElementById('mBatChatIn');
  const txt = inp ? inp.value.trim() : '';
  if (c && txt) {
    const zObj = ISLAND_ZONES.find(x => x.id === play.me.zone);
    fullSessionChatLog.push({
      time: fmtClock(),
      zoneName: `${zObj ? zObj.name : '섬'}·교전`,
      sender: c.name,
      text: txt,
      isSys: false,
      avatar: play.me.avatar || null
    });
  }
  await _baseSendBattleChatForArchive();
};

// 3. 다른 구역의 모든 유저 채팅·유령 채팅·NPC 대사·속보까지 실시간으로 시간순 수집
const _baseBindGameRealtimeForArchive = bindGameRealtime;
bindGameRealtime = function() {
  _baseBindGameRealtimeForArchive();
  if (!play.code) return;
  const archiveChan = sb.channel('full-archive-' + play.code)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${play.code}` }, p => {
      const msg = p.new;
      const myName = getPickedChar()?.name;
      if (!msg) return;

      // 시스템 속보
      if (msg.msg_type === 'sys') {
        fullSessionChatLog.push({
          time: fmtClock(),
          zoneName: '전체 방송',
          sender: 'SYS',
          text: msg.content,
          isSys: true,
          avatar: null
        });
        return;
      }

      // 다른 구역 포함 모든 유저 일반 채팅 & 유령 채팅
      if (msg.sender !== myName && (!msg.msg_type || msg.msg_type === 'normal' || msg.msg_type === 'ghost')) {
        const zObj = ISLAND_ZONES.find(x => x.id === msg.zone);
        const senderLabel = msg.msg_type === 'ghost' ? `[사망] ${msg.sender}` : msg.sender;
        fullSessionChatLog.push({
          time: fmtClock(),
          zoneName: zObj ? zObj.name : (msg.zone || '전체'),
          sender: senderLabel,
          text: msg.content,
          isSys: false,
          avatar: getParticipantAvatar(msg.sender)
        });
        return;
      }

      // NPC 대사도 시간순으로 함께 기록
      if (msg.msg_type === 'npc_say') {
        try {
          const parsed = JSON.parse(msg.content);
          const zObj = ISLAND_ZONES.find(x => x.id === msg.zone);
          fullSessionChatLog.push({
            time: fmtClock(),
            zoneName: zObj ? zObj.name : (msg.zone || '전체'),
            sender: msg.sender,
            text: parsed.text || msg.content,
            isSys: false,
            avatar: null
          });
        } catch (e) {}
      }
    })
    .subscribe();
};

// 4. 로그 출력하기 (HTML): 전체 구역 채팅 기록을 시간순으로 조립해 출력
exportTistoryHtmlLog = function(cause, rankNum, grade, totalScore, finalComment) {
  const c = getPickedChar();
  if (!c) return;
  const memo = (document.getElementById('reportMemoIn')?.value || '').trim();
  const logHtml = document.getElementById('refGameLog')?.innerHTML || '<p>행동 기록 없음</p>';
  const nowDate = new Date().toLocaleString('ko-KR');

  // 시간순 전체 구역 채팅 조립
  const allChatHtml = fullSessionChatLog.length
    ? fullSessionChatLog.map(item => {
        if (item.isSys) {
          return `<div class="ref-chat-sys">※ [${esc(item.time)}] ${esc(item.text)}</div>`;
        }
        const cleanName = String(item.sender || '').replace(/^\[사망\]\s*/, '').trim();
        const avHtml = item.avatar ? `<img src="${item.avatar}" alt="">` : esc(cleanName.slice(0, 1));
        return `
          <div class="ref-chat-row">
            <div class="ref-chat-av">${avHtml}</div>
            <div>
              <div class="ref-chat-meta">${esc(item.sender)} [${esc(item.zoneName)}] · ${esc(item.time)}</div>
              <div class="ref-chat-bubble">${esc(item.text)}</div>
            </div>
          </div>`;
      }).join('')
    : (document.getElementById('refChatLog')?.innerHTML || '<p>채팅 기록 없음</p>');

  const doc = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>戀人式 기록 - ${esc(c.name)} (제 ${c.plays || 1}회)</title>
<style>
  @font-face {
    font-family: 'DungGeunMo';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/DungGeunMo.woff') format('woff');
  }
  body { background:#182036; color:#eae2ce; font-family:'DungGeunMo', monospace; padding:20px; line-height:1.6; }
  .wrap { max-width:780px; margin:0 auto; background:#141c30; border:3px solid #eae2ce; padding:20px; }
  h1, h2 { background:#eae2ce; color:#141c30; padding:6px 12px; font-size:16px; margin:18px 0 10px; }
  .meta { background:#101729; border:2px solid #8ea3cc; padding:12px; font-size:13px; }
  .box { background:#0e1424; border:2px solid #6f89bd; padding:12px; font-size:12px; max-height:none; }
  .ref-chat-row { display:flex; gap:8px; margin-bottom:8px; }
  .ref-chat-av { width:28px; height:28px; border:1px solid #8ea3cc; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
  .ref-chat-av img { width:100%; height:100%; object-fit:cover; }
  .ref-chat-meta { font-size:11px; color:#8eb8ff; }
  .ref-chat-bubble { background:#192642; border:1px solid #7d95c7; padding:5px 8px; margin-top:2px; }
  .ref-chat-sys { color:#9ec2ff; margin:4px 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>戀人式 (연인식 프로젝트) — 실험 기록 백업</h1>
  <div class="meta">
    <div><strong>실험체:</strong> ${esc(c.name)} (실험체-${c.exp_number} · ${esc(c.club)})</div>
    <div><strong>결과:</strong> ${rankNum}위 / ${TARGET_HEADCOUNT}명 · 종합등급 <strong>${esc(grade)}</strong> (${totalScore}점)</div>
    <div><strong>종료 사유:</strong> ${esc(cause)} · 기록 일시: ${esc(nowDate)}</div>
    <div style="margin-top:6px;color:#a9c4f7;"><strong>[사후 분석 총평]</strong> ${esc(finalComment)}</div>
    ${memo ? `<div style="margin-top:6px;color:#f5efe2;"><strong>[실험체 한줄 소감]</strong> "${esc(memo)}"</div>` : ''}
  </div>
  <h2>1. 행동 및 사건 기록</h2>
  <div class="box">${logHtml}</div>
  <h2>2. 전체 구역 채팅 및 속보 로그 (시간순 통합 · 총 ${fullSessionChatLog.length}건)</h2>
  <div class="box">${allChatHtml}</div>
</div>
</body>
</html>`;

  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `연인식_${c.name}_${c.plays || 1}회차_로그.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
// =========================================================================
// [단체방 시간 조절 패치] 35분 / 40분 / 50분 / 1시간 / 1시간 반 / 2시간 설정
// =========================================================================

waitRoom.durationMin = 35;
play.durationMin = 35;

function getScaledTimingConfig(durationMin) {
  const dur = Math.max(35, Number(durationMin) || 35);
  const scale = dur / 35;
  return {
    durationMin: dur,
    closeCycleSec: Math.round(CLOSE_CYCLE_SEC * scale),
    closeWarnSec: Math.round(CLOSE_WARN_SEC * scale),
    gameMinPerRealSec: GAME_MIN_PER_REAL_SEC / scale
  };
}

// 1. 대기실 UI에 게임 시간 버튼 활성화 상태 동기화
const _baseRenderWaitRoomUIForDur = renderWaitRoomUI;
renderWaitRoomUI = function() {
  _baseRenderWaitRoomUIForDur();
  const curDur = Number(waitRoom.durationMin || 35);
  [35, 40, 50, 60, 90, 120].forEach(m => {
    const btn = document.getElementById('optDur' + m);
    if (btn) {
      btn.classList.toggle('on', curDur === m);
      btn.disabled = !waitRoom.host;
    }
  });
};

// 2. 방장 옵션 변경 시 durationMin 함께 브로드캐스트
setWaitOption = async function(key, val) {
  if (!waitRoom.host || !waitRoom.code) return;
  waitRoom[key] = val;
  renderWaitRoomUI();
  await sb.from('room_messages').insert([{
    room_code: waitRoom.code,
    sender: 'SYS',
    zone: 'wait',
    msg_type: 'wait_opt',
    content: JSON.stringify({
      gameMode: waitRoom.gameMode || 'adult',
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat,
      durationMin: Number(waitRoom.durationMin || 35)
    })
  }]);
};

// 3. 대기실 실시간 수신에서 durationMin 반영 & 방장 시작 시 전달
const _baseBindWaitRoomForDur = bindWaitRoomRealtime;
bindWaitRoomRealtime = function() {
  if (waitRoom.chan) sb.removeChannel(waitRoom.chan);
  waitRoom.chan = sb.channel('wait-' + waitRoom.code)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_code=eq.${waitRoom.code}` }, async () => {
      await reloadWaitRoomMembers();
      const myAv = getPickedChar()?.avatar_data;
      if (myAv && waitRoom.code) {
        await sb.from('room_messages').insert([{
          room_code: waitRoom.code, sender: getPickedChar().name, zone: 'wait', msg_type: 'wait_avatar', content: myAv
        }]);
      }
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_code=eq.${waitRoom.code}` }, async p => {
      const msg = p.new;
      if (msg.msg_type === 'wait_chat' && msg.sender !== getPickedChar()?.name) {
        appendWaitChat(msg.sender, msg.content);
      } else if (msg.msg_type === 'wait_avatar' && msg.sender !== getPickedChar()?.name) {
        humanStateMap[msg.sender] = { ...(humanStateMap[msg.sender] || {}), avatar: msg.content };
        renderWaitRoomUI();
      } else if (msg.msg_type === 'wait_opt') {
        try {
          const parsed = JSON.parse(msg.content);
          waitRoom.gameMode = parsed.gameMode || 'adult';
          waitRoom.spawnMode = parsed.spawnMode || 'random';
          waitRoom.ghostChat = parsed.ghostChat || 'ghost_only';
          waitRoom.durationMin = Number(parsed.durationMin || 35);
          renderWaitRoomUI();
        } catch (e) {}
      } else if (msg.msg_type === 'room_deleted') {
        if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
        waitRoom.code = null; play.pid = null;
        alert('방이 삭제되어 로비로 이동합니다.');
        await startWithCurrentChar();
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${waitRoom.code}` }, async p => {
      if (p.new.status === 'playing') {
        const c = getPickedChar();
        const amIHostNow = waitRoom.host || (p.new.host_name === c?.name);
        if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
        await launchPlay(waitRoom.code, amIHostNow, c, null, false, {
          existingPid: play.pid,
          spawnMode: waitRoom.spawnMode,
          ghostChat: waitRoom.ghostChat,
          gameMode: waitRoom.gameMode || 'adult',
          durationMin: Number(waitRoom.durationMin || 35)
        });
      }
    })
    .subscribe();
};

hostStartWaitRoomMatch = async function() {
  if (!waitRoom.host || !waitRoom.code) return;
  const mainBtn = document.getElementById('waitMainActionBtn');
  if (mainBtn) {
    mainBtn.disabled = true;
    mainBtn.textContent = '시뮬레이션 시작 중...';
  }
  try {
    const c = getPickedChar();
    const humanCnt = Math.max(1, waitRoom.members.length);
    const npcCnt = await insertMatchedNpcs(waitRoom.code, humanCnt);
    await sb.from('rooms').update({ status: 'playing' }).eq('code', waitRoom.code);
    if (waitRoom.chan) { sb.removeChannel(waitRoom.chan); waitRoom.chan = null; }
    await launchPlay(waitRoom.code, true, c, npcCnt, false, {
      existingPid: play.pid,
      spawnMode: waitRoom.spawnMode,
      ghostChat: waitRoom.ghostChat,
      gameMode: waitRoom.gameMode || 'adult',
      durationMin: Number(waitRoom.durationMin || 35)
    });
  } catch (err) {
    appendWaitChat('SYS', `시작 중 오류가 발생했습니다: ${err?.message || err}`);
    renderWaitRoomUI();
  }
};

// 4. launchPlay 시 설정된 게임 시간(durationMin)에 맞춰 폐쇄 주기 및 초기 타이머 적용
const _baseLaunchPlayForDur = launchPlay;
launchPlay = async function(code, isHost, c, spawnNpcCount = null, isSolo = false, opts = {}) {
  const durMin = isSolo ? 35 : Number(opts.durationMin || waitRoom.durationMin || 35);
  await _baseLaunchPlayForDur(code, isHost, c, spawnNpcCount, isSolo, opts);
  play.durationMin = durMin;
  const cfg = getScaledTimingConfig(durMin);
  play.closeSec = cfg.closeCycleSec;

  if (!isSolo && durMin !== 35) {
    const cMin = Math.floor(cfg.closeCycleSec / 60);
    const cSec = cfg.closeCycleSec % 60;
    const durLabel = durMin === 60 ? '1시간' : (durMin === 90 ? '1시간 반' : (durMin === 120 ? '2시간' : `${durMin}분`));
    await appendGameLog(`[${fmtClock()}] 【시간 설정】 단체방 진행 시간 '${durLabel}' 모드 적용 (${cMin}분 ${cSec}초마다 2구역 폐쇄)`, true);
  }
  refreshGameUI();
};

// 5. 실시간 루프에서 선택된 게임 시간 비율에 맞게 시간 흐름 & 폐쇄 주기 동기화
const _origSetInterval = window.setInterval;
startGameLoops = function() {
  if (play.tickTimer) clearInterval(play.tickTimer);
  let tickBusy = false;
  play.tickTimer = _origSetInterval(async () => {
    if (play.paused || play.finished || tickBusy) return;
    tickBusy = true;
    try {
      const cfg = getScaledTimingConfig(play.isSolo ? 35 : (play.durationMin || 35));
      const mult = play.isSolo ? play.speed : 1;
      const minDelta = cfg.gameMinPerRealSec * mult;
      play.minutes += minDelta;
      play.hourTickCarry += minDelta;
      while (play.minutes >= 1440) {
        play.minutes -= 1440;
        play.day++;
      }
      while (play.hourTickCarry >= 60) {
        play.hourTickCarry -= 60;
        await applyHourlyConditions();
        if (play.finished) return;
      }

      const h = Math.floor((play.minutes % 1440) / 60);
      const curPhase = (h >= 6 && h < 18) ? 'day' : 'night';

      if (isSleepingNow && play.me.alive) {
        if (curPhase === 'night') {
          play.nightSleepMinutes = Math.min(180, (play.nightSleepMinutes || 0) + minDelta);
        }
        sleepHealCarry += minDelta;
        if (sleepHealCarry >= 60) {
          sleepHealCarry -= 60;
          if (play.me.hp < play.me.maxHp) {
            play.me.hp = Math.min(play.me.maxHp, play.me.hp + 1);
            if (play.pid) await sb.from('room_players').update({ hp: play.me.hp }).eq('id', play.pid);
          }
          if (play.nightSleepMinutes >= 180) removeMyCondition('피로');
          await broadcastMyStateSync();
        }
      }

      if (curPhase !== lastDayPhase) {
        const prevPhase = lastDayPhase;
        lastDayPhase = curPhase;
        triggerPhaseFlash(curPhase);
        bgm.setMode(curPhase);
        if (curPhase === 'night') {
          play.nightSleepMinutes = 0;
          await appendGameLog(`[${fmtClock()}] 밤이 찾아왔다. 아침이 오기 전까지 3시간 수면이 필요하다.`, true);
        } else if (curPhase === 'day' && prevPhase === 'night') {
          if (play.me.alive) {
            if (play.nightSleepMinutes < 180) {
              addMyCondition('피로');
              await appendGameLog(`[${fmtClock()}] 밤 수면 3시간을 채우지 못해 '피로' 상태가 되었다!`, true);
            } else {
              removeMyCondition('피로');
              await appendGameLog(`[${fmtClock()}] 밤 3시간 수면을 채워 '피로'가 풀렸다.`, true);
            }
            await broadcastMyStateSync();
          }
          watchOvernight = false;
          isSleepingNow = false;
          sleepHealCarry = 0;
          await appendGameLog(`[${fmtClock()}] 날이 밝았다.`, true);
        }
      }

      play.closeSec -= (play.isSolo ? play.speed : 1);

      if (play.host && !play.isSolo && Math.floor(play.closeSec) % 3 === 0) {
        sb.from('room_messages').insert([{
          room_code: play.code,
          sender: 'SYS',
          zone: 'all',
          msg_type: 'time_sync',
          content: JSON.stringify({
            day: play.day,
            minutes: play.minutes,
            closeSec: play.closeSec,
            nextBanned: play.nextBanned,
            banned: play.banned,
            durationMin: play.durationMin
          })
        }]);
      }

      if (play.host && play.closeSec <= cfg.closeWarnSec && play.nextBanned.length === 0) {
        const openAll = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
        if (openAll.length > CLOSE_PER_STEP) {
          const pickedIds = [...openAll].sort(() => Math.random() - 0.5).slice(0, CLOSE_PER_STEP).map(z => z.id);
          play.nextBanned = pickedIds;
          const warnNames = play.nextBanned.map(id => ISLAND_ZONES.find(z => z.id === id)?.name).filter(Boolean);
          if (warnNames.length) {
            const alertMsg = `잠시 후 ${warnNames.join(', ')} 구역 폐쇄 예정!`;
            sfx.beep();
            setMarqueeAlert(alertMsg);
            await appendGameLog(`[${fmtClock()}] 【경고】 ${alertMsg}`, true);
            if (!play.isSolo) {
              await sb.from('room_messages').insert([{
                room_code: play.code,
                sender: 'SYS',
                zone: 'all',
                msg_type: 'close_warn',
                content: JSON.stringify({ nextBanned: play.nextBanned, alertMsg })
              }]);
            }
          }
        }
      }

      if (play.host && play.closeSec <= 0) {
        await triggerZoneClosure();
        play.closeSec = cfg.closeCycleSec;
      }

      // NPC 이동 및 교전 (긴장감 있는 속도로 동작)
      if (play.host) {
        const safe = ISLAND_ZONES.filter(z => !play.banned.includes(z.id));
        const aliveNpcs = play.players.filter(p => p.is_npc && p.alive);
        const lateGame = safe.length <= 10;

        const npcMoveProb = play.day === 1 ? 0.16 : (lateGame ? 0.30 : 0.22);
        if (aliveNpcs.length && safe.length > 0 && Math.random() < npcMoveProb) {
          const npc = aliveNpcs[Math.floor(Math.random() * aliveNpcs.length)];
          if (!play.me.allies.includes(npc.name)) {
            const dest = safe[Math.floor(Math.random() * safe.length)].id;
            npc.zone = dest;
            await sb.from('room_players').update({ zone: dest }).eq('id', npc.id);
          }
        }

        const randomClashProb = play.day === 1 ? 0.024 : (lateGame ? 0.11 : Math.min(0.085, 0.038 + (play.day - 2) * 0.015));
        if (aliveNpcs.length >= 2 && Math.random() < randomClashProb) {
          const attacker = aliveNpcs[Math.floor(Math.random() * aliveNpcs.length)];
          const coPresent = play.players.filter(p => p.alive && p.zone === attacker.zone && p.id !== attacker.id && p.is_npc);
          if (coPresent.length > 0) {
            const victim = coPresent[Math.floor(Math.random() * coPresent.length)];
            const lethalProb = play.day === 1 ? 0.14 : (lateGame ? 0.48 : 0.32);
            const dmg = Math.random() < lethalProb ? (victim.hp || 15) : (4 + Math.floor(Math.random() * 4));
            const nextHp = Math.max(0, (victim.hp || 15) - dmg);
            victim.hp = nextHp;
            if (nextHp === 0) {
              victim.alive = false;
              await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', victim.id);
              const remCnt = Math.max(1, play.players.filter(p => p.alive).length);
              const news = `[속보] ${victim.name}이(가) ${attacker.name}에게 살해당했습니다. (생존 ${remCnt}명)`;
              sfx.deathAlert();
              setMarqueeAlert(`${victim.name} 사망!! (생존 ${remCnt}명)`);
              await appendGameLog(`[${fmtClock()}] ${news}`, true);
              await sb.from('room_messages').insert([{
                room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: news
              }]);
            } else {
              await sb.from('room_players').update({ hp: nextHp }).eq('id', victim.id);
            }
          }
        }
      }

      refreshGameUI();
      drawIslandMap();
    } finally {
      tickBusy = false;
    }
  }, 1000);
};
// =========================================================================
// [전투 동료 피격/전사 & 장소별 모노테마 HTML 로그 추출 패치]
// =========================================================================

// 1. 적이 공격할 때 일정 확률(35%)로 전투 중인 동료 NPC에게도 딜이 들어가며 전사 가능
const _baseMEnemyTurnForAllyHit = mEnemyTurn;
mEnemyTurn = async function(singleStep = true) {
  const aliveAllies = (modalState.allyFighters || []).filter(a => a && a.hp > 0);

  // 아군 동료가 1명 이상 살아있고, 주 공격 대상(나) 외에 35% 확률로 동료 NPC를 공격 대상으로 선택
  if (aliveAllies.length > 0 && modalState.enemyHp > 0 && Math.random() < 0.35) {
    const targetAlly = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
    const enSt = getNpcState(modalState.enemyName);
    const enWep = enSt?.bag?.find(x => x.type === 'weapon');
    const wepName = enWep ? enWep.name : '맨손';
    const baseAtk = enWep ? (enWep.atk || 3) : 2;
    const hitChance = Math.max(0.35, 0.72 - ((targetAlly.agi || 3) - 3) * 0.04);

    if (Math.random() > hitChance) {
      appendModalBattleLog(`${modalState.enemyName}의 공격을 동료 ${targetAlly.name}이(가) 날렵하게 회피했다!`);
    } else {
      const dmg = Math.max(1, baseAtk + Math.floor(Math.random() * 2) - 1);
      targetAlly.hp = Math.max(0, targetAlly.hp - dmg);
      const st = getNpcState(targetAlly.name);
      if (st) st.hp = targetAlly.hp;
      const pRow = play.players.find(p => p.name === targetAlly.name && p.alive);

      appendModalBattleLog(`${modalState.enemyName}이(가) 동료 ${targetAlly.name}을(를) '${wepName}'(으)로 강타! (-${dmg}, 남은 HP ${targetAlly.hp}/15)`);

      if (targetAlly.hp === 0) {
        // 전투 중 동료 NPC 전사 처리
        if (pRow) {
          pRow.hp = 0;
          pRow.alive = false;
          await sb.from('room_players').update({ hp: 0, alive: false }).eq('id', pRow.id);
        }
        play.me.allies = (play.me.allies || []).filter(n => n !== targetAlly.name);
        if (play.me.selectedAlly === targetAlly.name) play.me.selectedAlly = play.me.allies[0] || null;

        const remCnt = Math.max(1, play.players.filter(pl => pl.alive).length);
        const deathNews = `[속보] ${targetAlly.name}이(가) ${modalState.enemyName}와(과)의 교전 중 사망했습니다. (생존 ${remCnt}명)`;
        sfx.deathAlert();
        setMarqueeAlert(`${targetAlly.name} 전사!! (생존 ${remCnt}명)`);
        appendModalBattleLog(`★ 동료 ${targetAlly.name}이(가) 치명상을 입고 쓰러졌다! (동맹 해제)`);
        await appendGameLog(`[${fmtClock()}] ${deathNews}`, true);
        if (!play.isSolo && play.code) {
          await sb.from('room_messages').insert([{
            room_code: play.code, sender: 'SYS', zone: 'all', msg_type: 'sys', content: deathNews
          }]);
        }
        refreshGameUI();
      } else if (pRow) {
        await sb.from('room_players').update({ hp: targetAlly.hp }).eq('id', pRow.id);
      }
      renderModalBattleHp();
    }

    // 적 턴 종료 후 플레이어 턴 복귀 및 살아있는 다른 동료 지원 공격
    modalState.turn = 'player';
    updateModalBattleButtons();
    return;
  }

  // 주 공격 대상(나)을 노릴 때는 기존 적 턴 로직 실행
  await _baseMEnemyTurnForAllyHit(singleStep);
};

// 2. 로그 출력하기 (HTML): 행동/사건 기록 제거 + 장소별 채팅 그룹화 + 고급 모노 테마(#E0E0DE / #2D2D2D)
exportTistoryHtmlLog = function(cause, rankNum, grade, totalScore, finalComment) {
  const c = getPickedChar();
  if (!c) return;
  const memo = (document.getElementById('reportMemoIn')?.value || '').trim();
  const nowDate = new Date().toLocaleString('ko-KR');
  const rawLogs = Array.isArray(fullSessionChatLog) ? fullSessionChatLog : [];

  // 장소(구역)별로 채팅 그룹화 (등장 순서 유지)
  const zoneGroups = new Map();
  rawLogs.forEach(item => {
    const zKey = item.zoneName || '섬 전체';
    if (!zoneGroups.has(zKey)) zoneGroups.set(zKey, []);
    zoneGroups.get(zKey).push(item);
  });

  let zonesSectionHtml = '';
  if (zoneGroups.size === 0) {
    zonesSectionHtml = `<div class="empty-note">기록된 구역별 대화 내역이 없습니다.</div>`;
  } else {
    zoneGroups.forEach((items, zName) => {
      const rowsHtml = items.map(item => {
        if (item.isSys) {
          return `<div class="sys-line"><span class="sys-badge">방송</span> [${esc(item.time)}] ${esc(item.text)}</div>`;
        }
        const cleanName = String(item.sender || '').replace(/^\[사망\]\s*/, '').trim();
        const isGhost = String(item.sender || '').startsWith('[사망]');
        const avHtml = item.avatar
          ? `<img src="${item.avatar}" alt="">`
          : `<span>${esc(cleanName.slice(0, 1) || '?')}</span>`;

        return `
          <div class="chat-row ${isGhost ? 'is-ghost' : ''}">
            <div class="chat-av">${avHtml}</div>
            <div class="chat-body">
              <div class="chat-meta">
                <strong>${esc(item.sender)}</strong>
                <span class="chat-time">${esc(item.time)}</span>
              </div>
              <div class="chat-bubble">${esc(item.text)}</div>
            </div>
          </div>`;
      }).join('');

      zonesSectionHtml += `
        <section class="zone-block">
          <div class="zone-header">
            <span class="zone-title">■ ${esc(zName)}</span>
            <span class="zone-count">대화 ${items.length}건</span>
          </div>
          <div class="zone-body">${rowsHtml}</div>
        </section>`;
    });
  }

  const doc = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>戀人式 기록부 — ${esc(c.name)} (제 ${c.plays || 1}회)</title>
<style>
  @font-face {
    font-family: 'DungGeunMo';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/DungGeunMo.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 28px 16px;
    background: #E0E0DE;
    color: #2D2D2D;
    font-family: 'DungGeunMo', 'Malgun Gothic', monospace;
    line-height: 1.65;
  }
  .archive-sheet {
    max-width: 820px;
    margin: 0 auto;
    background: #E0E0DE;
    border: 3px solid #2D2D2D;
    box-shadow: 0 0 0 3px #E0E0DE, 0 0 0 5px #2D2D2D;
    padding: 24px;
  }
  .doc-header {
    border-bottom: 3px solid #2D2D2D;
    padding-bottom: 14px;
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }
  .doc-title-main {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 3px;
  }
  .doc-title-sub {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 2px;
  }
  .doc-stamp {
    background: #2D2D2D;
    color: #E0E0DE;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
    background: #EBEBE9;
    border: 2px solid #2D2D2D;
    padding: 14px;
    margin-bottom: 14px;
    font-size: 13px;
  }
  .summary-item span.lbl {
    display: inline-block;
    background: #2D2D2D;
    color: #E0E0DE;
    padding: 1px 6px;
    font-size: 11px;
    margin-right: 6px;
  }
  .comment-box {
    background: #D6D6D3;
    border: 2px solid #2D2D2D;
    padding: 12px 14px;
    font-size: 13px;
    margin-bottom: 22px;
  }
  .memo-line {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #2D2D2D;
    font-weight: bold;
  }
  .section-bar {
    background: #2D2D2D;
    color: #E0E0DE;
    padding: 7px 14px;
    font-size: 14px;
    letter-spacing: 1px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
  }
  .zone-block {
    border: 2px solid #2D2D2D;
    background: #EBEBE9;
    margin-bottom: 16px;
  }
  .zone-header {
    background: #D6D6D3;
    border-bottom: 2px solid #2D2D2D;
    padding: 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
  }
  .zone-count {
    font-size: 11px;
    font-weight: normal;
    background: #2D2D2D;
    color: #E0E0DE;
    padding: 1px 7px;
  }
  .zone-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-row {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .chat-row.is-ghost {
    opacity: 0.72;
  }
  .chat-av {
    width: 34px;
    height: 34px;
    background: #2D2D2D;
    color: #E0E0DE;
    border: 1px solid #2D2D2D;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .chat-av img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .chat-body {
    flex: 1;
    min-width: 0;
  }
  .chat-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    margin-bottom: 3px;
  }
  .chat-time {
    font-size: 11px;
    opacity: 0.7;
  }
  .chat-bubble {
    background: #E0E0DE;
    border: 1px solid #2D2D2D;
    padding: 6px 10px;
    font-size: 13px;
    word-break: break-word;
  }
  .sys-line {
    background: #D6D6D3;
    border-left: 3px solid #2D2D2D;
    padding: 5px 10px;
    font-size: 12px;
  }
  .sys-badge {
    background: #2D2D2D;
    color: #E0E0DE;
    padding: 1px 5px;
    font-size: 10px;
    margin-right: 4px;
  }
  .empty-note {
    border: 2px dashed #2D2D2D;
    padding: 20px;
    text-align: center;
    font-size: 13px;
    opacity: 0.75;
  }
  .doc-footer {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 2px solid #2D2D2D;
    font-size: 11px;
    text-align: right;
    opacity: 0.75;
  }
</style>
</head>
<body>
<div class="archive-sheet">
  <header class="doc-header">
    <div>
      <div class="doc-title-main">戀人式 · 實驗現場 대화 기록부</div>
      <div class="doc-title-sub">第 57 回 시뮬레이션 아카이브 · 출력 일시: ${esc(nowDate)}</div>
    </div>
    <div class="doc-stamp">최종 ${rankNum}위 · 등급 ${esc(grade)} (${totalScore}점)</div>
  </header>

  <div class="summary-grid">
    <div class="summary-item"><span class="lbl">실험체</span>${esc(c.name)} (No.${c.exp_number})</div>
    <div class="summary-item"><span class="lbl">소속</span>${esc(c.club)}</div>
    <div class="summary-item"><span class="lbl">종료 사유</span>${esc(cause)}</div>
    <div class="summary-item"><span class="lbl">누적 회차</span>제 ${c.plays || 1}회차 실험</div>
  </div>

  <div class="comment-box">
    <div><strong>[사후 분석 총평]</strong> ${esc(finalComment)}</div>
    ${memo ? `<div class="memo-line">[실험체 한줄 소감] "${esc(memo)}"</div>` : ''}
  </div>

  <div class="section-bar">
    <span>구역(장소)별 현장 대화 아카이브</span>
    <span>총 ${zoneGroups.size}개 구역 · ${rawLogs.length}건</span>
  </div>

  ${zonesSectionHtml}

  <footer class="doc-footer">
    戀人式 (연인식 프로젝트) — 공식 실험 기록 백업 문서
  </footer>
</div>
</body>
</html>`;

  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `연인식_${c.name}_${c.plays || 1}회차_장소별기록부.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};