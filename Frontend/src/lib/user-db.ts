// Shared user database (in-memory for now, replace with real DB in production)
export interface User {
  id: number;
  email: string;
  password?: string;
  githubId?: string;
  name?: string;
}

class UserDatabase {
  private users: User[] = [];

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findUserByGithubId(githubId: string): User | undefined {
    return this.users.find((u) => u.githubId === githubId);
  }

  getAllUsers(): User[] {
    return this.users;
  }
}

export const userDatabase = new UserDatabase();
