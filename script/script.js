const postContent = document.getElementById('post-content');
const postTags = document.getElementById('post-tags');
const addBtn = document.getElementById('add-post');
const postsContainer = document.getElementById('posts-container');
const emojiBtn = document.getElementById('emoji-btn');
const charCount = document.getElementById('char-count');
const searchInput = document.getElementById('search-tag');
const sortSelect = document.getElementById('sort');

let posts = JSON.parse(localStorage.getItem('posts')) || [];

function renderPosts() {
  const filterTag = searchInput.value.trim().toLowerCase();
  const sortOrder = sortSelect.value;
  
  let sortedPosts = [...posts];

  sortedPosts.sort((a, b) => {
    if (sortOrder === 'newest') return b.date - a.date;
    return a.date - b.date;
  });

  const filtered = filterTag
    ? sortedPosts.filter(post => post.tags.some(tag => tag.includes(filterTag)))
    : sortedPosts;

  postsContainer.innerHTML = '';

  filtered.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = 
      `<div class="content">${post.content}</div>
      <div class="tags">${post.tags.join(' ')}</div>
      <div class="date">${new Date(post.date).toLocaleString()}</div>
      <div class="actions">
        <button onclick="editPost(${index})">✏️</button>
        <button onclick="deletePost(${index})">🗑️</button>
      </div>`
    ;

    postsContainer.appendChild(div);
  });
}

function addPost() {
  const content = postContent.value.trim();
  const tags = postTags.value
    .split(' ')
    .filter(tag => tag.startsWith('#') && tag.length > 1);

  if (!content) return;

  posts.push({
    content,
    tags,
    date: Date.now()
  });

  savePosts();
  clearInputs();
  renderPosts();
}

function deletePost(index) {
  if (confirm('Удалить этот пост?')) {
    posts.splice(index, 1);
    savePosts();
    renderPosts();
  }
}

function editPost(index) {
  const post = posts[index];
  postContent.value = post.content;
  postTags.value = post.tags.join(' ');
  posts.splice(index, 1);
  renderPosts();
}

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function clearInputs() {
  postContent.value = '';
  postTags.value = '';
  charCount.textContent = '0 символов';
}

emojiBtn.addEventListener('click', () => {
  const emojiList = ['😊', '😂', '❤️', '👍', '🔥', '😎', '🎉'];
  const emoji = prompt(`Выбери смайлик:\n${emojiList.join(' ')}`);
  if (emoji && emojiList.includes(emoji.trim())) {
    postContent.value += ' ' + emoji;
    charCount.textContent = postContent.value.length + ' символов';
  }
});

postContent.addEventListener('input', () => {
  charCount.textContent = postContent.value.length + ' символов';
});

addBtn.addEventListener('click', addPost);
searchInput.addEventListener('input', renderPosts);
sortSelect.addEventListener('change', renderPosts);

renderPosts();