const uriBase = process.env.NODE_ENV !== 'production' ? ("http://localhost:3001") 
:
("https://crud-hiking-tracker.herokuapp.com")
// const uriBase = "https://crud-hiking-tracker.herokuapp.com"
const api = "/api/v1"

module.exports.uriBase= uriBase
module.exports.api = api