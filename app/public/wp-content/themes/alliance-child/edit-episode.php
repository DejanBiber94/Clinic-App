<?php
/* Template Name: Edit Episode */

get_header();

$episode_id = isset($_GET['episode_id']) ? $_GET['episode_id'] : null;

if ($episode_id) {
    $episode_data = get_field('episode');

    acf_form(array(
        'post_id' => $episode_id,
        'field_groups' => array(9663,9856),
        'post_title' => true,
        'form' => true,
    ));
} else {
    echo 'No episode ID provided.';

    if (is_user_logged_in() && current_user_can('edit_posts')) {
        $post_id = get_the_ID();

        acf_form(array(
            'post_id' => $post_id,
            'post_title' => true,
            'form' => true,
            'field_groups' => array(9663,9856),
      		'submit' => 'Update',
        ));
    } else {
        echo 'You must be logged in to edit record data.';
    }
}

get_footer();
