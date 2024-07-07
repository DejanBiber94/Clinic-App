<?php
/* Template Name: User Registration */
get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="registration-form">
            <h2>Create a New User</h2>
            <form id="registration-form" action="<?php echo esc_url(admin_url('admin-post.php'));?>" method="post">
                <input type="hidden" name="action" value="custom_user_registration">
                <?php wp_nonce_field('custom-user-registration', 'registration-nonce'); ?>
                <label for="username">Username</label>
                <input type="text" name="username" required>
                <label for="password">Password</label>
                <input type="password" id="password" required>
                <label for="confirmpassword">Confirm Password</label>
                <input type="password" id="confirm_password" required>
                <div id="password-match-message"></div>
                <label for="email">Email</label>
                <input type="email" name="email" required>
                <label for="user_role">Select User Role</label>
                <select name="user_role">
                    <option value="level_1">Level 1</option>
                    <option value="level_2">Level 2</option>
                </select>
                <input type="submit" class="acf-button" value="Create">
            </form>
        </div>
        <div id="registration-message"></div>
    </main>
</div>

<?php get_footer(); ?>
