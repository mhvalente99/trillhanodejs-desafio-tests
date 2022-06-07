import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User - Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@teste.com.br",
      name: "teste",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  })

  it("should not be able to create a new user with same email", async () => {
    await createUserUseCase.execute({
      email: "sameemail@teste.com.br",
      name: "teste",
      password: "1234"
    });

    await expect(
      createUserUseCase.execute({
        email: "sameemail@teste.com.br",
        name: "teste same",
        password: "1234"
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  })
})
