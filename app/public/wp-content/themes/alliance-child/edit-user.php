<?php 
/* Template Name: User Edit 
*/
get_header();

if (is_user_logged_in() && current_user_can('edit_users')) {
    if (isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        $user = get_user_by('ID', $user_id);

        if ($user) {
            $username = $user->user_login;
            $user_email = $user->user_email;
            $user_roles = $user->roles;

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $new_username = sanitize_user($_POST['new_username']);
                $new_email = sanitize_email($_POST['new_email']);

                wp_update_user(array(
                    'ID' => $user_id,
                    'user_login' => $new_username,
                    'user_email' => $new_email,
                    'user_role'  => $new_role
                ));

         
                if (isset($_POST['new_password'])) {
                    $new_password = sanitize_text_field($_POST['new_password']);

                
                    wp_set_password($new_password, $user_id);
                }

                if (isset($_POST['new_role'])) {
                    $new_role = sanitize_text_field($_POST['new_role']);
                    if (in_array($new_role, array('level_1', 'level_2'))) {
                        $new_role_array = ($new_role); 
                        wp_update_user(array(
                            'ID' => $user_id,
                            'role' => $new_role_array
                        ));
                    }
                }

                echo '<p>User profile has been updated.</p>';
            }

            echo "<h2>Edit User Profile</h2>";
       
            echo '<form method="POST">';
            echo '<label for="new_username">Username:</label>';
            echo '<input type="text" id="new_username" name="new_username" value="' . $username . '"><br>';
            echo '<label for="new_email">Email:</label>';
            echo '<input type="text" id="new_email" name="new_email" value="' . $user_email . '"><br>';
            echo '<label for="new_password">Password:</label>';
            echo '<input type="password" id="new_password" name="new_password"><br>';
            echo '<label for="new_role">Select User Role:</label>';
            echo '<select name="new_role">';
            echo '<option value="level_1" ' . ($user_roles == "level_1" ? "selected" : "") . '>Level 1</option>';
            echo '<option value="level_2" ' . ($user_roles == "level_2" ? "selected" : "") . '>Level 2</option>';
            echo '</select><br>';
            echo '<input type="submit" class="acf-button" value="Update Profile">';
            echo '</form>';
        } else {
            echo '<p>User not found.</p>';
        }
    } else {
        echo '<p>Please select a user to edit.</p>';
    }
 } 
 else {
    echo '<p>You must be logged in and have the necessary permissions to edit user profiles.</p>';
}

get_footer();
?> 