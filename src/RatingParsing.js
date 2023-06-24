// import fetch from 'node-fetch'
const fetch = require('node-fetch')

module.exports.RatingParsing = async() => {
  const params = new URLSearchParams()
  params.append('seenform', 'yes')
  params.append('fm', 'Рудковский')
  params.append('im', 'Илья')
  params.append('kod', '4699')
  params.append('ok', '>>>')

  const response = await fetch('http://ntgmk.ru/program/poisk1.php', {
    method: 'POST',
    body: params,
    // headers: {'Content-Type': 'application/json'}
  })

  const ratings = Array()

  return response.text().then(d => {
    // console.log(d)
    const table = d.match(/Успеваемость по дисциплинам<\/td><\/tr>\r\n.*<\/TABLE>/gms)
    const values = Array.from(table[0].matchAll(
      /<td[ ]+class=.{5,6}>([А-яA-z .\-0-9]{0,100})<\/font>/gms
    ))
    let part = Array()
    let counter = 1

    values.forEach(element => {
      part.push(element[1])

      // if (ratings.length == 60) return
      if (counter++ > 15) {
        // console.log(part)
        // console.log(JSON.stringify(part))
        ratings.push(part)
        part = Array()
        counter = 1
      }
    })

    // console.log(ratings)
    return ratings
  }).catch(console.error)
  .finally(() => ratings)
}