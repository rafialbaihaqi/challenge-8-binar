const CarController = require("../CarController");
const { Car } = require("../../models");

describe("CarController", () => {
  describe("#handleListCar", () => {
    it("should test func handleListCar ", () => {});
  });

  describe("#handleGetCar", () => {
    it("sould test func handleGetCar", async () => {
      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        payloadCar,
      });
      const mockCarModel = {};

      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

      const app = new CarController({
        carModel: mockCarModel,
      });

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await app.handleGetCar(mockRequest, mockResponse);
      const app1 = await app.getCarFromRequest(mockRequest);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(app1);
    });
  });

  describe("#handleCreateCar", () => {
    it("sould test func handleCreateCar", async () => {
      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockModel = {};

      const mockTest = new Car(payloadCar);

      mockModel.create = jest.fn().mockReturnValue(mockTest);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockRequest = {
        body: {
          payloadCar,
        },
      };

      const app = new CarController({
        carModel: mockModel,
      });

      const hasil = mockModel.create(payloadCar);

      await app.handleCreateCar(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(hasil);
    });

    it("sould test error result", async () => {
      const err = new Error("Error Function");

      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockModel = {};

      new Car(payloadCar);

      mockModel.create = jest.fn().mockReturnValue(Promise.reject(err));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockRequest = {
        body: {
          payloadCar,
        },
      };

      const app = new CarController({
        carModel: mockModel,
      });
      mockModel.create(payloadCar);

      await app.handleCreateCar(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    });
  });

  describe("#getCarFromRequest", () => {
    it("should test func getCarFromRequest ", async () => {
      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        payloadCar,
      });
      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const carcontroller = new CarController({
        carModel: mockCarModel,
      });
      const result = await carcontroller.getCarFromRequest(mockRequest);

      expect(result).toStrictEqual(mockCar);
    });
  });

  describe("#handleDeleteCar", () => {
    it("should test func handleDeleteCar", async () => {
      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        payloadCar,
      });

      const mockCarModel = {};

      mockCarModel.destroy = jest.fn().mockReturnValue(mockCar);

      const mockResponse = {};

      mockResponse.status = jest.fn().mockReturnThis();

      mockResponse.end = jest.fn().mockReturnThis();

      const carcontroller = new CarController({
        carModel: mockCarModel,
      });
      await carcontroller.handleDeleteCar(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe("#handleUpdateCar", () => {
    it("should test func handleUpdateCar", async () => {
      const payloadCar = {
        name: "brio",
        price: 50000,
        size: "large",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg",
        isCurrentlyRented: false,
      };

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        payloadCar,
      });
      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const app = new CarController({
        carModel: mockCarModel,
      });

      const car = await app.getCarFromRequest(mockRequest, mockResponse);

      await car.update({
        name: "BMW",
        price: 1000,
        size: "small",
        image: "rafi.jpg",
        isCurrentlyRented: false,
      });

      await app.handleUpdateCar(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json), toHaveBeenCalledWith(car);
    });
  });
});
