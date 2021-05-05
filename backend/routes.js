clearCarriages = carriagesArray => {
  return carriagesArray.map(item => item.carriages)
}

addSegment = (params = {}) => {
  const initial = {
    from: {
      country: '',
      city: '',
      coordinates: '0, 0'
    },
    to: {
      country: '',
      city: '',
      coordinates: '0, 0'
    },
    method: {
      service_id: 0,
      slug: 'car',
      name: 'Автомобильная перевозка'
    },
    duration: {
      text: '0 дн.',
      value: 1
    },
    distance: {
      text: '0 км',
      value: 1
    },
    prices: {
      rub: 0,
      eur: 0,
      cny: 0,
      usd: 0
    }
  }
  return { ...initial, ...params }
}

exports.addSection = params => {
  let row = params.route
  let type = params.typeRoute
  let metric = params.metric
  let carriages = clearCarriages(params.carriages)

  let routeTypical = params.type === 'boxes' ? 'GROUP_CARGO' : 'WHOLE_CARGO'

  let segments = []

  switch (routeTypical) {
    case 'GROUP_CARGO':
      segments.push(
        addSegment({
          from: {
            country: row.from.country,
            city: row.from.city
          },
          to: {
            country: 'Lietuvos Respublika',
            city: 'Vilnius'
          }
        })
      )
      segments.push(
        addSegment({
          from: {
            country: 'Lietuvos Respublika',
            city: 'Vilnius'
          },
          to: {
            country: 'Russia',
            city: 'Smolensk'
          }
        })
      )
      segments.push(
        addSegment({
          from: {
            country: 'Russia',
            city: 'Smolensk'
          },
          to: {
            country: row.to.country,
            city: row.to.city
          }
        })
      )

      return segments

    case 'WHOLE_CARGO':
      segments.push(params.route)
      return segments

    default:
      return false
  }
}
