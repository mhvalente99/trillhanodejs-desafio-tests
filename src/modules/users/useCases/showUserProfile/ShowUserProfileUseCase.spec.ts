import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show User Profile - Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "user",
      email: "user@teste.com.br",
      password: "123"
    });

    const user = await showUserProfileUseCase.execute(id!);

    expect(user).toHaveProperty("id");
  })
})
