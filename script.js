const speakBtn = document.getElementById("speakBtn");

// Global variables for speech synthesis and recognition
let synth = window.speechSynthesis;
let utterance;
let isPaused = false;
let chatbotRecognition; // New variable for chatbot speech recognition
let isChatbotListening = false; // New variable for chatbot listening state

// Initialize speech synthesis
function initSpeech() {
  try {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported in this browser");
      return;
    }
    
  // Some browsers need this to initialize speech synthesis
  synth.cancel();
    
  // Force a small delay to ensure speech synthesis is ready
  setTimeout(() => {
      console.log("Speech synthesis initialized successfully");
      
      // Test if speech synthesis is working
      const testUtterance = new SpeechSynthesisUtterance("");
      testUtterance.text = "";
      synth.speak(testUtterance);
      synth.cancel(); // Immediately cancel the test
  }, 100);
  } catch (error) {
    console.error("Error initializing speech synthesis:", error);
  }
}

// Initialize sidebar when the page loads
window.addEventListener('load', () => {
  // Removed unused audio code
  initSpeech();
  initSidebar();
  displayMainPageEvents(); // Display historical events on main page
  initHomepageExperience();
});

function initHomepageExperience() {
  const revealSections = document.querySelectorAll('.reveal-section');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealSections.forEach(section => revealObserver.observe(section));
  } else {
    revealSections.forEach(section => section.classList.add('is-visible'));
  }
  startNovaDemo();
}

function scrollToJourney() {
  document.getElementById('cosmicJourney')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function launchCosmicJourney() {
  scrollToJourney();
  setTimeout(() => document.querySelector('.destination-card')?.focus(), 700);
}

function travelToDestination(destination) {
  updateJourneyNarration(destination);
  const routes = {
    earth: () => openSolarSystemAt('earth'),
    moon: () => openPanel('moon'),
    mars: () => openSolarSystemAt('mars'),
    iss: () => openPanel('satellites'),
    'deep-space': () => openPanel('parallax')
  };
  routes[destination]?.();
}

function updateJourneyNarration(destination) {
  const narration = {
    earth: "Beginning at Earth. Notice the thin atmosphere, the blue oceans, and the magnetic shield that makes life possible.",
    moon: "Next stop: the Moon. Nova is opening lunar data so you can inspect the nearest world humans have walked on.",
    mars: "Course plotted for Mars. Watch the observatory fly to the red planet and compare it with Earth.",
    iss: "Switching to low Earth orbit. The satellite module will show orbital assets and the human presence above Earth.",
    "deep-space": "Leaving the inner system. Deep Space mode stretches the journey into distance, scale, and wonder."
  };
  const message = narration[destination] || "Journey updated.";
  updateNovaSuggestion(message, [
    "Narrate this journey",
    "What should I notice?",
    "Give me one surprising fact"
  ]);
}

function locateInUniverse(event) {
  event.preventDefault();
  const input = document.getElementById('universeCity');
  document.getElementById('cosmicCityName').textContent = input.value.trim() || 'Your city';
  const address = document.getElementById('cosmicAddress');
  address.classList.remove('active');
  void address.offsetWidth;
  address.classList.add('active');
  return false;
}

function startNovaDemo() {
  const demo = document.getElementById('novaDemoText');
  if (!demo) return;
  const lines = [
    'Where should we explore next?',
    'I can fly you to Mars.',
    'Ask me why black holes bend time.',
    'Zenith Radar is ready for review.'
  ];
  let lineIndex = 0;

  function typeLine() {
    const line = lines[lineIndex];
    demo.textContent = '';
    let character = 0;
    const typing = setInterval(() => {
      demo.textContent += line[character] || '';
      character++;
      if (character > line.length) {
        clearInterval(typing);
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(typeLine, 1900);
      }
    }, 38);
  }
  typeLine();
}

// Credits Modal Functions
function showCredits() {
  const modal = document.getElementById('creditsModal');
  modal.style.display = 'block';
  // Add body scroll lock
  document.body.style.overflow = 'hidden';
}

function closeCredits() {
  const modal = document.getElementById('creditsModal');
  modal.style.display = 'none';
  // Restore body scroll
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  const modal = document.getElementById('creditsModal');
  if (event.target === modal) {
    closeCredits();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCredits();
  }
});

async function getAstronomyData() {
  const date = document.getElementById('dateInput').value;
  const apiKey = 'Qxb7zlqMJtSelzhTHP4ISbNyMbeUjrf0gL1Clt4l';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && !data.error) {
      // Create output area in the panel if it doesn't exist
      let outputArea = document.querySelector('.panel-content #output');
      if (!outputArea) {
        const panelContent = document.querySelector('.panel-content');
        const outputDiv = document.createElement('div');
        outputDiv.className = 'historical-output';
        outputDiv.innerHTML = `
          <button id="speakBtn" onclick="toggleSpeech()" style="display: none;">🔊 Listen to Whisper</button>
          <div id="output"></div>
        `;
        panelContent.appendChild(outputDiv);
        outputArea = document.querySelector('.panel-content #output');
      }

      outputArea.innerHTML = `
        <div class="story">
          <h2>${data.title} (${data.date})</h2>
          <p id="textToSpeak">"${data.explanation}"</p>
          <img src="${data.url}" alt="Astronomy Image" />
        </div>`;
      
      // Show the whisper button in the panel
      const speakBtn = document.querySelector('.panel-content #speakBtn');
      if (speakBtn) {
      speakBtn.style.display = "inline-block";
      speakBtn.textContent = "🔊 Listen to Whisper";
      window.speechSynthesis.cancel(); // reset previous speech
      isPaused = false;
      }
    } else {
      // Create output area in the panel if it doesn't exist
      let outputArea = document.querySelector('.panel-content #output');
      if (!outputArea) {
        const panelContent = document.querySelector('.panel-content');
        const outputDiv = document.createElement('div');
        outputDiv.className = 'historical-output';
        outputDiv.innerHTML = `
          <button id="speakBtn" onclick="toggleSpeech()" style="display: none;">🔊 Listen to Whisper</button>
          <div id="output"></div>
        `;
        panelContent.appendChild(outputDiv);
        outputArea = document.querySelector('.panel-content #output');
      }
      
      outputArea.innerHTML = "<p>The universe is silent today...</p>";
      const speakBtn = document.querySelector('.panel-content #speakBtn');
      if (speakBtn) {
      speakBtn.style.display = "none";
      }
    }
  } catch (err) {
    // Create output area in the panel if it doesn't exist
    let outputArea = document.querySelector('.panel-content #output');
    if (!outputArea) {
      const panelContent = document.querySelector('.panel-content');
      const outputDiv = document.createElement('div');
      outputDiv.className = 'historical-output';
      outputDiv.innerHTML = `
        <button id="speakBtn" onclick="toggleSpeech()" style="display: none;">🔊 Listen to Whisper</button>
        <div id="output"></div>
      `;
      panelContent.appendChild(outputDiv);
      outputArea = document.querySelector('.panel-content #output');
    }
    
    outputArea.innerHTML = "<p>Something went wrong. Try again later.</p>";
    const speakBtn = document.querySelector('.panel-content #speakBtn');
    if (speakBtn) {
    speakBtn.style.display = "none";
    }
    console.error(err);
  }
}

function toggleSpeech() {
  try {
    console.log("toggleSpeech called");
    
    // Find the speak button within the panel context
    const speakBtn = document.querySelector('.panel-content #speakBtn');
    const textElement = document.getElementById("textToSpeak");
    const text = textElement?.textContent || "";
    
    console.log("Found speak button:", speakBtn);
    console.log("Found text element:", textElement);
    console.log("Text to speak:", text.substring(0, 100) + "...");
    
    if (!text.trim()) {
      console.log("No text to speak");
      alert("No text found to speak. Please try selecting a date and clicking 'Whisper to Me' first.");
      return;
    }

    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not available");
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // If already speaking and not paused, pause it
    if (synth.speaking && !isPaused) {
      console.log("Pausing speech");
      synth.pause();
      isPaused = true;
      if (speakBtn) speakBtn.textContent = "▶️ Resume Whisper";
      return;
    }

    // If paused, resume it
    if (isPaused) {
      console.log("Resuming speech");
      synth.resume();
      isPaused = false;
      if (speakBtn) speakBtn.textContent = "🔇 Pause Whisper";
      return;
    }

    // If not speaking at all, start fresh
    console.log("Starting new speech");
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("Speech started successfully");
      isPaused = false;
      if (speakBtn) speakBtn.textContent = "🔇 Pause Whisper";
    };

    utterance.onend = () => {
      console.log("Speech ended");
      isPaused = false;
      if (speakBtn) speakBtn.textContent = "🔊 Listen to Whisper";
    };

    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      isPaused = false;
      if (speakBtn) speakBtn.textContent = "🔊 Listen to Whisper";
      alert("Speech synthesis error: " + event.error);
      // Try to recover by reinitializing
      initSpeech();
    };

    // Cancel any existing speech and start new
    synth.cancel();
    // Small delay to ensure clean state
    setTimeout(() => {
      console.log("Speaking text...");
      synth.speak(utterance);
    }, 100);
  } catch (error) {
    console.error("Error in toggleSpeech:", error);
    const speakBtn = document.querySelector('.panel-content #speakBtn');
    if (speakBtn) speakBtn.textContent = "🔊 Listen to Whisper";
    alert("Error with speech synthesis: " + error.message);
    // Try to recover by reinitializing
    initSpeech();
  }
}

// Star effects code
function createStars() {
  const starOverlay = document.createElement('div');
  starOverlay.className = 'star-overlay';
  
  // Create 100 stars
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // Random size (1-4px)
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    // Random animation delay
    star.style.animationDelay = Math.random() * 2 + 's';
    
    // Random animation duration
    star.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    
    starOverlay.appendChild(star);
  }
  
  document.body.appendChild(starOverlay);
}

// Create stars when the page loads
window.addEventListener('load', createStars);

// Cosmic Control Panel Functions
function initSidebar() {
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  
  sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
      const panelType = button.getAttribute('data-panel');
      openPanel(panelType);
    });
  });
}

function openPanel(panelType) {
  document.querySelectorAll('.sidebar-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.panel === panelType);
  });

  // Special handling for 3D solar system - open immediately without panel
  if (panelType === 'solar-system-3d') {
    openSolarSystem();
    return;
  }
  
  const overlay = document.getElementById('panelOverlay');
  const content = document.getElementById('panelContent');
  overlay.dataset.panel = panelType;
  content.className = 'panel-module';
  const floatingAlien = document.getElementById('floating-alien');
  if (floatingAlien) floatingAlien.style.display = 'none';
  
  // Show loading animation for all panels
  content.innerHTML = `
    <div class="panel-loading">
      <div class="loading-spinner">🌌</div>
      <p>Loading cosmic data...</p>
    </div>
  `;
  
  // Load panel content based on type
  setTimeout(() => {
    switch(panelType) {
      case 'zenith-radar':
        content.innerHTML = getZenithRadarPanel();
        setTimeout(() => initZenithRadarDashboard(), 100);
        break;
      case 'historical':
        content.innerHTML = getHistoricalEventsPanel();
        // Removed auto-load current date - user will select their own date
        break;
      case 'moon':
        content.innerHTML = getMoonPanel();
        // Auto-load moon data
        setTimeout(() => refreshMoonData(), 100);
        break;
      case 'sun':
        content.innerHTML = getSunPanel();
        // Auto-load sun data
        setTimeout(() => refreshSunData(), 100);
        break;
      case 'satellites':
        content.innerHTML = getSatellitesPanel();
        // Auto-load satellite data
        setTimeout(() => loadSatelliteData(), 100);
        break;
      case 'constellations':
        content.innerHTML = getConstellationsPanel();
        // Initialize constellation canvas
        setTimeout(() => initConstellationCanvas(), 100);
        break;
      case 'aurora':
        content.innerHTML = getAuroraPanel();
        // Auto-load aurora data and initialize video
        setTimeout(() => {
          loadAuroraData();
          initAuroraVideo();
        }, 100);
        break;
      case 'parallax':
        content.innerHTML = getParallaxPanel();
        // Add loading animation for parallax
        setTimeout(() => initParallaxJourney(), 100);
        break;
      case 'themes':
        content.innerHTML = getThemesPanel();
        // Add loading animation for themes
        setTimeout(() => loadThemeOptions(), 100);
        break;
      case 'mission':
        content.innerHTML = getMissionPanel();
        // Add loading animation for mission
        setTimeout(() => initMissionSimulator(), 100);
        break;
      case 'quiz':
        content.innerHTML = getQuizPanel();
        // Add loading animation for quiz
        setTimeout(() => loadQuizQuestions(), 100);
        break;
      case 'voice':
        content.innerHTML = getVoicePanel();
        // Add loading animation for voice
        setTimeout(() => initVoiceCommands(), 100);
        break;
      case 'news':
        content.innerHTML = getNewsPanel();
        // Add loading animation for news
        setTimeout(() => loadSpaceNews(), 100);
        break;
      case 'creators':
        content.innerHTML = getCreatorsPanel();
        setTimeout(() => {
          const panel = document.querySelector('.creators-panel');
          if(panel) panel.classList.add('show');
        }, 50);
        break;
      default:
        content.innerHTML = '<h2>Panel not implemented yet</h2>';
    }
    decoratePanel(panelType, content);
  }, 500); // Show loading for 500ms
  
  overlay.style.display = 'flex';
}

function decoratePanel(panelType, content) {
  const panelMeta = {
    'zenith-radar': ['CELESTIAL EYE', 'Zenith Radar', 'Real-time orbital tracking and planetary coordinates dashboard.'],
    historical: ['SPACE ARCHIVE', 'Space History', 'Explore landmark discoveries and retrieve NASA astronomy records by date.'],
    aurora: ['ATMOSPHERIC LAB', 'Aurora Intelligence', 'Monitor visibility conditions and understand the physics behind polar light.'],
    constellations: ['STELLAR CARTOGRAPHY', 'Constellation Map', 'Inspect, connect, and identify patterns across a responsive star field.'],
    satellites: ['ORBITAL NETWORK', 'Satellite Operations', 'Review active orbital assets, launch events, and mission classifications.'],
    parallax: ['DEEP-SPACE TRANSIT', 'Parallax Journey', 'Travel from Earth orbit into deep space through an interactive distance model.'],
    sun: ['HELIOPHYSICS', 'Solar Monitor', 'Track the scale, temperature, and simulated activity of our host star.'],
    moon: ['LUNAR SCIENCE', 'Lunar Monitor', 'Inspect the Moon’s current phase, distance, physical profile, and orbital facts.'],
    voice: ['HANDS-FREE CONTROL', 'Voice Interface', 'Navigate the observatory with natural speech commands supported by your browser.'],
    quiz: ['KNOWLEDGE SYSTEM', 'Cosmic Quiz', 'Test your astronomy knowledge across adaptive difficulty levels.'],
    news: ['MISSION INTELLIGENCE', 'Space Briefing', 'Review simulated mission, discovery, and technology updates.'],
    creators: ['PROJECT LOG', 'The Team', 'Meet the people behind the observatory and its interactive systems.']
  };

  const meta = panelMeta[panelType] || ['OBSERVATORY MODULE', 'Mission Module', 'Interactive scientific tools and information.'];
  content.insertAdjacentHTML('afterbegin', `
    <header class="module-intro">
      <span class="module-kicker">${meta[0]}</span>
      <h1>${meta[1]}</h1>
      <p>${meta[2]}</p>
    </header>
  `);

  content.querySelectorAll('h2, h3, h4, button, .satellite-name, .constellation-name, .log-entry').forEach(element => {
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(/^[^\x00-\x7F]+\s*/, '');
      }
    });
  });
}

function closePanel() {
  const overlay = document.getElementById('panelOverlay');
  overlay.style.display = 'none';
  document.querySelectorAll('.sidebar-btn').forEach(button => button.classList.remove('active'));
  const floatingAlien = document.getElementById('floating-alien');
  if (floatingAlien) floatingAlien.style.display = '';
}

// Panel content functions (placeholder implementations)
function getMoonPanel() {
  return `
    <h2>🌕 Moon Data</h2>
    <div class="moon-container">
      <div class="moon-info">
        <div class="info-card">
          <h3>Distance from Earth</h3>
          <div id="moonDistance">Loading...</div>
        </div>
        <div class="info-card">
          <h3>Phase</h3>
          <div id="moonPhase">Loading...</div>
        </div>
        <div class="info-card">
          <h3>Diameter</h3>
          <div id="moonDiameter">3,474 km</div>
        </div>
        <div class="info-card">
          <h3>Temperature</h3>
          <div id="moonTemp">-233°C to 123°C</div>
        </div>
      </div>
      <div class="moon-facts">
        <h3>🌙 Moon Facts</h3>
        <ul id="moonFacts">
          <li>The Moon is Earth's only natural satellite</li>
          <li>It takes 27.3 days to orbit Earth</li>
          <li>The Moon's gravity is 1/6th of Earth's</li>
          <li>There's no atmosphere on the Moon</li>
          <li>The Moon is slowly moving away from Earth</li>
        </ul>
      </div>
    </div>
  `;
}

async function refreshMoonData() {
  try {
    // Calculate current moon phase based on date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Simple moon phase calculation (approximate)
    const phase = calculateMoonPhase(year, month, day);
    const distance = 384400; // Fixed average distance in km
    
    document.getElementById('moonPhase').innerHTML = `
      <span class="phase-icon">${getPhaseIcon(phase)}</span>
      <span class="phase-text">${phase}</span>
    `;
    document.getElementById('moonDistance').innerHTML = `
      <span class="distance-value">${distance.toLocaleString()} km</span><br><span style='font-size:12px;color:#0ff;'>Moving away by 3.8 cm/year</span>
    `;
    
    // Add a success message
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
      refreshBtn.textContent = '✅ Data Updated!';
      setTimeout(() => {
        refreshBtn.textContent = '🔄 Refresh Data';
      }, 2000);
    }
  } catch (error) {
    console.error('Error refreshing moon data:', error);
    document.getElementById('moonPhase').innerHTML = '🌕 Full Moon';
    document.getElementById('moonDistance').innerHTML = '384,400 km <br><span style=\'font-size:12px;color:#0ff;\'>Moving away by 3.8 cm/year</span>';
  }
}

function calculateMoonPhase(year, month, day) {
  // Simple moon phase calculation
  const phases = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
  ];
  
  // Use date to determine phase (simplified)
  const dayOfYear = Math.floor((new Date(year, month - 1, day) - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24));
  const phaseIndex = Math.floor((dayOfYear % 29.5) / 3.7); // 29.5 days lunar cycle
  
  return phases[phaseIndex] || 'Full Moon';
}

function getPhaseIcon(phase) {
  const phases = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘'
  };
  return phases[phase] || '🌕';
}

function getSunPanel() {
  return `
    <h2>☀ Sun Data</h2>
    <div class="sun-container">
      <div class="sun-info">
        <div class="info-card">
          <h3>Distance from Earth</h3>
          <div id="sunDistance">149,600,000 km</div>
        </div>
        <div class="info-card">
          <h3>Diameter</h3>
          <div id="sunDiameter">1,392,700 km</div>
        </div>
        <div class="info-card">
          <h3>Surface Temperature</h3>
          <div id="sunTemp">5,500°C</div>
        </div>
        <div class="info-card">
          <h3>Core Temperature</h3>
          <div id="sunCoreTemp">15,000,000°C</div>
        </div>
      </div>
      <div class="sun-facts">
        <h3>☀ Solar Facts</h3>
        <ul id="sunFacts">
          <li>The Sun contains 99.86% of the solar system's mass</li>
          <li>Light takes 8 minutes to reach Earth from the Sun</li>
          <li>The Sun rotates faster at its equator than at its poles</li>
          <li>Solar flares can reach temperatures of 10 million degrees</li>
          <li>The Sun will become a red giant in about 5 billion years</li>
        </ul>
      </div>
      <div class="solar-activity">
        <h3>🌞 Current Solar Activity</h3>
        <div id="solarActivity">Loading solar activity...</div>
      </div>
    </div>
    <button onclick="refreshSunData()" class="refresh-btn">🔄 Refresh Solar Data</button>
  `;
}

async function refreshSunData() {
  try {
    // Simulate solar activity data
    const activities = [
      'Quiet - No significant activity',
      'Low - Minor solar flares detected',
      'Moderate - Active regions observed',
      'High - Solar storms possible',
      'Extreme - Major solar events likely'
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const sunspots = Math.floor(Math.random() * 50) + 5;
    const solarWind = Math.floor(Math.random() * 500) + 300;
    
    document.getElementById('solarActivity').innerHTML = `
      <div class="activity-item">
        <span class="activity-label">Status:</span>
        <span class="activity-value">${randomActivity}</span>
      </div>
      <div class="activity-item">
        <span class="activity-label">Sunspots:</span>
        <span class="activity-value">${sunspots} active regions</span>
      </div>
      <div class="activity-item">
        <span class="activity-label">Solar Wind:</span>
        <span class="activity-value">${solarWind} km/s</span>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching sun data:', error);
    document.getElementById('solarActivity').innerHTML = 'Unable to load solar activity data';
  }
}

function getSatellitesPanel() {
  return `
    <h2>🛰 Satellites</h2>
    <div class="satellites-container">
      <div class="date-selector">
        <h3>📅 Select Date</h3>
        <input type="date" id="satelliteDate" onchange="loadSatelliteData()" />
        <button onclick="loadSatelliteData()" class="load-btn">🚀 Load Satellite Events</button>
      </div>
      
      <div class="satellite-stats">
        <div class="stat-card">
          <h4>🛰 Active Satellites</h4>
          <div id="activeSatellites">~3,000</div>
        </div>
        <div class="stat-card">
          <h4>🌍 Earth Observation</h4>
          <div id="earthObs">~1,200</div>
        </div>
        <div class="stat-card">
          <h4>📡 Communications</h4>
          <div id="communications">~800</div>
        </div>
        <div class="stat-card">
          <h4>🔬 Scientific</h4>
          <div id="scientific">~400</div>
        </div>
      </div>
      
      <div class="satellite-events">
        <h3>📡 Satellite Events for <span id="selectedDate">Today</span></h3>
        <div id="satelliteEvents">
          <p>Select a date to view satellite events and launches...</p>
        </div>
      </div>
      
      <div class="notable-satellites">
        <h3>🌟 Notable Satellites</h3>
        <div class="satellite-list">
          <div class="satellite-item">
            <span class="satellite-name">🛰 International Space Station (ISS)</span>
            <span class="satellite-desc">Orbital laboratory, launched 1998</span>
          </div>
          <div class="satellite-item">
            <span class="satellite-name">🔭 Hubble Space Telescope</span>
            <span class="satellite-desc">Space observatory, launched 1990</span>
          </div>
          <div class="satellite-item">
            <span class="satellite-name">🌍 Landsat 9</span>
            <span class="satellite-desc">Earth observation, launched 2021</span>
          </div>
          <div class="satellite-item">
            <span class="satellite-name">🛰 Starlink Constellation</span>
            <span class="satellite-desc">Internet satellites, 4000+ deployed</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadSatelliteData() {
  const dateInput = document.getElementById('satelliteDate');
  const selectedDate = dateInput.value || new Date().toISOString().split('T')[0];
  
  // Update selected date display
  document.getElementById('selectedDate').textContent = new Date(selectedDate).toLocaleDateString();
  
  // Show loading state
  document.getElementById('satelliteEvents').innerHTML = '<p>🔍 Searching for satellite events...</p>';
  
  // Simulate loading delay
  setTimeout(() => {
    // Generate simulated satellite events for the selected date
    const events = generateSimulatedSatelliteEvents(selectedDate);
    
    document.getElementById('satelliteEvents').innerHTML = events;
    
    // Update stats with simulated data
    updateSimulatedSatelliteStats();
  }, 800);
}

function generateSimulatedSatelliteEvents(date) {
  const eventTypes = [
    {
      type: 'launch',
      titles: [
        'SpaceX Falcon 9 Launch',
        'ESA Ariane 6 Mission',
        'Blue Origin New Shepard',
        'Rocket Lab Electron Launch',
        'Virgin Galactic SpaceShipTwo',
        'ISRO PSLV Mission',
        'Roscosmos Soyuz Launch',
        'JAXA H-IIA Rocket'
      ],
      descriptions: [
        'Starlink satellite deployment',
        'Commercial satellite deployment',
        'Scientific payload launch',
        'Earth observation mission',
        'Space tourism flight',
        'Communication satellite launch',
        'International space station resupply',
        'Planetary exploration mission'
      ]
    },
    {
      type: 'pass',
      titles: [
        'ISS Pass Overhead',
        'Hubble Telescope Pass',
        'Starlink Constellation Pass',
        'GPS Satellite Pass',
        'Aurora Sensor Pass'
      ],
      descriptions: [
        'Visible pass of International Space Station',
        'Space telescope orbital passage',
        'Satellite constellation visibility',
        'Navigation satellite overhead',
        'Aurora monitoring satellite pass'
      ]
    },
    {
      type: 'event',
      titles: [
        'Satellite Maneuver',
        'Space Debris Avoidance',
        'Orbital Adjustment',
        'Solar Panel Deployment',
        'Antenna Activation'
      ],
      descriptions: [
        'Collision avoidance maneuver',
        'Debris field navigation',
        'Orbit correction burn',
        'Power system activation',
        'Communication system test'
      ]
    }
  ];
  
  // Generate 2-4 random events for the date
  const numEvents = Math.floor(Math.random() * 3) + 2;
  const events = [];
  
  for (let i = 0; i < numEvents; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const titleIndex = Math.floor(Math.random() * eventType.titles.length);
    const descIndex = Math.floor(Math.random() * eventType.descriptions.length);
    
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} UTC`;
    
    events.push({
      type: eventType.type,
      title: eventType.titles[titleIndex],
      description: eventType.descriptions[descIndex],
      time: time
    });
  }
  
  // Sort by time
  events.sort((a, b) => {
    const timeA = new Date(`2000-01-01 ${a.time}`);
    const timeB = new Date(`2000-01-01 ${b.time}`);
    return timeA - timeB;
  });
  
  return events.map(event => `
    <div class="event-item ${event.type}">
      <div class="event-time">${event.time}</div>
      <div class="event-content">
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description}</div>
      </div>
    </div>
  `).join('');
}

function updateSimulatedSatelliteStats() {
  // Generate realistic but varied satellite statistics
  const realStats = {
    activeSatellites: Math.floor(Math.random() * 500) + 2800, // 2800-3300
    earthObs: Math.floor(Math.random() * 200) + 1100, // 1100-1300
    communications: Math.floor(Math.random() * 150) + 750, // 750-900
    scientific: Math.floor(Math.random() * 100) + 350 // 350-450
  };
  
  document.getElementById('activeSatellites').textContent = realStats.activeSatellites.toLocaleString();
  document.getElementById('earthObs').textContent = realStats.earthObs.toLocaleString();
  document.getElementById('communications').textContent = realStats.communications.toLocaleString();
  document.getElementById('scientific').textContent = realStats.scientific.toLocaleString();
}

function getConstellationsPanel() {
  return `
    <h2>🌌 Constellation Map</h2>
    <div class="constellation-container">
      <div class="constellation-controls">
        <button onclick="toggleConstellationMode()" id="modeBtn" class="control-btn">🔗 Connect Mode</button>
        <button onclick="clearConstellation()" class="control-btn">🗑️ Clear</button>
        <button onclick="saveConstellation()" class="control-btn">💾 Save</button>
        <button onclick="loadConstellation()" class="control-btn">📂 Load</button>
      </div>
      
      <div class="constellation-info">
        <h3>🌟 Constellation Information</h3>
        <div id="constellationInfo">
          <p>Click on stars to view information or connect them to form constellations.</p>
        </div>
      </div>
      
      <div class="constellation-canvas-container">
        <canvas id="constellationCanvas" width="800" height="600"></canvas>
        <div class="constellation-overlay">
          <div class="zoom-controls">
            <button onclick="zoomIn()" class="zoom-btn">🔍+</button>
            <button onclick="zoomOut()" class="zoom-btn">🔍-</button>
            <button onclick="resetZoom()" class="zoom-btn">🔄 Reset</button>
          </div>
        </div>
      </div>
      
      <div class="constellation-list">
        <h3>📋 Famous Constellations</h3>
        <div class="constellation-grid">
          <div class="constellation-item" onclick="highlightConstellation('ursa_major')">
            <span class="constellation-name">🐻 Ursa Major (Big Dipper)</span>
            <span class="constellation-desc">The Great Bear</span>
          </div>
          <div class="constellation-item" onclick="highlightConstellation('orion')">
            <span class="constellation-name">🏹 Orion</span>
            <span class="constellation-desc">The Hunter</span>
          </div>
          <div class="constellation-item" onclick="highlightConstellation('cassiopeia')">
            <span class="constellation-name">👑 Cassiopeia</span>
            <span class="constellation-desc">The Queen</span>
          </div>
          <div class="constellation-item" onclick="highlightConstellation('cygnus')">
            <span class="constellation-name">🦢 Cygnus</span>
            <span class="constellation-desc">The Swan</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Constellation variables
let constellationMode = 'connect';
let selectedStars = [];
let constellationData = [];
let canvas, ctx;
let zoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let lastX, lastY;

// Initialize constellation canvas
function initConstellationCanvas() {
  canvas = document.getElementById('constellationCanvas');
  ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;
  
  // Add event listeners
  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('click', handleStarClick);
  
  // Generate stars
  generateStars();
  drawConstellation();
}

// Generate random stars
function generateStars() {
  constellationData = [];
  const starNames = [
    'Polaris', 'Vega', 'Sirius', 'Betelgeuse', 'Rigel', 'Deneb', 'Altair',
    'Arcturus', 'Capella', 'Procyon', 'Aldebaran', 'Spica', 'Antares',
    'Fomalhaut', 'Regulus', 'Algol', 'Mira', 'Alcyone', 'Atlas', 'Pleiades'
  ];
  
  for (let i = 0; i < 50; i++) {
    constellationData.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      brightness: Math.random() * 0.8 + 0.2,
      name: i < starNames.length ? starNames[i] : `Star ${i + 1}`,
      constellation: getRandomConstellation(),
      selected: false
    });
  }
}

function getRandomConstellation() {
  const constellations = ['Ursa Major', 'Orion', 'Cassiopeia', 'Cygnus', 'Leo', 'Gemini'];
  return constellations[Math.floor(Math.random() * constellations.length)];
}

// Draw constellation
function drawConstellation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Apply zoom and pan
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);
  
  // Draw stars
  constellationData.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.brightness * 4, 0, Math.PI * 2);
    ctx.fillStyle = star.selected ? '#0ff' : `rgba(255, 255, 255, ${star.brightness})`;
    ctx.fill();
    
    // Draw star name if selected
    if (star.selected) {
      ctx.fillStyle = '#0ff';
      ctx.font = '12px Orbitron';
      ctx.fillText(star.name, star.x + 10, star.y - 10);
    }
  });
  
  // Draw connections
  if (selectedStars.length > 1) {
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(selectedStars[0].x, selectedStars[0].y);
    for (let i = 1; i < selectedStars.length; i++) {
      ctx.lineTo(selectedStars[i].x, selectedStars[i].y);
    }
    ctx.stroke();
  }
  
  ctx.restore();
}

// Handle star click
function handleStarClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left - panX) / zoom;
  const y = (event.clientY - rect.top - panY) / zoom;
  
  // Find clicked star
  const clickedStar = constellationData.find(star => {
    const distance = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2);
    return distance < 20;
  });
  
  if (clickedStar) {
    if (constellationMode === 'connect') {
      clickedStar.selected = !clickedStar.selected;
      if (clickedStar.selected) {
        selectedStars.push(clickedStar);
      } else {
        selectedStars = selectedStars.filter(s => s !== clickedStar);
      }
    }
    
    // Show star information
    showStarInfo(clickedStar);
    drawConstellation();
  }
}

// Show star information
function showStarInfo(star) {
  const info = document.getElementById('constellationInfo');
  info.innerHTML = `
    <div class="star-info">
      <h4>⭐ ${star.name}</h4>
      <p><strong>Constellation:</strong> ${star.constellation}</p>
      <p><strong>Brightness:</strong> ${(star.brightness * 100).toFixed(0)}%</p>
      <p><strong>Position:</strong> (${star.x.toFixed(0)}, ${star.y.toFixed(0)})</p>
    </div>
  `;
}

