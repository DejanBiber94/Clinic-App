// Filter Episode in Records Datatable //
document.addEventListener('DOMContentLoaded', function() {
    const episodeFilter = document.getElementById('episode-filter');
    const recordsTable = document.getElementById('records').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    episodeFilter.addEventListener('change', function() {
        let selectedEpisodeId = this.value;
        // console.log('Selected Episode ID:', selectedEpisodeId);

        
        // Loop through each record row in the table
        for (let i = 0; i < recordsTable.length; i++) {
            let recordEpisodeId = recordsTable[i].getAttribute('data-episode-id');
            // console.log('record episode ID:',recordEpisodeId);
            
            // Show/hide rows based on the selected episode
            if (selectedEpisodeId === '' || recordEpisodeId === selectedEpisodeId) {
                recordsTable[i].style.display = '';
            } else {
                recordsTable[i].style.display = 'none';
            }
        }
    });
});
// For fullfill titles in acf templates //
document.addEventListener('DOMContentLoaded', function() {
    let typingTimer;
    let typingDelay = 1500;
      const textField = document.getElementById('acf-field_65159fa514fc8');
      const textFieldEpisode = document.getElementById('acf-field_65419ff625b56');
      const titleField = document.getElementById('acf-_post_title');
      
    textField.addEventListener('input', function() {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, typingDelay);
    });

    textFieldEpisode.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTypingEpisode, typingDelay);
    });

    function doneTypingEpisode() {
        let text = textFieldEpisode.value;
        titleField.value = text;
    }

    function doneTyping() {
      let text = textField.value;
      titleField.value = text;
    }

  });

// Password match for creating user //
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm_password");
const passwordMessage = document.getElementById("password-match-message");
const registrationMessage = document.getElementById("registration-message");


confirmInput.addEventListener("input", function () {
    if (passwordInput.value === confirmInput.value) {
        passwordMessage.innerHTML = "Passwords match!";
        passwordMessage.style.color = "green";
    } else {
        passwordMessage.innerHTML = "Passwords do not match!";
        passwordMessage.style.color = "red";
    }
});

const urlParams = new URLSearchParams(window.location.search);
const registrationResult = urlParams.get('message');

if (registrationResult) {
    registrationMessage.innerHTML = registrationResult;
    registrationMessage.style.color = registrationResult ? 'red' : 'green';
};
