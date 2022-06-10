import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance - Use Case", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "balance@test.com.br",
      name: "Test Balance",
      password: "123"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id!
    })

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });
});
