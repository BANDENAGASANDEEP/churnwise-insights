
document.addEventListener('DOMContentLoaded', function() {
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  // Dashboard slide navigation
  const slideNavBtns = document.querySelectorAll('.slide-nav-btn');
  const slides = document.querySelectorAll('.dashboard-section');
  const slideIndicators = document.querySelectorAll('.slide-indicator');

  if (slideNavBtns.length > 0) {
    slideNavBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const slideIndex = parseInt(this.dataset.slide);
        switchSlide(slideIndex);
      });
    });

    function switchSlide(index) {
      // Update nav buttons
      slideNavBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.slide) === index) {
          btn.classList.add('active');
        }
      });

      // Update slide indicators
      slideIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (parseInt(indicator.dataset.slide) === index) {
          indicator.classList.add('active');
        }
      });

      // Update slides
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      slides[index].classList.add('active');
    }
  }

  // User menu toggle
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userMenu = document.getElementById('userMenu');
  
  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', function() {
      userMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add('hidden');
      }
    });
  }

  // Chatbot functionality
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbot = document.getElementById('chatbot');
  const closeChatbot = document.getElementById('closeChatbot');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendMessage = document.getElementById('sendMessage');

  if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener('click', function() {
      chatbot.classList.toggle('hidden');
      if (!chatbot.classList.contains('hidden') && chatInput) {
        chatInput.focus();
      }
    });

    if (closeChatbot) {
      closeChatbot.addEventListener('click', function() {
        chatbot.classList.add('hidden');
      });
    }

    // Send chat message
    if (sendMessage && chatInput && chatMessages) {
      const sendChatMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
          // Add user message
          addMessage(message, 'user');
          chatInput.value = '';
          
          // Show typing indicator
          showTypingIndicator();
          
          // Simulate bot response after delay
          setTimeout(() => {
            removeTypingIndicator();
            const responses = [
              "Based on our data, customers with similar profiles have a 35% churn probability.",
              "The most effective retention strategy for this scenario is offering a contract upgrade discount.",
              "I'd recommend reviewing the customer's recent usage patterns for more insights.",
              "This customer segment has responded well to family plan upgrades in the past.",
              "Our predictive model suggests focusing on service quality improvements rather than price discounts for this customer."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
          }, 1500);
        }
      };

      sendMessage.addEventListener('click', sendChatMessage);
      
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendChatMessage();
        }
      });

      function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `chat-message-${sender}`);
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'chat-message-bot', 'typing-indicator');
        typingDiv.innerHTML = `
          <div class="typing-animation">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
      }
    }
  }

  // Customer search functionality
  const searchCustomerBtn = document.getElementById('searchCustomerBtn');
  const customerIdInput = document.getElementById('customerId');
  const customerProfile = document.getElementById('customerProfile');

  if (searchCustomerBtn && customerIdInput) {
    searchCustomerBtn.addEventListener('click', function() {
      const customerId = customerIdInput.value.trim();
      if (customerId) {
        // Show customer profile (already visible in HTML)
        if (customerProfile) {
          customerProfile.classList.add('animate-fade-in');
          setTimeout(() => {
            customerProfile.classList.remove('animate-fade-in');
          }, 500);
        }
      }
    });
  }

  // Churn prediction form
  const churnPredictionForm = document.getElementById('churnPredictionForm');
  const noPrediction = document.getElementById('noPrediction');
  const predictionResult = document.getElementById('predictionResult');
  const churnRiskMeter = document.getElementById('churnRiskMeter');
  const churnPercentage = document.getElementById('churnPercentage');
  const riskLabel = document.getElementById('riskLabel');

  if (churnPredictionForm && noPrediction && predictionResult) {
    churnPredictionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hide "no prediction" message
      noPrediction.style.display = 'none';
      
      // Show prediction results
      predictionResult.classList.remove('hidden');
      
      // Generate random churn percentage for demo
      const randomPercentage = Math.floor(Math.random() * 100);
      
      // Update risk meter
      if (churnRiskMeter && churnPercentage) {
        churnRiskMeter.setAttribute('stroke-dasharray', `${randomPercentage}, 100`);
        churnPercentage.textContent = `${randomPercentage}%`;
        
        // Update color and risk label
        if (randomPercentage < 30) {
          churnRiskMeter.classList.remove('text-yellow-500', 'text-destructive');
          churnRiskMeter.classList.add('text-green-500');
          
          if (riskLabel) {
            riskLabel.className = 'bg-green-500/10 text-green-500 px-4 py-2 rounded-md inline-block mt-4';
            riskLabel.querySelector('span').textContent = 'Low Risk of Churn';
          }
        } else if (randomPercentage < 70) {
          churnRiskMeter.classList.remove('text-green-500', 'text-destructive');
          churnRiskMeter.classList.add('text-yellow-500');
          
          if (riskLabel) {
            riskLabel.className = 'bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-md inline-block mt-4';
            riskLabel.querySelector('span').textContent = 'Medium Risk of Churn';
          }
        } else {
          churnRiskMeter.classList.remove('text-green-500', 'text-yellow-500');
          churnRiskMeter.classList.add('text-destructive');
          
          if (riskLabel) {
            riskLabel.className = 'bg-destructive/10 text-destructive px-4 py-2 rounded-md inline-block mt-4';
            riskLabel.querySelector('span').textContent = 'High Risk of Churn';
          }
        }
      }
    });
  }

  // Initialize charts if we're on the dashboard
  if (document.getElementById('churnTrendChart')) {
    initializeCharts();
  }

  function initializeCharts() {
    // Churn Rate Trend Chart
    const churnTrendCtx = document.getElementById('churnTrendChart').getContext('2d');
    const churnTrendChart = new Chart(churnTrendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Churn Rate (%)',
          data: [5.2, 5.8, 5.4, 5.9, 5.7, 6.1, 5.6, 5.3, 4.9, 4.8, 4.6, 4.5],
          borderColor: 'hsl(221, 83%, 53%)',
          backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 4,
            max: 7
          }
        }
      }
    });

    // Churn Reasons Chart
    const churnReasonsCtx = document.getElementById('churnReasonsChart').getContext('2d');
    const churnReasonsChart = new Chart(churnReasonsCtx, {
      type: 'bar',
      data: {
        labels: ['Price', 'Competitor', 'Service Quality', 'Coverage', 'Moving', 'Other'],
        datasets: [{
          label: 'Percentage',
          data: [38, 25, 15, 12, 7, 3],
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(234, 179, 8, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Customer Segments Chart
    const customerSegmentsCtx = document.getElementById('customerSegmentsChart').getContext('2d');
    const customerSegmentsChart = new Chart(customerSegmentsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
          label: 'Customers',
          data: [65, 23, 12],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(234, 179, 8, 0.7)', 
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
});
