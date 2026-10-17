/**
 * 우리 반 1인 1역할 배정기 - Pantone Mocha Mousse & Modern Celebration (script.js)
 * 순수 Vanilla JS 로직: 모던 샴페인 쇼크웨이브 & 마이크로 스파클 팡파레, 웜 어쿠스틱 화음, 중앙 정렬 렌더링
 */

// ==========================================
// 1. 기본 예시 데이터 (학생 12명, 학급 역할 12개)
// ==========================================
const DEFAULT_STUDENTS = [
  "김민준", "이서아", "박도윤", "최서연",
  "정하준", "강지아", "조은우", "윤수아",
  "장선우", "임하은", "한유준", "오지우"
];

const DEFAULT_ROLES = [
  { id: 1, title: "칠판 지우미", icon: "🧼", desc: "수업 후 칠판을 깨끗하게 닦고 분필 가루를 털어요." },
  { id: 2, title: "우유 도우미", icon: "🥛", desc: "급식 시간 우유 상자를 챙기고 친구들에게 나눠줘요." },
  { id: 3, title: "불끄기 지킴이", icon: "💡", desc: "쉬는 시간이나 이동 수업 갈 때 교실 전등을 꺼요." },
  { id: 4, title: "창문 환기 대장", icon: "🪟", desc: "맑은 공기가 들어오도록 쉬는 시간마다 창문을 열어요." },
  { id: 5, title: "줄서기 반장", icon: "🚶", desc: "급식실이나 강당에 갈 때 친구들을 바르게 줄세워요." },
  { id: 6, title: "학급 문고 정리왕", icon: "📚", desc: "교실 책꽂이의 책들이 가지런히 꽂히도록 정리해요." },
  { id: 7, title: "식물 집사 🌱", icon: "🌱", desc: "학급 화분에 주기적으로 물을 주고 건강을 살펴요." },
  { id: 8, title: "바닥 청소 지킴이", icon: "🧹", desc: "교실 바닥에 떨어진 쓰레기와 종이를 주워 정돈해요." },
  { id: 9, title: "학습지 배부 도우미", icon: "📄", desc: "선생님 유인물과 학습지를 모둠별로 바르게 나눠줘요." },
  { id: 10, title: "정보 기기 지킴이", icon: "💻", desc: "전자칠판과 교실 컴퓨터 주변을 깔끔하게 정돈해요." },
  { id: 11, title: "사물함 검사관", icon: "🎒", desc: "친구들 사물함 위에 물건이 떨어지지 않게 도와줘요." },
  { id: 12, title: "칭찬 배달부", icon: "💌", desc: "친구들의 착하고 따뜻한 행동을 찾아 칭찬과 응원을 전해요." }
];

// 애플리케이션 상태
let state = {
  className: "행복 가득 3학년 2반",
  students: [...DEFAULT_STUDENTS],
  roles: [...DEFAULT_ROLES],
  assignments: [],
  sheetUrl: "",
  isRolling: false
};

// ==========================================
// 2. 모던 웜 어쿠스틱 사운드 (Web Audio API)
// ==========================================
class ModernAcousticSound {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  // 부드러운 햅틱 글래스 틱
  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Audio might be blocked
    }
  }

  // 모던 로즈 피아노 & 샴페인 하모닉스 화음
  playFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // 세련된 재즈/모던 코드: F4, A4, C5, E5, G5 (F Major 9)
      const chord = [349.23, 440.00, 523.25, 659.25, 783.99];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        // 부드럽게 감싸는 벨(Bell) 사운드 엔벨로프
        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (e) {
      // ignore
    }
  }
}

const sfx = new ModernAcousticSound();

