/*
  # OPERATORS
  copy
  toggle
  set
  unset
  when
  throttle
  debounce
  *filter
*/

// SET
[
  set('state:foo.bar', 'foo')
]

// COPY
[
  copy('input:foo', `state:${CONSTANT}`)
]

// WHEN
[
  when('input:foo'), {
    accepted: [],
    rejected: []
  },
  when('state:user.role', {
    'admin': 0,
    'superuser': 1
  }), {
    admin: [],
    superuser: []
  }
]

// THROTTLE
[
  throttle(200), {
    accepted: [],
    rejected: []
  },
/*
  ...throttle(200, [
  ])
*/
]

// DEBOUNCE
[
  debounce(200), {
    accepted: [],
    rejected: []
  },
  /*
  ...debounce(200, [
  ])
  */
]

// FILTER
[
  filter('input:foo', filterFunc), {
    accepted: [],
    rejected: []
  },
  /*
  ...filter('input:foo', filterFync, [
  ])
  */
]
