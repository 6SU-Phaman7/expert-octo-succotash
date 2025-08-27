// --- Vision Board App JavaScript ---

// --- Local Storage Utilities ---
function saveBoards(boards) {
    localStorage.setItem('visionBoards', JSON.stringify(boards));
}

function loadBoards() {
    const storedBoards = localStorage.getItem('visionBoards');
    return storedBoards ? JSON.parse(storedBoards) : null;
}

// --- Data Initialization ---
const defaultBoards = {
    "Personal": {
        title: "My Personal Vision",
        tasks: [
            { text: "Review BO documents by 8:00 AM", done: true },
            { text: "Plan weekly budget and track spending", done: false },
            { text: "Call Nolwandle", done: false }
        ],
        brainstormPrompt: "What are my personal goals for this month?"
    },
    "Fitness": {
        title: "My Fitness & Health Goals",
        tasks: [
            { text: "Complete night shift workout - Monday", done: true },
            { text: "Plan meals for the week, focus on fasting", done: false },
            { text: "Schedule a 30-minute cardio session", done: false }
        ],
        brainstormPrompt: "How can I improve my fitness regime?"
    },
    "Ohlelekile Financial Provider": {
        title: "Ohlelekile Financial Provider",
        tasks: [
            { text: "Draft initial business plan", done: true },
            { text: "Research target market and competitors", done: false },
            { text: "Set up a meeting with potential partners", done: false }
        ],
        brainstormPrompt: "What are the next steps for my company?"
    }
};

// Load boards from localStorage or use defaults
let boards = loadBoards() || defaultBoards;
let currentBoard = "Personal";

// --- DOM References ---
const mainContent = document.getElementById('board-content');
const boardTitleEl = document.getElementById('current-board-title');
const boardsDropdown = document.getElementById('boards-dropdown');

// --- Render Boards ---
function renderBoard(boardKey) {
    const boardData = boards[boardKey];
    if (!boardData) return;

    mainContent.innerHTML = `
        <div class="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <h2 class="text-[var(--foreground)] tracking-tight text-3xl font-bold text-left pb-4">${boardData.title}</h2>
            <div class="flex w-full items-center gap-2 py-3">
                <div class="relative flex-1">
                    <i class="fa-solid fa-plus absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"></i>
                    <input id="task-input" placeholder="Add a new task or use the mic..." class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[var(--foreground)] bg-[var(--secondary)] focus:outline-0 focus:ring-2 focus:ring-[var(--accent)] border-none h-14 placeholder:text-[var(--muted-foreground)] pl-12 pr-5 text-base font-normal leading-normal"/>
                </div>
                <button id="speak-task-btn" title="Read input text" class="flex-shrink-0 flex items-center justify-center size-12 rounded-full bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors text-[var(--secondary-foreground)]">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            <div id="task-list" class="flex flex-col gap-2 py-4">
                ${boardData.tasks.map((task, index) => `
                    <div class="task-item flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                        <input type="checkbox" id="task-${index}" class="form-checkbox size-5 rounded-md text-[var(--accent)] bg-[var(--secondary)] border-[var(--border)] focus:ring-[var(--accent)]" ${task.done ? 'checked' : ''} data-task-index="${index}">
                        <label for="task-${index}" class="flex-1 w-0">
                            <span class="text-[var(--foreground)] transition-colors">${task.text}</span>
                        </label>
                        <button class="speak-review-btn flex-shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]" data-text="${task.text}">
                            <i class="fa-solid fa-volume-high text-sm"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <h3 class="text-[var(--foreground)] text-xl font-bold leading-tight tracking-tight pt-8 pb-4">Brainstorming</h3>
            <div class="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[var(--border)] px-6 py-14 text-center">
                <div class="flex max-w-md flex-col items-center gap-2">
                    <p class="text-[var(--foreground)] text-lg font-bold">${boardData.brainstormPrompt}</p>
                    <p class="text-[var(--muted-foreground)] text-sm font-normal">Use the voice-controlled canvas to draw, write, and connect your ideas visually.</p>
                </div>
                <button id="start-brainstorming-btn" class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-sm font-bold">Start Brainstorming</button>
            </div>
        </div>`;
    
    attachEventListeners();
}

// --- Populate Boards Dropdown ---
function populateBoardsDropdown() {
    boardsDropdown.innerHTML = ''; // Clear existing items
    Object.keys(boards).forEach(key => {
        const link = document.createElement('a');
        link.href = '#';
        link.dataset.board = key;
        link.className = 'block px-4 py-2 text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]';
        link.textContent = key;
        boardsDropdown.appendChild(link);
    });
}

// --- Attach Event Listeners ---
function attachEventListeners() {
    // Task Checkboxes
    document.getElementById('task-list').addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const index = e.target.dataset.taskIndex;
            boards[currentBoard].tasks[index].done = e.target.checked;
            saveBoards(boards);
        }
    });

    // Add Task Input
    const taskInput = document.getElementById('task-input');
    taskInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && taskInput.value.trim()) {
            boards[currentBoard].tasks.push({ text: taskInput.value.trim(), done: false });
            taskInput.value = '';
            renderBoard(currentBoard);
            saveBoards(boards);
        }
    });

    // Dropdown Board Switching
    boardsDropdown.addEventListener('click', e => {
        e.preventDefault();
        const boardKey = e.target.dataset.board;
        if (boardKey && boards[boardKey]) {
            currentBoard = boardKey;
            boardTitleEl.textContent = boardKey;
            renderBoard(boardKey);
        }
    });
}

// --- Initialize the App ---
document.addEventListener('DOMContentLoaded', () => {
    populateBoardsDropdown();
    renderBoard(currentBoard);
});