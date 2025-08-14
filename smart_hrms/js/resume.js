const Resume = (() => {
  let parsedResume = null;

  /** Handle file upload */
  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Try to parse JSON resume
        parsedResume = JSON.parse(reader.result);
      } catch {
        // If parsing fails → simulate resume data
        parsedResume = getSampleResume();
      }
      renderDetails();
    };

    if (file.name.toLowerCase().endsWith('.json')) {
      reader.readAsText(file);
    } else {
      // If file is not JSON → simulate resume data
      parsedResume = getSampleResume();
      renderDetails();
    }
  }

  /** Simulated sample resume */
  function getSampleResume() {
    return {
      name: "John Doe",
      email: "john@example.com",
      skills: ["JavaScript", "HTML", "CSS", "React"],
      experience: "5 years",
      education: "B.Tech Computer Science"
    };
  }

  /** Render parsed resume details */
  function renderDetails() {
    if (!parsedResume) return;

    const container = document.getElementById('parsedDetails');
    container.innerHTML = `
      <div class="mb-2"><strong>Name:</strong> ${parsedResume.name}</div>
      <div class="mb-2"><strong>Email:</strong> ${parsedResume.email}</div>
      <div class="mb-2"><strong>Skills:</strong> ${parsedResume.skills.join(', ')}</div>
      <div class="mb-2"><strong>Experience:</strong> ${parsedResume.experience}</div>
      <div class="mb-2"><strong>Education:</strong> ${parsedResume.education}</div>
    `;

    updateMatch();
  }

  /** Update skill match score & missing skills list */
  function updateMatch() {
    if (!parsedResume) return;

    const reqInput = document.getElementById('jobReq').value.trim();
    const requiredSkills = reqInput.split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const candidateSkills = parsedResume.skills.map(s => s.toLowerCase());

    // Calculate match percentage
    const matched = requiredSkills.filter(skill => candidateSkills.includes(skill));
    const score = requiredSkills.length
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 0;

    // Update score circle
    const scoreCircle = document.getElementById('matchCircle');
    const scoreLabel = document.getElementById('matchLabel');
    if (scoreCircle && scoreLabel) {
      scoreLabel.textContent = `${score}%`;
      scoreCircle.style.background = `conic-gradient(var(--bs-primary) ${score}%, #e9ecef ${score}%)`;
    }

    // Display missing skills
    const missingSkills = requiredSkills.filter(s => !candidateSkills.includes(s));
    const missingList = document.getElementById('missingSkills');
    if (missingList) {
      missingList.innerHTML = '';
      if (missingSkills.length === 0) {
        missingList.innerHTML = `<li class="text-success">No missing skills 🎉</li>`;
      } else {
        missingSkills.forEach(ms => {
          const li = document.createElement('li');
          li.textContent = ms;
          missingList.appendChild(li);
        });
      }
    }
  }
    function init() {
    renderFavorites();
    initReportLinks();
    App.init(); // Apply role & theme
  }


  return { handleUpload, updateMatch };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Optional: Add event listener for role-based restrictions
  const role = localStorage.getItem('currentRole') || 'Admin';
  if (role === 'Employee') {
    document.getElementById('resumeUpload')?.setAttribute('disabled', 'true');
  }
});
