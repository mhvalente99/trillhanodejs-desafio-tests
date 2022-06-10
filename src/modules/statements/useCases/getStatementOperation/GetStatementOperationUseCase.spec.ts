import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation - Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to return statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "statement@test.com.br",
      name: "Statement Operation",
      password: "123"
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Test Statement",
      type: OperationType.DEPOSIT,
      user_id: user.id!
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!
    });

    expect(statementOperation).toHaveProperty("id");
  });
});
