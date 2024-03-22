import { cleanData, sortArray } from "../backend/DataCleaner";
describe("DataCleaner functions", () => {
  describe("cleanData function", () => {
    test("should return a cleaned object based on the specified structure format", () => {
      const inputData = {
        unitNumber: "101",
        squareFeet: "900",
        unitPrice: "1500",
        extraField: "shouldBeRemoved",
      };

      const cleanedData = cleanData("Condo", inputData);

      expect(cleanedData).toEqual({
        unitNumber: "101",
        squareFeet: "900",
        unitPrice: "1500",
      });
      expect(cleanedData).not.toHaveProperty("extraField");
    });

    test("should return an empty object for invalid type", () => {
      const inputData = { name: "test" };
      const cleanedData = cleanData("InvalidType", inputData);
      expect(cleanedData).toEqual({});
    });
  });

  describe("sortArray function", () => {
    test("should sort an array of objects by the given key", () => {
      const arrayToSort = [
        { unitNumber: "103", squareFeet: "1100" },
        { unitNumber: "101", squareFeet: "900" },
        { unitNumber: "102", squareFeet: "1000" },
      ];

      const sortedArray = sortArray(arrayToSort, "unitNumber");
      expect(sortedArray).toEqual([
        { unitNumber: "101", squareFeet: "900" },
        { unitNumber: "102", squareFeet: "1000" },
        { unitNumber: "103", squareFeet: "1100" },
      ]);
    });

    test("should not change the order of objects with the same key value", () => {
      const arrayToSort = [
        { unitNumber: "101", squareFeet: "900" },
        { unitNumber: "101", squareFeet: "950" },
      ];

      const sortedArray = sortArray(arrayToSort, "unitNumber");
      expect(sortedArray).toEqual([
        { unitNumber: "101", squareFeet: "900" },
        { unitNumber: "101", squareFeet: "950" },
      ]);
    });
  });
});