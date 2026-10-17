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
// 9. 구글 스프레드시트 (Apps Script) 연동 UI
// ==========================================
function initSheetIntegration() {
  const modal = document.getElementById("sheet-modal");
  const btnLoad = document.getElementById("btn-sheet-load");
  const btnSave = document.getElementById("btn-sheet-save");
  const btnConfig = document.getElementById("btn-sheet-config");
  const btnClose = document.getElementById("btn-close-sheet-modal");
  const inputUrl = document.getElementById("sheet-script-url");
  const btnSaveUrl = document.getElementById("btn-save-sheet-url");
  const btnTestDemo = document.getElementById("btn-test-sheet-demo");

  function openModal() {
    if (inputUrl) inputUrl.value = state.sheetUrl || "";
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

  if (btnSaveUrl) {
    btnSaveUrl.addEventListener("click", () => {
      state.sheetUrl = (inputUrl.value || "").trim();
      saveToStorage();
      closeModal();
      showToast("💾 Apps Script 웹 앱 URL이 저장되었습니다.");
    });
  }

  // [🔄 시트 불러오기]
  if (btnLoad) {
    btnLoad.addEventListener("click", async () => {
      if (!state.sheetUrl) {
        openModal();
        showToast("ℹ️ 구글 시트 웹 앱 URL을 먼저 등록해 주세요.");
        return;
      }

      showToast("⏳ 구글 스프레드시트에서 데이터를 불러오는 중...");
      try {
        const fetchUrl = state.sheetUrl + (state.sheetUrl.includes("?") ? "&action=get" : "?action=get");
        const res = await fetch(fetchUrl);
        const data = await res.json();

        if (data.students && Array.isArray(data.students)) {
          state.students = data.students;
        }
        if (data.roles && Array.isArray(data.roles)) {
          state.roles = data.roles;
        }
        if (data.assignments && Array.isArray(data.assignments)) {
          state.assignments = data.assignments;
        } else {
          initDefaultAssignments();
        }

        saveToStorage();
        renderCards();
        sfx.playFanfare();
        showToast("🎉 구글 스프레드시트 데이터를 성공적으로 불러왔습니다!");
      } catch (err) {
        console.error("Sheet load error:", err);
        alert("구글 시트를 불러오지 못했습니다.\n\n확인 사항:\n1. Apps Script 웹 앱 배포 시 '액세스 권한: 모든 사용자(Anyone)'로 설정되었는지 확인해 주세요.\n2. URL이 올바른지 확인해 주세요.");
      }
    });
  }

  // [💾 시트에 결과 저장]
  if (btnSave) {
    btnSave.addEventListener("click", async () => {
      if (!state.sheetUrl) {
        copyResultToClipboard();
        openModal();
        showToast("📋 결과가 복사되었습니다. (시트 연동 안내)");
        return;
      }

      showToast("⏳ 구글 시트로 배정 결과를 저장하는 중...");
      try {
        const payload = {
          className: state.className,
          timestamp: new Date().toLocaleString("ko-KR"),
          assignments: state.assignments
        };

        await fetch(state.sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        sfx.playFanfare();
        showToast("💾 구글 스프레드시트에 안전하게 저장되었습니다!");
      } catch (err) {
        console.error("Sheet save error:", err);
        copyResultToClipboard();
        alert("구글 시트 저장 중 통신 에러가 발생하여 클립보드에 결과 텍스트를 먼저 복사해 두었습니다. 시트에 붙여넣기(Ctrl+V)하실 수 있습니다.");
      }
    });
  }

  if (btnTestDemo) {
    btnTestDemo.addEventListener("click", () => {
      state.students = [
        "김민준", "이서아", "박도윤", "최서연", 
        "정하준", "강지아", "조은우", "윤수아", 
        "장선우", "임하은", "한유준", "오지우"
      ];
      closeModal();
      renderCards();
      sfx.playTick();
      showToast("🌱 기본 12명 데이터가 성공적으로 반영되었습니다!");
    });
  }
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
