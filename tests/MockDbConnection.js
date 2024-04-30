import { jest } from "@jest/globals";

export default class MockDbConnection {
  constructor() {
    this.models = {
      Task: {
        findById: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        findOneAndDelete: jest.fn(),
        insertOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      },
      User: {
        findById: jest.fn(),
        insertOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      },
    };
  }

  model(name) {
    return this.models[name];
  }
}