// Control functions
function toggleConstellationMode() {
  constellationMode = constellationMode === 'connect' ? 'info' : 'connect';
  const modeBtn = document.getElementById('modeBtn');
  modeBtn.textContent = constellationMode === 'connect' ? '🔗 Connect Mode' : 'ℹ️ Info Mode';
}

function clearConstellation() {
  selectedStars = [];
  constellationData.forEach(star => star.selected = false);
  drawConstellation();
  document.getElementById('constellationInfo').innerHTML = '<p>Click on stars to view information or connect them to form constellations.</p>';
}

function saveConstellation() {
  const data = {
    selectedStars: selectedStars.map(star => ({ x: star.x, y: star.y, name: star.name })),
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('savedConstellation', JSON.stringify(data));
  alert('Constellation saved!');
}

function loadConstellation() {
  const saved = localStorage.getItem('savedConstellation');
  if (saved) {
    const data = JSON.parse(saved);
    selectedStars = data.selectedStars;
    drawConstellation();
    alert('Constellation loaded!');
  } else {
    alert('No saved constellation found.');
  }
}

// Zoom and pan functions
function zoomIn() {
  zoom = Math.min(zoom * 1.2, 3);
  drawConstellation();
}

function zoomOut() {
  zoom = Math.max(zoom / 1.2, 0.5);
  drawConstellation();
}

function resetZoom() {
  zoom = 1;
  panX = 0;
  panY = 0;
  drawConstellation();
}

function startDrag(event) {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
}

function drag(event) {
  if (!isDragging) return;
  
  const deltaX = event.clientX - lastX;
  const deltaY = event.clientY - lastY;
  
  panX += deltaX;
  panY += deltaY;
  
  lastX = event.clientX;
  lastY = event.clientY;
  
  drawConstellation();
}

function endDrag() {
  isDragging = false;
}

function highlightConstellation(constellationName) {
  // Clear previous selection
  clearConstellation();
  
  // Highlight stars of selected constellation
  const constellationMap = {
    'ursa_major': ['Polaris', 'Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid'],
    'orion': ['Betelgeuse', 'Rigel', 'Bellatrix', 'Mintaka', 'Alnilam', 'Alnitak', 'Saiph'],
    'cassiopeia': ['Schedar', 'Caph', 'Navi', 'Ruchbah', 'Segin'],
    'cygnus': ['Deneb', 'Albireo', 'Sadr', 'Gienah', 'Delta Cygni']
  };
  
  const starsToHighlight = constellationMap[constellationName] || [];
  constellationData.forEach(star => {
    if (starsToHighlight.includes(star.name)) {
      star.selected = true;
      selectedStars.push(star);
    }
  });
  
  drawConstellation();
}

function getAuroraPanel() {
  return `
    <div class="aurora-container">
      <div class="aurora-header">
        <h3>🌌 Aurora Borealis & Australis</h3>
        <button class="aurora-btn" onclick="refreshAuroraData()">🔄 Refresh</button>
      </div>
      
      <div class="aurora-facts">
        <h3>✨ Fascinating Aurora Facts</h3>
        <ul>
          <li><strong>Northern Lights:</strong> Aurora Borealis occurs in the Northern Hemisphere, while Aurora Australis appears in the Southern Hemisphere</li>
          <li><strong>Solar Connection:</strong> Auroras are caused by charged particles from the Sun colliding with Earth's atmosphere</li>
          <li><strong>Magnetic Field:</strong> Earth's magnetic field guides these particles toward the poles, creating the light show</li>
          <li><strong>Color Spectrum:</strong> Green is most common (oxygen), red (oxygen), blue/purple (nitrogen), and pink (nitrogen)</li>
          <li><strong>Altitude:</strong> Auroras occur between 80-640 km above Earth's surface</li>
          <li><strong>Solar Cycle:</strong> Aurora activity increases during solar maximum periods</li>
          <li><strong>Historical Records:</strong> Auroras have been documented for thousands of years across cultures</li>
          <li><strong>Solar Activity:</strong> Geomagnetic storms can make auroras visible much further from the poles</li>
        </ul>
      </div>
      
      <div class="aurora-animation-container">
        <h3>Aurora Video</h3>
        <video id="auroraVideo" class="aurora-video" controls loop preload="metadata">
          <source src="aurora-video.mp4" type="video/mp4">
          <source src="aurora-video.webm" type="video/webm">
          Your browser does not support the video tag.
        </video>
        <div class="aurora-controls">
          <button class="aurora-btn" onclick="playAuroraVideo()">▶️ Play Video</button>
          <button class="aurora-btn" onclick="pauseAuroraVideo()">⏸️ Pause</button>
          <button class="aurora-btn" onclick="restartAuroraVideo()">🔄 Restart</button>
        </div>
      </div>
      
      <div class="aurora-formation">
        <h3>🌌 How Auroras Are Formed</h3>
        <div class="formation-content">
          <img src="aurora-photo.jpg" alt="Aurora Formation Diagram" class="aurora-formation-image">
          <div class="formation-text">
            <h4>The Science Behind Aurora Formation</h4>
            <p>Auroras are created through a fascinating interaction between the Sun, Earth's magnetic field, and our atmosphere:</p>
            <ol>
              <li><strong>Solar Wind:</strong> The Sun constantly emits charged particles (electrons and protons) that travel through space at high speeds.</li>
              <li><strong>Magnetic Field:</strong> Earth's magnetic field acts like a protective shield, deflecting most of these particles away from our planet.</li>
              <li><strong>Polar Regions:</strong> Near the North and South poles, the magnetic field lines curve downward, creating funnels that guide particles toward Earth.</li>
              <li><strong>Atmospheric Collision:</strong> When these charged particles collide with gases in our atmosphere (oxygen and nitrogen), they transfer energy to the gas molecules.</li>
              <li><strong>Light Emission:</strong> The excited gas molecules release this energy as light, creating the spectacular aurora displays we see.</li>
            </ol>
            <p><strong>Colors Explained:</strong> Green auroras come from oxygen atoms, red from oxygen at higher altitudes, and blue/purple from nitrogen molecules. The specific colors depend on the type of gas and the altitude of the collision.</p>
          </div>
        </div>
      </div>
      
      <div class="aurora-visibility">
        <h3>📍 Current Aurora Visibility</h3>
        <div class="visibility-grid">
          <div class="visibility-card">
            <h4>Northern Hemisphere</h4>
            <div id="northernVisibility">Loading...</div>
            <div class="visibility-status" id="northernStatus">--</div>
          </div>
          <div class="visibility-card">
            <h4>Southern Hemisphere</h4>
            <div id="southernVisibility">Loading...</div>
            <div class="visibility-status" id="southernStatus">--</div>
          </div>
          <div class="visibility-card">
            <h4>Best Viewing Time</h4>
            <div id="bestTime">Loading...</div>
            <div class="visibility-status" id="timeStatus">--</div>
          </div>
          <div class="visibility-card">
            <h4>Solar Activity</h4>
            <div id="solarActivity">Loading...</div>
            <div class="visibility-status" id="activityStatus">--</div>
          </div>
        </div>
      </div>
      
      <div class="aurora-info">
        <h3>ℹ️ Aurora Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <h4>How Auroras Form</h4>
            <p>Solar wind particles are captured by Earth's magnetic field and funneled toward the poles, where they collide with atmospheric gases, creating the spectacular light displays.</p>
          </div>
          <div class="info-item">
            <h4>Best Viewing Conditions</h4>
            <p>Clear, dark skies away from city lights, during geomagnetic storms, and around the equinoxes when aurora activity is typically higher.</p>
          </div>
          <div class="info-item">
            <h4>Geographic Distribution</h4>
            <p>Aurora ovals form around the magnetic poles, with visibility extending further during strong geomagnetic storms.</p>
          </div>
          <div class="info-item">
            <h4>Historical Significance</h4>
            <p>Auroras have inspired myths, legends, and scientific curiosity throughout human history, from ancient civilizations to modern space research.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getParallaxPanel() {
  return `
    <h2>🌠 Parallax Space Journey</h2>
    <div class="parallax-container">
      <div class="parallax-controls">
        <button onclick="startParallaxJourney()" class="control-btn">🚀 Start Journey</button>
        <button onclick="pauseParallaxJourney()" class="control-btn">⏸️ Pause</button>
        <button onclick="resetParallaxJourney()" class="control-btn">🔄 Reset</button>
        <div class="speed-control">
          <label>Speed: <span id="speedValue">1x</span></label>
          <input type="range" id="speedSlider" min="0.5" max="3" step="0.5" value="1" onchange="updateParallaxSpeed()">
        </div>
      </div>
      
      <div class="parallax-viewport">
        <div id="parallaxScene" class="parallax-scene">
          <!-- Parallax layers will be generated here -->
        </div>
        
        <div class="journey-info">
          <div class="location-display">
            <h3>📍 Current Location</h3>
            <div id="currentLocation">Earth Orbit</div>
          </div>
          <div class="distance-display">
            <h3>📏 Distance Traveled</h3>
            <div id="distanceTraveled">0 km</div>
          </div>
          <div class="speed-display">
            <h3>⚡ Current Speed</h3>
            <div id="currentSpeed">28,000 km/h</div>
          </div>
        </div>
        
        <div class="journey-progress">
          <div class="progress-bar">
            <div id="progressFill" class="progress-fill"></div>
            <div id="progressRocket" class="progress-rocket">🚀</div>
          </div>
          <div class="milestones">
            <div class="milestone" data-distance="400">🌍 Earth Orbit</div>
            <div class="milestone" data-distance="800">🌙 Moon</div>
            <div class="milestone" data-distance="1200">☄️ Asteroid Belt</div>
            <div class="milestone" data-distance="1600">🪐 Jupiter</div>
            <div class="milestone" data-distance="2000">🌌 Deep Space</div>
          </div>
        </div>
      </div>
      
      <div class="journey-log">
        <h3>📝 Journey Log</h3>
        <div id="journeyLog">
          <div class="log-entry">🚀 Journey initiated from Earth orbit...</div>
        </div>
      </div>
    </div>
  `;
}

function getThemesPanel() {
  return `
    <h2>🎨 Dynamic Color Themes</h2>
    <div class="themes-container">
      <div class="theme-preview">
        <h3>🎭 Theme Preview</h3>
        <div class="preview-window">
          <div class="preview-sidebar">
            <div class="preview-btn">🌕 Moon</div>
            <div class="preview-btn">☀ Sun</div>
            <div class="preview-btn">🛰 Satellites</div>
          </div>
          <div class="preview-content">
            <div class="preview-card">
              <h4>Sample Data</h4>
              <p>This is how your Cosmic Control Panel will look with the selected theme.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="theme-grid">
        <div class="theme-card" data-theme="cosmic-blue" onclick="applyTheme('cosmic-blue')">
          <div class="theme-preview-box cosmic-blue">
            <div class="theme-sample"></div>
          </div>
          <h4>🌌 Cosmic Blue</h4>
          <p>Classic space theme with cyan accents</p>
        </div>
        
        <div class="theme-card" data-theme="solar-orange" onclick="applyTheme('solar-orange')">
          <div class="theme-preview-box solar-orange">
            <div class="theme-sample"></div>
          </div>
          <h4>☀ Solar Orange</h4>
          <p>Warm solar energy theme</p>
        </div>
        
        <div class="theme-card" data-theme="nebula-purple" onclick="applyTheme('nebula-purple')">
          <div class="theme-preview-box nebula-purple">
            <div class="theme-sample"></div>
          </div>
          <h4>🌌 Nebula Purple</h4>
          <p>Mystical purple nebula theme</p>
        </div>
        
        <div class="theme-card" data-theme="aurora-green" onclick="applyTheme('aurora-green')">
          <div class="theme-preview-box aurora-green">
            <div class="theme-sample"></div>
          </div>
          <h4>🌌 Aurora Green</h4>
          <p>Northern lights inspired theme</p>
        </div>
        
        <div class="theme-card" data-theme="deep-space" onclick="applyTheme('deep-space')">
          <div class="theme-preview-box deep-space">
            <div class="theme-sample"></div>
          </div>
          <h4>🌌 Deep Space</h4>
          <p>Dark mysterious space theme</p>
        </div>
        
        <div class="theme-card" data-theme="mars-red" onclick="applyTheme('mars-red')">
          <div class="theme-preview-box mars-red">
            <div class="theme-sample"></div>
          </div>
          <h4>🪐 Mars Red</h4>
          <p>Red planet inspired theme</p>
        </div>
      </div>
      
      <div class="theme-controls">
        <button onclick="resetToDefaultTheme()" class="theme-btn">🔄 Reset to Default</button>
        <button onclick="saveCurrentTheme()" class="theme-btn">💾 Save Theme</button>
        <button onclick="loadSavedTheme()" class="theme-btn">📂 Load Saved</button>
        <div class="auto-switch">
          <label>
            <input type="checkbox" id="autoThemeSwitch" onchange="toggleAutoTheme()">
            🌈 Auto-switch themes every 30 seconds
          </label>
        </div>
      </div>
      
      <div class="theme-info">
        <h3>ℹ️ Theme Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <h4>🎨 Color Schemes</h4>
            <p>6 unique themes inspired by different space phenomena</p>
          </div>
          <div class="info-item">
            <h4>💾 Persistence</h4>
            <p>Your theme choice is saved and restored on next visit</p>
          </div>
          <div class="info-item">
            <h4>🌐 Responsive</h4>
            <p>All themes work perfectly on desktop and mobile</p>
          </div>
          <div class="info-item">
            <h4>⚡ Performance</h4>
            <p>Lightweight themes with smooth transitions</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getDebrisPanel() {
  return `
    <h2>🪐 Floating Space Debris</h2>
    <p>Loading space debris simulation...</p>
    <div id="debrisData">Coming soon...</div>
  `;
}

function getMissionPanel() {
  return `
    <h2>🚀 Space Mission Simulator</h2>
    <div class="mission-container">
      <div class="mission-controls">
        <button onclick="startMission()" class="mission-btn">🚀 Launch Mission</button>
        <button onclick="pauseMission()" class="mission-btn">⏸️ Pause</button>
        <button onclick="resetMission()" class="mission-btn">🔄 Reset</button>
      </div>
      
      <div class="mission-display">
        <div class="mission-status">
          <h3>📊 Mission Status</h3>
          <div id="missionStatus">Ready for launch</div>
        </div>
        
        <div class="mission-progress">
          <h3>📈 Progress</h3>
          <div class="progress-bar">
            <div id="missionProgress" class="progress-fill"></div>
          </div>
          <div id="missionPhase">Pre-launch</div>
        </div>
        
        <div class="mission-stats">
          <div class="stat-item">
            <span class="stat-label">Altitude:</span>
            <span id="altitude">0 km</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Speed:</span>
            <span id="speed">0 km/h</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Fuel:</span>
            <span id="fuel">100%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Oxygen:</span>
            <span id="oxygen">100%</span>
          </div>
        </div>
      </div>
      
      <div class="mission-log">
        <h3>📝 Mission Log</h3>
        <div id="missionLog">
          <div class="log-entry">🚀 Mission simulator initialized...</div>
        </div>
      </div>
    </div>
  `;
}

function getQuizPanel() {
  return `
    <h2>🧠 Cosmic Quiz</h2>
    <div class="quiz-container">
      <div class="quiz-header">
        <div class="quiz-info">
          <span>Question <span id="currentQuestion">1</span> of <span id="totalQuestions">10</span></span>
          <span>Score: <span id="quizScore">0</span></span>
          <span>Difficulty: <span id="currentDifficulty">-</span></span>
        </div>
        <button onclick="startNewQuiz()" class="quiz-btn">🔄 New Quiz</button>
      </div>
      
      <div class="quiz-question">
        <h3 id="questionText">Loading question...</h3>
        <div id="questionOptions" class="options-grid">
          <!-- Options will be loaded here -->
        </div>
      </div>
      
      <div class="quiz-feedback" id="quizFeedback" style="display: none;">
        <div id="feedbackText"></div>
        <button onclick="nextQuestion()" class="quiz-btn">Next Question</button>
      </div>
      
      <div class="quiz-results" id="quizResults" style="display: none;">
        <h3>🎉 Quiz Complete!</h3>
        <div id="finalScore"></div>
        <div id="performanceMessage"></div>
        <div id="difficultyBreakdown"></div>
        <button onclick="startNewQuiz()" class="quiz-btn">🔄 Try Again</button>
      </div>
      
      <div class="quiz-stats">
        <h3>📊 Quiz Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Total Questions:</span>
            <span>50</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Questions per Quiz:</span>
            <span>10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Difficulty Levels:</span>
            <span>Easy, Medium, Hard</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getVoicePanel() {
  return `
    <h2>🎙 Voice Commands</h2>
    <div class="voice-container">
      <div class="voice-status">
        <div class="status-indicator" id="voiceStatus">🔴 Inactive</div>
        <button onclick="toggleVoiceRecognition()" class="voice-btn" id="voiceToggleBtn">🎤 Start Listening</button>
      </div>
      
      <div class="voice-display">
        <div class="voice-input">
          <h3>🎧 Voice Input</h3>
          <div id="voiceInput" class="voice-text">Click "Start Listening" to begin...</div>
        </div>
        
        <div class="voice-output">
          <h3>🤖 Response</h3>
          <div id="voiceOutput" class="voice-text">Voice commands will appear here...</div>
        </div>
      </div>
      
      <div class="voice-commands">
        <h3>📋 Available Commands</h3>
        <div class="commands-list">
          <div class="command-item">
            <span class="command">"Open Moon panel"</span>
            <span class="description">Opens the Moon data panel</span>
          </div>
          <div class="command-item">
            <span class="command">"Show Sun data"</span>
            <span class="description">Opens the Sun data panel</span>
          </div>
          <div class="command-item">
            <span class="command">"Open Satellites"</span>
            <span class="description">Opens the Satellites panel</span>
          </div>
          <div class="command-item">
            <span class="command">"Show Constellations"</span>
            <span class="description">Opens the Constellation Map</span>
          </div>
          <div class="command-item">
            <span class="command">"Open Chatbot"</span>
            <span class="description">Opens the chatbot on the front page</span>
          </div>
          <div class="command-item">
            <span class="command">"Start journey"</span>
            <span class="description">Opens the parallax journey</span>
          </div>
          <div class="command-item">
            <span class="command">"Start Quiz"</span>
            <span class="description">Opens the Cosmic Quiz</span>
          </div>
          <div class="command-item">
            <span class="command">"Show News"</span>
            <span class="description">Opens the Space News</span>
          </div>
          <div class="command-item">
            <span class="command">"Close panel"</span>
            <span class="description">Closes current panel</span>
          </div>
          <div class="command-item">
            <span class="command">"Stop listening"</span>
            <span class="description">Stops voice recognition</span>
          </div>
          <div class="command-item">
            <span class="command">"Help"</span>
            <span class="description">Shows available commands</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getNewsPanel() {
  return `
    <h2>🗞 Space News Ticker</h2>
    <div class="news-container">
      <div class="news-header">
        <h3>🌌 Latest Space News</h3>
        <button onclick="refreshNews()" class="news-btn">🔄 Refresh News</button>
      </div>
      
      <div class="news-ticker">
        <div id="newsTicker" class="ticker-content">
          <!-- News items will scroll here -->
        </div>
      </div>
      
      <div class="news-feed">
        <div id="newsFeed" class="news-items">
          <!-- News articles will be loaded here -->
        </div>
      </div>
      
      <div class="news-categories">
        <button onclick="filterNews('all')" class="category-btn active">All News</button>
        <button onclick="filterNews('missions')" class="category-btn">Missions</button>
        <button onclick="filterNews('discoveries')" class="category-btn">Discoveries</button>
        <button onclick="filterNews('technology')" class="category-btn">Technology</button>
      </div>
    </div>
  `;
}

// Parallax Journey Variables
let parallaxAnimation = null;
let parallaxSpeed = 1;
let isParallaxPaused = false;
let currentDistance = 0;
let journeyLog = [];

function initParallaxJourney() {
  // Create parallax layers
  createParallaxLayers();
  
  // Initialize journey
  resetParallaxJourney();
  
  // Add scroll event listener
  const viewport = document.querySelector('.parallax-viewport');
  if (viewport) {
    viewport.addEventListener('scroll', updateParallaxPosition);
  }
}

function createParallaxLayers() {
  const scene = document.getElementById('parallaxScene');
  if (!scene) return;
  
  // Clear existing layers
  scene.innerHTML = '';
  
  // Create multiple parallax layers
  const layers = [
    { name: 'stars-far', speed: 0.1, count: 50, size: '2px' },
    { name: 'stars-medium', speed: 0.3, count: 30, size: '3px' },
    { name: 'stars-near', speed: 0.6, count: 20, size: '4px' },
    { name: 'planets', speed: 0.8, count: 5, size: '20px' },
    { name: 'asteroids', speed: 1.0, count: 15, size: '8px' }
  ];
  
  layers.forEach(layer => {
    const layerDiv = document.createElement('div');
    layerDiv.className = `parallax-layer ${layer.name}`;
    layerDiv.style.transform = `translateZ(${layer.speed * 100}px)`;
    
    // Generate elements for this layer
    for (let i = 0; i < layer.count; i++) {
      const element = document.createElement('div');
      element.className = 'parallax-element';
      element.style.left = Math.random() * 100 + '%';
      element.style.top = Math.random() * 100 + '%';
      element.style.width = layer.size;
      element.style.height = layer.size;
      element.style.animationDelay = Math.random() * 5 + 's';
      
      // Add specific styling based on layer type
      if (layer.name === 'planets') {
        element.className = 'parallax-element planet';
        const planets = ['🌍', '🌙', '🪐', '☄️', '⭐'];
        element.textContent = planets[i % planets.length];
        element.style.fontSize = '24px';
      } else if (layer.name === 'asteroids') {
        element.className = 'parallax-element asteroid';
        element.style.backgroundColor = '#8B4513';
        element.style.borderRadius = '50%';
      } else {
        element.className = 'parallax-element star';
        element.style.backgroundColor = '#fff';
        element.style.borderRadius = '50%';
        element.style.boxShadow = '0 0 4px #fff';
      }
      
      layerDiv.appendChild(element);
    }
    
    scene.appendChild(layerDiv);
  });
}

function startParallaxJourney() {
  if (parallaxAnimation) return;
  
  isParallaxPaused = false;
  parallaxAnimation = setInterval(() => {
    if (!isParallaxPaused) {
      currentDistance += parallaxSpeed * 10;
      updateJourneyDisplay();
      updateParallaxLayers();
      checkMilestones();
    }
  }, 100);
  
  addJourneyLog('🚀 Journey started! Accelerating through space...');
}

function pauseParallaxJourney() {
  isParallaxPaused = !isParallaxPaused;
  const pauseBtn = document.querySelector('.parallax-controls button:nth-child(2)');
  if (pauseBtn) {
    pauseBtn.textContent = isParallaxPaused ? '▶️ Resume' : '⏸️ Pause';
  }
  
  if (isParallaxPaused) {
    addJourneyLog('⏸️ Journey paused for observation...');
  } else {
    addJourneyLog('▶️ Journey resumed!');
  }
}

function resetParallaxJourney() {
  if (parallaxAnimation) {
    clearInterval(parallaxAnimation);
    parallaxAnimation = null;
  }
  
  currentDistance = 0;
  isParallaxPaused = false;
  journeyLog = [];
  
  updateJourneyDisplay();
  updateParallaxLayers();
  resetMilestones();
  
  const pauseBtn = document.querySelector('.parallax-controls button:nth-child(2)');
  if (pauseBtn) {
    pauseBtn.textContent = '⏸️ Pause';
  }
  
  addJourneyLog('🔄 Journey reset to Earth orbit');
}

function updateParallaxSpeed() {
  const slider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  
  if (slider && speedValue) {
    parallaxSpeed = parseFloat(slider.value);
    speedValue.textContent = parallaxSpeed + 'x';
    
    addJourneyLog(`⚡ Speed adjusted to ${parallaxSpeed}x`);
  }
}

function updateJourneyDisplay() {
  const locationDisplay = document.getElementById('currentLocation');
  const distanceDisplay = document.getElementById('distanceTraveled');
  const speedDisplay = document.getElementById('currentSpeed');
  const progressFill = document.getElementById('progressFill');
  const progressRocket = document.getElementById('progressRocket');
  
  if (locationDisplay) {
    locationDisplay.textContent = getCurrentLocation(currentDistance);
  }
  
  if (distanceDisplay) {
    distanceDisplay.textContent = formatDistance(currentDistance);
  }
  
  if (speedDisplay) {
    const speed = Math.floor(28000 * parallaxSpeed);
    speedDisplay.textContent = `${speed.toLocaleString()} km/h`;
  }
  
  if (progressFill) {
    const progress = Math.min((currentDistance / 2000) * 100, 100);
    progressFill.style.width = progress + '%';
  }
  
  if (progressRocket) {
    const progress = Math.min((currentDistance / 2000) * 100, 100);
    progressRocket.style.left = progress + '%';
  }
}

function updateParallaxLayers() {
  const layers = document.querySelectorAll('.parallax-layer');
  layers.forEach((layer, index) => {
    const speed = (index + 1) * 0.2;
    const translateX = -(currentDistance * speed);
    layer.style.transform = `translateX(${translateX}px) translateZ(${speed * 100}px)`;
  });
}

function getCurrentLocation(distance) {
  if (distance < 400) return '🌍 Earth Orbit';
  if (distance < 800) return '🌙 Moon Region';
  if (distance < 1200) return '☄️ Asteroid Belt';
  if (distance < 1600) return '🪐 Jupiter System';
  return '🌌 Deep Space';
}

function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.floor(distance)} km`;
  } else {
    return `${(distance / 1000).toFixed(1)} million km`;
  }
}

function checkMilestones() {
  const milestones = document.querySelectorAll('.milestone');
  milestones.forEach(milestone => {
    const milestoneDistance = parseInt(milestone.dataset.distance);
    if (currentDistance >= milestoneDistance && !milestone.classList.contains('reached')) {
      milestone.classList.add('reached');
      addJourneyLog(`🎯 Reached milestone: ${milestone.textContent}`);
    }
  });
}

function resetMilestones() {
  const milestones = document.querySelectorAll('.milestone');
  milestones.forEach(milestone => {
    milestone.classList.remove('reached');
  });
}

function addJourneyLog(message) {
  const log = document.getElementById('journeyLog');
  if (!log) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
  
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
  
  // Keep only last 10 entries
  const entries = log.querySelectorAll('.log-entry');
  if (entries.length > 10) {
    entries[0].remove();
  }
}

function updateParallaxPosition() {
  // This function can be used for manual scroll-based parallax
  const viewport = document.querySelector('.parallax-viewport');
  if (viewport) {
    const scrollTop = viewport.scrollTop;
    const layers = document.querySelectorAll('.parallax-layer');
    
    layers.forEach((layer, index) => {
      const speed = (index + 1) * 0.1;
      const translateY = scrollTop * speed;
      layer.style.transform = `translateY(${translateY}px)`;
    });
  }
}

// Theme System Variables
let currentTheme = 'cosmic-blue';
let autoThemeSwitch = null;
let savedTheme = null;

function loadThemeOptions() {
  // Load saved theme from localStorage
  const saved = localStorage.getItem('cosmicTheme');
  if (saved) {
    applyTheme(saved);
    savedTheme = saved;
  }
  
  // Update theme cards to show current selection
  updateThemeSelection();
  
  // Initialize auto-switch if enabled
  const autoSwitch = localStorage.getItem('autoThemeSwitch');
  if (autoSwitch === 'true') {
    document.getElementById('autoThemeSwitch').checked = true;
    startAutoThemeSwitch();
  }
}

function applyTheme(themeName) {
  // Remove all existing theme classes
  document.body.classList.remove('cosmic-blue', 'solar-orange', 'nebula-purple', 'aurora-green', 'deep-space', 'mars-red');
  
  // Add new theme class
  document.body.classList.add(themeName);
  currentTheme = themeName;
  
  // Update theme selection in UI
  updateThemeSelection();
  
  // Save theme preference
  localStorage.setItem('cosmicTheme', themeName);
  
  // Update preview window
  updateThemePreview(themeName);
  
  // Show theme change notification
  showThemeNotification(themeName);
}

function updateThemeSelection() {
  // Remove active class from all theme cards
  document.querySelectorAll('.theme-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Add active class to current theme card
  const activeCard = document.querySelector(`[data-theme="${currentTheme}"]`);
  if (activeCard) {
    activeCard.classList.add('active');
  }
}

function updateThemePreview(themeName) {
  const previewWindow = document.querySelector('.preview-window');
  if (!previewWindow) return;
  
  // Remove existing theme classes
  previewWindow.classList.remove('cosmic-blue', 'solar-orange', 'nebula-purple', 'aurora-green', 'deep-space', 'mars-red');
  
  // Add new theme class
  previewWindow.classList.add(themeName);
}

function showThemeNotification(themeName) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span>🎨 Theme applied: ${getThemeDisplayName(themeName)}</span>
      <button onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

function getThemeDisplayName(themeName) {
  const names = {
    'cosmic-blue': 'Cosmic Blue',
    'solar-orange': 'Solar Orange',
    'nebula-purple': 'Nebula Purple',
    'aurora-green': 'Aurora Green',
    'deep-space': 'Deep Space',
    'mars-red': 'Mars Red'
  };
  return names[themeName] || themeName;
}

function resetToDefaultTheme() {
  applyTheme('cosmic-blue');
  showThemeNotification('cosmic-blue');
}

function saveCurrentTheme() {
  savedTheme = currentTheme;
  localStorage.setItem('savedTheme', currentTheme);
  
  // Show save confirmation
  const notification = document.createElement('div');
  notification.className = 'theme-notification success';
  notification.innerHTML = `
    <div class="notification-content">
      <span>💾 Theme saved successfully!</span>
      <button onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

function loadSavedTheme() {
  const saved = localStorage.getItem('savedTheme');
  if (saved) {
    applyTheme(saved);
    showThemeNotification(saved);
  } else {
    // Show no saved theme message
    const notification = document.createElement('div');
    notification.className = 'theme-notification error';
    notification.innerHTML = `
      <div class="notification-content">
        <span>❌ No saved theme found</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }
}

function toggleAutoTheme() {
  const checkbox = document.getElementById('autoThemeSwitch');
  if (checkbox.checked) {
    startAutoThemeSwitch();
    localStorage.setItem('autoThemeSwitch', 'true');
  } else {
    stopAutoThemeSwitch();
    localStorage.setItem('autoThemeSwitch', 'false');
  }
}

function startAutoThemeSwitch() {
  if (autoThemeSwitch) return;
  
  const themes = ['cosmic-blue', 'solar-orange', 'nebula-purple', 'aurora-green', 'deep-space', 'mars-red'];
  let currentIndex = themes.indexOf(currentTheme);
  
  autoThemeSwitch = setInterval(() => {
    currentIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[currentIndex]);
  }, 30000); // 30 seconds
}

function stopAutoThemeSwitch() {
  if (autoThemeSwitch) {
    clearInterval(autoThemeSwitch);
    autoThemeSwitch = null;
  }
}

function initMissionSimulator() {
  // Placeholder for mission simulator initialization
  console.log('Initializing mission simulator...');
}

function loadQuizQuestions() {
  // Placeholder for quiz questions loading
  console.log('Loading quiz questions...');
}

function initVoiceCommands() {
  // Placeholder for voice commands initialization
  console.log('Initializing voice commands...');
}

function init3DViewer() {
  // Placeholder for 3D viewer initialization
  console.log('Initializing 3D viewer...');
}

function loadSpaceNews() {
  // Placeholder for space news loading
  console.log('Loading space news...');
}

// Mission Simulator Variables
let missionAnimation = null;
let isMissionPaused = false;
let missionProgress = 0;
let missionPhase = 'pre-launch';
let altitude = 0;
let speed = 0;
let fuel = 100;
let oxygen = 100;

function initMissionSimulator() {
  resetMission();
}

function startMission() {
  if (missionAnimation) return;
  
  isMissionPaused = false;
  missionAnimation = setInterval(() => {
    if (!isMissionPaused) {
      updateMission();
    }
  }, 100);
  
  addMissionLog('🚀 Mission launched! Rocket engines firing...');
}

function pauseMission() {
  isMissionPaused = !isMissionPaused;
  const pauseBtn = document.querySelector('.mission-controls button:nth-child(2)');
  if (pauseBtn) {
    pauseBtn.textContent = isMissionPaused ? '▶️ Resume' : '⏸️ Pause';
  }
  
  if (isMissionPaused) {
    addMissionLog('⏸️ Mission paused');
  } else {
    addMissionLog('▶️ Mission resumed');
  }
}

function resetMission() {
  if (missionAnimation) {
    clearInterval(missionAnimation);
    missionAnimation = null;
  }
  
  missionProgress = 0;
  missionPhase = 'pre-launch';
  altitude = 0;
  speed = 0;
  fuel = 100;
  oxygen = 100;
  isMissionPaused = false;
  
  updateMissionDisplay();
  
  const pauseBtn = document.querySelector('.mission-controls button:nth-child(2)');
  if (pauseBtn) {
    pauseBtn.textContent = '⏸️ Pause';
  }
  
  addMissionLog('🔄 Mission reset to pre-launch');
}

function updateMission() {
  if (missionProgress >= 100) {
    clearInterval(missionAnimation);
    missionAnimation = null;
    addMissionLog('🎉 Mission completed successfully!');
    return;
  }
  
  missionProgress += 0.5;
  altitude += 50;
  speed += 100;
  fuel -= 0.1;
  oxygen -= 0.05;
  
  if (missionProgress < 20) {
    missionPhase = 'Launch';
  } else if (missionProgress < 40) {
    missionPhase = 'Atmospheric Exit';
  } else if (missionProgress < 60) {
    missionPhase = 'Orbit Insertion';
  } else if (missionProgress < 80) {
    missionPhase = 'Space Operations';
  } else {
    missionPhase = 'Mission Complete';
  }
  
  updateMissionDisplay();
  
  // Add log entries at key milestones
  if (missionProgress === 20) addMissionLog('🌍 Exiting Earth atmosphere...');
  if (missionProgress === 40) addMissionLog('🛰️ Entering low Earth orbit...');
  if (missionProgress === 60) addMissionLog('🌌 Conducting space operations...');
  if (missionProgress === 80) addMissionLog('🎯 Mission objectives achieved!');
}

function updateMissionDisplay() {
  document.getElementById('missionStatus').textContent = missionPhase;
  document.getElementById('missionProgress').style.width = missionProgress + '%';
  document.getElementById('missionPhase').textContent = missionPhase;
  document.getElementById('altitude').textContent = Math.floor(altitude) + ' km';
  document.getElementById('speed').textContent = Math.floor(speed) + ' km/h';
  document.getElementById('fuel').textContent = fuel.toFixed(1) + '%';
  document.getElementById('oxygen').textContent = oxygen.toFixed(1) + '%';
}

function addMissionLog(message) {
  const log = document.getElementById('missionLog');
  if (!log) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
  
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
  
  const entries = log.querySelectorAll('.log-entry');
  if (entries.length > 8) {
    entries[0].remove();
  }
}

// Quiz Variables
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let quizQuestions = [
  // Easy Questions (1-20)
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "How many planets are in our solar system?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "How many moons does Earth have?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the closest star to Earth?",
    options: ["Alpha Centauri", "Proxima Centauri", "Sirius", "The Sun"],
    correct: 3,
    difficulty: "easy"
  },
  {
    question: "Which space agency landed the first humans on the Moon?",
    options: ["NASA", "ESA", "Roscosmos", "JAXA"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "What is the name of our galaxy?",
    options: ["Andromeda", "Milky Way", "Triangulum", "Sombrero"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What color is the Sun?",
    options: ["Yellow", "White", "Orange", "Red"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the smallest planet in our solar system?",
    options: ["Mars", "Venus", "Mercury", "Earth"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "How long does it take Earth to orbit the Sun?",
    options: ["365 days", "366 days", "364 days", "367 days"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "What is the hottest planet in our solar system?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which planet has rings?",
    options: ["Jupiter", "Saturn", "Uranus", "All of the above"],
    correct: 3,
    difficulty: "easy"
  },
  {
    question: "What is the largest moon in our solar system?",
    options: ["Earth's Moon", "Ganymede", "Titan", "Callisto"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "How many astronauts walked on the Moon?",
    options: ["10", "11", "12", "13"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "What year did the first Moon landing occur?",
    options: ["1967", "1968", "1969", "1970"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "What is the International Space Station (ISS)?",
    options: ["A satellite", "A space station", "A rocket", "A telescope"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the temperature of space?",
    options: ["Absolute zero", "0°C", "Room temperature", "Very hot"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "How many stars are in our solar system?",
    options: ["0", "1", "2", "Billions"],
    correct: 1,
    difficulty: "easy"
  },
  
  // Medium Questions (21-35)
  {
    question: "How long does it take for light to travel from the Sun to Earth?",
    options: ["1 minute", "8 minutes", "1 hour", "1 day"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "What is a black hole?",
    options: ["A dark planet", "A collapsed star", "A galaxy", "A nebula"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "What is the speed of light?",
    options: ["186,000 km/s", "299,792 km/s", "150,000 km/s", "250,000 km/s"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Which planet has the longest day?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "What is the largest asteroid in our solar system?",
    options: ["Ceres", "Vesta", "Pallas", "Hygiea"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "How many light years away is the nearest star (Proxima Centauri)?",
    options: ["1.3", "4.2", "8.6", "25.3"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "What is the Hubble Space Telescope named after?",
    options: ["A scientist", "A constellation", "An astronomer", "A galaxy"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "Which planet has the most extreme seasons?",
    options: ["Earth", "Mars", "Uranus", "Neptune"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is the Kuiper Belt?",
    options: ["A region of asteroids", "A region of comets", "A region of planets", "A region of stars"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "How many Earths could fit inside Jupiter?",
    options: ["100", "1,000", "1,300", "2,000"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is the Oort Cloud?",
    options: ["A cloud of gas", "A cloud of comets", "A cloud of asteroids", "A nebula"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Which planet has the fastest winds?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 3,
    difficulty: "medium"
  },
  {
    question: "What is the age of the universe?",
    options: ["10 billion years", "13.8 billion years", "15 billion years", "20 billion years"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Which planet has the most volcanoes?",
    options: ["Earth", "Mars", "Venus", "Mercury"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is a light year?",
    options: ["A year with extra light", "Distance light travels in a year", "A bright star", "A type of galaxy"],
    correct: 1,
    difficulty: "medium"
  },
  
  // Hard Questions (36-50)
  {
    question: "What is the Chandrasekhar limit?",
    options: ["1.4 solar masses", "2.1 solar masses", "3.0 solar masses", "5.0 solar masses"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the Schwarzschild radius?",
    options: ["The size of a black hole", "The distance to the event horizon", "The radius of a neutron star", "The size of a white dwarf"],
    correct: 1,
    difficulty: "hard"
  },
  {
    question: "What is the Drake Equation used for?",
    options: ["Calculating star distances", "Estimating intelligent civilizations", "Measuring galaxy sizes", "Predicting supernovae"],
    correct: 1,
    difficulty: "hard"
  },
  {
    question: "What is the Fermi Paradox?",
    options: ["Why we haven't found aliens", "Why stars twinkle", "Why planets orbit", "Why galaxies collide"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is a quasar?",
    options: ["A type of star", "A type of galaxy", "A supermassive black hole", "A neutron star"],
    correct: 2,
    difficulty: "hard"
  },
  {
    question: "What is the cosmic microwave background?",
    options: ["Leftover radiation from the Big Bang", "Light from distant stars", "Radio waves from galaxies", "Heat from the Sun"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is dark matter?",
    options: ["Invisible matter that doesn't emit light", "Black holes", "Dead stars", "Empty space"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is dark energy?",
    options: ["Energy from black holes", "Energy causing universe expansion", "Energy from stars", "Energy from galaxies"],
    correct: 1,
    difficulty: "hard"
  },
  {
    question: "What is a pulsar?",
    options: ["A rotating neutron star", "A type of black hole", "A white dwarf", "A red giant"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the Great Attractor?",
    options: ["A supermassive black hole", "A gravitational anomaly", "A galaxy cluster", "A dark matter region"],
    correct: 1,
    difficulty: "hard"
  },
  {
    question: "What is the Hubble Constant?",
    options: ["The rate of universe expansion", "The speed of light", "The age of the universe", "The size of galaxies"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is a magnetar?",
    options: ["A neutron star with strong magnetic field", "A type of black hole", "A white dwarf", "A red giant"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the anthropic principle?",
    options: ["The universe is designed for life", "The universe is random", "The universe is expanding", "The universe is finite"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the holographic principle?",
    options: ["Information is stored on surfaces", "The universe is 2D", "Light is holographic", "Space is curved"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the multiverse theory?",
    options: ["Multiple universes exist", "Multiple dimensions", "Multiple timelines", "Multiple realities"],
    correct: 0,
    difficulty: "hard"
  }
];

function loadQuizQuestions() {
  startNewQuiz();
}

function startNewQuiz() {
  // Shuffle all questions and select 10 random ones
  const shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
  currentQuizQuestions = shuffledQuestions.slice(0, 10);
  currentQuestionIndex = 0;
  quizScore = 0;
  
  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizResults').style.display = 'none';
  
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= currentQuizQuestions.length) {
    showQuizResults();
    return;
  }
  
  const question = currentQuizQuestions[currentQuestionIndex];
  
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = currentQuizQuestions.length;
  document.getElementById('quizScore').textContent = quizScore;
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('currentDifficulty').textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
  
  const optionsContainer = document.getElementById('questionOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'option-btn';
    optionBtn.textContent = option;
    optionBtn.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionBtn);
  });
}

function selectAnswer(selectedIndex) {
  const question = currentQuizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;
  
  if (isCorrect) {
    quizScore++;
  }
  
  showFeedback(isCorrect, question.options[question.correct], question.difficulty);
}

function showFeedback(isCorrect, correctAnswer, difficulty) {
  const feedback = document.getElementById('quizFeedback');
  const feedbackText = document.getElementById('feedbackText');
  
  const difficultyEmoji = {
    'easy': '🟢',
    'medium': '🟡', 
    'hard': '🔴'
  };
  
  if (isCorrect) {
    feedbackText.innerHTML = `${difficultyEmoji[difficulty]} Correct! Well done! (${difficulty} difficulty)`;
  } else {
    feedbackText.innerHTML = `❌ Incorrect. The correct answer is: ${correctAnswer} (${difficulty} difficulty)`;
  }
  
  feedback.style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  document.getElementById('quizFeedback').style.display = 'none';
  loadQuestion();
}

function showQuizResults() {
  const results = document.getElementById('quizResults');
  const finalScore = document.getElementById('finalScore');
  const performanceMessage = document.getElementById('performanceMessage');
  const difficultyBreakdown = document.getElementById('difficultyBreakdown');
  
  const percentage = Math.round((quizScore / currentQuizQuestions.length) * 100);
  
  finalScore.innerHTML = `Final Score: ${quizScore}/${currentQuizQuestions.length} (${percentage}%)`;
  
  // Calculate difficulty breakdown
  const difficultyStats = {};
  currentQuizQuestions.forEach((q, index) => {
    const difficulty = q.difficulty;
    if (!difficultyStats[difficulty]) {
      difficultyStats[difficulty] = { total: 0, correct: 0 };
    }
    difficultyStats[difficulty].total++;
    // This is a simplified version - in a real implementation you'd track correct answers per difficulty
  });
  
  let breakdownHTML = '<h4>📈 Difficulty Breakdown:</h4>';
  Object.keys(difficultyStats).forEach(difficulty => {
    const stats = difficultyStats[difficulty];
    const difficultyEmoji = {
      'easy': '🟢',
      'medium': '🟡', 
      'hard': '🔴'
    };
    breakdownHTML += `<div class="difficulty-stat">
      ${difficultyEmoji[difficulty]} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: ${stats.total} questions
    </div>`;
  });
  difficultyBreakdown.innerHTML = breakdownHTML;
  
  if (percentage >= 90) {
    performanceMessage.innerHTML = '🌟 Excellent! You\'re a space expert!';
  } else if (percentage >= 70) {
    performanceMessage.innerHTML = '🚀 Great job! You know your space facts!';
  } else if (percentage >= 50) {
    performanceMessage.innerHTML = '🌌 Good effort! Keep learning about space!';
  } else {
    performanceMessage.innerHTML = '📚 Keep studying! Space is fascinating!';
  }
  
  results.style.display = 'block';
}

// Voice Recognition Variables
let recognition = null;
let isListening = false;

function initVoiceCommands() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      isListening = true;
      document.getElementById('voiceStatus').textContent = '🟢 Listening...';
      document.getElementById('voiceToggleBtn').textContent = '🛑 Stop Listening';
      document.getElementById('voiceInput').textContent = 'Listening...';
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('voiceInput').textContent = transcript;
      processVoiceCommand(transcript);
    };
    
    recognition.onend = () => {
      isListening = false;
      document.getElementById('voiceStatus').textContent = '🔴 Inactive';
      document.getElementById('voiceToggleBtn').textContent = '🎤 Start Listening';
    };
    
    recognition.onerror = (event) => {
      document.getElementById('voiceOutput').textContent = 'Error: ' + event.error;
      isListening = false;
      document.getElementById('voiceStatus').textContent = '🔴 Error';
      document.getElementById('voiceToggleBtn').textContent = '🎤 Start Listening';
    };
  } else {
    document.getElementById('voiceOutput').textContent = 'Speech recognition not supported in this browser.';
  }
}

function toggleVoiceRecognition() {
  if (!recognition) {
    document.getElementById('voiceOutput').textContent = 'Speech recognition not available.';
    return;
  }
  
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function processVoiceCommand(command) {
  const lowerCommand = command.toLowerCase();
  let response = '';
  
  // Panel opening commands
  if (lowerCommand.includes('moon') || lowerCommand.includes('lunar')) {
    openPanel('moon');
    response = 'Opening Moon data panel...';
  } else if (lowerCommand.includes('sun') || lowerCommand.includes('solar')) {
    openPanel('sun');
    response = 'Opening Sun data panel...';
  } else if (lowerCommand.includes('satellite') || lowerCommand.includes('satellites')) {
    openPanel('satellites');
    response = 'Opening Satellites panel...';
  } else if (lowerCommand.includes('constellation') || lowerCommand.includes('constellations')) {
    openPanel('constellations');
    response = 'Opening Constellation Map...';
  } else if (lowerCommand.includes('chatbot')) {
    // Go to front page and open chatbot
    closePanel();
    setTimeout(() => {
      if (typeof openChatbot === 'function') openChatbot();
    }, 500);
    response = 'Opening the chatbot...';
  } else if (lowerCommand.includes('journey') || lowerCommand.includes('parallax')) {
    openPanel('parallax');
    response = 'Starting space journey...';
  } else if (lowerCommand.includes('mission') || lowerCommand.includes('simulator')) {
    openPanel('mission');
    response = 'Opening Mission Simulator...';
  } else if (lowerCommand.includes('quiz') || lowerCommand.includes('test')) {
    openPanel('quiz');
    response = 'Opening Cosmic Quiz...';
  } else if (lowerCommand.includes('news') || lowerCommand.includes('space news')) {
    openPanel('news');
    response = 'Opening Space News...';
  } else if (lowerCommand.includes('close') || lowerCommand.includes('exit') || lowerCommand.includes('back')) {
    closePanel();
    response = 'Closing current panel...';
  } else if (lowerCommand.includes('stop listening') || lowerCommand.includes('stop voice')) {
    if (recognition && isListening) {
      recognition.stop();
      response = 'Stopping voice recognition...';
    } else {
      response = 'Voice recognition is not active.';
    }
  } else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
    response = 'Available commands: Open Moon, Sun, Satellites, Constellations, Chatbot, Journey, Mission, Quiz, News. Say "Close panel" to close, "Stop listening" to stop voice recognition.';
  } else {
    response = 'Command not recognized. Try saying "Open Moon panel", "Show Sun data", or "Help" for available commands.';
  }
  
  document.getElementById('voiceOutput').textContent = response;
}

// News Variables
let newsData = [];
let currentNewsFilter = 'all';

function loadSpaceNews() {
  // Simulate news data
  newsData = [
    {
      title: "NASA's Perseverance Rover Discovers Ancient River Delta",
      category: "discoveries",
      summary: "Evidence of flowing water found on Mars surface",
      date: "2024-01-15"
    },
    {
      title: "SpaceX Successfully Launches Starlink Constellation",
      category: "missions",
      summary: "60 new satellites deployed to low Earth orbit",
      date: "2024-01-14"
    },
    {
      title: "New Exoplanet Discovered in Habitable Zone",
      category: "discoveries",
      summary: "Earth-like planet found orbiting nearby star",
      date: "2024-01-13"
    },
    {
      title: "Revolutionary Ion Engine Technology Developed",
      category: "technology",
      summary: "More efficient propulsion for deep space missions",
      date: "2024-01-12"
    },
    {
      title: "International Space Station Celebrates 25 Years",
      category: "missions",
      summary: "Quarter century of continuous human presence in space",
      date: "2024-01-11"
    },
    {
      title: "James Webb Telescope Reveals Distant Galaxy",
      category: "discoveries",
      summary: "Oldest galaxy ever observed discovered",
      date: "2024-01-10"
    },
    {
      title: "New Space Suit Design for Mars Missions",
      category: "technology",
      summary: "Advanced protection for future Mars explorers",
      date: "2024-01-09"
    },
    {
      title: "China's Lunar Mission Returns Samples",
      category: "missions",
      summary: "First lunar samples in 40 years brought to Earth",
      date: "2024-01-08"
    }
  ];
  
  displayNews();
  startNewsTicker();
}

function displayNews() {
  const newsFeed = document.getElementById('newsFeed');
  if (!newsFeed) return;
  
  const filteredNews = currentNewsFilter === 'all' 
    ? newsData 
    : newsData.filter(news => news.category === currentNewsFilter);
  
  newsFeed.innerHTML = filteredNews.map(news => `
    <div class="news-item">
      <h4>${news.title}</h4>
      <p>${news.summary}</p>
      <span class="news-date">${news.date}</span>
      <span class="news-category">${news.category}</span>
    </div>
  `).join('');
}

function startNewsTicker() {
  const ticker = document.getElementById('newsTicker');
  if (!ticker) return;
  
  const tickerItems = newsData.map(news => news.title).join(' • ');
  ticker.innerHTML = tickerItems;
  
  // Animate ticker
  let position = 0;
  setInterval(() => {
    position -= 1;
    ticker.style.transform = `translateX(${position}px)`;
    
    if (position < -ticker.scrollWidth) {
      position = ticker.parentElement.offsetWidth;
    }
  }, 50);
}

function refreshNews() {
  // Simulate new news
  const newHeadlines = [
    "Asteroid Passes Close to Earth",
    "New Space Station Module Launched",
    "Breakthrough in Fusion Technology",
    "Mars Colony Planning Advances"
  ];
  
  const randomHeadline = newHeadlines[Math.floor(Math.random() * newHeadlines.length)];
  const newNews = {
    title: randomHeadline,
    category: ['missions', 'discoveries', 'technology'][Math.floor(Math.random() * 3)],
    summary: "Latest developments in space exploration and technology.",
    date: new Date().toISOString().split('T')[0]
  };
  
  newsData.unshift(newNews);
  displayNews();
  
  // Show refresh notification
  const notification = document.createElement('div');
  notification.className = 'news-notification';
  notification.textContent = '📰 News refreshed!';
  document.querySelector('.news-container').appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 2000);
}

function filterNews(category) {
  currentNewsFilter = category;
  
  // Update active button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  displayNews();
}

function initSpaceDebris() {
  // Placeholder for space debris initialization
  console.log('Initializing space debris...');
}

// Historical Events Database - Real astronomical events by date
const historicalEvents = {
  "01-01": [
    { year: 1801, event: "Discovery of Ceres", description: "Giuseppe Piazzi discovers the first asteroid", type: "discovery" },
    { year: 1959, event: "Luna 1 Launch", description: "First spacecraft to reach Moon vicinity", type: "mission" },
    { year: 2001, event: "NEAR Shoemaker Lands on Eros", description: "First spacecraft to land on an asteroid", type: "mission" }
  ],
  "01-02": [
    { year: 1959, event: "Luna 1 Becomes First Artificial Planet", description: "First human-made object to orbit the Sun", type: "mission" },
    { year: 2004, event: "Stardust Flyby of Comet Wild 2", description: "First spacecraft to collect comet dust", type: "mission" }
  ],
  "01-03": [
    { year: 1958, event: "Explorer 1 Launch", description: "First US satellite, discovers Van Allen radiation belts", type: "mission" },
    { year: 2004, event: "Spirit Rover Lands on Mars", description: "First of two Mars Exploration Rovers", type: "mission" }
  ],
  "01-04": [
    { year: 1958, event: "Sputnik 1 Reentry", description: "First artificial satellite burns up in atmosphere", type: "mission" },
    { year: 2004, event: "Opportunity Rover Lands on Mars", description: "Second Mars Exploration Rover", type: "mission" }
  ],
  "01-05": [
    { year: 1972, event: "Apollo 16 Announcement", description: "NASA announces Apollo 16 mission to Moon", type: "mission" },
    { year: 2005, event: "Deep Impact Launch", description: "Mission to study comet Tempel 1", type: "mission" }
  ],
  "01-06": [
    { year: 1838, event: "First Photograph of Moon", description: "Louis Daguerre takes first lunar photograph", type: "discovery" },
    { year: 1998, event: "Lunar Prospector Launch", description: "NASA mission to map Moon's surface", type: "mission" }
  ],
  "01-07": [
    { year: 1610, event: "Galileo Discovers Jupiter's Moons", description: "First observation of Jupiter's four largest moons", type: "discovery" },
    { year: 1985, event: "Sakigake Launch", description: "Japan's first interplanetary spacecraft", type: "mission" }
  ],
  "01-08": [
    { year: 1642, event: "Galileo Galilei Death", description: "Famous astronomer and physicist passes away", type: "person" },
    { year: 1998, event: "Lunar Prospector Enters Moon Orbit", description: "Begins mapping Moon's composition", type: "mission" }
  ],
  "01-09": [
    { year: 1793, event: "Jean-Pierre Blanchard Balloon Flight", description: "First balloon flight in America", type: "aviation" },
    { year: 2001, event: "Genesis Launch", description: "Mission to collect solar wind particles", type: "mission" }
  ],
  "01-10": [
    { year: 1946, event: "First Radar Contact with Moon", description: "US Army bounces radar off Moon", type: "technology" },
    { year: 2001, event: "Shenzhou 2 Launch", description: "China's second unmanned space mission", type: "mission" }
  ],
  "01-11": [
    { year: 1787, event: "William Herschel Discovers Titania and Oberon", description: "Discovers Uranus's largest moons", type: "discovery" },
    { year: 2003, event: "Spirit Rover Launch", description: "First Mars Exploration Rover", type: "mission" }
  ],
  "01-12": [
    { year: 2005, event: "Deep Impact Launch", description: "Mission to impact comet Tempel 1", type: "mission" },
    { year: 2010, event: "Haiti Earthquake", description: "Disaster that affected space tracking stations", type: "earth" }
  ],
  "01-13": [
    { year: 1610, event: "Galileo Discovers Callisto", description: "Fourth and outermost of Jupiter's Galilean moons", type: "discovery" },
    { year: 1993, event: "Space Shuttle Endeavour Launch", description: "STS-54 mission with TDRS satellite", type: "mission" }
  ],
  "01-14": [
    { year: 2005, event: "Huygens Lands on Titan", description: "First landing on Saturn's moon Titan", type: "mission" },
    { year: 2008, event: "MESSENGER Flyby of Mercury", description: "First spacecraft to visit Mercury in 30 years", type: "mission" }
  ],
  "01-15": [
    { year: 2006, event: "Stardust Returns to Earth", description: "First mission to return comet dust samples", type: "mission" },
    { year: 2015, event: "Philae Comet Landing", description: "First soft landing on a comet nucleus", type: "mission" }
  ],
  "01-16": [
    { year: 2003, event: "Space Shuttle Columbia Launch", description: "Final flight of Columbia (STS-107)", type: "mission" },
    { year: 2006, event: "New Horizons Launch", description: "Mission to Pluto and Kuiper Belt", type: "mission" }
  ],
  "01-17": [
    { year: 1994, event: "Northridge Earthquake", description: "Affected NASA's Jet Propulsion Laboratory", type: "earth" },
    { year: 2006, event: "Stardust Sample Return", description: "Comet dust samples safely returned to Earth", type: "mission" }
  ],
  "01-18": [
    { year: 1912, event: "Robert Scott Reaches South Pole", description: "Explorer who studied Antarctic astronomy", type: "exploration" },
    { year: 2003, event: "Space Shuttle Columbia Reentry", description: "Tragic loss of Columbia and crew", type: "mission" }
  ],
  "01-19": [
    { year: 2006, event: "New Horizons Launch", description: "Fastest spacecraft ever launched", type: "mission" },
    { year: 2012, event: "KEPLER Discovers Exoplanets", description: "Confirms discovery of Earth-sized planets", type: "discovery" }
  ],
  "01-20": [
    { year: 1930, event: "Edwin Hubble Discovers Pluto", description: "Announces discovery of ninth planet", type: "discovery" },
    { year: 2006, event: "Stardust Sample Capsule Recovery", description: "Comet dust samples recovered in Utah", type: "mission" }
  ],
  "01-21": [
    { year: 1976, event: "First Commercial Satellite Launch", description: "SES Astra launches first commercial satellite", type: "mission" },
    { year: 2004, event: "Spirit Rover First Drive", description: "First movement of Mars Exploration Rover", type: "mission" }
  ],
  "01-22": [
    { year: 2003, event: "Pioneer 10 Last Signal", description: "Final transmission from Pioneer 10", type: "mission" },
    { year: 2004, event: "Opportunity Rover Landing", description: "Second Mars Exploration Rover lands", type: "mission" }
  ],
  "01-23": [
    { year: 1849, event: "Elizabeth Blackwell Medical Degree", description: "First woman doctor, studied astronomy", type: "person" },
    { year: 2004, event: "Opportunity Rover First Images", description: "First photos from Mars surface", type: "mission" }
  ],
  "01-24": [
    { year: 1986, event: "Voyager 2 Uranus Flyby", description: "First spacecraft to visit Uranus", type: "mission" },
    { year: 2004, event: "Opportunity Rover First Drive", description: "Begins exploration of Mars surface", type: "mission" }
  ],
  "01-25": [
    { year: 2004, event: "Opportunity Rover Discovers Blueberries", description: "Discovers hematite spheres on Mars", type: "discovery" },
    { year: 2006, event: "New Horizons Jupiter Flyby", description: "Gravity assist en route to Pluto", type: "mission" }
  ],
  "01-26": [
    { year: 1926, event: "First Liquid Rocket Launch", description: "Robert Goddard's first successful rocket", type: "technology" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Finds evidence of past water on Mars", type: "discovery" }
  ],
  "01-27": [
    { year: 1967, event: "Apollo 1 Fire", description: "Tragic fire during Apollo 1 test", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Meteorite", description: "First meteorite found on another planet", type: "discovery" }
  ],
  "01-28": [
    { year: 1986, event: "Space Shuttle Challenger Disaster", description: "Tragic loss of Challenger and crew", type: "mission" },
    { year: 2004, event: "Spirit Rover Reaches Bonneville Crater", description: "Begins study of large impact crater", type: "mission" }
  ],
  "01-29": [
    { year: 1998, event: "International Space Station Assembly", description: "First ISS module (Zarya) launched", type: "mission" },
    { year: 2004, event: "Opportunity Rover Enters Endurance Crater", description: "Begins detailed study of crater layers", type: "mission" }
  ],
  "01-30": [
    { year: 1969, event: "Last Beatles Performance", description: "Rooftop concert, year of Moon landing", type: "culture" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Confirms past water activity on Mars", type: "discovery" }
  ],
  "01-31": [
    { year: 1958, event: "Explorer 1 Launch", description: "First US satellite discovers radiation belts", type: "mission" },
    { year: 1971, event: "Apollo 14 Launch", description: "Third successful Moon landing mission", type: "mission" }
  ],
  "02-01": [
    { year: 2003, event: "Space Shuttle Columbia Disaster", description: "Tragic loss of Columbia during reentry", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-02": [
    { year: 1971, event: "Apollo 14 Lands on Moon", description: "Alan Shepard and Edgar Mitchell walk on Moon", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-03": [
    { year: 1966, event: "Luna 9 First Soft Landing", description: "First spacecraft to soft-land on Moon", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-04": [
    { year: 1971, event: "Apollo 14 Returns to Earth", description: "Successful return with lunar samples", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-05": [
    { year: 1974, event: "Mariner 10 Venus Flyby", description: "First spacecraft to visit Venus", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-06": [
    { year: 1971, event: "Apollo 14 Splashdown", description: "Successful return from Moon mission", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-07": [
    { year: 1984, event: "First Spacewalk from Space Shuttle", description: "Bruce McCandless performs untethered spacewalk", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-08": [
    { year: 1974, event: "Mariner 10 Mercury Flyby", description: "First spacecraft to visit Mercury", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-09": [
    { year: 1971, event: "Apollo 14 Lunar Module Launch", description: "Begins journey to Moon surface", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-10": [
    { year: 1962, event: "First American in Orbit", description: "John Glenn orbits Earth in Friendship 7", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-11": [
    { year: 1970, event: "Japan's First Satellite Launch", description: "Ohsumi becomes Japan's first satellite", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-12": [
    { year: 2001, event: "NEAR Shoemaker Lands on Eros", description: "First spacecraft to land on an asteroid", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-13": [
    { year: 1960, event: "First French Satellite Launch", description: "Asterix becomes France's first satellite", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-14": [
    { year: 1990, event: "Voyager 1 Pale Blue Dot Photo", description: "Famous photo of Earth from 6 billion km away", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-15": [
    { year: 2013, event: "Chelyabinsk Meteor", description: "Large meteor explodes over Russia", type: "discovery" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-16": [
    { year: 1948, event: "Miranda Discovery", description: "Uranus moon Miranda discovered by Gerard Kuiper", type: "discovery" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-17": [
    { year: 1996, event: "NEAR Shoemaker Launch", description: "Mission to study asteroid Eros", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-18": [
    { year: 1930, event: "Pluto Discovery", description: "Clyde Tombaugh discovers Pluto", type: "discovery" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-19": [
    { year: 1986, event: "Mir Space Station Launch", description: "Soviet space station begins operations", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-20": [
    { year: 1962, event: "John Glenn Returns to Earth", description: "First American to orbit Earth returns safely", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-21": [
    { year: 1965, event: "Ranger 8 Launch", description: "NASA mission to photograph Moon surface", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-22": [
    { year: 1966, event: "Luna 9 First Photos", description: "First photos from Moon surface transmitted", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-23": [
    { year: 1987, event: "Supernova 1987A Discovery", description: "Closest supernova visible to naked eye", type: "discovery" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-24": [
    { year: 1968, event: "Apollo 8 Announcement", description: "NASA announces first manned Moon mission", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-25": [
    { year: 1969, event: "Mariner 6 Launch", description: "Mission to study Mars atmosphere", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ],
  "02-26": [
    { year: 1966, event: "Apollo 1 Announcement", description: "NASA announces first Apollo mission", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-27": [
    { year: 1969, event: "Mariner 7 Launch", description: "Twin mission to study Mars", type: "mission" },
    { year: 2004, event: "Spirit Rover Discovers Water Evidence", description: "Confirms past water on Mars", type: "discovery" }
  ],
  "02-28": [
    { year: 1959, event: "Discoverer 1 Launch", description: "First satellite in polar orbit", type: "mission" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Finds evidence of past water activity", type: "discovery" }
  ],
  "02-29": [
    { year: 1960, event: "Leap Day Space Mission", description: "Special day for space exploration planning", type: "planning" },
    { year: 2004, event: "Opportunity Rover Discovers Water Evidence", description: "Confirms past water on Mars surface", type: "discovery" }
  ]
};

// Fallback events for dates not explicitly covered
const fallbackEvents = [
  { year: 1957, event: "Space Age Begins", description: "Sputnik 1 launch marks the beginning of the space age", type: "mission" },
  { year: 1961, event: "First Human in Space", description: "Yuri Gagarin becomes first human in space", type: "mission" },
  { year: 1969, event: "Apollo 11 Moon Landing", description: "First humans walk on the Moon", type: "mission" },
  { year: 1977, event: "Voyager Missions Launch", description: "Voyager 1 and 2 begin their grand tour", type: "mission" },
  { year: 1981, event: "Space Shuttle Era Begins", description: "First Space Shuttle mission launches", type: "mission" },
  { year: 1990, event: "Hubble Space Telescope Launch", description: "Revolutionary space telescope deployed", type: "mission" },
  { year: 1998, event: "International Space Station Assembly", description: "First ISS module launched into orbit", type: "mission" },
  { year: 2004, event: "Mars Exploration Rovers", description: "Spirit and Opportunity begin Mars exploration", type: "mission" },
  { year: 2012, event: "Curiosity Rover Lands on Mars", description: "Largest rover ever sent to Mars", type: "mission" },
  { year: 2015, event: "New Horizons Pluto Flyby", description: "First spacecraft to visit Pluto", type: "mission" },
  { year: 2018, event: "Parker Solar Probe Launch", description: "Mission to touch the Sun", type: "mission" },
  { year: 2020, event: "Perseverance Rover Launch", description: "Latest Mars rover with helicopter", type: "mission" },
  { year: 2021, event: "James Webb Space Telescope Launch", description: "Most powerful space telescope ever built", type: "mission" },
  { year: 2022, event: "Artemis I Launch", description: "First step toward returning humans to Moon", type: "mission" },
  { year: 2023, event: "Space Exploration Advances", description: "Continued progress in space technology", type: "mission" }
];

// Get historical events for a specific date
function getHistoricalEvents(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  // Check if we have specific events for this date
  if (historicalEvents[dateKey]) {
    return historicalEvents[dateKey];
  }
  
  // Generate fallback events based on the date
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const event1Index = dayOfYear % fallbackEvents.length;
  const event2Index = (dayOfYear + 7) % fallbackEvents.length;
  
  return [
    fallbackEvents[event1Index],
    fallbackEvents[event2Index]
  ];
}

// Get current date's historical events
function getCurrentDateEvents() {
  const today = new Date();
  return getHistoricalEvents(today);
}

// Display historical events on main page
function displayMainPageEvents() {
  const events = getCurrentDateEvents();
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const mainContent = document.querySelector('body');
  if (mainContent) {
    // Find the existing content and insert before it
    const existingContent = document.querySelector('h1');
    if (existingContent) {
      const eventsSection = document.createElement('div');
      eventsSection.className = 'historical-events-main';
      eventsSection.innerHTML = `
        <div class="events-header">
          <h2>🌌 This Day in Space History</h2>
          <p class="current-date">${dateString}</p>
        </div>
        <div class="events-list">
          ${events.map(event => `
            <div class="event-item">
              <div class="event-year">${event.year}</div>
              <div class="event-content">
                <h3>${event.event}</h3>
                <p>${event.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="events-footer">
          <p>Click "Historical Events" in the sidebar to explore other dates!</p>
        </div>
        <div class="cosmic-quote">
          <p style="font-size: 1.1rem;">"The universe is not only stranger than we imagine, it's stranger than we can imagine."</p>
          <span class="quote-author">— J.B.S. Haldane</span>
        </div>
      `;
      const historyMount = document.getElementById('historyMount');
      if (historyMount) {
        historyMount.appendChild(eventsSection);
      }
    }
  }
}

// Helper functions for enhanced event details
function getEventTypeIcon(type) {
  const icons = {
    'mission': '🚀',
    'discovery': '🔍',
    'technology': '⚡',
    'person': '👨‍🚀',
    'aviation': '✈️',
    'exploration': '🗺️',
    'culture': '🌍',
    'earth': '🌎',
    'planning': '📋'
  };
  return icons[type] || '🌌';
}

function getEventImpact(event) {
  const impacts = {
    'mission': 'Advanced space exploration capabilities and international cooperation',
    'discovery': 'Expanded our understanding of the universe and celestial bodies',
    'technology': 'Pioneered new technologies that benefit both space and Earth applications',
    'person': 'Inspired generations of scientists, engineers, and explorers',
    'aviation': 'Laid the foundation for modern aerospace technology',
    'exploration': 'Pushed the boundaries of human exploration and discovery',
    'culture': 'Influenced global culture and inspired artistic and scientific achievements',
    'earth': 'Enhanced our understanding of Earth and its place in the cosmos',
    'planning': 'Shaped the future direction of space exploration and research'
  };
  return impacts[event.type] || 'Significantly advanced human knowledge and capabilities';
}

function getEventContext(event) {
  const contexts = {
    'mission': `This occurred during the ${getDecade(event.year)}s, a period of ${getPeriodDescription(event.year)} in space exploration.`,
    'discovery': `This discovery was made during the ${getDecade(event.year)}s, when ${getPeriodDescription(event.year)}.`,
    'technology': `This technological breakthrough happened in the ${getDecade(event.year)}s, during ${getPeriodDescription(event.year)}.`,
    'person': `This individual lived during the ${getDecade(event.year)}s, a time of ${getPeriodDescription(event.year)}.`,
    'aviation': `This aviation milestone occurred in the ${getDecade(event.year)}s, when ${getPeriodDescription(event.year)}.`,
    'exploration': `This exploration achievement took place in the ${getDecade(event.year)}s, during ${getPeriodDescription(event.year)}.`,
    'culture': `This cultural moment happened in the ${getDecade(event.year)}s, when ${getPeriodDescription(event.year)}.`,
    'earth': `This Earth-related event occurred in the ${getDecade(event.year)}s, during ${getPeriodDescription(event.year)}.`,
    'planning': `This planning milestone took place in the ${getDecade(event.year)}s, when ${getPeriodDescription(event.year)}.`
  };
  return contexts[event.type] || `This event occurred in ${event.year}, during a significant period in space exploration.`;
}

function getEventLegacy(event) {
  const legacies = {
    'mission': 'Paved the way for future space missions and international collaboration',
    'discovery': 'Fundamentally changed our understanding of the cosmos',
    'technology': 'Created technologies that continue to benefit humanity today',
    'person': 'Inspired countless individuals to pursue careers in science and exploration',
    'aviation': 'Established principles that guide modern aerospace engineering',
    'exploration': 'Demonstrated the human spirit of discovery and adventure',
    'culture': 'Shaped how we view our place in the universe',
    'earth': 'Enhanced our understanding of our home planet',
    'planning': 'Influenced the strategic direction of space exploration'
  };
  return legacies[event.type] || 'Left a lasting impact on space exploration and human knowledge';
}

function getDecade(year) {
  return Math.floor(year / 10) * 10;
}

function getPeriodDescription(year) {
  if (year < 1950) return 'early space exploration and astronomical discoveries';
  if (year < 1960) return 'the dawn of the space age and rocket development';
  if (year < 1970) return 'the space race and first human spaceflights';
  if (year < 1980) return 'the Apollo era and lunar exploration';
  if (year < 1990) return 'space shuttle development and space station planning';
  if (year < 2000) return 'international space cooperation and Mars exploration';
  if (year < 2010) return 'robotic exploration and space station operations';
  if (year < 2020) return 'commercial space development and Mars rovers';
  return 'the era of commercial spaceflight and Mars exploration';
}

function getHistoricalEventsPanel() {
  return `
    <h2>🌌 Historical Space Events</h2>
    <p class="whisper-text">What did the universe whisper on this day?</p>
    <div class="historical-container">
      <div class="date-explorer">
        <h3>📅 Explore Any Date in Space History</h3>
        <div class="date-input-section">
          <input type="date" id="dateInput" placeholder="dd-mm-yyyy" />
          <button onclick="getAstronomyData()" class="whisper-btn">🌌 Whisper to Me</button>
        </div>
        <div class="historical-output">
          <button id="speakBtn" onclick="toggleSpeech()" style="display: none;">🔊 Listen to Whisper</button>
          <div id="output"></div>
        </div>
      </div>
    </div>
  `;
}

// Load historical events for selected date
function loadHistoricalEvents() {
  const dateInput = document.getElementById('historicalDate');
  const selectedDate = dateInput.value ? new Date(dateInput.value) : new Date();
  
  const events = getHistoricalEvents(selectedDate);
  const dateString = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  document.getElementById('selectedHistoricalDate').textContent = dateString;
  
  const eventsList = document.getElementById('historicalEventsList');
  eventsList.innerHTML = events.map(event => `
    <div class="historical-event-item">
      <div class="event-year">${event.year}</div>
      <div class="event-content">
        <h4>${event.event}</h4>
        <p>${event.description}</p>
        <span class="event-type">${event.type}</span>
      </div>
    </div>
  `).join('');
}

// Load current date events
function loadCurrentDate() {
  const dateInput = document.getElementById('dateInput');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
    // Removed getHistoricalAstronomyData() call to prevent old events from appearing on main page
  }
}

// Aurora Functions
let auroraVideo = null;

function loadAuroraData() {
  // Simulate aurora visibility data
  const northernVisibility = Math.random() > 0.5 ? 'High' : 'Moderate';
  const southernVisibility = Math.random() > 0.6 ? 'High' : 'Low';
  const bestTime = ['9 PM - 2 AM', '10 PM - 1 AM', '11 PM - 12 AM'][Math.floor(Math.random() * 3)];
  const solarActivity = ['Active', 'Moderate', 'Quiet'][Math.floor(Math.random() * 3)];
  
  // Update visibility cards
  document.getElementById('northernVisibility').textContent = northernVisibility;
  document.getElementById('southernVisibility').textContent = southernVisibility;
  document.getElementById('bestTime').textContent = bestTime;
  document.getElementById('solarActivity').textContent = solarActivity;
  
  // Update status indicators
  document.getElementById('northernStatus').textContent = northernVisibility === 'High' ? 'HIGH' : 'MODERATE';
  document.getElementById('northernStatus').className = `visibility-status ${northernVisibility.toLowerCase()}`;
  
  document.getElementById('southernStatus').textContent = southernVisibility === 'High' ? 'HIGH' : 'LOW';
  document.getElementById('southernStatus').className = `visibility-status ${southernVisibility.toLowerCase()}`;
  
  document.getElementById('timeStatus').textContent = 'OPTIMAL';
  document.getElementById('timeStatus').className = 'visibility-status moderate';
  
  document.getElementById('activityStatus').textContent = solarActivity.toUpperCase();
  document.getElementById('activityStatus').className = `visibility-status ${solarActivity.toLowerCase()}`;
}

function refreshAuroraData() {
  loadAuroraData();
  
  // Add a success message
  const refreshBtn = document.querySelector('.aurora-btn');
  if (refreshBtn && refreshBtn.textContent.includes('Refresh')) {
    refreshBtn.textContent = '✅ Updated!';
    setTimeout(() => {
      refreshBtn.textContent = '🔄 Refresh';
    }, 2000);
  }
}

function initAuroraVideo() {
  auroraVideo = document.getElementById('auroraVideo');
  if (!auroraVideo) return;
  
  // Set video properties
  auroraVideo.volume = 0.3;
  auroraVideo.playbackRate = 1.0;
  
  // Add event listeners for better user experience
  auroraVideo.addEventListener('loadeddata', () => {
    console.log('Aurora video loaded successfully');
    // Enable custom controls
    const playBtn = document.querySelector('.aurora-btn');
    if (playBtn) playBtn.disabled = false;
  });
  
  auroraVideo.addEventListener('loadstart', () => {
    console.log('Aurora video loading started');
  });
  
  auroraVideo.addEventListener('canplay', () => {
    console.log('Aurora video can start playing');
  });
  
  auroraVideo.addEventListener('error', (e) => {
    console.error('Error loading aurora video:', e);
    // Fallback to a placeholder or message
    const videoContainer = auroraVideo.parentElement;
    videoContainer.innerHTML = `
      <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #00ff80, #00cc66); 
                  display: flex; align-items: center; justify-content: center; border-radius: 5px; 
                  border: 1px solid rgba(0,255,128,0.3);">
        <div style="text-align: center; color: #000; font-family: 'Orbitron', sans-serif;">
          <h3>🌌 Aurora Video</h3>
          <p>Video file not found. Please add aurora-video.mp4 to your project.</p>
          <p style="font-size: 12px; margin-top: 10px;">
            You can find free aurora videos on:<br>
            • NASA's website<br>
            • Solar activity resources<br>
            • Stock video platforms
          </p>
        </div>
      </div>
    `;
  });
}

function playAuroraVideo() {
  if (auroraVideo) {
    auroraVideo.play().catch(e => {
      console.error('Error playing video:', e);
    });
  }
}

function pauseAuroraVideo() {
  if (auroraVideo) {
    auroraVideo.pause();
  }
}

function restartAuroraVideo() {
  if (auroraVideo) {
    auroraVideo.currentTime = 0;
    auroraVideo.play().catch(e => {
      console.error('Error playing video:', e);
    });
  }
}

// Add this function near other get*Panel functions
function getCreatorsPanel() {
  return `
    <h2>🪐 The Creators</h2>
    <div class="creators-panel">
      <div class="creator">
        <img src='ishaan.jpg' alt='Ishaan Saxena' class='creator-photo'/>
        <p class='creator-role'>🚀 Ishaan Saxena<br/><span class='role-desc' style="color:#00eaff;">Core Developer | Feature Integrator | Logic Builder | Performance Optimizer</span></p>
        <p class='creator-about'>Ishaan was the tech mastermind who brought the team's cosmic vision to life. He handled both frontend interactions and backend logic, implementing complex functionalities like voice command access that brought the cosmos to users' fingertips. From smooth transitions to responsive layouts, Ishaan built the engine that powered the entire experience. If the team imagined the galaxy, Ishaan made it interactive. His technical genius was the gravitational force that held the project's universe together.</p>
      </div>
      <div class="creator">
        <img src='harpreet.jpg' alt='Harpreet Singh' class='creator-photo'/>
        <p class='creator-role'>🧑‍🚀 Harpreet Singh<br/><span class='role-desc' style="color:#00eaff;">Creative Director | Concept Architect | Prompt Engineer & Data Strategist</span></p>
        <p class='creator-about'>Harpreet was the visionary force behind this project. He crafted the original concept, designed the overall experience, and gave the website its cosmic personality. Through smart prompt engineering, he used AI tools to generate meaningful space content, while his data analysis helped identify the most engaging astronomical events. Harpreet didn't just guide the project — he infused it with life and imagination.</p>
      </div>

    </div>
  `;
}

// --- Cosmic Chatbot Logic ---
const floatingRocket = document.querySelector('.floating-rocket');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotClose = document.getElementById('chatbot-close');

let rocketAnimating = false;

function animateRocketAndOpenChatbot() {
  if (rocketAnimating) return;
  rocketAnimating = true;
  floatingRocket.classList.add('fly-up');
  setTimeout(() => {
    floatingRocket.classList.remove('fly-up');
    openChatbot();
    rocketAnimating = false;
  }, 1000); // match animation duration
}

function animateRocketBack() {
  floatingRocket.classList.add('fly-down');
  setTimeout(() => {
    floatingRocket.classList.remove('fly-down');
  }, 1000); // match animation duration
}

function closeChatbot() {
  chatbotWindow.classList.remove('chatbot-visible');
  chatbotWindow.classList.add('chatbot-hidden');
  animateRocketBack();
}

if (floatingRocket) floatingRocket.onclick = animateRocketAndOpenChatbot;

function addChatbotMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.className = 'chatbot-message ' + sender;
  msg.innerText = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function updateNovaSuggestion(message, prompts = []) {
  const demo = document.getElementById('novaDemoText');
  if (demo) demo.textContent = message;

  const suggestions = document.getElementById('chatbotSuggestions');
  if (suggestions && prompts.length) {
    suggestions.innerHTML = prompts.map(prompt =>
      `<button type="button" onclick="submitSuggestedPrompt(${JSON.stringify(prompt)})">${prompt}</button>`
    ).join('');
  }
}

function isSpaceRelated(text) {
  const keywords = [
    'space', 'satellite', 'moon', 'sun', 'planet', 'galaxy', 'star', 'black hole',
    'astronaut', 'rocket', 'mission', 'cosmos', 'universe', 'comet', 'meteor', 'nebula', 'alien', 'aurora', 'constellation', 'eclipse', 'nasa', 'spacex', 'iss', 'telescope', 'gravity', 'orbit', 'solar', 'lunar', 'astro', 'milky way', 'andromeda', 'jupiter', 'mars', 'venus', 'mercury', 'saturn', 'uranus', 'neptune', 'pluto', 'apollo', 'voyager', 'hubble', 'james webb', 'exoplanet', 'supernova', 'pulsar', 'quasar', 'event horizon', 'cosmic', 'extraterrestrial'
  ];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

async function getAIResponse(userMsg) {
  const systemPrompt = `You are Nova, an expert AI space copilot for Project Zenith. Give clear, accurate, engaging answers about space and astronomy. Keep most answers concise and suggest a useful next exploration when appropriate.`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMsg }
  ];
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      return "Sorry, I couldn't reach the cosmic servers. Please try again later!";
    }
  } catch (e) {
    return "Oops! My rocket lost connection. Please check your internet and try again.";
  }
}

