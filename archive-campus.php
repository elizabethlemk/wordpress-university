<?php get_header();
pageBanner(array(
  'title' => 'Our Campuses',
  'subtitle' => "We have conveniently located campuses throughout the Manhattan area."
)); ?>

<div class="container container--narrow page-section">
  <div class="acf-map">
  <?php

    while (have_posts()) {
      the_post();
      $location = get_field('map_location');?>

      <div class="marker" data-lat="<?php echo $location['lat'] ?>" data-lng="<?php echo $location['lng'] ?>">
        <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
        <?php echo $location['address']; ?>
      </div>

  <?php } ?>
 </div>
</div>
<?php get_footer();?>
