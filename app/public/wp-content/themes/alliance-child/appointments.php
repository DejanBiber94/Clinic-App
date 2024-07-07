<?php
/* Template Name: Appointments List */

get_header();

function display_booked_appointments_table()
{
    $appointments_query = new WP_Query(array(
        'post_type' => 'appointments',
        'post_status' => 'publish',
        'posts_per_page' => -1,
    ));
 
    if ($appointments_query->have_posts()) {
        echo '<table id="Appointments-Table">';
        echo '<thead><tr><th>Patient Name</th><th>Date</th><th>Time</th><th>Department</th><th>Action</th></tr></thead>';
        echo '<tbody>';

        while ($appointments_query->have_posts()) {
            $appointments_query->the_post();

            $patients = get_field('search_patient');
            $patient_names = array();

            if ($patients) {
                foreach ($patients as $patient) {
                    $patient_name = get_post_field('post_title', $patient);
                    $patient_names[] = $patient_name;
                }
            }

            $patient_name = $patient_names ? implode(', ', $patient_names) : 'N/A';
            $appointment_datetime = get_field('select_date_and_time');
            $end_time = date('H:i', strtotime('+1 hour', strtotime($appointment_datetime)));
            $time_range = date('h:i a', strtotime($appointment_datetime)) . ' - ' . date('h:i a', strtotime($end_time));
            $appointment_date = date('d-m-Y', strtotime($appointment_datetime));
            $appointment_time = date('h:i A', strtotime($appointment_datetime));

            $department_terms = get_the_terms(get_the_ID(), 'odeljenje1');
            $department_names = array();

            if ($department_terms && !is_wp_error($department_terms)) {
                foreach ($department_terms as $term) {
                    $department_names[] = $term->name;
                }
            }

            $department = $department_names ? implode(', ', $department_names) : 'N/A';

            echo '<tr>';
            echo '<td>' . esc_html($patient_name) . '</td>';
            echo '<td>' . esc_html($appointment_date) . '</td>';
            echo '<td>' . esc_html($time_range) . '</td>';
            echo '<td>' . esc_html($department) . '</td>';
            echo '<td>';
            echo '<div class="button-wrapper2">';
            echo '<a href="/edit-appointment/?appointment_id=' . get_the_ID() . '" class="btn btn-success">Edit</a>';
            echo '</div>';
            echo '<div class="button-wrapper2">';
            echo '<form method="POST" onsubmit="return confirm(\'Are you sure you want to delete?\')">';
            echo '<input type="hidden" name="appointment_id" value="' . get_the_ID() . '">';
            echo '<button type="submit" name="delete_appointment" class="btn btn-danger">Delete</button>';
            echo '</div>';
            echo '</form>';
            echo '</td>';
            echo '</tr>';
        }
        echo '</tbody>';
        echo '</table>';

        wp_reset_postdata();
    } else {
        echo 'No booked appointments found.';
    }
}

display_booked_appointments_table();

get_footer();
?>
