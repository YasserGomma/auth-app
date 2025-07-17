import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { setupSwagger } from "./swagger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin:
      configService.get("NODE_ENV") === "production"
        ? configService.get("CORS_ORIGIN")
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  });

  if (configService.get("NODE_ENV") !== "production") {
    setupSwagger(app);
  }

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port, "0.0.0.0");

  logger.log(`App running on port ${port}`);
  logger.log(`Environment: ${configService.get("NODE_ENV")}`);
  if (configService.get("NODE_ENV") !== "production") {
    logger.log(`API Docs: http://localhost:${port}/api`);
  }
}
bootstrap();
