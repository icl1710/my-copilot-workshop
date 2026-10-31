// 待辦事項儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'workshop-todos';
const THEME_STORAGE_KEY = 'workshop-theme';
const EMPTY_MESSAGES = {
  all: '還沒有任何待辦事項,新增一個吧!',
  active: '沒有未完成的待辦事項。',
  completed: '沒有已完成的待辦事項。',
};

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.btn-filter');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

// 手動設定優先於系統偏好；沒有設定時由 CSS 與系統偏好決定。
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
let themePreference = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
let activeFilter = 'all';

function applyTheme() {
  const isDark = themePreference
    ? themePreference === 'dark'
    : colorScheme.matches;

  if (themePreference) {
    document.documentElement.dataset.theme = themePreference;
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggle.textContent = isDark ? '☀️ 淺色模式' : '🌙 深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

themeToggle.addEventListener('click', () => {
  const isDark = themePreference
    ? themePreference === 'dark'
    : colorScheme.matches;
  themePreference = isDark ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  applyTheme();
});

colorScheme.addEventListener('change', () => {
  if (!themePreference) {
    applyTheme();
  }
});

// 讀取儲存資料，並排除格式不正確的項目。
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((todo) =>
      todo &&
      typeof todo.id === 'string' &&
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.warn('讀取待辦事項失敗，將以空清單開始。', error);
    return [];
  }
}

let todos = loadTodos();

// 將目前的待辦事項寫入 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依照目前資料更新清單、空狀態與未完成數量。
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }
    if (activeFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = EMPTY_MESSAGES[activeFilter];
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 切換篩選時只改變顯示內容，不會修改待辦資料。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    render();
  });
});

// 新增待辦事項，空白內容不會加入清單。
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    completed: false,
  });

  saveTodos();
  render();
  form.reset();
  input.focus();
});

// 使用事件委派處理勾選與刪除。
list.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="checkbox"]')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  todos = todos.map((todo) =>
    todo.id === item.dataset.id ? { ...todo, completed: event.target.checked } : todo
  );
  saveTodos();
  render();
});

list.addEventListener('click', (event) => {
  if (!event.target.matches('.btn-delete')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  render();
});

applyTheme();
render();
