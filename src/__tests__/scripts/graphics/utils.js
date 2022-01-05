import {degToRad, radToDeg} from "../../../scripts/graphics/utils";

describe("test graphics utils", () => {
  it("converts degrees to radials", () => {
    expect(degToRad(0)).toBe(0);
    expect(degToRad(90)).toBe(0.5 * Math.PI);
    expect(degToRad(180)).toBe(Math.PI);
    expect(degToRad(270)).toBe(1.5 * Math.PI);
    expect(degToRad(360)).toBe(2 * Math.PI);
    expect(degToRad(360 + 90)).toBe(2.5 * Math.PI);
  });

  it("converts radials to degrees", () => {
    expect(radToDeg(0)).toBe(0);
    expect(radToDeg(0.5 * Math.PI)).toBe(90);
    expect(radToDeg(Math.PI)).toBe(180);
    expect(radToDeg(1.5 * Math.PI)).toBe(270);
    expect(radToDeg(2 * Math.PI)).toBe(360);
    expect(radToDeg(2.5 * Math.PI)).toBe(360 + 90);
  });
});