// Utility to normalize text for better matching
function normalizeText(text) {
  const stopWords = ['a', 'an', 'the', 'is', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'by', 'from', 'as', 'that', 'this', 'it', 'about'];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation
    .split(' ')
    .filter(word => word && !stopWords.includes(word))
    .join(' ')
    .trim();
}

let chatbotVoiceReplyRequested = false;

function addTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'chatbot-message bot typing';
  typing.innerHTML = '<i></i><i></i><i></i>';
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return typing;
}

function typeChatbotReply(element, text) {
  element.classList.remove('typing');
  element.innerHTML = '';
  let index = 0;
  const speed = Math.max(10, Math.min(25, 900 / Math.max(text.length, 1)));
  const timer = setInterval(() => {
    element.textContent += text[index] || '';
    index++;
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    if (index > text.length) clearInterval(timer);
  }, speed);
}

function speakNovaReply(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const reply = new SpeechSynthesisUtterance(text);
  reply.rate = 0.96;
  reply.pitch = 1.02;
  window.speechSynthesis.speak(reply);
}

function handleNovaNavigation(message) {
  const command = message.toLowerCase();
  if (command.includes('take me to mars') || command.includes('fly to mars')) {
    setTimeout(() => {
      closeChatbot();
      openSolarSystemAt('mars');
    }, 900);
    return 'Plotting a course to Mars. Opening the 3D observatory now.';
  }
  if (command.includes('show iss') || command.includes('international space station')) {
    setTimeout(() => {
      closeChatbot();
      openPanel('satellites');
    }, 900);
    return 'Opening orbital assets so you can explore the International Space Station.';
  }
  if (command.includes('space news') || command.includes("today's news")) {
    setTimeout(() => {
      closeChatbot();
      openPanel('news');
    }, 900);
    return 'Opening the latest mission intelligence and space headlines.';
  }
  if (command.includes('latest space news')) {
    setTimeout(() => {
      closeChatbot();
      openPanel('news');
    }, 900);
    return 'Opening the mission feed so you can review the newest space briefing.';
  }
  if (command.includes('take me to the moon') || command.includes('show moon')) {
    setTimeout(() => {
      closeChatbot();
      openPanel('moon');
    }, 900);
    return 'Opening the lunar monitor with current phase and orbital data.';
  }
  return null;
}

