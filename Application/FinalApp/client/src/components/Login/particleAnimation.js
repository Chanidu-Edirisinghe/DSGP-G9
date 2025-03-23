// Particle Animation System
// Current Date and Time (UTC): 2025-03-19 21:03:45
// Current User's Login: DilakshanRahul12

document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    setupMouseInteraction();
  });
  
  function initializeParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
  }
  
  function setupMouseInteraction() {
    document.addEventListener('mousemove', (e) => {
      // Get particles container
      const particlesContainer = document.getElementById('particles-container');
      if (!particlesContainer) return;
      
      // Create particles at mouse position
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;
      
      // Create temporary particle
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Small size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Position at mouse
      particle.style.left = `${mouseX}%`;
      particle.style.top = `${mouseY}%`;
      particle.style.opacity = '0.6';
      
      particlesContainer.appendChild(particle);
      
      // Animate outward
      setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          particle.remove();
        }, 2000);
      }, 10);
      
      // Subtle movement of gradient spheres
      moveGradientSpheres(e);
    });
  }
  
  function moveGradientSpheres(e) {
    const spheres = document.querySelectorAll('.gradient-sphere');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
    
    spheres.forEach(sphere => {
      // Apply only a subtle translation, don't override the animation
      sphere.style.marginLeft = `${moveX}px`;
      sphere.style.marginTop = `${moveY}px`;
    });
  }
  
  function createParticle() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size (small)
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Initial position
    resetParticle(particle);
    
    particlesContainer.appendChild(particle);
    
    // Animate
    animateParticle(particle);
  }
  
  function resetParticle(particle) {
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = '0';
    
    return {
      x: posX,
      y: posY
    };
  }
  
  function animateParticle(particle) {
    // Initial position
    const pos = resetParticle(particle);
    
    // Random animation properties
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    // Animate with timing
    setTimeout(() => {
      particle.style.transition = `all ${duration}s linear`;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      
      // Move in a slight direction
      const moveX = pos.x + (Math.random() * 20 - 10);
      const moveY = pos.y - Math.random() * 30; // Move upwards
      
      particle.style.left = `${moveX}%`;
      particle.style.top = `${moveY}%`;
      
      // Reset after animation completes
      setTimeout(() => {
        if (particle.isConnected) {
          animateParticle(particle);
        }
      }, duration * 1000);
    }, delay * 1000);
  }
  
  // Add user login info to the login page if applicable
  function updateUserInfo() {
    const userInfoElement = document.querySelector('.current-user');
    const dateTimeElement = document.querySelector('.current-datetime');
    
    if (userInfoElement) {
      userInfoElement.textContent = 'DilakshanRahul12';
    }
    
    if (dateTimeElement) {
      dateTimeElement.textContent = '2025-03-19 21:03:45';
    }
  }
  
  // Call this function when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateUserInfo();
  });