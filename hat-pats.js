const pats = [
  {
    r:   '1 + 2 +...3 + 4.e.+ ',
    hat: 'hohohoh hhhohohoh-ho'
  },
  {
    r:   '1 + 2 +...3 + 4 + ',
    hat: 'h h h h hohohohoho',
  },
  {
    r:   '1 e + a 2 e + a 3.....e...+..a.4 e + a ',
    hat: 'hohohohohohoh h hohohhohohohohoh o h o ',
  },
  {
    r:   '1 e + a 2 e + a..3.....e + a 4 e + a ',
    hat: 'h   h   h h hohoohoohoohohohohohohoho',
  },
]

const variations = [
  {
    r:   '1 + 2 +...3 + 4.e.+ ',
    hat: 'hohoh     hohohoh-ho'
  },
  {
    r:   '1 + 2 +...3 + 4 + ',
    hat: 'h h h h hohohohoho',
  },
  {
    r:   '1 e + a 2 e + a 3.....e...+..a.4 e + a ',
    hat: 'hohohohoh       hohohhohohohohoh o h o ',
  },
  {
    r:   '1 e + a 2 e + a..3.....e + a 4 e + a ',
    hat: 'h   h   h h hohoohoohooh o h o h hoho',
  },
]

module.exports = { pats, variations }
