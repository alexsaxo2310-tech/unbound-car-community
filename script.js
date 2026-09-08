const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

// Menu toggle
menu.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => 
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Load and render merch
async function loadMerch() {
  try {
    const response = await fetch('merch.json');
    const merch = await response.json();
    renderMerch(merch);
  } catch (error) {
    console.error('Error loading merch:', error);
  }
}

function renderMerch(merch) {
  const container = document.getElementById('merch-container');
  container.innerHTML = '';
  
  merch.forEach(item => {
    const article = document.createElement('article');
    if (item.featured === false) article.classList.add('coming');
    
    const productClass = item.stickerBg ? 'product sticker-bg' : 'product';
    article.innerHTML = `
      <div class="${productClass}">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a class="product-link" href="${item.link}">SHOP NOW →</a>
      <button class="remove-merch" data-id="${item.id}" title="Remove item">×</button>
    `;
    
    container.appendChild(article);
  });
  
  // Add remove button listeners
  document.querySelectorAll('.remove-merch').forEach(btn => {
    btn.addEventListener('click', (e) => removeMerch(e.target.dataset.id));
  });
}

// Add new merch item
function addMerch(name, description, image, link = '#join') {
  fetch('merch.json')
    .then(r => r.json())
    .then(merch => {
      const newId = Math.max(...merch.map(m => m.id), 0) + 1;
      const newItem = {
        id: newId,
        name,
        description,
        image,
        link,
        featured: true
      };
      merch.push(newItem);
      updateMerchFile(merch);
    })
    .catch(error => console.error('Error adding merch:', error));
}

// Remove merch item
function removeMerch(id) {
  fetch('merch.json')
    .then(r => r.json())
    .then(merch => {
      const filtered = merch.filter(item => item.id !== parseInt(id));
      updateMerchFile(filtered);
    })
    .catch(error => console.error('Error removing merch:', error));
}

// Update merch.json file
function updateMerchFile(merch) {
  console.log('Updated merch:', merch);
  console.log('Note: In a real app, this would POST to a backend API to update the file.');
  // In production, this would POST to a backend endpoint:
  // fetch('api/merch', { method: 'POST', body: JSON.stringify(merch) })
  loadMerch(); // Refresh display
}

// Load merch on page load
loadMerch();

// Expose functions for console access (for easy testing)
window.merchManagement = { addMerch, removeMerch };
