// script.js
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Bedankt voor je bericht! We nemen snel contact met je op.');
  this.reset();
});

// Smooth scroll voor navigatie
const links = document.querySelectorAll('nav a');

for (let link of links) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
}
