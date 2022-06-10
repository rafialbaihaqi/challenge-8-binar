const AuthenticationController = require("../AuthenticationController");
const { JWT_SIGNATURE_KEY } = require("../../../config/application");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const {
  EmailNotRegisteredError,
  InsufficientAccessError,
  RecordNotFoundError,
  WrongPasswordError,
} = require("../../errors");

describe("AuthenticationController", () => {
  describe("#authorize", () => {
    it("should be authorize", async () => {
      const user = {
        id: 1,
        name: "rafi",
        email: "rafi@gmail.com",
        image: "rafi.jpg",
      };

      const mockRequest = {
        token: {
          header: {
            authorize: () => {
              return;
            },
          },
        },
        payload: jest.fn().mockReturnThis(),
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const err = new InsufficientAccessError();
      const error = {
        error: {
          name: err.name,
          message: err.message,
          details: err.details || null,
        },
      };

      const authenticationController = new AuthenticationController(
        "userModel",
        "roleModel",
        "bcrypt",
        "jwt"
      );
      const result = authenticationController.authorize(
        mockRequest,
        mockResponse
      );

      expect(result.body).toBeDefined();
      expect(result.status).toHaveBeenCalledWith(401);
      expect(result.json).toHaveBeenCalledWith(error);
    });
  });

  describe("#handleLogin", () => {
    it("should login", () => {});
  });

  describe("#handleRegister", () => {
    it("should register user", async () => {
      const payloadUser = {
        name: "rafi",
        email: "rafi@gmail.com",
        password: "0101garuda",
      };

      const mockRequest = {
        body: {
          payloadUser,
        },
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      const mockUser = new User({
        payloadUser,
      });
      const mockUserModel = {};
      const existingUser = (mockUserModel.findOne = jest
        .fn()
        .mockReturnValue(mockUser));
      const app = new AuthenticationController({
        userModel: mockUserModel,
      });
      const result = await app.handleRegister(mockRequest, mockResponse, next);

      expect(result).toEqual(existingUser);
    });

    it("should error", () => {});
  });

  describe("#handleGetUser", () => {
    it("should get user", () => {});
  });

  describe("#createTokenFromUser", () => {
    it("it should create new token", async () => {
      const user = {
        id: 1,
        name: "rafi",
        email: "rafi@gmail.com",
        image: "rafi.jpg",
      };

      const role = {
        id: 1,
        name: "ADMIN",
      };

      const mockUser = user;
      const mockRole = role;

      const token = jsonwebtoken.sign(
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.image,
          role: {
            id: mockRole.id,
            name: mockRole.name,
          },
        },
        JWT_SIGNATURE_KEY
      );

      const app = new AuthenticationController({
        jwt: jsonwebtoken,
      });

      const result = await app.createTokenFromUser(mockUser, mockRole);

      const hasil = jest.fn();
      hasil.mockReturnValue(result);

      expect(result).toEqual(token);
    });
  });

  describe("#decodeToken", () => {
    it("should decode token", async () => {
      const user = {
        id: 1,
        name: "rafi",
        email: "rafi@gmail.com",
        image: "rafi.jpg",
      };

      const role = {
        id: 1,
        name: "ADMIN",
      };

      const mockUser = user;
      const mockRole = role;

      const token = jsonwebtoken.sign(
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.image,
          role: {
            id: mockRole.id,
            name: mockRole.name,
          },
        },
        JWT_SIGNATURE_KEY
      );

      const decoded = jsonwebtoken.verify(token, JWT_SIGNATURE_KEY);
      const app = new AuthenticationController({
        jwt: jsonwebtoken,
      });
      const result = await app.decodeToken(token);

      expect(result).toEqual(decoded);
    });
  });

  describe("#encryptPassword", () => {
    it("should encrypt the password", async () => {
      const password = "0101garuda";
      const encrypt = bcrypt.hashSync(password, 10);

      const app = new AuthenticationController({
        jwt: jsonwebtoken,
        bcrypt: bcrypt,
      });
      const result = await app.encryptPassword(password);

      expect(result.slice(0, -53)).toEqual(encrypt.slice(0, -53));
    });
  });

  describe("#verifyPassword", () => {
    it("should verify password and encrypted one", async () => {
      const password = "0101garuda";

      const encrypt = bcrypt.hashSync(password, 0);

      const verif = bcrypt.compareSync(password, encrypt);

      const app = new AuthenticationController({
        jwt: jsonwebtoken,
        bcrypt: bcrypt,
      });
      const result = await app.verifyPassword(password, encrypt);

      expect(result).toEqual(verif);
    });
  });
});