// ==========================================
// 3. 모던 팡파레 효과 (골든 링 쇼크웨이브 & 샴페인 마이크로 스파클)
// ==========================================
class ModernFanfareEffect {
  constructor() {
    this.canvas = document.getElementById("confetti-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.rings = [];
    this.animId = null;
    if (this.canvas) {
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    this.particles = [];
    this.rings = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.38;

    // 1. 모던 쇼크웨이브 펄스 링 2개 생성
    this.rings.push({
      x: centerX,
      y: centerY,
      radius: 10,
      maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.65,
      alpha: 0.6,
      lineWidth: 3,
      speed: 16
    });

    setTimeout(() => {
      this.rings.push({
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.5,
        alpha: 0.45,
        lineWidth: 2,
        speed: 12
      });
    }, 120);

    // 2. 팬톤 웜 샴페인 & 모카 앰버 마이크로 스파클 파티클
    const modernPalette = [
      "#c69c6d", // 웜 골드
      "#8a6552", // 모카 무스
      "#dfba9d", // 샴페인 골드
      "#f5e1d3", // 실키 크림
      "#ffbe98", // 피치 퍼즈
      "#ffffff"  // 화이트 스파클
    ];

    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        radius: Math.random() * 3.5 + 2,
        color: modernPalette[Math.floor(Math.random() * modernPalette.length)],
        alpha: 1,
        friction: 0.94, // 부드러운 감속
        gravity: 0.18,  // 은은한 하강
        sparkleSpeed: Math.random() * 0.2 + 0.1,
        sparkleVal: Math.random() * Math.PI
      });
    }

    if (this.animId) cancelAnimationFrame(this.animId);
    this.animate();
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;

