import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User - Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate user", async () => {
    const hashPassword = await hash("teste123", 8);

    await inMemoryUsersRepository.create({
      email: "teste@teste.com.br",
      name: "teste",
      password: hashPassword
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "teste@teste.com.br",
      password: "teste123"
    });

    expect(authenticatedUser).toHaveProperty("token");
  });

  it("should not be able to authenticate user when user non exists", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "nonexiste@user.com.br",
        password: "teste123"
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
});
