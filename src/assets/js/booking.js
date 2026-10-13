// Pre-fill the booking details field when clicking a package CTA.
// packageName looks like "Personal: Basic Portrait" — the prefix selects the category.
function selectPackage(packageName) {
  const detailsInput = document.getElementById('session-details');
  const categorySelect = document.getElementById('session-category');

  if (detailsInput) {
    detailsInput.value = packageName;
  }

  if (categorySelect) {
    const category = packageName.split(':')[0];
    if ([...categorySelect.options].some(o => o.value === category)) {
      categorySelect.value = category;
    }
  }
}

// Handle Contact Form Submission (Formspree endpoint is the form's `action`, set in site.json)
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('booking-form');
  const successMsg = document.getElementById('form-success-msg');
  const errorMsg = document.getElementById('form-error-msg');
  const submitBtn = document.getElementById('submit-btn');
  const email = form.dataset.email;
  const defaultError = `There was an error sending your booking request. Please try again later or contact us directly at <a href="mailto:${email}">${email}</a>.`;

  if (!form.checkValidity()) return;

  submitBtn.disabled = true;
  submitBtn.innerText = 'Sending...';
  errorMsg.style.display = 'none';
  errorMsg.setAttribute('aria-hidden', 'true');

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        form.reset();
        submitBtn.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.setAttribute('aria-hidden', 'false');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            errorMsg.querySelector('p').innerText = data['errors'].map(error => error['message']).join(', ');
          } else {
            errorMsg.querySelector('p').innerHTML = defaultError;
          }
        });
        throw new Error('Formspree response was not OK');
      }
    })
    .catch(error => {
      console.error('Error submitting booking request:', error);
      submitBtn.disabled = false;
      submitBtn.innerText = form.dataset.submitLabel;
      errorMsg.style.display = 'block';
      errorMsg.setAttribute('aria-hidden', 'false');
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// Set min date for date selector to today
const dateInput = document.getElementById('session-date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

// Prefill package from localStorage if redirected from another page (e.g. TfP)
const prefill = localStorage.getItem('prefillPackage');
if (prefill) {
  selectPackage(prefill);
  localStorage.removeItem('prefillPackage');
}
