<?php
/**
 * Child-Theme functions and definitions
 */

function alliance_child_scripts() {
    wp_enqueue_style( 'alliance-style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'alliance_child_scripts' );

function enqueue_child_theme_scripts() {
    wp_enqueue_script('custom-script', get_stylesheet_directory_uri() . '/custom.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_child_theme_scripts');

function enqueue_bootstrap_css() {
    wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
}
add_action('wp_enqueue_scripts', 'enqueue_bootstrap_css');

function patients_table_datatable() {
    if (is_page_template('patients-list.php')) {
        wp_enqueue_style('datatables-responsive-style', 'https://cdn.datatables.net/responsive/2.2.9/css/responsive.dataTables.min.css');
        wp_enqueue_script('datatables-responsive-script', 'https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.min.js', array('datatables-script'), '', true);

        wp_enqueue_style('datatables-style', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');
        wp_enqueue_script('datatables-script', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', array('jquery'), '1.10.25', true);
		
        wp_add_inline_script('datatables-script', '
            jQuery(document).ready(function () {
                jQuery("#patients-table").DataTable();
            });
        ');
    }
}
add_action('wp_enqueue_scripts', 'patients_table_datatable');

function user_list_datatables() {
    wp_enqueue_script('datatables', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', array('jquery'), '1.10.25', true);
    wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');

    wp_add_inline_script('datatables', '
        jQuery(document).ready(function ($) {
            $("#user-list").DataTable();
        });
    ');
}

add_action('wp_enqueue_scripts', 'user_list_datatables');

function episodes_datatables() {
    wp_enqueue_script('datatables', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', array('jquery'), '1.10.25', true);
    wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');

   wp_add_inline_script('datatables', '
       jQuery(document).ready(function ($) {
           $("#episodes").DataTable();
       });
   ');
}

add_action('wp_enqueue_scripts', 'episodes_datatables');

function records_datatables() {
    wp_enqueue_script('datatables', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', array('jquery'), '1.10.25', true);
    wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');

   wp_add_inline_script('datatables', '
       jQuery(document).ready(function ($) {
           $("#records").DataTable();
       });
   ');
}

add_action('wp_enqueue_scripts', 'records_datatables');

function appointments_datatables() {
    wp_enqueue_script('datatables', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', array('jquery'), '1.10.25', true);
       wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');

   wp_add_inline_script('datatables', '
       jQuery(document).ready(function ($) {
           $("#Appointments-Table").DataTable();
       });
   ');
}

add_action('wp_enqueue_scripts', 'appointments_datatables');

function handle_patient_deletion() {
    if (isset($_POST['delete_patient'])) {
        if (is_user_logged_in() && current_user_can('delete_posts')) {
            $patient_id = $_POST['patient_id'];
            if (get_post_type($patient_id) === 'patients' && get_post($patient_id)) {
                if (wp_delete_post($patient_id, true)) {
                    echo 'Patient deleted successfully.';
                } else {
                    echo 'Failed to delete patient.';
                }
            } else {
                echo 'Invalid patient ID or post type.';
            }
        } else {
            echo 'Permission denied.';
        }
    }
}

add_action('template_redirect', 'handle_patient_deletion');


function handle_delete_user() {
    if (isset($_GET['action']) && $_GET['action'] == 'delete_user' && isset($_GET['user_id'])) {
        if (is_user_logged_in() && current_user_can('delete_users')) {
        $user_id = $_GET['user_id'];
        if (wp_delete_user($user_id)) {
            echo 'User deleted successfully.';
            wp_redirect(home_url('/user-list/'));
            exit();
        } else {
            echo 'Failed to delete user.';
        }
    }
}
}
add_action('admin_post_delete_user', 'handle_delete_user');
add_action('admin_post_nopriv_delete_user', 'handle_delete_user');


function handle_record_deletion() {
    if (isset($_POST['delete_record'])) {
        if (is_user_logged_in() && current_user_can('delete_posts')) {
            $record_id = $_POST['record_id'];
            if (get_post_type($record_id) === 'records' && get_post($record_id)) {
                if (wp_delete_post($record_id, true)) {
                    echo 'Record deleted successfully.';
                } else {
                    echo 'Failed to delete record.';
                }
            } else {
                echo 'Invalid record ID or post type.';
            }
        } else {
            echo 'Permission denied.';
        }
    }
}

add_action('template_redirect', 'handle_record_deletion');

function handle_appointment_deletion() {
    if (isset($_POST['delete_appointment'])) {
        if (is_user_logged_in() && current_user_can('delete_posts')) {
            $appointment_id = $_POST['appointment_id'];
            if (get_post_type($appointment_id) === 'appointments' && get_post($appointment_id)) {
                if (wp_delete_post($appointment_id, true)) {
                    echo 'Record deleted successfully.';
                } else {
                    echo 'Failed to delete record.';
                }
            } else {
                echo 'Invalid record ID or post type.';
            }
        } else {
            echo 'Permission denied.';
        }
    }
}

add_action('template_redirect', 'handle_appointment_deletion');

function handle_episode_deletion() {
    if (isset($_POST['delete_episode'])) {
        if (is_user_logged_in() && current_user_can('delete_posts')) {
            $episode_id = $_POST['episode_id'];
            if (get_post_type($episode_id) === 'episodes'&& get_post($episode_id)) {
                if (wp_delete_post($episode_id, true)) {
                    echo 'Episode deleted successfully';
                } else {
                    echo 'Failed to delete episode';
                }  
            } 
                else {
                    echo 'Invalid episode ID or post type';
                } 
            }
                else {
                    echo 'Permission denied';
                }
    }
}  
add_action('template_redirect','handle_episode_deletion');

function episodes_table_shortcode() {
    ob_start();

    $patient_id = get_the_ID();

    $episodes_query = new WP_Query(array(
        'post_type' => 'episodes', 
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'episode',
                'value' => $patient_id,
                'compare' => 'LIKE',
            ),
        ),
    ));

    if ($episodes_query->have_posts()) {
        echo '<h2>Episodes</h2>';
        echo '<table id="episodes" class="display-responsive" width="100%">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Episode</th>';
        echo '<th>Actions</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        while ($episodes_query->have_posts()) {
            $episodes_query->the_post();
            $episode_id = get_the_ID();

            echo '<tr>';
            echo '<td>' . get_the_title($episode_id) . '</td>';
            echo '<td>';
            echo '<div class="button-wrapper2">';
            echo '<a href="/edit-episode/?episode_id=' . get_the_ID() . '" class="btn btn-success">Edit</a>';
            echo '</div>';
            echo '<div class="button-wrapper2">';
            echo '<form method="POST" onsubmit="return confirm(\'Are you sure you want to delete?\')">';
            echo '<input type="hidden" name="episode_id" value="' . get_the_ID() . '">';
            echo '<button type="submit" name="delete_episode" class="btn btn-danger">Delete</button>';
            echo '</form>';
            echo '</div>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</tbody>';
        echo '</table>';
        wp_reset_postdata();
    } else {
        echo 'No episodes found for this patient.';
    }

    $output = ob_get_clean();
    return $output;
}

add_shortcode('episodes_table', 'episodes_table_shortcode');

function records_table_shortcode() {
    ob_start();

    $patient_id = get_the_ID();

    $records_query = new WP_Query(array(
        'post_type' => 'records',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'record',
                'value' => $episode_id,
                'compare' => 'LIKE',
            ),
        ),
    ));

    $episodes_query = new WP_Query(array(
        'post_type' => 'episodes', 
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'episode',
                'value' => $patient_id,
                'compare' => 'LIKE',
            ),
        ),
    ));

    if ($episodes_query->have_posts()) {
        echo '<h2>Records</h2>';
        echo '<select id="episode-filter">';
        echo '<option value="">Filter by Episode</option>';

        // Array to store unique episode IDs
        $episode_ids = array();

        while ($episodes_query->have_posts()) {
            $episodes_query->the_post();
            $episode_id = get_the_ID();

            // Check if episode ID already exists in the array
            if (!in_array($episode_id, $episode_ids)) {
                $episode_ids[] = $episode_id;
                $episode_title = get_the_title($episode_id);
                echo '<option value="' . $episode_id . '">' . esc_html($episode_title) . '</option>';
            }
        }

        echo '</select>';

        echo '<table id="records" class="display-responsive" width="100%">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Record</th>';
        echo '<th>Actions</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        while ($records_query->have_posts()) {
            $records_query->the_post();
            $record_id = get_the_ID();
            $episode_id = ''; // Initialize episode ID
            
            // Retrieve the associated episode ID using the ACF Relationship field
            $related_episodes = get_field('record', $record_id);
            if ($related_episodes) {
                // Assuming a record can be associated with only one episode
                $episode_id = $related_episodes[0]->ID;
            }
        
            // Output record row with associated episode ID
            echo '<tr data-episode-id="' .esc_attr($episode_id) . '">';
            echo '<td>' . get_the_title($record_id) . '</td>';
            echo '<td>';
            echo '<div class="button-wrapper2">';
            echo '<a href="/edit-record/?record_id=' . get_the_ID() . '" class="btn btn-success">Edit</a>';
            echo '</div>';
            echo '<div class="button-wrapper2">';
            echo '<form method="POST" onsubmit="return confirm(\'Are you sure you want to delete?\')">';
            echo '<input type="hidden" name="record_id" value="' . get_the_ID() . '">';
            echo '<button type="submit" name="delete_record" class="btn btn-danger">Delete</button>';
            echo '</form>';
            echo '</div>';
            echo '</td>';
            echo '</tr>';
        }
    
        echo '</tbody>';
        echo '</table>';
        wp_reset_postdata();
    } else {
        echo 'No records found for this patient.';
    }

    $output = ob_get_clean();
    return $output;
}

add_shortcode('records_table', 'records_table_shortcode');


function custom_register_roles() {

    add_role('level_1', 'Level 1', array(
        'read' => true,
        'edit_posts' => true,
        'delete_posts' => true,
        'publish_posts' => true,
    ));


    add_role('level_2', 'Level 2', array(
        'read' => true, 
        'edit_posts' => true,
        'delete_posts' => true,
        'publish_posts' => true,
    ));
}
	add_action('init', 'custom_register_roles');

    function custom_add_capabilities() {    
        $level_1 = get_role('level_1');
        $level_2 = get_role('level_2');
    
        $record_capability_type = 'record'; 
        $episode_capability_type = 'episode'; 
    
        $level_1->add_cap("edit_{$record_capability_type}"); 
        $level_1->add_cap("delete_{$record_capability_type}"); 
        $level_1->add_cap("edit_{$episode_capability_type}"); 
        $level_1->add_cap("delete_{$episode_capability_type}"); 
    
        $level_2->add_cap("edit_{$record_capability_type}");  
        $level_2->add_cap("delete_{$record_capability_type}"); 
    }
    add_action('init', 'custom_add_capabilities');
    

add_action('init', 'blockusers_init');

function blockusers_init() {
    if (is_admin() && !current_user_can('administrator') && !(defined('DOING_AJAX') && DOING_AJAX)) {
      	wp_redirect(home_url());
          add_filter( 'show_admin_bar', function( $show ) {
          if ( current_user_can( 'level_1', 'level_2' ) ) {
                $show = false;
            }
            return $show;
        } );
        exit;
    	}
	};

add_action('admin_post_nopriv_custom_user_registration', 'custom_user_registration');
add_action('admin_post_custom_user_registration', 'custom_user_registration');

function custom_user_registration() {
    if (isset($_POST['registration-nonce']) && wp_verify_nonce($_POST['registration-nonce'], 'custom-user-registration')) {
        $username = sanitize_user($_POST['username']);
        $password = sanitize_text_field($_POST['password']);
        $confirm_password = sanitize_text_field($_POST['confirmpassword']);
        $email = sanitize_email($_POST['email']);
        $user_role = sanitize_text_field($_POST['user_role']);

        if (username_exists($username)) {
            $registration_result = 'Username already exists. Please choose a different one.';
        } elseif ($password !== $confirm_password) {
            $registration_result = 'Passwords do not match!';
        } else {
            $user_id = wp_create_user($username, $password, $email);

            if (is_wp_error($user_id)) {
                $registration_result = 'User registration failed. Please try again.';
            } else {
                $user = new WP_User($user_id);
                $user->set_role($user_role);
                $registration_result = 'User registered successfully!';
            }
        }
    } else {
        $registration_result = 'Registration failed. Please try again.';
    }

    // Redirect with the registration message
    wp_redirect(home_url('/user-registration/?message=' . urlencode($registration_result)));
    exit();
}



function get_booked_time_slots_by_date($date) {
    $bookedTimeSlots = array();
    $end_date = date('Y-m-d, 23:59:59', strtotime($date));

    $booked_appointments = new WP_Query(array(
        'post_type' => 'appointments',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'select_date_and_time',
                'value' => array($date, $end_date),
                'compare' => 'BETWEEN',
                'type' => 'DATETIME',
            ),
        ),
    ));

    if ($booked_appointments->have_posts()) {
        while ($booked_appointments->have_posts()) {
            $booked_appointments->the_post();
            $start_time = get_field('select_date_and_time');
            $end_time = date('H:i', strtotime('+1 hour', strtotime($start_time)));
            $time_range = date('h:i a', strtotime($start_time)) . ' - ' . date('h:i a', strtotime($end_time));
            $bookedTimeSlots[] = $time_range;
        }
        wp_reset_postdata();
    } else {
        $bookedTimeSlots[] = 'No appointments booked for this date';
    }

    return $bookedTimeSlots;
}

function get_booked_time_slots() {
    $selectedDate = isset($_POST['selected_date']) ? sanitize_text_field($_POST['selected_date']) : '';

    // Call the function to get booked time slots
    $bookedTimeSlots = get_booked_time_slots_by_date($selectedDate);
    
    // Output the booked time slots
    wp_send_json_success($bookedTimeSlots);
}

add_action('wp_ajax_get_booked_time_slots', 'get_booked_time_slots');
add_action('wp_ajax_nopriv_get_booked_time_slots', 'get_booked_time_slots'); 



add_action('get_header', 'add_acf_form_head');
function add_acf_form_head() {
    acf_form_head();
};

function display_pacijenti_form() {
    ob_start(); 
    
    acf_form(array(
        'post_id'       => 'new_post',
        'post_title'    => true,
        'form'          => true, 
        'new_post'      => array(
            'post_type'     => 'patients',
            'post_status'   => 'publish'
        ),
        'field_groups'  => array(8629),
        'submit_value'  => 'Submit'
    ));
	
    
    
    return ob_get_clean(); 
};
add_shortcode('pacijenti_form', 'display_pacijenti_form');