// Dark mode toggle
const darkBtn = document.getElementById('darkModeBtn');
darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Hamburger menu toggle for mobile
const navbarBurger = document.querySelector('.navbar-burger');
const navbarMenu = document.querySelector('.navbar-menu');

if (navbarBurger && navbarMenu) {
    navbarBurger.addEventListener('click', () => {
        navbarBurger.classList.toggle('active');
        navbarMenu.classList.toggle('is-active');
    });

    // Close mobile menu when a link is clicked
    navbarMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarBurger.classList.remove('active');
            navbarMenu.classList.remove('is-active');
        });
    });
}

// Price filter
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
if (priceRange && priceValue) {
    priceRange.addEventListener('input', () => {
        priceValue.textContent = `$${priceRange.value}`;
        // Add filtering logic for destinations as needed
        filterDestinationsByPrice(parseInt(priceRange.value));
    });
    // Initialize price value on load
    priceValue.textContent = `$${priceRange.value}`;
}

// Nav link active class on click (for desktop nav)
const navLinks = document.querySelectorAll('.navbar-center .nav-link'); // Target desktop nav links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Remove active from all desktop links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active to the clicked desktop link
        this.classList.add('active');
    });
});

// Intersection Observer for scroll-based active state
const sections = document.querySelectorAll('section[id]');

const sectionIdToNavLink = {};
// Populate for desktop nav links
document.querySelectorAll('.navbar-center .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
        sectionIdToNavLink[href.replace('#', '')] = link;
    }
});
// Populate for mobile nav links (if different active styling is desired)
document.querySelectorAll('.navbar-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
        sectionIdToNavLink[href.replace('#', '')] = link;
    }
});

let currentActive = null;

const observer = new IntersectionObserver(
    (entries) => {
        let maxRatio = 0;
        let mostVisibleId = null;
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                mostVisibleId = entry.target.getAttribute('id');
            }
        });

        if (mostVisibleId) {
            // Remove active from all nav links (both desktop and mobile)
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

            // Add active to the corresponding desktop nav link
            const desktopNavLink = document.querySelector(`.navbar-center a[href="#${mostVisibleId}"]`);
            if (desktopNavLink) {
                desktopNavLink.classList.add('active');
            }

            // Add active to the corresponding mobile nav link
            const mobileNavLink = document.querySelector(`.navbar-menu a[href="#${mostVisibleId}"]`);
            if (mobileNavLink) {
                mobileNavLink.classList.add('active');
            }
        }
    },
    {
        threshold: Array.from({length: 101}, (_, i) => i / 100) // 0, 0.01, ..., 1
    }
);

sections.forEach(section => observer.observe(section));

// Smooth scrolling for navbar links
document.querySelectorAll('.navbar-container .nav-link, .navbar-menu .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL hash without jump
                history.pushState(null, '', href);
            }
        }
    });
});

// Tabs filter for destinations
const tabBtns = document.querySelectorAll('.tab-btn');
const destCards = document.querySelectorAll('.destination-card');

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');

        const allCards = Array.from(destCards); // Convert NodeList to Array

        if (filter === 'all') {
            allCards.forEach(card => card.style.display = ''); // Show all cards
        } else {
            // Filter cards by data-type
            const matchingCards = allCards.filter(card => card.getAttribute('data-type') === filter);

            // Determine how many to show (2 or 3)
            const countToShow = Math.floor(Math.random() * 2) + 2; // Randomly 2 or 3

            // Shuffle the matching cards and slice to get the desired count
            const shuffledAndSelected = shuffle(matchingCards).slice(0, countToShow);

            // Hide all cards first
            allCards.forEach(card => card.style.display = 'none');

            // Show only the selected cards
            shuffledAndSelected.forEach(card => {
                card.style.display = '';
            });
        }
    });
});

// Function to filter destinations by price
function filterDestinationsByPrice(maxPrice) {
    destCards.forEach(card => {
        const priceSpan = card.querySelector('.price');
        if (priceSpan) {
            const price = parseInt(priceSpan.textContent.replace('$', ''));
            if (price <= maxPrice) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}


// Up arrow button logic
const toTopBtn = document.getElementById('toTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        toTopBtn.style.display = 'flex'; // Use flex to center content
    } else {
        toTopBtn.style.display = 'none';
    }
});
toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