window.sendChatbotMessage = async function(event) {
  event.preventDefault();
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return false;
  addChatbotMessage(userMsg, 'user');
  chatbotInput.value = '';
  const typingIndicator = addTypingIndicator();
  let botReply;

  // Special handling for greetings
  const normUserMsg = normalizeText(userMsg);
  const greetings = ['hi', 'hello', 'hey', 'hola', 'namaste', 'greetings'];
  if (greetings.includes(normUserMsg)) {
    botReply = "Hello, explorer. I am Nova, your AI space copilot. Where should we go?";
  } else {
    botReply = handleNovaNavigation(userMsg) || await getAIResponse(userMsg);
  }
  typeChatbotReply(typingIndicator, botReply);
  if (chatbotVoiceReplyRequested) {
    speakNovaReply(botReply);
    chatbotVoiceReplyRequested = false;
  }
  return false;
};
// --- End Cosmic Chatbot Logic ---

function openChatbot() {
  chatbotWindow.classList.remove('chatbot-hidden');
  chatbotWindow.classList.add('chatbot-visible');
  setTimeout(() => chatbotInput && chatbotInput.focus(), 300);
  // Show default welcome message from Nova if chat is empty
  if (chatbotMessages && chatbotMessages.children.length === 0) {
    addChatbotMessage("Welcome aboard. I'm Nova, your AI space copilot. Ask a question or tell me where you want to go.", 'bot');
  }
}

function openChatbotWithPrompt(prompt) {
  openChatbot();
  chatbotInput.value = prompt;
  setTimeout(() => chatbotForm.requestSubmit(), 250);
}

function submitSuggestedPrompt(prompt) {
  chatbotInput.value = prompt;
  chatbotForm.requestSubmit();
}

// Initialize chatbot voice recognition
function initChatbotVoiceRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    chatbotRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    chatbotRecognition.continuous = false;
    chatbotRecognition.interimResults = false;
    chatbotRecognition.lang = 'en-US';
    
    chatbotRecognition.onstart = () => {
      isChatbotListening = true;
      const micBtn = document.getElementById('chatbot-mic-btn');
      if (micBtn) {
        micBtn.classList.add('listening');
        micBtn.textContent = '🔴';
      }
    };
    
    chatbotRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const chatbotInput = document.getElementById('chatbot-input');
      if (chatbotInput) {
        chatbotInput.value = transcript;
        chatbotVoiceReplyRequested = true;
        setTimeout(() => chatbotForm.requestSubmit(), 250);
      }
    };
    
    chatbotRecognition.onend = () => {
      isChatbotListening = false;
      const micBtn = document.getElementById('chatbot-mic-btn');
      if (micBtn) {
        micBtn.classList.remove('listening');
        micBtn.textContent = '🎤';
      }
    };
    
    chatbotRecognition.onerror = (event) => {
      console.error('Chatbot voice recognition error:', event.error);
      isChatbotListening = false;
      const micBtn = document.getElementById('chatbot-mic-btn');
      if (micBtn) {
        micBtn.classList.remove('listening');
        micBtn.textContent = '🎤';
      }
    };
  } else {
    console.error('Speech recognition not supported in this browser');
  }
}

// Toggle chatbot voice input
function toggleChatbotVoiceInput() {
  if (!chatbotRecognition) {
    initChatbotVoiceRecognition();
  }
  
  if (isChatbotListening) {
    chatbotRecognition.stop();
  } else {
    chatbotRecognition.start();
  }
}

// 3D Solar System Implementation
let solarSystemScene, solarSystemCamera, solarSystemRenderer, solarSystemControls;
let planets = {}, orbits = {};
let selectedObject = null;
let isOrbiting = true;
let isRealistic = true; // Set to true by default to load textures
let raycaster, mouse;
let comparisonMode = false;
let activeFlightId = 0;

// Solar System Data with authentic NASA textures
const solarSystemData = {
  sun: {
    name: "Sun",
    icon: "☀️",
    radius: 10,
    distance: 0,
    color: 0xffff00,
    texture: "textures/Sun.jpg", // Use Solar System Scope Sun texture
    videoTexture: "textures/sunvideo.mp4", // Use dynamic sun video texture
    emissive: 0xff6600, // More realistic orange glow
    emissiveIntensity: 1.2, // Stronger glow for realism
    scientific: {
      type: "Yellow Dwarf Star",
      mass: "1.989 × 10³⁰ kg",
      diameter: "1,392,700 km",
      surfaceTemp: "5,500°C",
      age: "4.6 billion years",
      composition: "Hydrogen (73%), Helium (25%), Other elements (2%)"
    },
    educational: {
      facts: [
        "The Sun contains 99.86% of the solar system's mass",
        "It takes 8 minutes for sunlight to reach Earth",
        "The Sun's core temperature reaches 15 million degrees Celsius",
        "Solar flares can release energy equivalent to millions of nuclear bombs"
      ],
      history: "The Sun formed from a collapsing cloud of gas and dust about 4.6 billion years ago. It's currently in its main sequence phase and will continue shining for another 5 billion years."
    }
  },
  mercury: {
    name: "Mercury",
    icon: "☿",
    radius: 1.5,
    distance: 20,
    color: 0x8c7853,
    texture: "textures/Mercury.jpeg", // Use local Mercury texture
    videoTexture: "textures/Mercury.mp4", // Use dynamic Mercury video texture
    scientific: {
      type: "Terrestrial Planet",
      mass: "3.285 × 10²³ kg",
      diameter: "4,879 km",
      surfaceTemp: "-180°C to 430°C",
      orbitalPeriod: "88 Earth days",
      rotationPeriod: "59 Earth days",
      atmosphere: "Minimal (sodium, hydrogen, helium)"
    },
    educational: {
      facts: [
        "Mercury is the smallest planet in our solar system",
        "It has no moons and no rings",
        "A day on Mercury is longer than its year",
        "Mercury's surface is covered in craters from meteor impacts"
      ],
      history: "Named after the Roman messenger god, Mercury has been known since ancient times. It's the closest planet to the Sun and experiences extreme temperature variations."
    }
  },
  venus: {
    name: "Venus",
    icon: "♀",
    radius: 2.5,
    distance: 30,
    color: 0xffd700,
    texture: "textures/Venus.jpeg", // Use local Venus texture
    scientific: {
      type: "Terrestrial Planet",
      mass: "4.867 × 10²⁴ kg",
      diameter: "12,104 km",
      surfaceTemp: "462°C (average)",
      orbitalPeriod: "225 Earth days",
      rotationPeriod: "243 Earth days (retrograde)",
      atmosphere: "Dense (96% CO₂, 3.5% N₂)"
    },
    educational: {
      facts: [
        "Venus is the hottest planet in our solar system",
        "It rotates backwards compared to most planets",
        "Venus is often called Earth's 'sister planet'",
        "Its thick atmosphere creates a runaway greenhouse effect"
      ],
      history: "Venus has been observed since prehistoric times and is the brightest planet in our sky. It was named after the Roman goddess of love and beauty."
    },
    videoTexture: "textures/Venus.mp4",
  },
  earth: {
    name: "Earth",
    icon: "🌍",
    radius: 2.8,
    distance: 40,
    color: 0x0077be,
    texture: "textures/Earth.jpeg", // Use local Earth texture
    cloudsTexture: "textures/Earth.jpeg", // Use same image for clouds
    // Fallback to NASA texture if local file doesn't exist
    fallbackTexture: "https://epic.gsfc.nasa.gov/archive/natural/2019/05/30/png/epic_1b_20190530011359.png",
    scientific: {
      type: "Terrestrial Planet",
      mass: "5.972 × 10²⁴ kg",
      diameter: "12,742 km",
      surfaceTemp: "-88°C to 58°C",
      orbitalPeriod: "365.25 days",
      rotationPeriod: "24 hours",
      atmosphere: "Nitrogen (78%), Oxygen (21%), Other (1%)"
    },
    educational: {
      facts: [
        "Earth is the only known planet with life",
        "71% of Earth's surface is covered by water",
        "Earth has one natural satellite - the Moon",
        "Earth's magnetic field protects us from solar radiation"
      ],
      history: "Our home planet formed about 4.5 billion years ago. It's the only planet known to support life, with complex ecosystems and intelligent beings."
    },
    videoTexture: "textures/Earth.mp4",
  },
  mars: {
    name: "Mars",
    icon: "♂",
    radius: 2.2,
    distance: 50,
    color: 0xff4500,
    texture: "textures/Mars.jpeg", // Use local Mars texture
    scientific: {
      type: "Terrestrial Planet",
      mass: "6.39 × 10²³ kg",
      diameter: "6,780 km",
      surfaceTemp: "-140°C to 20°C",
      orbitalPeriod: "687 Earth days",
      rotationPeriod: "24.6 hours",
      atmosphere: "Thin (95% CO₂, 2.7% N₂)"
    },
    educational: {
      facts: [
        "Mars is called the 'Red Planet' due to iron oxide on its surface",
        "It has the largest volcano in the solar system - Olympus Mons",
        "Mars has two moons: Phobos and Deimos",
        "Evidence suggests Mars once had liquid water"
      ],
      history: "Mars has fascinated humans for centuries. Named after the Roman god of war, it's been the target of numerous space missions and is a candidate for future human exploration."
    },
    videoTexture: "textures/Mars.mp4",
  },
  jupiter: {
    name: "Jupiter",
    icon: "♃",
    radius: 8,
    distance: 70,
    color: 0xffa500,
    texture: "textures/Jupiter.jpeg", // Use local Jupiter texture
    scientific: {
      type: "Gas Giant",
      mass: "1.898 × 10²⁷ kg",
      diameter: "139,820 km",
      surfaceTemp: "-110°C (cloud tops)",
      orbitalPeriod: "12 Earth years",
      rotationPeriod: "9.9 hours",
      atmosphere: "Hydrogen (90%), Helium (10%)"
    },
    educational: {
      facts: [
        "Jupiter is the largest planet in our solar system",
        "It has 79 known moons",
        "The Great Red Spot is a storm that's been raging for 400+ years",
        "Jupiter acts as a 'cosmic vacuum cleaner' protecting inner planets"
      ],
      history: "Jupiter has been known since ancient times and is named after the king of the Roman gods. Its massive size and distinctive bands make it easily visible from Earth."
    },
    videoTexture: "textures/Jupiter.mp4",
  },
  saturn: {
    name: "Saturn",
    icon: "♄",
    radius: 7,
    distance: 90,
    color: 0xffd700,
    texture: "textures/Saturn.jpeg", // Use local Saturn texture
    ringsTexture: "textures/Saturn.jpeg", // Use same image for rings
    scientific: {
      type: "Gas Giant",
      mass: "5.683 × 10²⁶ kg",
      diameter: "116,460 km",
      surfaceTemp: "-140°C (cloud tops)",
      orbitalPeriod: "29.5 Earth years",
      rotationPeriod: "10.7 hours",
      atmosphere: "Hydrogen (96%), Helium (3%)"
    },
    educational: {
      facts: [
        "Saturn is famous for its spectacular ring system",
        "It has 82 confirmed moons",
        "Saturn's rings are made mostly of ice particles",
        "It's the least dense planet - it would float in water"
      ],
      history: "Saturn's rings were first observed by Galileo in 1610. Named after the Roman god of agriculture, it's one of the most beautiful objects in our solar system."
    },
    videoTexture: "textures/Saturn.mp4",
  },
  uranus: {
    name: "Uranus",
    icon: "♅",
    radius: 4,
    distance: 110,
    color: 0x00ffff,
    texture: "textures/Uranus.jpeg", // Use local Uranus texture
    scientific: {
      type: "Ice Giant",
      mass: "8.681 × 10²⁵ kg",
      diameter: "50,724 km",
      surfaceTemp: "-195°C (cloud tops)",
      orbitalPeriod: "84 Earth years",
      rotationPeriod: "17.2 hours",
      atmosphere: "Hydrogen (83%), Helium (15%), Methane (2%)"
    },
    educational: {
      facts: [
        "Uranus rotates on its side - its axis is tilted 98 degrees",
        "It has 27 known moons",
        "Uranus appears blue-green due to methane in its atmosphere",
        "It was the first planet discovered with a telescope"
      ],
      history: "Uranus was discovered by William Herschel in 1781. Named after the Greek god of the sky, it's the only planet named after a Greek god rather than a Roman one."
    },
    videoTexture: "textures/Uranus.mp4",
  },
  neptune: {
    name: "Neptune",
    icon: "♆",
    radius: 3.8,
    distance: 130,
    color: 0x0000ff,
    texture: "textures/Neptune.jpeg", // Use local Neptune texture
    scientific: {
      type: "Ice Giant",
      mass: "1.024 × 10²⁶ kg",
      diameter: "49,244 km",
      surfaceTemp: "-200°C (cloud tops)",
      orbitalPeriod: "165 Earth years",
      rotationPeriod: "16.1 hours",
      atmosphere: "Hydrogen (80%), Helium (19%), Methane (1%)"
    },
    educational: {
      facts: [
        "Neptune has the strongest winds in the solar system",
        "It has 14 known moons",
        "Neptune was predicted mathematically before it was discovered",
        "It has a Great Dark Spot similar to Jupiter's Great Red Spot"
      ],
      history: "Neptune was discovered in 1846 after mathematical predictions by Urbain Le Verrier and Johann Galle. Named after the Roman god of the sea, it completes our solar system."
    },
    videoTexture: "textures/Neptune.mp4",
  }
};

