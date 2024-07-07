<?php
/* Template Name: Create Record */

acf_form_head();
get_header();

ob_start();
acf_form(array(
    'post_id'       => 'new_post',
    'post_title'    => true,
    'form'          => true, 
    'new_post'      => array(
        'post_type'     => 'records',
        'post_status'   => 'publish'
    ),
    'field_groups'  => array(8629,9667,10084),
    'submit_value'  => 'Create'
));

get_footer();
