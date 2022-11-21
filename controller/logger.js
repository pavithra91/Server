
const {createLogger, transports, format} = require('winston')

const systemLogger = createLogger({
    transports:[
        new transports.File({
            filename:'./Logs/sysLog.log',
            level: 'info',
            format: format.combine(format.timestamp(),format.json())
        })
    ]
})



module.exports = {systemLogger}