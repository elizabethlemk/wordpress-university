<?php
  add_action('rest_api_init', 'uniRegisterSearch');

  function uniRegisterSearch (){
    register_rest_route('university/v1', 'search', array(
      'methods' => WP_REST_SERVER::READABLE,
      'callback' => 'uniSearchResults'
    ));
  }

  function uniSearchResults($data){
    $mainQuery = new WP_Query(array(
      'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
      's' => sanitize_text_field($data['term'])
    ));

    $results = array(
      'general' => array(),
      'professors' => array(),
      'programs' => array(),
      'events' => array(),
      'campuses' => array()
    );
    while ($mainQuery->have_posts()) {
      $mainQuery->the_post();
      if (get_post_type() == 'post' or get_post_type() == 'page') {
        array_push($results['general'], array(
          'title' => get_the_title(),
          'url' => get_the_permalink(),
          'type' => get_post_type(),
          'author' => get_the_author()
        ));
      } elseif (get_post_type() == 'professor') {
        array_push($results['professors'], array(
          'title' => get_the_title(),
          'url' => get_the_permalink(),
          'img' => get_the_post_thumbnail_url(0, 'prof-landscape')
        ));
      } elseif (get_post_type() == 'program') {
        $relatedCampus = get_field('related_campus');
        if ($relatedCampus) {
          foreach ($relatedCampus as $campus) {
            array_push($results['campuses'], array(
              'title' => get_the_title($campus),
              'url' => get_the_permalink($campus)
            ));
          }
        }
        array_push($results['programs'], array(
          'title' => get_the_title(),
          'url' => get_the_permalink(),
          'id' => get_the_id(),

        ));
      } elseif (get_post_type() == 'campus') {
        array_push($results['campuses'], array(
          'title' => get_the_title(),
          'url' => get_the_permalink()
        ));
      } elseif (get_post_type() == 'event') {
        $date = new DateTime(get_field('event_date'));
        $description = null;
        if (has_excerpt()) {
          $description = the_excerpt();
        }else {
          $description = wp_trim_words(get_the_content(), 18);
        }
        array_push($results['events'], array(
          'title' => get_the_title(),
          'url' => get_the_permalink(),
          'month' => $date->format('M'),
          'day' => $date->format('d'),
          'description' => $description
        ));
      }
    }

    if ($results['programs']) {
      $programsArr = array('relation' => 'OR');
      foreach ($results['programs'] as $item) {
        array_push($programsArr, array(
          'key' => 'related_programs',
          'compare' => 'LIKE',
          'value' => '"' . $item['id'] . '"'
        ));
      }

      $relationship = new WP_Query(array(
        'post_type' => array('professor', 'event'),
        'meta_query' => $programsArr
      ));

      while ($relationship->have_posts()) {
        $relationship->the_post();
        if (get_post_type() == 'professor') {
          array_push($results['professors'], array(
            'title' => get_the_title(),
            'url' => get_the_permalink(),
            'img' => get_the_post_thumbnail_url(0, 'prof-landscape')
          ));
        } elseif (get_post_type() == 'event') {
          $date = new DateTime(get_field('event_date'));
          $description = null;
          if (has_excerpt()) {
            $description = the_excerpt();
          } else {
            $description = wp_trim_words(get_the_content(), 18);
          }
          array_push($results['events'], array(
            'title' => get_the_title(),
            'url' => get_the_permalink(),
            'month' => $date->format('M'),
            'day' => $date->format('d'),
            'description' => $description
          ));
        }
      }
      $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
      $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
    }
    return $results;
  }
 ?>
