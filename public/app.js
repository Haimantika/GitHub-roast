const roast = document.getElementById('roastOutput');
async function getRoast() {
  const username = document.getElementById('username').value;
    if (!username) {
      alert('Please enter a GitHub username.');
      return;
    }
  
    try {
      roast.textContent = "This won't take long. We don't have much content to roast anyways!"
      const response = await fetch(`/roast/${username}`);
      const data = await response.json();
      roast.textContent = data.roast || 'No roast available.';
    } catch (error) {
      console.error('Failed to fetch roast:', error);
      roast.textContent = 'Failed to fetch roast. Please try again.';
    }
  }