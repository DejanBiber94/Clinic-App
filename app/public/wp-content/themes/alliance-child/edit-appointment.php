<?php
/*Template Name: Edit Appointment */
acf_form_head();
get_header();

$appointment_id = isset($_GET['appointment_id']) ? $_GET['appointment_id'] : null;

if ($appointment_id) {
    $appointment_data = get_field($appointment_id);

    acf_form(array(
        'post_id' => $appointment_id,
        'field_groups' => array(10103),
        'post_title' => true,
        'form' => true,
        'html_after_fields' => '<div id="timeSlotsContainer"></div>',
    ));
} else {
    echo 'No appointment ID provided.';

    if (is_user_logged_in() && current_user_can('edit_posts')) {
        $post_id = get_the_ID();

        acf_form(array(
            'post_id' => $post_id,
            'post_title' => true,
            'form' => true,
            'field_groups' => array(10103),
      		'submit' => 'Update'
        ));
    } else {
        echo 'You must be logged in to edit appointment data.';
    }
}

get_footer();
?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Get the ACF date picker instance
    let dateField = acf.getField('field_65de28b926f71');
    let titleField = document.getElementById('acf-_post_title');
    let timeSlotsContainer = document.getElementById('timeSlotsContainer');

    if (dateField) {
        dateField.on('change', function () {
            let selectedDate = dateField.val();

            titleField.value = selectedDate;

            // Use AJAX to fetch booked time slots based on the selected date
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    displayBookedTimeSlots(JSON.parse(xhr.response));
                }
            };

            // Adjust the AJAX URL and parameters based on your setup
            let ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';
            let data = 'action=get_booked_time_slots&selected_date=' + selectedDate; // Adjust the action and parameters
            xhr.open('POST', ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        });
    }

function displayBookedTimeSlots(bookedTimeSlots) {
    timeSlotsContainer.innerHTML = '';

    if (bookedTimeSlots.data.length > 0) {
        let label = document.createElement('p');
        label.textContent = 'Booked Appointments:';
        timeSlotsContainer.appendChild(label);

        let list = document.createElement('ul');
        bookedTimeSlots.data.forEach(function (timeSlot) {
            let listItem = document.createElement('li');
            listItem.textContent = timeSlot;
            list.appendChild(listItem);
        });
        timeSlotsContainer.appendChild(list);
    } else {
        timeSlotsContainer.textContent = 'No booked time slots for this date.';
    }
}

});
</script>  
