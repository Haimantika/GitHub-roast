async function getRoast() {
    const username = document.getElementById('username').value;
    if (!username) {
      alert('Please enter a GitHub username.');
      return;
    }
  
    try {
      const response = await fetch(`/roast/${username}`);
      const data = await response.json();
      document.getElementById('roastOutput').textContent = data.roast || 'No roast available.';
    } catch (error) {
      console.error('Failed to fetch roast:', error);
      document.getElementById('roastOutput').textContent = 'Failed to fetch roast. Please try again.';
    }
  }
  

  