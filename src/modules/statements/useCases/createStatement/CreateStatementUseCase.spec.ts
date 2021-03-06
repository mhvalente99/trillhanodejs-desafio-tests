import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement - Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to create a new statement deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test-deposit@test.com.br",
      name: "Deposit Teste",
      password: "123"
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id!
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a new statement withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test-withdraw@test.com.br",
      name: "Withdraw Teste",
      password: "123"
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id!
    });

    const withdraw = await createStatementUseCase.execute({
      amount: 100,
      description: "Withdraw",
      type: OperationType.WITHDRAW,
      user_id: user.id!
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("should not be able to create statement when user non exists", async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 100,
        description: "user non exists",
        type: OperationType.DEPOSIT,
        user_id: "id"
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should not be able to create statement withdraw when insufficient funds", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test-withdraw@test.com.br",
      name: "Withdraw Teste",
      password: "123"
    });

    await expect(
      createStatementUseCase.execute({
        amount: 100,
        description: "insufficient funds",
        type: OperationType.WITHDRAW,
        user_id: user.id!
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
})
