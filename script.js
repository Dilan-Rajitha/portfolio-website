document.addEventListener('DOMContentLoaded', function() {
    // Menu button functionality
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let menuOpen = false;

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(!menuOpen) {
                menuBtn.classList.add('open');
                navLinks.classList.add('active');
                document.body.classList.add('menu-open');
                menuOpen = true;
            } else {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuOpen = false;
            }
        });
    }

    // Close menu when clicking a link
    const navLinksArray = document.querySelectorAll('.nav-links a');
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuOpen = false;
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuOpen && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.menu-btn')) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuOpen = false;
        }
    });

    // Update menu state on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuOpen = false;
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });




    // Form field focus effects
    const formFields = document.querySelectorAll('.contact-right input, .contact-right textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', () => {
            if (!field.value) {
                field.parentElement.classList.remove('focused');
            }
        });
    });

    // Navbar background change on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = '#ffffff';
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            nav.style.background = 'transparent';
            nav.style.boxShadow = 'none';
        }
    });

    // Timeline filtering
    const timelineTypes = document.querySelectorAll('.timeline-type');
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineTypes.forEach(type => {
        type.addEventListener('click', function() {
            // Remove active class from all types
            timelineTypes.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked type
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            
            // Filter timeline items
            timelineItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.type === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = item.classList.contains('left') ? 
                        'translateX(-50px)' : 'translateX(50px)';
                }
            });
        });
    });

    // Timeline animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = item.classList.contains('left') ? 
            'translateX(-50px)' : 'translateX(50px)';
        item.style.transition = 'all 0.5s ease-out';
        observer.observe(item);
    });

    // Initialize timeline filter
    const educationFilter = document.querySelector('[data-filter="education"]');
    if (educationFilter) {
        educationFilter.click();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const scrollDown = document.querySelector(".scroll-down");

    // Smooth Scroll Effect
    scrollDown.addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelector("#about").scrollIntoView({
            behavior: "smooth"
        });
    });

    // Hover Animation
    scrollDown.addEventListener("mouseenter", () => {
        scrollDown.style.transform = "translateY(-5px)";
    });

    scrollDown.addEventListener("mouseleave", () => {
        scrollDown.style.transform = "translateY(0)";
    });

    // Fade-in Effect on Load
    scrollDown.style.opacity = "0";
    scrollDown.style.transform = "translateY(10px)";
    setTimeout(() => {
        scrollDown.style.transition = "opacity 1s ease-out, transform 0.5s ease-out";
        scrollDown.style.opacity = "1";
        scrollDown.style.transform = "translateY(0)";
    }, 500);
});