    // 링 그리기
    this.rings.forEach(ring => {
      if (ring.alpha > 0.01 && ring.radius < ring.maxRadius) {
        activeCount++;
        ring.radius += ring.speed;
        ring.alpha *= 0.94;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(198, 156, 109, ${ring.alpha})`;
        this.ctx.lineWidth = ring.lineWidth;
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    // 스파클 파티클 그리기
    this.particles.forEach(p => {
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.012;
      p.sparkleVal += p.sparkleSpeed;

      if (p.alpha > 0.01) {
        activeCount++;
        const currentRadius = Math.max(1, p.radius * (0.8 + 0.4 * Math.sin(p.sparkleVal)));

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.restore();
      }
    });

    if (activeCount > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = null;
    }
  }
}

let fanfare = null;

// ==========================================
// 4. 로컬 스토리지 저장 및 불러오기
// ==========================================
function saveToStorage() {
  try {
    const data = {
      className: state.className,
      students: state.students,
      roles: state.roles,
      assignments: state.assignments,
      sheetUrl: state.sheetUrl
    };
    localStorage.setItem("class_role_picker_pantone_v1", JSON.stringify(data));
  } catch (e) {
    console.warn("저장 오류:", e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("class_role_picker_pantone_v1") || 
                  localStorage.getItem("class_role_picker_apple_v1") || 
                  localStorage.getItem("class_role_picker_v1");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.className) state.className = data.className;
      if (Array.isArray(data.students) && data.students.length > 0) state.students = data.students;
      if (Array.isArray(data.roles) && data.roles.length > 0) state.roles = data.roles;
      if (Array.isArray(data.assignments) && data.assignments.length > 0) state.assignments = data.assignments;
      if (data.sheetUrl) state.sheetUrl = data.sheetUrl;
    }
  } catch (e) {
    console.warn("데이터 로드 실패:", e);
  }

  if (!state.assignments || state.assignments.length === 0) {
    initDefaultAssignments();
  }
}

function initDefaultAssignments() {
  state.assignments = state.roles.map((role, idx) => ({
    roleId: role.id,
    roleTitle: role.title,
    roleIcon: role.icon,
    roleDesc: role.desc,
    studentName: state.students[idx] || "미배정"
  }));
}

// ==========================================
// 5. 역할 무작위 배정 로직 (Fisher-Yates)
// ==========================================
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function assignRolesRandomly() {
  if (state.isRolling) return;
  state.isRolling = true;

  const btnAssign = document.getElementById("btn-assign");
  if (btnAssign) {
    btnAssign.classList.add("rolling");
    btnAssign.disabled = true;
  }

  const cards = document.querySelectorAll(".role-card");
  cards.forEach(card => card.classList.add("shuffling"));

  let tickCount = 0;
  const maxTicks = 12;
  const timer = setInterval(() => {
    sfx.playTick();
    tickCount++;

    const tempStudents = shuffleArray(state.students);
    const nameEls = document.querySelectorAll(".student-name");
    nameEls.forEach((el, i) => {
      if (tempStudents[i]) {
        el.textContent = tempStudents[i];
      }
    });

    if (tickCount >= maxTicks) {
      clearInterval(timer);
      finalizeAssignment();
    }
  }, 70);
}

function finalizeAssignment() {
  const shuffledStudents = shuffleArray(state.students);

  state.assignments = state.roles.map((role, idx) => {
    return {
      roleId: role.id,
      roleTitle: role.title,
      roleIcon: role.icon,
      roleDesc: role.desc,
      studentName: shuffledStudents[idx] || "(공석)"
    };
  });

  saveToStorage();
  renderCards();

  state.isRolling = false;
  const btnAssign = document.getElementById("btn-assign");
  if (btnAssign) {
    btnAssign.classList.remove("rolling");
    btnAssign.disabled = false;
  }

  // 모던 사운드 & 모던 샴페인 쇼크웨이브 팡파레 트리거
  sfx.playFanfare();
  if (fanfare) fanfare.start();

  // 카드에 은은한 골든 아우라 효과 부여
  const cards = document.querySelectorAll(".role-card");
  cards.forEach(card => card.classList.add("celebration-glow"));
  setTimeout(() => {
    cards.forEach(card => card.classList.remove("celebration-glow"));
  }, 1400);

  showToast("✨ 1인 1역할이 성공적으로 배정되었습니다.");
}

// ==========================================
// 6. UI 렌더링 (★ 이름 중앙 정렬 완벽 적용 ★)
// ==========================================
function renderCards() {
  const container = document.getElementById("cards-grid");
  if (!container) return;

  container.innerHTML = "";

  state.assignments.forEach((item, index) => {
    const themeIndex = index % 6;
    const card = document.createElement("div");
    card.className = `role-card card-theme-${themeIndex}`;
    
    const initial = item.studentName ? item.studentName.charAt(0) : "•";
    const padNumber = String(index + 1).padStart(2, "0");

    // 학생 이름 및 아바타, 교환 버튼이 깔끔하게 중앙 정렬되는 레이아웃
    card.innerHTML = `
      <div class="card-top-tag">ROLE ${padNumber}</div>
      <div class="role-icon-box" title="${escapeHtml(item.roleTitle)}">
        ${item.roleIcon || "⭐"}
      </div>
      <div class="role-info">
        <h3 class="role-title">${escapeHtml(item.roleTitle)}</h3>
        <p class="role-desc">${escapeHtml(item.roleDesc)}</p>
      </div>
      <div class="student-badge-box">
        <div class="student-left">
          <div class="student-avatar">${escapeHtml(initial)}</div>
          <span class="student-name">${escapeHtml(item.studentName)}</span>
          <button class="btn-card-swap no-print" onclick="window.onSwapClick(${index})" title="다른 친구와 역할 바꾸기">
            🔄 역할 교환
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  updateStatusSummary();
}

function updateStatusSummary() {
  const countPill = document.getElementById("status-summary");
  if (countPill) {
    const total = state.roles.length;
    const assigned = state.assignments.filter(a => a.studentName && a.studentName !== "(공석)").length;
    countPill.textContent = `배정 완료: ${assigned} / ${total}명 🌸`;
  }

  const studentCountEl = document.getElementById("drawer-student-count");
  if (studentCountEl) studentCountEl.textContent = `${state.students.length}명`;

  const roleCountEl = document.getElementById("drawer-role-count");
  if (roleCountEl) roleCountEl.textContent = `${state.roles.length}개`;
}

// ==========================================
// 7. 역할 1:1 수동 교환 기능
// ==========================================
window.onSwapClick = function(targetIndex) {
  const currentPerson = state.assignments[targetIndex].studentName;
  const currentRole = state.assignments[targetIndex].roleTitle;

  const otherIndices = state.assignments
    .map((item, idx) => idx !== targetIndex ? `${idx + 1}. [${item.roleTitle}] ${item.studentName}` : null)
    .filter(Boolean);

  const promptMsg = `[${currentPerson}] 학생(${currentRole})의 역할을 변경합니다.\n바꿀 친구의 번호(1~${state.assignments.length})를 입력해 주세요:\n\n` + otherIndices.join("\n");
  
  const input = prompt(promptMsg);
  if (!input) return;

  const chosenNum = parseInt(input.trim(), 10);
  if (isNaN(chosenNum) || chosenNum < 1 || chosenNum > state.assignments.length || chosenNum - 1 === targetIndex) {
    alert("올바른 번호를 선택해 주세요.");
    return;
  }

  const swapWithIdx = chosenNum - 1;
  const targetStudent = state.assignments[swapWithIdx].studentName;

  state.assignments[targetIndex].studentName = targetStudent;
  state.assignments[swapWithIdx].studentName = currentPerson;

  saveToStorage();
  renderCards();
  sfx.playTick();
  showToast(`✨ ${currentPerson}님과 ${targetStudent}님의 역할이 교환되었습니다.`);
};

// ==========================================
// 8. 관리 서랍 (명단 및 역할 수정)
// ==========================================
function initDrawer() {
  const btnToggle = document.getElementById("btn-toggle-edit");
  const drawer = document.getElementById("management-drawer");
  const txtStudents = document.getElementById("input-students-text");
  const txtRoles = document.getElementById("input-roles-text");

  if (!btnToggle || !drawer || !txtStudents || !txtRoles) return;

  btnToggle.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (!isOpen) {
      txtStudents.value = state.students.join("\n");
      txtRoles.value = state.roles.map(r => `${r.icon} | ${r.title} | ${r.desc}`).join("\n");
      drawer.classList.add("open");
      btnToggle.textContent = "✕ 닫기";
    } else {
      drawer.classList.remove("open");
      btnToggle.innerHTML = "✏️ 명단·역할 관리";
    }
  });

  const btnApply = document.getElementById("btn-apply-drawer");
  if (btnApply) {
    btnApply.addEventListener("click", () => {
      const newStudents = txtStudents.value
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newRolesRaw = txtRoles.value
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (newStudents.length === 0 || newRolesRaw.length === 0) {
        alert("학생 명단과 역할을 최소 1개 이상 입력해 주세요.");
        return;
      }

      state.students = newStudents;
      state.roles = newRolesRaw.map((line, idx) => {
        const parts = line.split("|").map(p => p.trim());
        if (parts.length >= 3) {
          return { id: idx + 1, icon: parts[0], title: parts[1], desc: parts[2] };
        } else if (parts.length === 2) {
          return { id: idx + 1, icon: "⭐", title: parts[0], desc: parts[1] };
        } else {
          return { id: idx + 1, icon: "⭐", title: line, desc: "우리 반을 돕는 소중한 역할이에요." };
        }
      });

      initDefaultAssignments();
      saveToStorage();
      renderCards();
      drawer.classList.remove("open");
      btnToggle.innerHTML = "✏️ 명단·역할 관리";
      showToast("✅ 명단과 역할 목록이 업데이트되었습니다.");
    });
  }

  const btnResetDefault = document.getElementById("btn-reset-default");
  if (btnResetDefault) {
    btnResetDefault.addEventListener("click", () => {
      if (confirm("기본 12명의 학생과 12개의 역할로 초기화하시겠습니까?")) {
        state.students = [...DEFAULT_STUDENTS];
        state.roles = [...DEFAULT_ROLES];
        initDefaultAssignments();
        saveToStorage();
        renderCards();
        txtStudents.value = state.students.join("\n");
        txtRoles.value = state.roles.map(r => `${r.icon} | ${r.title} | ${r.desc}`).join("\n");
        showToast("🔄 기본 데이터 12명/12역할로 복원되었습니다.");
      }
    });
  }
}

// ==========================================
// 9. 구글 스프레드시트 (시트 링크 & Apps Script) 연동 UI
// ==========================================

// URL 분석 및 정규화
function normalizeSheetUrl(rawUrl) {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();

  // 1. 구글 스프레드시트 일반 링크 (docs.google.com/spreadsheets/d/ID)
  const sheetMatch = trimmed.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetMatch) {
    const sheetId = sheetMatch[1];
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    return {
      type: "sheet",
      sheetId: sheetId,
      gid: gid,
      gvizUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
      exportUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
      original: trimmed
    };
  }

