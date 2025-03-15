import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppValidationPipe } from "./pipes/validation.pipe";

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)).setGlobalPrefix("/api");
  // const envVars = process.env;

  app.useGlobalPipes(new AppValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 3500);
}

bootstrap();
