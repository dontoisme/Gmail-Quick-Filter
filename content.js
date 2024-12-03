let selectedEmail = '';

function getSelectedEmail() {
  const selectedCheckbox = document.querySelector('.oZ-jc.T-Jo.J-J5-Ji.T-Jo-Jp');
  
  if (selectedCheckbox) {
    const emailRow = selectedCheckbox.closest('tr');
    
    if (emailRow) {
      const emailCandidates = [
        emailRow.querySelector('.yW .zF'),
        emailRow.querySelector('.bA4 .zF'),
        emailRow.querySelector('.ag.a8k'),
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

  const openEmailSender = document.querySelector('.gD');
  if (openEmailSender) {
    const email = openEmailSender.getAttribute('email');
    if (email) {
      return email;
    }
  }

  return null;
}

function addQuickFilterButton() {
  const toolbarRight = document.querySelector('.G-tF');
  if (toolbarRight && !document.querySelector('#quickFilterBtn')) {
    const button = document.createElement('div');
    button.id = 'quickFilterBtn';
    button.className = 'G-Ni J-J5-Ji';
    button.innerHTML = '<div class="T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs L3" role="button" style="user-select: none;">Quick Filter</div>';
    button.addEventListener('click', performQuickFilter);
    toolbarRight.insertBefore(button, toolbarRight.firstChild);
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

addQuickFilterButton();

const observer = new MutationObserver(addQuickFilterButton);
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    performQuickFilter();
  }
});

