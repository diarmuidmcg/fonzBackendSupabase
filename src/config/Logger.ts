import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
// import CloudWatchTransport from 'winston-cloudwatch';
// const WinstonCloudWatch = require('winston-cloudwatch')

winston.loggers.add('access-log', {
  format: winston.format.uncolorize(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    //  new WinstonCloudWatch({
    //   name: "Cloudwatch Logs",
    //   logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    //   logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
    //   awsRegion: process.env.CLOUDWATCH_AWS_REGION,
    //   messageFormatter: function (item) {
    //     return (
    //       item.level + ": " + item.message + " " + JSON.stringify(item.meta)
    //     );
    //   },
    // }),
  ],
});
const logg = winston.loggers.get('access-log');

module.exports = logg;
