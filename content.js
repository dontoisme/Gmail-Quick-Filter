let selectedEmail = '';

function getSelectedEmail() {
  const selectedCheckbox = document.querySelector('.oZ-jc.T-Jo.J-J5-Ji.T-Jo-Jp');
  
  if (selectedCheckbox) {
    const emailRow = selectedCheckbox.closest('tr');
    
    if (emailRow) {
      // Read and unread emails.
      const emailCandidates = [
        emailRow.querySelector('.bA4 .yP'),
        emailRow.querySelector('.yW .zF'),
        emailRow.querySelector('.ag.a8k'),
        emailRow.querySelector('.bA4 .zF'),
      ];

      for (let candidate of emailCandidates) {
        if (candidate) {
          const email = candidate.getAttribute('email') || candidate.textContent.trim();
          if (email && email.includes('@')) {
            return email;
          }
        }
      }
    }
  }

  // For open email view - try multiple selectors
  const emailSelectors = [
    'span.gD[email]',
    'span[email][data-hovercard-id]',
    'span.go'
  ];
  
  for (let selector of emailSelectors) {
    const emailElement = document.querySelector(selector);
    if (emailElement) {
      const email = emailElement.getAttribute('email') || emailElement.textContent.trim();
      if (email && email.includes('@')) {
        return email;
      }
    }
  }

  return null;
}

function isInEmailView() {
  // Check if URL contains a message ID (longer than just #inbox)
  return window.location.hash.length > 6 && window.location.hash.includes('/');
}

function addQuickFilterButton() {
  const inEmailView = isInEmailView();
  const hasSelectedEmail = document.querySelector('.oZ-jc.T-Jo.J-J5-Ji.T-Jo-Jp');
  const toolbarRight = document.querySelector('.G-tF');
  
  const shouldShowButton = inEmailView || hasSelectedEmail;

  if (toolbarRight && !document.querySelector('#quickFilterBtn') && shouldShowButton) {
    const button = document.createElement('div');
    button.id = 'quickFilterBtn';
    button.className = 'G-Ni J-J5-Ji';
    button.innerHTML = '<div class="T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs L3" role="button" style="user-select: none;">Quick Filter</div>';
    button.addEventListener('click', performQuickFilter);
    toolbarRight.insertBefore(button, toolbarRight.firstChild);
  } else if (!shouldShowButton && document.querySelector('#quickFilterBtn')) {
    document.querySelector('#quickFilterBtn').remove();
  }
}

function performQuickFilter() {
  selectedEmail = getSelectedEmail();
  if (selectedEmail) {
    const advancedSearchUrl = `https://mail.google.com/mail/u/0/#advanced-search/from=${encodeURIComponent(selectedEmail)}&query=from%3A(${encodeURIComponent(selectedEmail)})`;
    window.location.href = advancedSearchUrl;
  } else {
    alert('Please select an email first.');
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performQuickFilter') {
    performQuickFilter();
  }
});

const observerConfig = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
};

function attemptButtonAdd(retries = 5) {
  if (retries <= 0) return;

  const inEmailView = isInEmailView();
  const hasSelectedEmail = document.querySelector('.oZ-jc.T-Jo.J-J5-Ji.T-Jo-Jp');
  const toolbarRight = document.querySelector('.G-tF');
  
  const shouldShowButton = inEmailView || hasSelectedEmail;

  if (toolbarRight && !document.querySelector('#quickFilterBtn') && shouldShowButton) {
    const button = document.createElement('div');
    button.id = 'quickFilterBtn';
    button.className = 'G-Ni J-J5-Ji';
    button.innerHTML = '<div class="T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs L3" role="button" style="user-select: none;">Quick Filter</div>';
    button.addEventListener('click', performQuickFilter);
    toolbarRight.insertBefore(button, toolbarRight.firstChild);
    return;
  } else if (!shouldShowButton && document.querySelector('#quickFilterBtn')) {
    document.querySelector('#quickFilterBtn').remove();
  } else if (shouldShowButton && !document.querySelector('#quickFilterBtn')) {
    setTimeout(() => attemptButtonAdd(retries - 1), 1000);
  }
}

// Add debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initializeObserver() {
  attemptButtonAdd();
  
  const debouncedButtonAdd = debounce(attemptButtonAdd, 500);
  
  const observer = new MutationObserver((mutations) => {
    // Only trigger if we see relevant changes
    const shouldAdd = mutations.some(mutation => {
      return (
        mutation.target.classList?.contains('G-tF') ||
        mutation.target.classList?.contains('T-Jo') ||
        mutation.target.querySelector?.('.G-tF') ||
        mutation.target.querySelector?.('.T-Jo')
      );
    });
    
    if (shouldAdd) {
      debouncedButtonAdd();
    }
  });
  
  const observerConfig = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true
  };
  
  const mainContainer = document.querySelector('.ain');
  if (mainContainer) {
    observer.observe(mainContainer, observerConfig);
  } else {
    observer.observe(document.body, observerConfig);
  }
}

// Check if elements are ready immediately
if (document.querySelector('.ain') || document.querySelector('.G-tF')) {
  initializeObserver();
} else {
  // Fall back to shorter timeout if elements aren't ready
  setTimeout(initializeObserver, 250);
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    performQuickFilter();
  }
});

