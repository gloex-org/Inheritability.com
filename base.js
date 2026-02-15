// CONFIGURATION
const API_BASE = "https://inheritabity.pythonanywhere.com/api/content/";

async function init() {
    // 1. Load HTML Partials
    document.querySelector('header').innerHTML = await (await fetch('header.html')).text();
    document.querySelector('footer').innerHTML = await (await fetch('footer.html')).text();

    // 2. Fetch Data
    const response = await fetch(API_BASE);
    const data = await response.json();

    // --- APPLY DATA TO DOM ---

    // Global Settings (Footer Contacts)
    if(data.settings) {
        document.getElementById('footer-contacts').innerHTML = `
            <p>Email: ${data.settings.contact_email}</p>
            <p>Phone: ${data.settings.contact_phone}</p>
        `;
    }

    // Section 1: Directory Buttons
    const dirContainer = document.getElementById('dir-container');
    data.directory.forEach(post => {
        const btn = document.createElement('a');
        btn.href = `#post-${post.id}`; // Anchors to Section 5
        btn.className = 'dir-btn';
        btn.innerText = post.title;
        dirContainer.appendChild(btn);
    });

    // Section 2: Intro
    if(data.intro) {
        const box = document.getElementById('intro-section');
        box.style.backgroundColor = data.intro.bg_color;
        box.innerHTML = `
            <h1 style="color:${data.intro.text_color}; font-size: 2.5rem;">${data.intro.title}</h1>
            <p style="color:${data.intro.text_color}">${data.intro.subtitle}</p>
        `;
    }
    // Section 2b: Categories
    const catContainer = document.getElementById('cat-container');
    data.categories.forEach(cat => {
        catContainer.innerHTML += `
            <div style="background:#fff; padding:15px; border-radius:5px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
            </div>`;
    });

    // Section 3: Featured
    const featContainer = document.getElementById('featured-container');
    data.featured.forEach(post => {
        featContainer.innerHTML += `
            <div class="update-item" style="border-color: gold;">
                <h3>⭐ ${post.title}</h3>
                <div>${post.content.substring(0, 150)}...</div>
            </div>`;
    });

    // Section 4: Banners
    const bannerContainer = document.getElementById('banner-container');
    data.banners.forEach(ad => {
        if(ad.is_active) {
            bannerContainer.innerHTML += `
                <div class="banner-card ${ad.animation_class}">
                    <a href="${ad.target_link}">
                        <img src="${ad.image_url}" alt="${ad.name}">
                        <div class="banner-text">
                            <strong>${ad.name}</strong><br>
                            <small>${ad.description}</small>
                        </div>
                    </a>
                </div>`;
        }
    });

    // Section 5: Updates (Full Content)
    const updatesContainer = document.getElementById('updates-container');
    data.updates.forEach(post => {
        updatesContainer.innerHTML += `
            <article id="post-${post.id}" class="update-item" ${post.highlight_color ? `style="background:${post.highlight_color}"` : ''}>
                ${post.header_image_url ? `<img src="${post.header_image_url}" style="max-width:100%; height:auto; margin-bottom:10px;">` : ''}
                <h2 style="${post.is_bold ? 'font-weight:900' : ''}">${post.title}</h2>
                <div class="update-meta">Posted on ${new Date(post.created_at).toLocaleDateString()} | Cat: ${post.category_name || 'General'}</div>
                <div>${post.content}</div>
            </article>`;
    });

    // Section 6: Compliance
    if(data.compliance) {
        document.getElementById('compliance-box').innerHTML = `
            <h3>${data.compliance.title}</h3>
            <div>${data.compliance.content}</div>
        `;
    }

    // Section 7: References
    const refContainer = document.getElementById('ref-container');
    data.references.forEach(ref => {
        refContainer.innerHTML += `
            <div style="text-align:center; min-width:100px;">
                ${ref.icon_url ? `<img src="${ref.icon_url}" width="50">` : ''}
                <div><a href="${ref.link}" target="_blank"><strong>${ref.title}</strong></a></div>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', init);
