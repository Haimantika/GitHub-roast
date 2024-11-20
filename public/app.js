let username = ''
document.addEventListener('DOMContentLoaded', () => {
  var params = new URLSearchParams(window.location.search);
  username = params.get("username");
  document.getElementById("username").value = username;
});

async function getRoast() {

  if (!username) {
    alert("Something seems wrong, try re-logging or entering username again.");
    return;
  }

  try {
    const response = await fetch(`/roast/${username}`);
    const data = await response.json();
    document.getElementById("roastOutput").textContent =
      data.roast || "No roast available.";
  } catch (error) {
    console.error("Failed to fetch roast:", error);
    document.getElementById("roastOutput").textContent =
      "Failed to fetch roast. Please try again.";
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