  // 2. Google Apps Script 웹 앱 URL (script.google.com)
  if (trimmed.includes("script.google.com")) {
    // /dev를 실수로 넣은 경우 /exec로 자동 전환 (중요: /dev는 개발자 로그인 필요로 항상 에러 발생)
    const cleanedUrl = trimmed.replace(/\/dev(\?|$)/, "/exec$1");
    return {
      type: "script",
      url: cleanedUrl,
      original: trimmed
    };
  }

  return {
    type: "unknown",
    url: trimmed,
    original: trimmed
  };
}

// 간단하고 견고한 CSV 파서
function parseCSV(text) {
  const lines = text.split(/\r\n|\n|\r/);
  const rows = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let insideQuotes = false;
    let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    rows.push(row);
  }
  return rows;
}

// 스프레드시트 2D 배열에서 학생명과 역할 데이터 지능형 추출
function extractStudentsAndRoles(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // 빈 행 제거
  const cleanRows = rows.filter(r => Array.isArray(r) && r.some(c => String(c).trim().length > 0));
  if (cleanRows.length === 0) return null;

  let startIndex = 0;
  const firstRow = cleanRows[0].map(c => String(c).trim());
  const hasHeader = firstRow.some(c => /학생|이름|성명|name|student|역할|직책|role/i.test(c));

  let studentCol = -1;
  let roleCol = -1;
  let descCol = -1;
  let iconCol = -1;

  if (hasHeader) {
    startIndex = 1;
    firstRow.forEach((h, idx) => {
      if (/학생|이름|성명|student|name/i.test(h)) studentCol = idx;
      else if (/역할|직책|role/i.test(h)) roleCol = idx;
      else if (/설명|내용|desc/i.test(h)) descCol = idx;
      else if (/아이콘|icon|이모지/i.test(h)) iconCol = idx;
    });
  }

  // 열 인덱스가 지정되지 않은 경우 기본 추론
  if (studentCol === -1) studentCol = 0;
  if (roleCol === -1 && cleanRows[0].length > 1) {
    // 0번 열이 단순 번호(1, 2, 3...)인 경우 보정
    const sampleVals = cleanRows.slice(startIndex, startIndex + 4).map(r => String(r[0] || '').trim());
    const isFirstColNumber = sampleVals.length > 0 && sampleVals.every(v => /^\d+$/.test(v));
    if (isFirstColNumber && cleanRows[0].length >= 3) {
      studentCol = 1;
      roleCol = 2;
      if (cleanRows[0].length >= 4) descCol = 3;
    } else {
      roleCol = 1;
      if (cleanRows[0].length > 2) descCol = 2;
    }
  }

  const extractedStudents = [];
  const extractedRoles = [];

  for (let i = startIndex; i < cleanRows.length; i++) {
    const row = cleanRows[i];

    // 학생 이름 추출
    if (studentCol !== -1 && row[studentCol] !== undefined) {
      const sName = String(row[studentCol]).trim();
      if (sName && !/학생|이름|성명|student|name/i.test(sName)) {
        extractedStudents.push(sName);
      }
    }

    // 역할 정보 추출
    if (roleCol !== -1 && row[roleCol] !== undefined) {
      const rRaw = String(row[roleCol]).trim();
      if (rRaw && !/역할|직책|role/i.test(rRaw)) {
        // 이모지 분리 시도
        const emojiMatch = rRaw.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\p{Emoji})\s*(.*)$/u);
        let icon = "⭐";
        let title = rRaw;
        if (emojiMatch) {
          icon = emojiMatch[1];
          title = emojiMatch[2].trim() || rRaw;
        } else if (iconCol !== -1 && row[iconCol]) {
          icon = String(row[iconCol]).trim();
        }

        const desc = (descCol !== -1 && row[descCol]) 
          ? String(row[descCol]).trim() 
          : "우리 반을 돕는 소중한 역할이에요.";

        extractedRoles.push({
          id: extractedRoles.length + 1,
          icon: icon,
          title: title,
          desc: desc
        });
      }
    }
  }

  return { extractedStudents, extractedRoles };
}

