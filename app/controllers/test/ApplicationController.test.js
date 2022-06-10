const ApplicationController = require("../ApplicationController");
const { NotFoundError } = require("../../errors");

describe("ApplicationController", () => {
  describe("#handleGetRoot", () => {
    it("should call res.status(200) and res.json with list of task instances", async () => {
      const mockRequest = {};

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const applicationController = new ApplicationController();

      applicationController.handleGetRoot(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "OK",
        message: "BCR API is up and running!",
      });
    });
  });

  describe("#handleNotFound", () => {
    it("should call res.status(404) and res.json error", async () => {
      const mockRequest = {
        method: jest.fn().mockReturnThis(),
        url: jest.fn().mockReturnThis(),
      };

      const err = new NotFoundError(mockRequest.method, mockRequest.url);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const applicationController = new ApplicationController();
      applicationController.handleNotFound(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details,
        },
      });
    });
  });

  // describe("handleNotFound", () => {
  //   it("should testing handleNotFound", async () => {
  //     const mockRequest = {};

  //     const mockResponse = {
  //       status_code: 404,

  //       status: () => {
  //         return {
  //           json: () => {
  //             return {
  //               error: {
  //                 name: "Error",
  //                 message: "Not found!",
  //                 details: {
  //                   method: "GET",
  //                   url: "http://localhost:8000/asd",
  //                 },
  //               },
  //             };
  //           },
  //         };
  //       },
  //     };

  //     const err = new NotFoundError("GET", "http://localhost:8000/asd");

  //     const applicationController = new ApplicationController();

  //     applicationController.handleNotFound(mockRequest, mockResponse);

  //     // Assertion
  //     expect(mockResponse.status_code).toEqual(404);
  //     expect(mockResponse.status().json()).toEqual({
  //       error: {
  //         name: err.name,
  //         message: err.message,
  //         details: err.details,
  //       },
  //     });
  //   });
  // });

  describe("#handleError", () => {
    it("should call res.status(500) and res.json with list of task instances", async () => {
      const mockRequest = {};

      const mockResponseHandleError = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const applicationController = new ApplicationController();
      const err = new Error("Not Found Bos");

      applicationController.handleError(
        err,
        mockRequest,
        mockResponseHandleError
      );

      expect(mockResponseHandleError.status).toHaveBeenCalledWith(500);
      expect(mockResponseHandleError.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details || null,
        },
      });
    });
  });

  describe("#getOffsetFromRequest", () => {
    it("should call res.status(500) and res.json with task instance", () => {
      const query = { page: 1, pageSize: 10 };

      const mockRequest = {
        query,
      };

      const offset = (query.page - 1) * query.pageSize;

      const applicationController = new ApplicationController();
      const result = applicationController.getOffsetFromRequest(mockRequest);

      expect(result).toBe(offset);
    });
  });

  describe("#buildPaginationObject", () => {
    it("should call res.status(500) and res.json with task instance", () => {
      const query = { page: 1, pageSize: 10 };
      const count = 0;

      const mockRequest = {
        query,
      };

      const pageCount = Math.ceil(count / query.pageSize);

      const kembali = [
        {
          page: query.page,
          pageCount,
          pageSize: query.pageSize,
          count,
        },
      ];

      const applicationController = new ApplicationController();
      const result = applicationController.buildPaginationObject(
        mockRequest,
        count
      );

      expect(result).toStrictEqual(kembali[0]);
    });
  });
});
