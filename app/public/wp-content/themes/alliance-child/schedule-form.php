<?php
/* Template Name: Schedule Form */

acf_form_head();
get_header();

$patient_id = get_the_ID();

ob_start();
acf_form(array(
    'post_title'        => true,
    'post_id'           => 'new_post',
    'form'              => true,
    'new_post'          => array(
        'post_type'    => 'appointments',
        'post_status'  => 'publish',
    ),
    'field_groups'      => array(10103),
    'submit_value'      => 'Schedule',
    'html_after_fields' => '<div id="timeSlotsContainer"></div>',
));
get_footer();
?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Get the ACF date picker instance
    const dateField = acf.getField('field_65de28b926f71');
    const titleField = document.getElementById('acf-_post_title');
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