// Initialize 3D Solar System
function initSolarSystem() {
  const container = document.getElementById('solarSystemContainer');
  const canvas = document.getElementById('solarSystemCanvas');
  
  // Create scene
  solarSystemScene = new THREE.Scene();
  solarSystemScene.background = new THREE.Color(0x000011);
  
  // Create camera
  solarSystemCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  solarSystemCamera.position.set(0, 80, 120);
  solarSystemCamera.lookAt(0, 0, 0);
  
  // Create renderer with enhanced quality settings
  solarSystemRenderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
    logarithmicDepthBuffer: true
  });
  solarSystemRenderer.setSize(window.innerWidth, window.innerHeight);
  solarSystemRenderer.shadowMap.enabled = true;
  solarSystemRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  solarSystemRenderer.shadowMap.autoUpdate = true;
  solarSystemRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  solarSystemRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  solarSystemRenderer.toneMappingExposure = 1.6;
  solarSystemRenderer.outputEncoding = THREE.sRGBEncoding;
  solarSystemRenderer.physicallyCorrectLights = true;
  solarSystemRenderer.gammaOutput = true;
  solarSystemRenderer.gammaFactor = 2.2;
  solarSystemRenderer.outputColorSpace = THREE.SRGBColorSpace;
  solarSystemRenderer.useLegacyLights = false;
  
  // Create controls
  solarSystemControls = new THREE.OrbitControls(solarSystemCamera, solarSystemRenderer.domElement);
  solarSystemControls.enableDamping = true;
  solarSystemControls.dampingFactor = 0.05;
  solarSystemControls.maxDistance = 300;
  solarSystemControls.minDistance = 20;
  
  // Create raycaster for object selection
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Add lighting
  addLighting();
  
  // Create celestial objects
  createCelestialObjects();
  
  // Add event listeners
  addEventListeners();
  
  // Initialize controls with default values
  initializeControls();
  
  // Start animation
  animate();
  
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('solarSystemLoading').style.display = 'none';
  }, 2000);
}

// Add lighting to the scene
function addLighting() {
  // Enhanced ambient light for overall illumination with color temperature
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  solarSystemScene.add(ambientLight);
  
  // Sun light (point light) - main light source with enhanced properties
  const sunLight = new THREE.PointLight(0xffffff, 8, 400);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 8192;
  sunLight.shadow.mapSize.height = 8192;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 500;
  sunLight.shadow.bias = -0.0001;
  sunLight.shadow.normalBias = 0.02;
  sunLight.shadow.radius = 3;
  sunLight.shadow.autoUpdate = true;
  solarSystemScene.add(sunLight);
  
  // Add sun glow for atmospheric effect with multiple layers
  const sunGlow = new THREE.PointLight(0xffff00, 4, 150);
  sunGlow.position.set(0, 0, 0);
  solarSystemScene.add(sunGlow);
  
  // Add warm sun light for realistic color temperature
  const warmLight = new THREE.PointLight(0xffaa00, 3, 200);
  warmLight.position.set(0, 0, 0);
  solarSystemScene.add(warmLight);
  
  // Add distant stars light for atmosphere
  const starLight = new THREE.AmbientLight(0x001122, 0.15);
  solarSystemScene.add(starLight);
  
  // Add fill light for better planet illumination
  const fillLight = new THREE.DirectionalLight(0x404040, 0.4);
  fillLight.position.set(50, 50, 50);
  solarSystemScene.add(fillLight);
  
  // Add rim lighting for better planet definition
  const rimLight = new THREE.DirectionalLight(0x202020, 0.3);
  rimLight.position.set(-50, -50, -50);
  solarSystemScene.add(rimLight);
  
  // Add volumetric lighting effect
  const volumetricLight = new THREE.PointLight(0xffffff, 1.5, 300);
  volumetricLight.position.set(0, 0, 0);
  volumetricLight.intensity = 0.8;
  solarSystemScene.add(volumetricLight);
  
  // Add hemisphere light for more natural lighting
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x001122, 0.2);
  hemisphereLight.position.set(0, 100, 0);
  solarSystemScene.add(hemisphereLight);
  
  // Add subtle blue light for space atmosphere
  const spaceLight = new THREE.AmbientLight(0x001133, 0.1);
  solarSystemScene.add(spaceLight);
}

// Create all celestial objects
function createCelestialObjects() {
  // Create Sun
  createSun();
  
  // Create planets
  Object.keys(solarSystemData).forEach(planetKey => {
    if (planetKey !== 'sun') {
      createPlanet(planetKey);
    }
  });
  
  // Create star field
  createStarField();
  
  // Create asteroid belt
  createAsteroidBelt();
}

// Create the Sun
function createSun() {
  const sunData = solarSystemData.sun;
  const sunGeometry = new THREE.SphereGeometry(sunData.radius, 128, 128, 0, Math.PI * 2, 0, Math.PI);
  
  let sunMaterial;
  
  // Create the sun sphere with static texture
  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load(sunData.texture);
  sunMaterial = new THREE.MeshBasicMaterial({ 
    map: sunTexture,
    emissive: sunData.emissive || 0xffaa00,
    emissiveIntensity: sunData.emissiveIntensity || 0.6
  });
  
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.name = 'sun';
  sun.userData = { type: 'sun', data: sunData };
  solarSystemScene.add(sun);
  planets.sun = sun;
  
  // Add corona effects to the sun
  addSunCorona(sun, sunData);
  
  // Create circular video display for sun video
  if (sunData.videoTexture) {
    // Comment out circular video display for sun
    // createCircularVideoDisplay(sunData.videoTexture, 'sun', 200, 50);
  }
  
  console.log('Sun created with static texture, corona effects, and circular video display');

  // Add large name label above the Sun
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 32px Orbitron, Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 8;
  ctx.fillText(sunData.name, 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(sunData.radius * 4, sunData.radius * 1.2, 1);
  // Raise Sun's label higher to avoid overlap
  sprite.position.set(0, sunData.radius + 6, 0);
  sun.add(sprite);
}

// Create circular video display that wraps around the solar system
function createCircularVideoDisplay(videoPath, type, radius, height) {
  console.log(`Creating circular video display for ${type}:`, videoPath);
  
  // Create video element
  const video = document.createElement('video');
  video.src = videoPath;
  video.loop = true;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  
  // Create video texture
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;
  videoTexture.wrapS = THREE.RepeatWrapping;
  videoTexture.wrapT = THREE.RepeatWrapping;
  videoTexture.repeat.set(1, 1);
  videoTexture.flipY = false;
  videoTexture.generateMipmaps = false;
  
  // Create cylindrical geometry for the video display
  const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
  
  // Create material with video texture
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    opacity: 0.9, // Increased opacity for better visibility
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  
  // Create the video cylinder
  const videoCylinder = new THREE.Mesh(cylinderGeometry, videoMaterial);
  videoCylinder.name = `${type}_video_display`;
  videoCylinder.position.set(0, 0, 0);
  videoCylinder.userData = { video: video, type: type };
  
  // Add to scene
  solarSystemScene.add(videoCylinder);
  
  // Create a subtle glow effect around the video cylinder
  const glowGeometry = new THREE.CylinderGeometry(radius + 2, radius + 2, height + 4, 64, 1, true);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: type === 'sun' ? 0xff6600 : 0x8c7853, // Sun orange, Mercury brown
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  
  const glowCylinder = new THREE.Mesh(glowGeometry, glowMaterial);
  glowCylinder.name = `${type}_video_glow`;
  glowCylinder.position.set(0, 0, 0);
  videoCylinder.add(glowCylinder);
  
  // Start video playback
  video.play().then(function() {
    console.log(`${type} circular video started playing successfully`);
  }).catch(function(error) {
    console.warn(`${type} circular video autoplay failed:`, error);
    // Try to load video anyway
    video.load();
    video.play().then(function() {
      console.log(`${type} circular video loaded on second attempt`);
    }).catch(function(secondError) {
      console.error(`${type} circular video completely failed:`, secondError);
      // Remove the video cylinder if video fails
      solarSystemScene.remove(videoCylinder);
    });
  });
  
  return videoCylinder;
}

// Add corona effects to the sun (separate from video texture)
function addSunCorona(sun, sunData) {
  // Inner corona - closest to sun surface
  const innerCoronaGeometry = new THREE.SphereGeometry(sunData.radius * 1.3, 64, 64);
  const innerCoronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const innerCorona = new THREE.Mesh(innerCoronaGeometry, innerCoronaMaterial);
  sun.add(innerCorona);
  
  // Middle corona
  const middleCoronaGeometry = new THREE.SphereGeometry(sunData.radius * 1.8, 64, 64);
  const middleCoronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4400,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const middleCorona = new THREE.Mesh(middleCoronaGeometry, middleCoronaMaterial);
  sun.add(middleCorona);
  
  // Outer corona
  const outerCoronaGeometry = new THREE.SphereGeometry(sunData.radius * 2.5, 64, 64);
  const outerCoronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff2200,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const outerCorona = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial);
  sun.add(outerCorona);
  
  // Extreme outer corona
  const extremeCoronaGeometry = new THREE.SphereGeometry(sunData.radius * 3.2, 64, 64);
  const extremeCoronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff1100,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const extremeCorona = new THREE.Mesh(extremeCoronaGeometry, extremeCoronaMaterial);
  sun.add(extremeCorona);
  
  // Store corona references for animation
  sun.userData.corona = {
    inner: innerCorona,
    middle: middleCorona,
    outer: outerCorona,
    extreme: extremeCorona
  };
}

// Create a planet with advanced rendering
function createPlanet(planetKey) {
  const planetData = solarSystemData[planetKey];
  const planetGeometry = new THREE.SphereGeometry(planetData.radius, 256, 256, 0, Math.PI * 2, 0, Math.PI);
  let planetMaterial;
  const textureLoader = new THREE.TextureLoader();

  // Use video texture for any planet that has a videoTexture property
  if (isRealistic && planetData.videoTexture) {
    const video = document.createElement('video');
    video.src = planetData.videoTexture;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.generateMipmaps = false;
    videoTexture.anisotropy = solarSystemRenderer.capabilities.getMaxAnisotropy();
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.wrapT = THREE.RepeatWrapping;
    videoTexture.repeat.set(1, 1);
    videoTexture.flipY = false;
    video.play();
    // Use MeshBasicMaterial for full video wrap, no overlays
    planetMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide
    });
    planetMaterial.userData = { video: video };
  } else if (isRealistic && planetData.texture) {
    const texture = textureLoader.load(planetData.texture);
    planetMaterial = createPlanetMaterialWithTexture(planetKey, planetData, texture);
  } else {
    planetMaterial = createBasicPlanetMaterial(planetKey, planetData);
  }
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.name = planetKey;
  planet.userData = { type: 'planet', data: planetData };
  planet.position.x = planetData.distance;
  planet.castShadow = true;
  planet.receiveShadow = true;
  solarSystemScene.add(planet);
  planets[planetKey] = planet;
  if (planetKey === 'jupiter' || planetKey === 'saturn' || planetKey === 'uranus' || planetKey === 'neptune') {
    createEnhancedAtmosphere(planet, planetData);
  }
  if (planetKey === 'earth' && planetData.cloudsTexture) {
    createEarthClouds(planet, planetData);
  }
  if (planetKey === 'saturn') {
    createEnhancedSaturnRings(planet, planetData);
  }
  createOrbit(planetKey, planetData.distance);

  // Add large name label above the planet
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 32px Orbitron, Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 8;
  ctx.fillText(planetData.name, 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(planetData.radius * 4, planetData.radius * 1.2, 1);
  // Raise Jupiter's label higher to avoid overlap
  if (planetKey === 'jupiter') {
    sprite.position.set(0, planetData.radius + 6, 0);
  } else if (planetKey === 'saturn') {
    sprite.position.set(0, planetData.radius + 8, 0);
  } else {
    sprite.position.set(0, planetData.radius + 2, 0);
  }
  planet.add(sprite);
}

// Helper function to create planet material with texture
function createPlanetMaterialWithTexture(planetKey, planetData, texture) {
  // Create advanced realistic materials with enhanced properties
  switch(planetKey) {
    case 'mercury':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: 0.3,
        normalScale: new THREE.Vector2(0.5, 0.5)
      });
    case 'venus':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.7,
        metalness: 0.05,
        envMapIntensity: 0.4,
        normalScale: new THREE.Vector2(0.3, 0.3)
      });
    case 'earth':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
        envMapIntensity: 0.5,
        normalScale: new THREE.Vector2(0.4, 0.4)
      });
    case 'mars':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.9,
        metalness: 0.05,
        envMapIntensity: 0.2,
        normalScale: new THREE.Vector2(0.6, 0.6)
      });
    case 'jupiter':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.4,
        metalness: 0.1,
        envMapIntensity: 0.6,
        normalScale: new THREE.Vector2(0.2, 0.2)
      });
    case 'saturn':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.3,
        metalness: 0.15,
        envMapIntensity: 0.7,
        normalScale: new THREE.Vector2(0.1, 0.1)
      });
    case 'uranus':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.5,
        metalness: 0.1,
        envMapIntensity: 0.5,
        normalScale: new THREE.Vector2(0.3, 0.3)
      });
    case 'neptune':
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.4,
        metalness: 0.1,
        envMapIntensity: 0.6,
        normalScale: new THREE.Vector2(0.2, 0.2)
      });
    default:
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
        envMapIntensity: 0.4,
        normalScale: new THREE.Vector2(0.3, 0.3)
      });
  }
}

// Create enhanced atmosphere for gas giants
function createEnhancedAtmosphere(planet, planetData) {
  // Primary atmosphere layer with planet-specific colors
  const atmosphereGeometry = new THREE.SphereGeometry(planetData.radius * 1.15, 64, 64);
  let atmosphereColor;
  
  switch(planetData.name.toLowerCase()) {
    case 'jupiter':
      atmosphereColor = 0xffa500; // Orange-brown
      break;
    case 'saturn':
      atmosphereColor = 0xffd700; // Golden
      break;
    case 'uranus':
      atmosphereColor = 0x00ffff; // Cyan
      break;
    case 'neptune':
      atmosphereColor = 0x0000ff; // Blue
      break;
    default:
      atmosphereColor = planetData.color;
  }
  
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: atmosphereColor,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  planet.add(atmosphere);
  
  // Secondary atmospheric layer for more depth
  const atmosphere2Geometry = new THREE.SphereGeometry(planetData.radius * 1.25, 64, 64);
  const atmosphere2Material = new THREE.MeshBasicMaterial({
    color: atmosphereColor,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });
  const atmosphere2 = new THREE.Mesh(atmosphere2Geometry, atmosphere2Material);
  planet.add(atmosphere2);
  
  // Outer atmospheric glow
  const glowGeometry = new THREE.SphereGeometry(planetData.radius * 1.4, 64, 64);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: atmosphereColor,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  planet.add(glow);
}

// Create Earth clouds layer
function createEarthClouds(planet, planetData) {
  const textureLoader = new THREE.TextureLoader();
  const cloudsTexture = textureLoader.load(
    planetData.cloudsTexture,
    function(loadedTexture) {
      loadedTexture.anisotropy = solarSystemRenderer.capabilities.getMaxAnisotropy();
    }
  );
  
  const cloudsGeometry = new THREE.SphereGeometry(planetData.radius * 1.02, 128, 128);
  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.4,
    blending: THREE.NormalBlending
  });
  
  const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  planet.add(clouds);
  
  // Store clouds reference for animation
  planet.userData.clouds = clouds;
}

// Helper function to create basic planet materials
function createBasicPlanetMaterial(planetKey, planetData) {
  switch(planetKey) {
    case 'mercury':
      return new THREE.MeshBasicMaterial({ color: 0x8c7853 });
    case 'venus':
      return new THREE.MeshBasicMaterial({ color: 0xffd700 });
    case 'earth':
      return new THREE.MeshBasicMaterial({ color: 0x0077be });
    case 'mars':
      return new THREE.MeshBasicMaterial({ color: 0xff4500 });
    case 'jupiter':
      return new THREE.MeshBasicMaterial({ color: 0xffa500 });
    case 'saturn':
      return new THREE.MeshBasicMaterial({ color: 0xffd700 });
    case 'uranus':
      return new THREE.MeshBasicMaterial({ color: 0x00ffff });
    case 'neptune':
      return new THREE.MeshBasicMaterial({ color: 0x0000ff });
    default:
      return new THREE.MeshBasicMaterial({ color: planetData.color });
  }
}

// Create orbit path
function createOrbit(planetKey, distance) {
  const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x222222, // Dark gray
    transparent: true,
    opacity: 0.4, // Clearly visible but not too bright
    side: THREE.DoubleSide
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  orbit.name = `orbit_${planetKey}`;
  solarSystemScene.add(orbit);
  orbits[planetKey] = orbit;
}

// Create enhanced Saturn rings
function createEnhancedSaturnRings(saturn) {
  const planetData = solarSystemData.saturn;
  const textureLoader = new THREE.TextureLoader();
  
  // Load ring texture if available
  let ringTexture = null;
  if (planetData.ringsTexture) {
    ringTexture = textureLoader.load(
      planetData.ringsTexture,
      function(loadedTexture) {
        loadedTexture.anisotropy = solarSystemRenderer.capabilities.getMaxAnisotropy();
      }
    );
  }
  
  // Main ring system (A and B rings)
  const mainRingGeometry = new THREE.RingGeometry(8, 15, 128);
  const mainRingMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    color: 0xffd700,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending
  });
  
  const mainRings = new THREE.Mesh(mainRingGeometry, mainRingMaterial);
  mainRings.rotation.x = Math.PI / 2;
  mainRings.rotation.z = Math.PI / 6; // Tilt the rings
  saturn.add(mainRings);
  
  // Inner ring (D ring)
  const innerRingGeometry = new THREE.RingGeometry(6, 8, 128);
  const innerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  
  const innerRings = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
  innerRings.rotation.x = Math.PI / 2;
  innerRings.rotation.z = Math.PI / 6;
  saturn.add(innerRings);
  
  // Outer ring (F ring)
  const outerRingGeometry = new THREE.RingGeometry(15, 16.5, 128);
  const outerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  
  const outerRings = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
  outerRings.rotation.x = Math.PI / 2;
  outerRings.rotation.z = Math.PI / 6;
  saturn.add(outerRings);
  
  // Add ring shadows for depth
  const shadowGeometry = new THREE.RingGeometry(7.5, 15.5, 128);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  
  const ringShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  ringShadow.rotation.x = Math.PI / 2;
  ringShadow.rotation.z = Math.PI / 6;
  saturn.add(ringShadow);
  
  // Add ring glow effect
  const glowGeometry = new THREE.RingGeometry(7.8, 15.2, 128);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  
  const ringGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  ringGlow.rotation.x = Math.PI / 2;
  ringGlow.rotation.z = Math.PI / 6;
  saturn.add(ringGlow);
}

// Create star field background
function createStarField() {
  // Create a beautiful, simple star field with better visual appeal
  const starCount = 8000; // Reduced for better performance
  const starGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    
    // Create stars in a large sphere with some clustering for Milky Way effect
    let radius, theta, phi;
    
    if (Math.random() < 0.6) {
      // 60% of stars in a more spread out pattern
      radius = 300 + Math.random() * 1200;
      theta = Math.random() * Math.PI * 2;
      phi = Math.acos(Math.random() * 2 - 1);
    } else {
      // 40% of stars in a subtle Milky Way band
      radius = 400 + Math.random() * 800;
      theta = Math.random() * Math.PI * 2;
      // Create a subtle band effect
      const bandHeight = 0.3;
      phi = Math.PI / 2 + (Math.random() - 0.5) * bandHeight;
    }
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Create beautiful star colors with more variety
    const colorChoices = [
      [1, 1, 1],      // Pure white
      [0.9, 0.95, 1], // Cool white
      [1, 0.95, 0.9], // Warm white
      [0.8, 0.9, 1],  // Blue-white
      [1, 0.9, 0.8],  // Yellow-white
      [1, 0.85, 0.85], // Pink-white
      [0.9, 0.9, 1],  // Lavender-white
    ];
    
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[i3] = color[0];
    colors[i3 + 1] = color[1];
    colors[i3 + 2] = color[2];
    
    // Create varied star sizes for more visual interest
    const sizeVariation = Math.random();
    if (sizeVariation < 0.1) {
      sizes[i] = 3.0 + Math.random() * 2; // Bright stars (10%)
    } else if (sizeVariation < 0.3) {
      sizes[i] = 1.5 + Math.random() * 1; // Medium stars (20%)
    } else {
      sizes[i] = 0.5 + Math.random() * 0.8; // Small stars (70%)
    }
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  
  const starField = new THREE.Points(starGeometry, starMaterial);
  starField.name = 'starField';
  solarSystemScene.add(starField);
  
  // Add a subtle background glow
  createBackgroundGlow();
}

// Create nebula-like regions for more realistic Milky Way
function createNebulaRegions() {
  const nebulaCount = 8;
  
  for (let i = 0; i < nebulaCount; i++) {
    const nebulaGeometry = new THREE.SphereGeometry(50 + Math.random() * 100, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(
        0.6 + Math.random() * 0.3, // Blue to purple hues
        0.3 + Math.random() * 0.4, // Moderate saturation
        0.1 + Math.random() * 0.2  // Low brightness
      ),
      transparent: true,
      opacity: 0.05 + Math.random() * 0.1,
      blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    
    // Position nebula in the galactic plane
    const angle = Math.random() * Math.PI * 2;
    const radius = 400 + Math.random() * 800;
    const height = (Math.random() - 0.5) * 200;
    
    nebula.position.set(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );
    
    nebula.name = `nebula_${i}`;
    solarSystemScene.add(nebula);
  }
}

// Create asteroid belt
function createAsteroidBelt() {
  const asteroidCount = 5000;
  const innerRadius = 60; // Between Mars and Jupiter
  const outerRadius = 80;
  const beltHeight = 10;
  
  // Create asteroid geometry (small irregular shapes)
  const asteroidGeometry = new THREE.DodecahedronGeometry(0.1, 0);
  
  // Create asteroid material with realistic appearance
  const asteroidMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B7355, // Brown-gray color
    roughness: 0.9,
    metalness: 0.1,
    envMapIntensity: 0.1
  });
  
  // Create asteroid group
  const asteroidGroup = new THREE.Group();
  asteroidGroup.name = 'asteroidBelt';
  
  for (let i = 0; i < asteroidCount; i++) {
    // Random position in the belt
    const angle = Math.random() * Math.PI * 2;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const height = (Math.random() - 0.5) * beltHeight;
    
    // Add some randomness to make it more realistic
    const x = radius * Math.cos(angle) + (Math.random() - 0.5) * 5;
    const z = radius * Math.sin(angle) + (Math.random() - 0.5) * 5;
    const y = height + (Math.random() - 0.5) * 2;
    
    // Create asteroid mesh
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set(x, y, z);
    
    // Random rotation
    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    asteroid.rotation.z = Math.random() * Math.PI;
    
    // Random scale for variety
    const scale = Math.random() * 0.5 + 0.3;
    asteroid.scale.set(scale, scale, scale);
    
    // Add to group
    asteroidGroup.add(asteroid);
  }
  
  solarSystemScene.add(asteroidGroup);
  
  // Store reference for animation
  solarSystemScene.userData.asteroidBelt = asteroidGroup;
}

// Add event listeners
function addEventListeners() {
  // Mouse click for object selection
  solarSystemRenderer.domElement.addEventListener('click', onMouseClick);
  // Prevent text selection on drag
  solarSystemRenderer.domElement.addEventListener('mousedown', function(e) { e.preventDefault(); });
  // Mouse move for label updates
  solarSystemRenderer.domElement.addEventListener('mousemove', onMouseMove);
  
  // Window resize
  window.addEventListener('resize', onWindowResize);
  
  // Control buttons
  // document.getElementById('toggleOrbits').addEventListener('click', toggleOrbits);
  document.getElementById('resetView').addEventListener('click', resetView);
  // Removed event listener for toggleRealistic
}

// Handle mouse click for object selection
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, solarSystemCamera);
  const intersects = raycaster.intersectObjects(solarSystemScene.children);
  
  if (intersects.length > 0) {
    let object = intersects[0].object;
    const intersectionPoint = intersects[0].point; // Get the exact point where cursor hit

    while (object.parent && !object.userData?.type) {
      object = object.parent;
    }
    
    if (object.userData && (object.userData.type === 'planet' || object.userData.type === 'sun')) {
      selectObject(object, intersectionPoint);
    }
  }
}

// Handle mouse move for label updates
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Removed label position updates - no more floating labels
}

// Select an object and show information
function selectObject(object, intersectionPoint) {
  selectedObject = object;
  const data = object.userData.data;
  
  // Update scientific panel
  updateScientificPanel(data);
  
  // Update educational panel
  updateEducationalPanel(data);
  
  // Show panels
  document.getElementById('scientificPanel').classList.add('active');
  document.getElementById('educationalPanel').classList.add('active');
  
  // Fly to the selected object for cinematic inspection.
  flyToPlanet(object.name);
}

// Update scientific information panel
function updateScientificPanel(data) {
  const panel = document.getElementById('scientificData');
  panel.innerHTML = `
    <div class="panel-header">
      <h4>${data.name} - ${data.icon}</h4>
      <button class="panel-close-btn" onclick="closeInfoPanels()">✕</button>
    </div>
    <ul>
      <li><strong>Type:</strong> ${data.scientific.type}</li>
      <li><strong>Mass:</strong> ${data.scientific.mass}</li>
      <li><strong>Diameter:</strong> ${data.scientific.diameter}</li>
      <li><strong>Surface Temperature:</strong> ${data.scientific.surfaceTemp}</li>
      <li><strong>Orbital Period:</strong> ${data.scientific.orbitalPeriod}</li>
      <li><strong>Rotation Period:</strong> ${data.scientific.rotationPeriod}</li>
      <li><strong>Atmosphere:</strong> ${data.scientific.atmosphere}</li>
    </ul>
  `;
}

// Update educational information panel
function updateEducationalPanel(data) {
  const panel = document.getElementById('educationalData');
  panel.innerHTML = `
    <div class="panel-header">
      <h4>${data.name} - ${data.icon}</h4>
      <button class="panel-close-btn" onclick="closeInfoPanels()">✕</button>
    </div>
    <h5>Fascinating Facts:</h5>
    <ul>
      ${data.educational.facts.map(fact => `<li>${fact}</li>`).join('')}
    </ul>
    <h5>Historical Context:</h5>
    <p>${data.educational.history}</p>
  `;
}

function updateComparisonPanel(data) {
  const panel = document.getElementById('comparisonData');
  const comparisonPanel = document.getElementById('comparisonPanel');
  if (!panel || !comparisonPanel) return;

  if (!comparisonMode || data.name === 'Sun') {
    comparisonPanel.classList.remove('active');
    return;
  }

  const earth = solarSystemData.earth;
  const diameter = parseFloat(String(data.scientific.diameter || '').replace(/[^0-9.]/g, ''));
  const earthDiameter = parseFloat(String(earth.scientific.diameter || '').replace(/[^0-9.]/g, ''));
  const sizeRatio = diameter && earthDiameter ? (diameter / earthDiameter).toFixed(2) : 'N/A';

  panel.innerHTML = `
    <div class="comparison-grid">
      <div><span>World</span><strong>${data.name}</strong><small>${data.scientific.type}</small></div>
      <div><span>Earth Size Ratio</span><strong>${sizeRatio}x</strong><small>Diameter comparison</small></div>
      <div><span>Year Length</span><strong>${data.scientific.orbitalPeriod || 'N/A'}</strong><small>Orbital period</small></div>
      <div><span>Atmosphere</span><strong>${data.scientific.atmosphere || 'N/A'}</strong><small>Primary composition</small></div>
    </div>
  `;
  comparisonPanel.classList.add('active');
}

function togglePlanetComparison() {
  comparisonMode = !comparisonMode;
  const button = document.getElementById('compareModeBtn');
  if (button) {
    button.classList.toggle('active', comparisonMode);
    button.textContent = comparisonMode ? 'Comparison On' : 'Compare Planets';
  }
  if (selectedObject?.userData?.data) {
    updateComparisonPanel(selectedObject.userData.data);
  } else if (!comparisonMode) {
    document.getElementById('comparisonPanel')?.classList.remove('active');
  }
}

// Close information panels
function closeInfoPanels() {
  // Hide info panels
  document.getElementById('scientificPanel').classList.remove('active');
  document.getElementById('educationalPanel').classList.remove('active');
  document.getElementById('comparisonPanel')?.classList.remove('active');
  
  // Reset selection
  selectedObject = null;
  
  // Reset camera to default view
  resetView();
}

// Focus camera on selected object
function focusOnObject(object) {
  // Get the object's current world position
  const objectPosition = object.getWorldPosition(new THREE.Vector3());
  
  // Calculate a good camera position relative to the object
  const cameraDistance = 15; // Distance from the object
  const cameraOffset = new THREE.Vector3(0, 5, cameraDistance); // Slightly above and in front
  const targetCameraPosition = objectPosition.clone().add(cameraOffset);
  
  // Smooth camera movement
  const duration = 2000;
  const startPosition = solarSystemCamera.position.clone();
  const startTime = Date.now();
  
  function animateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    // Move camera to new position
    solarSystemCamera.position.lerpVectors(startPosition, targetCameraPosition, easeOut);
    
    // Update controls target to the object's position
    solarSystemControls.target.copy(objectPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  }
  
  animateCamera();
}

function openSolarSystemAt(planetKey) {
  openSolarSystem();
  const waitForPlanet = () => {
    if (planets[planetKey]) {
      flyToPlanet(planetKey);
    } else {
      setTimeout(waitForPlanet, 120);
    }
  };
  setTimeout(waitForPlanet, 250);
}

function flyToPlanet(planetKey) {
  const object = planets[planetKey];
  if (!object || !solarSystemCamera || !solarSystemControls) return;

  selectedObject = object;
  updateScientificPanel(object.userData.data);
  updateEducationalPanel(object.userData.data);
  updateComparisonPanel(object.userData.data);
  document.getElementById('scientificPanel').classList.add('active');
  document.getElementById('educationalPanel').classList.add('active');
  updateNovaSuggestion(
    `${object.userData.data.name} selected. I can explain its science, missions, or how it compares with Earth.`,
    [
      `Tell me about ${object.userData.data.name}`,
      `Compare ${object.userData.data.name} with Earth`,
      `${object.userData.data.name} missions`
    ]
  );

  const objectPosition = object.getWorldPosition(new THREE.Vector3());
  const radius = object.userData.data.radius || 4;
  const viewDistance = Math.max(radius * 4.2, 12);
  const direction = solarSystemCamera.position.clone().sub(objectPosition).normalize();
  if (direction.lengthSq() === 0) direction.set(0.5, 0.3, 1);
  const destination = objectPosition.clone().add(direction.multiplyScalar(viewDistance));
  destination.y += radius * 0.8;

  const startPosition = solarSystemCamera.position.clone();
  const startTarget = solarSystemControls.target.clone();
  const duration = 1800;
  const startTime = performance.now();
  const flightId = ++activeFlightId;
  solarSystemControls.enabled = false;

  function animateFlight(now) {
    if (flightId !== activeFlightId) return;
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    solarSystemCamera.position.lerpVectors(startPosition, destination, eased);
    solarSystemControls.target.lerpVectors(startTarget, objectPosition, eased);
    solarSystemCamera.lookAt(solarSystemControls.target);

    if (progress < 1) {
      requestAnimationFrame(animateFlight);
    } else {
      solarSystemControls.enabled = true;
      solarSystemControls.update();
    }
  }

  requestAnimationFrame(animateFlight);
}

// Toggle orbit visibility
function toggleOrbits() {
  const button = document.getElementById('toggleOrbits');
  Object.values(orbits).forEach(orbit => {
    orbit.visible = !orbit.visible;
  });
  button.classList.toggle('active');
}

