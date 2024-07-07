<?php
/*
Template Name: Edit Patient
*/
acf_form_head();

get_header();

$patient_id = isset($_GET['patient_id']) ? $_GET['patient_id'] : null;

if ($patient_id) {
    $patient_data = get_fields('patient');
    
    acf_form(array(
        'post_id' => $patient_id, 
        'field_groups' => array(8629), 
        'post_title' => true,
        'form' => true,
    )); 
} else {
    echo 'No patient ID provided.';

    if (is_user_logged_in() && current_user_can('edit_posts')) {
        $post_id = get_the_ID(); 

        acf_form(array(
            'post_id'       => $post_id,
            'post_title'    => true,
            'form'          => true,
            'field_groups'  => array(8629), 
            'submit_value'  => 'Update',
        ));
    } else {
        echo 'You do not have permission to edit patient data.';
    }
}
get_footer();

