<?php
/* Template Name: Edit Record */
get_header();

$record_id = isset($_GET['record_id']) ? $_GET['record_id'] : null;

if ($record_id) {
    $record_data = get_field('record');

    acf_form(array(
        'post_id' => $record_id,
        'field_groups' => array(8629,9667,10084),
        'post_title' => true,
        'form' => true,
    ));
} else {
    echo 'No record ID provided.';

    if (is_user_logged_in() && current_user_can('edit_posts')) {
        $post_id = get_the_ID();

        acf_form(array(
            'post_id' => $post_id,
            'post_title' => true,
            'form' => true,
            'field_groups' => array(8629,9667,10084),
      		'submit' => 'Update',
        ));
    } else {
        echo 'You must be logged in to edit record data.';
    }
}

get_footer();