// Toggle label visibility
function toggleLabels() {
  const button = document.getElementById('toggleLabels');
  showLabels = !showLabels;
  Object.values(labels).forEach(label => {
    label.element.style.display = showLabels ? 'block' : 'none';
  });
  button.classList.toggle('active');
}

// Reset camera view
function resetView() {
  activeFlightId++;
  solarSystemCamera.position.set(0, 80, 120);
  solarSystemControls.target.set(0, 0, 0);
  selectedObject = null;
  
  // Hide info panels
  document.getElementById('scientificPanel').classList.remove('active');
  document.getElementById('educationalPanel').classList.remove('active');
  document.getElementById('comparisonPanel')?.classList.remove('active');
}

// Toggle realistic mode
function toggleRealistic() {
  const button = document.getElementById('toggleRealistic');
  isRealistic = !isRealistic;
  
  Object.keys(planets).forEach(planetKey => {
    const planet = planets[planetKey];
    const planetData = solarSystemData[planetKey];
    
    if (isRealistic) {
      planet.material = new THREE.MeshPhongMaterial({ 
        color: planetData.color,
        shininess: 30
      });
    } else {
      planet.material = new THREE.MeshBasicMaterial({ 
        color: planetData.color 
      });
    }
  });
  
  button.classList.toggle('active');
}

// Update orbit speed
function updateOrbitSpeed(event) {
  const speed = parseFloat(event.target.value);
  // Clamp speed between 0.1 and 5.0
  const clampedSpeed = Math.max(0.1, Math.min(5.0, speed));
  window.orbitSpeed = clampedSpeed;
  
  // Update the slider value to reflect the clamped value
  event.target.value = clampedSpeed;
  
  // Add visual feedback
  const label = event.target.previousElementSibling;
  if (label && label.tagName === 'LABEL') {
    label.textContent = `Orbit Speed: ${clampedSpeed.toFixed(1)}x`;
  }
}

// Update camera distance
function updateCameraDistance(event) {
  const distance = parseFloat(event.target.value);
  
  // Clamp distance between 20 and 2000 (extended for Milky Way view)
  const clampedDistance = Math.max(20, Math.min(2000, distance));
  
  // Get current camera position and target
  const currentPosition = solarSystemCamera.position.clone();
  const target = solarSystemControls.target.clone();
  
  // Calculate direction from target to camera
  const direction = currentPosition.clone().sub(target).normalize();
  
  // Calculate new position at the specified distance from target
  const newPosition = target.clone().add(direction.multiplyScalar(clampedDistance));
  
  // Smoothly move camera to new position
  const duration = 1000;
  const startTime = Date.now();
  const startPosition = currentPosition.clone();
  
  function animateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth movement
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    // Move camera to new position
    solarSystemCamera.position.lerpVectors(startPosition, newPosition, easeOut);
    
    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  }
  
  animateCamera();
  
  // Update the slider value to reflect the clamped value
  event.target.value = clampedDistance;
  
  // Add visual feedback
  const label = event.target.previousElementSibling;
  if (label && label.tagName === 'LABEL') {
    label.textContent = `Camera Distance: ${clampedDistance} units`;
  }
}

// Handle window resize
function onWindowResize() {
  solarSystemCamera.aspect = window.innerWidth / window.innerHeight;
  solarSystemCamera.updateProjectionMatrix();
  solarSystemRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  
  // Animate planets
  Object.keys(planets).forEach(planetKey => {
    const planet = planets[planetKey];
    if (planet && planetKey !== 'sun') {
      // Rotate planets on their axes
      planet.rotation.y += 0.09;
      
      // Orbit around the sun
      const distance = solarSystemData[planetKey].distance;
      const speed = 0.5 / distance; // Slower for outer planets
      planet.position.x = Math.cos(time * speed * window.orbitSpeed) * distance;
      planet.position.z = Math.sin(time * speed * window.orbitSpeed) * distance;
      
      // Update video texture if it exists for planets
      if (planet.material && planet.material.map && planet.material.map.isVideoTexture) {
        planet.material.map.needsUpdate = true;
      }
      
      // Animate Earth clouds
      if (planetKey === 'earth' && planet.userData.clouds) {
        planet.userData.clouds.rotation.y += 0.005;
      }
      
      // Animate gas giant atmospheres
      if (planetKey === 'jupiter' || planetKey === 'saturn' || planetKey === 'uranus' || planetKey === 'neptune') {
        planet.children.forEach(child => {
          if (child.material && child.material.transparent) {
            child.rotation.y += 0.003;
          }
        });
      }
    }
  });
  
  // Animate sun
  if (planets.sun) {
    planets.sun.rotation.y += 0.002;
    
    // Update video texture if it exists
    if (planets.sun.material && planets.sun.material.map && planets.sun.material.map.isVideoTexture) {
      planets.sun.material.map.needsUpdate = true;
    }
    
    // Animate corona effects
    if (planets.sun.userData.corona) {
      const corona = planets.sun.userData.corona;
      const pulseSpeed = 0.003;
      const pulseAmount = 0.1;
      
      // Pulse the corona opacity
      Object.values(corona).forEach(coronaLayer => {
        if (coronaLayer.material) {
          const baseOpacity = coronaLayer.userData.baseOpacity || coronaLayer.material.opacity;
          if (!coronaLayer.userData.baseOpacity) {
            coronaLayer.userData.baseOpacity = baseOpacity;
          }
          
          coronaLayer.material.opacity = baseOpacity + Math.sin(time * pulseSpeed) * pulseAmount;
        }
      });
      
      // Slight rotation of corona layers
      corona.inner.rotation.y += 0.001;
      corona.middle.rotation.y -= 0.0008;
      corona.outer.rotation.y += 0.0006;
      corona.extreme.rotation.y -= 0.0004;
    }
  }
  
  // Animate Saturn rings
  if (planets.saturn) {
    planets.saturn.children.forEach(child => {
      if (child.geometry && child.geometry.type === 'RingGeometry') {
        child.rotation.y += 0.001;
      }
    });
  }
  
  // Animate circular video displays
  solarSystemScene.children.forEach(child => {
    if (child.name && (child.name === 'sun_video_display' || child.name === 'mercury_video_display')) {
      // Rotate the video cylinders slowly
      child.rotation.y += 0.001;
      
      // Update video texture if it exists
      if (child.material && child.material.map && child.material.map.isVideoTexture) {
        child.material.map.needsUpdate = true;
      }
      
      // Animate glow effect with pulsing
      child.children.forEach(glowChild => {
        if (glowChild.name && glowChild.name.includes('_video_glow')) {
          const baseOpacity = glowChild.userData.baseOpacity || 0.2;
          if (!glowChild.userData.baseOpacity) {
            glowChild.userData.baseOpacity = baseOpacity;
          }
          
          // Pulse the glow opacity
          const pulseSpeed = 0.002;
          const pulseAmount = 0.1;
          glowChild.material.opacity = baseOpacity + Math.sin(time * pulseSpeed) * pulseAmount;
        }
      });
    }
  });
  
  // Update controls
  if (solarSystemControls) {
    solarSystemControls.update();
  }
  
  // Render the scene
  solarSystemRenderer.render(solarSystemScene, solarSystemCamera);
}

// Open 3D Solar System
function openSolarSystem() {
  document.getElementById('solarSystemContainer').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Hide chatbot and credits button
  const floatingAlien = document.getElementById('floating-alien');
  const creditsContainer = document.querySelector('.credits-container');
  if (floatingAlien) floatingAlien.style.display = 'none';
  if (creditsContainer) creditsContainer.style.display = 'none';
  
  // Initialize if not already done
  if (!solarSystemScene) {
    initSolarSystem();
  } else {
    Object.values(planets).forEach(planet => {
      const video = planet?.material?.userData?.video;
      if (video?.paused) video.play().catch(() => {});
    });
  }
}

// Close 3D Solar System
function closeSolarSystem() {
  document.getElementById('solarSystemContainer').classList.remove('active');
  document.body.style.overflow = 'auto';
  
  // Show chatbot and credits button again
  const floatingAlien = document.getElementById('floating-alien');
  const creditsContainer = document.querySelector('.credits-container');
  if (floatingAlien) floatingAlien.style.display = '';
  if (creditsContainer) creditsContainer.style.display = '';
  
  // Hide info panels
  document.getElementById('scientificPanel').classList.remove('active');
  document.getElementById('educationalPanel').classList.remove('active');
  
  // Pause video textures while the observatory is hidden.
  Object.keys(planets).forEach(planetKey => {
    const planet = planets[planetKey];
    if (planet && planet.material && planet.material.userData && planet.material.userData.video) {
      const video = planet.material.userData.video;
      video.pause();
    }
  });
}

// Add solar system panel handler to existing panel system
function handleSolarSystemPanel() {
  openSolarSystem();
}

// Initialize controls with default values
function initializeControls() {
  // Set default orbit speed
  window.orbitSpeed = 1.0;
  const orbitSpeedSlider = document.getElementById('orbitSpeed');
  if (orbitSpeedSlider) {
    orbitSpeedSlider.value = 1.0;
    const orbitLabel = orbitSpeedSlider.previousElementSibling;
    if (orbitLabel && orbitLabel.tagName === 'LABEL') {
      orbitLabel.textContent = 'Orbit Speed: 1.0x';
    }
    // Attach event listener
    orbitSpeedSlider.addEventListener('input', updateOrbitSpeed);
  }
  
  // Set default camera distance
  const cameraDistanceSlider = document.getElementById('cameraDistance');
  if (cameraDistanceSlider) {
    cameraDistanceSlider.value = 150;
    const cameraLabel = cameraDistanceSlider.previousElementSibling;
    if (cameraLabel && cameraLabel.tagName === 'LABEL') {
      cameraLabel.textContent = 'Camera Distance: 150 units';
    }
    // Attach event listener
    cameraDistanceSlider.addEventListener('input', updateCameraDistance);
  }
}

// Focus camera on cursor position
function focusOnCursorPosition(cursorPosition) {
  // Calculate a good camera position relative to the cursor position
  const cameraDistance = 15; // Distance from the cursor point
  const cameraOffset = new THREE.Vector3(0, 5, cameraDistance); // Slightly above and in front
  const targetCameraPosition = cursorPosition.clone().add(cameraOffset);
  
  // Smooth camera movement
  const duration = 2000;
  const startPosition = solarSystemCamera.position.clone();
  const startTime = Date.now();
  
  function animateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    // Move camera to new position
    solarSystemCamera.position.lerpVectors(startPosition, targetCameraPosition, easeOut);
    
    // Update controls target to the cursor position
    solarSystemControls.target.copy(cursorPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  }
  
  animateCamera();
}

// Create a subtle background glow for depth
function createBackgroundGlow() {
  // Create a large sphere for background glow
  const glowGeometry = new THREE.SphereGeometry(2000, 32, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x001122), // Very dark blue
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
  });
  
  const backgroundGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  backgroundGlow.name = 'backgroundGlow';
  solarSystemScene.add(backgroundGlow);
  
  // Add a few subtle nebula-like regions
  createSubtleNebulas();
}

// Create subtle nebula regions for visual interest
function createSubtleNebulas() {
  const nebulaCount = 4; // Reduced count
  
  for (let i = 0; i < nebulaCount; i++) {
    const nebulaGeometry = new THREE.SphereGeometry(80 + Math.random() * 120, 16, 16);
    
    // Create subtle, beautiful colors
    const hue = 0.5 + Math.random() * 0.3; // Blue to purple range
    const saturation = 0.2 + Math.random() * 0.3; // Low saturation
    const lightness = 0.05 + Math.random() * 0.1; // Very dark
    
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(hue, saturation, lightness),
      transparent: true,
      opacity: 0.03 + Math.random() * 0.05, // Very subtle
      blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    
    // Position nebula randomly but not too close
    const angle = Math.random() * Math.PI * 2;
    const radius = 600 + Math.random() * 1000;
    const height = (Math.random() - 0.5) * 400;
    
    nebula.position.set(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );
    
    nebula.name = `nebula_${i}`;
    solarSystemScene.add(nebula);
  }
}

/*
// Fresh 3D Solar System - procedural, reliable, and texture-independent.
// This block intentionally overrides the older solar-system functions above.
const modernSolarSystemData = {
  sun: {
    name: "Sun",
    radius: 11,
    distance: 0,
    color: 0xffb547,
    scientific: {
      type: "Yellow dwarf star",
      mass: "1.989 x 10^30 kg",
      diameter: "1,392,700 km",
      surfaceTemp: "5,500 C",
      orbitalPeriod: "Galactic orbit: ~230 million years",
      rotationPeriod: "25 to 35 Earth days",
      atmosphere: "Hydrogen and helium plasma"
    },
    educational: {
      facts: [
        "The Sun holds about 99.86% of the solar system's mass",
        "Sunlight takes about 8 minutes to reach Earth",
        "Its core fuses hydrogen into helium",
        "Solar wind shapes planetary magnetospheres"
      ],
      history: "The Sun formed about 4.6 billion years ago from a collapsing cloud of gas and dust. It is the energy source that makes Earth habitable."
    }
  },
  mercury: {
    name: "Mercury",
    radius: 1.6,
    distance: 22,
    color: 0xb7a48f,
    orbitSpeed: 1.9,
    rotationSpeed: 0.018,
    scientific: {
      type: "Terrestrial planet",
      mass: "3.285 x 10^23 kg",
      diameter: "4,879 km",
      surfaceTemp: "-180 C to 430 C",
      orbitalPeriod: "88 Earth days",
      rotationPeriod: "59 Earth days",
      atmosphere: "Trace exosphere"
    },
    educational: {
      facts: [
        "Mercury is the smallest planet",
        "It has no moons",
        "Its surface is heavily cratered",
        "A Mercury day is longer than its year"
      ],
      history: "Known since antiquity, Mercury was named for the Roman messenger god because it moves quickly across the sky."
    }
  },
  venus: {
    name: "Venus",
    radius: 2.7,
    distance: 32,
    color: 0xe7c07a,
    orbitSpeed: 1.45,
    rotationSpeed: -0.006,
    scientific: {
      type: "Terrestrial planet",
      mass: "4.867 x 10^24 kg",
      diameter: "12,104 km",
      surfaceTemp: "462 C average",
      orbitalPeriod: "225 Earth days",
      rotationPeriod: "243 Earth days, retrograde",
      atmosphere: "Dense carbon dioxide"
    },
    educational: {
      facts: [
        "Venus is the hottest planet",
        "It rotates backward compared with most planets",
        "Its clouds contain sulfuric acid",
        "It is close to Earth in size"
      ],
      history: "Venus has been observed since prehistoric times and is one of the brightest natural objects in Earth's sky."
    }
  },
  earth: {
    name: "Earth",
    radius: 2.9,
    distance: 43,
    color: 0x4ca8ff,
    orbitSpeed: 1.15,
    rotationSpeed: 0.024,
    scientific: {
      type: "Terrestrial planet",
      mass: "5.972 x 10^24 kg",
      diameter: "12,742 km",
      surfaceTemp: "-88 C to 58 C",
      orbitalPeriod: "365.25 days",
      rotationPeriod: "24 hours",
      atmosphere: "Nitrogen, oxygen, argon"
    },
    educational: {
      facts: [
        "Earth is the only known world with life",
        "About 71% of the surface is water",
        "The Moon stabilizes Earth's axial tilt",
        "Earth's magnetic field helps shield it from solar wind"
      ],
      history: "Earth formed about 4.5 billion years ago and developed oceans, atmosphere, and life over deep geological time."
    }
  },
  mars: {
    name: "Mars",
    radius: 2.2,
    distance: 55,
    color: 0xd66d4b,
    orbitSpeed: 0.92,
    rotationSpeed: 0.022,
    scientific: {
      type: "Terrestrial planet",
      mass: "6.39 x 10^23 kg",
      diameter: "6,780 km",
      surfaceTemp: "-140 C to 20 C",
      orbitalPeriod: "687 Earth days",
      rotationPeriod: "24.6 hours",
      atmosphere: "Thin carbon dioxide"
    },
    educational: {
      facts: [
        "Mars is called the Red Planet",
        "Olympus Mons is the largest known volcano",
        "Mars has two small moons",
        "Ancient Mars likely had liquid water"
      ],
      history: "Mars has been a major target for orbiters, landers, and rovers because it may preserve evidence of past habitability."
    }
  },
  jupiter: {
    name: "Jupiter",
    radius: 7.8,
    distance: 78,
    color: 0xd9b084,
    orbitSpeed: 0.52,
    rotationSpeed: 0.04,
    scientific: {
      type: "Gas giant",
      mass: "1.898 x 10^27 kg",
      diameter: "139,820 km",
      surfaceTemp: "-110 C cloud tops",
      orbitalPeriod: "12 Earth years",
      rotationPeriod: "9.9 hours",
      atmosphere: "Hydrogen and helium"
    },
    educational: {
      facts: [
        "Jupiter is the largest planet",
        "Its Great Red Spot is a giant storm",
        "It has many moons, including Europa and Ganymede",
        "Its magnetic field is extremely powerful"
      ],
      history: "Jupiter's four largest moons were observed by Galileo in 1610, changing humanity's understanding of orbital motion."
    }
  },
  saturn: {
    name: "Saturn",
    radius: 6.8,
    distance: 102,
    color: 0xe6c98c,
    orbitSpeed: 0.38,
    rotationSpeed: 0.034,
    scientific: {
      type: "Gas giant",
      mass: "5.683 x 10^26 kg",
      diameter: "116,460 km",
      surfaceTemp: "-140 C cloud tops",
      orbitalPeriod: "29.5 Earth years",
      rotationPeriod: "10.7 hours",
      atmosphere: "Hydrogen and helium"
    },
    educational: {
      facts: [
        "Saturn is famous for its ring system",
        "The rings are mostly ice and rock",
        "Saturn is less dense than water",
        "Titan has a thick atmosphere"
      ],
      history: "Galileo saw Saturn's rings in 1610, though their true structure became clear only after later telescopic observations."
    }
  },
  uranus: {
    name: "Uranus",
    radius: 4.2,
    distance: 124,
    color: 0x84d9df,
    orbitSpeed: 0.26,
    rotationSpeed: 0.026,
    scientific: {
      type: "Ice giant",
      mass: "8.681 x 10^25 kg",
      diameter: "50,724 km",
      surfaceTemp: "-195 C cloud tops",
      orbitalPeriod: "84 Earth years",
      rotationPeriod: "17.2 hours",
      atmosphere: "Hydrogen, helium, methane"
    },
    educational: {
      facts: [
        "Uranus rotates on its side",
        "Methane gives it a blue-green color",
        "It has faint rings",
        "It was the first planet discovered with a telescope"
      ],
      history: "William Herschel discovered Uranus in 1781, expanding the known solar system beyond Saturn."
    }
  },
  neptune: {
    name: "Neptune",
    radius: 4,
    distance: 146,
    color: 0x4b6fff,
    orbitSpeed: 0.2,
    rotationSpeed: 0.028,
    scientific: {
      type: "Ice giant",
      mass: "1.024 x 10^26 kg",
      diameter: "49,244 km",
      surfaceTemp: "-200 C cloud tops",
      orbitalPeriod: "165 Earth years",
      rotationPeriod: "16.1 hours",
      atmosphere: "Hydrogen, helium, methane"
    },
    educational: {
      facts: [
        "Neptune has the strongest winds in the solar system",
        "It was predicted mathematically before observation",
        "Triton orbits Neptune backward",
        "It has a deep blue appearance"
      ],
      history: "Neptune was found in 1846 after astronomers used Uranus's orbit to predict another planet's position."
    }
  }
};

let solarAnimationFrame = null;
let modernSolarClock = null;
let solarJourneyTimer = null;

function makeRadialSpriteTexture(innerColor, outerColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.35, outerColor);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function makeLabelTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.font = '700 42px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,.9)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = 'rgba(245,255,252,.96)';
  ctx.fillText(text, 256, 56);
  ctx.font = '500 18px Arial';
  ctx.fillStyle = 'rgba(157,255,215,.9)';
  ctx.fillText('SELECT', 256, 94);
  return new THREE.CanvasTexture(canvas);
}

function createPlanetMaterial(key, data) {
  if (key === 'sun') {
    return new THREE.MeshBasicMaterial({ color: data.color });
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const base = `#${data.color.toString(16).padStart(6, '0')}`;
  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#f4f7f5');
  gradient.addColorStop(0.18, base);
  gradient.addColorStop(1, '#05070d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 14; i++) {
    ctx.globalAlpha = key === 'jupiter' || key === 'saturn' ? 0.2 : 0.12;
    ctx.fillStyle = i % 2 ? '#ffffff' : '#000000';
    const y = (i / 14) * 256 + Math.sin(i * 1.7) * 8;
    ctx.fillRect(0, y, 512, key === 'jupiter' || key === 'saturn' ? 10 : 4);
  }

  if (key === 'earth') {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#39c47f';
    ctx.beginPath();
    ctx.ellipse(180, 90, 55, 22, -0.4, 0, Math.PI * 2);
    ctx.ellipse(330, 145, 72, 28, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffffff,
    roughness: key === 'earth' ? 0.62 : 0.82,
    metalness: 0.02,
    emissive: new THREE.Color(data.color).multiplyScalar(0.06)
  });
}

function initSolarSystem() {
  const canvas = document.getElementById('solarSystemCanvas');
  const loading = document.getElementById('solarSystemLoading');
  planets = {};
  orbits = {};
  selectedObject = null;
  activeFlightId++;
  window.orbitSpeed = window.orbitSpeed || 1;

  solarSystemScene = new THREE.Scene();
  solarSystemScene.background = new THREE.Color(0x02040b);
  solarSystemScene.fog = new THREE.FogExp2(0x02040b, 0.0022);

  solarSystemCamera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 2400);
  solarSystemCamera.position.set(0, 82, 178);

  solarSystemRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  solarSystemRenderer.setSize(window.innerWidth, window.innerHeight);
  solarSystemRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  solarSystemRenderer.outputEncoding = THREE.sRGBEncoding;
  solarSystemRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  solarSystemRenderer.toneMappingExposure = 1.05;

  solarSystemControls = new THREE.OrbitControls(solarSystemCamera, solarSystemRenderer.domElement);
  solarSystemControls.enableDamping = true;
  solarSystemControls.dampingFactor = 0.065;
  solarSystemControls.minDistance = 18;
  solarSystemControls.maxDistance = 520;
  solarSystemControls.target.set(0, 0, 0);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  modernSolarClock = new THREE.Clock();

  addLighting();
  createCelestialObjects();
  addEventListeners();
  initializeControls();
  updateScientificPanel(modernSolarSystemData.sun);
  updateEducationalPanel(modernSolarSystemData.sun);
  document.getElementById('scientificPanel')?.classList.add('active');
  document.getElementById('educationalPanel')?.classList.add('active');

  if (loading) loading.style.display = 'none';
  animate();
}

function addLighting() {
  solarSystemScene.add(new THREE.AmbientLight(0x7d92b8, 0.26));

  const sunLight = new THREE.PointLight(0xfff1c1, 3.8, 620, 1.35);
  sunLight.position.set(0, 0, 0);
  solarSystemScene.add(sunLight);

  const blueFill = new THREE.DirectionalLight(0x7ab8ff, 0.55);
  blueFill.position.set(-90, 70, 120);
  solarSystemScene.add(blueFill);

  const rim = new THREE.DirectionalLight(0xbca5ff, 0.32);
  rim.position.set(120, -30, -160);
  solarSystemScene.add(rim);
}

function createCelestialObjects() {
  createStarField();
  createBackgroundGlow();
  createSun();

  Object.keys(modernSolarSystemData).forEach(key => {
    if (key !== 'sun') createPlanet(key);
  });

  createAsteroidBelt();
}

function createSun() {
  const data = modernSolarSystemData.sun;
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 96, 96),
    createPlanetMaterial('sun', data)
  );
  sun.name = 'sun';
  sun.userData = { type: 'sun', data, orbitAngle: 0 };
  solarSystemScene.add(sun);
  planets.sun = sun;

  const glowTexture = makeRadialSpriteTexture('rgba(255,255,218,1)', 'rgba(255,113,28,.5)');
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffaa44,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glow.scale.set(62, 62, 1);
  glow.name = 'sun-glow';
  sun.add(glow);

  const corona = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius * 1.35, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xff8a2a,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  );
  corona.name = 'sun-corona';
  sun.add(corona);

  createObjectLabel(sun, data.name, data.radius + 10);
}

function createPlanet(key) {
  const data = modernSolarSystemData[key];
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 64, 64),
    createPlanetMaterial(key, data)
  );
  const startAngle = Object.keys(planets).length * 0.72;
  planet.name = key;
  planet.position.set(Math.cos(startAngle) * data.distance, 0, Math.sin(startAngle) * data.distance);
  planet.userData = { type: 'planet', data, orbitAngle: startAngle, key };
  solarSystemScene.add(planet);
  planets[key] = planet;

  createOrbit(key, data.distance);
  createObjectLabel(planet, data.name, data.radius + (key === 'saturn' ? 9 : 4));

  if (key === 'earth') createMoon(planet);
  if (key === 'saturn') createSaturnRings(planet);
  if (key === 'uranus') createUranusRing(planet);
  if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(key)) createPlanetGlow(planet, data);
}

function createObjectLabel(object, text, yOffset) {
  const label = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeLabelTexture(text),
    transparent: true,
    depthTest: false
  }));
  label.name = `${object.name}-label`;
  const scale = object.name === 'sun' ? 34 : Math.max(15, object.userData.data.radius * 5);
  label.scale.set(scale, scale * 0.25, 1);
  label.position.set(0, yOffset, 0);
  label.userData = { label: true };
  object.add(label);
}

function createMoon(earth) {
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xd8d6cb, roughness: 0.9 })
  );
  moon.name = 'moon-orbiter';
  moon.position.set(6.2, 0.2, 0);
  moon.userData = { moonAngle: 0 };
  earth.add(moon);
}

function createSaturnRings(saturn) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(9.2, 14.2, 128),
    new THREE.MeshBasicMaterial({
      color: 0xeedaa8,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    })
  );
  ring.name = 'saturn-rings';
  ring.rotation.x = Math.PI * 0.5;
  ring.rotation.y = -0.38;
  saturn.add(ring);
}

function createUranusRing(uranus) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(5.2, 6.2, 96),
    new THREE.MeshBasicMaterial({
      color: 0xa8f4ff,
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide
    })
  );
  ring.rotation.x = Math.PI * 0.5;
  ring.rotation.z = 1.1;
  uranus.add(ring);
}

function createPlanetGlow(planet, data) {
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeRadialSpriteTexture('rgba(255,255,255,.55)', 'rgba(112,216,255,.16)'),
    color: data.color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glow.name = `${planet.name}-glow`;
  const scale = data.radius * 4.4;
  glow.scale.set(scale, scale, 1);
  planet.add(glow);
}

function createOrbit(key, distance) {
  const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(240).map(point => new THREE.Vector3(point.x, 0, point.y));
  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: key === 'earth' ? 0x9dffd7 : 0x56677b,
      transparent: true,
      opacity: key === 'earth' ? 0.34 : 0.16
    })
  );
  orbit.name = `orbit_${key}`;
  solarSystemScene.add(orbit);
  orbits[key] = orbit;
}

function createStarField() {
  const starCount = 2800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const color = new THREE.Color();

  for (let i = 0; i < starCount; i++) {
    const radius = 420 + Math.random() * 950;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.65;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    color.setHSL(0.56 + Math.random() * 0.14, 0.35, 0.72 + Math.random() * 0.25);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false
    })
  );
  stars.name = 'modern-starfield';
  solarSystemScene.add(stars);
}

function createBackgroundGlow() {
  const glowTexture = makeRadialSpriteTexture('rgba(112,216,255,.34)', 'rgba(183,160,255,.14)');
  const placements = [
    [-250, 90, -420, 360, 230, 0x70d8ff],
    [280, -80, -520, 430, 280, 0xb7a0ff],
    [0, 150, -700, 520, 240, 0x55e6ad]
  ];

  placements.forEach(([x, y, z, width, height, color]) => {
    const nebula = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    nebula.position.set(x, y, z);
    nebula.scale.set(width, height, 1);
    nebula.name = 'space-nebula';
    solarSystemScene.add(nebula);
  });
}

function createAsteroidBelt() {
  const group = new THREE.Group();
  group.name = 'asteroid-belt';
  const geometry = new THREE.DodecahedronGeometry(0.28, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x9a8978, roughness: 0.96 });

  for (let i = 0; i < 260; i++) {
    const asteroid = new THREE.Mesh(geometry, material);
    const angle = Math.random() * Math.PI * 2;
    const radius = 63 + Math.random() * 8;
    asteroid.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.4, Math.sin(angle) * radius);
    const scale = 0.55 + Math.random() * 1.7;
    asteroid.scale.set(scale, scale * (0.65 + Math.random() * 0.7), scale);
    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(asteroid);
  }

  solarSystemScene.add(group);
  solarSystemScene.userData.asteroidBelt = group;
}

function addEventListeners() {
  const canvas = solarSystemRenderer?.domElement;
  if (!canvas || canvas.userData?.modernListenersAdded) return;
  canvas.userData = canvas.userData || {};
  canvas.userData.modernListenersAdded = true;
  canvas.addEventListener('click', onMouseClick);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  document.getElementById('resetView')?.addEventListener('click', resetView);
}

function onMouseMove(event) {
  if (!solarSystemRenderer || !solarSystemCamera) return;
  const rect = solarSystemRenderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onMouseClick(event) {
  onMouseMove(event);
  raycaster.setFromCamera(mouse, solarSystemCamera);
  const selectable = Object.values(planets);
  const intersects = raycaster.intersectObjects(selectable, true);
  const hit = intersects.map(item => {
    let object = item.object;
    while (object && !object.userData?.type) object = object.parent;
    return object;
  }).find(Boolean);

  if (hit?.name) flyToPlanet(hit.name);
}

function updateScientificPanel(data) {
  const panel = document.getElementById('scientificData');
  if (!panel || !data) return;
  const fields = data.scientific || {};
  panel.innerHTML = `
    <div class="planet-profile-title"><strong>${data.name}</strong><span>${fields.type || 'Celestial object'}</span></div>
    <div class="data-grid">
      <div><span>Mass</span><strong>${fields.mass || 'N/A'}</strong></div>
      <div><span>Diameter</span><strong>${fields.diameter || 'N/A'}</strong></div>
      <div><span>Temperature</span><strong>${fields.surfaceTemp || 'N/A'}</strong></div>
      <div><span>Year</span><strong>${fields.orbitalPeriod || 'N/A'}</strong></div>
      <div><span>Day</span><strong>${fields.rotationPeriod || 'N/A'}</strong></div>
      <div><span>Atmosphere</span><strong>${fields.atmosphere || 'N/A'}</strong></div>
    </div>
  `;
}

function updateEducationalPanel(data) {
  const panel = document.getElementById('educationalData');
  if (!panel || !data) return;
  const facts = data.educational?.facts || [];
  panel.innerHTML = `
    <p>${data.educational?.history || 'Select a world to learn more.'}</p>
    <ul class="planet-facts">${facts.map(fact => `<li>${fact}</li>`).join('')}</ul>
  `;
}

function updateComparisonPanel(data) {
  const panel = document.getElementById('comparisonData');
  const comparisonPanel = document.getElementById('comparisonPanel');
  if (!panel || !comparisonPanel) return;

  if (!comparisonMode || data.name === 'Sun') {
    comparisonPanel.classList.remove('active');
    return;
  }

  const earthDiameter = parseFloat(modernSolarSystemData.earth.scientific.diameter.replace(/[^0-9.]/g, ''));
  const currentDiameter = parseFloat(String(data.scientific.diameter || '').replace(/[^0-9.]/g, ''));
  const ratio = currentDiameter && earthDiameter ? (currentDiameter / earthDiameter).toFixed(2) : 'N/A';

  panel.innerHTML = `
    <div class="comparison-grid">
      <div><span>World</span><strong>${data.name}</strong><small>${data.scientific.type}</small></div>
      <div><span>Earth Size Ratio</span><strong>${ratio}x</strong><small>Diameter comparison</small></div>
      <div><span>Year Length</span><strong>${data.scientific.orbitalPeriod || 'N/A'}</strong><small>Orbital period</small></div>
      <div><span>Atmosphere</span><strong>${data.scientific.atmosphere || 'N/A'}</strong><small>Primary composition</small></div>
    </div>
  `;
  comparisonPanel.classList.add('active');
}

function flyToPlanet(planetKey) {
  const object = planets[planetKey];
  if (!object || !solarSystemCamera || !solarSystemControls) return;

  selectedObject = object;
  const data = object.userData.data;
  updateScientificPanel(data);
  updateEducationalPanel(data);
  updateComparisonPanel(data);
  document.getElementById('scientificPanel')?.classList.add('active');
  document.getElementById('educationalPanel')?.classList.add('active');

  if (typeof updateNovaSuggestion === 'function') {
    updateNovaSuggestion(`${data.name} selected. Ask Nova for missions, science, or Earth comparisons.`, [
      `Tell me about ${data.name}`,
      `Compare ${data.name} with Earth`,
      `${data.name} missions`
    ]);
  }

  const objectPosition = object.getWorldPosition(new THREE.Vector3());
  const radius = data.radius || 4;
  const viewDistance = Math.max(radius * 5.2, planetKey === 'sun' ? 58 : 17);
  const direction = solarSystemCamera.position.clone().sub(objectPosition).normalize();
  if (direction.lengthSq() < 0.1) direction.set(0.45, 0.28, 1).normalize();
  const destination = objectPosition.clone().add(direction.multiplyScalar(viewDistance));
  destination.y += Math.max(radius * 1.2, 5);

  const startPosition = solarSystemCamera.position.clone();
  const startTarget = solarSystemControls.target.clone();
  const duration = 1350;
  const startTime = performance.now();
  const flightId = ++activeFlightId;
  solarSystemControls.enabled = false;

  function animateFlight(now) {
    if (flightId !== activeFlightId) return;
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    solarSystemCamera.position.lerpVectors(startPosition, destination, eased);
    solarSystemControls.target.lerpVectors(startTarget, objectPosition, eased);
    solarSystemCamera.lookAt(solarSystemControls.target);

    if (progress < 1) {
      requestAnimationFrame(animateFlight);
    } else {
      solarSystemControls.enabled = true;
      solarSystemControls.update();
    }
  }

  requestAnimationFrame(animateFlight);
}

function openSolarSystemAt(planetKey) {
  openSolarSystem();
  const waitForPlanet = () => {
    if (planets[planetKey]) flyToPlanet(planetKey);
    else setTimeout(waitForPlanet, 80);
  };
  setTimeout(waitForPlanet, 180);
}

function resetView() {
  if (!solarSystemCamera || !solarSystemControls) return;
  activeFlightId++;
  selectedObject = null;
  solarSystemCamera.position.set(0, 82, 178);
  solarSystemControls.target.set(0, 0, 0);
  solarSystemControls.update();
  updateScientificPanel(modernSolarSystemData.sun);
  updateEducationalPanel(modernSolarSystemData.sun);
  document.getElementById('comparisonPanel')?.classList.remove('active');
}

function togglePlanetComparison() {
  comparisonMode = !comparisonMode;
  const button = document.getElementById('compareModeBtn');
  if (button) {
    button.classList.toggle('active', comparisonMode);
    button.textContent = comparisonMode ? 'Comparison On' : 'Compare Planets';
  }
  if (selectedObject?.userData?.data) updateComparisonPanel(selectedObject.userData.data);
  else document.getElementById('comparisonPanel')?.classList.remove('active');
}

function startSolarSystemJourney() {
  const button = document.getElementById('solarJourneyBtn');
  if (solarJourneyTimer) {
    clearInterval(solarJourneyTimer);
    solarJourneyTimer = null;
    if (button) button.textContent = 'Start Journey';
    return;
  }

  const route = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  let index = 0;
  if (button) button.textContent = 'Stop Journey';
  flyToPlanet(route[index]);
  solarJourneyTimer = setInterval(() => {
    index = (index + 1) % route.length;
    flyToPlanet(route[index]);
  }, 4200);
}

function updateOrbitSpeed(event) {
  const speed = Math.max(0.1, Math.min(5, parseFloat(event.target.value) || 1));
  window.orbitSpeed = speed;
  event.target.value = speed;
  const label = event.target.previousElementSibling;
  if (label?.tagName === 'LABEL') label.textContent = `Orbit Speed: ${speed.toFixed(1)}x`;
}

function updateCameraDistance(event) {
  if (!solarSystemCamera || !solarSystemControls) return;
  const distance = Math.max(20, Math.min(520, parseFloat(event.target.value) || 150));
  const direction = solarSystemCamera.position.clone().sub(solarSystemControls.target).normalize();
  solarSystemCamera.position.copy(solarSystemControls.target.clone().add(direction.multiplyScalar(distance)));
  solarSystemControls.update();
  event.target.value = distance;
  const label = event.target.previousElementSibling;
  if (label?.tagName === 'LABEL') label.textContent = `Camera Distance: ${Math.round(distance)} units`;
}

function initializeControls() {
  const orbitSpeedSlider = document.getElementById('orbitSpeed');
  if (orbitSpeedSlider && !orbitSpeedSlider.dataset.modernBound) {
    orbitSpeedSlider.dataset.modernBound = 'true';
    orbitSpeedSlider.value = window.orbitSpeed || 1;
    orbitSpeedSlider.addEventListener('input', updateOrbitSpeed);
  }
  if (orbitSpeedSlider?.previousElementSibling) {
    orbitSpeedSlider.previousElementSibling.textContent = `Orbit Speed: ${(window.orbitSpeed || 1).toFixed(1)}x`;
  }

  const cameraDistanceSlider = document.getElementById('cameraDistance');
  if (cameraDistanceSlider && !cameraDistanceSlider.dataset.modernBound) {
    cameraDistanceSlider.dataset.modernBound = 'true';
    cameraDistanceSlider.value = 178;
    cameraDistanceSlider.max = 520;
    cameraDistanceSlider.step = 10;
    cameraDistanceSlider.addEventListener('input', updateCameraDistance);
  }
  if (cameraDistanceSlider?.previousElementSibling) {
    cameraDistanceSlider.previousElementSibling.textContent = 'Camera Distance: 178 units';
  }
}

function onWindowResize() {
  if (!solarSystemCamera || !solarSystemRenderer) return;
  solarSystemCamera.aspect = window.innerWidth / window.innerHeight;
  solarSystemCamera.updateProjectionMatrix();
  solarSystemRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (solarAnimationFrame) cancelAnimationFrame(solarAnimationFrame);

  const renderFrame = () => {
    solarAnimationFrame = requestAnimationFrame(renderFrame);
    if (!solarSystemScene || !solarSystemRenderer || !solarSystemCamera) return;

    const delta = Math.min(modernSolarClock?.getDelta?.() || 0.016, 0.04);
    const speed = window.orbitSpeed || 1;
    const elapsed = performance.now() * 0.001;

    Object.entries(planets).forEach(([key, planet]) => {
      const data = modernSolarSystemData[key];
      if (!data) return;

      planet.rotation.y += (data.rotationSpeed || 0.012) * delta * 60;
      if (key !== 'sun') {
        planet.userData.orbitAngle += (data.orbitSpeed || 0.4) * 0.055 * delta * speed;
        planet.position.x = Math.cos(planet.userData.orbitAngle) * data.distance;
        planet.position.z = Math.sin(planet.userData.orbitAngle) * data.distance;
      } else {
        const corona = planet.getObjectByName('sun-corona');
        const glow = planet.getObjectByName('sun-glow');
        if (corona) corona.material.opacity = 0.16 + Math.sin(elapsed * 2.4) * 0.035;
        if (glow) {
          const pulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
          glow.scale.set(62 * pulse, 62 * pulse, 1);
        }
      }

      const moon = planet.getObjectByName('moon-orbiter');
      if (moon) {
        moon.userData.moonAngle += delta * 1.8;
        moon.position.set(Math.cos(moon.userData.moonAngle) * 6.2, 0.25, Math.sin(moon.userData.moonAngle) * 6.2);
      }
    });

    const belt = solarSystemScene.userData.asteroidBelt;
    if (belt) belt.rotation.y += delta * 0.025;

    solarSystemScene.children.forEach(child => {
      if (child.name === 'modern-starfield') child.rotation.y += delta * 0.004;
      if (child.name === 'space-nebula') child.material.opacity = 0.28 + Math.sin(elapsed * 0.35 + child.position.x) * 0.05;
    });

    solarSystemControls?.update();
    solarSystemRenderer.render(solarSystemScene, solarSystemCamera);
  };

  renderFrame();
}

function openSolarSystem() {
  document.getElementById('solarSystemContainer')?.classList.add('active');
  document.body.style.overflow = 'hidden';
  const floatingAlien = document.getElementById('floating-alien');
  if (floatingAlien) floatingAlien.style.display = 'none';

  if (!solarSystemScene) {
    initSolarSystem();
  } else {
    onWindowResize();
    if (!solarAnimationFrame) animate();
  }
}

function closeSolarSystem() {
  document.getElementById('solarSystemContainer')?.classList.remove('active');
  document.body.style.overflow = 'auto';
  const floatingAlien = document.getElementById('floating-alien');
  if (floatingAlien) floatingAlien.style.display = '';
  if (solarJourneyTimer) {
    clearInterval(solarJourneyTimer);
    solarJourneyTimer = null;
    const button = document.getElementById('solarJourneyBtn');
    if (button) button.textContent = 'Start Journey';
  }
}
*/

