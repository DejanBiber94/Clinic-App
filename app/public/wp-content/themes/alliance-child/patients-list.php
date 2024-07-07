<?php
/*
Template Name: Patients List
*/
the_content();

get_header();

$args = array(
    'post_type' => 'patients',
    'posts_per_page' => -1,
);

$patient_records = new WP_Query($args);
?>

<div class="container">
    <table id="patients-table" class="display-responsive nowrap" width="100%">
        <thead>
            <tr>
                <th>Name</th>
                <th>Last Name</th>
                <th>Telephone</th>
                <th>Address</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Report</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($patient_records->have_posts()) :
                while ($patient_records->have_posts()) : $patient_records->the_post();
                    echo '<tr>';
                   
                    $field_group_data = get_fields($field_group[8629], get_the_ID());
			
          		    $acf_fields_to_display = array(
                        'name',
                        'last_name',
                        'telephone',
                        'adress',
                        'email',
                        'date_of_birth',
                        'report',
                    
                    );
                    foreach ($acf_fields_to_display as $field_name) {
                        $field_value = $field_group_data[$field_name] ?? '';
                        ?>
                        <td><?php echo esc_html($field_value); ?></td>
                        <?php
                    }
                    ?>
                    <td>
                        <div class="button-wrapper">
                            <a href="<?php the_permalink(); ?>" class="btn btn-primary">View</a>
                        </div>
                        <div class="button-wrapper">
                            <a href="/edit-patient/?patient_id=<?php the_ID(); ?>" class="btn btn-success">Edit</a>
                        </div>
                        <div class="button-wrapper">
                            <form method="POST" onsubmit="return confirm('Are you sure you want to delete?');">
                                <input type="hidden" name="patient_id" value="<?php the_ID(); ?>">
                                <button type="submit" name="delete_patient" class="btn btn-danger">Delete</button>
                            </form>                        
                        </div>
                    </td>
                    <?php

                    echo '</tr>';
                endwhile;
                wp_reset_postdata(); 
            else :
                echo 'No patient found.';
            endif;
            ?>
        </tbody>
    </table>
</div>

<?php
get_footer();
?>
