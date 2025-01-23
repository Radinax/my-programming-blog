---
title: "Nest JS Validations"
description: "Adding validations to the CRUD we did in the previous article"
category: ["typescript", "backend", "node"]
pubDate: "2025-01-22"
published: true
---

## Table of contents

---

# Introduction

We're going to add validations to the CRUD we did in the previous article and see the before and afters of the code.

---

# Adding the validation libraries

Install the `class-validator` and `class-transformer` packages:

```bash
npm install class-validator class-transformer
```

---

# Enable Global Validation

We need to update the `main.ts` file to enable global validation using NestJS's `ValidationPipe`:

```typescript
// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Enable global validation
  await app.listen(3000);
}
bootstrap();
```

---

# Create a DTO (Data Transfer Object) for Validation

DTOs are used to define the shape of incoming data and apply validation rules. Create a `dto` folder inside the `users` module and add a `create-user.dto.ts` file:

```typescript
// src/users/dto/create-user.dto.ts
import { IsString, IsInt, Min, Max } from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;
}
```

Similarly, create an `update-user.dto.ts` file for updating users:

```typescript
// src/users/dto/update-user.dto.ts
import { IsString, IsInt, Min, Max, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;
}
```

---

# Update the Controller to Use DTOs

Modify the `users.controller.ts` file to use the DTOs for validation:

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  // We add the create user dto
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto.name, createUserDto.age);
  }
  // and the edit user dto
  @Put(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto.name, updateUserDto.age);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.usersService.delete(+id);
  }
}
```

The difference here is that we had before:

```typescript
@Post()
  async create(@Body() body: { name: string; age: number }) {
    return this.usersService.create(body.name, body.age);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name: string; age: number },
  ) {
    return this.usersService.update(+id, body.name, body.age);
  }
```

---

# Update the Service to Handle Partial Updates

Since the `UpdateUserDto` allows partial updates, modify the `users.service.ts` file to handle cases where `name` or `age` might be `undefined`:

```typescript
// src/users/users.service.ts
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const sql = "SELECT * FROM users";
    return this.databaseService.query(sql);
  }

  async findOne(id: number) {
    const sql = "SELECT * FROM users WHERE id = ?";
    return this.databaseService.query(sql, [id]);
  }

  async create(name: string, age: number) {
    const sql = "INSERT INTO users (name, age) VALUES (?, ?)";
    await this.databaseService.run(sql, [name, age]);
    return { name, age };
  }

  async update(id: number, name?: string, age?: number) {
    let sql = "UPDATE users SET ";
    const params = [];

    if (name !== undefined) {
      sql += "name = ?";
      params.push(name);
    }

    if (age !== undefined) {
      if (name !== undefined) sql += ", ";
      sql += "age = ?";
      params.push(age);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await this.databaseService.run(sql, params);
    return { id, name, age };
  }

  async delete(id: number) {
    const sql = "DELETE FROM users WHERE id = ?";
    await this.databaseService.run(sql, [id]);
    return { id };
  }
}
```

---

# Test the Validations

Start your application:

```bash
npm run start:dev
```

Use tools like Postman or `curl` to test the API with invalid data. For example:

## Invalid Request (Missing `name`):

```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"age": 25}'
```

**Response:**

```json
{
  "statusCode": 400,
  "message": ["name must be a string"],
  "error": "Bad Request"
}
```

## Invalid Request (`age` out of range):

```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "John", "age": 150}'
```

**Response:**

```json
{
  "statusCode": 400,
  "message": ["age must not be greater than 120"],
  "error": "Bad Request"
}
```

---

## Customize Validation Messages (Optional)

You can customize validation error messages by passing options to the `ValidationPipe` in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances
    disableErrorMessages: false, // Enable detailed error messages
  })
);
```

---

# Conclusion

In Express apps we needed to use `validator` for validations, so using this library and its abstractions improves the reliability and security of our applications. With the `class-validator` library, you can easily define and enforce validation rules for your DTOs.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
