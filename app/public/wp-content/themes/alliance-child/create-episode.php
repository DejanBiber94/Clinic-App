<?php
/* Template Name: Create Episode */

acf_form_head();
get_header();

$patient_id = get_the_ID();

ob_start();
acf_form(array(
    'post_id'     => 'new_post',
    'post_title'  =>  true,
    'form'        =>  true,
    'new_post'    =>  array(
        'post_type' => 'episodes',
        'post_status' => 'publish'
    ),
    'field_groups'   => array(9663,9856),
    'submit_value'   => 'Create'
));

get_footer();

