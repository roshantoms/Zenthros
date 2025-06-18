const form = document.getElementById('tab-form');
const tabList = document.getElementById('tab-list');
const filters = document.getElementById('filters');

let tabs = JSON.parse(localStorage.getItem('tabs')) || [];

function saveTabs() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
}

function deleteTab(index) {
    tabs.splice(index, 1);
    saveTabs();
    renderTabs();
    renderFilters();
}

function renderTabs(filter = '') {
    tabList.innerHTML = '';
    const filteredTabs = filter ? tabs.filter(tab => tab.category === filter) : tabs;

    filteredTabs.forEach((tab, index) => {
    const card = document.createElement('div');
    card.className = 'tab-card';

    card.innerHTML = `
        <h3>${tab.title}</h3>
        <p>Category: ${tab.category}</p>
        <a href="${tab.url}" target="_blank">Open Tab</a>
        <button class="delete-btn" onclick="deleteTab(${index})"><i class="fas fa-trash"></i></button>
    `;

    tabList.appendChild(card);
    });
}

function renderFilters() {
    const uniqueCategories = [...new Set(tabs.map(tab => tab.category))];
    filters.innerHTML = '<button onclick="renderTabs()">All</button>';
    uniqueCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.onclick = () => renderTabs(cat);
        filters.appendChild(btn);
    });
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const category = document.getElementById('category').value;

    const newTab = { title, url, category };
    tabs.push(newTab);
    saveTabs();
    renderTabs();
    renderFilters();
    form.reset();
});

renderTabs();
renderFilters();