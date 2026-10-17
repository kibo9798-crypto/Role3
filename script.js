/**
 * 우리 반 1인 1역할 배정기 (script.js)
 * 순수 Vanilla JS 로직: 무작위 매칭, Web Audio 사운드, 폭죽 효과, A4 인쇄, 구글 시트 연동 준비
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
  assignments: [], // [{ roleId, roleTitle, roleIcon, roleDesc, studentName }]
  sheetUrl: "",
  isRolling: false
};

// ==========================================
// 2. 사운드 효과 (Web Audio API - 외부 파일 불필요)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio might be blocked by browser policy
    }
  }

  playTada() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      // ignore
    }
  }
}

const sfx = new SoundFX();

// ==========================================
// 3. 축하 폭죽 효과 (Pure Canvas Confetti)
// ==========================================
class ConfettiEffect {
  constructor() {
    this.canvas = document.getElementById("confetti-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
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
    const colors = ["#ff6b6b", "#fcc419", "#51cf66", "#339af0", "#cc5de8", "#ff922b"];
    
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 - 100,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.38,
        opacity: 1
      });
    }

    if (this.animId) cancelAnimationFrame(this.animId);
    this.animate();
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < window.innerHeight) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
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

let confetti = null;

// ==========================================
// 4. 로컬 스토리지 상태 저장 및 복원
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
    localStorage.setItem("class_role_picker_v1", JSON.stringify(data));
  } catch (e) {
    console.warn("로컬 저장 오류:", e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("class_role_picker_v1");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.className) state.className = data.className;
      if (Array.isArray(data.students) && data.students.length > 0) state.students = data.students;
      if (Array.isArray(data.roles) && data.roles.length > 0) state.roles = data.roles;
      if (Array.isArray(data.assignments) && data.assignments.length > 0) state.assignments = data.assignments;
      if (data.sheetUrl) state.sheetUrl = data.sheetUrl;
    }
  } catch (e) {
    console.warn("저장된 데이터 로드 실패:", e);
  }

  // 초기 배정이 아직 없으면 기본 순서대로 초기화
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
// 5. 역할 무작위 배정 (Fisher-Yates Shuffle)
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

  // 카드에 셔플 애니메이션 클래스 부여
  const cards = document.querySelectorAll(".role-card");
  cards.forEach(card => card.classList.add("shuffling"));

  let tickCount = 0;
  const maxTicks = 12;
  const timer = setInterval(() => {
    sfx.playTick();
    tickCount++;

    // 임시로 이름을 빠르게 교체하여 시각적 긴장감 부여
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
  // 실제 최종 무작위 셔플
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

  // 완료 효과음 & 폭죽
  sfx.playTada();
  if (confetti) confetti.start();
  showToast("🎉 1인 1역할이 공정하게 배정되었습니다!");
}

// ==========================================
// 6. UI 렌더링
// ==========================================
function renderCards() {
  const container = document.getElementById("cards-grid");
  if (!container) return;

  container.innerHTML = "";

  state.assignments.forEach((item, index) => {
    const themeIndex = index % 6;
    const card = document.createElement("div");
    card.className = `role-card card-theme-${themeIndex}`;
    
    // 첫 글자 아바타
    const initial = item.studentName ? item.studentName.charAt(0) : "★";

    card.innerHTML = `
      <div class="card-top-tag">#${index + 1}</div>
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
        </div>
        <button class="btn-card-swap no-print" onclick="window.onSwapClick(${index})" title="다른 친구와 역할 바꾸기">
          🔄 교환
        </button>
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

  // 관리 서랍 카운터 업데이트
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

  // Swap
  state.assignments[targetIndex].studentName = targetStudent;
  state.assignments[swapWithIdx].studentName = currentPerson;

  saveToStorage();
  renderCards();
  showToast(`✨ ${currentPerson}님과 ${targetStudent}님의 역할이 서로 바뀌었습니다.`);
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
      // 열기: 텍스트에디터 채우기
      txtStudents.value = state.students.join("\n");
      txtRoles.value = state.roles.map(r => `${r.icon} | ${r.title} | ${r.desc}`).join("\n");
      drawer.classList.add("open");
      btnToggle.textContent = "✕ 편집 닫기";
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

      // 기존 배정 재정렬
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

  // 모달 제어
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
        // 간편 복사 제안
        copyResultToClipboard();
        openModal();
        showToast("📋 결과가 클립보드에 복사되었습니다! (시트 URL 설정 안내)");
        return;
      }

      showToast("⏳ 구글 시트로 배정 결과를 전송하는 중...");
      try {
        const payload = {
          className: state.className,
          timestamp: new Date().toLocaleString("ko-KR"),
          assignments: state.assignments
        };

        const res = await fetch(state.sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        showToast("💾 구글 스프레드시트에 결과가 안전하게 저장되었습니다!");
      } catch (err) {
        console.error("Sheet save error:", err);
        // 실패 시에도 클립보드 복사 제공
        copyResultToClipboard();
        alert("구글 시트 저장 중 통신 에러가 발생하여, 클립보드에 결과 텍스트를 먼저 복사해 두었습니다. 시트에 붙여넣기(Ctrl+V)하실 수 있습니다.");
      }
    });
  }

  // 모달 내 데모 데이터 시뮬레이션
  if (btnTestDemo) {
    btnTestDemo.addEventListener("click", () => {
      state.students = [
        "김민준", "이서아", "박도윤", "최서연", 
        "정하준", "강지아", "조은우", "윤수아", 
        "장선우", "임하은", "한유준", "오지우"
      ];
      closeModal();
      renderCards();
      showToast("🌱 테스트용 12명 데이터가 성공적으로 반영되었습니다!");
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
    "내가 맡은 역할에 최선을 다해 행복한 교실을 만들어요! 🌟"
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
      showToast("🖨️ A4 인쇄 미리보기 화면을 준비합니다.");
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
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// HTML 특수문자 이스케이프 방어
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
  confetti = new ConfettiEffect();
  loadFromStorage();

  // 학급명 입력 바인딩
  const titleInput = document.getElementById("class-title-input");
  if (titleInput) {
    titleInput.value = state.className;
    titleInput.addEventListener("input", (e) => {
      state.className = e.target.value;
      saveToStorage();
    });
  }

  // 메인 배정 버튼
  const btnAssign = document.getElementById("btn-assign");
  if (btnAssign) {
    btnAssign.addEventListener("click", assignRolesRandomly);
  }

  // 결과 복사 버튼
  const btnCopy = document.getElementById("btn-copy-result");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      copyResultToClipboard();
      showToast("📋 전체 배정 결과가 텍스트로 복사되었습니다!");
    });
  }

  initDrawer();
  initSheetIntegration();
  initPrintAction();
  renderCards();
});
