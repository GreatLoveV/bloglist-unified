require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])

const app = require('./app')
const config = require('./utils/config')
const { info } = require('./utils/logger')

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})