// --- Project Zenith Flagship Functions ---
let zenithScene, zenithCamera, zenithRenderer, zenithControls, zenithAnimationFrame;
let zenithEarthGrid;
let zenithISS;
let zenithSatellites = [];
let zenithOrbitLine;
let zenithGroundStation;
let issCountdownInterval;
let secondsRemaining = 0;
let lastISSLat = 0;
let lastISSLng = 0;
let lastISSAlt = 420;
let currentLat = 12.8230;
let currentLng = 80.0442;
let currentCity = 'Observatory';

// Global info modal function
window.showZenithInfoModal = function(name, type) {
  const modalId = 'zenith-info-modal';
  let modal = document.getElementById(modalId);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(2, 4, 11, 0.85)';
    modal.style.backdropFilter = 'blur(10px)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    document.body.appendChild(modal);
  }
  
  const descriptions = {
    'Jupiter': 'Jupiter is the largest planet in our Solar System, primarily made of hydrogen and helium. Its iconic Great Red Spot is a giant storm larger than Earth. Tonight, its four Galilean moons (Io, Europa, Ganymede, and Callisto) are visible with basic binoculars.',
    'Saturn': 'Known as the jewel of the Solar System, Saturn is famous for its extensive ring system made of ice particles, rocky debris, and dust. It has over 140 moons, including Titan, which has its own atmosphere.',
    'Mars': 'Mars, the Red Planet, gets its iron-oxide rust color from its dusty surface. It is home to Olympus Mons, the largest volcano in the Solar System, and features deep canyons like Valles Marineris.',
    'Venus': 'Venus is the brightest natural object in the night sky after the Moon. It features a runaway greenhouse effect with a crushing carbon-dioxide atmosphere and clouds of sulfuric acid.',
    'Mercury': 'The smallest and closest planet to the Sun, Mercury experiences extreme temperature swings between day and night, ranging from -180°C to 430°C.',
    'Uranus': 'An ice giant with an extreme axial tilt of 98 degrees, causing it to roll on its side as it orbits. It has a faint ring system and 28 known moons.',
    'Neptune': 'The most distant planet in our Solar System, Neptune is a windy ice giant with supersonic winds. It is home to the Great Dark Spot storm and the moon Triton.',
    'Orion': 'Orion (The Hunter) is one of the most recognizable constellations in the night sky. It contains the supergiant stars Betelgeuse and Rigel, as well as the famous Orion Nebula (M42), a massive star-forming region.',
    'Ursa Major': 'Ursa Major (The Great Bear) contains the Big Dipper asterism, which is used as a pointer to locate Polaris, the North Star. It is a circumpolar constellation in the northern hemisphere.',
    'Cassiopeia': 'Cassiopeia is a distinctive constellation in the northern sky shaped like a W or M. In Greek mythology, she was the vain queen of Aethiopia.',
    'Cygnus': 'Cygnus (The Swan) is a northern constellation lying on the plane of the Milky Way. Its brightest star, Deneb, forms one of the vertices of the Summer Triangle.',
    'Leo': 'Leo (The Lion) is one of the oldest recognized constellations, containing the bright star Regulus. In astrology, it is the fifth sign of the zodiac.',
    'Taurus': 'Taurus (The Bull) contains the Pleiades (Seven Sisters) and Hyades star clusters, as well as the bright red giant star Aldebaran.',
    'Gemini': 'Gemini (The Twins) contains the two bright stars Castor and Pollux. It is home to the Geminid meteor shower in mid-December.',
    'Pegasus': 'Pegasus is a constellation in the northern sky, named after the winged horse in Greek mythology. It is famous for the Great Square of Pegasus asterism.',
    'Scorpius': 'Scorpius (The Scorpion) is a southern zodiac constellation containing the red supergiant star Antares, often called the "heart of the scorpion."',
    'Ursa Minor': 'Ursa Minor (The Lesser Bear) contains the Little Dipper asterism. Its tip is Polaris, the North Star, which aligns almost exactly with Earth’s rotational axis.',
    'Crux': 'Crux (The Southern Cross) is the smallest of all 88 constellations but is highly prominent in the southern hemisphere, used for navigation to find south.'
  };
  
  const desc = descriptions[name] || `A prominent celestial object visible in the night sky. Learn more about ${name}'s coordinates, distance, and optimal viewing conditions in the observatory logs.`;
  
  modal.innerHTML = `
    <div style="background:linear-gradient(135deg, rgba(255,255,255,0.05), rgba(9,14,28,0.5)), #070a13; border:1px solid rgba(0, 243, 255, 0.3); border-radius:18px; padding:30px; width:450px; max-width:90%; box-shadow:0 24px 70px rgba(0,0,0,0.6); position:relative;">
      <button onclick="document.getElementById('zenith-info-modal').style.display='none'" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#89969e; font-size:16px; cursor:pointer;">✕</button>
      <div style="font-size:10px; color:#00f3ff; font-family:var(--mono); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.1em;">Zenith Registry // ${type}</div>
      <h2 style="margin:0 0 16px 0; color:#dfe6e2; font-family:var(--body); font-size:22px; font-weight:700;">${name}</h2>
      <p style="color:#89969e; font-size:13px; line-height:1.6; margin:0 0 24px 0;">${desc}</p>
      <div style="display:flex; justify-content:flex-end;">
        <button onclick="document.getElementById('zenith-info-modal').style.display='none'" style="background:linear-gradient(90deg, #00f3ff, #b59cff); border:none; color:#070a13; font-weight:700; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:12px; transition:opacity 0.2s;">Acknowledge</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
};

// Astronomical Utilities
function getJulianDate(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function getLocalSiderealTime(jd, longitude) {
  const d = jd - 2451545.0;
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  let lst = gmst + longitude;
  lst = lst % 360;
  if (lst < 0) lst += 360;
  return lst;
}

function getHorizontalCoordinates(ra, dec, lat, lst) {
  const latRad = lat * Math.PI / 180;
  const decRad = dec * Math.PI / 180;
  let ha = lst - ra;
  if (ha < 0) ha += 360;
  const haRad = ha * Math.PI / 180;
  
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const alt = Math.asin(sinAlt) * 180 / Math.PI;
  
  const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  let az = Math.acos(cosAz) * 180 / Math.PI;
  if (Math.sin(haRad) > 0) {
    az = 360 - az;
  }
  
  return { alt, az };
}

function getDirection(az) {
  const directions = [
    { label: 'North', min: 337.5, max: 22.5 },
    { label: 'North-East', min: 22.5, max: 67.5 },
    { label: 'East', min: 67.5, max: 112.5 },
    { label: 'South-East', min: 112.5, max: 157.5 },
    { label: 'South', min: 157.5, max: 202.5 },
    { label: 'South-West', min: 202.5, max: 247.5 },
    { label: 'West', min: 247.5, max: 292.5 },
    { label: 'North-West', min: 292.5, max: 337.5 }
  ];
  for (const d of directions) {
    if (d.min > d.max) {
      if (az >= d.min || az < d.max) return d.label;
    } else {
      if (az >= d.min && az < d.max) return d.label;
    }
  }
  return 'East';
}

function getQuality(alt) {
  if (alt > 45) return 'Excellent';
  if (alt > 20) return 'Good';
  return 'Fair';
}

const constellationCatalog = [
  { name: "Orion", ra: 83.82, dec: -5.38 },
  { name: "Ursa Major", ra: 168.0, dec: 55.0 },
  { name: "Cassiopeia", ra: 15.0, dec: 60.0 },
  { name: "Cygnus", ra: 308.0, dec: 42.0 },
  { name: "Leo", ra: 160.0, dec: 15.0 },
  { name: "Taurus", ra: 65.0, dec: 19.0 },
  { name: "Gemini", ra: 105.0, dec: 22.0 },
  { name: "Pegasus", ra: 345.0, dec: 20.0 },
  { name: "Scorpius", ra: 245.0, dec: -26.0 },
  { name: "Ursa Minor", ra: 225.0, dec: 75.0 },
  { name: "Crux", ra: 188.0, dec: -60.0 }
];

function getVisibleConstellations(jd, lat, lon) {
  const lst = getLocalSiderealTime(jd, lon);
  const visible = [];
  
  constellationCatalog.forEach(c => {
    const coords = getHorizontalCoordinates(c.ra, c.dec, lat, lst);
    if (coords.alt > 0) {
      visible.push({
        name: c.name,
        alt: coords.alt,
        az: coords.az,
        direction: getDirection(coords.az),
        quality: getQuality(coords.alt)
      });
    }
  });
  
  visible.sort((a, b) => b.alt - a.alt);
  return visible.slice(0, 4);
}

const planetElements = {
  mercury: { a: 0.3871, e: 0.2056, i: 7.005, L: 252.25, longPeri: 77.46, longNode: 48.33, period: 0.2408 },
  venus:   { a: 0.7233, e: 0.0068, i: 3.395, L: 181.98, longPeri: 131.56, longNode: 76.68, period: 0.6152 },
  earth:   { a: 1.0000, e: 0.0167, i: 0.000, L: 100.46, longPeri: 102.94, longNode: 0.0,    period: 1.0000 },
  mars:    { a: 1.5237, e: 0.0934, i: 1.850, L: 355.45, longPeri: 336.06, longNode: 49.56, period: 1.8808 },
  jupiter: { a: 5.2028, e: 0.0484, i: 1.303, L: 34.35,  longPeri: 14.33,  longNode: 100.46, period: 11.862 },
  saturn:  { a: 9.5388, e: 0.0541, i: 2.489, L: 50.08,  longPeri: 92.86,  longNode: 113.69, period: 29.458 },
  uranus:  { a: 19.1914, e: 0.0473, i: 0.773, L: 314.06, longPeri: 172.43, longNode: 74.01,  period: 84.01 },
  neptune: { a: 30.0611, e: 0.0086, i: 1.770, L: 304.35, longPeri: 46.68,  longNode: 131.78, period: 164.79 }
};

function getPlanetPosition(planetKey, jd) {
  const p = planetElements[planetKey];
  if (!p) return { x: 0, y: 0, z: 0 };
  
  const d = jd - 2451545.0;
  const n = 360 / (p.period * 365.256);
  const M = (p.L - p.longPeri + n * d) % 360;
  
  let E = M;
  const eRad = p.e;
  for (let k = 0; k < 3; k++) {
    E = E + (M + eRad * Math.sin(E * Math.PI / 180) * 180 / Math.PI - E) / (1 - eRad * Math.cos(E * Math.PI / 180));
  }
  
  const x = p.a * (Math.cos(E * Math.PI / 180) - p.e);
  const y = p.a * Math.sqrt(1 - p.e * p.e) * Math.sin(E * Math.PI / 180);
  
  const r = Math.sqrt(x*x + y*y);
  const v = Math.atan2(y, x) * 180 / Math.PI;
  const longNodeRad = p.longNode * Math.PI / 180;
  const iRad = p.i * Math.PI / 180;
  
  const cosVLongPeri = Math.cos((v + p.longPeri - p.longNode) * Math.PI / 180);
  const sinVLongPeri = Math.sin((v + p.longPeri - p.longNode) * Math.PI / 180);
  
  const xh = r * (Math.cos(longNodeRad) * cosVLongPeri - Math.sin(longNodeRad) * sinVLongPeri * Math.cos(iRad));
  const yh = r * (Math.sin(longNodeRad) * cosVLongPeri + Math.cos(longNodeRad) * sinVLongPeri * Math.cos(iRad));
  const zh = r * (sinVLongPeri * Math.sin(iRad));
  
  return { x: xh, y: yh, z: zh };
}

function getVisiblePlanets(jd, lat, lon) {
  const earthPos = getPlanetPosition('earth', jd);
  const lst = getLocalSiderealTime(jd, lon);
  const visible = [];
  const planetsList = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  
  planetsList.forEach(name => {
    const pos = getPlanetPosition(name, jd);
    const xg = pos.x - earthPos.x;
    const yg = pos.y - earthPos.y;
    const zg = pos.z - earthPos.z;
    
    const obl = 23.44 * Math.PI / 180;
    const x_eq = xg;
    const y_eq = yg * Math.cos(obl) - zg * Math.sin(obl);
    const z_eq = yg * Math.sin(obl) + zg * Math.cos(obl);
    
    const ra = (Math.atan2(y_eq, x_eq) * 180 / Math.PI + 360) % 360;
    const dec = Math.atan2(z_eq, Math.sqrt(x_eq*x_eq + y_eq*y_eq)) * 180 / Math.PI;
    
    const coords = getHorizontalCoordinates(ra, dec, lat, lst);
    if (coords.alt > 0) {
      visible.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        alt: coords.alt,
        az: coords.az,
        direction: getDirection(coords.az),
        quality: getQuality(coords.alt)
      });
    }
  });
  
  visible.sort((a, b) => b.alt - a.alt);
  return visible;
}

// Satellite Propagator
function propagateSatellite(satInfo, time) {
  const epoch = new Date(satInfo.EPOCH);
  const diffDays = (time.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);

  const n = parseFloat(satInfo.MEAN_MOTION); 
  const e = parseFloat(satInfo.ECCENTRICITY);
  const i = parseFloat(satInfo.INCLINATION) * Math.PI / 180;
  const raan = parseFloat(satInfo.RA_OF_ASC_NODE) * Math.PI / 180;
  const ap = parseFloat(satInfo.ARG_OF_PERICENTER) * Math.PI / 180;
  const m0 = parseFloat(satInfo.MEAN_ANOMALY) * Math.PI / 180;

  let m = m0 + n * 2 * Math.PI * diffDays;
  m = m % (2 * Math.PI);
  if (m < 0) m += 2 * Math.PI;

  let E = m;
  for (let k = 0; k < 5; k++) {
    E = E - (E - e * Math.sin(E) - m) / (1 - e * Math.cos(E));
  }

  let a = parseFloat(satInfo.SEMIMAJOR_AXIS);
  if (!a || isNaN(a)) {
    const mu = 398600.4418;
    const nRadPerSec = n * 2 * Math.PI / 86400;
    a = Math.pow(mu / (nRadPerSec * nRadPerSec), 1/3);
  }

  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const xp = a * (cosE - e);
  const yp = a * Math.sqrt(1 - e * e) * sinE;

  const cosRAAN = Math.cos(raan);
  const sinRAAN = Math.sin(raan);
  const cosAP = Math.cos(ap);
  const sinAP = Math.sin(ap);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  const x_eq = xp * (cosAP * cosRAAN - sinAP * sinRAAN * cosI) - yp * (sinAP * cosRAAN + cosAP * sinRAAN * cosI);
  const y_eq = xp * (cosAP * sinRAAN + sinAP * cosRAAN * cosI) - yp * (sinAP * sinRAAN - cosAP * cosRAAN * cosI);
  const z_eq = xp * (sinAP * sinI) + yp * (cosAP * sinI);

  const ra = Math.atan2(y_eq, x_eq);
  const dec = Math.atan2(z_eq, Math.sqrt(x_eq * x_eq + y_eq * y_eq));

  let raDeg = (ra * 180 / Math.PI + 360) % 360;
  let decDeg = dec * 180 / Math.PI;

  const jd = getJulianDate(time);
  const gmst = getLocalSiderealTime(jd, 0);
  let lng = (raDeg - gmst) % 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;
  let lat = decDeg;

  const r_orbit = a * (1 - e * cosE);
  const altitude = r_orbit - 6378.137;
  const radius_scaled = 12 * (r_orbit / 6378.137);

  return { lat, lng, altitude, radius: radius_scaled };
}

function getZenithRadarPanel() {
  return `
    <div class="zenith-radar-dashboard">
      <!-- Section 1: Hero Insight Card -->
      <div class="zenith-hero-card">
        <h2>Your Sky Right Now</h2>
        <div class="hero-grid">
          <div class="hero-item" style="position: relative; overflow: visible;">
            <span class="hero-icon">📍</span>
            <div class="hero-info" style="width: 100%;">
              <span class="label">Location Target</span>
              <div class="location-selector-wrapper">
                <select id="zenith-location-select" class="zenith-select" onchange="window.changeZenithLocation(this.value)">
                  <option value="auto">📍 Auto (GPS/IP)</option>
                  <option value="bangalore">Bangalore, India</option>
                  <option value="tokyo">Tokyo, Japan</option>
                  <option value="london">London, UK</option>
                  <option value="newyork">New York, USA</option>
                  <option value="sydney">Sydney, Australia</option>
                  <option value="cairo">Cairo, Egypt</option>
                  <option value="maunakea">Mauna Kea Observatory</option>
                  <option value="paranal">Paranal Observatory</option>
                  <option value="custom">⚙️ Custom Coords...</option>
                </select>
              </div>
              <div class="custom-coords-form" id="custom-coords-form" style="display: none;">
                <input type="number" id="custom-lat" class="custom-coords-input" placeholder="Lat" step="any" min="-90" max="90" />
                <input type="number" id="custom-lng" class="custom-coords-input" placeholder="Lng" step="any" min="-180" max="180" />
                <button onclick="window.applyCustomZenithLocation()" class="custom-coords-btn">Set</button>
              </div>
              <span id="hero-location-text" style="font-size: 9px; color: #727e87; margin-top: 4px; display: block; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">Auto-detecting...</span>
            </div>
          </div>
          <div class="hero-item">
            <span class="hero-icon">🌙</span>
            <div class="hero-info">
              <span class="label">Moon Phase</span>
              <span class="val" id="hero-moon">Calculating...</span>
            </div>
          </div>
          <div class="hero-item">
            <span class="hero-icon">🪐</span>
            <div class="hero-info">
              <span class="label">Visible Planets</span>
              <span class="val highlight-purple" id="hero-planets">Calculating...</span>
            </div>
          </div>
          <div class="hero-item">
            <span class="hero-icon">⭐</span>
            <div class="hero-info">
              <span class="label">Overhead Constellations</span>
              <span class="val highlight-cyan" id="hero-constellations">Calculating...</span>
            </div>
          </div>
          <div class="hero-item">
            <span class="hero-icon">🛰️</span>
            <div class="hero-info">
              <span class="label">ISS Flyover</span>
              <span class="val highlight-green" id="hero-iss">Calculating...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Interactive Globe View -->
      <div class="zenith-globe-container">
        <div class="zenith-globe-header">
          <div class="radar-sweep-line"></div>
          <span class="globe-title">CELESTIAL EYE // SKY GLOBE</span>
          <div class="globe-status">LIVE TRACKING</div>
        </div>
        <div class="canvas-wrapper">
          <canvas id="zenithGlobeCanvas"></canvas>
          <div id="globeTooltip" class="globe-tooltip" style="display: none; position: absolute; pointer-events: none; z-index: 1000;"></div>
          <div class="globe-telemetry">
            <div class="telemetry-item"><strong>ALT:</strong> <span id="globe-alt">421.4 km</span></div>
            <div class="telemetry-item"><strong>LAT:</strong> <span id="globe-lat">0.0000° N</span></div>
            <div class="telemetry-item"><strong>LNG:</strong> <span id="globe-lng">0.0000° E</span></div>
            <div class="telemetry-item"><strong>SPD:</strong> <span id="globe-spd">27,560 km/h</span></div>
          </div>
        </div>
      </div>

      <!-- Section 3: Sky Above You -->
      <div class="sky-above-you-section">
        <h2>🌌 Sky Above You</h2>
        <div class="sky-cards-grid">
          <div class="sky-card planets-card">
            <h3>🪐 Planets Visible Tonight</h3>
            <div id="planets-list" class="sky-list-container">
              <div style="font-size:11px;color:#727e87;font-family:var(--mono);">Solving planetary orbits...</div>
            </div>
          </div>
          <div class="sky-card constellations-card">
            <h3>⭐ Constellations Overhead</h3>
            <div id="constellations-list" class="sky-list-container">
              <div style="font-size:11px;color:#727e87;font-family:var(--mono);">Solving stellar LST coordinates...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections 4 & 5: ISS Tracker & Moon Observatory -->
      <div class="zenith-detail-row">
        <div class="zenith-detail-card iss-tracker-card">
          <h3>🛰️ ISS Flyover Tracker</h3>
          <div class="widget-data">
            <div class="detail-row">
              <span class="label">ISS Current Status</span>
              <span id="iss-status-val" class="val highlight-green">SCANNING</span>
            </div>
            <div class="detail-row">
              <span class="label">Distance From User</span>
              <span id="iss-distance-val" class="val">Calculating...</span>
            </div>
            <div class="detail-row">
              <span class="label">Next Flyover</span>
              <span id="iss-next-val" class="val highlight-cyan">Estimating...</span>
            </div>
            <div class="detail-row">
              <span class="label">Visibility Probability</span>
              <span id="iss-prob-val" class="val">Calculating...</span>
            </div>
          </div>
          <div class="countdown-container">
            <span class="countdown-label">ISS Flyover In</span>
            <div id="iss-countdown" class="countdown-timer">00:00:00</div>
          </div>
        </div>

        <div class="zenith-detail-card moon-observatory-card">
          <h3>🌙 Moon Observatory</h3>
          <div class="widget-data">
            <div class="detail-row">
              <span class="label">Moon Phase</span>
              <span id="moon-phase-val" class="val highlight-cyan">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Illumination</span>
              <span id="moon-illum-val" class="val">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Moonrise</span>
              <span id="moon-rise-val" class="val">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Moonset</span>
              <span id="moon-set-val" class="val">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Distance</span>
              <span id="moon-dist-val" class="val">384,400 km</span>
            </div>
          </div>
          <p id="moon-desc" class="moon-educational-desc">Estimating synodic lunar parameters...</p>
        </div>
      </div>

      <!-- Sections 6 & 7: Cosmic Guide AI & Tonight's Highlights -->
      <div class="zenith-detail-row">
        <div class="zenith-detail-card ai-guide-card">
          <h3>🤖 Cosmic Guide AI</h3>
          <div class="ai-avatar-container">
            <div class="ai-avatar-glow"></div>
            <span class="ai-title">CELESTIAL COGNITION</span>
          </div>
          <div class="ai-speech-bubble">
            <p id="ai-guidance-text">Scanning the local horizon for astronomical events...</p>
          </div>
        </div>

        <div class="zenith-detail-card highlights-card">
          <h3>⭐ Tonight's Highlights</h3>
          <div class="widget-data" style="height:100%; display:flex; flex-direction:column; justify-content:center;">
            <div class="detail-row">
              <span class="label">Best Object to Observe</span>
              <span id="hl-best-obj" class="val highlight-purple">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Best Time</span>
              <span id="hl-best-time" class="val">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Recommended Direction</span>
              <span id="hl-best-dir" class="val highlight-cyan">--</span>
            </div>
            <div class="detail-row">
              <span class="label">Observation Quality</span>
              <span id="hl-best-quality" class="val highlight-green">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initZenithRadarDashboard() {
  const canvas = document.getElementById('zenithGlobeCanvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;

  // Defaults for ground location coordinates
  currentLat = 12.8230;
  currentLng = 80.0442;
  currentCity = 'Observatory';

  // Initialize Scene, Camera, Renderer
  zenithScene = new THREE.Scene();
  zenithScene.background = null;

  zenithCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  zenithCamera.position.set(0, 30, 50);

  zenithRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  zenithRenderer.setSize(width, height);
  zenithRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls
  zenithControls = new THREE.OrbitControls(zenithCamera, zenithRenderer.domElement);
  zenithControls.enableDamping = true;
  zenithControls.dampingFactor = 0.05;
  zenithControls.maxDistance = 100;
  zenithControls.minDistance = 20;

  // Create Holographic Earth Globe
  const sphereGeom = new THREE.SphereGeometry(12, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  zenithEarthGrid = new THREE.Mesh(sphereGeom, sphereMat);
  zenithScene.add(zenithEarthGrid);

  // Core (solid dark glow inside Earth)
  const coreGeom = new THREE.SphereGeometry(11.8, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x0a1020,
    transparent: true,
    opacity: 0.75
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  zenithEarthGrid.add(core);

  // Add Latitude / Longitude lines
  const gridMat = new THREE.LineBasicMaterial({
    color: 0xb59cff,
    transparent: true,
    opacity: 0.35
  });

  // Latitude rings
  for (let lat = -75; lat <= 75; lat += 15) {
    const r = 12 * Math.cos(lat * Math.PI / 180);
    const y = 12 * Math.sin(lat * Math.PI / 180);
    const points = [];
    for (let theta = 0; theta <= 360; theta += 6) {
      const rad = theta * Math.PI / 180;
      points.push(new THREE.Vector3(r * Math.cos(rad), y, r * Math.sin(rad)));
    }
    const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
    const ringLine = new THREE.Line(ringGeom, gridMat);
    zenithEarthGrid.add(ringLine);
  }

  // Longitude rings
  for (let lon = 0; lon < 180; lon += 30) {
    const points = [];
    for (let theta = 0; theta <= 360; theta += 6) {
      const rad = theta * Math.PI / 180;
      points.push(new THREE.Vector3(
        12 * Math.sin(rad) * Math.cos(lon * Math.PI / 180),
        12 * Math.cos(rad),
        12 * Math.sin(rad) * Math.sin(lon * Math.PI / 180)
      ));
    }
    const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
    const ringLine = new THREE.Line(ringGeom, gridMat);
    zenithEarthGrid.add(ringLine);
  }

  // ISS tracking dot (added to earth grid so it rotates relatively)
  const issGeom = new THREE.SphereGeometry(0.45, 16, 16);
  const issMat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.95
  });
  zenithISS = new THREE.Mesh(issGeom, issMat);
  zenithISS.userData = {
    name: "ISS (ZARYA)",
    type: "Space Station",
    visibility: "Scanning...",
    description: "International Space Station. Fetching active real-time data..."
  };
  zenithEarthGrid.add(zenithISS);

  // Orbit line for ISS (placed in scene, not rotating)
  const issRadius = 17;
  const orbitMat = new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.25
  });
  const issOrbitPoints = [];
  const inclination = 51.64 * Math.PI / 180;
  for (let theta = 0; theta <= 360; theta += 2) {
    const rad = theta * Math.PI / 180;
    const x = issRadius * Math.cos(rad);
    const y = issRadius * Math.sin(rad) * Math.sin(inclination);
    const z = issRadius * Math.sin(rad) * Math.cos(inclination);
    issOrbitPoints.push(new THREE.Vector3(x, y, z));
  }
  const issOrbitGeom = new THREE.BufferGeometry().setFromPoints(issOrbitPoints);
  zenithOrbitLine = new THREE.Line(issOrbitGeom, orbitMat);
  zenithScene.add(zenithOrbitLine);

  // Satellites tracking arrays
  zenithSatellites = [];
  const satColors = [0x00ffaa, 0x00f3ff, 0xb59cff];

  // Helper to place objects on spherical coordinates relative to Earth
  function getSphericalVector(lat, lng, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    
    const x = -(radius * Math.sin(phi) * Math.sin(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    return new THREE.Vector3(x, y, z);
  }

  // Calculate ground user to ISS 3D distance
  function calculateDistanceToISS(issLat, issLng, issAlt) {
    const R_E = 6378.137; // Earth radius in km
    const lat1 = currentLat * Math.PI / 180;
    const lon1 = currentLng * Math.PI / 180;
    const lat2 = issLat * Math.PI / 180;
    const lon2 = issLng * Math.PI / 180;

    const x1 = R_E * Math.cos(lat1) * Math.cos(lon1);
    const y1 = R_E * Math.cos(lat1) * Math.sin(lon1);
    const z1 = R_E * Math.sin(lat1);

    const r2 = R_E + issAlt;
    const x2 = r2 * Math.cos(lat2) * Math.cos(lon2);
    const y2 = r2 * Math.cos(lat2) * Math.sin(lon2);
    const z2 = r2 * Math.sin(lat2);

    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2);
  }

  // Interactive Raycasting Tooltip Setup
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltipEl = document.getElementById('globeTooltip');

  const onPointerMove = (event) => {
    if (!canvas || !zenithCamera || !zenithScene) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, zenithCamera);
    const intersects = raycaster.intersectObjects(zenithEarthGrid.children, true);

    let hoveredObj = null;
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj) {
        if (obj.userData && obj.userData.name) {
          hoveredObj = obj.userData;
          break;
        }
        obj = obj.parent;
      }
      if (hoveredObj) break;
    }

    if (hoveredObj && tooltipEl) {
      tooltipEl.style.display = 'block';
      tooltipEl.style.left = `${event.clientX - rect.left + 15}px`;
      tooltipEl.style.top = `${event.clientY - rect.top + 15}px`;
      tooltipEl.innerHTML = `
        <div style="font-weight:700;color:#00f3ff;margin-bottom:4px;text-transform:uppercase;">${hoveredObj.name}</div>
        <div style="font-size:9px;color:#b59cff;margin-bottom:6px;font-family:var(--mono);">${hoveredObj.type} // ${hoveredObj.visibility}</div>
        <div style="line-height:1.3;color:#dfe6e2;">${hoveredObj.description}</div>
      `;
      canvas.style.cursor = 'pointer';
    } else if (tooltipEl) {
      tooltipEl.style.display = 'none';
      canvas.style.cursor = 'grab';
    }
  };

  canvas.addEventListener('pointermove', onPointerMove);

  // Perform Calculations
  function runAstronomicalCalculations(lat, lon) {
    const today = new Date();
    const jd = getJulianDate(today);
    
    // 1. Planets
    const visiblePlanets = getVisiblePlanets(jd, lat, lon);
    const planetsListEl = document.getElementById('planets-list');
    const heroPlanetsEl = document.getElementById('hero-planets');
    
    if (planetsListEl) {
      if (visiblePlanets.length === 0 || visiblePlanets[0] === 'None visible') {
        planetsListEl.innerHTML = `<div style="font-size:11px;color:#727e87;font-family:var(--mono);padding: 8px;">No planets visible tonight</div>`;
        if (heroPlanetsEl) heroPlanetsEl.textContent = 'None Visible';
      } else {
        planetsListEl.innerHTML = visiblePlanets.map(p => `
          <div class="celestial-item">
            <div class="celestial-meta">
              <span class="celestial-name">🪐 ${p.name}</span>
              <span class="celestial-details">${p.direction} sky // Alt: ${Math.round(p.alt)}°</span>
            </div>
            <div class="celestial-action">
              <span class="celestial-quality ${p.quality.toLowerCase()}">${p.quality}</span>
              <button class="learn-more-btn" onclick="showZenithInfoModal('${p.name}', 'Planet')">Info</button>
            </div>
          </div>
        `).join('');
        if (heroPlanetsEl) heroPlanetsEl.textContent = `${visiblePlanets.length} Planets`;
      }
    }

    // 2. Constellations
    const visibleConsts = getVisibleConstellations(jd, lat, lon);
    const constsListEl = document.getElementById('constellations-list');
    const heroConstsEl = document.getElementById('hero-constellations');
    
    if (constsListEl) {
      if (visibleConsts.length === 0) {
        constsListEl.innerHTML = `<div style="font-size:11px;color:#727e87;font-family:var(--mono);padding: 8px;">No constellations visible</div>`;
        if (heroConstsEl) heroConstsEl.textContent = 'None';
      } else {
        constsListEl.innerHTML = visibleConsts.map(c => `
          <div class="celestial-item">
            <div class="celestial-meta">
              <span class="celestial-name">⭐ ${c.name}</span>
              <span class="celestial-details">${c.direction} sky // Alt: ${Math.round(c.alt)}°</span>
            </div>
            <div class="celestial-action">
              <span class="celestial-quality ${c.quality.toLowerCase()}">${c.quality}</span>
              <button class="learn-more-btn" onclick="showZenithInfoModal('${c.name}', 'Constellation')">Info</button>
            </div>
          </div>
        `).join('');
        if (heroConstsEl) heroConstsEl.textContent = visibleConsts.map(c => c.name).slice(0, 2).join(', ');
      }
    }

    // 3. Sky Highlights & recommendations
    const hlBestObjEl = document.getElementById('hl-best-obj');
    const hlBestTimeEl = document.getElementById('hl-best-time');
    const hlBestDirEl = document.getElementById('hl-best-dir');
    const hlBestQualityEl = document.getElementById('hl-best-quality');
    
    let bestObj = 'The Moon';
    let bestDir = 'East';
    let bestQual = 'Excellent';
    
    if (visiblePlanets.length > 0) {
      bestObj = visiblePlanets[0].name;
      bestDir = visiblePlanets[0].direction;
      bestQual = visiblePlanets[0].quality;
    } else if (visibleConsts.length > 0) {
      bestObj = visibleConsts[0].name;
      bestDir = visibleConsts[0].direction;
      bestQual = visibleConsts[0].quality;
    }
    
    if (hlBestObjEl) hlBestObjEl.textContent = bestObj;
    if (hlBestTimeEl) {
      const bestHour = (today.getHours() + 1) % 24;
      hlBestTimeEl.textContent = `${bestHour % 12 || 12}:00 ${bestHour >= 12 ? 'PM' : 'AM'}`;
    }
    if (hlBestDirEl) hlBestDirEl.textContent = bestDir;
    if (hlBestQualityEl) {
      hlBestQualityEl.textContent = bestQual;
      hlBestQualityEl.className = `val highlight-${bestQual === 'Excellent' ? 'green' : (bestQual === 'Good' ? 'cyan' : 'purple')}`;
    }
    
    // 4. Cosmic Guide AI insights
    const aiTextEl = document.getElementById('ai-guidance-text');
    if (aiTextEl) {
      const insights = [];
      if (visiblePlanets.length > 0) {
        insights.push(`🪐 Planet Alert: ${visiblePlanets[0].name} is visible in the ${visiblePlanets[0].direction} with ${visiblePlanets[0].quality.toLowerCase()} clarity.`);
      }
      if (visibleConsts.length > 0) {
        insights.push(`⭐ Stellar Hunt: Look toward the ${visibleConsts[0].direction} sky to spot the bright stars of the ${visibleConsts[0].name} constellation.`);
      }
      
      const moonPhaseEl = document.getElementById('moon-phase-val');
      let moonPhaseStr = 'Crescent';
      if (moonPhaseEl && moonPhaseEl.textContent) {
        moonPhaseStr = moonPhaseEl.textContent;
      }
      
      if (moonPhaseStr.includes('Crescent') || moonPhaseStr.includes('New')) {
        insights.push(`🌙 Dark Sky Opportunity: The low lunar illumination provides a perfect, low-glow window for viewing deep sky objects.`);
      } else {
        insights.push(`🌕 Lunar Spotlight: Tonight's bright moon is prime for observing lunar details like the crater Tycho.`);
      }
      
      aiTextEl.innerHTML = insights.join('<br><br>');
    }
  }

  // Geolocation detection including IP Fallback
  function initLocationAndCalculations() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLat = position.coords.latitude;
          currentLng = position.coords.longitude;
          currentCity = 'Ground Station';
          
          updateLocationUI();
          createGroundStationMarker();
          runAstronomicalCalculations(currentLat, currentLng);
        },
        () => {
          fetchIPLocation();
        }
      );
    } else {
      fetchIPLocation();
    }
  }

  function fetchIPLocation() {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          currentLat = data.latitude;
          currentLng = data.longitude;
          currentCity = data.city || 'Ground Station';
          
          updateLocationUI();
          createGroundStationMarker();
          runAstronomicalCalculations(currentLat, currentLng);
        } else {
          useObservatoryFallback();
        }
      })
      .catch(() => {
        useObservatoryFallback();
      });
  }

  function useObservatoryFallback() {
    currentLat = 12.8230;
    currentLng = 80.0442;
    currentCity = 'SRM Observatory';
    
    updateLocationUI();
    createGroundStationMarker();
    runAstronomicalCalculations(currentLat, currentLng);
  }

  function updateLocationUI() {
    const textEl = document.getElementById('hero-location-text');
    if (textEl) {
      const latStr = `${Math.abs(currentLat).toFixed(2)}°${currentLat >= 0 ? 'N' : 'S'}`;
      const lngStr = `${Math.abs(currentLng).toFixed(2)}°${currentLng >= 0 ? 'E' : 'W'}`;
      textEl.textContent = `${currentCity} (${latStr}, ${lngStr})`;
    }
  }

  // Ground station cone marker on Earth
  function createGroundStationMarker() {
    if (zenithGroundStation) zenithEarthGrid.remove(zenithGroundStation);
    
    const coneGeom = new THREE.ConeGeometry(0.3, 1.2, 8);
    coneGeom.rotateX(Math.PI / 2);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.9
    });
    zenithGroundStation = new THREE.Mesh(coneGeom, coneMat);
    
    const pos = getSphericalVector(currentLat, currentLng, 12);
    zenithGroundStation.position.copy(pos);
    zenithGroundStation.lookAt(new THREE.Vector3(0, 0, 0));
    zenithGroundStation.rotateY(Math.PI);
    
    zenithGroundStation.userData = {
      name: `${currentCity} Observatory`,
      type: "Ground Station Location",
      visibility: "Station Base",
      description: `Ground coordinates: ${Math.abs(currentLat).toFixed(4)}° ${currentLat >= 0 ? 'N' : 'S'}, ${Math.abs(currentLng).toFixed(4)}° ${currentLng >= 0 ? 'E' : 'W'}.`
    };
    
    zenithEarthGrid.add(zenithGroundStation);
  }

  // ISS live telemetry API integration
  function fetchISSTelemetry() {
    const updateISSCoords = (lat, lng, alt, vel) => {
      lastISSLat = lat;
      lastISSLng = lng;
      lastISSAlt = alt;

      // Update UI metrics
      const altEl = document.getElementById('globe-alt');
      const spdEl = document.getElementById('globe-spd');
      const latEl = document.getElementById('globe-lat');
      const lngEl = document.getElementById('globe-lng');
      const distEl = document.getElementById('iss-distance-val');
      const statusEl = document.getElementById('iss-status-val');
      const nextEl = document.getElementById('iss-next-val');
      const probEl = document.getElementById('iss-prob-val');

      const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
      const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;

      if (altEl) altEl.textContent = `${alt.toFixed(1)} km`;
      if (spdEl) spdEl.textContent = `${Math.round(vel).toLocaleString()} km/h`;
      if (latEl) latEl.textContent = latStr;
      if (lngEl) lngEl.textContent = lngStr;

      // Calculate 3D distance
      const distance = calculateDistanceToISS(lat, lng, alt);
      if (distEl) distEl.textContent = `${Math.round(distance).toLocaleString()} km`;

      // Status & probability
      if (distance < 2500) {
        if (statusEl) {
          statusEl.textContent = 'OVER HORIZON';
          statusEl.className = 'val highlight-green';
        }
        if (probEl) {
          probEl.textContent = 'Excellent (Visible)';
          probEl.className = 'val highlight-green';
        }
        if (nextEl) {
          nextEl.textContent = 'In Progress';
          nextEl.className = 'val highlight-cyan';
        }
        secondsRemaining = 0;
      } else {
        if (statusEl) {
          statusEl.textContent = 'BELOW HORIZON';
          statusEl.className = 'val';
        }
        if (probEl) {
          probEl.textContent = distance < 5000 ? 'Low / Horizon' : 'Invisible';
          probEl.className = 'val';
        }
        if (nextEl) {
          nextEl.textContent = 'Orbital Transit';
          nextEl.className = 'val';
        }
        
        // Recalculate countdown if zero
        if (secondsRemaining <= 0) {
          const lat1 = currentLat * Math.PI / 180;
          const lon1 = currentLng * Math.PI / 180;
          const lat2 = lat * Math.PI / 180;
          const lon2 = lng * Math.PI / 180;
          const angularSeparation = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2 - lon1));
          const speedRadPerSec = (2 * Math.PI) / (92.9 * 60);
          secondsRemaining = Math.floor(angularSeparation / speedRadPerSec);
        }
      }

      // Set 3D tracker position (added to earth grid)
      const R = 12 + (alt - 380) / 100 * 1.5;
      const pos = getSphericalVector(lat, lng, R);
      if (zenithISS) {
        zenithISS.position.copy(pos);
        zenithISS.userData = {
          name: "ISS (ZARYA)",
          type: "Space Station",
          visibility: distance < 2500 ? "Visible overhead" : "Below horizon",
          description: `International Space Station. Distance: ${Math.round(distance).toLocaleString()} km. Altitude: ${alt.toFixed(1)} km. Speed: ${Math.round(vel).toLocaleString()} km/h.`
        };
      }
    };

    fetch('https://api.wheretheiss.at/v1/satellites/25544')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          updateISSCoords(
            parseFloat(data.latitude),
            parseFloat(data.longitude),
            parseFloat(data.altitude),
            parseFloat(data.velocity)
          );
        }
      })
      .catch(err => {
        console.warn('ISS Live API failed, using Keplerian failover:', err);
        if (window.issOrbitalElements) {
          const prop = propagateSatellite(window.issOrbitalElements, new Date());
          updateISSCoords(prop.lat, prop.lng, prop.altitude, 27560);
        } else {
          updateISSCoords(0, 0, 421.4, 27560);
        }
      });
  }

  // Celestrak live satellites API integration
  function fetchSatelliteRegistry() {
    fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const activeCount = data.length;
          
          // Filter out ISS
          const listSats = data.filter(sat => sat.NORAD_CAT_ID !== 25544).slice(0, 6);
          
          // Save ISS elements for failover
          const issGP = data.find(sat => sat.NORAD_CAT_ID === 25544);
          if (issGP) {
            window.issOrbitalElements = issGP;
          }

          // Remove old satellite meshes/groups
          zenithSatellites.forEach(s => {
            zenithEarthGrid.remove(s.group);
            if (s.orbitLine) zenithEarthGrid.remove(s.orbitLine);
          });
          zenithSatellites = [];

          // Map 6 bright visual satellites with real Keplerian orbits
          listSats.forEach((satInfo, idx) => {
            const satGroup = new THREE.Group();

            // Core visible dot
            const satGeom = new THREE.SphereGeometry(0.25, 8, 8);
            const satMat = new THREE.MeshBasicMaterial({
              color: satColors[idx % satColors.length],
              transparent: true,
              opacity: 0.85
            });
            const satMesh = new THREE.Mesh(satGeom, satMat);
            satGroup.add(satMesh);

            // Bounding hover target for raycasting
            const hoverGeom = new THREE.SphereGeometry(1.5, 8, 8);
            const hoverMat = new THREE.MeshBasicMaterial({
              visible: false,
              transparent: true,
              opacity: 0
            });
            const hoverMesh = new THREE.Mesh(hoverGeom, hoverMat);
            
            hoverMesh.userData = {
              name: satInfo.OBJECT_NAME || "Satellite",
              type: "Satellite",
              visibility: "Partially Visible",
              description: `NORAD ID: ${satInfo.NORAD_CAT_ID}. Orbit Inclination: ${satInfo.INCLINATION}°. Period: ${satInfo.PERIOD || (92.9).toFixed(1)} mins. Propagated in real-time.`
            };
            satGroup.add(hoverMesh);

            // Orbit path circle
            const incl = parseFloat(satInfo.INCLINATION) * Math.PI / 180;
            const raan = parseFloat(satInfo.RA_OF_ASC_NODE) * Math.PI / 180;
            const ap = parseFloat(satInfo.ARG_OF_PERICENTER) * Math.PI / 180;
            const e = parseFloat(satInfo.ECCENTRICITY);
            let a = parseFloat(satInfo.SEMIMAJOR_AXIS);
            if (!a || isNaN(a)) {
              const mu = 398600.4418;
              const nRadPerSec = parseFloat(satInfo.MEAN_MOTION) * 2 * Math.PI / 86400;
              a = Math.pow(mu / (nRadPerSec * nRadPerSec), 1/3);
            }
            const scaleA = 12 * (a / 6378.137);

            const orbitMat = new THREE.LineBasicMaterial({
              color: satColors[idx % satColors.length],
              transparent: true,
              opacity: 0.12
            });
            const points = [];
            for (let theta = 0; theta <= 360; theta += 3) {
              const rad = theta * Math.PI / 180;
              const xp = scaleA * (Math.cos(rad) - e);
              const yp = scaleA * Math.sqrt(1 - e * e) * Math.sin(rad);
              
              const cosRAAN = Math.cos(raan);
              const sinRAAN = Math.sin(raan);
              const cosAP = Math.cos(ap);
              const sinAP = Math.sin(ap);
              const cosI = Math.cos(incl);
              const sinI = Math.sin(incl);

              const x_eq = xp * (cosAP * cosRAAN - sinAP * sinRAAN * cosI) - yp * (sinAP * cosRAAN + cosAP * sinRAAN * cosI);
              const y_eq = xp * (cosAP * sinRAAN + sinAP * cosRAAN * cosI) - yp * (sinAP * sinRAAN - cosAP * cosRAAN * cosI);
              const z_eq = xp * (sinAP * sinI) + yp * (cosAP * sinI);

              points.push(new THREE.Vector3(x_eq, y_eq, z_eq));
            }
            const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);
            const orbitLine = new THREE.Line(orbitGeom, orbitMat);
            zenithEarthGrid.add(orbitLine);

            // Calculate initial position
            const prop = propagateSatellite(satInfo, new Date());
            const pos = getSphericalVector(prop.lat, prop.lng, prop.radius);
            satGroup.position.copy(pos);

            zenithEarthGrid.add(satGroup);
            zenithSatellites.push({
              group: satGroup,
              info: satInfo,
              orbitLine: orbitLine,
              lat: prop.lat,
              lng: prop.lng,
              radius: prop.radius
            });
          });
        }
      })
      .catch(err => {
        console.error('Celestrak API Error:', err);
      });
  }

  // Initial runs
  initLocationAndCalculations();
  fetchISSTelemetry();
  fetchSatelliteRegistry();

  // Set intervals and intervals cleanup
  const issInterval = setInterval(fetchISSTelemetry, 5000);
  
  // Update moon phase metrics
  try {
    const today = new Date();
    const jd = getJulianDate(today);
    
    // High-precision Meeus synodic moon phase calculations
    const jd0 = 2451401.9638889; 
    const synodicPeriod = 29.530588853; 
    let age = (jd - jd0) % synodicPeriod;
    if (age < 0) age += synodicPeriod;
    
    let phaseName = 'New Moon';
    let phaseIcon = '🌑';
    let moonDesc = '';
    
    if (age < 1.845) {
      phaseName = 'New Moon';
      phaseIcon = '🌑';
      moonDesc = 'New Moon: The moon is between Earth and Sun, rendering it invisible to the naked eye. Excellent night for stargazing.';
    } else if (age < 5.536) {
      phaseName = 'Waxing Crescent';
      phaseIcon = '🌒';
      moonDesc = 'Waxing Crescent: A sliver of the illuminated moon appears in the west after sunset. Ideal for viewing edge-lit craters.';
    } else if (age < 9.228) {
      phaseName = 'First Quarter';
      phaseIcon = '🌓';
      moonDesc = 'First Quarter: Exactly half of the moon is lit. Craters along the terminator line (day/night boundary) look extremely sharp.';
    } else if (age < 12.92) {
      phaseName = 'Waxing Gibbous';
      phaseIcon = '🌔';
      moonDesc = 'Waxing Gibbous: Most of the moon is lit, growing brighter daily. Features like Copernicus Crater stand out.';
    } else if (age < 16.611) {
      phaseName = 'Full Moon';
      phaseIcon = '🌕';
      moonDesc = 'Full Moon: The moon is fully lit. Ideal for observing ray structures like Tycho, but brightness washes out surrounding stars.';
    } else if (age < 20.302) {
      phaseName = 'Waning Gibbous';
      phaseIcon = '🌖';
      moonDesc = 'Waning Gibbous: Illumination decreases. Best viewed late at night or in the early morning sky.';
    } else if (age < 23.994) {
      phaseName = 'Last Quarter';
      phaseIcon = '🌗';
      moonDesc = 'Last Quarter: The left half of the moon is lit, rising around midnight and setting at noon.';
    } else if (age < 27.685) {
      phaseName = 'Waning Crescent';
      phaseIcon = '🌘';
      moonDesc = 'Waning Crescent: A thin sliver of light in the morning sky. Minimal light interference for deep-sky observation.';
    } else {
      phaseName = 'New Moon';
      phaseIcon = '🌑';
      moonDesc = 'New Moon: The moon is between Earth and Sun. Perfect dark skies for observing distant stars and nebulae.';
    }

    const phaseAngle = (age / synodicPeriod) * 2 * Math.PI;
    const illumination = 100 * (1 - Math.cos(phaseAngle)) / 2;

    const riseHour = (6 + (age / synodicPeriod) * 24) % 24;
    const setHour = (riseHour + 12) % 24;

    const formatTime = (decimalHours) => {
      const h = Math.floor(decimalHours);
      const m = Math.floor((decimalHours - h) * 60);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const jd_p = 2451408.917; 
    const anomalisticMonth = 27.55455; 
    const meanAnomaly = ((jd - jd_p) / anomalisticMonth) * 2 * Math.PI;
    const distanceKm = 384400 - 21000 * Math.cos(meanAnomaly);

    const phaseEl = document.getElementById('moon-phase-val');
    const illumEl = document.getElementById('moon-illum-val');
    const riseEl = document.getElementById('moon-rise-val');
    const setEl = document.getElementById('moon-set-val');
    const distEl = document.getElementById('moon-dist-val');
    const descEl = document.getElementById('moon-desc');
    const heroMoonEl = document.getElementById('hero-moon');

    if (phaseEl) phaseEl.textContent = `${phaseIcon} ${phaseName}`;
    if (illumEl) illumEl.textContent = `${Math.round(illumination)}%`;
    if (riseEl) riseEl.textContent = formatTime(riseHour);
    if (setEl) setEl.textContent = formatTime(setHour);
    if (distEl) distEl.textContent = `${Math.round(distanceKm).toLocaleString()} km`;
    if (descEl) descEl.textContent = moonDesc;
    
    if (heroMoonEl) {
      heroMoonEl.textContent = `${phaseName} (${Math.round(illumination)}%)`;
    }
  } catch (err) {
    console.error('Error setting moon phase:', err);
  }

  // Ticking countdown timer setup
  secondsRemaining = 2100; // default 35 mins
  function tickCountdown() {
    if (secondsRemaining > 0) {
      secondsRemaining--;
    } else {
      secondsRemaining = Math.floor(Math.random() * 60) + 45 * 60;
    }
    
    const cdEl = document.getElementById('iss-countdown');
    const heroIssEl = document.getElementById('hero-iss');
    const distEl = document.getElementById('iss-distance-val');
    
    let distVal = 4000;
    if (distEl && distEl.textContent) {
      distVal = parseFloat(distEl.textContent.replace(/,/g, ''));
    }
    
    if (distVal < 2500) {
      if (cdEl) {
        cdEl.textContent = "ACTIVE FLYOVER";
        cdEl.style.color = "#00ffaa";
        cdEl.style.textShadow = "0 0 10px rgba(0, 255, 170, 0.4)";
      }
      if (heroIssEl) {
        heroIssEl.textContent = `Flyover Active (${Math.round(distVal)} km)`;
        heroIssEl.className = "val highlight-green";
      }
    } else {
      const h = Math.floor(secondsRemaining / 3600);
      const m = Math.floor((secondsRemaining % 3600) / 60);
      const s = secondsRemaining % 60;
      const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      
      if (cdEl) {
        cdEl.textContent = timeStr;
        cdEl.style.color = "#ff00ff";
        cdEl.style.textShadow = "0 0 10px rgba(255, 0, 255, 0.4)";
      }
      if (heroIssEl) {
        heroIssEl.textContent = `${m}m ${s}s remaining`;
        heroIssEl.className = "val highlight-green";
      }
    }
  }
  
  issCountdownInterval = setInterval(tickCountdown, 1000);

  // Telemetry animation loop
  function animateZenith() {
    zenithAnimationFrame = requestAnimationFrame(animateZenith);
    
    // Rotate Earth grid
    if (zenithEarthGrid) {
      zenithEarthGrid.rotation.y += 0.0012;
      zenithEarthGrid.rotation.x = 0.08;
    }

    // Animate and propagate Keplerian satellites
    const now = new Date();
    zenithSatellites.forEach(sat => {
      const prop = propagateSatellite(sat.info, now);
      sat.lat = prop.lat;
      sat.lng = prop.lng;
      sat.radius = prop.radius;
      const pos = getSphericalVector(prop.lat, prop.lng, prop.radius);
      sat.group.position.copy(pos);
    });

    if (zenithControls) zenithControls.update();
    if (zenithRenderer && zenithScene && zenithCamera) {
      zenithRenderer.render(zenithScene, zenithCamera);
    }
  }

  animateZenith();

  // Resize handler for canvas
  const handleResize = () => {
    if (!canvas || !zenithRenderer || !zenithCamera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    zenithCamera.aspect = w / h;
    zenithCamera.updateProjectionMatrix();
    zenithRenderer.setSize(w, h);
  };
  
  window.addEventListener('resize', handleResize);

  // Window-level location change handlers
  window.changeZenithLocation = function(val) {
    const customForm = document.getElementById('custom-coords-form');
    if (val === 'custom') {
      if (customForm) customForm.style.display = 'flex';
    } else {
      if (customForm) customForm.style.display = 'none';
      if (val === 'auto') {
        initLocationAndCalculations();
      } else {
        const presets = {
          bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore Observatory' },
          tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo Observatory' },
          london: { lat: 51.5074, lng: -0.1278, name: 'Greenwich Observatory' },
          newyork: { lat: 40.7128, lng: -74.0060, name: 'New York Observatory' },
          sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney Observatory' },
          cairo: { lat: 30.0444, lng: 31.2357, name: 'Cairo Observatory' },
          maunakea: { lat: 19.8206, lng: -155.4681, name: 'Mauna Kea Observatory' },
          paranal: { lat: -24.6275, lng: -70.4042, name: 'Paranal Observatory' }
        };
        const loc = presets[val];
        if (loc) {
          currentLat = loc.lat;
          currentLng = loc.lng;
          currentCity = loc.name;
          updateLocationUI();
          createGroundStationMarker();
          runAstronomicalCalculations(currentLat, currentLng);
        }
      }
    }
  };

  window.applyCustomZenithLocation = function() {
    const latInput = document.getElementById('custom-lat');
    const lngInput = document.getElementById('custom-lng');
    if (!latInput || !lngInput) return;
    
    const latVal = parseFloat(latInput.value);
    const lngVal = parseFloat(lngInput.value);
    
    if (isNaN(latVal) || isNaN(lngVal) || latVal < -90 || latVal > 90 || lngVal < -180 || lngVal > 180) {
      alert("Please enter a valid Latitude (-90 to 90) and Longitude (-180 to 180)");
      return;
    }
    
    currentLat = latVal;
    currentLng = lngVal;
    currentCity = 'Custom Base';
    updateLocationUI();
    createGroundStationMarker();
    runAstronomicalCalculations(currentLat, currentLng);
  };
  
  // Clean up animation frame, intervals, and event listener when the panel is closed or content destroyed
  const cleanupObserver = new MutationObserver(() => {
    if (!document.getElementById('zenithGlobeCanvas')) {
      cancelAnimationFrame(zenithAnimationFrame);
      clearInterval(issInterval);
      clearInterval(issCountdownInterval);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      delete window.changeZenithLocation;
      delete window.applyCustomZenithLocation;
      cleanupObserver.disconnect();
    }
  });
  cleanupObserver.observe(canvas.parentElement.parentElement, { childList: true });
}


