import reportWebVitals from "../reportWebVitals";

jest.mock("web-vitals", () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe("reportWebVitals", () => {
  it("should call all web vitals functions if onPerfEntry is a function", () => {
    const onPerfEntry = jest.fn();
    reportWebVitals(onPerfEntry);

    expect(import("web-vitals")).toHaveBeenCalled();
    expect(require("web-vitals").getCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(require("web-vitals").getFID).toHaveBeenCalledWith(onPerfEntry);
    expect(require("web-vitals").getFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(require("web-vitals").getLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(require("web-vitals").getTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  it("should not call any web vitals functions if onPerfEntry is not a function", () => {
    const onPerfEntry = null;
    reportWebVitals(onPerfEntry);
    expect(import("web-vitals")).not.toHaveBeenCalled();
    expect(require("web-vitals").getCLS).not.toHaveBeenCalled();
    expect(require("web-vitals").getFID).not.toHaveBeenCalled();
    expect(require("web-vitals").getFCP).not.toHaveBeenCalled();
    expect(require("web-vitals").getLCP).not.toHaveBeenCalled();
    expect(require("web-vitals").getTTFB).not.toHaveBeenCalled();
  });
});
