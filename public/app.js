async function getRoast() {
  const username = document.getElementById("username").value;
  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const response = await fetch(`/roast/${username}`);
    const data = await response.json();
    const roastOutput = document.getElementById("roastOutput");
    roastOutput.textContent = data.roast || "No roast available.";

    // Show save and share buttons
    document.getElementById("saveButton").style.display = "block";
    document.getElementById("shareButton").style.display = "block";
  } catch (error) {
    console.error("Failed to fetch roast:", error);
    const roastOutput = document.getElementById("roastOutput");
    roastOutput.textContent = "Failed to fetch roast. Please try again.";
  }
}

function saveRoast() {
  html2canvas(document.getElementById("roastWrapper")).then(function (canvas) {
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "roast.png";
    link.click();
  });
}

function shareOnTwitter() {
  const roastText = document.getElementById("roastOutput").textContent;
  const tweetText = encodeURIComponent(
    `Check out this GitHub roast : ${roastText}

    
     "Try Yours at - github-roast.up.railway.app/"
    `
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  window.open(twitterUrl, "_blank");
}
