/* ==================== GESTION DES MODAUX ==================== */

document.addEventListener('DOMContentLoaded', function() {
    // Ajouter la rubrique Veille dans les anciennes pages sans modifier chaque menu.
    document.querySelectorAll('nav ul').forEach(navList => {
        const hasVeilleLink = navList.querySelector('a[href="veille-technologique.html"]');
        const contactItem = navList.querySelector('a[href="contact.html"]')?.parentElement;

        if (!hasVeilleLink && contactItem) {
            const veilleItem = document.createElement('li');
            const veilleLink = document.createElement('a');
            veilleLink.href = 'veille-technologique.html';
            veilleLink.textContent = 'Veille';

            if (window.location.pathname.endsWith('veille-technologique.html')) {
                veilleLink.classList.add('active');
            }

            veilleItem.appendChild(veilleLink);
            navList.insertBefore(veilleItem, contactItem);
        }
    });

    // Adapter le bouton retour selon la page d'origine.
    const params = new URLSearchParams(window.location.search);
    const cameFromProjects = params.get('from') === 'projets' || document.referrer.includes('projets.html');

    if (cameFromProjects) {
        document.querySelectorAll('.back-link').forEach(link => {
            link.setAttribute('href', 'projets.html');

            const label = link.querySelector('span:last-child');
            if (label) {
                label.textContent = 'Retour aux projets';
            } else {
                link.textContent = '\u2190 Retour aux projets';
            }
        });
    }

    // Gestion des croix des projets (navigation)
    const projectCrosses = document.querySelectorAll('.project-card-cross');
    projectCrosses.forEach(cross => {
        cross.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Récupérer le lien parent
            const link = this.closest('.project-card-link');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });

    // Ouvrir le modal quand on clique sur une croix du tableau
    const crossIcons = document.querySelectorAll('.cross-icon');
    const modal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('.close-btn');

    crossIcons.forEach(cross => {
        cross.style.cursor = 'pointer';
        cross.addEventListener('click', function(e) {
            e.stopPropagation();

            const directLink = this.getAttribute('data-link');
            if (directLink) {
                window.location.href = directLink;
                return;
            }
            
            // Récupérer les données
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const details = this.getAttribute('data-details');
            
            // Remplir le modal
            if (modal && document.getElementById('modalTitle')) {
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('modalDescription').textContent = description;
                const detailsList = document.getElementById('modalDetails');
                
                if (details) {
                    const detailsArray = details.split('|');
                    detailsList.innerHTML = '';
                    detailsArray.forEach(detail => {
                        const li = document.createElement('li');
                        li.textContent = detail.trim();
                        detailsList.appendChild(li);
                    });
                }
                
                // Afficher le modal
                modal.classList.add('active');
            }
        });
    });

    // Fermer le modal
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });

        // Fermer quand on clique en dehors du contenu
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

/* ==================== VALIDATION DU FORMULAIRE ==================== */
function validateForm(event) {
    event.preventDefault();
    
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Expressions régulières
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!nom || !email || !message) {
        alert('Tous les champs sont obligatoires');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide');
        return false;
    }
    
    if (message.length < 10) {
        alert('Le message doit contenir au moins 10 caractères');
        return false;
    }
    
    // Si tout est valide
    alert('Merci pour votre message ! Nous vous recontacterons bientôt.');
    document.getElementById('contactForm').reset();
    return false;
}

/* ==================== APPEL AJAX SIMPLE (OPTIONNEL) ==================== */
function sendFormAjax(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Simulation d'envoi (à adapter avec votre backend)
    fetch('send-email.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message envoyé avec succès !');
            form.reset();
        } else {
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}

/* ==================== SCROLL REVEAL (OPTIONNEL) ==================== */
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

