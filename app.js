// 待辦事項儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'workshop-todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

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

  todos.forEach((todo) => {
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

  emptyState.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

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

render();