// 실제 시트 또는 Apps Script에서 데이터 가져오기
async function fetchSheetData(urlInfo) {
  if (!urlInfo) throw new Error("URL이 설정되지 않았습니다.");

  // Case A: 구글 스프레드시트 공유 링크
  if (urlInfo.type === "sheet") {
    let csvText = "";
    try {
      const res = await fetch(urlInfo.gvizUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      csvText = await res.text();
    } catch (e) {
      // GViz 실패 시 일반 export 시도
      const res2 = await fetch(urlInfo.exportUrl);
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      csvText = await res2.text();
    }

    // 구글 로그인 페이지 HTML이 반환된 경우 (권한이 '모든 사용자'가 아닐 때 발생)
    if (csvText.includes("<!DOCTYPE html>") || csvText.includes("accounts.google.com")) {
      throw new Error("AUTH_REQUIRED: 구글 스프레드시트의 공유 설정에서 '링크가 있는 모든 사용자 - 뷰어' 권한으로 설정되어 있는지 확인해 주세요.");
    }

    const rows = parseCSV(csvText);
    const parsed = extractStudentsAndRoles(rows);
    if (!parsed || (parsed.extractedStudents.length === 0 && parsed.extractedRoles.length === 0)) {
      throw new Error("시트에서 학생 이름이나 역할 데이터를 찾을 수 없습니다. 시트 내용을 확인해 주세요.");
    }
    return parsed;
  }

  // Case B: Apps Script 웹 앱
  if (urlInfo.type === "script") {
    const fetchUrl = urlInfo.url + (urlInfo.url.includes("?") ? "&action=get" : "?action=get");
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // 1) 2D 배열 형식인 경우 (Apps Script 예시 코드의 data.data)
    if (data.data && Array.isArray(data.data)) {
      const parsed = extractStudentsAndRoles(data.data);
      if (parsed) return parsed;
    }

    // 2) 명시적 students, roles 객체인 경우
    if (data.students && Array.isArray(data.students)) {
      return {
        extractedStudents: data.students,
        extractedRoles: Array.isArray(data.roles) ? data.roles : []
      };
    }

    // 3) 루트가 2D 배열인 경우
    if (Array.isArray(data)) {
      const parsed = extractStudentsAndRoles(data);
      if (parsed) return parsed;
    }

    throw new Error("Apps Script에서 반환된 데이터 형식을 해석할 수 없습니다.");
  }

  throw new Error("지원하지 않는 URL 형식입니다. docs.google.com 또는 script.google.com 주소를 입력해 주세요.");
}

function initSheetIntegration() {
  const modal = document.getElementById("sheet-modal");
  const btnLoad = document.getElementById("btn-sheet-load");
  const btnSave = document.getElementById("btn-sheet-save");
  const btnConfig = document.getElementById("btn-sheet-config");
  const btnClose = document.getElementById("btn-close-sheet-modal");
  const inputUrl = document.getElementById("sheet-script-url");
  const btnSaveUrl = document.getElementById("btn-save-sheet-url");
  const btnTestDemo = document.getElementById("btn-test-sheet-demo");
  const btnCheckUrl = document.getElementById("btn-check-url");
  const checkResultEl = document.getElementById("sheet-url-check-result");

  function openModal() {
    if (inputUrl) inputUrl.value = state.sheetUrl || "";
    if (checkResultEl) checkResultEl.style.display = "none";
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (btnConfig) {
    btnConfig.addEventListener("click", openModal);
  }

  // 실시간 연결 및 권한 점검 기능
  if (btnCheckUrl && inputUrl) {
    btnCheckUrl.addEventListener("click", async () => {
      const rawUrl = (inputUrl.value || "").trim();
      if (!rawUrl) {
        showCheckResult("error", "URL을 먼저 입력해 주세요.");
        return;
      }

      const urlInfo = normalizeSheetUrl(rawUrl);
      if (!urlInfo) {
        showCheckResult("error", "올바른 URL 형식이 아닙니다.");
        return;
      }

      showCheckResult("loading", "⏳ 구글 시트 연결 및 권한 점검 중...");

      try {
        const result = await fetchSheetData(urlInfo);
        const sCount = result.extractedStudents.length;
        const rCount = result.extractedRoles.length;
        
        let msg = `✅ <strong>연결 성공!</strong> `;
        if (urlInfo.type === "sheet") {
          msg += `(구글 스프레드시트 공유 링크 정상 감지)<br/>`;
        } else {
          msg += `(Apps Script 웹 앱 정상 감지)<br/>`;
        }
        msg += `확인된 데이터: 학생 <strong>${sCount}명</strong>, 역할 <strong>${rCount}개</strong><br/>`;
        msg += `<span style="font-size: 0.8rem; color: #2b7a4b;">아래 [설정 저장하기]를 누르시면 상단 [🔄 시트 불러오기]를 바로 사용하실 수 있습니다.</span>`;
        
        showCheckResult("success", msg);
      } catch (err) {
        console.error("Check URL error:", err);
        let errorMsg = `❌ <strong>점검 실패:</strong> ${err.message}<br/><br/>`;
        if (err.message.includes("AUTH_REQUIRED") || urlInfo.type === "sheet") {
          errorMsg += `<strong>해결 방법:</strong><br/>`;
          errorMsg += `1. 구글 스프레드시트 우측 상단 <strong>[공유]</strong> 버튼을 누릅니다.<br/>`;
          errorMsg += `2. '일반 액세스' 항목을 <strong>[링크가 있는 모든 사용자]</strong>로 변경하고 권한을 <strong>[뷰어]</strong>로 지정해 주세요.`;
        } else {
          errorMsg += `<strong>확인 사항:</strong><br/>`;
          errorMsg += `1. Apps Script 웹 앱 배포 시 <strong>'액세스 권한: 모든 사용자(Anyone)'</strong>로 설정되었는지 확인해 주세요.<br/>`;
          errorMsg += `2. 배포 주소 끝부분이 <code>/dev</code>가 아닌 <code>/exec</code>인지 확인해 주세요.`;
        }
        showCheckResult("error", errorMsg);
      }
    });
  }

  function showCheckResult(type, html) {
    if (!checkResultEl) return;
    checkResultEl.style.display = "block";
    if (type === "success") {
      checkResultEl.style.background = "#e6fcf5";
      checkResultEl.style.border = "1px solid #63e6be";
      checkResultEl.style.color = "#087f5b";
    } else if (type === "loading") {
      checkResultEl.style.background = "#fff9db";
      checkResultEl.style.border = "1px solid #ffe066";
      checkResultEl.style.color = "#f08c00";
    } else {
      checkResultEl.style.background = "#fff5f5";
      checkResultEl.style.border = "1px solid #ffc9c9";
      checkResultEl.style.color = "#c92a2a";
    }
    checkResultEl.innerHTML = html;
  }

  // URL 저장
  if (btnSaveUrl) {
    btnSaveUrl.addEventListener("click", () => {
      const raw = (inputUrl.value || "").trim();
      state.sheetUrl = raw;
      saveToStorage();
      closeModal();
      showToast("💾 구글 연동 URL이 저장되었습니다.");
    });
  }

  // [🔄 시트 불러오기]
  if (btnLoad) {
    btnLoad.addEventListener("click", async () => {
      if (!state.sheetUrl) {
        openModal();
        showToast("ℹ️ 구글 시트 주소 또는 Apps Script URL을 먼저 등록해 주세요.");
        return;
      }

      showToast("⏳ 구글 스프레드시트에서 데이터를 불러오는 중...");
      const urlInfo = normalizeSheetUrl(state.sheetUrl);

      try {
        const result = await fetchSheetData(urlInfo);

        if (result.extractedStudents && result.extractedStudents.length > 0) {
          state.students = result.extractedStudents;
        }
        if (result.extractedRoles && result.extractedRoles.length > 0) {
          state.roles = result.extractedRoles;
        }

        initDefaultAssignments();
        saveToStorage();
        renderCards();
        sfx.playFanfare();

        const sCount = result.extractedStudents.length;
        const rCount = result.extractedRoles.length;
        showToast(`🎉 구글 시트에서 학생 ${sCount}명, 역할 ${rCount}개를 성공적으로 불러왔습니다!`);
      } catch (err) {
        console.error("Sheet load error:", err);
        openModal();
        showCheckResult("error", `❌ <strong>불러오기 실패:</strong> ${err.message}`);
      }
    });
  }

  // [💾 시트에 결과 저장]
  if (btnSave) {
    btnSave.addEventListener("click", async () => {
      const urlInfo = normalizeSheetUrl(state.sheetUrl);

      // 항상 클립보드에 표 형식(TSV)으로 즉시 붙여넣을 수 있게 복사
      copyResultAsTableToClipboard();

      // Case A: Apps Script 웹 앱이 설정된 경우 자동 저장 POST 전송
      if (urlInfo && urlInfo.type === "script") {
        showToast("⏳ 구글 시트로 배정 결과를 저장하는 중...");
        try {
          const payload = {
            className: state.className,
            timestamp: new Date().toLocaleString("ko-KR"),
            assignments: state.assignments
          };

          // mode: 'no-cors'를 사용하여 302 리디렉션 시 브라우저 CORS 차단 문제 완전 해결
          await fetch(urlInfo.url, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });

          sfx.playFanfare();
          showToast("💾 구글 스프레드시트에 배정 결과가 성공적으로 저장되었습니다!");
        } catch (err) {
          console.error("Sheet save error:", err);
          showToast("📋 클립보드에 결과가 복사되었습니다. (구글 시트에서 Ctrl+V)");
        }
        return;
      }

      // Case B: 구글 시트 링크이거나 URL 미등록인 경우 (친절한 가이드 & 클립보드 표 복사)
      sfx.playFanfare();
      alert("📋 구글 스프레드시트에 바로 붙여넣을 수 있도록 배정 결과가 표 형식으로 복사되었습니다!\n\n선생님의 구글 시트에서 붙여넣을 셀을 클릭하고 [Ctrl + V]를 누르면 표로 깔끔하게 들어갑니다.\n\n(참고: 클릭 한 번으로 시트에 자동 기록되게 하려면 [연동 설정]의 '방법 2(Apps Script)'를 이용해 보세요.)");
    });
  }

  // 기본 12명 샘플 복원
  if (btnTestDemo) {
    btnTestDemo.addEventListener("click", () => {
      state.students = [...DEFAULT_STUDENTS];
      state.roles = [...DEFAULT_ROLES];
      initDefaultAssignments();
      saveToStorage();
      renderCards();
      sfx.playTick();
      closeModal();
      showToast("🌱 기본 12명/12역할 데이터가 복원되었습니다.");
    });
  }
}

// 스프레드시트 붙여넣기에 최적화된 탭 구분 텍스트(TSV) 복사
function copyResultAsTableToClipboard() {
  const header = "번호\t아이콘\t역할명\t학생이름\t역할설명\t배정일시";
  const now = new Date().toLocaleString("ko-KR");
  const rows = state.assignments.map((a, i) => 
    `${i + 1}\t${a.roleIcon}\t${a.roleTitle}\t${a.studentName}\t${a.roleDesc}\t${now}`
  );
  const tsvText = [header, ...rows].join("\n");
  navigator.clipboard.writeText(tsvText).catch(() => {});
}

// 텍스트 복사 편의 기능
function copyResultToClipboard() {
  const lines = [
    `✨ [${state.className}] 1인 1역할 배정 결과 ✨`,
    `배정 일시: ${new Date().toLocaleDateString("ko-KR")}`,
    "------------------------------------",
    ...state.assignments.map((a, i) => `${i + 1}. ${a.roleIcon} ${a.roleTitle} : ${a.studentName} (${a.roleDesc})`),
    "------------------------------------",
    "내가 맡은 역할에 정성을 다하여 행복한 우리 반을 만들어요! 🌟"
  ];
  const text = lines.join("\n");
  navigator.clipboard.writeText(text).catch(() => {});
}

// ==========================================
// 10. 교실 게시판 A4 인쇄
// ==========================================
function initPrintAction() {
  const btnPrint = document.getElementById("btn-print");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      showToast("🖨️ A4 교실 게시판 인쇄를 준비합니다.");
      setTimeout(() => {
        window.print();
      }, 250);
    });
  }
}

// ==========================================
// 11. 토스트 알림 헬퍼
// ==========================================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.96)";
    toast.style.transition = "all 0.25s var(--ease-modern)";
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 12. 초기화 이벤트 바인딩
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  fanfare = new ModernFanfareEffect();
  loadFromStorage();

  const titleInput = document.getElementById("class-title-input");
  if (titleInput) {
    titleInput.value = state.className;
    titleInput.addEventListener("input", (e) => {
      state.className = e.target.value;
      saveToStorage();
    });
  }

  const btnAssign = document.getElementById("btn-assign");
  if (btnAssign) {
    btnAssign.addEventListener("click", assignRolesRandomly);
  }

  const btnCopy = document.getElementById("btn-copy-result");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      copyResultToClipboard();
      sfx.playTick();
      showToast("📋 전체 배정 결과가 클립보드에 복사되었습니다.");
    });
  }

  initDrawer();
  initSheetIntegration();
  initPrintAction();
  renderCards();
});
