<?php
/*
Template Name: User List
*/

get_header();

$users = get_users();
?>
<table id="user-list" class="display-responsive" width="100%">
    <thead>
        <tr>
            <th>User</th>
            <th>Role</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($users as $user) {
            $user_id = $user->ID;
            $username = $user->user_login;
            $user_email = $user->user_email;
            $user_role = implode(', ', $user->roles);
            echo "<tr>";
            echo "<td>$username</td>";
            echo "<td>$user_role</td>";
            echo "<td>$user_email</td>";
            echo "<td>";
            echo "<div class='button-wrapper2'>";
            echo "<a href='/edit-user/?user_id=$user_id' class='btn btn-success'>Edit</a>";
            echo "</div>";
            echo "<div class='button-wrapper2'>";
            echo "<a href='" . admin_url('admin-post.php?action=delete_user&user_id=' . $user_id) . "' class='btn btn-danger'onclick=\"return confirm('Are you sure you want to delete?');\">Delete</a>";
            echo "</td>";
            echo "</tr>";
        }
        ?>
    </tbody>
</table>

<?php
get_footer();
?>
