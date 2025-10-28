import colors from 'colors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperUser from './app/DB';
import { errorLogger, logger } from './app/shared/logger';
import { socketHelper } from './app/helpers/socketHelper';

let server: any;

async function main() {
  try {
    // create super admin
    seedSuperUser();

    mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    server = app.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(`♻️  Application listening on port:${config.port}`),
      );
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle unhandledRejection
  process.on('unhandledRejection', (error) => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandledRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