/* ==================== VEILLE CYBER - FLUX RSS ==================== */
document.addEventListener('DOMContentLoaded', function() {
    const newsGrid = document.getElementById('cyberNewsGrid');
    const newsStatus = document.getElementById('cyberNewsStatus');
    const filterButtons = document.querySelectorAll('[data-news-filter]');

    if (!newsGrid || !newsStatus) {
        return;
    }

    const feeds = [
        { name: 'CERT-FR Alertes', url: 'https://www.cert.ssi.gouv.fr/alerte/feed/' },
        { name: 'CERT-FR Avis', url: 'https://www.cert.ssi.gouv.fr/avis/feed/' },
        { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
        { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
        { name: 'ZATAZ', url: 'https://www.zataz.com/feed/' },
        { name: 'Cybernews', url: 'https://cybernews.com/feed/' }
    ];

    const fallbackNews = [
        {
            title: 'Ransomwares : les entreprises restent des cibles prioritaires',
            link: 'https://www.cert.ssi.gouv.fr/',
            source: 'Veille CERT-FR',
            date: 'Surveillance continue',
            description: 'Les attaques par chiffrement et double extorsion entraînent des interruptions de service, pertes de données et coûts de restauration importants.',
            category: 'ransomware'
        },
        {
            title: 'Phishing avancé : des campagnes plus crédibles grâce à l’IA',
            link: 'https://www.cyber.gouv.fr/',
            source: 'Veille ANSSI',
            date: 'Tendance 2026',
            description: 'Les attaquants utilisent l’automatisation et la personnalisation pour créer des messages plus convaincants et contourner la vigilance humaine.',
            category: 'phishing'
        },
        {
            title: 'Failles critiques : l’exploitation rapide impose une veille régulière',
            link: 'https://www.cert.ssi.gouv.fr/avis/',
            source: 'CERT-FR Avis',
            date: 'Surveillance continue',
            description: 'Le suivi des vulnérabilités permet d’anticiper les mises à jour, de prioriser les correctifs et de réduire la surface d’attaque.',
            category: 'vulnerability'
        },
        {
            title: 'IA malveillante et deepfakes : nouveaux risques pour l’identité',
            link: 'https://thehackernews.com/',
            source: 'The Hacker News',
            date: 'Tendance 2026',
            description: 'Les deepfakes, faux appels et contenus générés par IA renforcent les risques d’usurpation, fraude au président et ingénierie sociale.',
            category: 'ai'
        }
    ];

    function cleanText(value) {
        const text = new DOMParser().parseFromString(value || '', 'text/html').body.textContent || '';
        return text.replace(/\s+/g, ' ').trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function safeUrl(value) {
        try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
        } catch (error) {
            return '#';
        }
    }

    function detectCategory(text) {
        const content = text.toLowerCase();

        if (content.includes('ransom') || content.includes('lockbit') || content.includes('extortion')) {
            return 'ransomware';
        }

        if (content.includes('phishing') || content.includes('credential') || content.includes('identifiants')) {
            return 'phishing';
        }

        if (content.includes('cve') || content.includes('vulnerability') || content.includes('vulnérabilité') || content.includes('zero-day')) {
            return 'vulnerability';
        }

        if (content.includes('ai') || content.includes('ia') || content.includes('deepfake') || content.includes('artificial intelligence')) {
            return 'ai';
        }

        return 'all';
    }

    function formatDate(value) {
        if (!value) {
            return 'Date non précisée';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function renderNews(items, filter = 'all') {
        const filteredItems = filter === 'all'
            ? items
            : items.filter(item => item.category === filter);

        newsGrid.innerHTML = '';

        filteredItems.slice(0, 9).forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.dataset.category = item.category;

            card.innerHTML = `
                <div class="news-card-meta">
                    <span>${escapeHtml(item.source)}</span>
                    <span>${escapeHtml(formatDate(item.date))}</span>
                </div>
                <span class="news-tag">${escapeHtml(item.category === 'all' ? 'cyberattaque' : item.category)}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <a href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener noreferrer">Lire la source</a>
            `;

            newsGrid.appendChild(card);
        });

        if (!filteredItems.length) {
            newsGrid.innerHTML = '<p class="news-status">Aucune actualité dans ce filtre pour le moment.</p>';
        }
    }

    async function fetchFeed(feed) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`Flux indisponible : ${feed.name}`);
        }

        const xmlText = await response.text();
        const xml = new DOMParser().parseFromString(xmlText, 'text/xml');

        return Array.from(xml.querySelectorAll('item')).slice(0, 4).map(item => {
            const title = cleanText(item.querySelector('title')?.textContent || 'Actualité cybersécurité');
            const description = cleanText(item.querySelector('description')?.textContent || '').slice(0, 180);
            const link = item.querySelector('link')?.textContent || feed.url;
            const date = item.querySelector('pubDate')?.textContent || '';
            const category = detectCategory(`${title} ${description}`);

            return {
                title,
                description: description || 'Article de veille cybersécurité à consulter pour suivre l’évolution des menaces.',
                link,
                date,
                source: feed.name,
                category
            };
        });
    }

    async function loadCyberNews() {
        try {
            const results = await Promise.allSettled(feeds.map(fetchFeed));
            const items = results
                .filter(result => result.status === 'fulfilled')
                .flatMap(result => result.value)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (!items.length) {
                throw new Error('Aucun flux chargé');
            }

            window.cyberNewsItems = items;
            newsStatus.textContent = `${items.length} actualités récupérées automatiquement depuis les flux de veille.`;
            renderNews(items);
        } catch (error) {
            window.cyberNewsItems = fallbackNews;
            newsStatus.textContent = 'Flux externes indisponibles dans ce navigateur : affichage de la synthèse de veille.';
            renderNews(fallbackNews);
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            renderNews(window.cyberNewsItems || fallbackNews, button.dataset.newsFilter);
        });
    });

    loadCyberNews();
});
